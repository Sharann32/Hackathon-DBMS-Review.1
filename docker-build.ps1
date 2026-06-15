# Docker Build Script for Settings Management System
# Builds all Docker images

Write-Host "🐳 Building Docker Images for SSC Project" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"

# Check Docker availability
Write-Host "📋 Checking Docker..." -ForegroundColor Yellow
try {
    docker --version
    docker-compose --version
} catch {
    Write-Host "❌ Docker or Docker Compose not found!" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Docker is available" -ForegroundColor Green
Write-Host ""

# Build images
Write-Host "🔨 Building all Docker images..." -ForegroundColor Yellow
Write-Host ""

try {
    docker-compose build --no-cache
    
    Write-Host ""
    Write-Host "✅ All images built successfully!" -ForegroundColor Green
    Write-Host ""
    
    # List images
    Write-Host "📦 Built Images:" -ForegroundColor Cyan
    docker images | Select-String "ssc-"
    
    Write-Host ""
    Write-Host "🚀 Ready to deploy!" -ForegroundColor Green
    Write-Host "Run: docker-compose up -d" -ForegroundColor Yellow
    
} catch {
    Write-Host "❌ Build failed: $_" -ForegroundColor Red
    exit 1
}
