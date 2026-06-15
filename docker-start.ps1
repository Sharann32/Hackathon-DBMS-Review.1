# Docker Start Script for Settings Management System
# Starts all services in the correct order

Write-Host "🚀 Starting SSC Distributed System" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"

# Start services
Write-Host "📦 Starting all services..." -ForegroundColor Yellow
try {
    docker-compose up -d
    
    Write-Host ""
    Write-Host "⏳ Waiting for services to initialize..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    Write-Host ""
    Write-Host "📊 Service Status:" -ForegroundColor Cyan
    docker-compose ps
    
    Write-Host ""
    Write-Host "🔍 Health Checks:" -ForegroundColor Cyan
    
    # Check each service
    Write-Host "  Frontend (Port 80)..." -NoNewline
    try { Invoke-WebRequest -Uri "http://localhost/health" -UseBasicParsing -TimeoutSec 5 | Out-Null; Write-Host " ✅" -ForegroundColor Green } catch { Write-Host " ⏳ Starting..." -ForegroundColor Yellow }
    
    Write-Host "  Gateway (Port 8000)..." -NoNewline
    try { Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 5 | Out-Null; Write-Host " ✅" -ForegroundColor Green } catch { Write-Host " ⏳ Starting..." -ForegroundColor Yellow }
    
    Write-Host "  Spring Boot (Port 9090)..." -NoNewline
    try { Invoke-WebRequest -Uri "http://localhost:9090/actuator/health" -UseBasicParsing -TimeoutSec 5 | Out-Null; Write-Host " ✅" -ForegroundColor Green } catch { Write-Host " ⏳ Starting..." -ForegroundColor Yellow }
    
    Write-Host "  Node.js (Port 3001)..." -NoNewline
    try { Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing -TimeoutSec 5 | Out-Null; Write-Host " ✅" -ForegroundColor Green } catch { Write-Host " ⏳ Starting..." -ForegroundColor Yellow }
    
    Write-Host ""
    Write-Host "✅ System Started Successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📱 Access Points:" -ForegroundColor Cyan
    Write-Host "  • Frontend:     http://localhost" -ForegroundColor White
    Write-Host "  • API Gateway:  http://localhost:8000" -ForegroundColor White
    Write-Host "  • Spring Boot:  http://localhost:9090" -ForegroundColor White
    Write-Host "  • Node.js:      http://localhost:3001" -ForegroundColor White
    Write-Host ""
    Write-Host "🔐 Default Credentials:" -ForegroundColor Cyan
    Write-Host "  Admin: testadmin@test.com / admin123" -ForegroundColor White
    Write-Host "  User:  john@example.com / user123" -ForegroundColor White
    Write-Host ""
    Write-Host "⚡ Next Steps:" -ForegroundColor Yellow
    Write-Host "  1. Generate vector embeddings:" -ForegroundColor White
    Write-Host "     docker exec -it ssc-node-backend node src/scripts/generateEmbeddings.js" -ForegroundColor Gray
    Write-Host "  2. View logs:" -ForegroundColor White
    Write-Host "     docker-compose logs -f" -ForegroundColor Gray
    Write-Host "  3. Stop system:" -ForegroundColor White
    Write-Host "     docker-compose down" -ForegroundColor Gray
    Write-Host ""
    
} catch {
    Write-Host "❌ Failed to start services: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  • Check if ports are available (80, 8000, 9090, 3001, 5432, 27017)" -ForegroundColor White
    Write-Host "  • View logs: docker-compose logs" -ForegroundColor White
    Write-Host "  • Restart Docker Desktop" -ForegroundColor White
    exit 1
}
