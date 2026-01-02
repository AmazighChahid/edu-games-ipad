# Audit Complet du Projet

> **Usage** : Vérifier la conformité globale du projet
> **Fréquence recommandée** : Après chaque sprint ou ajout majeur

---

## Protocole 3 étapes pour un audit

### Étape 1 : Confirmer la lecture

```
✅ J'ai lu : CLAUDE_CODE_RULES.md, DESIGN_SYSTEM.md, UI_COMPONENTS_CATALOG.md
✅ Périmètre audit : [jeu spécifique / projet global]
✅ Score cible : [ex: 80/100]
```

### Étape 2 : Questions de clarification

- Quel périmètre ? (1 jeu / tous les jeux / composants communs)
- Score cible minimum ? (ex: 80/100)
- Focus particulier ? (UI / Structure / Code quality)

### Étape 3 : Plan d'audit

```
📋 PLAN :
1. Exécuter les commandes de vérification par catégorie
2. Compiler les résultats dans le format du rapport
3. Prioriser les issues par sévérité
4. Proposer le Top 5 des actions

→ ATTENDRE VALIDATION avant de lancer l'audit complet
```

---

## Documents de référence à charger

1. `RÈGLES/CLAUDE_CODE_RULES.md` — Règles à vérifier
2. `RÈGLES/DESIGN_SYSTEM.md` — Tokens attendus
3. `RÈGLES/UI_COMPONENTS_CATALOG.md` — Composants obligatoires
4. `ARCHITECTURE/GAME_ARCHITECTURE.md` — Architecture attendue

---

## 5 Catégories d'audit

### 1. Conformité Structure (score /20)

Pour chaque jeu dans `/src/games/`, vérifier :

| Critère | Points |
|---------|--------|
| `index.ts` existe (exports) | 2 |
| `types.ts` existe | 2 |
| `hooks/use{Nom}Game.ts` existe | 4 |
| `logic/{nom}Engine.ts` existe | 4 |
| `data/levels.ts` existe | 4 |
| `data/assistantScripts.ts` existe | 2 |
| `screens/` contient IntroScreen | 2 |

**Commande de vérification** :
```bash
for d in src/games/*/; do
  echo "=== $d ==="
  ls -la "$d"
  echo ""
done
```

---

### 2. Conformité UI (score /20)

