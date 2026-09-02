@echo off
cd /d "%~dp0"
echo Lancement Yesit Bot + Dashboard...
start "Yesit Bot" cmd /k "node src/bot/index.js"
start "Yesit Dashboard" cmd /k "node src/dashboard/server.js"
echo.
echo Bot et Dashboard lances dans 2 fenetres separees.
echo Dashboard: http://localhost:3000
echo Dashboard tests: http://localhost:3000/api/stats
echo.
echo Ne ferme pas les 2 fenetres pour garder le bot en ligne.
pause
