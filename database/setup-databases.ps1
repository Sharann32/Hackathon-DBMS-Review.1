Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Database Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test PostgreSQL connection
Write-Host "Testing PostgreSQL connection..." -ForegroundColor Yellow
try {
    $pgTest = psql -U postgres -c "SELECT version();" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "PostgreSQL is running" -ForegroundColor Green
        
        # Create database
        Write-Host ""
        Write-Host "Creating database settings_db..." -ForegroundColor Yellow
        psql -U postgres -c "CREATE DATABASE settings_db;" 2>&1 | Out-Null
        
        # Run schema script
        Write-Host "Creating tables..." -ForegroundColor Yellow
        $schemaPath = Join-Path $PSScriptRoot "postgresql\01-create-database.sql"
        psql -U postgres -d settings_db -f $schemaPath
        
        # Insert sample data
        Write-Host "Inserting sample data..." -ForegroundColor Yellow
        $dataPath = Join-Path $PSScriptRoot "postgresql\02-insert-sample-data.sql"
        psql -U postgres -d settings_db -f $dataPath
        
        Write-Host "PostgreSQL setup complete!" -ForegroundColor Green
    }
} catch {
    Write-Host "PostgreSQL not available or already set up" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

# Test MongoDB connection
Write-Host ""
Write-Host "Testing MongoDB connection..." -ForegroundColor Yellow
try {
    $mongoTest = mongosh --eval "db.version()" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "MongoDB is running" -ForegroundColor Green
        
        # Create database and collections
        Write-Host ""
        Write-Host "Creating MongoDB collections..." -ForegroundColor Yellow
        $mongoPath = Join-Path $PSScriptRoot "mongodb\01-create-collections.js"
        mongosh < $mongoPath
        
        Write-Host "MongoDB setup complete!" -ForegroundColor Green
    }
} catch {
    Write-Host "MongoDB not available" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
