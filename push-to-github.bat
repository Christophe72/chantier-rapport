@echo off
echo ========================================
echo     PUSH VERS GITHUB - CHANTIER RAPPORT
echo ========================================
echo.

:: Vérifier si on est dans un repository Git
if not exist ".git" (
    echo ERREUR: Ce dossier n'est pas un repository Git!
    echo Veuillez vous assurer d'être dans le bon dossier.
    pause
    exit /b 1
)

:: Afficher le statut actuel
echo [1/5] Verification du statut Git...
git status
echo.

:: Ajouter tous les fichiers modifiés
echo [2/5] Ajout de tous les fichiers modifies...
git add .
echo Fichiers ajoutes avec succes!
echo.

:: Demander le message de commit
set /p commit_message="[3/5] Entrez votre message de commit (ou appuyez sur Entree pour un message par defaut): "

:: Si aucun message n'est fourni, utiliser un message par défaut
if "%commit_message%"=="" (
    set commit_message=Mise a jour de l'application de gestion de chantiers
)

:: Créer le commit
echo [4/5] Creation du commit avec le message: "%commit_message%"
git commit -m "%commit_message%"
echo.

:: Vérifier la branche actuelle
for /f "tokens=*" %%i in ('git branch --show-current') do set current_branch=%%i
echo Branche actuelle: %current_branch%
echo.

:: Pousser vers GitHub
echo [5/5] Push vers GitHub (branche: %current_branch%)...
git push origin %current_branch%

:: Vérifier le résultat
if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo     SUCCES! Fichiers pousses sur GitHub
    echo ========================================
    echo.
    echo Votre code a ete pousse avec succes vers:
    echo Repository: https://github.com/Christophe72/chantier-rapport
    echo Branche: %current_branch%
    echo.
) else (
    echo.
    echo ========================================
    echo       ERREUR lors du push
    echo ========================================
    echo.
    echo Une erreur s'est produite. Causes possibles:
    echo - Probleme de connexion internet
    echo - Probleme d'authentification GitHub
    echo - Conflits avec la version distante
    echo.
    echo Solutions:
    echo 1. Verifiez votre connexion internet
    echo 2. Verifiez vos identifiants GitHub
    echo 3. Executez 'git pull origin %current_branch%' puis relancez ce script
    echo.
)

echo Appuyez sur une touche pour fermer...
pause >nul
