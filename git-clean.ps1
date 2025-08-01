# Gestionnaire Git propre sans messages de debug
# filepath: git-clean.ps1

# Supprimer tous les messages de debug
$ErrorActionPreference = 'SilentlyContinue'
$VerbosePreference = 'SilentlyContinue'
$DebugPreference = 'SilentlyContinue'
$ProgressPreference = 'SilentlyContinue'

function Show-Menu {
    Clear-Host
    Write-Host "===========================================" -ForegroundColor Cyan
    Write-Host "    🚀 GESTIONNAIRE GIT - IoT DASHBOARD" -ForegroundColor Cyan
    Write-Host "===========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "[1] 📤 Push rapide (add + commit + push)" -ForegroundColor White
    Write-Host "[2] 📊 Voir le statut Git" -ForegroundColor White
    Write-Host "[3] 📜 Voir l'historique des commits" -ForegroundColor White
    Write-Host "[4] 📥 Pull depuis GitHub" -ForegroundColor White
    Write-Host "[5] 🌿 Changer de branche" -ForegroundColor White
    Write-Host "[6] 🗄️ Lancer Prisma Studio" -ForegroundColor White
    Write-Host "[7] 🚀 Démarrer le serveur dev" -ForegroundColor White
    Write-Host "[8] 🧹 Nettoyer le projet" -ForegroundColor White
    Write-Host "[9] 🚪 Quitter" -ForegroundColor White
    Write-Host ""
}

function Push-ToGitHub {
    Write-Host "📤 Push vers GitHub..." -ForegroundColor Yellow
    Write-Host ""
    
    # Vérifier le statut
    $status = git status --porcelain 2>$null
    if ([string]::IsNullOrWhiteSpace($status)) {
        Write-Host "ℹ️  Aucune modification détectée." -ForegroundColor Blue
        return
    }
    
    # Afficher les modifications
    Write-Host "📋 Modifications détectées:" -ForegroundColor Cyan
    git status --short 2>$null
    Write-Host ""
    
    $message = Read-Host "💬 Message de commit (Entrée pour message auto)"
    if ([string]::IsNullOrWhiteSpace($message)) {
        $date = Get-Date -Format "dd/MM/yyyy HH:mm"
        $message = "Mise à jour du $date"
    }
    
    Write-Host "➕ Ajout des fichiers..." -ForegroundColor Yellow
    git add . 2>$null
    
    Write-Host "💾 Création du commit..." -ForegroundColor Yellow
    git commit -m "$message" 2>$null
    
    Write-Host "🚀 Push vers GitHub..." -ForegroundColor Yellow
    $branch = git branch --show-current 2>$null
    git push origin $branch 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ ================================" -ForegroundColor Green
        Write-Host "    SUCCÈS! 🎉" -ForegroundColor Green
        Write-Host "================================" -ForegroundColor Green
        Write-Host "📤 Code poussé vers GitHub" -ForegroundColor White
        Write-Host "🌐 https://github.com/Christophe72/chantier-rapport" -ForegroundColor White
        Write-Host "🌿 Branche: $branch" -ForegroundColor White
        Write-Host "💬 Message: $message" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "❌ ================================" -ForegroundColor Red
        Write-Host "    ERREUR lors du push" -ForegroundColor Red
        Write-Host "================================" -ForegroundColor Red
        Write-Host "🔍 Solutions possibles:" -ForegroundColor Yellow
        Write-Host "  • Vérifiez votre connexion internet" -ForegroundColor White
        Write-Host "  • Utilisez l'option [4] pour pull d'abord" -ForegroundColor White
        Write-Host "  • Vérifiez vos identifiants GitHub" -ForegroundColor White
    }
}

function Show-GitStatus {
    Write-Host "📊 Statut Git:" -ForegroundColor Yellow
    Write-Host ""
    git status 2>$null
    Write-Host ""
    Write-Host "📋 Résumé:" -ForegroundColor Cyan
    git status --short 2>$null
}

function Show-GitHistory {
    Write-Host "📜 Historique des commits:" -ForegroundColor Yellow
    Write-Host ""
    git log --oneline -10 2>$null
    Write-Host ""
    Write-Host "(Affichage des 10 derniers commits)" -ForegroundColor Gray
}

function Pull-FromGitHub {
    Write-Host "📥 Pull depuis GitHub..." -ForegroundColor Yellow
    $branch = git branch --show-current 2>$null
    Write-Host "📥 Récupération depuis GitHub (branche: $branch)..." -ForegroundColor Cyan
    
    git pull origin $branch 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Pull réussi!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erreur lors du pull!" -ForegroundColor Red
    }
}

function Change-Branch {
    Write-Host "🌿 Changer de branche:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Branches disponibles:" -ForegroundColor Cyan
    git branch -a 2>$null
    Write-Host ""
    
    $branch = Read-Host "Nom de la branche (ou 'retour' pour annuler)"
    if ($branch -eq "retour") { return }
    
    git checkout $branch 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Changement vers la branche '$branch' réussi!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erreur lors du changement de branche!" -ForegroundColor Red
    }
}

function Start-PrismaStudio {
    Write-Host "🗄️ Lancement de Prisma Studio..." -ForegroundColor Yellow
    Write-Host "Prisma Studio sera accessible sur http://localhost:5555" -ForegroundColor Cyan
    Write-Host "Appuyez sur Ctrl+C pour arrêter" -ForegroundColor Gray
    Write-Host ""
    npx prisma studio
}

function Start-DevServer {
    Write-Host "🚀 Démarrage du serveur de développement..." -ForegroundColor Yellow
    Write-Host "L'application sera accessible sur http://localhost:3000" -ForegroundColor Cyan
    Write-Host "Appuyez sur Ctrl+C pour arrêter" -ForegroundColor Gray
    Write-Host ""
    npm run dev
}

function Clean-Project {
    Write-Host "🧹 Nettoyage du projet..." -ForegroundColor Yellow
    
    Write-Host "📦 Nettoyage node_modules..." -ForegroundColor Cyan
    Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    
    Write-Host "🗄️ Nettoyage base de données..." -ForegroundColor Cyan
    Remove-Item -Path "dev.db*" -Force -ErrorAction SilentlyContinue
    
    Write-Host "📦 Réinstallation des dépendances..." -ForegroundColor Cyan
    npm install 2>$null
    
    Write-Host "🗄️ Régénération de la base de données..." -ForegroundColor Cyan
    npx prisma generate 2>$null
    npx prisma db push 2>$null
    
    Write-Host "✅ Projet nettoyé et reconfiguré!" -ForegroundColor Green
}

# Menu principal
do {
    Show-Menu
    $choice = Read-Host "Votre choix (1-9)"
    Write-Host ""
    
    switch ($choice) {
        "1" { Push-ToGitHub }
        "2" { Show-GitStatus }
        "3" { Show-GitHistory }
        "4" { Pull-FromGitHub }
        "5" { Change-Branch }
        "6" { Start-PrismaStudio }
        "7" { Start-DevServer }
        "8" { Clean-Project }
        "9" { 
            Write-Host "👋 Au revoir!" -ForegroundColor Green
            Write-Host "Merci d'avoir utilisé le gestionnaire Git!" -ForegroundColor Cyan
            exit 
        }
        default { 
            Write-Host "❌ Choix invalide! Veuillez choisir entre 1 et 9." -ForegroundColor Red 
        }
    }
    
    if ($choice -ne "9") {
        Write-Host ""
        Read-Host "Appuyez sur Entrée pour continuer"
    }
} while ($choice -ne "9")
