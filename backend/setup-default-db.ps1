# Setup Default Database Configuration
# This script helps set up MySQL with default settings

Write-Host "`n=== MySQL Default Setup ===" -ForegroundColor Cyan
Write-Host ""

$envFile = ".env"
$mysqlPaths = @(
    "C:\xampp\mysql\bin\mysql.exe",
    "C:\wamp64\bin\mysql\mysql8.0.31\bin\mysql.exe",
    "C:\wamp64\bin\mysql\mysql8.0.27\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe"
)

$mysqlPath = $null
foreach ($path in $mysqlPaths) {
    if (Test-Path $path) {
        $mysqlPath = $path
        Write-Host "✅ Found MySQL at: $path" -ForegroundColor Green
        break
    }
}

if (-not $mysqlPath) {
    Write-Host "⚠️  MySQL not found in common locations" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Cyan
    Write-Host "1. Install XAMPP (recommended for beginners)" -ForegroundColor White
    Write-Host "   Download: https://www.apachefriends.org/" -ForegroundColor Gray
    Write-Host "   XAMPP MySQL has NO password by default" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Install MySQL Server" -ForegroundColor White
    Write-Host "   Download: https://dev.mysql.com/downloads/mysql/" -ForegroundColor Gray
    Write-Host "   You'll set a password during installation" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Use existing MySQL" -ForegroundColor White
    Write-Host "   Enter your MySQL path manually" -ForegroundColor Gray
    Write-Host ""
    
    $choice = Read-Host "Choose option (1/2/3) or press Enter to configure .env manually"
    
    if ($choice -eq "1") {
        Write-Host "`nFor XAMPP (no password):" -ForegroundColor Green
        Write-Host "Update backend/.env with:" -ForegroundColor Yellow
        Write-Host "DB_PASSWORD=" -ForegroundColor White
        Write-Host "(Keep it empty - XAMPP has no password by default)" -ForegroundColor Gray
        return
    }
}

# Test connection with no password (XAMPP default)
Write-Host "`nTesting MySQL connection with NO password (XAMPP default)..." -ForegroundColor Cyan

if ($mysqlPath) {
    $testResult = & $mysqlPath -u root -e "SELECT 1;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ MySQL works with NO password (XAMPP default)" -ForegroundColor Green
        Write-Host "`nUpdating .env file..." -ForegroundColor Yellow
        
        # Update .env to have empty password
        if (Test-Path $envFile) {
            $envContent = Get-Content $envFile -Raw
            $envContent = $envContent -replace 'DB_PASSWORD=.*', 'DB_PASSWORD='
            $envContent | Set-Content $envFile -NoNewline
        } else {
            $envContent = @"
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=resume_builder
PORT=3001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key-change-in-production-use-random-string
"@
            $envContent | Out-File -FilePath $envFile -Encoding utf8
        }
        
        Write-Host "✅ Updated .env: DB_PASSWORD= (empty - XAMPP default)" -ForegroundColor Green
        Write-Host "`nNow test with: npm run test-db" -ForegroundColor Cyan
        return
    }
}

# If no password doesn't work, try to get password
Write-Host "`nMySQL requires a password." -ForegroundColor Yellow
Write-Host "Enter your MySQL root password (or press Enter to set up default):" -ForegroundColor Cyan
$password = Read-Host -AsSecureString
$plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

if ([string]::IsNullOrWhiteSpace($plainPassword)) {
    Write-Host "`nSetting up with default configuration..." -ForegroundColor Yellow
    Write-Host "For XAMPP: Use DB_PASSWORD= (empty)" -ForegroundColor White
    Write-Host "For MySQL Server: You need to set the password you created during installation" -ForegroundColor White
    
    # Update .env with empty password (XAMPP default)
    if (Test-Path $envFile) {
        $envContent = Get-Content $envFile -Raw
        $envContent = $envContent -replace 'DB_PASSWORD=.*', 'DB_PASSWORD='
        $envContent | Set-Content $envFile -NoNewline
    } else {
        $envContent = @"
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=resume_builder
PORT=3001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key-change-in-production-use-random-string
"@
        $envContent | Out-File -FilePath $envFile -Encoding utf8
    }
    
    Write-Host "`n✅ Updated .env with DB_PASSWORD= (empty)" -ForegroundColor Green
    Write-Host "If this doesn't work, update DB_PASSWORD with your MySQL password" -ForegroundColor Yellow
} else {
    # Update .env with provided password
    if (Test-Path $envFile) {
        $envContent = Get-Content $envFile -Raw
        $envContent = $envContent -replace 'DB_PASSWORD=.*', "DB_PASSWORD=$plainPassword"
        $envContent | Set-Content $envFile -NoNewline
    } else {
        $envContent = @"
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=$plainPassword
DB_NAME=resume_builder
PORT=3001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key-change-in-production-use-random-string
"@
        $envContent | Out-File -FilePath $envFile -Encoding utf8
    }
    
    Write-Host "`n✅ Updated .env with your password" -ForegroundColor Green
}

Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Create database: mysql -u root -p < ..\mysql-schema.sql" -ForegroundColor White
Write-Host "2. Test connection: npm run test-db" -ForegroundColor White
Write-Host "3. Start server: npm start" -ForegroundColor White
Write-Host ""