| Critère | Points |
|---------|--------|
| Imports depuis `@/theme` (pas `/constants/`) | 4 |
| Touch targets ≥ 64dp | 4 |
| Texte courant ≥ 18pt | 4 |
| Polices Fredoka (titres) + Nunito (corps) | 2 |
| `PageContainer` utilisé | 2 |
| `ScreenHeader` utilisé | 2 |
| `Icons.xxx` (pas d'emoji hardcodé) | 2 |

**Commandes de vérification** :
```bash
# Imports obsolètes
grep -r "from '@/constants" src/ --include="*.tsx" | wc -l

# Couleurs hardcodées
grep -rn "#[A-Fa-f0-9]\{6\}" src/games/ --include="*.tsx" | wc -l

# Touch targets potentiellement < 64
grep -rn "width: [0-5][0-9]," src/ --include="*.tsx" | head -20

# Emojis hardcodés (approximatif)
grep -rn "'🎮'\|'🧩'\|'🏆'" src/ --include="*.tsx" | wc -l
```

---

### 3. Conformité Registry (score /20)

| Critère | Points |
|---------|--------|
| Tous les jeux présents dans `registry.ts` | 6 |
| Skills valides (parmi les 22 CognitiveSkill) | 4 |
| Catégories valides (5 catégories) | 4 |
| Routes correctes et fonctionnelles | 4 |
| Statuts cohérents (available/coming_soon) | 2 |

**Commande de vérification** :
```bash
# Compter les jeux
grep -c "status:" src/games/registry.ts

# Lister les jeux disponibles
grep -B5 "status: 'available'" src/games/registry.ts | grep "id:"

# Vérifier les routes
ls -la app/\(games\)/
```

---

### 4. Conformité Fiches Éducatives (score /20)

Pour chaque jeu, vérifier dans `/Fiches Educatives/` :

| Critère | Points |
|---------|--------|
| `FICHE_ACTIVITE.md` existe et complète | 5 |
| `FICHE_PARENT.md` existe et complète | 5 |
| `DIALOGUES_IA.md` existe et complète | 5 |
| `SPECS_TECHNIQUES.md` existe et complète | 5 |

**Commande de vérification** :
```bash
# Compter les fichiers par jeu
for d in "Fiches Educatives"/*/; do
  count=$(ls "$d"/*.md 2>/dev/null | wc -l)
  echo "$d: $count fichiers"
done
```

---

### 5. Code Quality (score /20)

| Critère | Points |
|---------|--------|
| TypeScript strict (pas de `any`) | 4 |
| Pas de fichiers morts | 4 |
| Pas de duplication excessive | 4 |
| Hooks suivent le pattern standard | 4 |
| Logs de debug retirés | 2 |
| Imports optimisés | 2 |

**Commandes de vérification** :
```bash
# Rechercher les `any`
grep -rn ": any" src/ --include="*.ts" --include="*.tsx" | wc -l

# Rechercher les console.log
grep -rn "console.log" src/ --include="*.ts" --include="*.tsx" | wc -l

# Fichiers non utilisés (nécessite analyse manuelle)
```

---

## Format du rapport

```markdown
# Rapport d'Audit — {Date}

## Score Global : XX/100

| Catégorie | Score | Détails |
|-----------|-------|---------|
| Structure | /20 | {Résumé} |
| UI | /20 | {Résumé} |
| Registry | /20 | {Résumé} |
| Fiches | /20 | {Résumé} |
| Code | /20 | {Résumé} |

---

## 🔴 Issues Critiques (à corriger immédiatement)

1. {Issue critique 1}
2. {Issue critique 2}

---

## 🟠 Issues Majeures (à planifier)

1. {Issue majeure 1}
2. {Issue majeure 2}

---

## 🟡 Issues Mineures (nice to have)

1. {Issue mineure 1}
2. {Issue mineure 2}

---

## ✅ Points Positifs

1. {Point positif 1}
2. {Point positif 2}

---

## 📋 Top 5 Actions Prioritaires

1. {Action 1 — Fichier — Effort estimé}
2. {Action 2 — Fichier — Effort estimé}
3. {Action 3 — Fichier — Effort estimé}
4. {Action 4 — Fichier — Effort estimé}
5. {Action 5 — Fichier — Effort estimé}

---

## Évolution

| Date | Score | Actions |
|------|-------|---------|
| {Date précédente} | {Score} | {Actions faites} |
| {Date actuelle} | {Score} | — |
```

---

## Script d'audit automatique

```bash
#!/bin/bash
# audit.sh — Script d'audit rapide

echo "=== AUDIT HELLO GUYS ==="
echo ""

echo "1. STRUCTURE"
echo "Jeux trouvés:"
ls -d src/games/*/ 2>/dev/null | wc -l
echo ""

echo "2. IMPORTS OBSOLÈTES"
echo "Imports @/constants:"
grep -r "from '@/constants" src/ --include="*.tsx" 2>/dev/null | wc -l
echo ""

echo "3. COULEURS HARDCODÉES"
grep -rn "#[A-Fa-f0-9]\{6\}" src/games/ --include="*.tsx" 2>/dev/null | wc -l
echo ""

echo "4. REGISTRY"
echo "Jeux dans registry:"
grep -c "id:" src/games/registry.ts 2>/dev/null
echo ""

echo "5. FICHES ÉDUCATIVES"
for d in "Fiches Educatives"/*/; do
  count=$(ls "$d"/*.md 2>/dev/null | wc -l)
  echo "$d: $count fichiers"
done
echo ""

echo "6. CODE QUALITY"
echo "Occurrences 'any':"
grep -rn ": any" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l
echo "Occurrences console.log:"
grep -rn "console.log" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l
echo ""

echo "=== FIN AUDIT ==="
```

---

## Checklist rapide (pré-commit)

- [ ] Aucun import depuis `/constants/`
- [ ] Aucune couleur hardcodée
- [ ] Touch targets ≥ 64dp
- [ ] Texte ≥ 18pt
- [ ] `Icons.xxx` pour emojis
- [ ] Pas de `console.log`
- [ ] Types complets (pas de `any`)

---

*Préprompt audit — Décembre 2024*
