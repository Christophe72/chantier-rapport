# Script PowerShell pour gérer Git et GitHub
# Encodage UTF-8 pour les caractères spéciaux
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

function Show-Header {
    Clear-Host
    Write-Host "===========================================" -ForegroundColor Cyan
    Write-Host "   🚀 GESTIONNAIRE GIT - CHANTIER RAPPORT" -ForegroundColor Yellow
    Write-Host "===========================================" -ForegroundColor Cyan
    Write-Host ""
}

function Show-Success {
    param($Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Show-Error {
    param($Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Show-Info {
    param($Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue
}

function Test-GitRepository {
    if (-not (Test-Path ".git")) {
        Show-Error "Ce dossier n'est pas un repository Git!"
        Write-Host "Veuillez vous assurer d'être dans le bon dossier." -ForegroundColor Yellow
        Read-Host "Appuyez sur Entrée pour quitter"
        exit 1
    }
}

function Push-ToGitHub {
    Show-Header
    Write-Host "   📤 PUSH RAPIDE VERS GITHUB" -ForegroundColor Yellow
    Write-Host "===========================================" -ForegroundColor Cyan
    Write-Host ""

    # Vérifier les modifications
    $hasChanges = (git diff --quiet --exit-code; $LASTEXITCODE -ne 0) -or 
                  (git diff --cached --quiet --exit-code; $LASTEXITCODE -ne 0)
    
    if (-not $hasChanges) {
        Show-Info "Aucune modification détectée."
        Read-Host "Appuyez sur Entrée pour continuer"
        return
    }

    # Statut
    Write-Host "[1/5] 📋 Vérification du statut..." -ForegroundColor Yellow
    git status --short
    Write-Host ""

    # Ajouter fichiers
    Write-Host "[2/5] ➕ Ajout des fichiers..." -ForegroundColor Yellow
    git add .
    Show-Success "Tous les fichiers ont été ajoutés!"
    Write-Host ""

    # Message de commit
    $commitMessage = Read-Host "[3/5] 💬 Message de commit (Entrée = message auto)"
    if ([string]::IsNullOrWhiteSpace($commitMessage)) {
        $timestamp = Get-Date -Format "dd/MM/yyyy à HH:mm"
        $commitMessage = "Mise à jour du $timestamp"
    }

    # Commit
    Write-Host "[4/5] 💾 Création du commit..." -ForegroundColor Yellow
    git commit -m $commitMessage
    if ($LASTEXITCODE -ne 0) {
        Show-Error "Erreur lors du commit!"
        Read-Host "Appuyez sur Entrée pour continuer"
        return
    }
    Show-Success "Commit créé avec succès!"
    Write-Host ""

    # Push
    $currentBranch = git branch --show-current
    Write-Host "[5/5] 🚀 Push vers GitHub (branche: $currentBranch)..." -ForegroundColor Yellow
    git push origin $currentBranch

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ ================================" -ForegroundColor Green
        Write-Host "   SUCCÈS! 🎉" -ForegroundColor Green
        Write-Host "================================" -ForegroundColor Green
        Write-Host "📤 Code poussé vers GitHub" -ForegroundColor White
        Write-Host "🌐 https://github.com/Christophe72/chantier-rapport" -ForegroundColor Blue
        Write-Host "🌿 Branche: $currentBranch" -ForegroundColor White
        Write-Host "💬 Message: $commitMessage" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "❌ ================================" -ForegroundColor Red
        Write-Host "   ERREUR lors du push" -ForegroundColor Red
        Write-Host "================================" -ForegroundColor Red
        Write-Host ""
        Write-Host "🔍 Solutions possibles:" -ForegroundColor Yellow
        Write-Host "  • Vérifiez votre connexion internet" -ForegroundColor White
        Write-Host "  • Exécutez un pull d'abord" -ForegroundColor White
        Write-Host "  • Vérifiez vos identifiants GitHub" -ForegroundColor White
        Write-Host ""
    }
    Read-Host "Appuyez sur Entrée pour continuer"
}

function Show-GitStatus {
    Show-Header
    Write-Host "   📊 STATUT GIT" -ForegroundColor Yellow
    Write-Host "===========================================" -ForegroundColor Cyan
    Write-Host ""
    git status
    Write-Host ""
    Write-Host "📋 Résumé:" -ForegroundColor Yellow
    git status --short
    Write-Host ""
    Read-Host "Appuyez sur Entrée pour continuer"
}

function Show-GitHistory {
    Show-Header
    Write-Host "   📋 HISTORIQUE DES COMMITS" -ForegroundColor Yellow
    Write-Host "===========================================" -ForegroundColor Cyan
    Write-Host ""
    git log --oneline -10
    Write-Host ""
    Write-Host "(Affichage des 10 derniers commits)" -ForegroundColor Gray
    Write-Host ""
    Read-Host "Appuyez sur Entrée pour continuer"
}

function Pull-FromGitHub {
    Show-Header
    Write-Host "   🔄 PULL DEPUIS GITHUB" -ForegroundColor Yellow
    Write-Host "===========================================" -ForegroundColor Cyan
    Write-Host ""
    $currentBranch = git branch --show-current
    Write-Host "📥 Récupération depuis GitHub (branche: $currentBranch)..." -ForegroundColor Yellow
    git pull origin $currentBranch

    if ($LASTEXITCODE -eq 0) {
        Show-Success "Pull réussi!"
    } else {
        Show-Error "Erreur lors du pull!"
    }
    Write-Host ""
    Read-Host "Appuyez sur Entrée pour continuer"
}

function Switch-Branch {
    Show-Header
    Write-Host "   🌿 CHANGER DE BRANCHE" -ForegroundColor Yellow
    Write-Host "===========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Branches disponibles:" -ForegroundColor Yellow
    git branch -a
    Write-Host ""
    $nouvelleBranche = Read-Host "Nom de la branche (ou 'retour' pour annuler)"
    if ($nouvelleBranche -eq "retour") { return }

    git checkout $nouvelleBranche
    if ($LASTEXITCODE -eq 0) {
        Show-Success "Changement vers la branche '$nouvelleBranche' réussi!"
    } else {
        Show-Error "Erreur lors du changement de branche!"
    }
    Write-Host ""
    Read-Host "Appuyez sur Entrée pour continuer"
}

# Fonction principale
function Main {
    Test-GitRepository

    do {
        Show-Header
        Write-Host "Choisissez une action:" -ForegroundColor White
        Write-Host ""
        Write-Host "[1] 📤 Push rapide (add + commit + push)" -ForegroundColor Green
        Write-Host "[2] 📊 Voir le statut Git" -ForegroundColor Blue
        Write-Host "[3] 📋 Voir l'historique des commits" -ForegroundColor Blue
        Write-Host "[4] 🔄 Pull depuis GitHub" -ForegroundColor Cyan
        Write-Host "[5] 🌿 Changer de branche" -ForegroundColor Magenta
        Write-Host "[6] ❌ Quitter" -ForegroundColor Red
        Write-Host ""
        
        $choice = Read-Host "Votre choix (1-6)"
        
        switch ($choice) {
            "1" { Push-ToGitHub }
            "2" { Show-GitStatus }
            "3" { Show-GitHistory }
            "4" { Pull-FromGitHub }
            "5" { Switch-Branch }
            "6" { 
                Show-Header
                Write-Host "   👋 AU REVOIR!" -ForegroundColor Yellow
                Write-Host "===========================================" -ForegroundColor Cyan
                Write-Host ""
                Write-Host "Merci d'avoir utilisé le gestionnaire Git!" -ForegroundColor Green
                Write-Host "Votre application de gestion de chantiers est à jour." -ForegroundColor White
                Write-Host ""
                Write-Host "🌐 Repository: https://github.com/Christophe72/chantier-rapport" -ForegroundColor Blue
                Write-Host ""
                Read-Host "Appuyez sur Entrée pour quitter"
                return 
            }
            default { 
                Write-Host "Choix invalide. Veuillez choisir entre 1 et 6." -ForegroundColor Red
                Start-Sleep 2
            }
        }
    } while ($true)
}

# Lancer le script
Main
