# Script de correction des paramètres PowerShell
# filepath: fix-powershell.ps1

Write-Host "🔧 Correction des paramètres PowerShell..." -ForegroundColor Yellow

# Supprimer les messages de debug
$VerbosePreference = 'SilentlyContinue'
$DebugPreference = 'SilentlyContinue'
$ErrorActionPreference = 'SilentlyContinue'

# Définir le niveau de log approprié
$PSDefaultParameterValues['*:LogLevel'] = 'Information'
$PSDefaultParameterValues['*:Verbose'] = $false
$PSDefaultParameterValues['*:Debug'] = $false

# Nettoyer les modules PSReadLine problématiques
Write-Host "📝 Nettoyage des modules PSReadLine..." -ForegroundColor Cyan
if (Get-Module PSReadLine) {
    Remove-Module PSReadLine -Force -ErrorAction SilentlyContinue
}

# Réimporter PSReadLine avec les bons paramètres
Write-Host "📦 Réimportation de PSReadLine..." -ForegroundColor Cyan
if (Get-Module -ListAvailable -Name PSReadLine) {
    Import-Module PSReadLine -Force -DisableNameChecking -ErrorAction SilentlyContinue
    Set-PSReadLineOption -PredictionSource None -ErrorAction SilentlyContinue
}

Write-Host "✅ Paramètres PowerShell corrigés!" -ForegroundColor Green
Write-Host "Redémarrez votre terminal pour appliquer les changements." -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Vous pouvez maintenant utiliser:" -ForegroundColor Yellow
Write-Host "  - npm run dev (démarrer le serveur)" -ForegroundColor White
Write-Host "  - npx prisma studio (interface DB)" -ForegroundColor White
Write-Host "  - ./git-clean.ps1 (gestion Git propre)" -ForegroundColor White
