@echo off
cd /d "%~dp0\.."
set ROOT=C:\Projects\personal\charles-old-portfolio
start "" "http://localhost:8124/?redirect=0"
node dev\test-fallback.js