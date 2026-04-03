# ============================================================
# scripts/guard.ps1 — Verificare automată BuildingCalc (Windows)
# Rulează:
#   .\scripts\guard.ps1 pre
#   .\scripts\guard.ps1 post
# ============================================================

param (
    [Parameter(Mandatory=$false)]
    [ValidateSet("pre", "post")]
    [string]$Action = "help"
)

$PROTECTED_FILES = @(
    "utils/calculators/estimate.ts",
    "utils/calculators/financials.ts",
    "middleware.ts"
)

function Check-ProtectedFiles {
    Write-Host "`n[GUARD] Verificare fișiere protejate..." -ForegroundColor Yellow
    $violations = 0
    foreach ($file in $PROTECTED_FILES) {
        $modified = git diff --name-only HEAD | Select-String -Pattern [regex]::Escape($file) -Quiet
        $staged = git diff --cached --name-only | Select-String -Pattern [regex]::Escape($file) -Quiet
        
        if ($modified -or $staged) {
            Write-Host "  ✗ BLOCAT: $file a fost modificat!" -ForegroundColor Red
            Write-Host "    Rulează: git checkout -- $file" -ForegroundColor Red
            $violations++
        } else {
            Write-Host "  ✓ $file — intact" -ForegroundColor Green
        }
    }
    return $violations
}

function Check-Build {
    Write-Host "`n[GUARD] Rulare npm run build..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Build PASS" -ForegroundColor Green
        return $true
    } else {
        Write-Host "  ✗ Build FAIL" -ForegroundColor Red
        return $false
    }
}

function Check-Progress {
    Write-Host "`n[GUARD] Status progress tracker:" -ForegroundColor Yellow
    if (Test-Path "CLAUDE_CODE_MASTER.md") {
        $content = Get-Content "CLAUDE_CODE_MASTER.md"
        $done = ($content | Select-String -Pattern "\[x\]" -AllMatches).Count
        $todo = ($content | Select-String -Pattern "\[ \]" -AllMatches).Count
        $fail = ($content | Select-String -Pattern "\[!\]" -AllMatches).Count
        
        Write-Host "  Completate: $done" -ForegroundColor Green
        Write-Host "  Rămase:     $todo" -ForegroundColor Yellow
        Write-Host "  Eșuate:     $fail" -ForegroundColor Red
        Write-Host ""
        Write-Host "  Următorul task:"
        $next = $content | Select-String -Pattern "\[ \]" | Select-Object -First 1
        if ($next) { Write-Host "  $($next.Line)" } else { Write-Host "  Toate completate!" }
    } else {
        Write-Host "  ✗ CLAUDE_CODE_MASTER.md nu a fost găsit!" -ForegroundColor Red
    }
}

function Show-ModifiedFiles {
    Write-Host "`n[GUARD] Fișiere modificate (unstaged + staged):" -ForegroundColor Yellow
    $files = git diff --name-only HEAD
    $staged = git diff --cached --name-only
    
    foreach ($f in $files) { Write-Host "  📝 $f" }
    foreach ($f in $staged) { Write-Host "  📦 $f (staged)" }
    
    if (($files.Count + $staged.Count) -eq 0) { Write-Host "  (nicio modificare)" }
}

switch ($Action) {
    "pre" {
        Write-Host "══════════════════════════════════════" -ForegroundColor Yellow
        Write-Host "   GUARD PRE-TASK — BuildingCalc (Win)" -ForegroundColor Yellow
        Write-Host "══════════════════════════════════════" -ForegroundColor Yellow
        Check-Progress
        Check-ProtectedFiles
        Write-Host "`nGata de lucru. Execută DOAR task-ul curent." -ForegroundColor Green
    }
    "post" {
        Write-Host "══════════════════════════════════════" -ForegroundColor Yellow
        Write-Host "   GUARD POST-TASK — BuildingCalc (Win)" -ForegroundColor Yellow
        Write-Host "══════════════════════════════════════" -ForegroundColor Yellow
        $p = Check-ProtectedFiles
        if ($p -gt 0) {
            Write-Host "`nSTOP! Fișiere protejate modificate. Revert înainte de commit." -ForegroundColor Red
            exit 1
        }
        $b = Check-Build
        if (-not $b) {
            Write-Host "`nSTOP! Build-ul a eșuat. Fix înainte de commit." -ForegroundColor Red
            exit 1
        }
        Show-ModifiedFiles
        Check-Progress
        Write-Host "`n✓ Toate verificările OK. Poți face commit." -ForegroundColor Green
    }
    Default {
        Write-Host "Utilizare: .\scripts\guard.ps1 [pre|post]"
    }
}
