@echo off
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  echo Starting AFAQ JOOD website at http://localhost:8000
  py -m http.server 8000
  goto :eof
)
where python >nul 2>nul
if %errorlevel%==0 (
  echo Starting AFAQ JOOD website at http://localhost:8000
  python -m http.server 8000
  goto :eof
)
echo Python was not found. You can still open index.html directly in your browser.
pause
