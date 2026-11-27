@echo off
cd /d "%~dp0\..\.."
start "" http://localhost:8126
node dev\previews\preview-internal.js
