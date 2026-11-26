param([string]$BaseUrl='http://127.0.0.1:30080')
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Net.Http
$handler=New-Object System.Net.Http.HttpClientHandler
$handler.UseProxy=$false
$ticketHttp=New-Object System.Net.Http.HttpClient($handler)
$ticketHttp.Timeout=[TimeSpan]::FromSeconds(20)
$marker='test-ticket-'+[guid]::NewGuid().ToString('N')
$probeStarted=$false

function Read-TicketApi([string]$Path) {
    return $ticketHttp.GetStringAsync($BaseUrl.TrimEnd('/')+'/'+$Path).GetAwaiter().GetResult() | ConvertFrom-Json
}
function Booking-Content([int]$ShowId,[int[]]$SeatIds,[string]$Key) {
    $body=@{userId=2;userType=1;showId=$ShowId;seatIds=@($SeatIds);requestId=$Key} | ConvertTo-Json -Compress
    return [System.Net.Http.StringContent]::new($body,[System.Text.Encoding]::UTF8,'application/json')
}
function Book-Tickets([int]$ShowId,[int[]]$SeatIds,[string]$Key) {
    $content=Booking-Content $ShowId $SeatIds $Key
    try {
        $response=$ticketHttp.PostAsync($BaseUrl.TrimEnd('/')+'/ticket_orders',$content).GetAwaiter().GetResult()
        try {
            $body=$response.Content.ReadAsStringAsync().GetAwaiter().GetResult() | ConvertFrom-Json
            return @{status=[int]$response.StatusCode;body=$body}
        } finally { $response.Dispose() }
    } finally { $content.Dispose() }
}

try {
    $show=Read-TicketApi 'ticket_show?id=1'
    $free=@(Read-TicketApi 'ticket_seats?showId=1' | Where-Object {$_.state -eq 1})
    if ($free.Count -lt 3) { throw 'Need three available seats in demo show 1' }
    $selection=@([int]$free[0].id,[int]$free[1].id)
    $probeStarted=$true
    $first=Book-Tickets 1 $selection ($marker+'-multi')
    if ($first.status -ne 200 -or -not $first.body.id) { throw ('Booking failed: '+($first | ConvertTo-Json -Compress)) }
    $replay=Book-Tickets 1 $selection ($marker+'-multi')
    if ($replay.status -ne 200 -or $replay.body.id -ne $first.body.id) { throw 'Idempotent retry failed' }
    Write-Host 'PASS: multi-seat order saved, retry returns same order'
    $orders=@(Read-TicketApi 'ticket_orders?id=2&type=1')
    if (-not ($orders | Where-Object {$_.id -eq $first.body.id})) { throw 'Own order is missing' }
    $other=@(Read-TicketApi 'ticket_orders?id=1&type=1')
    $role=@(Read-TicketApi 'ticket_orders?id=2&type=2')
    if (($other | Where-Object {$_.id -eq $first.body.id}) -or ($role | Where-Object {$_.id -eq $first.body.id})) { throw 'Account isolation failed' }
    Write-Host 'PASS: ticket list includes the purchase and isolates accounts/roles'
    $conflict=Book-Tickets 1 @([int]$free[0].id) ($marker+'-conflict')
    if ($conflict.status -ne 409) { throw 'Sold seat was accepted twice' }
    $otherShow=Book-Tickets 2 @([int]$free[0].id) ($marker+'-other-show')
    if ($otherShow.status -ne 200) { throw 'Different shows did not have separate inventory' }
    Write-Host 'PASS: sold seat rejected in same show; available in another show'

    $raceSeat=@([int]$free[2].id)
    $contentA=Booking-Content 1 $raceSeat ($marker+'-race-a')
    $contentB=Booking-Content 1 $raceSeat ($marker+'-race-b')
    try {
        $taskA=$ticketHttp.PostAsync($BaseUrl.TrimEnd('/')+'/ticket_orders',$contentA)
        $taskB=$ticketHttp.PostAsync($BaseUrl.TrimEnd('/')+'/ticket_orders',$contentB)
        $responseA=$taskA.GetAwaiter().GetResult()
        $responseB=$taskB.GetAwaiter().GetResult()
        try {
            $codes=@([int]$responseA.StatusCode,[int]$responseB.StatusCode) | Sort-Object
            if ($codes[0] -ne 200 -or $codes[1] -ne 409) { throw "Concurrent booking failed: $codes" }
        } finally { $responseA.Dispose(); $responseB.Dispose() }
    } finally { $contentA.Dispose(); $contentB.Dispose() }
    Write-Host 'PASS: concurrent same-seat requests return one success and one conflict'
}
finally {
    if ($probeStarted) {
        & kubectl --context docker-desktop -n cinema exec deployment/mysql -- mysql -uroot -p123456 cinema -e "DELETE FROM ticket_order WHERE user_id=2 AND user_type=1 AND request_id LIKE '$marker%';"
        if ($LASTEXITCODE -ne 0) { Write-Warning "Verification cleanup failed; request prefix: $marker" }
        else { Write-Host 'Verification orders cleaned up; original seats/orders preserved.' }
    }
    $ticketHttp.Dispose()
    $handler.Dispose()
}
