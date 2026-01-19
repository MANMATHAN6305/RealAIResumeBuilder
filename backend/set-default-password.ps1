# Set Default MySQL Password
# This script helps configure MySQL with a default password

Write-Host "`n=== MySQL Default Password Setup ===" -ForegroundColor Cyan
Write-Host ""

$envFile = ".env"

Write-Host "Your MySQL is rejecting connection without password." -ForegroundColor Yellow
Write-Host "`nChoose an option:" -ForegroundColor Cyan
Write-Host "1. Use default password: 'root' (common default)" -ForegroundColor White
Write-Host "2. Use empty password (for XAMPP/WAMP)" -ForegroundColor White
Write-Host "3. Enter custom password" -ForegroundColor White
Write-Host "4. Reset MySQL root password to empty" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter choice (1-4)"

$newPassword = ""

switch ($choice) {
    "1" {
        $newPassword = "root"
        Write-Host "`nUsing default password: 'root'" -ForegroundColor Green
    }
    "2" {
        $newPassword = ""
        Write-Host "`nUsing empty password (XAMPP/WAMP default)" -ForegroundColor Green
    }
    "3" {
        $securePassword = Read-Host "Enter your MySQL root password" -AsSecureString
        $newPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))
        Write-Host "`nUsing your custom password" -ForegroundColor Green
    }
    "4" {
        Write-Host "`nTo reset MySQL password to empty:" -ForegroundColor Yellow
        Write-Host "1. Stop MySQL service" -ForegroundColor White
        Write-Host "2. Start MySQL with --skip-grant-tables" -ForegroundColor White
        Write-Host "3. Run: UPDATE mysql.user SET authentication_string='' WHERE User='root';" -ForegroundColor White
        Write-Host "4. Restart MySQL normally" -ForegroundColor White
        Write-Host "`nOr use MySQL Workbench to reset password" -ForegroundColor Gray
        $newPassword = ""
    }
    default {
        Write-Host "Invalid choice. Using default password 'root'" -ForegroundColor Yellow
        $newPassword = "root"
    }
}

# Update .env file
if (Test-Path $envFile) {
    $content = Get-Content $envFile
    $newContent = $content | ForEach-Object {
        if ($_ -match "^DB_PASSWORD=") {
            "DB_PASSWORD=$newPassword"
        } else {
            $_
        }
    }
    $newContent | Set-Content $envFile
    Write-Host "`n✅ Updated backend/.env file" -ForegroundColor Green
    if ($newPassword -eq '') {
        Write-Host "   DB_PASSWORD=(empty)" -ForegroundColor Gray
    } else {
        Write-Host "   DB_PASSWORD=***" -ForegroundColor Gray
    }
} else {
    Write-Host "`n❌ .env file not found. Creating it..." -ForegroundColor Red
    $envContent = @"
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=$newPassword
DB_NAME=resume_builder
PORT=3001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key-change-in-production-use-random-string
"@
    $envContent | Out-File -FilePath $envFile -Encoding utf8
    Write-Host "✅ Created .env file" -ForegroundColor Green
}

Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Test connection: npm run test-db" -ForegroundColor White
Write-Host "2. If successful, start server: npm start" -ForegroundColor White
Write-Host "3. If it fails, try option 4 to reset MySQL password" -ForegroundColor White
Write-Host ""
