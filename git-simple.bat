@echo off
chcp 65001 >nul
title Git Manager - Chantier Rapport

:menu
cls
echo =========================================
echo    GIT MANAGER - CHANTIER RAPPORT
echo =========================================
echo.

REM Vérifier si c'est un repo Git
if not exist ".git" (
    echo ERREUR: Ce dossier n'est pas un repository Git!
    pause
    exit /b 1
)

echo Choisissez une action:
echo.
echo [1] Push rapide (add + commit + push)
echo [2] Voir le statut Git
echo [3] Voir l'historique
echo [4] Pull depuis GitHub
echo [5] Quitter
echo.
set /p choice="Votre choix (1-5): "

if "%choice%"=="1" goto push
if "%choice%"=="2" goto status
if "%choice%"=="3" goto history
if "%choice%"=="4" goto pull
if "%choice%"=="5" goto quit
echo Choix invalide!
timeout /t 2 >nul
goto menu

:push
cls
echo =========================================
echo    PUSH VERS GITHUB
echo =========================================
echo.

REM Vérifier s'il y a des modifications
git status --porcelain >temp_status.txt
for %%R in (temp_status.txt) do if %%~zR equ 0 (
    del temp_status.txt
    echo Aucune modification detectee.
    pause
    goto menu
)
del temp_status.txt

echo [1/4] Verification du statut...
git status --short
echo.

echo [2/4] Ajout des fichiers...
git add .
echo Fichiers ajoutes!
echo.

set /p message="[3/4] Message de commit (Entree = auto): "
if "%message%"=="" (
    for /f "tokens=1-3 delims=/- " %%a in ('date /t') do set mydate=%%a/%%b/%%c
    for /f "tokens=1-2 delims=: " %%a in ('time /t') do set mytime=%%a:%%b
    set message=Mise a jour du !mydate! !mytime!
)

echo [4/4] Commit et push...
git commit -m "%message%"
if %errorlevel% neq 0 (
    echo ERREUR lors du commit!
    pause
    goto menu
)

for /f "tokens=*" %%i in ('git branch --show-current') do set branch=%%i
git push origin %branch%

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo    SUCCES! Code pousse vers GitHub
    echo ========================================
    echo Branche: %branch%
    echo Message: %message%
    echo Repository: https://github.com/Christophe72/chantier-rapport
    echo.
) else (
    echo.
    echo ERREUR lors du push!
    echo Essayez un pull d'abord (option 4)
    echo.
)
pause
goto menu

:status
cls
echo =========================================
echo    STATUT GIT
echo =========================================
echo.
git status
echo.
pause
goto menu

:history
cls
echo =========================================
echo    HISTORIQUE
echo =========================================
echo.
git log --oneline -10
echo.
echo (10 derniers commits)
echo.
pause
goto menu

:pull
cls
echo =========================================
echo    PULL DEPUIS GITHUB
echo =========================================
echo.
for /f "tokens=*" %%i in ('git branch --show-current') do set branch=%%i
echo Pull depuis la branche %branch%...
git pull origin %branch%

if %errorlevel% equ 0 (
    echo Pull reussi!
) else (
    echo Erreur lors du pull!
)
echo.
pause
goto menu

:quit
cls
echo =========================================
echo    AU REVOIR!
echo =========================================
echo.
echo Merci d'avoir utilise Git Manager!
echo Repository: https://github.com/Christophe72/chantier-rapport
echo.
pause
exit /b 0
