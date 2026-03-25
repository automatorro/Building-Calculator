# CLAUDE.md — BuildingCalc
# Acest fișier este citit automat de Claude Code la fiecare sesiune.

## PRIMA ACȚIUNE — OBLIGATORIE, FĂRĂ EXCEPȚIE:
Citește CLAUDE_CODE_MASTER.md. Așteaptă să îți spun ce task execuți.

## ⛔ INTERZIS — NU FACE NICIODATĂ:
- NU face `git commit`, `git add`, `git push` sau orice comandă git
- NU bifează [x] în CLAUDE_CODE_MASTER.md
- NU trece la alt task fără să îți spun eu
- NU atinge `utils/calculators/estimate.ts`
- NU atinge `utils/calculators/financials.ts`
- NU atinge `middleware.ts`

## PROTOCOL DE COMUNICARE — RESPECTĂ EXACT:

### Când primești un task:
Spune: "Am înțeles. Execut [numele task-ului]. Încep prin a citi [fișierele relevante]."

### Când termini modificările:
Rulează `npm run build`. Apoi raportează EXACT în acest format:

```
✅ TASK COMPLETAT: M[x].[y] — [descriere scurtă]

Fișiere modificate:
- [cale/fișier1.tsx] — [ce s-a schimbat în 5 cuvinte]
- [cale/fișier2.tsx] — [ce s-a schimbat în 5 cuvinte]

Fișiere create:
- [cale/fișier_nou.tsx] (dacă e cazul)

Build: PASS ✅

👉 Poți face commit și push din Antigravity.
   Mesaj commit recomandat: "M[x].[y]: [descriere]"
   După push, spune-mi și îți dau următorul task.
```

### Dacă build-ul eșuează:
```
⚠️ BUILD FAIL — repar acum, nu face commit.
[repară]
✅ BUILD REPARAT — acum poți face commit.
```

### Dacă nu ești sigur de ceva:
```
❓ ÎNTREBARE: [întrebarea concretă]
Aștept răspunsul tău înainte de a continua.
```

## DACĂ NU EȘTI SIGUR:
Întreabă. Nu presupune. Nu rescrie. Nu adăuga de la tine.
