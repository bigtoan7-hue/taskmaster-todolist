@echo off
title Tạo Shortcut TaskMaster trên Desktop
chcp 65001 >nul

echo Đang tạo phím tắt (Shortcut) ra màn hình chính Desktop...

set SCRIPT_DIR=%~dp0
set TARGET_FILE=%SCRIPT_DIR%Chay_TodoList.vbs

powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut([Environment]::GetFolderPath('Desktop') + '\TaskMaster TodoList.lnk'); $Shortcut.TargetPath = '%TARGET_FILE%'; $Shortcut.WorkingDirectory = '%SCRIPT_DIR%'; $Shortcut.Description = 'Ứng dụng quản lý công việc TaskMaster'; $Shortcut.Save()"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [THÀNH CÔNG] Đã tạo phím tắt "TaskMaster TodoList" trên Desktop của bạn!
    echo Bạn có thể ra ngoài màn hình chính Desktop để mở ứng dụng bất cứ lúc nào.
) else (
    echo.
    echo [CHÚ Ý] Không thể tạo tự động. Bạn có thể nhấn chuột phải vào file "Chay_TodoList.vbs" -> Send to -> Desktop.
)

pause
