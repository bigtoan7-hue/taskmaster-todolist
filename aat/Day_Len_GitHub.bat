@echo off
title Push TaskMaster to GitHub

echo ======================================================
echo           DANG DAY CODE LEN GITHUB...
echo ======================================================
echo.

set REPO_URL=https://github.com/bigtoan7-hue/taskmaster-todolist.git

echo Remote URL: %REPO_URL%
echo.

echo [1/3] Cap nhat Remote Origin...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo [2/3] Kiem tra nhanh chinh (main)...
git branch -M main

echo [3/3] Dang day ma nguon (git push)...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ======================================================
    echo [THANH CONG] Da day code len GitHub thanh cong!
    echo Ban co the vao https://vercel.com de Deploy ngay bay gio.
    echo ======================================================
) else (
    echo.
    echo ======================================================
    echo [THONG BAO] Neu co cua so nho GitHub hien len, 
    echo hay chon 'Sign in with your browser' de dang nhap.
    echo ======================================================
)

echo.
pause
