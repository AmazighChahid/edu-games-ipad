# 📚 INDEX DOCUMENTATION — Hello Guys

> **Application Éducative iPad** — Guide d'utilisation des documents
> **Version** : 2.0 — Décembre 2024
> **Conformité UI** : 89%

---

## 🚀 Quick Start — Pré-prompts Claude Code

### 🆕 Créer un nouveau composant UI

```
AVANT DE CODER, lis ces documents :
1. docs/CLAUDE_CODE_RULES.md (règles obligatoires)
2. docs/UI_COMPONENTS_CATALOG.md (composants à utiliser)
3. docs/DESIGN_SYSTEM.md (tokens couleurs, typo, spacing)

RÈGLES CRITIQUES :
- Import thème : `import { theme } from '@/theme'`
- Touch targets : ≥ 64dp minimum
- Texte courant : ≥ 18pt minimum
- Polices : Fredoka (titres) + Nunito (corps)
- NE JAMAIS recréer : BackButton, ScreenHeader, PageContainer, GameModal, VictoryCard
```

---

### 🎮 Créer une nouvelle activité/jeu

```
AVANT DE CODER, lis ces documents :
1. docs/PROJECT_STRUCTURE.md (structure /src/games/)
2. docs/MASCOTTES_REGISTRY.md (choisir/créer la mascotte)
3. docs/CLAUDE_CODE_RULES.md (règles UI)
4. Fiches Educatives/ (si disponible pour ce jeu)

STRUCTURE OBLIGATOIRE d'un jeu :
/src/games/{nom-du-jeu}/
├── index.ts
├── types.ts
├── components/
├── hooks/use{NomJeu}Game.ts
├── data/assistantScripts.ts
└── screens/{NomJeu}IntroScreen.tsx

APRÈS CRÉATION, ajouter dans :
- src/games/registry.ts
- app/(games)/{XX-nom-du-jeu}/
```

---

### 🔧 Refactoriser un écran existant

```
AVANT DE MODIFIER, lis :
1. docs/PROMPT_REFACTORING.md (prompts prêts à l'emploi)
2. docs/GUIDELINES_AUDIT.md (violations connues)

CHECKLIST REFACTORING :
- [ ] Remplacer imports /constants/ → /theme/
- [ ] Utiliser ScreenHeader (pas de header custom)
- [ ] Utiliser PageContainer (wrapper obligatoire)
- [ ] Vérifier touch targets ≥ 64dp
- [ ] Vérifier fontSize ≥ 18pt
```

---

## 📋 Liste complète des documents

### 📁 À la racine du projet

| Fichier | Description | Priorité |
|---------|-------------|----------|
| `claude.md` | Instructions principales Claude Code | 🔴 Critique |
| `README.md` | README du projet | 🟡 Référence |

---

### 📁 Dans `/docs/`

#### 🔴 Documents critiques (lire en premier)

| Fichier | Catégorie | Description |
|---------|-----------|-------------|
| `CLAUDE_CODE_RULES.md` | IA/Dev | Règles obligatoires pour Claude Code |
| `DESIGN_SYSTEM.md` | UI/UX | Tokens couleurs, typo, spacing, animations |
| `PROJECT_STRUCTURE.md` | Architecture | Structure du projet, conventions |

#### 🟠 Documents essentiels

| Fichier | Catégorie | Description |
|---------|-----------|-------------|
| `UI_PATTERNS.md` | UI/UX | Patterns composants standardisés |
| `UI_COMPONENTS_CATALOG.md` | UI/UX | Catalogue composants prêts à l'emploi |
| `MASCOTTES_REGISTRY.md` | Pédagogie | Registre des mascottes par jeu |
| `GUIDELINES_AUDIT.md` | Qualité | Audit conformité UX (89%) |

#### 🟡 Documents de référence

| Fichier | Catégorie | Description |
|---------|-----------|-------------|
| `PROMPT_REFACTORING.md` | IA/Dev | Prompts pour homogénéisation |
| `SYNTHESE_STANDARDISATION.md` | Historique | Résumé des migrations effectuées |
| `IMPLEMENTATION_SUMMARY.md` | État | Avancement global du projet |
| `AUDIO_IMPROVEMENTS.md` | Audio | Système sonore, hook useSound |

#### 🟢 Documents spécialisés

| Fichier | Catégorie | Description |
|---------|-----------|-------------|
| `MASCOT_ROBOT_IMPLEMENTATION.md` | Technique | Implémentation mascotte Robot |
| `ROBOT_VISUAL_GUIDE.md` | Design | Guide visuel du robot Pixel |
| `PLAN_HOME_V9.md` | Planification | Plan Home "Forêt Magique" |
| `CHANGELOG_SUITES_LOGIQUES.md` | Changelog | Historique Suites Logiques |

---

### 📁 Dans `/Fiches Educatives/`

#### Fiches complètes ✅

