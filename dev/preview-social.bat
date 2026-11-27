@echo off
cd /d "%~dp0\.."
start "" http://localhost:8123/dev/preview-social
node dev\serve.js
