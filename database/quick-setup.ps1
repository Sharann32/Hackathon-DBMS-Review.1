# Quick Database Setup Script
# Run this in PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Database Setup for Settings Management" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# PostgreSQL Setup
Write-Host "Setting up PostgreSQL..." -ForegroundColor Yellow
Write-Host "Running: psql -U postgres -f postgresql/01-create-database.sql" -ForegroundColor Gray
psql -U postgres -f postgresql/01-create-database.sql

Write-Host ""
Write-Host "Inserting sample data..." -ForegroundColor Yellow
psql -U postgres -d settings_db -f postgresql/02-insert-sample-data.sql

Write-Host ""
Write-Host "PostgreSQL setup complete!" -ForegroundColor Green

# MongoDB Setup
Write-Host ""
Write-Host "Setting up MongoDB..." -ForegroundColor Yellow
Write-Host "Running: mongosh < mongodb/01-create-collections.js" -ForegroundColor Gray
mongosh < mongodb/01-create-collections.js

Write-Host ""
Write-Host "MongoDB setup complete!" -ForegroundColor Green

# Verification
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "PostgreSQL Tables:" -ForegroundColor Yellow
psql -U postgres -d settings_db -c "\dt"

Write-Host ""
Write-Host "Sample Categories:" -ForegroundColor Yellow
psql -U postgres -d settings_db -c "SELECT name FROM setting_categories;"

Write-Host ""
Write-Host "MongoDB Collections:" -ForegroundColor Yellow
mongosh configuration_assistant --eval "db.getCollectionNames()"

Write-Host ""
Write-Host "MongoDB Sample Data Count:" -ForegroundColor Yellow
mongosh configuration_assistant --eval "print('Explanations:', db.explanations.count()); print('FAQs:', db.faqs.count())"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Start Spring Boot in your IDE" -ForegroundColor White
Write-Host "2. Open http://localhost:5173 in browser" -ForegroundColor White
Write-Host "3. Register a new user" -ForegroundColor White
Write-Host ""
