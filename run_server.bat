@echo off
title Hadith Verification Engine Server
echo =======================================================
echo     Hadith Verification Engine (تحقيق الأحاديث النبوية)
echo     Rule-Based Islamic Hadith Science System
echo =======================================================
echo.

set PYTHON_CMD=python
where python >nul 2>nul
if %errorlevel% neq 0 (
    if exist "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" (
        set "PYTHON_CMD=%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
    ) else (
        echo [ERROR] Python was not found in PATH or standard installation directory.
        pause
        exit /b 1
    )
)

echo Starting FastAPI server at http://127.0.0.1:8000 ...
echo Press Ctrl+C to stop the server.
echo.
"%PYTHON_CMD%" -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
pause
