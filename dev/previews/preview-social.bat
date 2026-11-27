@echo off
cd /d "%~dp0\..\.."
start "" http://localhost:8123/dev/previews/preview-social
node dev\tools\serve.js
