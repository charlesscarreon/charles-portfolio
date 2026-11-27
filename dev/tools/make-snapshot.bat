@echo off
set "BACKUP=%~f1"
cd /d "%~dp0\..\.."
if "%~1"=="" (
  echo Usage: dev\tools\make-snapshot.bat "path\to\recommendations-backup-DATE.json"
  exit /b 1
)
node dev\tools\make-snapshot.js "%BACKUP%"
