# Architecture du Projet Hello Guys

> Application éducative pour enfants (6-10 ans) - React Native / Expo
> **Version** : 2.2 — 29 Décembre 2024

---

## Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Arborescence Complète](#arborescence-complète)
3. [Description Détaillée par Dossier](#description-détaillée-par-dossier)
4. [Patterns et Conventions](#patterns-et-conventions)

---

## Vue d'Ensemble

```
hello-guys/
├── app/                    # Routes Expo Router (navigation)
├── src/                    # Code source principal
│   ├── components/         # Composants UI réutilisables
│   ├── games/              # Implémentation des jeux
│   ├── hooks/              # Hooks personnalisés
│   ├── store/              # État global (Zustand)
│   ├── theme/              # Design system
│   ├── types/              # Définitions TypeScript
│   ├── data/               # Données statiques
│   ├── core/               # Logique pédagogique (AI, difficulté)
│   ├── i18n/               # Internationalisation
│   └── utils/              # Utilitaires
├── assets/                 # Images, sons, polices
├── docs/                   # Documentation
├── Fiches Educatives/      # Spécifications pédagogiques
└── .vscode/                # Configuration VS Code
```

---

## Arborescence Complète

### `/app/` - Navigation Expo Router

```
app/
├── _layout.tsx                 # Layout racine, chargement des polices, providers
├── index.tsx                   # Écran d'accueil principal (Home)
├── labyrinthe-demo.tsx         # Démo du jeu Labyrinthe
│
├── (games)/                    # Groupe de routes pour les jeux
│   ├── _layout.tsx             # Layout partagé pour tous les jeux
│   │
│   ├── 01-hanoi/              # Jeu Tour de Hanoï
│   │   ├── _layout.tsx         # Stack navigator du jeu
│   │   └── index.tsx           # Point d'entrée → HanoiIntroScreen
│   │
│   ├── 02-suites-logiques/     # Jeu Suites Logiques
│   │   ├── _layout.tsx         # Stack navigator du jeu
│   │   └── index.tsx           # Point d'entrée → SuitesLogiquesGame
│   │
│   ├── 03-labyrinthe/          # Jeu Labyrinthe
│   │   ├── _layout.tsx         # Stack navigator du jeu
│   │   └── index.tsx           # Point d'entrée
│   │
│   ├── 04-balance/             # Jeu Balance Logique
│   │   ├── _layout.tsx         # Stack navigator du jeu
│   │   └── index.tsx           # Point d'entrée → BalanceIntroScreen
│   │
│   ├── 05-sudoku/              # Jeu Sudoku Montessori
│   │   ├── _layout.tsx         # Stack navigator du jeu
│   │   └── index.tsx           # Point d'entrée → SudokuIntroScreen
│   │
│   ├── 06-conteur-curieux/     # Jeu Le Conteur Curieux
│   │   ├── _layout.tsx         # Stack navigator du jeu
│   │   └── index.tsx           # Point d'entrée
│   │
│   ├── 07-memory/              # Jeu Memory
│   │   ├── _layout.tsx         # Stack navigator du jeu
│   │   └── index.tsx           # Point d'entrée
│   │
│   ├── 08-tangram/             # Jeu Tangram
│   │   ├── _layout.tsx         # Stack navigator du jeu
│   │   └── index.tsx           # Point d'entrée
│   │
│   ├── 09-logix-grid/          # Jeu Logix Grid
│   │   ├── _layout.tsx         # Stack navigator du jeu
│   │   └── index.tsx           # Point d'entrée
│   │
│   ├── 10-mots-croises/        # Jeu Mots Croisés
│   │   ├── _layout.tsx         # Stack navigator du jeu
│   │   └── index.tsx           # Point d'entrée
│   │
│   ├── 11-math-blocks/         # Jeu MathBlocks
│   │   ├── _layout.tsx         # Stack navigator du jeu
│   │   ├── index.tsx           # Point d'entrée → MathIntroScreen
│   │   ├── play.tsx            # Écran de jeu → MathPlayScreen
│   │   └── victory.tsx         # Écran de victoire
│   │
│   ├── 12-matrices-magiques/   # Jeu Matrices Magiques
│   │   ├── _layout.tsx         # Stack navigator du jeu
│   │   └── index.tsx           # Point d'entrée
│   │
│   ├── 13-embouteillage/       # Jeu Embouteillage (🔜 STUB)
│   │   ├── _layout.tsx
│   │   └── index.tsx
│   │
│   ├── 14-fabrique-reactions/  # Jeu La Fabrique de Réactions (🔜 STUB)
│   │   ├── _layout.tsx
│   │   └── index.tsx
│   │
│   ├── 15-chasseur-papillons/  # Jeu Chasseur de Papillons (🔜 STUB)
│   │   ├── _layout.tsx
│   │   └── index.tsx
│   │
│   └── collection/             # Système de collection de cartes
│       └── index.tsx           # Écran de la collection
│
└── (parent)/                   # Espace Parents
    ├── _layout.tsx             # Layout de l'espace parent
    ├── index.tsx               # Dashboard parent (ParentZone)
    └── settings.tsx            # Paramètres parentaux
```

---

### `/src/components/` - Composants UI Réutilisables

```
src/components/
│
├── activities/                 # Composants d'activités spécifiques
│   └── Labyrinthe/             # Jeu Labyrinthe (architecture alternative)
│       ├── index.ts            # Exports publics
│       ├── LabyrintheGame.tsx  # Composant principal du jeu
│       ├── components/         # Sous-composants
│       │   ├── Avatar.tsx              # Personnage du joueur
│       │   ├── DirectionalControls.tsx # Contrôles directionnels (↑↓←→)
│       │   ├── InteractiveElement.tsx  # Éléments interactifs (clés, portes)
│       │   ├── Inventory.tsx           # Inventaire du joueur
│       │   ├── MascotBubble.tsx        # Bulle de dialogue mascotte
│       │   ├── MazeCell.tsx            # Cellule individuelle du labyrinthe
│       │   ├── MazeGrid.tsx            # Grille complète du labyrinthe
│       │   ├── PathTrail.tsx           # Trace du chemin parcouru
│       │   └── VictoryScreen.tsx       # Écran de victoire
│       ├── data/
│       │   ├── levels.ts               # Configuration des niveaux
│       │   └── themes.ts               # Thèmes visuels
│       ├── hooks/
│       │   ├── useAvatarMovement.ts    # Gestion du mouvement avatar
│       │   ├── useMazeGame.ts          # Logique principale du jeu
│       │   └── useMazeGenerator.ts     # Génération procédurale du labyrinthe
│       ├── types/
│       │   └── index.ts                # Types TypeScript
│       └── utils/
│           └── helpers.ts              # Fonctions utilitaires
│
├── assistant/                  # Assistant IA / Mascotte
│   ├── index.ts                # Exports
│   └── AssistantBubble.tsx     # Bulle de dialogue de l'assistant
│
├── background/                 # Éléments de fond animés (Forêt)
│   ├── index.ts                # Exports
│   ├── ForestBackground.tsx    # Fond forêt complet (assemblage)
│   ├── AnimatedCloud.tsx       # Nuages animés
│   ├── Flowers.tsx             # Fleurs animées
│   ├── Hills.tsx               # Collines
│   ├── Mountains.tsx           # Montagnes en arrière-plan
│   ├── Sun.tsx                 # Soleil animé
│   ├── Trees.tsx               # Arbres
│   └── animals/                # Animaux animés
│       ├── index.ts            # Exports
│       ├── Bee.tsx             # Abeille
│       ├── Bird.tsx            # Oiseau
│       ├── Butterfly.tsx       # Papillon
│       ├── Dragonfly.tsx       # Libellule
│       ├── Ladybug.tsx         # Coccinelle
│       ├── Rabbit.tsx          # Lapin
│       └── Squirrel.tsx        # Écureuil
│
├── collection/                 # Système de collection de cartes
│   ├── index.ts                # Exports
│   ├── CardDetailModal.tsx     # Modal détail d'une carte
│   ├── CardUnlockScreen.tsx    # Écran de déblocage de carte
│   ├── CategoryTabs.tsx        # Onglets de catégories
│   ├── CollectionBook.tsx      # Livre de collection complet
│   ├── CollectionCard.tsx      # Carte individuelle
│   └── CollectionPage.tsx      # Page de collection
│
├── common/                     # Composants UI communs (17 exports)
│   ├── index.ts                # Exports centralisés
│   ├── BackButton.tsx          # Bouton retour (variants: icon, text)
│   ├── Button.tsx              # Bouton standard (variants: primary, secondary, ghost)
│   ├── CardFlip.tsx            # ⭐ Animation retournement carte
│   ├── Confetti.tsx            # ⭐ Animation confettis célébration
│   ├── GameActionButtons.tsx   # ⭐ Groupe boutons actions jeu
│   ├── GameIntroTemplate.tsx   # ⭐⭐ TEMPLATE intro jeux (2 vues)
│   ├── GameIntroTemplate.types.ts # Types pour GameIntroTemplate
│   ├── GameModal.tsx           # Modal générique (variants: info, choice, demo)
│   ├── HintButton.tsx          # ⭐ Bouton indices avec compteur
│   ├── IconButton.tsx          # Bouton avec icône
│   ├── MascotBubble.tsx        # ⭐⭐ Bulle dialogue mascotte (typewriter)
│   ├── PageContainer.tsx       # Container de page avec SafeArea
│   ├── ParentGate.tsx          # Porte parentale (vérification adulte)
│   ├── PerformanceStats.tsx    # ⭐ Stats de performance
│   ├── ProgressIndicator.tsx   # ⭐ Indicateur progression
│   ├── ScreenBackground.tsx    # Fond d'écran générique
│   ├── ScreenHeader.tsx        # En-tête d'écran (variants: home, game, parent)
│   ├── VictoryCard.tsx         # Carte de victoire réutilisable
│   └── VictoryOverlayBase.tsx  # ⭐ Base overlay victoire
│
├── decorations/                # Éléments décoratifs (alternative)
│   ├── index.ts                # Exports
│   ├── AnimatedButterfly.tsx   # Papillon animé
│   ├── AnimatedCloud.tsx       # Nuage animé
│   ├── AnimatedSun.tsx         # Soleil animé
│   ├── AnimatedTree.tsx        # Arbre animé
│   ├── FloatingFlowers.tsx     # Fleurs flottantes
│   └── Hills.tsx               # Collines décoratives
│
├── home-v10/                   # Composants écran d'accueil V10 (Forêt Immersive) ✅ ACTIF
│   ├── ForestBackgroundV10.tsx # Background forêt animé complet
│   ├── HomeHeaderV10.tsx       # En-tête version V10
│   ├── GameCardV10.tsx         # Carte de jeu version V10
│   ├── CollectionFloating.tsx  # Widget collection flottant
│   ├── PiouFloating.tsx        # Mascotte Piou flottante
│   ├── layers/                 # Couches du paysage
│   │   ├── Sky.tsx             # Ciel avec dégradé
│   │   ├── Sun.tsx             # Soleil animé
│   │   ├── Clouds.tsx          # Nuages animés
│   │   ├── Mountains.tsx       # Montagnes (far/near)
│   │   ├── Hills.tsx           # Collines
│   │   ├── Trees.tsx           # Arbres
│   │   ├── Bushes.tsx          # Buissons
│   │   └── Garden.tsx          # Jardin de progression
│   └── animals/                # Animaux animés
│       ├── Birds.tsx           # Oiseaux volants
│       ├── Butterflies.tsx     # Papillons
│       ├── Squirrel.tsx        # Écureuil
│       ├── Rabbit.tsx          # Lapin
│       ├── Bee.tsx             # Abeille
│       └── Ladybug.tsx         # Coccinelle
│
├── layout/                     # Composants de mise en page
│   ├── index.ts                # Exports
│   └── GameContainer.tsx       # Container pour les jeux
│
└── parent/                     # Composants espace parents
    ├── index.ts                # Exports
    ├── ActivityTimeline.tsx    # Timeline des activités
    ├── BadgesGallery.tsx       # Galerie des badges
    ├── BehaviorInsights.tsx    # Insights comportementaux
    ├── ChildSelector.tsx       # Sélecteur d'enfant
    ├── GoalEditor.tsx          # Éditeur d'objectifs
    ├── GoalsSection.tsx        # Section objectifs
    ├── ParentDrawer.tsx        # Tiroir latéral parent
    ├── ParentTabs.tsx          # Onglets du dashboard
    ├── ParentZone.tsx          # Zone parent principale
    ├── ProgressChart.tsx       # Graphique de progression
    ├── RecommendationsCard.tsx # Carte de recommandations
    ├── ScreenTimeCard.tsx      # Carte temps d'écran
    ├── SkillsRadar.tsx         # Radar des compétences (v1)
    ├── SkillsRadarV2.tsx       # Radar des compétences (v2)
    ├── StrengthsCard.tsx       # Carte des points forts
    └── WeeklyChart.tsx         # Graphique hebdomadaire
```

---

### `/src/games/` - Implémentation des Jeux

```
src/games/
│
├── registry.ts                 # Registre central de tous les jeux
│                               # Définit: id, nom, catégorie, route, compétences
│
├── 01-hanoi/                   # Jeu Tour de Hanoï
│   ├── index.ts                # Exports publics
│   ├── types.ts                # Types TypeScript
│   ├── components/
│   │   ├── MascotOwl.tsx       # Mascotte Piou (hibou)
│   │   ├── Disk.tsx, Tower.tsx # Éléments du jeu
│   │   └── feedback/           # Composants de victoire
│   ├── hooks/useHanoiGame.ts   # Hook principal
│   ├── logic/hanoiEngine.ts    # Logique pure
│   ├── data/                   # Niveaux et scripts
│   └── screens/                # Intro, Victory
│
├── 02-suites-logiques/         # Jeu Suites Logiques
│   ├── components/
│   │   ├── MascotRobot.tsx     # Mascotte Pixel
│   │   └── SuitesLogiquesGame.tsx
│   ├── hooks/, data/, types/
│   └── constants/gameConfig.ts
│
├── 03-labyrinthe/              # Jeu Labyrinthe
│   ├── components/
│   │   └── MascotBubble.tsx    # Dialogue Scout
│   ├── hooks/, data/
│   └── LabyrintheGame.tsx
│
├── 04-balance/                 # Jeu Balance Logique
│   ├── index.ts                # Exports publics
│   ├── types.ts                # Types TypeScript du jeu
│   ├── components/
│   │   ├── BalanceScale.tsx    # Balance interactive
│   │   ├── DrHibou.tsx         # Mascotte Dr Hibou
│   │   ├── EquivalenceJournal.tsx # Journal des équivalences
│   │   ├── LevelSelector.tsx   # Sélecteur de niveau
│   │   ├── SandboxMode.tsx     # Mode bac à sable
│   │   └── WeightObject.tsx    # Objet à peser
│   ├── data/
│   │   ├── objects.ts          # Objets avec poids
│   │   └── puzzles.ts          # Puzzles/niveaux
│   ├── hooks/
│   │   ├── useBalanceGame.ts   # Hook principal du jeu
│   │   └── useBalancePhysics.ts # Physique de la balance
│   ├── logic/
│   │   └── balanceEngine.ts    # Moteur logique du jeu
│   └── screens/
│       ├── BalanceGameScreen.tsx   # Écran de jeu
│       └── BalanceIntroScreen.tsx  # Écran d'introduction
│
├── 05-sudoku/                  # Jeu Sudoku Montessori
│   ├── components/
│   │   ├── ProfessorHooMascot.tsx  # Mascotte Prof Hoo
│   │   ├── FelixMascot.tsx         # Mascotte alternative Félix
│   │   └── SudokuGrid.tsx, etc.
│   ├── hooks/, logic/, screens/
│   └── types/
│
├── 06-conteur-curieux/         # Jeu Le Conteur Curieux
│   ├── components/
│   │   └── PlumeMascot.tsx     # Mascotte Plume
│   ├── hooks/, data/, screens/
│   └── assets/                 # Histoires
│
├── 07-memory/                  # Jeu Memory
├── 08-tangram/                 # Jeu Puzzle Formes
├── 09-logix-grid/              # Jeu Logix Grid
├── 10-mots-croises/            # Jeu Mots Croisés
│
├── 11-math-blocks/             # Jeu MathBlocks
│   ├── index.ts                # Exports publics
│   ├── types.ts                # Types TypeScript
│   ├── components/
│   │   ├── index.ts
│   │   ├── GameGrid.tsx        # Grille de jeu
│   │   ├── MathBlock.tsx       # Bloc mathématique
│   │   ├── ScoreDisplay.tsx    # Affichage du score
│   │   └── TimerBar.tsx        # Barre de temps
│   ├── data/
│   │   ├── assistantScripts.ts # Scripts assistant
│   │   └── levels.ts           # Configuration niveaux
│   ├── hooks/
│   │   └── useMathGame.ts      # Hook principal
│   ├── logic/
│   │   ├── gridEngine.ts       # Moteur de grille
│   │   ├── matchValidator.ts   # Validation des matches
│   │   └── mathEngine.ts       # Calculs mathématiques
│   └── screens/
│       ├── index.ts
│       ├── MathIntroScreen.tsx     # Introduction
│       ├── MathPlayScreen.tsx      # Écran de jeu
│       └── MathVictoryScreen.tsx   # Victoire
│
└── 12-matrices-magiques/       # Jeu Matrices Magiques (🔜 coming soon)
    ├── components/
    │   └── mascot/
    │       ├── PixelMascot.tsx     # Mascotte Pixel le Renard
    │       ├── SpeechBubble.tsx
    │       └── PixelWithBubble.tsx
    ├── hooks/, data/, logic/
    ├── screens/
    └── types/
```

---

### `/src/hooks/` - Hooks Personnalisés Globaux

```
src/hooks/
├── index.ts                    # Exports
├── useCardUnlock.ts            # Gestion du déblocage de cartes
├── useChildProfile.ts          # Profil de l'enfant
├── useGamesProgress.ts         # Progression dans les jeux
├── useHomeData.ts              # Données de l'écran d'accueil
└── useSound.ts                 # Gestion des sons (play, stop, volume)
```

---

### `/src/store/` - État Global (Zustand)

```
src/store/
├── useStore.ts                 # Store principal Zustand
└── slices/                     # Slices du store
    ├── appSlice.ts             # État de l'application (loading, errors)
    ├── assistantSlice.ts       # Messages de l'assistant
    ├── collectionSlice.ts      # Collection de cartes
    ├── gameSessionSlice.ts     # Session de jeu en cours
    ├── goalsSlice.ts           # Objectifs parentaux
    ├── profileSlice.ts         # Profil utilisateur
    ├── progressSlice.ts        # Progression globale
    └── screenTimeSlice.ts      # Temps d'écran
```

---

### `/src/theme/` - Design System (NOUVEAU - remplace /constants/)

```
src/theme/
├── index.ts                    # Export du thème complet (theme object)
├── colors.ts                   # Palette de couleurs (~234 lignes)
│                               # - Couleurs primaires, secondaires
│                               # - Couleurs par catégorie de jeu
│                               # - Couleurs de feedback
│                               # - Couleurs des jeux spécifiques
├── typography.ts               # Typographie
│                               # - Familles: Nunito, Fredoka
│                               # - Tailles: 11px à 50px
│                               # - Styles prédéfinis (h1, h2, body, button...)
├── spacing.ts                  # Espacement (grille 4pt)
│                               # - Scale: 0, 4, 8, 12, 16... 96px
│                               # - Semantic: componentPadding, cardPadding...
│                               # - Home layout dimensions
├── touchTargets.ts             # Tailles tactiles
│                               # - Minimum: 44pt
│                               # - Standard enfant: 64pt
│                               # - Hit slop configurations
├── home-v10-colors.ts          # 🆕 Couleurs spécifiques Home V10
│                               # - Palette forêt
│                               # - Gradients ciel/nature
└── daltonismModes.ts           # 🆕 Support daltonisme
                                # - Palettes alternatives
                                # - Modes protanopia, deuteranopia, tritanopia
```

> **Import recommandé** :
> ```typescript
> import { theme } from '@/theme';
> // ou
> import { colors, spacing, typography } from '@/theme';
> ```

---

### `/src/constants/` - Constantes Centralisées

```
src/constants/
├── icons.ts                    # ⭐ ICÔNES EMOJI CENTRALISÉES (78 emojis)
│                               # - Icons.star, Icons.trophy, etc.
│                               # - Type IconName pour autocomplétion
│                               # - getIcon(name, fallback) helper
└── ...                         # Autres constantes
```

> **Import obligatoire pour emojis** :
> ```typescript
> import { Icons } from '@/constants/icons';
>
> // Usage
> <Text>{Icons.star}</Text>  // ⭐
> <Text>{Icons.trophy}</Text> // 🏆
> ```
>
> **⚠️ NE PAS hardcoder d'emojis** : utiliser `Icons.xxx` à la place.

---

### `/src/types/` - Définitions TypeScript

```
src/types/
├── index.ts                    # Exports
├── assistant.types.ts          # Types pour l'assistant IA
│                               # - AssistantMessage, MessageTrigger
├── game.types.ts               # Types génériques des jeux
│                               # - GameMetadata, LevelConfig, GameSession
├── games.ts                    # Types additionnels des jeux
├── home.types.ts               # Types de l'écran d'accueil
│                               # - HomeData, GameCategory
└── parent.types.ts             # Types de l'espace parent
                                # - ParentTabId, ChildProfile
```

---

### `/src/data/` - Données Statiques

```
src/data/
├── index.ts                    # Exports
├── cards.ts                    # Définition des cartes collectibles
└── gamesConfig.ts              # Configuration globale des jeux
```

---

### `/src/i18n/` - Internationalisation

```
src/i18n/
└── index.ts                    # Configuration i18next (français par défaut)
```

---

### `/src/utils/` - Utilitaires

```
src/utils/
├── analytics.ts                # Tracking analytics
└── platform.ts                 # Détection plateforme (iOS/Android/Web)
```

---

### `/assets/` - Ressources Statiques

```
assets/
├── images/                     # Images de l'application
│   ├── icon.png                # Icône principale
│   ├── favicon.png             # Favicon web
│   ├── splash-icon.png         # Écran de démarrage
│   ├── android-icon-*.png      # Icônes Android (foreground, background)
│   └── ...
│
├── AppIcons/                   # Icônes pour les stores
│   ├── appstore.png            # Icône App Store (1024x1024)
│   ├── Assets.xcassets/        # Assets iOS
│   │   └── AppIcon.appiconset/ # Toutes les tailles iOS
│   │       ├── 16.png → 1024.png
│   │       └── Contents.json
│   └── android/                # Assets Android
│       └── mipmap-*/           # Différentes densités
│           └── ic_launcher.png
│
└── sounds/                     # Sons et musiques
    └── README.md               # Documentation des sons
```

---

### `/docs/` - Documentation

```
docs/
├── 00-INDEX_UPDATED.md         # ⭐ Index + pré-prompts Claude Code
├── PROJECT_STRUCTURE.md        # Ce fichier
├── DESIGN_SYSTEM.md            # Système de design (tokens, couleurs, typo)
├── UI_COMPONENTS_CATALOG.md    # ⭐ Catalogue composants (17 exports)
├── UI_PATTERNS.md              # Patterns UI réutilisables
├── GAME_ARCHITECTURE.md        # ⭐ Architecture hook+template jeux
├── GUIDELINES_AUDIT.md         # Audit conformité UX (91%)
├── MASCOTTES_REGISTRY.md       # Registre mascottes par jeu
├── ICONS_REGISTRY.md           # ⭐ Registre 78 icônes centralisées
├── TRAME_REFERENTIEL.md        # Architecture activités, types universels
├── PROMPT_REFACTORING.md       # Prompts homogénéisation
├── AUDIO_IMPROVEMENTS.md       # Système sonore
├── GUIDE_UX_UI_APP_EDUCATIVE.md # Principes UX enfant 6-10 ans
├── INSTRUCTIONS_PROJET_APP_EDUCATIVE.md # Vision pédagogique
├── AUDIT_DOCUMENTATION.md      # Méthodologie audit
└── Etat-Historique/            # Rapports et historiques
    ├── IMPLEMENTATION_SUMMARY.md
    ├── SYNTHESE_STANDARDISATION.md
    └── RAPPORT_VERIFICATION_MASCOTTES_COMPETENCES.md
```

---

### `/Fiches Educatives/` - Spécifications Pédagogiques

```
Fiches Educatives/
├── README.md                   # Guide général
├── GUIDE_IMPLEMENTATION.md     # Guide d'implémentation
│
├── 01-Tour de Hanoï/
│   ├── README.md               # Vue d'ensemble
│   ├── FICHE_ACTIVITE.md       # Fiche activité complète
│   ├── FICHE_PARENT.md         # Guide pour les parents
│   ├── DIALOGUES_IA.md         # Scripts de l'assistant
│   ├── SPECS_TECHNIQUES.md     # Spécifications techniques
│   ├── 02-ux-flow.md           # Flux UX
│   ├── 03-ui-spec.md           # Spécifications UI
│   ├── 04-feedback-ai.md       # Feedback IA
│   ├── 05-parent-space.md      # Espace parent
│   └── 06-assets-sound.md      # Assets et sons
│
├── 02-suites-logiques/
│   ├── README.md
│   ├── FICHE_ACTIVITE.md
│   ├── FICHE_PARENT.md
│   ├── DIALOGUES_IA.md
│   └── SPECS_TECHNIQUES.md
│
├── 03-labyrinthe/
│   ├── README.md
│   ├── FICHE_ACTIVITE.md
│   ├── FICHE_PARENT.md
│   ├── DIALOGUES_IA.md
│   └── SPECS_TECHNIQUES.md
│
├── 04-balance/
│   ├── README.md
│   ├── FICHE_ACTIVITE.md
│   ├── FICHE_PARENT.md
│   ├── DIALOGUES_IA.md
│   └── SPECS_TECHNIQUES.md
│
└── 05-sudoku/
    ├── README Sudoku.md
    ├── FICHE_ACTIVITE.md
    ├── FICHE_PARENT.md
    ├── DIALOGUES_IA.md
    ├── SPECS_TECHNIQUES.md
    └── SUDOKU_IMPLEMENTATION.md
```

---

### Fichiers Racine

```
hello-guys/
├── app.json                    # Configuration Expo
├── package.json                # Dépendances NPM
├── package-lock.json           # Lock file
├── tsconfig.json               # Configuration TypeScript (si présent)
├── babel.config.js             # Configuration Babel (si présent)
├── README.md                   # README principal
├── claude.md                   # Instructions pour Claude AI
│
├── .vscode/                    # Configuration VS Code
│   ├── extensions.json         # Extensions recommandées
│   └── settings.json           # Paramètres du projet
│
├── dist/                       # Build de production
│   └── metadata.json           # Métadonnées du build
│
├── constants/                  # Constantes legacy (deprecated)
│   └── theme.ts                # Thème legacy
│
└── hooks/                      # Hooks legacy (deprecated)
    ├── use-color-scheme.ts
    ├── use-color-scheme.web.ts
    └── use-theme-color.ts
```

---

## Patterns et Conventions

### Structure d'un Jeu

Chaque jeu suit cette structure standardisée :

```
src/games/{nomJeu}/
├── index.ts                    # Exports publics
├── types.ts                    # Types TypeScript
├── components/                 # Composants UI
│   ├── index.ts
│   └── {Composant}.tsx
├── hooks/
│   └── use{NomJeu}Game.ts      # Hook principal
├── logic/
│   ├── {nomJeu}Engine.ts       # Logique pure (pas de React)
│   └── validator.ts            # Validation des actions
├── data/
│   ├── levels.ts               # Configuration des niveaux
│   ├── assistantScripts.ts     # Scripts de l'assistant
│   └── themes.ts               # Thèmes visuels (optionnel)
└── screens/
    ├── index.ts
    ├── {NomJeu}IntroScreen.tsx # Introduction/règles
    ├── {NomJeu}GameScreen.tsx  # Jeu principal (optionnel)
    └── {NomJeu}VictoryScreen.tsx # Victoire
```

### Conventions de Nommage

| Type | Convention | Exemple |
|------|------------|---------|
| Composant | PascalCase | `GameCard.tsx` |
| Hook | camelCase avec `use` | `useHanoiGame.ts` |
| Type | PascalCase | `GameMetadata` |
| Fichier logique | camelCase | `hanoiEngine.ts` |
| Constante | SCREAMING_SNAKE | `MAX_DISKS` |
| Dossier | kebab-case | `math-blocks/` |

### Imports Recommandés

```typescript
// Thème
import { colors, typography, spacing } from '@/theme';

// Composants communs
import { Button, ScreenHeader, PageContainer } from '@/components/common';

// Composants spécifiques au jeu
import { Disk, Tower, GameBoard } from './components';

// Hooks
import { useHanoiGame } from './hooks/useHanoiGame';

// Types
import type { GameState, LevelConfig } from './types';
```

---

## Notes Importantes

1. **Dossiers deprecated** : `/constants/`, `/hooks/` à la racine sont obsolètes. Utiliser `/src/constants/` et `/src/hooks/`.

2. **Double implémentation Labyrinthe** : Le jeu existe à deux endroits :
   - `/src/components/activities/Labyrinthe/` (structure alternative)
   - Potentiellement dans `/src/games/labyrinthe/` (à créer)

3. **Versions de composants** : Certains composants ont des versions :
   - V9 : Version stable actuelle (ex: `GameCardV9`, `HomeHeaderV9`)
   - V10 : Nouvelle version "Forêt Immersive" (ex: `ForestBackgroundV10`, `GameCardV10`)
   - Préférer les versions les plus récentes pour les nouveaux développements.

4. **Store Zustand** : L'état global est géré par Zustand avec des slices séparées pour une meilleure organisation.

5. **Animations** : Utiliser React Native Reanimated 3 pour toutes les animations (60 FPS).

6. **Jeux disponibles** (15 total) :
   - ✅ **Disponibles** (11) : 01-Hanoi, 02-Suites, 03-Labyrinthe, 04-Balance, 05-Sudoku, 06-Conteur, 07-Memory, 08-Tangram, 09-Logix, 10-MotsCroisés, 11-MathBlocks
   - 🔜 **Coming Soon** (4) : 12-Matrices Magiques, 13-Embouteillage, 14-Fabrique Réactions, 15-Chasseur Papillons

7. **Import du thème** : Toujours utiliser `import { theme } from '@/theme'` et non `/constants/`.

---

*Dernière mise à jour : 28 Décembre 2024 — v2.1*
