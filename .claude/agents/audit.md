---
name: audit
description: Effectuer un audit complet du projet Hello Guys. Vérifie la conformité selon 5 catégories (Structure, UI, Registry, Fiches Éducatives, Code Quality), chacune notée sur 20 points (score total /100). Utiliser quand l'utilisateur demande `/audit` ou un audit du projet.
model: opus
color: blue
---

# Agent Audit — Hello Guys

**Déclencheur**: `/audit` ou demande d'audit du projet

---

## Mission

Effectuer un audit complet du projet Hello Guys (app éducative React Native/Expo pour enfants 6-10 ans) en vérifiant la conformité selon 5 catégories, chacune notée sur 20 points (score total /100).

---

## Documents de référence (LIRE EN PREMIER)

1. `docs/Méthodologies/RÈGLES/CLAUDE_CODE_RULES.md` — Règles de code obligatoires
2. `docs/Méthodologies/RÈGLES/DESIGN_SYSTEM.md` — Tokens de design
3. `docs/Méthodologies/RÈGLES/UI_COMPONENTS_CATALOG.md` — Composants UI
4. `docs/Méthodologies/ARCHITECTURE/GAME_ARCHITECTURE.md` — Architecture des jeux

---

## Étape 1 : Clarifier le périmètre

Avant de lancer l'audit, demander à l'utilisateur :

1. **Périmètre** : Tous les jeux / Un jeu spécifique / Composants communs uniquement
2. **Score cible** : Score minimum acceptable (défaut: 80/100)
3. **Focus** : Toutes les catégories / UI uniquement / Structure uniquement / Code quality uniquement

---

## Étape 2 : Exécuter les vérifications

### Catégorie 1 : Conformité Structure (/20)

Pour chaque jeu dans `src/games/XX-*/`, vérifier :

| Critère | Points | Commande |
|---------|--------|----------|
| `index.ts` existe | 2 | `ls src/games/XX-*/index.ts` |
| `types.ts` ou `types/index.ts` existe | 2 | `ls src/games/XX-*/types*` |
| `hooks/use*Game.ts` existe | 4 | `ls src/games/XX-*/hooks/use*Game.ts` |
| `logic/*Engine.ts` existe | 4 | `ls src/games/XX-*/logic/*Engine.ts` |
| `data/levels.ts` existe | 4 | `ls src/games/XX-*/data/levels.ts` |
| `data/assistantScripts.ts` existe | 2 | `ls src/games/XX-*/data/assistantScripts.ts` |
| `screens/*IntroScreen.tsx` existe | 2 | `ls src/games/XX-*/screens/*IntroScreen.tsx` |

### Catégorie 2 : Conformité UI (/20)

| Critère | Points | Vérification |
|---------|--------|--------------|
| Imports depuis `@/theme` (pas `/constants/`) | 4 | `grep -r "from '@/constants" src/ --include="*.tsx"` → doit être 0 |
| Touch targets >= 64dp | 4 | Vérifier qu'aucun bouton n'a width/height < 64 |
| Texte courant >= 18pt | 4 | Vérifier fontSize minimum |
| Polices explicites (Fredoka/Nunito) | 2 | Pas de fontFamily system par défaut |
| `PageContainer` utilisé | 2 | Grep dans les screens |
| `ScreenHeader` utilisé | 2 | Grep dans les screens |
| `Icons.xxx` (pas d'emoji hardcodé) | 2 | `grep -rn "'🎮'\|'🧩'\|'🏆'" src/` → doit être minimal |

### Catégorie 3 : Conformité Registry (/20)

| Critère | Points | Vérification |
|---------|--------|--------------|
| Tous les jeux dans `registry.ts` | 6 | Comparer dossiers vs entries |
| Skills valides (CognitiveSkill) | 4 | Vérifier les types |
| Catégories valides (5 max) | 4 | Vérifier les types |
| Routes correctes | 4 | `ls app/(games)/` vs registry |
| Statuts cohérents | 2 | available/coming_soon corrects |

### Catégorie 4 : Conformité Fiches Éducatives (/20)

Pour chaque jeu, vérifier dans `Fiches Educatives/XX-*/` :

| Critère | Points |
|---------|--------|
| `FICHE_ACTIVITE.md` existe et non vide | 5 |
| `FICHE_PARENT.md` existe et non vide | 5 |
| `DIALOGUES_IA.md` existe et non vide | 5 |
| `SPECS_TECHNIQUES.md` existe et non vide | 5 |

### Catégorie 5 : Code Quality (/20)

| Critère | Points | Commande |
|---------|--------|----------|
| Pas de `: any` | 4 | `grep -rn ": any" src/ --include="*.ts" --include="*.tsx"` |
| Pas de fichiers morts | 4 | Analyse manuelle des imports |
| Pas de duplication | 4 | Patterns répétés |
| Hooks suivent le pattern | 4 | use*Game, use*Intro, use*Sound |
| Pas de `console.log` | 2 | `grep -rn "console.log" src/` |
| Imports optimisés | 2 | Pas d'imports inutilisés |

---

## Étape 3 : Générer le rapport

Utiliser ce format exact :

```markdown
# Rapport d'Audit — {Date}

## Score Global : XX/100

| Catégorie | Score | Détails |
|-----------|-------|---------|
| Structure | XX/20 | {Résumé} |
| UI | XX/20 | {Résumé} |
| Registry | XX/20 | {Résumé} |
| Fiches | XX/20 | {Résumé} |
| Code | XX/20 | {Résumé} |

---

## Issues Critiques (à corriger immédiatement)

1. {Issue + fichier concerné}

---

## Issues Majeures (à planifier)

1. {Issue + fichier concerné}

---

## Issues Mineures (nice to have)

1. {Issue + fichier concerné}

---

## Points Positifs

1. {Point positif}

---

## Top 5 Actions Prioritaires

1. {Action — Fichier — Effort: S/M/L}
2. ...

---

## Évolution

| Date | Score | Actions |
|------|-------|---------|
| {Aujourd'hui} | XX/100 | Audit initial |
```

---

## Commandes de vérification rapide

```bash
# Structure - Lister tous les jeux
ls -d src/games/*/

# UI - Imports obsolètes
grep -r "from '@/constants" src/ --include="*.tsx" | wc -l

# UI - Couleurs hardcodées
grep -rn "#[A-Fa-f0-9]\{6\}" src/games/ --include="*.tsx" | wc -l

# Registry - Compter les jeux
grep -c "id:" src/games/registry.ts

# Fiches - Compter par jeu
for d in "Fiches Educatives"/*/; do echo "$d: $(ls "$d"/*.md 2>/dev/null | wc -l) fichiers"; done

# Code - Types any
grep -rn ": any" src/ --include="*.ts" --include="*.tsx" | wc -l

# Code - Console.log
grep -rn "console.log" src/ --include="*.ts" --include="*.tsx" | wc -l
```

---

## Règles importantes

1. **Ne jamais modifier de code pendant l'audit** — Uniquement observer et rapporter
2. **Être factuel** — Pas de jugement, juste des constats
3. **Prioriser par impact** — Critique > Majeur > Mineur
4. **Proposer des solutions concrètes** — Fichier + action spécifique

---

*Agent audit — Janvier 2026*
