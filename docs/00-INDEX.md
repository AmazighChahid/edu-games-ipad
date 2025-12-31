# 📚 INDEX DOCUMENTATION — Hello Guys

> **Version** : 4.0 — Décembre 2024 | **Conformité UI** : 91%

---

## 🎯 Principe d'organisation

**Une source de vérité par type d'info.** Les autres documents pointent vers la source.

| Type d'info | Source de vérité | Chemin complet |
|-------------|------------------|----------------|
| Tokens design | `DESIGN_SYSTEM.md` | `Méthodologies/RÈGLES/` |
| Règles code | `CLAUDE_CODE_RULES.md` | `Méthodologies/RÈGLES/` |
| Props composants | `UI_COMPONENTS_CATALOG.md` | `Méthodologies/RÈGLES/` |
| Architecture jeux | `GAME_ARCHITECTURE.md` | `Méthodologies/ARCHITECTURE/` |
| Types universels | `TRAME_REFERENTIEL.md` | `Méthodologies/ARCHITECTURE/` |
| Structure projet | `PROJECT_STRUCTURE.md` | `Méthodologies/ARCHITECTURE/` |
| Mascottes | `MASCOTTES_REGISTRY.md` | `Méthodologies/REGISTRES/` |
| Icônes | `ICONS_REGISTRY.md` | `Méthodologies/REGISTRES/` |

---

## 🤖 Protocole Claude Code (OBLIGATOIRE)

**Avant chaque tâche, suivre ces 3 étapes :**

### 1. Confirmer la lecture
```
✅ J'ai lu [documents] — Points clés : [résumé]
✅ Règles critiques retenues : [liste]
✅ Composants à réutiliser : [liste]
```

### 2. Poser 2-3 questions de clarification
```
❓ [Question sur cas particulier, priorité, contrainte...]
```

### 3. Présenter le plan d'action
```
📋 PLAN :
1. Fichiers à examiner : [liste]
2. Modifications : [liste ordonnée]
3. Tests : [liste]
4. Livrables : [fichiers créés/modifiés]

→ ATTENDRE VALIDATION avant implémentation.
```

---

## 🚀 Pré-prompts Claude Code

### Sommaire

