@echo off
title SI-PAD Lamsel - Localhost Server
echo ================================================================
echo   SI-PAD LAMSEL - SISTEM E-RETRIBUSI WISATA KALIANDA
echo   BPPRD KABUPATEN LAMPUNG SELATAN
echo ================================================================
echo.
echo Menjalankan local server...
echo.

start "" "http://localhost:3000"
node "%~dp0server.js"

pause

