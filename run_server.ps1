Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "    Hadith Verification Engine (تحقيق الأحاديث النبوية)   " -ForegroundColor Yellow
Write-Host "    Rule-Based Islamic Hadith Science System           " -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Cyan

$pythonCmd = "python"
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    $alt = "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe"
    if (Test-Path $alt) {
        $pythonCmd = $alt
    } else {
        Write-Error "Python was not found. Please install Python or add it to PATH."
        exit 1
    }
}

Write-Host "`nStarting FastAPI server at http://127.0.0.1:8000 ..." -ForegroundColor Green
Write-Host "Opening web browser at http://127.0.0.1:8000 ..." -ForegroundColor Cyan
Start-Process "http://127.0.0.1:8000"

& $pythonCmd -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
