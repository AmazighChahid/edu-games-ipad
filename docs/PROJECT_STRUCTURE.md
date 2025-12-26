# Architecture du Projet Hello Guys

> Application éducative pour enfants (6-10 ans) - React Native / Expo

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
│   ├── constants/          # Constantes (deprecated)
│   ├── i18n/               # Internationalisation
│   └── utils/              # Utilitaires
├── assets/                 # Images, sons, polices
├── docs/                   # Documentation
├── Fiches Educatives/      # Spécifications pédagogiques
├── hooks/                  # Hooks legacy (deprecated)
└── constants/              # Constantes legacy (deprecated)
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
│   ├── balance/                # Jeu Balance Logique
│   │   ├── _layout.tsx         # Stack navigator du jeu
│   │   └── index.tsx           # Point d'entrée → BalanceIntroScreen
│   │
│   ├── collection/             # Système de collection de cartes
│   │   └── index.tsx           # Écran de la collection
│   │
│   ├── hanoi/                  # Jeu Tour de Hanoï
│   │   ├── _layout.tsx         # Stack navigator du jeu
│   │   ├── index.tsx           # Point d'entrée → HanoiIntroScreen
│   │   └── victory.tsx         # Écran de victoire
│   │
│   ├── labyrinthe/             # Jeu Labyrinthe
│   │   ├── _layout.tsx         # Stack navigator du jeu
│   │   └── index.tsx           # Point d'entrée
│   │
│   ├── logix-grid/             # Jeu Logix Grid (en développement)
│   │   ├── _layout.tsx         # Stack navigator du jeu
│   │   └── index.tsx           # Point d'entrée
│   │
│   ├── math-blocks/            # Jeu MathBlocks
│   │   ├── _layout.tsx         # Stack navigator du jeu
│   │   ├── index.tsx           # Point d'entrée → MathIntroScreen
│   │   ├── play.tsx            # Écran de jeu → MathPlayScreen
│   │   └── victory.tsx         # Écran de victoire → MathVictoryScreen
│   │
│   ├── memory/                 # Jeu Memory (placeholder)
│   │   ├── _layout.tsx         # Stack navigator du jeu
│   │   └── index.tsx           # Coming Soon
│   │
│   ├── sudoku/                 # Jeu Sudoku Montessori
│   │   ├── _layout.tsx         # Stack navigator du jeu
│   │   └── index.tsx           # Point d'entrée → SudokuIntroScreen
│   │
│   ├── suites-logiques/        # Jeu Suites Logiques
│   │   ├── _layout.tsx         # Stack navigator du jeu
│   │   └── index.tsx           # Point d'entrée → SuitesLogiquesGame
│   │
│   └── tangram/                # Jeu Tangram (placeholder)
│       ├── _layout.tsx         # Stack navigator du jeu
│       └── index.tsx           # Coming Soon
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
├── common/                     # Composants UI communs
│   ├── index.ts                # Exports
│   ├── BackButton.tsx          # Bouton retour
│   ├── Button.tsx              # Bouton standard (variants: primary, secondary, ghost)
│   ├── GameModal.tsx           # Modal générique pour les jeux
│   ├── IconButton.tsx          # Bouton avec icône
│   ├── PageContainer.tsx       # Container de page avec SafeArea
│   ├── ParentGate.tsx          # Porte parentale (vérification adulte)
│   ├── ScreenBackground.tsx    # Fond d'écran générique
│   ├── ScreenHeader.tsx        # En-tête d'écran
│   └── VictoryCard.tsx         # Carte de victoire réutilisable
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
├── home/                       # Composants de l'écran d'accueil
│   ├── index.ts                # Exports
│   ├── AISuggestion.tsx        # Suggestion IA personnalisée
│   ├── CardCollection.tsx      # Aperçu collection
│   ├── CategoriesNav.tsx       # Navigation par catégories
│   ├── CategoryRow.tsx         # Ligne de catégorie
│   ├── DailyStreak.tsx         # Série quotidienne
│   ├── GameCard.tsx            # Carte de jeu (ancienne version)
│   ├── GameCardV9.tsx          # Carte de jeu (version actuelle)
│   ├── GameCategoriesSection.tsx # Section des catégories de jeux
│   ├── GamesGrid.tsx           # Grille de jeux
│   ├── Header.tsx              # En-tête (ancienne version)
│   ├── HomeHeaderV9.tsx        # En-tête (version actuelle)
│   ├── MascotBubble.tsx        # Bulle mascotte accueil
│   ├── PiouMascot.tsx          # Mascotte Piou (hibou)
│   ├── ProgressGarden.tsx      # Jardin de progression
│   └── widgets/                # Widgets de la barre latérale
│       ├── index.ts            # Exports
│       ├── CollectionWidgetV9.tsx # Widget collection
│       ├── GardenWidget.tsx    # Widget jardin
│       ├── PiouWidget.tsx      # Widget mascotte Piou
│       ├── StreakWidget.tsx    # Widget série quotidienne
│       └── WidgetsSection.tsx  # Section widgets complète
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
├── balance/                    # Jeu Balance Logique
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
├── hanoi/                      # Jeu Tour de Hanoï
│   ├── index.ts                # Exports publics
│   ├── types.ts                # Types TypeScript (14 types)
│   ├── components/
│   │   ├── index.ts            # Exports composants
│   │   ├── Disk.tsx            # Disque individuel
│   │   ├── DraggableDisk.tsx   # Disque déplaçable
│   │   ├── DraggableDiskEnhanced.tsx # Version améliorée
│   │   ├── DraggableGameBoard.tsx    # Plateau avec drag & drop
│   │   ├── DraggableTower.tsx  # Tour avec drag & drop
│   │   ├── FloatingButtons.tsx # Boutons flottants (aide, reset)
│   │   ├── GameBackground.tsx  # Fond du jeu
│   │   ├── GameBoard.tsx       # Plateau de jeu (tap)
│   │   ├── MascotOwl.tsx       # Mascotte hibou
│   │   ├── ProgressPanel.tsx   # Panel de progression
│   │   ├── Tower.tsx           # Tour individuelle
│   │   ├── TowerLabel.tsx      # Label de tour
│   │   ├── VictoryCelebration.tsx # Célébration victoire
│   │   ├── WoodenBase.tsx      # Base en bois
│   │   └── feedback/           # Composants de feedback victoire
│   │       ├── index.ts
│   │       ├── ActionButtons.tsx       # Boutons d'action
│   │       ├── CardBack.tsx            # Dos de carte
│   │       ├── CardFront.tsx           # Face de carte
│   │       ├── CollectibleCardFlip.tsx # Animation flip carte
│   │       ├── CollectionProgress.tsx  # Progression collection
│   │       ├── ConfettiLayer.tsx       # Confettis animés
│   │       ├── MascotCelebration.tsx   # Mascotte qui célèbre
│   │       ├── PerformanceAnalysis.tsx # Analyse performance
│   │       ├── PopupHeader.tsx         # En-tête popup
│   │       ├── StatsSection.tsx        # Section statistiques
│   │       ├── VictoryMascot.tsx       # Mascotte victoire
│   │       ├── VictoryOverlay.tsx      # Overlay de victoire
│   │       └── VictoryPopup.tsx        # Popup de victoire
│   ├── data/
│   │   ├── assistantScripts.ts # Scripts de l'assistant IA
│   │   ├── collectibleCards.ts # Cartes à collectionner
│   │   └── levels.ts           # Configuration des 4 niveaux
│   ├── hooks/
│   │   └── useHanoiGame.ts     # Hook principal (~400 lignes)
│   ├── logic/
│   │   ├── cardAwardEngine.ts  # Attribution des cartes
│   │   ├── hanoiEngine.ts      # Algorithme de résolution optimale
│   │   └── moveValidator.ts    # Validation des déplacements
│   └── screens/
│       ├── index.ts
│       ├── HanoiIntroScreen.tsx    # Écran d'introduction
│       └── HanoiVictoryScreen.tsx  # Écran de victoire
│
├── math-blocks/                # Jeu MathBlocks
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
├── sudoku/                     # Jeu Sudoku Montessori
│   ├── index.ts                # Exports publics
│   ├── COMPONENTS_CATALOG.md   # Catalogue des composants
│   ├── INTEGRATION_GUIDE.md    # Guide d'intégration
│   ├── components/
│   │   ├── index.ts
│   │   ├── FloatingActionButtons.tsx # Boutons flottants
│   │   ├── GameTimer.tsx       # Chronomètre
│   │   ├── LibraryDecoration.tsx    # Décoration bibliothèque
│   │   ├── ProfessorHooMascot.tsx   # Mascotte Prof Hibou
│   │   ├── ProgressBar.tsx     # Barre de progression
│   │   ├── StatsPanel.tsx      # Panel de stats
│   │   ├── SudokuBackground.tsx     # Fond du jeu
│   │   ├── SudokuCell.tsx      # Cellule individuelle
│   │   ├── SudokuGrid.tsx      # Grille Sudoku
│   │   └── SymbolSelector.tsx  # Sélecteur de symboles
│   ├── hooks/
│   │   └── useSudokuGame.ts    # Hook principal
│   ├── logic/
│   │   ├── generator.ts        # Générateur de grilles
│   │   └── validation.ts       # Validation des règles
│   ├── screens/
│   │   ├── index.ts
│   │   └── SudokuIntroScreen.tsx   # Introduction
│   └── types/
│       └── index.ts            # Types TypeScript
│
└── suites-logiques/            # Jeu Suites Logiques
    ├── index.ts                # Exports publics
    ├── components/
    │   ├── ChoicePanel.tsx     # Panel de choix
    │   ├── MascotRobot.tsx     # Mascotte Robot
    │   ├── MissingSlot.tsx     # Emplacement manquant
    │   ├── SequenceDisplay.tsx # Affichage de la séquence
    │   ├── SequenceElement.tsx # Élément de séquence
    │   ├── SuitesLogiquesGame.tsx  # Composant principal
    │   └── svg/                # Éléments SVG thématiques
    │       ├── FarmAnimals.tsx     # Animaux de ferme
    │       ├── GeometricShapes.tsx # Formes géométriques
    │       ├── MusicElements.tsx   # Éléments musicaux
    │       └── SpaceElements.tsx   # Éléments spatiaux
    ├── constants/
    │   └── gameConfig.ts       # Configuration du jeu
    ├── data/
    │   ├── patterns.ts         # Patterns de séquences
    │   └── themes.ts           # Thèmes visuels
    ├── hooks/
    │   ├── useSequenceGenerator.ts # Générateur de séquences
    │   ├── useStreakTracker.ts     # Suivi des séries
    │   └── useSuitesGame.ts        # Hook principal
    ├── types/
    │   └── index.ts            # Types TypeScript
    └── utils/
        └── patternUtils.ts     # Utilitaires pour patterns
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

