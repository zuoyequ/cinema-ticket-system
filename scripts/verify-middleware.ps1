param([switch]$FaultRecovery, [switch]$Kubernetes)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$previousLocation = Get-Location
$marker = 'test-' + [guid]::NewGuid().ToString('N').Substring(0, 10)
$testOrderId = 0
$brokerStopped = $false
$cacheStopped = $false

function Query-Cinema([string]$Sql) {
    if ($Kubernetes) {
        $result = & kubectl --context docker-desktop -n cinema exec deployment/mysql -- mysql -uroot -p123456 cinema -N -B -e $Sql 2>$null
    } else {
        $result = & docker compose exec -T mysql mysql -uroot -p123456 cinema -N -B -e $Sql 2>$null
    }
    if ($LASTEXITCODE -ne 0) { throw 'MySQL verification query failed' }
    return $result
}

function Get-Cinema([string]$Path) {
    # WebClient.Proxy=null also works in Windows PowerShell 5.1.
    $web = New-Object System.Net.WebClient
    $web.Proxy = $null
    $web.Encoding = [System.Text.Encoding]::UTF8
    $apiPort = if ($Kubernetes) { 30080 } else { 8080 }
    try { return $web.DownloadString("http://127.0.0.1:$apiPort/" + $Path) | ConvertFrom-Json }
    finally { $web.Dispose() }
}

try {
    Set-Location -LiteralPath $projectRoot
    if ($Kubernetes -and $FaultRecovery) { throw 'FaultRecovery mode currently supports Compose only.' }
    $products = @(Get-Cinema 'get_shopping')
    $again = @(Get-Cinema 'get_shopping')
    if ($products.Count -eq 0 -or $again.Count -ne $products.Count) { throw 'Product cache check failed' }
    Write-Host "PASS: product query/cache ($($products.Count) products)"

    if ($FaultRecovery) {
        & docker compose stop memcached
        if ($LASTEXITCODE -ne 0) { throw 'Cannot stop cache for verification' }
        $cacheStopped = $true
        if (@(Get-Cinema 'get_shopping').Count -ne $products.Count) { throw 'Cache outage fallback failed' }
        Write-Host 'PASS: Memcached outage falls back to MySQL'
        & docker compose start memcached
        if ($LASTEXITCODE -ne 0) { throw 'Cannot restart cache' }
        $cacheStopped = $false
        & docker compose stop kafka
        if ($LASTEXITCODE -ne 0) { throw 'Cannot stop Kafka for verification' }
        $brokerStopped = $true
    }

    # Only creates a local demo order. No payment service is called.
    $userId = [int](Query-Cinema 'SELECT id FROM `user` ORDER BY id LIMIT 1')
    $addressId = [int](Query-Cinema "SELECT id FROM add_address WHERE user_id=$userId ORDER BY id LIMIT 1")
    $productId = [int]$products[0].id
    $result = Get-Cinema "insert_shoppingorder?id=$userId&index=$productId&address_id=$addressId&isDefault=false&isBuy=$marker"
    if ($result -ne 1) { throw 'Order creation failed' }
    $testOrderId = [int](Query-Cinema "SELECT id FROM shopping_order WHERE isBuy='$marker'")
    if ($testOrderId -le 0) { throw 'Cannot find verification order' }

    if ($FaultRecovery) {
        $pending = [int](Query-Cinema "SELECT COUNT(*) FROM order_event_outbox WHERE order_id=$testOrderId AND sent_at IS NULL")
        if ($pending -ne 1) { throw 'Order event was not retained during Kafka outage' }
        Write-Host 'PASS: order committed and event retained while Kafka is stopped'
        & docker compose start kafka
        if ($LASTEXITCODE -ne 0) { throw 'Cannot restart Kafka' }
        $brokerStopped = $false
    }

    $delivered = $false
    for ($attempt = 0; $attempt -lt 45; $attempt++) {
        $count = [int](Query-Cinema "SELECT COUNT(*) FROM order_notification WHERE order_id=$testOrderId")
        $pending = [int](Query-Cinema "SELECT COUNT(*) FROM order_event_outbox WHERE order_id=$testOrderId AND sent_at IS NULL")
        if ($count -eq 1 -and $pending -eq 0) { $delivered = $true; break }
        Start-Sleep -Seconds 2
    }
    if (-not $delivered) { throw 'Kafka notification did not arrive' }
    $notifications = @(Get-Cinema "order_notifications?id=$userId")
    if (-not ($notifications | Where-Object { $_.orderId -eq $testOrderId })) { throw 'Notification API failed' }
    Write-Host 'PASS: Kafka published/consumed order event and notification API returned it'
}
finally {
    if ($brokerStopped) { & docker compose start kafka }
    if ($cacheStopped) { & docker compose start memcached }
    if ($testOrderId -gt 0) {
        Query-Cinema "DELETE FROM order_notification WHERE order_id=$testOrderId; DELETE FROM order_event_outbox WHERE order_id=$testOrderId; DELETE FROM shopping_order WHERE id=$testOrderId AND isBuy='$marker';" | Out-Null
        Write-Host 'Verification order cleaned up; existing business records preserved.'
    }
    Set-Location -LiteralPath $previousLocation
}
