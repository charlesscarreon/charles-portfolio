@echo off
cd /d "%~dp0\.."
start "" http://localhost:8128
node dev\preview-light.js
