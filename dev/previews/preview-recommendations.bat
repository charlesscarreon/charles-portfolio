@echo off
cd /d "%~dp0\..\.."
start "" http://localhost:8125
node dev\previews\preview-recommendations.js
