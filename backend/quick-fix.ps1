# Quick Database Fix - Simple and Clean
# Run from backend directory: .\quick-fix.ps1

Write-Host ""
Write-Host "=== Quick Database Fix ===" -ForegroundColor Cyan
Write-Host ""

$envFile = ".env"

# Check if .env exists
if (-not (Test-Path $envFile)) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    $defaultEnv = "DB_HOST=localhost`nDB_USER=root`nDB_PASSWORD=root`nDB_NAME=resume_builder`nPORT=3001`nFRONTEND_URL=http://localhost:5173`nJWT_SECRET=your-secret-key-change-in-production-use-random-string"
    $defaultEnv | Out-File -FilePath $envFile -Encoding utf8
    Write-Host "Created .env with default password: root" -ForegroundColor Green
} else {
    Write-Host "Current .env file found" -ForegroundColor Green
    
    # Read current password setting
    $currentContent = Get-Content $envFile
    $hasPassword = $false
    foreach ($line in $currentContent) {
        if ($line -match "^DB_PASSWORD=(.+)$") {
            $hasPassword = $true
            $currentPwd = $matches[1]
            if ($currentPwd -eq "") {
                Write-Host "Current: DB_PASSWORD is empty" -ForegroundColor Yellow
            } else {
                Write-Host "Current: DB_PASSWORD is set" -ForegroundColor Yellow
            }
            break
        }
    }
    
    if (-not $hasPassword) {
        Write-Host "Adding DB_PASSWORD=root to .env" -ForegroundColor Yellow
        Add-Content -Path $envFile -Value "DB_PASSWORD=root"
    } else {
        Write-Host ""
        Write-Host "Choose password option:" -ForegroundColor Cyan
        Write-Host "1. Use 'root' (default)" -ForegroundColor White
        Write-Host "2. Use 'password'" -ForegroundColor White
        Write-Host "3. Use empty (XAMPP)" -ForegroundColor White
        Write-Host "4. Keep current" -ForegroundColor White
        Write-Host ""
        $choice = Read-Host "Enter choice (1-4)"
        
        $newPassword = switch ($choice) {
            "1" { "root" }
            "2" { "password" }
            "3" { "" }
            default { $currentPwd }
        }
        
        # Update password in .env
        $newContent = $currentContent | ForEach-Object {
            if ($_ -match "^DB_PASSWORD=") {
                "DB_PASSWORD=$newPassword"
            } else {
                $_
            }
        }
        $newContent | Set-Content $envFile
        Write-Host "Updated DB_PASSWORD" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Test: npm run test-db" -ForegroundColor White
Write-Host "2. Start: npm start" -ForegroundColor White
Write-Host ""
