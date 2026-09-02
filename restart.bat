@echo off
cd /d "%~dp0"
echo Redemarrage...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul
start "Yesit Bot" cmd /k "node src/bot/index.js"
start "Yesit Dashboard" cmd /k "node src/dashboard/server.js"
echo Redemarre. Dashboard: http://localhost:3000
pause