### `/src/theme/` - Design System

```
src/theme/
├── index.ts                    # Export du thème complet
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
└── touchTargets.ts             # Tailles tactiles
                                # - Minimum: 44pt
                                # - Standard enfant: 64pt
                                # - Hit slop configurations
```

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

### `/src/constants/` - Constantes (deprecated)

```
src/constants/
├── index.ts                    # Exports
├── colors.ts                   # Couleurs (utiliser theme/colors.ts)
├── spacing.ts                  # Espacement (utiliser theme/spacing.ts)
└── typography.ts               # Typographie (utiliser theme/typography.ts)
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
├── PROJECT_STRUCTURE.md        # Ce fichier
├── DESIGN_SYSTEM.md            # Système de design
├── UI_PATTERNS.md              # Patterns UI réutilisables
├── GUIDELINES_AUDIT.md         # Audit des guidelines
├── MASCOT_ROBOT_IMPLEMENTATION.md  # Implémentation mascotte robot
├── ROBOT_VISUAL_GUIDE.md       # Guide visuel du robot
├── SYNTHESE_STANDARDISATION.md # Synthèse standardisation
├── CHANGELOG_SUITES_LOGIQUES.md    # Changelog Suites Logiques
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

3. **Versions de composants** : Certains composants ont des versions (ex: `GameCard` vs `GameCardV9`). Préférer les versions les plus récentes (V9).

4. **Store Zustand** : L'état global est géré par Zustand avec des slices séparées pour une meilleure organisation.

5. **Animations** : Utiliser React Native Reanimated 3 pour toutes les animations (60 FPS).

---

*Dernière mise à jour : Décembre 2024*
