# Profil PowerShell pour le projet IoT Dashboard
# filepath: Microsoft.PowerShell_profile.ps1

# Supprimer tous les messages de debug et verbose
$VerbosePreference = 'SilentlyContinue'
$DebugPreference = 'SilentlyContinue'
$ProgressPreference = 'SilentlyContinue'
$ErrorActionPreference = 'SilentlyContinue'

# Configuration des paramètres par défaut
$PSDefaultParameterValues = @{
    '*:LogLevel' = 'Information'
    '*:Verbose' = $false
    '*:Debug' = $false
    '*:ProgressAction' = 'SilentlyContinue'
}

# Configuration PSReadLine propre
if (Get-Module -ListAvailable -Name PSReadLine) {
    Import-Module PSReadLine -Force -DisableNameChecking -WarningAction SilentlyContinue
    Set-PSReadLineOption -PredictionSource None -WarningAction SilentlyContinue
    Set-PSReadLineOption -BellStyle None -WarningAction SilentlyContinue
}

# Fonctions utiles pour le projet
function Start-IoTDashboard {
    <#
    .SYNOPSIS
    Démarre l'application IoT Dashboard
    #>
    Write-Host "🚀 Démarrage de l'application IoT Dashboard..." -ForegroundColor Green
    npm run dev
}

function Start-Database {
    <#
    .SYNOPSIS
    Lance Prisma Studio pour gérer la base de données
    #>
    Write-Host "🗄️ Ouverture de Prisma Studio..." -ForegroundColor Blue
    Write-Host "Interface disponible sur http://localhost:5555" -ForegroundColor Cyan
    npx prisma studio
}

function Reset-Database {
    <#
    .SYNOPSIS
    Remet à zéro la base de données
    #>
    Write-Host "🗄️ Remise à zéro de la base de données..." -ForegroundColor Yellow
    npx prisma db push --force-reset
    Write-Host "✅ Base de données réinitialisée!" -ForegroundColor Green
}

function Show-ProjectInfo {
    <#
    .SYNOPSIS
    Affiche les informations du projet
    #>
    Write-Host ""
    Write-Host "🏗️ ===== IoT DASHBOARD - INFO PROJET =====" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📦 Projet : Dashboard IoT pour gestion de chantiers" -ForegroundColor White
    Write-Host "🔗 GitHub : https://github.com/Christophe72/chantier-rapport" -ForegroundColor White
    Write-Host "👨‍💻 Auteur : Christophe72" -ForegroundColor White
    Write-Host ""
    Write-Host "🛠️  Commandes disponibles :" -ForegroundColor Yellow
    Write-Host "  Start-IoTDashboard    - Démarrer l'application" -ForegroundColor White
    Write-Host "  Start-Database        - Ouvrir Prisma Studio" -ForegroundColor White
    Write-Host "  Reset-Database        - Réinitialiser la DB" -ForegroundColor White
    Write-Host "  ./git-clean.ps1       - Gestionnaire Git" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 URLs importantes :" -ForegroundColor Yellow
    Write-Host "  Application : http://localhost:3000" -ForegroundColor White
    Write-Host "  Connexion   : http://localhost:3000/auth/signin" -ForegroundColor White
    Write-Host "  Inscription : http://localhost:3000/auth/signup" -ForegroundColor White
    Write-Host "  Base de données : http://localhost:5555" -ForegroundColor White
    Write-Host ""
}

# Alias utiles
Set-Alias -Name "dashboard" -Value "Start-IoTDashboard"
Set-Alias -Name "db" -Value "Start-Database"
Set-Alias -Name "info" -Value "Show-ProjectInfo"

# Message de bienvenue
Write-Host "🚀 Environnement PowerShell configuré pour IoT Dashboard" -ForegroundColor Green
Write-Host "Tapez 'info' pour voir les commandes disponibles" -ForegroundColor Cyan
