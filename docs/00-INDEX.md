# 📚 INDEX — Documentation du Projet

> **Application Éducative iPad** — Guide d'utilisation des documents
> **Dernière mise à jour** : Décembre 2024

---

## 🚀 Pré-prompts prêts à copier-coller

### 🆕 Créer un nouveau composant UI

```
Lis ces documents avant de commencer :
- docs/DESIGN_SYSTEM.md (couleurs, typo, spacing, touch targets)
- docs/UI_PATTERNS.md (composants standardisés)
- docs/PROJECT_STRUCTURE.md (où créer les fichiers)

Règles importantes :
- Import du thème : `import { theme } from '@/theme'`
- Touch targets minimum : 64dp
- Texte minimum : 18pt
- Polices : Fredoka (titres) + Nunito (corps)
- Animations : React Native Reanimated avec spring
```

---

### 🎮 Créer une nouvelle activité/jeu

```
Lis ces documents avant de commencer :
- docs/PROJECT_STRUCTURE.md (structure d'un jeu dans /src/games/)
- docs/DESIGN_SYSTEM.md (couleurs, spacing, accessibilité)
- docs/UI_PATTERNS.md (composants réutilisables)
- docs/RAPPORT_VERIFICATION_MASCOTTES_COMPETENCES.md (mascottes et compétences)
- Fiches Educatives/ (spécifications pédagogiques si disponibles)

Structure d'un jeu :
/src/games/{nom-du-jeu}/
├── index.ts                    # Exports publics
├── types.ts                    # Types TypeScript
├── components/                 # Composants UI
│   ├── index.ts
│   └── {Composant}.tsx
├── hooks/
│   └── use{NomJeu}Game.ts      # Hook principal
├── logic/
│   ├── {nomJeu}Engine.ts       # Logique pure
│   └── validator.ts            # Validation
├── data/
│   ├── levels.ts               # Niveaux
│   └── assistantScripts.ts     # Scripts mascotte
└── screens/
    ├── {NomJeu}IntroScreen.tsx
    └── {NomJeu}VictoryScreen.tsx

Après création, ajouter le jeu dans :
- src/games/registry.ts
- app/(games)/{XX-nom-du-jeu}/index.tsx
```

---

### 🔊 Ajouter du son à une activité

```
Lis ce document avant de commencer :
- docs/AUDIO_IMPROVEMENTS.md (système audio, hook useSound)

Sons disponibles dans assets/sounds/ :
- disk_move.mp3, disk_error.mp3, disk_place.mp3
- victory.mp3, hint.mp3
- robot_select.mp3, robot_correct.mp3, robot_error.mp3
- robot_ambient.mp3, robot_thinking.mp3

Utilisation :
import { useSound } from '@/hooks/useSound';

function MonComposant() {
  const { playSound } = useSound();

  const handleSuccess = () => playSound('victory');
  const handleError = () => playSound('disk_error');
}
```

---

### 🏠 Modifier l'écran d'accueil

```
Lis ces documents avant de commencer :
- docs/UI_PATTERNS.md (section "Patterns V10 - Forêt Immersive")
- docs/DESIGN_SYSTEM.md (couleurs, spacing)
- docs/PROJECT_STRUCTURE.md (structure /src/components/home-v10/)

Composants V10 disponibles :
- ForestBackgroundV10 (background forêt animé)
- HomeHeaderV10 (en-tête)
- GameCardV10 (carte de jeu)
- PiouFloating, CollectionFloating (widgets)
- Layers : Sky, Sun, Clouds, Mountains, Hills, Trees, Bushes, Garden
- Animals : Birds, Butterflies, Squirrel, Rabbit, Bee, Ladybug

Couleurs V10 : src/theme/home-v10-colors.ts
```

---

### 🎨 Changer le design/style

```
Lis ces documents avant de commencer :
- docs/DESIGN_SYSTEM.md (design system complet)
- docs/UI_PATTERNS.md (patterns standardisés)
- src/theme/colors.ts (palette de couleurs)
- src/theme/typography.ts (polices et tailles)
- src/theme/spacing.ts (espacements)
- src/theme/touchTargets.ts (tailles tactiles)

Import : import { theme } from '@/theme';

Règles UX enfant :
- Touch targets ≥ 64dp
- Texte courant ≥ 18pt
- Contraste ≥ 4.5:1
- Jamais couleur seule (toujours + icône)
- Animations spring avec Reanimated
```

---

### 🔧 Faire du refactoring / maintenance

```
Lis ces documents avant de commencer :
- docs/GUIDELINES_AUDIT.md (fichiers à corriger, conformité 92%)
- docs/SYNTHESE_STANDARDISATION.md (état de la migration)
- docs/UI_COMPONENTS_CATALOG.md (catalogue des composants)

Fichiers prioritaires à corriger :
- src/games/sudoku/screens/SudokuIntroScreen.tsx → fontSize 18pt
- src/games/hanoi/screens/HanoiIntroScreen.tsx → fontSize 16pt+
- src/games/math-blocks/screens/MathPlayScreen.tsx → fontSize timer 18pt
- src/games/hanoi/components/FloatingButtons.tsx → touch targets

Migration en cours : /src/constants/ → /src/theme/
```

---

