@echo off
title TaskMaster Desktop
chcp 65001 >nul

set APP_PATH=%~dp0index.html

:: Kiểm tra Microsoft Edge để mở dưới dạng ứng dụng Desktop (Borderless App window)
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --app="file:///%APP_PATH:\=/%" --window-size=1200,820
    exit /b
)

if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" --app="file:///%APP_PATH:\=/%" --window-size=1200,820
    exit /b
)

:: Kiểm tra Google Chrome
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app="file:///%APP_PATH:\=/%" --window-size=1200,820
    exit /b
)

if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" --app="file:///%APP_PATH:\=/%" --window-size=1200,820
    exit /b
)

:: Mở bằng trình duyệt mặc định nếu không tìm thấy đường dẫn cố định
start "" "%APP_PATH%"
exit /b
