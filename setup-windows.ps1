$ErrorActionPreference = 'Stop'

Write-Host "Small Web - Windows local setup " -ForegroundColor Cyan

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw "Node.js is not installed. Install Node.js 20+ from https://nodejs.org/ and reopen PowerShell."
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  throw "npm was not found. Reinstall Node.js and reopen PowerShell."
}

$mongoService = Get-Service -Name 'MongoDB' -ErrorAction SilentlyContinue
if ($null -eq $mongoService) {
  Write-Warning "The MongoDB Windows service was not found. Install MongoDB Community Server and enable 'Install MongoD as a Service'."
} elseif ($mongoService.Status -ne 'Running') {
  Write-Host "Starting MongoDB Windows service..."
  Start-Service -Name 'MongoDB'
}

if (-not (Test-Path 'backend/.env')) {
  Copy-Item 'backend/.env.example' 'backend/.env'
  Write-Host "Created backend/.env"
}
if (-not (Test-Path 'frontend/.env.local')) {
  Copy-Item 'frontend/.env.example' 'frontend/.env.local'
  Write-Host "Created frontend/.env.local"
}

Write-Host "Installing root dependencies..." -ForegroundColor Yellow
npm install
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
npm --prefix backend install
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm --prefix frontend install

Write-Host "Setup complete. Ensure MongoDB is running, then run: npm run seed; npm run dev" -ForegroundColor Green
