# Script PowerShell simple pour Git
param(
    [string]$Action = "menu"
)

# Configuration
$ErrorActionPreference = "SilentlyContinue"

function Write-ColorText {
    param([string]$Text, [string]$Color = "White")
    Write-Host $Text -ForegroundColor $Color
}

function Show-Header {
    Clear-Host
    Write-ColorText "=========================================" "Cyan"
    Write-ColorText "   GIT MANAGER - CHANTIER RAPPORT" "Yellow"
    Write-ColorText "=========================================" "Cyan"
    Write-Host ""
}

function Test-GitRepo {
    if (-not (Test-Path ".git")) {
        Write-ColorText "ERREUR: Pas un repository Git!" "Red"
        Read-Host "Appuyez sur Entree pour quitter"
        exit 1
    }
}

function Push-Changes {
    Show-Header
    Write-ColorText "PUSH VERS GITHUB" "Yellow"
    Write-ColorText "=================" "Cyan"
    Write-Host ""
    
    # Vérifier les changements
    $status = git status --porcelain
    if (-not $status) {
        Write-ColorText "Aucune modification detectee." "Blue"
        Read-Host "Appuyez sur Entree"
        return
    }
    
    # Afficher le statut
    Write-ColorText "[1/4] Verification du statut..." "Yellow"
    git status --short
    Write-Host ""
    
    # Ajouter les fichiers
    Write-ColorText "[2/4] Ajout des fichiers..." "Yellow"
    git add .
    Write-ColorText "Fichiers ajoutes!" "Green"
    Write-Host ""
    
    # Message de commit
    $message = Read-Host "[3/4] Message de commit (Entree = auto)"
    if ([string]::IsNullOrEmpty($message)) {
        $date = Get-Date -Format "dd/MM/yyyy HH:mm"
        $message = "Mise a jour du $date"
    }
    
    # Commit
    Write-ColorText "[4/4] Commit et push..." "Yellow"
    git commit -m $message
    
    if ($LASTEXITCODE -eq 0) {
        $branch = git branch --show-current
        git push origin $branch
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-ColorText "SUCCES! Code pousse vers GitHub" "Green"
            Write-ColorText "Branche: $branch" "White"
            Write-ColorText "Message: $message" "White"
        } else {
            Write-ColorText "ERREUR lors du push!" "Red"
            Write-ColorText "Essayez un pull d'abord" "Yellow"
        }
    } else {
        Write-ColorText "ERREUR lors du commit!" "Red"
    }
    
    Write-Host ""
    Read-Host "Appuyez sur Entree"
}

function Show-Status {
    Show-Header
    Write-ColorText "STATUT GIT" "Yellow"
    Write-ColorText "==========" "Cyan"
    Write-Host ""
    git status
    Write-Host ""
    Read-Host "Appuyez sur Entree"
}

function Show-History {
    Show-Header
    Write-ColorText "HISTORIQUE" "Yellow"
    Write-ColorText "==========" "Cyan"
    Write-Host ""
    git log --oneline -10
    Write-Host ""
    Read-Host "Appuyez sur Entree"
}

function Pull-Changes {
    Show-Header
    Write-ColorText "PULL DEPUIS GITHUB" "Yellow"
    Write-ColorText "==================" "Cyan"
    Write-Host ""
    
    $branch = git branch --show-current
    Write-ColorText "Pull depuis la branche $branch..." "Yellow"
    git pull origin $branch
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColorText "Pull reussi!" "Green"
    } else {
        Write-ColorText "Erreur lors du pull!" "Red"
    }
    
    Write-Host ""
    Read-Host "Appuyez sur Entree"
}

function Show-Menu {
    while ($true) {
        Show-Header
        Write-ColorText "Choisissez une action:" "White"
        Write-Host ""
        Write-ColorText "[1] Push rapide (add + commit + push)" "Green"
        Write-ColorText "[2] Voir le statut Git" "Blue"
        Write-ColorText "[3] Voir l'historique" "Blue"
        Write-ColorText "[4] Pull depuis GitHub" "Cyan"
        Write-ColorText "[5] Quitter" "Red"
        Write-Host ""
        
        $choice = Read-Host "Votre choix (1-5)"
        
        switch ($choice) {
            "1" { Push-Changes }
            "2" { Show-Status }
            "3" { Show-History }
            "4" { Pull-Changes }
            "5" { 
                Show-Header
                Write-ColorText "Au revoir!" "Yellow"
                Write-ColorText "Repository: https://github.com/Christophe72/chantier-rapport" "Blue"
                Write-Host ""
                exit 0
            }
            default { 
                Write-ColorText "Choix invalide!" "Red"
                Start-Sleep 1
            }
        }
    }
}

# Point d'entrée principal
Test-GitRepo

switch ($Action) {
    "push" { Push-Changes }
    "status" { Show-Status }
    "history" { Show-History }
    "pull" { Pull-Changes }
    default { Show-Menu }
}
