@echo off
echo Starting npm server...

for /f %%P in (
    'powershell -NoProfile -Command "(Start-Process cmd.exe -ArgumentList '/k npm start' -PassThru).Id"'
) do set SERVER_PID=%%P

echo Server started with PID %SERVER_PID%

:MENU
    echo.
    choice /C YN /M "Do you want to stop the server?"

if %ERRORLEVEL%==1 goto STOP
if %ERRORLEVEL%==2 goto MENU

:STOP
    echo.
    echo Stopping server...

    taskkill /PID %SERVER_PID% /T /F

echo.
echo Server stopped.
pause
