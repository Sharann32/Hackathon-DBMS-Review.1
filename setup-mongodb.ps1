# ================================================
# MongoDB Setup Script for Windows
# ================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MongoDB Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is installed
Write-Host "Checking if MongoDB is installed..." -ForegroundColor Yellow
$mongoInstalled = Get-Command mongod -ErrorAction SilentlyContinue

if (-not $mongoInstalled) {
    Write-Host "❌ MongoDB is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install MongoDB first:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://www.mongodb.com/try/download/community" -ForegroundColor White
    Write-Host "2. Select Windows, MSI installer" -ForegroundColor White
    Write-Host "3. Choose 'Complete' installation" -ForegroundColor White
    Write-Host "4. Check 'Install as Service'" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "✅ MongoDB is installed" -ForegroundColor Green
Write-Host ""

# Check if MongoDB service is running
Write-Host "Checking MongoDB service..." -ForegroundColor Yellow
$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue

if ($mongoService) {
    if ($mongoService.Status -eq "Running") {
        Write-Host "✅ MongoDB service is running" -ForegroundColor Green
    } else {
        Write-Host "⚠️  MongoDB service exists but not running" -ForegroundColor Yellow
        Write-Host "Starting MongoDB service..." -ForegroundColor Yellow
        try {
            Start-Service -Name MongoDB
            Write-Host "✅ MongoDB service started" -ForegroundColor Green
        } catch {
            Write-Host "❌ Failed to start MongoDB service: $_" -ForegroundColor Red
            Write-Host "Try running as Administrator" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "⚠️  MongoDB service not found" -ForegroundColor Yellow
    Write-Host "Starting MongoDB manually..." -ForegroundColor Yellow
    
    # Create data directory if not exists
    $dataPath = "C:\data\db"
    if (-not (Test-Path $dataPath)) {
        New-Item -ItemType Directory -Path $dataPath -Force | Out-Null
        Write-Host "✅ Created data directory: $dataPath" -ForegroundColor Green
    }
    
    Write-Host "You need to start MongoDB manually in a separate terminal:" -ForegroundColor Yellow
    Write-Host "mongod --dbpath C:\data\db" -ForegroundColor White
}

Write-Host ""

# Check if mongosh is available
Write-Host "Checking mongosh (MongoDB Shell)..." -ForegroundColor Yellow
$mongoshInstalled = Get-Command mongosh -ErrorAction SilentlyContinue

if (-not $mongoshInstalled) {
    Write-Host "⚠️  mongosh not found. Using legacy mongo shell" -ForegroundColor Yellow
    $mongoShell = "mongo"
} else {
    Write-Host "✅ mongosh is available" -ForegroundColor Green
    $mongoShell = "mongosh"
}

Write-Host ""

# Test MongoDB connection
Write-Host "Testing MongoDB connection..." -ForegroundColor Yellow
try {
    $testResult = & $mongoShell --eval "db.version()" --quiet 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ MongoDB is accessible" -ForegroundColor Green
    } else {
        Write-Host "❌ Cannot connect to MongoDB" -ForegroundColor Red
        Write-Host "Make sure MongoDB is running on port 27017" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ Cannot connect to MongoDB: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Setup database
Write-Host "Setting up configuration_assistant database..." -ForegroundColor Yellow
$scriptPath = Join-Path $PSScriptRoot "database\mongodb\01-create-collections.js"

if (Test-Path $scriptPath) {
    Write-Host "Running setup script..." -ForegroundColor Yellow
    & $mongoShell $scriptPath
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database setup completed" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Script execution had warnings (this may be normal)" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Setup script not found at: $scriptPath" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Verify data
Write-Host "Verifying data..." -ForegroundColor Yellow
$verifyScript = @"
use configuration_assistant
var explanationsCount = db.explanations.countDocuments()
var faqsCount = db.faqs.countDocuments()
print('Explanations: ' + explanationsCount)
print('FAQs: ' + faqsCount)
"@

$verifyResult = $verifyScript | & $mongoShell --quiet
Write-Host $verifyResult -ForegroundColor White

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ MongoDB Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Database: configuration_assistant" -ForegroundColor White
Write-Host "Collections: explanations, faqs" -ForegroundColor White
Write-Host "Connection: mongodb://localhost:27017" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Start Node.js backend: cd node-backend && npm start" -ForegroundColor White
Write-Host "2. Test API: http://localhost:3001/api/explanations" -ForegroundColor White
Write-Host ""
