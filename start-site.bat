@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"

set "PY_CMD="
py -3 -c "import sys" >nul 2>nul
if not errorlevel 1 set "PY_CMD=py -3"
if not defined PY_CMD (
    python -c "import sys" >nul 2>nul
    if not errorlevel 1 set "PY_CMD=python"
)

if not defined PY_CMD (
    echo 找不到 Python。請安裝 Python 3，或使用 VS Code Live Server 開啟此專案。
    echo 安裝 Python 後，重新雙擊 start-site.bat。
    pause
    exit /b 1
)

echo 啟動 CineLog 電影推薦網站...
%PY_CMD% serve.py
if errorlevel 1 (
    echo 網站啟動失敗，請參考 README.md 的本機啟動說明。
)
pause
