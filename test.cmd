@echo off
rem Lance les tests unitaires + coverage du front et affiche un resume final.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0test.ps1" %*
exit /b %ERRORLEVEL%
