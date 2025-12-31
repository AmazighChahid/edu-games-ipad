---
description: Audit complet du projet (conformité UI, structure, code quality)
---

# Audit Complet du Projet

## Documents de référence

CHARGER ces documents pour l'audit :

1. `@docs/GUIDELINES_AUDIT.md` — Méthodologie d'audit
2. `@docs/DESIGN_SYSTEM.md` — Tokens à vérifier
3. `@docs/TRAME_REFERENTIEL.md` — Architecture attendue
4. `@docs/UI_COMPONENTS_CATALOG.md` — Composants obligatoires

## Catégories à auditer

### 1. Conformité Structure (score /20)

Pour chaque jeu dans `/src/games/`, vérifier :

- [ ] `index.ts` existe (exports)
- [ ] `types.ts` existe
- [ ] `hooks/use{Nom}Game.ts` existe
- [ ] `logic/{nom}Engine.ts` existe
- [ ] `data/levels.ts` existe
- [ ] `data/assistantScripts.ts` existe
- [ ] `screens/` contient IntroScreen et VictoryScreen

### 2. Conformité UI (score /20)

- [ ] Imports depuis `@/theme` (pas `/constants/`)
- [ ] Touch targets ≥ 64dp
- [ ] Texte courant ≥ 18pt
- [ ] Polices Fredoka (titres) + Nunito (corps)
- [ ] Utilisation de `PageContainer`, `ScreenHeader`, `VictoryCard`

### 3. Conformité Registry (score /20)

- [ ] Tous les jeux dans `registry.ts`
- [ ] Skills valides (parmi les 22 CognitiveSkill)
- [ ] Catégorie valide (logic, memory, spatial, math, language)
- [ ] Routes correctes
- [ ] Statuts cohérents (available, coming_soon)

### 4. Conformité Fiches Éducatives (score /20)

Pour chaque jeu, vérifier dans `/Fiches Educatives/` :

- [ ] FICHE_ACTIVITE.md existe et complète
- [ ] FICHE_PARENT.md existe et complète
- [ ] DIALOGUES_IA.md existe et complète
- [ ] SPECS_TECHNIQUES.md existe et complète

### 5. Code Quality (score /20)

- [ ] TypeScript strict (pas de `any`)
- [ ] Pas de fichiers morts
- [ ] Pas de duplication excessive
- [ ] Hooks suivent le pattern standard

## Format du rapport

```markdown
# Rapport d'Audit — [Date]

## Score Global : XX/100

| Catégorie | Score | Détails |
|-----------|-------|---------|
| Structure | /20 | ... |
| UI | /20 | ... |
| Registry | /20 | ... |
| Fiches | /20 | ... |
| Code | /20 | ... |

## Issues Critiques (à corriger immédiatement)
1. ...

## Issues Majeures (à planifier)
1. ...

## Issues Mineures (nice to have)
1. ...

## Top 5 Actions Prioritaires
1. ...
2. ...
3. ...
4. ...
5. ...
```

## Commandes utiles pour l'audit

```bash
# Trouver les imports obsolètes
grep -r "from '@/constants" src/

# Vérifier les touch targets < 64
grep -rn "width: [0-5][0-9]," src/ --include="*.tsx"

# Lister les jeux sans assistantScripts
find src/games -type d -maxdepth 1 -exec sh -c 'test ! -f "$1/data/assistantScripts.ts" && echo "$1"' _ {} \;

# Compter les fichiers par jeu
for d in src/games/*/; do echo "$d: $(find "$d" -type f | wc -l) fichiers"; done
```