| Dossier | Jeu | Contenu |
|---------|-----|---------|
| `01-Tour de Hanoï/` | Tour de Hanoï | FICHE_ACTIVITE, FICHE_PARENT, DIALOGUES_IA, SPECS_TECHNIQUES |
| `02-suites-logiques/` | Suites Logiques | Complet |
| `03-labyrinthe/` | Labyrinthe | Complet |
| `04-balance/` | Balance Logique | Complet |
| `05-sudoku/` | Sudoku Montessori | Complet + IMPLEMENTATION_SUMMARY |
| `06-Conteur Curieux/` | Le Conteur Curieux | Partiel (HTML briefs) |

#### Fiches à créer ❌

| Jeu | Priorité |
|-----|----------|
| 07-Memory | 🟠 Moyenne |
| 08-Puzzle Formes (Tangram) | 🟠 Moyenne |
| 09-Logix Grid | 🟠 Moyenne |
| 10-Mots Croisés | 🟡 Basse |
| 11-MathBlocks | 🟠 Moyenne |
| 12-Matrices Magiques | 🟢 Future (jeu 🔜) |

---

## 🎮 Liste des jeux (12)

| # | Jeu | Route | Mascotte | Statut |
|---|-----|-------|----------|--------|
| 01 | Tour de Hanoï | `/(games)/01-hanoi` | 🐵 Léo | ✅ |
| 02 | Suites Logiques | `/(games)/02-suites-logiques` | 🤖 Pixel | ✅ |
| 03 | Labyrinthe | `/(games)/03-labyrinthe` | 🐿️ Scout | ✅ |
| 04 | Balance Logique | `/(games)/04-balance` | 🦉 Libra | ✅ |
| 05 | Sudoku Montessori | `/(games)/05-sudoku` | 🦉 Prof. Hoo | ✅ |
| 06 | Le Conteur Curieux | `/(games)/06-conteur-curieux` | 🪶 Plume | ✅ |
| 07 | Memory | `/(games)/07-memory` | 🐘 Memo | ✅ |
| 08 | Puzzle Formes | `/(games)/08-tangram` | 🦊 Géo | ✅ |
| 09 | Logix Grid | `/(games)/09-logix-grid` | 🐜 Ada | ✅ |
| 10 | Mots Croisés | `/(games)/10-mots-croises` | 🦜 Lexie | ✅ |
| 11 | MathBlocks | `/(games)/11-math-blocks` | 🦫 Calc | ✅ |
| 12 | Matrices Magiques | `/(games)/12-matrices-magiques` | ✨ Mystic | 🔜 |

---

## ⚠️ Règles essentielles (mémo)

| Règle | Valeur | Fichier référence |
|-------|--------|-------------------|
| Import thème | `import { theme } from '@/theme'` | CLAUDE_CODE_RULES.md |
| Touch targets | ≥ 64dp minimum | DESIGN_SYSTEM.md |
| Texte courant | ≥ 18pt minimum | DESIGN_SYSTEM.md |
| Polices | Fredoka (titres) + Nunito (corps) | DESIGN_SYSTEM.md |
| Animations | Reanimated 3 avec spring | DESIGN_SYSTEM.md |
| Imports obsolètes | ❌ `/constants/` → ✅ `/theme/` | CLAUDE_CODE_RULES.md |

---

## 💡 Mémo navigation rapide

```
🆕 Nouveau composant    → CLAUDE_CODE_RULES + UI_COMPONENTS_CATALOG
🎮 Nouveau jeu          → PROJECT_STRUCTURE + MASCOTTES_REGISTRY
🔊 Ajouter son          → AUDIO_IMPROVEMENTS
🏠 Modifier Home        → UI_PATTERNS (section V10)
🎨 Changer style        → DESIGN_SYSTEM + theme/
🔧 Refactoring          → PROMPT_REFACTORING + GUIDELINES_AUDIT
🐵 Ajouter mascotte     → MASCOTTES_REGISTRY
🤖 Config Claude        → claude.md + CLAUDE_CODE_RULES
```

---

## 📊 État de la documentation

| Métrique | Valeur | Objectif |
|----------|--------|----------|
| Documents à jour | 85% | 95% |
| Fiches éducatives | 6/12 | 12/12 |
| Conformité UI | 89% | 95% |
| Mascottes documentées | 12/12 | ✅ |

---

## 🔄 Historique des mises à jour

| Date | Version | Changements |
|------|---------|-------------|
| Déc 2024 | 2.0 | Ajout MASCOTTES_REGISTRY, correction références, audit complet |
| Déc 2024 | 1.5 | Ajout CLAUDE_CODE_RULES, UI_COMPONENTS_CATALOG |
| Déc 2024 | 1.0 | Création initiale |

---

*Index mis à jour le 27 Décembre 2024*
*Prochaine revue : Après complétion des Fiches Éducatives manquantes*
