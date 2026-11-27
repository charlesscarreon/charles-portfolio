@echo off
cd /d "%~dp0\..\.."
start "" http://localhost:8127
node dev\previews\preview-email.js
