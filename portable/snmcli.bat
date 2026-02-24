@echo off
REM snmcli portable version launcher (Windows)

REM Get script directory
set SCRIPT_DIR=%~dp0

REM Run snmcli
node "%SCRIPT_DIR%dist\cli\index.js" %*
