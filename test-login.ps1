# Test Login Script for AI Resume Builder
# This script tests the login endpoint

$email = "manmadhansiva2005@gmail.com"
$password = "Manm@2045"

Write-Host "Testing Login Endpoint..." -ForegroundColor Cyan
Write-Host "Email: $email" -ForegroundColor Yellow
Write-Host "Password: $password" -ForegroundColor Yellow
Write-Host ""

try {
    $body = @{
        email = $email
        password = $password
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Body $body -ContentType "application/json"

    Write-Host "✅ Login Successful!" -ForegroundColor Green
    Write-Host "User ID: $($response.user.id)" -ForegroundColor Green
    Write-Host "Email: $($response.user.email)" -ForegroundColor Green
    Write-Host "Token: $($response.token.Substring(0, 50))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ Login Failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "Details: $($errorDetails.error)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Testing Registration Endpoint..." -ForegroundColor Cyan

try {
    $body = @{
        email = $email
        password = $password
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/register" -Method POST -Body $body -ContentType "application/json"

    Write-Host "✅ Registration Successful!" -ForegroundColor Green
    Write-Host "User ID: $($response.user.id)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Registration Failed (user may already exist)" -ForegroundColor Yellow
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
}