| # | Pré-prompt | Fichier détaillé | Usage |
|---|------------|------------------|-------|
| 1 | [Nouveau composant](#-nouveau-composant-ui) | `PRÉPROMPTS DÉTAILLÉS/nouveau-composant.md` | Créer un composant |
| 2 | [Nouveau jeu](#-nouveau-jeu) | `PRÉPROMPTS DÉTAILLÉS/nouveau-jeu.md` | Ajouter une activité |
| 3 | [Fiche éducative](#-créer-fiche-éducative) | `PRÉPROMPTS DÉTAILLÉS/fiche-educative.md` | Créer les 4 docs |
| 4 | [Audit projet](#-audit-projet) | `PRÉPROMPTS DÉTAILLÉS/audit.md` | Vérifier conformité |
| 5 | [Sync documentation](#-synchroniser-documentation) | `PRÉPROMPTS DÉTAILLÉS/sync-docs.md` | MAJ tous les docs |
| 6 | [Refactoring écran](#-refactoring-écran) | `ÉTAT/PROMPT_REFACTORING.md` | Homogénéiser écran |
| 7 | [Bug fix](#-corriger-un-bug) | — | Correction ciblée |

---

### 🆕 Nouveau composant UI
```
LIRE : 
- Méthodologies/RÈGLES/CLAUDE_CODE_RULES.md
- Méthodologies/RÈGLES/UI_COMPONENTS_CATALOG.md
- Méthodologies/RÈGLES/DESIGN_SYSTEM.md
- Méthodologies/REGISTRES/ICONS_REGISTRY.md

RÈGLES :
- Import : `import { theme } from '@/theme'`
- Touch targets : ≥ 64dp | Texte : ≥ 18pt
- Icônes : `import { Icons } from '@/constants/icons'`
- NE PAS recréer les composants existants

→ Confirmer lecture, poser questions, planifier.
```

**Fichier détaillé** : `Méthodologies/PRÉPROMPTS DÉTAILLÉS/nouveau-composant.md`

---

### 🎮 Nouveau jeu
```
LIRE :
- Méthodologies/ARCHITECTURE/TRAME_REFERENTIEL.md
- Méthodologies/ARCHITECTURE/GAME_ARCHITECTURE.md
- Méthodologies/REGISTRES/MASCOTTES_REGISTRY.md
- Fiches Educatives/01-Tour de Hanoï/ (template)

PHASES :
1. Fiches dans /Fiches Educatives/{XX-NomJeu}/
2. Code dans /src/games/{XX-nomJeu}/
3. Registry + route
4. Tests

→ Confirmer lecture, poser questions, planifier.
```

**Fichier détaillé** : `Méthodologies/PRÉPROMPTS DÉTAILLÉS/nouveau-jeu.md`

---

### 📝 Créer fiche éducative
```
LIRE :
- Fiches Educatives/01-Tour de Hanoï/ (template complet)
- Méthodologies/CONTEXTE/INSTRUCTIONS_PROJET_APP_EDUCATIVE.md

4 FICHIERS À CRÉER :
1. FICHE_ACTIVITE.md
2. FICHE_PARENT.md
3. DIALOGUES_IA.md
4. SPECS_TECHNIQUES.md

→ Confirmer lecture, poser questions, planifier.
```

**Fichier détaillé** : `Méthodologies/PRÉPROMPTS DÉTAILLÉS/fiche-educative.md`

---

### 🔍 Audit projet
```
LIRE :
- Méthodologies/RÈGLES/CLAUDE_CODE_RULES.md
- Méthodologies/RÈGLES/DESIGN_SYSTEM.md
- Méthodologies/ÉTAT/GUIDELINES_AUDIT.md

CATÉGORIES : Structure, UI, Registry, Fiches, Code
FORMAT : Score /100 + Top 5 actions

→ Confirmer lecture, poser questions, planifier.
```

**Fichier détaillé** : `Méthodologies/PRÉPROMPTS DÉTAILLÉS/audit.md`

---

### 🔄 Synchroniser documentation
```
OBJECTIF : Mettre à jour TOUS les docs après évolutions

ÉTAPES :
1. Scanner /src/ : structure réelle
2. Scanner /docs/ : documents existants
3. Comparer et générer rapport d'écarts

→ Confirmer lecture, poser questions, planifier.
```

**Fichier détaillé** : `Méthodologies/PRÉPROMPTS DÉTAILLÉS/sync-docs.md`

---

### 🔧 Refactoring écran
```
LIRE :
- Méthodologies/RÈGLES/CLAUDE_CODE_RULES.md
- Méthodologies/RÈGLES/UI_COMPONENTS_CATALOG.md
- Méthodologies/ÉTAT/PROMPT_REFACTORING.md

PROCESS :
1. Audit imports, headers, boutons
2. Remplacer par composants standards
3. Migrer vers tokens theme

→ Confirmer lecture, poser questions, planifier.
```

---

### 🐛 Corriger un bug
```
LIRE :
- Méthodologies/RÈGLES/CLAUDE_CODE_RULES.md
- Méthodologies/ARCHITECTURE/PROJECT_STRUCTURE.md

PROCESS :
1. Identifier le fichier concerné
2. Fix minimal et ciblé
3. Vérifier pas de régression

→ Confirmer lecture, poser questions, planifier.
```

---

## 📁 Documents par catégorie

> **Tous les chemins sont relatifs à `docs/`**

### Méthodologies/RÈGLES/ (Sources de vérité)

| Fichier | Rôle |
|---------|------|
| `CLAUDE_CODE_RULES.md` | Imports, interdictions, checklist |
| `DESIGN_SYSTEM.md` | Tokens couleurs, typo, spacing, animations |
| `UI_COMPONENTS_CATALOG.md` | Props détaillées des 25+ composants |
| `UI_PATTERNS.md` | Patterns généraux, historique "pourquoi" |

### Méthodologies/ARCHITECTURE/

| Fichier | Rôle |
|---------|------|
| `TRAME_REFERENTIEL.md` | Types universels, 6 couches architecture |
| `GAME_ARCHITECTURE.md` | Pattern Hook+Template (référence: 02-suites) |
| `PROJECT_STRUCTURE.md` | Arborescence fichiers, conventions |

### Méthodologies/REGISTRES/

| Fichier | Rôle |
|---------|------|
| `MASCOTTES_REGISTRY.md` | 14 mascottes avec dialogues |
| `ICONS_REGISTRY.md` | 78 icônes centralisées |

### Méthodologies/PRÉPROMPTS DÉTAILLÉS/

| Fichier | Rôle |
|---------|------|
| `nouveau-jeu.md` | Template création jeu complet |
| `nouveau-composant.md` | Template création composant |
| `fiche-educative.md` | Templates des 4 fiches |
| `audit.md` | Scoring et commandes bash |
| `sync-docs.md` | Process de synchronisation |

### Méthodologies/CONTEXTE/

| Fichier | Rôle |
|---------|------|
| `INSTRUCTIONS_PROJET_APP_EDUCATIVE.md` | Vision pédagogique Montessori |
| `GUIDE_UX_UI_APP_EDUCATIVE.md` | Principes UX enfant 6-10 ans |
| `ROADMAP_ACTIVITES.md` | 18 activités planifiées |

### Méthodologies/ÉTAT/

| Fichier | Rôle |
|---------|------|
| `GUIDELINES_AUDIT.md` | Résultats conformité (91%) |
| `MIGRATION_STATUS.md` | État des migrations |
| `PROMPT_REFACTORING.md` | Prompts homogénéisation |

### Informations/ (Archives)

| Fichier | Rôle |
|---------|------|
| `*.docx` | Sources Word originales |
| `*.html` | Maquettes HTML visuelles |
| `TEMPLATE_BRIEF_VIERGE.md` | Template brief HTML→RN |

---

## 🎮 Jeux (15 : 12 disponibles + 3 coming soon)

> **Source de vérité** : `src/games/registry.ts`

| # | Jeu | Mascotte | Route | Statut |
|---|-----|----------|-------|--------|
| 01 | Tour de Hanoï | 🦉 Piou | 01-hanoi | ✅ |
| 02 | Suites Logiques | 🤖 Pixel | 02-suites-logiques | ✅ |
| 03 | Labyrinthe | 🐿️ Scout | 03-labyrinthe | ✅ |
| 04 | Balance Logique | 🦉 Dr. Hibou | 04-balance | ✅ |
| 05 | Sudoku Montessori | 🦉 Prof. Hoo | 05-sudoku | ✅ |
| 06 | Le Conteur Curieux | 🪶 Plume | 06-conteur-curieux | ✅ |
| 07 | Memory | 🐘 Memo | 07-memory | ✅ |
| 08 | Puzzle Formes | 🦊 Géo | 08-tangram | ✅ |
| 09 | Logix Grid | 🐜 Ada | 09-logix-grid | ✅ |
| 10 | Mots Croisés | 🦜 Lexie | 10-mots-croises | ✅ |
| 11 | MathBlocks | 🦫 Calc | 11-math-blocks | ✅ |
| 12 | Matrices Magiques | 🦊 Pixel | 12-matrices-magiques | ✅ |
| 13 | Embouteillage | 🚗 TBD | - | 🔜 |
| 14 | La Fabrique de Réactions | ⚗️ TBD | - | 🔜 |
| 15 | Chasseur de Papillons | 🦋 TBD | - | 🔜 |

### Fiches Educatives/

| Statut | Jeux |
|--------|------|
| ✅ Complet (4 fiches) | 01-Hanoï, 02-Suites, 03-Labyrinthe, 04-Balance, 05-Sudoku, 06-Conteur |
| ⚠️ Partiel | 07-Memory, 08-Tangram, 09-Logix, 10-MotsCroisés, 11-MathBlocks |
| ✅ Complet + briefs | 12-Matrices, 13-Embouteillage, 14-Fabrique, 15-Chasseur |

---

## ⚠️ Règles critiques (mémo)

> **Source complète** : `Méthodologies/RÈGLES/CLAUDE_CODE_RULES.md`

| Règle | Valeur |
|-------|--------|
| Import thème | `import { theme } from '@/theme'` |
| Import icônes | `import { Icons } from '@/constants/icons'` |
| Touch targets | ≥ 64dp |
| Texte courant | ≥ 18pt |
| Polices | Fredoka (titres) + Nunito (corps) |
| Animations | Reanimated 3 + spring |
| Imports obsolètes | ❌ `/constants/` → ✅ `/theme/` |
| Emojis hardcodés | ❌ `"🎮"` → ✅ `Icons.game` |

---

## 📖 Glossaire

| Terme | Définition | Localisation |
|-------|------------|--------------|
| **Espace Parent** | Dashboard **dans l'app** (code TypeScript) | `src/screens/parent/` |
| **Fiche Parent** | Documentation **Markdown** d'accompagnement | `Fiches Educatives/{XX}/FICHE_PARENT.md` |
| **Fiche Éducative** | Ensemble des 4 fichiers doc par jeu | `Fiches Educatives/{XX-nom}/` |

---

*v4.0 — Décembre 2024*
