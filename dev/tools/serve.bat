@echo off
cd /d "%~dp0\..\.."
start "" http://localhost:8123
node dev\tools\serve.js
