param([switch]$SkipBuild)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$previousLocation = Get-Location
try {
    Set-Location -LiteralPath $projectRoot
    # 只向本机 Docker Desktop 集群部署，避免误操作其他 kubeconfig 上下文。
    & kubectl --context docker-desktop get nodes
    if ($LASTEXITCODE -ne 0) {
        throw 'Enable Docker Desktop Kubernetes (kubeadm/single node) and wait for Ready first.'
    }
    if (-not $SkipBuild) {
        & docker compose build backend
        if ($LASTEXITCODE -ne 0) { throw 'Backend image build failed' }
    }
    $imageTag = 'cinema-backend:local-' + (Get-Date -Format 'yyyyMMddHHmmss')
    & docker tag cinema-backend:latest $imageTag
    if ($LASTEXITCODE -ne 0) { throw 'Local backend image is missing' }
    $manifest = (& kubectl kustomize .) -join "`n"
    if ($LASTEXITCODE -ne 0) { throw 'Kustomize rendering failed' }
    # 每次部署使用新标签，避免 latest + IfNotPresent 导致旧代码未更新。
    $manifest = $manifest.Replace('image: cinema-backend:latest', 'image: ' + $imageTag)
    $manifest | & kubectl --context docker-desktop apply -f -
    if ($LASTEXITCODE -ne 0) { throw 'Kubernetes apply failed' }
    & kubectl --context docker-desktop -n cinema rollout status deployment/backend --timeout=300s
    if ($LASTEXITCODE -ne 0) {
        & kubectl --context docker-desktop -n cinema get pods
        throw 'Backend is not Ready; inspect pod events and logs.'
    }
    & kubectl --context docker-desktop -n cinema get pods,services,pvc
    Write-Host 'Kubernetes backend: http://localhost:30080/get_moviecontent3'
    Write-Host 'To use the unchanged mini-program URL: stop Compose, then port-forward service/backend 8080:8080.'
}
finally {
    Set-Location -LiteralPath $previousLocation
}
