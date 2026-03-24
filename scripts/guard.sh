#!/bin/bash
# ============================================================
# scripts/guard.sh — Verificare automată BuildingCalc
# Rulează OBLIGATORIU:
#   ÎNAINTE de task:  bash scripts/guard.sh pre
#   DUPĂ task:        bash scripts/guard.sh post
# ============================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROTECTED_FILES=(
  "utils/calculators/estimate.ts"
  "utils/calculators/financials.ts"
  "middleware.ts"
)

check_protected_files() {
  echo -e "\n${YELLOW}[GUARD]${NC} Verificare fișiere protejate..."
  local violations=0
  for file in "${PROTECTED_FILES[@]}"; do
    if git diff --name-only HEAD 2>/dev/null | grep -q "$file"; then
      echo -e "  ${RED}✗ BLOCAT: $file a fost modificat!${NC}"
      echo -e "  ${RED}  Rulează: git checkout -- $file${NC}"
      violations=$((violations + 1))
    elif git diff --cached --name-only 2>/dev/null | grep -q "$file"; then
      echo -e "  ${RED}✗ BLOCAT (staged): $file a fost modificat!${NC}"
      violations=$((violations + 1))
    else
      echo -e "  ${GREEN}✓${NC} $file — intact"
    fi
  done
  return $violations
}

check_build() {
  echo -e "\n${YELLOW}[GUARD]${NC} Rulare npm run build..."
  if npm run build > /tmp/build_output.txt 2>&1; then
    echo -e "  ${GREEN}✓ Build PASS${NC}"
    return 0
  else
    echo -e "  ${RED}✗ Build FAIL${NC}"
    tail -20 /tmp/build_output.txt
    return 1
  fi
}

check_progress() {
  echo -e "\n${YELLOW}[GUARD]${NC} Status progress tracker:"
  if [ -f "CLAUDE_CODE_MASTER.md" ]; then
    local done=$(grep -c "\[x\]" CLAUDE_CODE_MASTER.md 2>/dev/null || echo 0)
    local todo=$(grep -c "\[ \]" CLAUDE_CODE_MASTER.md 2>/dev/null || echo 0)
    local fail=$(grep -c "\[!\]" CLAUDE_CODE_MASTER.md 2>/dev/null || echo 0)
    echo -e "  Completate: ${GREEN}$done${NC}"
    echo -e "  Rămase:     ${YELLOW}$todo${NC}"
    echo -e "  Eșuate:     ${RED}$fail${NC}"
    echo ""
    echo "  Următorul task:"
    grep -m1 "\[ \]" CLAUDE_CODE_MASTER.md 2>/dev/null || echo "  Toate completate!"
  else
    echo -e "  ${RED}CLAUDE_CODE_MASTER.md nu a fost găsit!${NC}"
  fi
}

show_modified_files() {
  echo -e "\n${YELLOW}[GUARD]${NC} Fișiere modificate (unstaged + staged):"
  git diff --name-only HEAD 2>/dev/null | while read f; do echo "  📝 $f"; done
  git diff --cached --name-only 2>/dev/null | while read f; do echo "  📦 $f (staged)"; done
  local count=$(git diff --name-only HEAD 2>/dev/null | wc -l)
  if [ "$count" -eq 0 ]; then echo "  (nicio modificare)"; fi
}

case "${1:-help}" in
  pre)
    echo -e "${YELLOW}══════════════════════════════════════${NC}"
    echo -e "${YELLOW}   GUARD PRE-TASK — BuildingCalc${NC}"
    echo -e "${YELLOW}══════════════════════════════════════${NC}"
    check_progress
    check_protected_files
    echo -e "\n${GREEN}Gata de lucru. Execută DOAR task-ul curent.${NC}\n"
    ;;
  post)
    echo -e "${YELLOW}══════════════════════════════════════${NC}"
    echo -e "${YELLOW}   GUARD POST-TASK — BuildingCalc${NC}"
    echo -e "${YELLOW}══════════════════════════════════════${NC}"
    check_protected_files || { echo -e "\n${RED}STOP! Fișiere protejate modificate. Revert înainte de commit.${NC}"; exit 1; }
    check_build || { echo -e "\n${RED}STOP! Build-ul a eșuat. Fix înainte de commit.${NC}"; exit 1; }
    show_modified_files
    check_progress
    echo -e "\n${GREEN}✓ Toate verificările OK. Poți face commit.${NC}\n"
    ;;
  *)
    echo "Utilizare: bash scripts/guard.sh [pre|post]"
    echo "  pre  — rulează ÎNAINTE de task (arată status)"
    echo "  post — rulează DUPĂ task (verifică tot)"
    ;;
esac
