#!/bin/bash
# ============================================================
# .githooks/pre-commit — Gard automat la commit
# Instalare: git config core.hooksPath .githooks
# ============================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

PROTECTED=(
  "utils/calculators/estimate.ts"
  "utils/calculators/financials.ts"
  "middleware.ts"
)

BLOCKED=0

for file in "${PROTECTED[@]}"; do
  if git diff --cached --name-only | grep -q "$file"; then
    echo -e "${RED}BLOCAT: $file este protejat și nu poate fi modificat.${NC}"
    echo -e "${RED}Rulează: git reset HEAD -- $file && git checkout -- $file${NC}"
    BLOCKED=1
  fi
done

if [ $BLOCKED -eq 1 ]; then
  echo ""
  echo -e "${RED}Commit BLOCAT. Elimină modificările din fișierele protejate.${NC}"
  exit 1
fi

echo -e "${GREEN}Pre-commit: fișiere protejate OK${NC}"
exit 0
