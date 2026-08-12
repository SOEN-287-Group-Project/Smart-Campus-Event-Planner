@echo off
setlocal EnableExtensions EnableDelayedExpansion

title Smart Event Planner - Setup

echo ============================================
echo        Smart Event Planner - Setup
echo ============================================
echo.

REM --------------------------------------------
REM Step 1: Check / Install NVM for Windows
REM --------------------------------------------
echo [Step 1/4] Checking for NVM...
echo.

where nvm >nul 2>&1

if errorlevel 1 (
    echo NVM is not installed.
    echo.
    echo Downloading NVM for Windows installer...
    echo.


    powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri 'https://github.com/coreybutler/nvm-windows/releases/latest/download/nvm-setup.exe' -OutFile '%TEMP%\nvm-setup.exe'"

    if errorlevel 1 (
        echo.
        echo ERROR: Failed to download NVM installer.
        echo.
        pause
        exit /b 1
    )

    echo.
    echo Starting NVM installer...
    echo Please follow the installation instructions.
    echo.

    start /wait "" "%TEMP%\nvm-setup.exe"

    echo.
    echo NVM installation finished.
    echo.
    echo Please close this window and run setup.bat again.
    echo.
    pause
    exit /b 0


)

echo NVM is installed!
echo.

REM --------------------------------------------
REM Step 2: Configure NVM environment
REM --------------------------------------------
echo [Step 2/4] Configuring Node.js environment...
echo.

echo NVM_HOME:
echo %NVM_HOME%

echo.
echo NVM_SYMLINK:
echo %NVM_SYMLINK%

echo.

REM Add NVM directories to PATH.
REM Use delayed expansion so parentheses in the existing PATH
REM (such as "Program Files (x86)") do not break batch parsing.
set "PATH=%NVM_SYMLINK%;%NVM_HOME%;!PATH!"

echo NVM environment configured.
echo.

REM --------------------------------------------
REM Step 3: Install / Select Node.js
REM npm is included with Node
REM --------------------------------------------
echo [Step 3/4] Installing / selecting Node.js...
echo.

nvm install lts

if errorlevel 1 (
    echo.
    echo ERROR: Failed to install Node.js.
    echo.
    pause
    exit /b 1
)

echo.
echo Switching to Node.js LTS...
echo.

nvm use lts

if errorlevel 1 (
    echo.
    echo ERROR: Failed to switch to Node.js.
    echo.
    pause
    exit /b 1
)

REM nvm use changes the Node symlink.
REM Re-add it to PATH after switching versions.
set "PATH=%NVM_SYMLINK%;%NVM_HOME%;!PATH!"

echo.
echo Verifying Node.js...
echo.

where node

if errorlevel 1 (
    echo.
    echo ERROR: Node.js could not be found.
    echo.
    echo NVM_SYMLINK=%NVM_SYMLINK%
    echo.
    pause
    exit /b 1
)

echo.
echo Node.js version:
node --version

echo.
echo Checking npm...
where npm

if errorlevel 1 (
    echo.
    echo ERROR: npm could not be found.
    echo.
    pause
    exit /b 1
)

echo.
echo npm version:
call npm.cmd --version

if errorlevel 1 (
    echo.
    echo ERROR: npm could not be run.
    echo.
    pause
    exit /b 1
    )

echo.

REM --------------------------------------------
REM Step 4: Install project dependencies
REM --------------------------------------------
echo [Step 4/4] Installing Smart Event Planner dependencies...
echo.

REM Change to the directory containing this batch file.
cd /d "%~dp0"

if errorlevel 1 (
    echo.
    echo ERROR: Could not change to the project directory.
    echo.
    pause
    exit /b 1
)

echo Current directory:
cd

echo.
echo ============================================
echo    Running npm install...
echo ============================================
echo.

call npm.cmd install

set "NPM_EXIT_CODE=!ERRORLEVEL!"

echo.
echo ============================================
echo    npm install finished
echo    Exit code: !NPM_EXIT_CODE!
echo ============================================
echo.

if not "!NPM_EXIT_CODE!"=="0" (
    echo.
    echo ERROR: npm install failed.
    echo.
    echo Please review the npm error above.
    echo.
    pause
    exit /b !NPM_EXIT_CODE!
)

echo.
echo ============================================
echo    Setup completed successfully!
echo ============================================
echo.
echo You can now run your website with:
echo.
echo    start_server
echo.
echo ============================================
echo.

pause