### 🤖 Configurer Claude pour ce projet

```
Lis ces documents pour comprendre le projet :
- claude.md (instructions principales)
- docs/CLAUDE_CODE_RULES.md (règles spécifiques)
- docs/PROMPT_REFACTORING.md (prompts de refactoring)
- docs/Instructions_Projet_App_Educative.md (vision globale)
- docs/Guide_UX_UI_App_Educative.md (philosophie UX/UI)
```

---

### 👨‍👩‍👧 Modifier l'espace parent

```
Lis ces documents avant de commencer :
- docs/PROJECT_STRUCTURE.md (section /src/components/parent/)
- docs/UI_PATTERNS.md (variant "parent" des composants)
- docs/DESIGN_SYSTEM.md (couleurs et styles parent)

Composants parent disponibles :
- ParentZone, ParentDrawer, ParentTabs
- ProgressChart, SkillsRadarV2, WeeklyChart
- ActivityTimeline, BadgesGallery
- ScreenTimeCard, RecommendationsCard
- GoalEditor, GoalsSection, ChildSelector
```

---

### 🃏 Modifier le système de collection

```
Lis ces documents avant de commencer :
- docs/PROJECT_STRUCTURE.md (section /src/components/collection/)
- src/data/cards.ts (définition des cartes)
- src/store/slices/collectionSlice.ts (état des cartes)

Composants collection :
- CollectionBook, CollectionPage, CollectionCard
- CardDetailModal, CardUnlockScreen
- CategoryTabs
```

---

## 📋 Liste complète des documents

### À la racine
| Fichier | Description |
|---------|-------------|
| `README.md` | README principal |
| `claude.md` | Instructions Claude AI |

### Dans `/docs/`
| Fichier | Catégorie | Description |
|---------|-----------|-------------|
| `00-INDEX.md` | Navigation | Ce fichier |
| `DESIGN_SYSTEM.md` | UI/UX | Couleurs, typo, spacing |
| `PROJECT_STRUCTURE.md` | Structure | Architecture du projet |
| `UI_PATTERNS.md` | UI/UX | Patterns standardisés V9/V10 |
| `UI_COMPONENTS_CATALOG.md` | UI/UX | Catalogue composants |
| `GUIDELINES_AUDIT.md` | Maintenance | Conformité UX (92%) |
| `AUDIO_IMPROVEMENTS.md` | Audio | Système sonore |
| `IMPLEMENTATION_SUMMARY.md` | État | Avancement global |
| `RAPPORT_VERIFICATION_MASCOTTES_COMPETENCES.md` | Pédagogie | Mascottes/compétences |
| `SYNTHESE_STANDARDISATION.md` | Maintenance | Migration |
| `Guide_UX_UI_App_Educative.md` | Vision | Philosophie UX/UI |
| `Instructions_Projet_App_Educative.md` | Vision | Instructions générales |
| `CLAUDE_CODE_RULES.md` | IA | Règles Claude |
| `PROMPT_REFACTORING.md` | IA | Prompts refactoring |

---

## 💡 Mémo rapide

```
🆕 Nouveau composant    → DESIGN_SYSTEM + UI_PATTERNS
🎮 Nouveau jeu          → PROJECT_STRUCTURE + Fiches Éducatives
🔊 Ajouter son          → AUDIO_IMPROVEMENTS
🏠 Modifier accueil     → UI_PATTERNS (V10)
🎨 Changer style        → DESIGN_SYSTEM + theme/
🔧 Refactoring          → GUIDELINES_AUDIT
🤖 Config Claude        → claude.md + CLAUDE_CODE_RULES
```

---

## ⚠️ Règles essentielles

| Règle | Valeur |
|-------|--------|
| Import thème | `import { theme } from '@/theme'` |
| Touch targets | ≥ 64dp minimum |
| Texte courant | ≥ 18pt minimum |
| Polices | Fredoka (titres) + Nunito (corps) |
| Animations | Reanimated 3 avec spring |
| Jeux | 11 disponibles + 1 coming soon |
| Conformité | 92% |

---

## 🎮 Liste des jeux (12)

| # | Jeu | Route | Statut |
|---|-----|-------|--------|
| 01 | Tour de Hanoï | `/(games)/01-hanoi` | ✅ |
| 02 | Suites Logiques | `/(games)/02-suites-logiques` | ✅ |
| 03 | Labyrinthe | `/(games)/03-labyrinthe` | ✅ |
| 04 | Balance Logique | `/(games)/04-balance` | ✅ |
| 05 | Sudoku Montessori | `/(games)/05-sudoku` | ✅ |
| 06 | Le Conteur Curieux | `/(games)/06-conteur-curieux` | ✅ |
| 07 | Memory | `/(games)/07-memory` | ✅ |
| 08 | Puzzle Formes | `/(games)/08-tangram` | ✅ |
| 09 | Logix Grid | `/(games)/09-logix-grid` | ✅ |
| 10 | Mots Croisés | `/(games)/10-mots-croises` | ✅ |
| 11 | MathBlocks | `/(games)/11-math-blocks` | ✅ |
| 12 | Matrices Magiques | `/(games)/12-matrices-magiques` | 🔜 |

---

*Document créé - Décembre 2024*
