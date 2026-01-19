# Database Connection Fix Script
# Run this from the project root: .\fix-database.ps1

Write-Host "`n=== DATABASE CONNECTION FIX ===" -ForegroundColor Cyan
Write-Host ""

$envPath = "backend\.env"

if (-not (Test-Path $envPath)) {
    Write-Host "❌ .env file not found at: $envPath" -ForegroundColor Red
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    
    $envContent = @"
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=resume_builder
PORT=3001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key-change-in-production-use-random-string
"@
    $envContent | Out-File -FilePath $envPath -Encoding utf8
    
    Write-Host "✅ Created .env file" -ForegroundColor Green
}

Write-Host "Current .env configuration:" -ForegroundColor Yellow
Get-Content $envPath | Select-String "DB_" | ForEach-Object {
    if ($_ -match "PASSWORD") {
        Write-Host "   DB_PASSWORD=(hidden)" -ForegroundColor Gray
    } else {
        Write-Host "   $_" -ForegroundColor Gray
    }
}

Write-Host "`n📋 Steps to Fix:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Check if MySQL is running:" -ForegroundColor White
Write-Host "   Get-Service '*mysql*'" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Test MySQL connection:" -ForegroundColor White
Write-Host "   mysql -u root -p" -ForegroundColor Gray
Write-Host "   (Enter your password, or press Enter if no password)" -ForegroundColor DarkGray
Write-Host ""
Write-Host "3. Update backend\.env file:" -ForegroundColor White
Write-Host "   - If MySQL HAS password: Set DB_PASSWORD=your_password" -ForegroundColor Gray
Write-Host "   - If MySQL NO password: Keep DB_PASSWORD= (empty)" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Create database (if needed):" -ForegroundColor White
Write-Host "   mysql -u root -p < mysql-schema.sql" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Test database connection:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   npm run test-db" -ForegroundColor Gray
Write-Host ""
Write-Host "6. Start backend:" -ForegroundColor White
Write-Host "   npm start" -ForegroundColor Gray
Write-Host ""

# Check if MySQL command is available
$mysqlAvailable = Get-Command mysql -ErrorAction SilentlyContinue
if ($mysqlAvailable) {
    Write-Host "✅ MySQL command found" -ForegroundColor Green
    Write-Host ""
    Write-Host "Would you like to test MySQL connection now? (Y/N)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -eq 'Y' -or $response -eq 'y') {
        Write-Host "`nTesting MySQL connection..." -ForegroundColor Cyan
        mysql -u root -e "SELECT 1;" 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ MySQL connection successful (no password)" -ForegroundColor Green
        } else {
            Write-Host "⚠️  MySQL requires password or is not accessible" -ForegroundColor Yellow
            Write-Host "   Run: mysql -u root -p" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "⚠️  MySQL command not found in PATH" -ForegroundColor Yellow
    Write-Host "   Make sure MySQL is installed and in your PATH" -ForegroundColor Gray
}

Write-Host "`n📚 For detailed instructions, see:" -ForegroundColor Cyan
Write-Host "   - QUICK_DB_FIX.md (quick guide)" -ForegroundColor White
Write-Host "   - DATABASE_FIX.md (detailed guide)" -ForegroundColor White
Write-Host ""
