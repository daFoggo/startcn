param(
    [string]$BackendPath = "..\anno-bot-be",
    [ValidateSet("hybrid", "cloudflared", "localtunnel", "ngrok")]
    [string]$TunnelProvider = "ngrok",
    [string]$NgrokAuthConfig = "$env:LOCALAPPDATA\ngrok\ngrok.yml",
    [switch]$SkipEnvUpdate,
    [switch]$SkipTelegramWebhookSetup,
    [switch]$NoBackendBuild
)

$ErrorActionPreference = "Stop"

$frontendRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$backendRoot = Resolve-Path (Join-Path $frontendRoot $BackendPath)
$ngrokConfig = Join-Path $frontendRoot "ops\ngrok.dev.yml"

function Assert-Command {
    param([string]$Command)

    if (-not (Get-Command $Command -ErrorAction SilentlyContinue)) {
        throw "Required command '$Command' was not found on PATH."
    }
}

function Start-ManagedProcess {
    param(
        [string]$Name,
        [string]$Command,
        [string]$WorkingDirectory,
        [string]$LogPath
    )

    $startInfo = [System.Diagnostics.ProcessStartInfo]::new()
    $startInfo.FileName = "cmd.exe"
    $startInfo.Arguments = "/d /s /c `"$Command`""
    $startInfo.WorkingDirectory = $WorkingDirectory
    $startInfo.RedirectStandardOutput = $true
    $startInfo.RedirectStandardError = $true
    $startInfo.UseShellExecute = $false
    $startInfo.CreateNoWindow = $true

    $process = [System.Diagnostics.Process]::new()
    $process.StartInfo = $startInfo
    $process.EnableRaisingEvents = $true

    [void]$process.Start()

    if ($LogPath) {
        New-Item -ItemType File -Force -Path $LogPath | Out-Null
    }

    $eventData = @{
        Name = $Name
        LogPath = $LogPath
    }

    $stdout = Register-ObjectEvent -InputObject $process -EventName OutputDataReceived -MessageData $eventData -Action {
        if ($EventArgs.Data) {
            Write-Host "[$($Event.MessageData.Name)] $($EventArgs.Data)"
            if ($Event.MessageData.LogPath) {
                Add-Content -Path $Event.MessageData.LogPath -Value $EventArgs.Data
            }
        }
    }
    $stderr = Register-ObjectEvent -InputObject $process -EventName ErrorDataReceived -MessageData $eventData -Action {
        if ($EventArgs.Data) {
            Write-Host "[$($Event.MessageData.Name)] $($EventArgs.Data)" -ForegroundColor DarkYellow
            if ($Event.MessageData.LogPath) {
                Add-Content -Path $Event.MessageData.LogPath -Value $EventArgs.Data
            }
        }
    }

    $process.BeginOutputReadLine()
    $process.BeginErrorReadLine()

    return [pscustomobject]@{
        Name = $Name
        Process = $process
        Events = @($stdout, $stderr)
    }
}

function Stop-ManagedProcesses {
    param([array]$Processes)

    foreach ($managed in $Processes) {
        if ($null -ne $managed.Process -and -not $managed.Process.HasExited) {
            Write-Host "Stopping $($managed.Name)..."
            & taskkill.exe /PID $managed.Process.Id /T /F | Out-Null
            [void]$managed.Process.WaitForExit(5000)
        }

        foreach ($event in $managed.Events) {
            Unregister-Event -SubscriptionId $event.Id -ErrorAction SilentlyContinue
            Remove-Job -Id $event.Id -Force -ErrorAction SilentlyContinue
        }
    }
}

function Wait-ForNgrokTunnels {
    param(
        [int]$TimeoutSeconds = 45
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    do {
        try {
            $response = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels" -TimeoutSec 2
            $frontendTunnel = $response.tunnels | Where-Object { $_.name -eq "anno-bot-fe" -and $_.public_url -like "https://*" } | Select-Object -First 1
            $backendTunnel = $response.tunnels | Where-Object { $_.name -eq "anno-bot-be" -and $_.public_url -like "https://*" } | Select-Object -First 1

            if ($frontendTunnel -and $backendTunnel) {
                return [pscustomobject]@{
                    FrontendUrl = $frontendTunnel.public_url.TrimEnd("/")
                    BackendUrl = $backendTunnel.public_url.TrimEnd("/")
                }
            }
        }
        catch {
            Start-Sleep -Milliseconds 500
        }

        Start-Sleep -Milliseconds 500
    } while ((Get-Date) -lt $deadline)

    throw "Timed out waiting for ngrok tunnels. Check ngrok auth/config and port 4040 availability."
}

function Wait-ForCloudflaredTunnel {
    param(
        [string]$Name,
        [string]$LogPath,
        [int]$TimeoutSeconds = 60
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    $pattern = "https://[-a-z0-9]+\.trycloudflare\.com"
    do {
        if (Test-Path $LogPath) {
            $content = Get-Content -Path $LogPath -Raw
            if ($null -eq $content) {
                $content = ""
            }
            $match = [regex]::Match($content, $pattern)
            if ($match.Success) {
                return $match.Value.TrimEnd("/")
            }
        }

        Start-Sleep -Milliseconds 500
    } while ((Get-Date) -lt $deadline)

    throw "Timed out waiting for $Name cloudflared tunnel URL."
}

function Wait-ForLocaltunnelTunnel {
    param(
        [string]$Name,
        [string]$LogPath,
        [int]$TimeoutSeconds = 60
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    $pattern = "https://[-a-z0-9]+\.loca\.lt"
    do {
        if (Test-Path $LogPath) {
            $content = Get-Content -Path $LogPath -Raw
            if ($null -eq $content) {
                $content = ""
            }
            $match = [regex]::Match($content, $pattern)
            if ($match.Success) {
                return $match.Value.TrimEnd("/")
            }
        }

        Start-Sleep -Milliseconds 500
    } while ((Get-Date) -lt $deadline)

    throw "Timed out waiting for $Name localtunnel URL."
}

function Set-DotEnvValue {
    param(
        [string]$Path,
        [string]$Key,
        [string]$Value
    )

    $line = "$Key=$Value"
    if (-not (Test-Path $Path)) {
        Set-Content -Path $Path -Value $line
        return
    }

    $content = Get-Content -Path $Path
    $updated = $false
    $next = foreach ($existingLine in $content) {
        if ($existingLine -match "^\s*$([regex]::Escape($Key))=") {
            $updated = $true
            $line
        }
        else {
            $existingLine
        }
    }

    if (-not $updated) {
        $next += $line
    }

    Set-Content -Path $Path -Value $next
}

function Get-DotEnvValue {
    param(
        [string]$Path,
        [string]$Key
    )

    if (-not (Test-Path $Path)) {
        return $null
    }

    $match = Get-Content -Path $Path | Where-Object { $_ -match "^\s*$([regex]::Escape($Key))=" } | Select-Object -First 1
    if (-not $match) {
        return $null
    }

    $value = ($match -split "=", 2)[1].Trim()
    if (
        ($value.StartsWith('"') -and $value.EndsWith('"')) -or
        ($value.StartsWith("'") -and $value.EndsWith("'"))
    ) {
        return $value.Substring(1, $value.Length - 2)
    }

    return $value
}

function Set-TelegramWebhook {
    param(
        [string]$BackendEnvPath,
        [string]$WebhookUrl
    )

    $botToken = Get-DotEnvValue -Path $BackendEnvPath -Key "TELEGRAM_BOT_TOKEN"
    if (-not $botToken) {
        Write-Host "Skipped Telegram setWebhook because TELEGRAM_BOT_TOKEN is empty." -ForegroundColor DarkYellow
        return
    }

    $secretToken = Get-DotEnvValue -Path $BackendEnvPath -Key "TELEGRAM_WEBHOOK_SECRET_TOKEN"

    # 1. Update webhook with callback_query allowed
    $webhookBody = @{
        url = $WebhookUrl
        allowed_updates = @("message", "callback_query")
        drop_pending_updates = $true
    }

    if ($secretToken) {
        $webhookBody.secret_token = $secretToken
    }

    try {
        $webhookJson = ConvertTo-Json $webhookBody -Depth 5
        $response = Invoke-RestMethod -Method Post -Uri "https://api.telegram.org/bot$botToken/setWebhook" -ContentType "application/json" -Body $webhookJson -TimeoutSec 15
        if ($response.ok) {
            Write-Host "Telegram webhook was updated with allowed_updates=[message, callback_query]." -ForegroundColor Green
        }
        else {
            Write-Host "Telegram setWebhook returned ok=false." -ForegroundColor DarkYellow
        }
    }
    catch {
        Write-Host "Telegram setWebhook failed: $($_.Exception.Message)" -ForegroundColor DarkYellow
    }

    # 2. Register autocomplete commands
    $commandsBody = @{
        commands = @(
            @{ command = "start"; description = "Welcome message and web app link" },
            @{ command = "dashboard"; description = "Access dashboard and active projects" },
            @{ command = "label_demo"; description = "Review annotation examples" },
            @{ command = "help"; description = "Get help and instructions" }
        )
    }

    try {
        $commandsJson = ConvertTo-Json $commandsBody -Depth 5
        $response = Invoke-RestMethod -Method Post -Uri "https://api.telegram.org/bot$botToken/setMyCommands" -ContentType "application/json" -Body $commandsJson -TimeoutSec 15
        if ($response.ok) {
            Write-Host "Telegram bot commands registered successfully." -ForegroundColor Green
        }
        else {
            Write-Host "Telegram setMyCommands returned ok=false." -ForegroundColor DarkYellow
        }
    }
    catch {
        Write-Host "Telegram setMyCommands failed: $($_.Exception.Message)" -ForegroundColor DarkYellow
    }
}

Assert-Command "pnpm"
Assert-Command "docker"
if ($TunnelProvider -eq "ngrok") {
    Assert-Command "ngrok"
    if (-not (Test-Path $NgrokAuthConfig)) {
        throw "Ngrok auth config was not found at '$NgrokAuthConfig'. Pass -NgrokAuthConfig or run ngrok config add-authtoken."
    }
}
else {
    Assert-Command "npx"
}

$managedProcesses = @()

try {
    if ($TunnelProvider -eq "ngrok") {
        $managedProcesses += Start-ManagedProcess -Name "ngrok" -Command "ngrok start --all --config `"$NgrokAuthConfig`" --config `"$ngrokConfig`"" -WorkingDirectory $frontendRoot
        $urls = Wait-ForNgrokTunnels

        $frontendUrl = $urls.FrontendUrl
        $backendUrl = $urls.BackendUrl
    }
    else {
        $logRoot = Join-Path $frontendRoot ".codex"
        New-Item -ItemType Directory -Force -Path $logRoot | Out-Null
        $frontendTunnelLog = Join-Path $logRoot "cloudflared-fe.log"
        $backendTunnelLog = if ($TunnelProvider -eq "localtunnel" -or $TunnelProvider -eq "hybrid") {
            Join-Path $logRoot "localtunnel-be.log"
        }
        else {
            Join-Path $logRoot "cloudflared-be.log"
        }

        if ($TunnelProvider -eq "localtunnel") {
            $frontendSubdomain = "anno-bot-fe-" + (Get-Random -Minimum 100000 -Maximum 999999)
            $managedProcesses += Start-ManagedProcess -Name "tunnel:fe" -Command "pnpm dlx localtunnel --port 3000 --local-host 127.0.0.1 --subdomain $frontendSubdomain" -WorkingDirectory $frontendRoot -LogPath $frontendTunnelLog
            $frontendUrl = Wait-ForLocaltunnelTunnel -Name "frontend" -LogPath $frontendTunnelLog
        }
        else {
            $managedProcesses += Start-ManagedProcess -Name "tunnel:fe" -Command "npx --yes cloudflared tunnel --url http://localhost:3000 --no-autoupdate" -WorkingDirectory $frontendRoot -LogPath $frontendTunnelLog
            $frontendUrl = Wait-ForCloudflaredTunnel -Name "frontend" -LogPath $frontendTunnelLog
        }

        if ($TunnelProvider -eq "localtunnel" -or $TunnelProvider -eq "hybrid") {
            $backendSubdomain = "anno-bot-be-" + (Get-Random -Minimum 100000 -Maximum 999999)
            $managedProcesses += Start-ManagedProcess -Name "tunnel:be" -Command "pnpm dlx localtunnel --port 8000 --local-host 127.0.0.1 --subdomain $backendSubdomain" -WorkingDirectory $frontendRoot -LogPath $backendTunnelLog
            $backendUrl = Wait-ForLocaltunnelTunnel -Name "backend" -LogPath $backendTunnelLog
        }
        else {
            $managedProcesses += Start-ManagedProcess -Name "tunnel:be" -Command "npx --yes cloudflared tunnel --url http://localhost:8000 --no-autoupdate" -WorkingDirectory $frontendRoot -LogPath $backendTunnelLog
            $backendUrl = Wait-ForCloudflaredTunnel -Name "backend" -LogPath $backendTunnelLog
        }
    }
    $telegramWebhookUrl = "$backendUrl/api/v1/telegram/webhook"

    Write-Host ""
    Write-Host "Frontend tunnel: $frontendUrl" -ForegroundColor Green
    Write-Host "Backend tunnel:  $backendUrl" -ForegroundColor Green
    Write-Host "Webhook URL:     $telegramWebhookUrl" -ForegroundColor Green
    Write-Host ""

    if (-not $SkipEnvUpdate) {
        $frontendEnvPath = Join-Path $frontendRoot ".env"
        $backendEnvPath = Join-Path $backendRoot ".env"

        Set-DotEnvValue -Path $frontendEnvPath -Key "VITE_API_CORE_URL" -Value $backendUrl
        Set-DotEnvValue -Path $backendEnvPath -Key "FRONTEND_URL" -Value $frontendUrl
        Set-DotEnvValue -Path $backendEnvPath -Key "TELEGRAM_WEBHOOK_URL" -Value $telegramWebhookUrl
        Set-DotEnvValue -Path $backendEnvPath -Key "BACKEND_CORS_ORIGINS" -Value "[`"$frontendUrl`",`"http://localhost:3000`"]"
        Write-Host "Updated frontend/backend .env tunnel values." -ForegroundColor Green

        if (-not $SkipTelegramWebhookSetup) {
            Set-TelegramWebhook -BackendEnvPath $backendEnvPath -WebhookUrl $telegramWebhookUrl
        }
    }

    $backendCommand = if ($NoBackendBuild) {
        "docker compose up api"
    }
    else {
        "docker compose up --build api"
    }

    $managedProcesses += Start-ManagedProcess -Name "backend" -Command $backendCommand -WorkingDirectory $backendRoot
    $managedProcesses += Start-ManagedProcess -Name "frontend" -Command "pnpm dev:host" -WorkingDirectory $frontendRoot

    Write-Host ""
    Write-Host "Open frontend at $frontendUrl" -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop this launcher." -ForegroundColor Cyan

    while ($true) {
        Start-Sleep -Seconds 1
        $exited = $managedProcesses | Where-Object { $_.Process.HasExited } | Select-Object -First 1
        if ($exited) {
            throw "$($exited.Name) exited with code $($exited.Process.ExitCode)."
        }
    }
}
finally {
    Stop-ManagedProcesses -Processes $managedProcesses
}
