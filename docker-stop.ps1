# Docker Stop Script for Settings Management System
# Safely stops all services

Write-Host "🛑 Stopping SSC Distributed System" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"

# Prompt for volume removal
Write-Host "❓ Remove volumes (database data)? [y/N]: " -NoNewline -ForegroundColor Yellow
$remove_volumes = Read-Host

try {
    if ($remove_volumes -eq "y" -or $remove_volumes -eq "Y") {
        Write-Host ""
        Write-Host "⚠️  WARNING: This will delete all database data!" -ForegroundColor Red
        Write-Host "Are you sure? [y/N]: " -NoNewline -ForegroundColor Yellow
        $confirm = Read-Host
        
        if ($confirm -eq "y" -or $confirm -eq "Y") {
            Write-Host ""
            Write-Host "🗑️  Stopping services and removing volumes..." -ForegroundColor Yellow
            docker-compose down -v
            Write-Host "✅ Services stopped and volumes removed" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "🛑 Stopping services (keeping volumes)..." -ForegroundColor Yellow
            docker-compose down
            Write-Host "✅ Services stopped (data preserved)" -ForegroundColor Green
        }
    } else {
        Write-Host ""
        Write-Host "🛑 Stopping services (keeping volumes)..." -ForegroundColor Yellow
        docker-compose down
        Write-Host "✅ Services stopped (data preserved)" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "📊 Status:" -ForegroundColor Cyan
    docker-compose ps
    
} catch {
    Write-Host "❌ Failed to stop services: $_" -ForegroundColor Red
    exit 1
}
