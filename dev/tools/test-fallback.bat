@echo off
cd /d "%~dp0\..\.."
start "" http://localhost:8124/
node dev\tools\test-fallback.js
