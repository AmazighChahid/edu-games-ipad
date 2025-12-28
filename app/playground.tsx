/**
 * Playground - Page de test pour prévisualiser des composants isolément
 * Permet de sélectionner un composant via une recherche avec autocomplétion
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

// ============================================================
// IMPORTS - Background Components
// ============================================================
import { Flowers } from '../src/components/background/Flowers';
import { Hills as BackgroundHills } from '../src/components/background/Hills';
import { AnimatedClouds } from '../src/components/background/AnimatedCloud';
import { Mountains as BackgroundMountains } from '../src/components/background/Mountains';
import { Trees as BackgroundTrees } from '../src/components/background/Trees';
import { ForestBackground } from '../src/components/background/ForestBackground';
import { Sun as BackgroundSun } from '../src/components/background/Sun';

// Background Animals (réexportés depuis home-v10/animals, sauf Dragonfly)
import { Dragonfly } from '../src/components/background/animals/Dragonfly';
import {
  Rabbit as BackgroundRabbit,
  Butterflies as BackgroundButterflies,
  Bee as BackgroundBee,
  Ladybug as BackgroundLadybug,
  Birds as BackgroundBirds,
  Squirrel as BackgroundSquirrel,
} from '../src/components/background/animals';

// ============================================================
// IMPORTS - Common Components
// ============================================================
import { BackButton } from '../src/components/common/BackButton';
import { Button } from '../src/components/common/Button';
import { Confetti } from '../src/components/common/Confetti';
import { GameActionButtons } from '../src/components/common/GameActionButtons';
import { VictoryCard } from '../src/components/common/VictoryCard';
import { SpeechBubble } from '../src/components/common/SpeechBubble';
import { PageContainer } from '../src/components/common/PageContainer';
import { GameModal } from '../src/components/common/GameModal';
import { ScreenHeader } from '../src/components/common/ScreenHeader';
import { ParentGate } from '../src/components/common/ParentGate';
import { CardFlip } from '../src/components/common/CardFlip';
import { HintButton } from '../src/components/common/HintButton';
import { ScreenBackground } from '../src/components/common/ScreenBackground';
import { IconButton } from '../src/components/common/IconButton';
import { ProgressIndicator } from '../src/components/common/ProgressIndicator';
import { VictoryOverlayBase } from '../src/components/common/VictoryOverlayBase';
import { PerformanceStats } from '../src/components/common/PerformanceStats';

// ============================================================
// IMPORTS - Home V10 Components
// ============================================================
import { GameCardV10 } from '../src/components/home-v10/GameCardV10';
import { PiouFloating } from '../src/components/home-v10/PiouFloating';
import { CollectionFloating } from '../src/components/home-v10/CollectionFloating';
import { HomeHeaderV10 } from '../src/components/home-v10/HomeHeaderV10';
import { ForestBackgroundV10 } from '../src/components/home-v10/ForestBackgroundV10';

// Home V10 Layers
import { Hills as LayerHills } from '../src/components/home-v10/layers/Hills';
import { Clouds } from '../src/components/home-v10/layers/Clouds';
import { MountainsFar as LayerMountains } from '../src/components/home-v10/layers/Mountains';
import { Sky } from '../src/components/home-v10/layers/Sky';
import { Garden } from '../src/components/home-v10/layers/Garden';
import { Trees as LayerTrees } from '../src/components/home-v10/layers/Trees';
import { Bushes } from '../src/components/home-v10/layers/Bushes';
import { Sun as LayerSun } from '../src/components/home-v10/layers/Sun';

// Home V10 Animals
import { Butterflies } from '../src/components/home-v10/animals/Butterflies';
import { Rabbit as HomeRabbit } from '../src/components/home-v10/animals/Rabbit';
import { Bee as HomeBee } from '../src/components/home-v10/animals/Bee';
import { Ladybug as HomeLadybug } from '../src/components/home-v10/animals/Ladybug';
import { Squirrel as HomeSquirrel } from '../src/components/home-v10/animals/Squirrel';
import { Birds } from '../src/components/home-v10/animals/Birds';

// ============================================================
// IMPORTS - Decorations
// ============================================================
import { FloatingFlowers } from '../src/components/decorations/FloatingFlowers';
import { Hills as DecoHills } from '../src/components/decorations/Hills';
import { AnimatedCloud as DecoAnimatedCloud } from '../src/components/decorations/AnimatedCloud';
import { AnimatedSun } from '../src/components/decorations/AnimatedSun';
import { AnimatedButterfly } from '../src/components/decorations/AnimatedButterfly';
import { AnimatedTree } from '../src/components/decorations/AnimatedTree';

// ============================================================
// IMPORTS - Layout
// ============================================================
import { GameContainer } from '../src/components/layout/GameContainer';

// ============================================================
// IMPORTS - Collection
// ============================================================
import { CollectionCard } from '../src/components/collection/CollectionCard';
import { CollectionBook } from '../src/components/collection/CollectionBook';
import { CategoryTabs } from '../src/components/collection/CategoryTabs';
import { CollectionPage } from '../src/components/collection/CollectionPage';
import { CardDetailModal } from '../src/components/collection/CardDetailModal';
import { CardUnlockScreen } from '../src/components/collection/CardUnlockScreen';

// ============================================================
// IMPORTS - Assistant
// ============================================================
import { AssistantBubble } from '../src/components/assistant/AssistantBubble';

// ============================================================
// IMPORTS - Parent Components
// ============================================================
import { SkillsRadar } from '../src/components/parent/SkillsRadar';
import { StrengthsCard } from '../src/components/parent/StrengthsCard';
import { BehaviorInsights } from '../src/components/parent/BehaviorInsights';
import { ParentDrawer } from '../src/components/parent/ParentDrawer';
import { ScreenTimeCard } from '../src/components/parent/ScreenTimeCard';
import { ProgressChart } from '../src/components/parent/ProgressChart';
import { SkillsRadarV2 } from '../src/components/parent/SkillsRadarV2';
import { ParentZone } from '../src/components/parent/ParentZone';
import { BadgesGallery } from '../src/components/parent/BadgesGallery';
import { RecommendationsCard } from '../src/components/parent/RecommendationsCard';
import { GoalEditor } from '../src/components/parent/GoalEditor';
import { ChildSelector } from '../src/components/parent/ChildSelector';
import { ParentTabs } from '../src/components/parent/ParentTabs';
import { ActivityTimeline } from '../src/components/parent/ActivityTimeline';
import { WeeklyChart } from '../src/components/parent/WeeklyChart';
import { ParentDashboard } from '../src/components/parent/ParentDashboard';
import { GoalsSection } from '../src/components/parent/GoalsSection';

// ============================================================
// IMPORTS - Hanoi Game
// ============================================================
import { GameBoard } from '../src/games/01-hanoi/components/GameBoard';
import { GameBackground as HanoiBackground } from '../src/games/01-hanoi/components/GameBackground';
import { Tower } from '../src/games/01-hanoi/components/Tower';
import { Disk } from '../src/games/01-hanoi/components/Disk';
import { TowerLabel } from '../src/games/01-hanoi/components/TowerLabel';
import { ProgressPanel } from '../src/games/01-hanoi/components/ProgressPanel';
import { FloatingButtons } from '../src/games/01-hanoi/components/FloatingButtons';
import { MascotOwl } from '../src/games/01-hanoi/components/MascotOwl';
import { WoodenBase } from '../src/games/01-hanoi/components/WoodenBase';
import { VictoryCelebration } from '../src/games/01-hanoi/components/VictoryCelebration';

// Hanoi Feedback
import { CollectionProgress } from '../src/games/01-hanoi/components/feedback/CollectionProgress';
import { VictoryPopup } from '../src/games/01-hanoi/components/feedback/VictoryPopup';
import { VictoryOverlay } from '../src/games/01-hanoi/components/feedback/VictoryOverlay';
import { VictoryMascot } from '../src/games/01-hanoi/components/feedback/VictoryMascot';
import { CollectibleCardFlip } from '../src/games/01-hanoi/components/feedback/CollectibleCardFlip';
import { PopupHeader } from '../src/games/01-hanoi/components/feedback/PopupHeader';
import { StatsSection } from '../src/games/01-hanoi/components/feedback/StatsSection';
import { MascotCelebration } from '../src/games/01-hanoi/components/feedback/MascotCelebration';
import { CardFront } from '../src/games/01-hanoi/components/feedback/CardFront';
import { CardBack } from '../src/games/01-hanoi/components/feedback/CardBack';

// ============================================================
// IMPORTS - Memory Game
// ============================================================
import { GameBoard as MemoryGameBoard } from '../src/games/07-memory/components/GameBoard';
import { MemoryGrid } from '../src/games/07-memory/components/MemoryGrid';
import { MemoryCard } from '../src/games/07-memory/components/MemoryCard';

// ============================================================
// IMPORTS - Math Blocks Game
// ============================================================
import { ScoreDisplay } from '../src/games/11-math-blocks/components/ScoreDisplay';
import { MathBlock } from '../src/games/11-math-blocks/components/MathBlock';
import { GameGrid } from '../src/games/11-math-blocks/components/GameGrid';

// ============================================================
// IMPORTS - Conteur Curieux Game
// ============================================================
import { PlumeMascot } from '../src/games/06-conteur-curieux/components/PlumeMascot';
import { AudioPlayer } from '../src/games/06-conteur-curieux/components/AudioPlayer';
import { QuestionCard } from '../src/games/06-conteur-curieux/components/QuestionCard';
import { SkillBadge } from '../src/games/06-conteur-curieux/components/SkillBadge';
import { CollectibleCard } from '../src/games/06-conteur-curieux/components/CollectibleCard';
import { FeedbackOverlay } from '../src/games/06-conteur-curieux/components/FeedbackOverlay';
import { LibraryBackground } from '../src/games/06-conteur-curieux/components/LibraryBackground';
import { ModeSelectionModal } from '../src/games/06-conteur-curieux/components/ModeSelectionModal';
import { StoryCard } from '../src/games/06-conteur-curieux/components/StoryCard';
import { VocabularyBubble } from '../src/games/06-conteur-curieux/components/VocabularyBubble';
import { AnswerButton } from '../src/games/06-conteur-curieux/components/AnswerButton';
import { RaysEffect } from '../src/games/06-conteur-curieux/components/RaysEffect';
import { FilterTabs } from '../src/games/06-conteur-curieux/components/FilterTabs';
import { StoryReader } from '../src/games/06-conteur-curieux/components/StoryReader';
import { StoryIllustration } from '../src/games/06-conteur-curieux/components/StoryIllustration';
import { StarsRow } from '../src/games/06-conteur-curieux/components/StarsRow';
import { RadarChart } from '../src/games/06-conteur-curieux/components/RadarChart';
import { RecordingsList } from '../src/games/06-conteur-curieux/components/RecordingsList';

// Conteur Illustrations
import { ForestScene } from '../src/games/06-conteur-curieux/assets/illustrations/ForestScene';
import { FamilyScene } from '../src/games/06-conteur-curieux/assets/illustrations/FamilyScene';
import { FriendshipScene } from '../src/games/06-conteur-curieux/assets/illustrations/FriendshipScene';
import { MagicScene } from '../src/games/06-conteur-curieux/assets/illustrations/MagicScene';
import { AdventureScene } from '../src/games/06-conteur-curieux/assets/illustrations/AdventureScene';

// ============================================================
// IMPORTS - Mots Croisés Game
// ============================================================
import { CrosswordCell } from '../src/games/10-mots-croises/components/CrosswordCell';
import { GameBoard as CrosswordGameBoard } from '../src/games/10-mots-croises/components/GameBoard';
import { ClueList } from '../src/games/10-mots-croises/components/ClueList';
import { Keyboard } from '../src/games/10-mots-croises/components/Keyboard';
import { CrosswordGrid } from '../src/games/10-mots-croises/components/CrosswordGrid';

// ============================================================
// IMPORTS - Sudoku Game
// ============================================================
import { SudokuBackground } from '../src/games/05-sudoku/components/SudokuBackground';
import { GameTimer } from '../src/games/05-sudoku/components/GameTimer';
import { SymbolSelector } from '../src/games/05-sudoku/components/SymbolSelector';
import { LibraryDecoration } from '../src/games/05-sudoku/components/LibraryDecoration';
import { StatsPanel } from '../src/games/05-sudoku/components/StatsPanel';
import { SudokuGrid } from '../src/games/05-sudoku/components/SudokuGrid';
import { ProgressBar } from '../src/games/05-sudoku/components/ProgressBar';
import { SudokuCell } from '../src/games/05-sudoku/components/SudokuCell';
import { ProfessorHooMascot } from '../src/games/05-sudoku/components/ProfessorHooMascot';
import { FelixMascot } from '../src/games/05-sudoku/components/FelixMascot';
import { FloatingActionButtons } from '../src/games/05-sudoku/components/FloatingActionButtons';

// ============================================================
// IMPORTS - Balance Game
// ============================================================
import { EquivalenceJournal } from '../src/games/04-balance/components/EquivalenceJournal';
import { WeightObject } from '../src/games/04-balance/components/WeightObject';
import { SandboxMode } from '../src/games/04-balance/components/SandboxMode';
import { DrHibou } from '../src/games/04-balance/components/DrHibou';
import { LevelSelector } from '../src/games/04-balance/components/LevelSelector';
import { BalanceScale } from '../src/games/04-balance/components/BalanceScale';

// ============================================================
// IMPORTS - Matrices Magiques Game
// ============================================================
import { ValidateButton } from '../src/games/12-matrices-magiques/components/ui/ValidateButton';
import { ProgressDots } from '../src/games/12-matrices-magiques/components/ui/ProgressDots';
import { AttemptsDisplay } from '../src/games/12-matrices-magiques/components/ui/AttemptsDisplay';
import { ChoiceButton } from '../src/games/12-matrices-magiques/components/choices/ChoiceButton';
import { ChoicePanel } from '../src/games/12-matrices-magiques/components/choices/ChoicePanel';
import { WorldSelector } from '../src/games/12-matrices-magiques/components/world/WorldSelector';
import { WorldCard } from '../src/games/12-matrices-magiques/components/world/WorldCard';
import { ShapeRenderer } from '../src/games/12-matrices-magiques/components/shapes/ShapeRenderer';
import { SpeechBubble as MatrixSpeechBubble } from '../src/games/12-matrices-magiques/components/mascot/SpeechBubble';
import { PixelWithBubble } from '../src/games/12-matrices-magiques/components/mascot/PixelWithBubble';
import { PixelMascot } from '../src/games/12-matrices-magiques/components/mascot/PixelMascot';
import { MatrixCell } from '../src/games/12-matrices-magiques/components/grid/MatrixCell';
import { MatrixGrid } from '../src/games/12-matrices-magiques/components/grid/MatrixGrid';

// ============================================================
// IMPORTS - Suites Logiques Game
// ============================================================
import { SequenceDisplay } from '../src/games/02-suites-logiques/components/SequenceDisplay';
import { SequenceElement } from '../src/games/02-suites-logiques/components/SequenceElement';
import { ChoicePanel as SuitesChoicePanel } from '../src/games/02-suites-logiques/components/ChoicePanel';
import { SuitesLogiquesGame } from '../src/games/02-suites-logiques/components/SuitesLogiquesGame';
import { MascotRobot } from '../src/games/02-suites-logiques/components/MascotRobot';
import { MissingSlot } from '../src/games/02-suites-logiques/components/MissingSlot';

// ============================================================
// IMPORTS - Labyrinthe Game
// ============================================================
import { VictoryScreen as LabyVictoryScreen } from '../src/games/03-labyrinthe/components/VictoryScreen';
import { InteractiveElement } from '../src/games/03-labyrinthe/components/InteractiveElement';
import { InstructionQueue } from '../src/games/03-labyrinthe/components/InstructionQueue';
import { Inventory } from '../src/games/03-labyrinthe/components/Inventory';
import { PathTrail } from '../src/games/03-labyrinthe/components/PathTrail';
import { MazeGrid } from '../src/games/03-labyrinthe/components/MazeGrid';
import { MascotBubble } from '../src/games/03-labyrinthe/components/MascotBubble';
import { Avatar } from '../src/games/03-labyrinthe/components/Avatar';
import { ProgrammingControls } from '../src/games/03-labyrinthe/components/ProgrammingControls';
import { DirectionalControls } from '../src/games/03-labyrinthe/components/DirectionalControls';
import { MazeCell } from '../src/games/03-labyrinthe/components/MazeCell';
import { LabyrintheGame } from '../src/games/03-labyrinthe/LabyrintheGame';

// ============================================================
// IMPORTS - Logix Grid Game
// ============================================================
import { GameBoard as LogixGameBoard } from '../src/games/09-logix-grid/components/GameBoard';
import { CluePanel } from '../src/games/09-logix-grid/components/CluePanel';
import { LogixGrid } from '../src/games/09-logix-grid/components/LogixGrid';
import { GridCell } from '../src/games/09-logix-grid/components/GridCell';

// ============================================================
// IMPORTS - Tangram Game
// ============================================================
import { TangramPiece } from '../src/games/08-tangram/components/TangramPiece';
import { TangramBoard } from '../src/games/08-tangram/components/TangramBoard';
import { ShadowShape } from '../src/games/08-tangram/components/ShadowShape';

// Type pour un composant du registre
interface PlaygroundComponent {
  id: string;
  name: string;
  category: string;
  filePath?: string;
  component: React.ComponentType<any>;
  defaultProps?: Record<string, any>;
  description?: string;
}

// Registre des composants disponibles
const COMPONENT_REGISTRY: PlaygroundComponent[] = [
  // ========== BACKGROUND ==========
  {
    id: 'flowers',
    name: 'Flowers',
    category: 'Background',
    filePath: 'src/components/background/Flowers.tsx',
    component: Flowers,
    defaultProps: {},
    description: 'Fleurs animées du décor',
  },
  {
    id: 'background-hills',
    name: 'Hills',
    category: 'Background',
    filePath: 'src/components/background/Hills.tsx',
    component: BackgroundHills,
    defaultProps: {},
    description: 'Collines du fond',
  },
  {
    id: 'animated-clouds',
    name: 'AnimatedClouds',
    category: 'Background',
    filePath: 'src/components/background/AnimatedCloud.tsx',
    component: AnimatedClouds,
    defaultProps: {},
    description: 'Nuages animés',
  },
  {
    id: 'background-mountains',
    name: 'Mountains',
    category: 'Background',
    filePath: 'src/components/background/Mountains.tsx',
    component: BackgroundMountains,
    defaultProps: {},
    description: 'Montagnes du fond',
  },
  {
    id: 'background-trees',
    name: 'Trees',
    category: 'Background',
    filePath: 'src/components/background/Trees.tsx',
    component: BackgroundTrees,
    defaultProps: {},
    description: 'Arbres du décor',
  },
  {
    id: 'forest-background',
    name: 'ForestBackground',
    category: 'Background',
    filePath: 'src/components/background/ForestBackground.tsx',
    component: ForestBackground,
    defaultProps: {},
    description: 'Fond de forêt complet',
  },
  {
    id: 'background-sun',
    name: 'Sun',
    category: 'Background',
    filePath: 'src/components/background/Sun.tsx',
    component: BackgroundSun,
    defaultProps: {},
    description: 'Soleil animé',
  },

  // ========== BACKGROUND ANIMALS ==========
  {
    id: 'dragonfly',
    name: 'Dragonfly',
    category: 'Background Animals',
    filePath: 'src/components/background/animals/Dragonfly.tsx',
    component: Dragonfly,
    defaultProps: {},
    description: 'Libellule animée',
  },
  {
    id: 'background-rabbit',
    name: 'Rabbit',
    category: 'Background Animals',
    filePath: 'src/components/background/animals/Rabbit.tsx',
    component: BackgroundRabbit,
    defaultProps: {},
    description: 'Lapin du décor',
  },
  {
    id: 'background-butterflies',
    name: 'Butterflies',
    category: 'Background Animals',
    filePath: 'src/components/background/animals/Butterfly.tsx',
    component: BackgroundButterflies,
    defaultProps: {},
    description: 'Papillons animés',
  },
  {
    id: 'background-bee',
    name: 'Bee',
    category: 'Background Animals',
    filePath: 'src/components/background/animals/Bee.tsx',
    component: BackgroundBee,
    defaultProps: {},
    description: 'Abeille du décor',
  },
  {
    id: 'background-ladybug',
    name: 'Ladybug',
    category: 'Background Animals',
    filePath: 'src/components/background/animals/Ladybug.tsx',
    component: BackgroundLadybug,
    defaultProps: {},
    description: 'Coccinelle du décor',
  },
  {
    id: 'background-birds',
    name: 'Birds',
    category: 'Background Animals',
    filePath: 'src/components/background/animals/Bird.tsx',
    component: BackgroundBirds,
    defaultProps: {},
    description: 'Oiseaux animés',
  },
  {
    id: 'background-squirrel',
    name: 'Squirrel',
    category: 'Background Animals',
    filePath: 'src/components/background/animals/Squirrel.tsx',
    component: BackgroundSquirrel,
    defaultProps: {},
    description: 'Écureuil du décor',
  },

  // ========== COMMON ==========
  {
    id: 'back-button',
    name: 'BackButton',
    category: 'Common',
    filePath: 'src/components/common/BackButton.tsx',
    component: BackButton,
    defaultProps: {
      onPress: () => console.log('Back pressed'),
    },
    description: 'Bouton retour',
  },
  {
    id: 'button',
    name: 'Button',
    category: 'Common',
    filePath: 'src/components/common/Button.tsx',
    component: Button,
    defaultProps: {
      title: 'Cliquez-moi',
      onPress: () => console.log('Button pressed'),
    },
    description: 'Bouton générique',
  },
  {
    id: 'confetti',
    name: 'Confetti',
    category: 'Common',
    filePath: 'src/components/common/Confetti.tsx',
    component: Confetti,
    defaultProps: {
      type: 'emoji',
      count: 20,
    },
    description: 'Animation de confettis',
  },
  {
    id: 'game-action-buttons',
    name: 'GameActionButtons',
    category: 'Common',
    filePath: 'src/components/common/GameActionButtons.tsx',
    component: GameActionButtons,
    defaultProps: {
      onHint: () => console.log('Hint'),
      onReset: () => console.log('Reset'),
      onBack: () => console.log('Back'),
    },
    description: 'Boutons d\'action de jeu',
  },
  {
    id: 'victory-card',
    name: 'VictoryCard',
    category: 'Common',
    filePath: 'src/components/common/VictoryCard.tsx',
    component: VictoryCard,
    defaultProps: {
      title: 'Bravo!',
      message: 'Tu as gagné!',
    },
    description: 'Carte de victoire',
  },
  {
    id: 'speech-bubble',
    name: 'SpeechBubble',
    category: 'Common',
    filePath: 'src/components/common/SpeechBubble.tsx',
    component: SpeechBubble,
    defaultProps: {
      message: 'Bonjour!',
    },
    description: 'Bulle de dialogue',
  },
  {
    id: 'screen-header',
    name: 'ScreenHeader',
    category: 'Common',
    filePath: 'src/components/common/ScreenHeader.tsx',
    component: ScreenHeader,
    defaultProps: {
      title: 'Mon écran',
    },
    description: 'En-tête d\'écran',
  },
  {
    id: 'hint-button',
    name: 'HintButton',
    category: 'Common',
    filePath: 'src/components/common/HintButton.tsx',
    component: HintButton,
    defaultProps: {
      onPress: () => console.log('Hint'),
    },
    description: 'Bouton d\'indice',
  },
  {
    id: 'icon-button',
    name: 'IconButton',
    category: 'Common',
    filePath: 'src/components/common/IconButton.tsx',
    component: IconButton,
    defaultProps: {
      icon: '⭐',
      onPress: () => console.log('Icon pressed'),
    },
    description: 'Bouton avec icône',
  },
  {
    id: 'progress-indicator',
    name: 'ProgressIndicator',
    category: 'Common',
    filePath: 'src/components/common/ProgressIndicator.tsx',
    component: ProgressIndicator,
    defaultProps: {
      current: 3,
      total: 10,
    },
    description: 'Indicateur de progression',
  },
  {
    id: 'performance-stats',
    name: 'PerformanceStats',
    category: 'Common',
    filePath: 'src/components/common/PerformanceStats.tsx',
    component: PerformanceStats,
    defaultProps: {},
    description: 'Stats de performance',
  },

  // ========== HOME V10 ==========
  {
    id: 'game-card-v10',
    name: 'GameCardV10',
    category: 'Home V10',
    filePath: 'src/components/home-v10/GameCardV10.tsx',
    component: GameCardV10,
    defaultProps: {
      id: 'demo',
      title: 'Les Barres Numériques',
      theme: 'barres',
      progress: 2,
      isFavorite: false,
      onPress: () => console.log('GameCard pressed'),
      onPlayAudio: () => console.log('Play audio'),
      onToggleFavorite: () => console.log('Toggle favorite'),
    },
    description: 'Carte de jeu style widget Edoki',
  },
  {
    id: 'piou-floating',
    name: 'PiouFloating',
    category: 'Home V10',
    filePath: 'src/components/home-v10/PiouFloating.tsx',
    component: PiouFloating,
    defaultProps: {
      message: 'Essaie le jeu ',
      highlightedPart: 'Tour de Hanoï',
      actionLabel: 'Jouer maintenant',
      onActionPress: () => console.log('Action pressed'),
    },
    description: 'Mascotte flottante avec message',
  },
  {
    id: 'collection-floating',
    name: 'CollectionFloating',
    category: 'Home V10',
    filePath: 'src/components/home-v10/CollectionFloating.tsx',
    component: CollectionFloating,
    defaultProps: {
      cardCount: 12,
      onPress: () => console.log('Collection pressed'),
    },
    description: 'Widget collection flottant',
  },
  {
    id: 'home-header-v10',
    name: 'HomeHeaderV10',
    category: 'Home V10',
    filePath: 'src/components/home-v10/HomeHeaderV10.tsx',
    component: HomeHeaderV10,
    defaultProps: {
      profile: {
        name: 'Emma',
        avatarEmoji: '🦊',
        level: 5,
        gems: 120,
        totalMedals: 8,
      },
      onParentPress: () => console.log('Parent pressed'),
    },
    description: 'Header de la page d\'accueil',
  },
  {
    id: 'forest-background-v10',
    name: 'ForestBackgroundV10',
    category: 'Home V10',
    filePath: 'src/components/home-v10/ForestBackgroundV10.tsx',
    component: ForestBackgroundV10,
    defaultProps: {},
    description: 'Fond de forêt V10',
  },

  // ========== HOME V10 LAYERS ==========
  {
    id: 'layer-hills',
    name: 'Hills (Layer)',
    category: 'Home V10 Layers',
    filePath: 'src/components/home-v10/layers/Hills.tsx',
    component: LayerHills,
    defaultProps: {},
    description: 'Layer de collines',
  },
  {
    id: 'clouds',
    name: 'Clouds',
    category: 'Home V10 Layers',
    filePath: 'src/components/home-v10/layers/Clouds.tsx',
    component: Clouds,
    defaultProps: {},
    description: 'Layer de nuages',
  },
  {
    id: 'layer-mountains',
    name: 'Mountains (Layer)',
    category: 'Home V10 Layers',
    filePath: 'src/components/home-v10/layers/Mountains.tsx',
    component: LayerMountains,
    defaultProps: {},
    description: 'Layer de montagnes',
  },
  {
    id: 'sky',
    name: 'Sky',
    category: 'Home V10 Layers',
    filePath: 'src/components/home-v10/layers/Sky.tsx',
    component: Sky,
    defaultProps: {},
    description: 'Layer du ciel',
  },
  {
    id: 'garden',
    name: 'Garden',
    category: 'Home V10 Layers',
    filePath: 'src/components/home-v10/layers/Garden.tsx',
    component: Garden,
    defaultProps: {},
    description: 'Layer du jardin',
  },
  {
    id: 'layer-trees',
    name: 'Trees (Layer)',
    category: 'Home V10 Layers',
    filePath: 'src/components/home-v10/layers/Trees.tsx',
    component: LayerTrees,
    defaultProps: {},
    description: 'Layer d\'arbres',
  },
  {
    id: 'bushes',
    name: 'Bushes',
    category: 'Home V10 Layers',
    filePath: 'src/components/home-v10/layers/Bushes.tsx',
    component: Bushes,
    defaultProps: {},
    description: 'Layer de buissons',
  },
  {
    id: 'layer-sun',
    name: 'Sun (Layer)',
    category: 'Home V10 Layers',
    filePath: 'src/components/home-v10/layers/Sun.tsx',
    component: LayerSun,
    defaultProps: {},
    description: 'Layer du soleil',
  },

  // ========== HOME V10 ANIMALS ==========
  {
    id: 'butterflies',
    name: 'Butterflies',
    category: 'Home V10 Animals',
    filePath: 'src/components/home-v10/animals/Butterflies.tsx',
    component: Butterflies,
    defaultProps: {},
    description: 'Papillons animés',
  },
  {
    id: 'home-rabbit',
    name: 'Rabbit (Home)',
    category: 'Home V10 Animals',
    filePath: 'src/components/home-v10/animals/Rabbit.tsx',
    component: HomeRabbit,
    defaultProps: {},
    description: 'Lapin de la home',
  },
  {
    id: 'home-bee',
    name: 'Bee (Home)',
    category: 'Home V10 Animals',
    filePath: 'src/components/home-v10/animals/Bee.tsx',
    component: HomeBee,
    defaultProps: {},
    description: 'Abeille de la home',
  },
  {
    id: 'home-ladybug',
    name: 'Ladybug (Home)',
    category: 'Home V10 Animals',
    filePath: 'src/components/home-v10/animals/Ladybug.tsx',
    component: HomeLadybug,
    defaultProps: {},
    description: 'Coccinelle de la home',
  },
  {
    id: 'home-squirrel',
    name: 'Squirrel (Home)',
    category: 'Home V10 Animals',
    filePath: 'src/components/home-v10/animals/Squirrel.tsx',
    component: HomeSquirrel,
    defaultProps: {},
    description: 'Écureuil de la home',
  },
  {
    id: 'birds',
    name: 'Birds',
    category: 'Home V10 Animals',
    filePath: 'src/components/home-v10/animals/Birds.tsx',
    component: Birds,
    defaultProps: {},
    description: 'Oiseaux animés',
  },

  // ========== DECORATIONS ==========
  {
    id: 'floating-flowers',
    name: 'FloatingFlowers',
    category: 'Decorations',
    filePath: 'src/components/decorations/FloatingFlowers.tsx',
    component: FloatingFlowers,
    defaultProps: {},
    description: 'Fleurs flottantes',
  },
  {
    id: 'deco-hills',
    name: 'Hills (Deco)',
    category: 'Decorations',
    filePath: 'src/components/decorations/Hills.tsx',
    component: DecoHills,
    defaultProps: {},
    description: 'Collines décoratives',
  },
  {
    id: 'deco-animated-cloud',
    name: 'AnimatedCloud (Deco)',
    category: 'Decorations',
    filePath: 'src/components/decorations/AnimatedCloud.tsx',
    component: DecoAnimatedCloud,
    defaultProps: {},
    description: 'Nuage animé décoratif',
  },
  {
    id: 'animated-sun',
    name: 'AnimatedSun',
    category: 'Decorations',
    filePath: 'src/components/decorations/AnimatedSun.tsx',
    component: AnimatedSun,
    defaultProps: {},
    description: 'Soleil animé',
  },
  {
    id: 'animated-butterfly',
    name: 'AnimatedButterfly',
    category: 'Decorations',
    filePath: 'src/components/decorations/AnimatedButterfly.tsx',
    component: AnimatedButterfly,
    defaultProps: {},
    description: 'Papillon animé',
  },
  {
    id: 'animated-tree',
    name: 'AnimatedTree',
    category: 'Decorations',
    filePath: 'src/components/decorations/AnimatedTree.tsx',
    component: AnimatedTree,
    defaultProps: {},
    description: 'Arbre animé',
  },

  // ========== COLLECTION ==========
  {
    id: 'collection-card',
    name: 'CollectionCard',
    category: 'Collection',
    filePath: 'src/components/collection/CollectionCard.tsx',
    component: CollectionCard,
    defaultProps: {
      card: { id: '1', name: 'Carte test', rarity: 'common', unlocked: true },
    },
    description: 'Carte de collection',
  },
  {
    id: 'category-tabs',
    name: 'CategoryTabs',
    category: 'Collection',
    filePath: 'src/components/collection/CategoryTabs.tsx',
    component: CategoryTabs,
    defaultProps: {
      categories: ['Tous', 'Animaux', 'Nature'],
      selectedCategory: 'Tous',
      onSelect: () => {},
    },
    description: 'Onglets de catégories',
  },

  // ========== ASSISTANT ==========
  {
    id: 'assistant-bubble',
    name: 'AssistantBubble',
    category: 'Assistant',
    filePath: 'src/components/assistant/AssistantBubble.tsx',
    component: AssistantBubble,
    defaultProps: {
      message: 'Je suis là pour t\'aider!',
    },
    description: 'Bulle de l\'assistant',
  },

  // ========== PARENT ==========
  {
    id: 'skills-radar',
    name: 'SkillsRadar',
    category: 'Parent',
    filePath: 'src/components/parent/SkillsRadar.tsx',
    component: SkillsRadar,
    defaultProps: {
      skills: [
        { name: 'Logique', value: 80 },
        { name: 'Mémoire', value: 60 },
        { name: 'Créativité', value: 70 },
      ],
    },
    description: 'Radar des compétences',
  },
  {
    id: 'strengths-card',
    name: 'StrengthsCard',
    category: 'Parent',
    filePath: 'src/components/parent/StrengthsCard.tsx',
    component: StrengthsCard,
    defaultProps: {},
    description: 'Carte des forces',
  },
  {
    id: 'screen-time-card',
    name: 'ScreenTimeCard',
    category: 'Parent',
    filePath: 'src/components/parent/ScreenTimeCard.tsx',
    component: ScreenTimeCard,
    defaultProps: {
      minutes: 45,
    },
    description: 'Carte temps d\'écran',
  },
  {
    id: 'weekly-chart',
    name: 'WeeklyChart',
    category: 'Parent',
    filePath: 'src/components/parent/WeeklyChart.tsx',
    component: WeeklyChart,
    defaultProps: {},
    description: 'Graphique hebdomadaire',
  },

  // ========== HANOI ==========
  {
    id: 'game-board',
    name: 'GameBoard',
    category: 'Hanoi',
    filePath: 'src/games/01-hanoi/components/GameBoard.tsx',
    component: GameBoard,
    defaultProps: {
      gameState: {
        towers: [
          { disks: [{ id: 1, size: 3, color: '#FF6B6B' }, { id: 2, size: 2, color: '#4ECDC4' }, { id: 3, size: 1, color: '#FFE66D' }] },
          { disks: [] },
          { disks: [] },
        ],
        selectedDisk: null,
        sourceTower: null,
      },
      totalDisks: 3,
      onTowerPress: () => console.log('Tower pressed'),
      canMoveTo: () => true,
    },
    description: 'Plateau de jeu Tour de Hanoï',
  },
  {
    id: 'hanoi-background',
    name: 'GameBackground',
    category: 'Hanoi',
    filePath: 'src/games/01-hanoi/components/GameBackground.tsx',
    component: HanoiBackground,
    defaultProps: {},
    description: 'Fond du jeu Hanoi',
  },
  {
    id: 'tower',
    name: 'Tower',
    category: 'Hanoi',
    filePath: 'src/games/01-hanoi/components/Tower.tsx',
    component: Tower,
    defaultProps: {
      towerId: 0,
      tower: { disks: [{ id: 1, size: 3, color: '#FF6B6B' }, { id: 2, size: 2, color: '#4ECDC4' }] },
      selectedDiskId: null,
      isValidTarget: false,
      isSourceTower: false,
      onPress: () => console.log('Tower pressed'),
      maxDiskWidth: 120,
      minDiskWidth: 40,
      diskHeight: 30,
      totalDisks: 3,
      towerHeight: 200,
    },
    description: 'Tour du jeu Hanoi',
  },
  {
    id: 'disk',
    name: 'Disk',
    category: 'Hanoi',
    filePath: 'src/games/01-hanoi/components/Disk.tsx',
    component: Disk,
    defaultProps: {
      disk: { id: 1, size: 3, color: '#FF6B6B' },
      width: 120,
      height: 35,
      isSelected: false,
      showHint: false,
    },
    description: 'Disque du jeu Hanoi',
  },
  {
    id: 'tower-label',
    name: 'TowerLabel',
    category: 'Hanoi',
    filePath: 'src/games/01-hanoi/components/TowerLabel.tsx',
    component: TowerLabel,
    defaultProps: {
      label: 'A',
    },
    description: 'Label de tour',
  },
  {
    id: 'progress-panel',
    name: 'ProgressPanel',
    category: 'Hanoi',
    filePath: 'src/games/01-hanoi/components/ProgressPanel.tsx',
    component: ProgressPanel,
    defaultProps: {
      moves: 5,
      minMoves: 7,
    },
    description: 'Panneau de progression',
  },
  {
    id: 'floating-buttons',
    name: 'FloatingButtons',
    category: 'Hanoi',
    filePath: 'src/games/01-hanoi/components/FloatingButtons.tsx',
    component: FloatingButtons,
    defaultProps: {
      onHint: () => console.log('Hint'),
      onReset: () => console.log('Reset'),
      onBack: () => console.log('Back'),
    },
    description: 'Boutons flottants Hanoi',
  },
  {
    id: 'mascot-owl',
    name: 'MascotOwl',
    category: 'Hanoi',
    filePath: 'src/games/01-hanoi/components/MascotOwl.tsx',
    component: MascotOwl,
    defaultProps: {
      message: 'Bien joué!',
    },
    description: 'Mascotte hibou',
  },
  {
    id: 'wooden-base',
    name: 'WoodenBase',
    category: 'Hanoi',
    filePath: 'src/games/01-hanoi/components/WoodenBase.tsx',
    component: WoodenBase,
    defaultProps: {},
    description: 'Base en bois',
  },
  {
    id: 'victory-celebration',
    name: 'VictoryCelebration',
    category: 'Hanoi',
    filePath: 'src/games/01-hanoi/components/VictoryCelebration.tsx',
    component: VictoryCelebration,
    defaultProps: {},
    description: 'Célébration de victoire',
  },

  // ========== HANOI FEEDBACK ==========
  {
    id: 'collection-progress',
    name: 'CollectionProgress',
    category: 'Hanoi Feedback',
    filePath: 'src/games/01-hanoi/components/feedback/CollectionProgress.tsx',
    component: CollectionProgress,
    defaultProps: {
      collected: 5,
      total: 10,
    },
    description: 'Progression collection',
  },
  {
    id: 'victory-popup',
    name: 'VictoryPopup',
    category: 'Hanoi Feedback',
    filePath: 'src/games/01-hanoi/components/feedback/VictoryPopup.tsx',
    component: VictoryPopup,
    defaultProps: {
      visible: true,
      onClose: () => console.log('Close'),
    },
    description: 'Popup de victoire',
  },
  {
    id: 'victory-overlay',
    name: 'VictoryOverlay',
    category: 'Hanoi Feedback',
    filePath: 'src/games/01-hanoi/components/feedback/VictoryOverlay.tsx',
    component: VictoryOverlay,
    defaultProps: {
      visible: true,
    },
    description: 'Overlay de victoire',
  },
  {
    id: 'victory-mascot',
    name: 'VictoryMascot',
    category: 'Hanoi Feedback',
    filePath: 'src/games/01-hanoi/components/feedback/VictoryMascot.tsx',
    component: VictoryMascot,
    defaultProps: {},
    description: 'Mascotte victoire',
  },
  {
    id: 'popup-header',
    name: 'PopupHeader',
    category: 'Hanoi Feedback',
    filePath: 'src/games/01-hanoi/components/feedback/PopupHeader.tsx',
    component: PopupHeader,
    defaultProps: {
      title: 'Bravo!',
    },
    description: 'En-tête de popup',
  },
  {
    id: 'stats-section',
    name: 'StatsSection',
    category: 'Hanoi Feedback',
    filePath: 'src/games/01-hanoi/components/feedback/StatsSection.tsx',
    component: StatsSection,
    defaultProps: {
      moves: 10,
      time: 120,
    },
    description: 'Section statistiques',
  },
  {
    id: 'mascot-celebration',
    name: 'MascotCelebration',
    category: 'Hanoi Feedback',
    filePath: 'src/games/01-hanoi/components/feedback/MascotCelebration.tsx',
    component: MascotCelebration,
    defaultProps: {},
    description: 'Célébration mascotte',
  },

  // ========== MEMORY ==========
  {
    id: 'memory-game-board',
    name: 'GameBoard (Memory)',
    category: 'Memory',
    filePath: 'src/games/02-memory/components/GameBoard.tsx',
    component: MemoryGameBoard,
    defaultProps: {},
    description: 'Plateau du jeu Memory',
  },
  {
    id: 'memory-grid',
    name: 'MemoryGrid',
    category: 'Memory',
    filePath: 'src/games/02-memory/components/MemoryGrid.tsx',
    component: MemoryGrid,
    defaultProps: {
      cards: [],
      onCardPress: () => {},
    },
    description: 'Grille du Memory',
  },
  {
    id: 'memory-card',
    name: 'MemoryCard',
    category: 'Memory',
    filePath: 'src/games/02-memory/components/MemoryCard.tsx',
    component: MemoryCard,
    defaultProps: {
      card: { id: '1', emoji: '🎮', isFlipped: false, isMatched: false },
      onPress: () => console.log('Card pressed'),
    },
    description: 'Carte Memory',
  },

  // ========== MATH BLOCKS ==========
  {
    id: 'score-display',
    name: 'ScoreDisplay',
    category: 'Math Blocks',
    filePath: 'src/games/03-math-blocks/components/ScoreDisplay.tsx',
    component: ScoreDisplay,
    defaultProps: {
      score: 1250,
    },
    description: 'Affichage du score',
  },
  {
    id: 'math-block',
    name: 'MathBlock',
    category: 'Math Blocks',
    filePath: 'src/games/03-math-blocks/components/MathBlock.tsx',
    component: MathBlock,
    defaultProps: {
      value: 5,
      color: '#5B8DEE',
    },
    description: 'Bloc mathématique',
  },
  {
    id: 'game-grid',
    name: 'GameGrid',
    category: 'Math Blocks',
    filePath: 'src/games/03-math-blocks/components/GameGrid.tsx',
    component: GameGrid,
    defaultProps: {},
    description: 'Grille de jeu Math',
  },

  // ========== CONTEUR CURIEUX ==========
  {
    id: 'plume-mascot',
    name: 'PlumeMascot',
    category: 'Conteur Curieux',
    filePath: 'src/games/04-conteur-curieux/components/PlumeMascot.tsx',
    component: PlumeMascot,
    defaultProps: {},
    description: 'Mascotte Plume',
  },
  {
    id: 'audio-player',
    name: 'AudioPlayer',
    category: 'Conteur Curieux',
    filePath: 'src/games/04-conteur-curieux/components/AudioPlayer.tsx',
    component: AudioPlayer,
    defaultProps: {
      isPlaying: false,
      onToggle: () => console.log('Toggle'),
    },
    description: 'Lecteur audio',
  },
  {
    id: 'question-card',
    name: 'QuestionCard',
    category: 'Conteur Curieux',
    filePath: 'src/games/04-conteur-curieux/components/QuestionCard.tsx',
    component: QuestionCard,
    defaultProps: {
      question: 'Quel est le personnage principal?',
    },
    description: 'Carte question',
  },
  {
    id: 'skill-badge',
    name: 'SkillBadge',
    category: 'Conteur Curieux',
    filePath: 'src/games/04-conteur-curieux/components/SkillBadge.tsx',
    component: SkillBadge,
    defaultProps: {
      skill: 'Compréhension',
      level: 3,
    },
    description: 'Badge de compétence',
  },
  {
    id: 'story-card',
    name: 'StoryCard',
    category: 'Conteur Curieux',
    filePath: 'src/games/04-conteur-curieux/components/StoryCard.tsx',
    component: StoryCard,
    defaultProps: {
      story: { id: '1', title: 'Le petit chaperon rouge', theme: 'forest' },
    },
    description: 'Carte d\'histoire',
  },
  {
    id: 'vocabulary-bubble',
    name: 'VocabularyBubble',
    category: 'Conteur Curieux',
    filePath: 'src/games/04-conteur-curieux/components/VocabularyBubble.tsx',
    component: VocabularyBubble,
    defaultProps: {
      word: 'Aventure',
      definition: 'Une expérience excitante',
    },
    description: 'Bulle vocabulaire',
  },
  {
    id: 'answer-button',
    name: 'AnswerButton',
    category: 'Conteur Curieux',
    filePath: 'src/games/04-conteur-curieux/components/AnswerButton.tsx',
    component: AnswerButton,
    defaultProps: {
      text: 'Réponse A',
      onPress: () => console.log('Answer'),
    },
    description: 'Bouton de réponse',
  },
  {
    id: 'rays-effect',
    name: 'RaysEffect',
    category: 'Conteur Curieux',
    filePath: 'src/games/04-conteur-curieux/components/RaysEffect.tsx',
    component: RaysEffect,
    defaultProps: {},
    description: 'Effet de rayons',
  },
  {
    id: 'filter-tabs',
    name: 'FilterTabs',
    category: 'Conteur Curieux',
    filePath: 'src/games/04-conteur-curieux/components/FilterTabs.tsx',
    component: FilterTabs,
    defaultProps: {
      tabs: ['Tous', 'Aventure', 'Magie'],
      selected: 'Tous',
      onSelect: () => {},
    },
    description: 'Onglets de filtre',
  },
  {
    id: 'stars-row',
    name: 'StarsRow',
    category: 'Conteur Curieux',
    filePath: 'src/games/04-conteur-curieux/components/StarsRow.tsx',
    component: StarsRow,
    defaultProps: {
      count: 3,
      filled: 2,
    },
    description: 'Rangée d\'étoiles',
  },
  {
    id: 'radar-chart',
    name: 'RadarChart',
    category: 'Conteur Curieux',
    filePath: 'src/games/04-conteur-curieux/components/RadarChart.tsx',
    component: RadarChart,
    defaultProps: {},
    description: 'Graphique radar',
  },

  // ========== CONTEUR ILLUSTRATIONS ==========
  {
    id: 'forest-scene',
    name: 'ForestScene',
    category: 'Conteur Illustrations',
    filePath: 'src/games/04-conteur-curieux/components/illustrations/ForestScene.tsx',
    component: ForestScene,
    defaultProps: {},
    description: 'Scène de forêt',
  },
  {
    id: 'family-scene',
    name: 'FamilyScene',
    category: 'Conteur Illustrations',
    filePath: 'src/games/04-conteur-curieux/components/illustrations/FamilyScene.tsx',
    component: FamilyScene,
    defaultProps: {},
    description: 'Scène de famille',
  },
  {
    id: 'friendship-scene',
    name: 'FriendshipScene',
    category: 'Conteur Illustrations',
    filePath: 'src/games/04-conteur-curieux/components/illustrations/FriendshipScene.tsx',
    component: FriendshipScene,
    defaultProps: {},
    description: 'Scène d\'amitié',
  },
  {
    id: 'magic-scene',
    name: 'MagicScene',
    category: 'Conteur Illustrations',
    filePath: 'src/games/04-conteur-curieux/components/illustrations/MagicScene.tsx',
    component: MagicScene,
    defaultProps: {},
    description: 'Scène magique',
  },
  {
    id: 'adventure-scene',
    name: 'AdventureScene',
    category: 'Conteur Illustrations',
    filePath: 'src/games/04-conteur-curieux/components/illustrations/AdventureScene.tsx',
    component: AdventureScene,
    defaultProps: {},
    description: 'Scène d\'aventure',
  },

  // ========== MOTS CROISES ==========
  {
    id: 'crossword-cell',
    name: 'CrosswordCell',
    category: 'Mots Croisés',
    filePath: 'src/games/05-mots-croises/components/CrosswordCell.tsx',
    component: CrosswordCell,
    defaultProps: {
      letter: 'A',
      isSelected: false,
    },
    description: 'Cellule mots croisés',
  },
  {
    id: 'crossword-game-board',
    name: 'GameBoard (Crossword)',
    category: 'Mots Croisés',
    filePath: 'src/games/05-mots-croises/components/GameBoard.tsx',
    component: CrosswordGameBoard,
    defaultProps: {},
    description: 'Plateau mots croisés',
  },
  {
    id: 'clue-list',
    name: 'ClueList',
    category: 'Mots Croisés',
    filePath: 'src/games/05-mots-croises/components/ClueList.tsx',
    component: ClueList,
    defaultProps: {
      clues: [{ id: 1, text: 'Animal domestique' }],
    },
    description: 'Liste d\'indices',
  },
  {
    id: 'keyboard',
    name: 'Keyboard',
    category: 'Mots Croisés',
    filePath: 'src/games/05-mots-croises/components/Keyboard.tsx',
    component: Keyboard,
    defaultProps: {
      onKeyPress: () => {},
    },
    description: 'Clavier virtuel',
  },
  {
    id: 'crossword-grid',
    name: 'CrosswordGrid',
    category: 'Mots Croisés',
    filePath: 'src/games/05-mots-croises/components/CrosswordGrid.tsx',
    component: CrosswordGrid,
    defaultProps: {},
    description: 'Grille mots croisés',
  },

  // ========== SUDOKU ==========
  {
    id: 'sudoku-background',
    name: 'SudokuBackground',
    category: 'Sudoku',
    filePath: 'src/games/06-sudoku/components/SudokuBackground.tsx',
    component: SudokuBackground,
    defaultProps: {},
    description: 'Fond Sudoku',
  },
  {
    id: 'game-timer',
    name: 'GameTimer',
    category: 'Sudoku',
    filePath: 'src/games/06-sudoku/components/GameTimer.tsx',
    component: GameTimer,
    defaultProps: {
      seconds: 125,
    },
    description: 'Timer de jeu',
  },
  {
    id: 'symbol-selector',
    name: 'SymbolSelector',
    category: 'Sudoku',
    filePath: 'src/games/06-sudoku/components/SymbolSelector.tsx',
    component: SymbolSelector,
    defaultProps: {
      symbols: ['🍎', '🍊', '🍋', '🍇'],
      onSelect: () => {},
    },
    description: 'Sélecteur de symboles',
  },
  {
    id: 'sudoku-grid',
    name: 'SudokuGrid',
    category: 'Sudoku',
    filePath: 'src/games/06-sudoku/components/SudokuGrid.tsx',
    component: SudokuGrid,
    defaultProps: {},
    description: 'Grille Sudoku',
  },
  {
    id: 'sudoku-cell',
    name: 'SudokuCell',
    category: 'Sudoku',
    filePath: 'src/games/06-sudoku/components/SudokuCell.tsx',
    component: SudokuCell,
    defaultProps: {
      value: '🍎',
      isSelected: false,
    },
    description: 'Cellule Sudoku',
  },
  {
    id: 'professor-hoo-mascot',
    name: 'ProfessorHooMascot',
    category: 'Sudoku',
    filePath: 'src/games/06-sudoku/components/ProfessorHooMascot.tsx',
    component: ProfessorHooMascot,
    defaultProps: {},
    description: 'Mascotte Prof. Hoo',
  },
  {
    id: 'felix-mascot',
    name: 'FelixMascot',
    category: 'Sudoku',
    filePath: 'src/games/06-sudoku/components/FelixMascot.tsx',
    component: FelixMascot,
    defaultProps: {},
    description: 'Mascotte Felix',
  },

  // ========== BALANCE ==========
  {
    id: 'weight-object',
    name: 'WeightObject',
    category: 'Balance',
    filePath: 'src/games/07-balance/components/WeightObject.tsx',
    component: WeightObject,
    defaultProps: {
      weight: 5,
      emoji: '🍎',
    },
    description: 'Objet avec poids',
  },
  {
    id: 'dr-hibou',
    name: 'DrHibou',
    category: 'Balance',
    filePath: 'src/games/07-balance/components/DrHibou.tsx',
    component: DrHibou,
    defaultProps: {},
    description: 'Mascotte Dr Hibou',
  },
  {
    id: 'level-selector',
    name: 'LevelSelector',
    category: 'Balance',
    filePath: 'src/games/07-balance/components/LevelSelector.tsx',
    component: LevelSelector,
    defaultProps: {
      levels: [1, 2, 3, 4, 5],
      currentLevel: 2,
      onSelect: () => {},
    },
    description: 'Sélecteur de niveau',
  },
  {
    id: 'balance-scale',
    name: 'BalanceScale',
    category: 'Balance',
    filePath: 'src/games/07-balance/components/BalanceScale.tsx',
    component: BalanceScale,
    defaultProps: {
      leftWeight: 5,
      rightWeight: 3,
    },
    description: 'Balance à plateaux',
  },

  // ========== MATRICES MAGIQUES ==========
  {
    id: 'validate-button',
    name: 'ValidateButton',
    category: 'Matrices Magiques',
    filePath: 'src/games/09-matrices-magiques/components/ValidateButton.tsx',
    component: ValidateButton,
    defaultProps: {
      onPress: () => console.log('Validate'),
    },
    description: 'Bouton valider',
  },
  {
    id: 'progress-dots',
    name: 'ProgressDots',
    category: 'Matrices Magiques',
    filePath: 'src/games/09-matrices-magiques/components/ProgressDots.tsx',
    component: ProgressDots,
    defaultProps: {
      total: 5,
      current: 2,
    },
    description: 'Points de progression',
  },
  {
    id: 'attempts-display',
    name: 'AttemptsDisplay',
    category: 'Matrices Magiques',
    filePath: 'src/games/09-matrices-magiques/components/AttemptsDisplay.tsx',
    component: AttemptsDisplay,
    defaultProps: {
      attempts: 3,
      maxAttempts: 5,
    },
    description: 'Affichage tentatives',
  },
  {
    id: 'choice-button',
    name: 'ChoiceButton',
    category: 'Matrices Magiques',
    filePath: 'src/games/09-matrices-magiques/components/ChoiceButton.tsx',
    component: ChoiceButton,
    defaultProps: {
      onPress: () => console.log('Choice'),
    },
    description: 'Bouton de choix',
  },
  {
    id: 'choice-panel',
    name: 'ChoicePanel',
    category: 'Matrices Magiques',
    filePath: 'src/games/09-matrices-magiques/components/ChoicePanel.tsx',
    component: ChoicePanel,
    defaultProps: {},
    description: 'Panneau de choix',
  },
  {
    id: 'world-selector',
    name: 'WorldSelector',
    category: 'Matrices Magiques',
    filePath: 'src/games/09-matrices-magiques/components/WorldSelector.tsx',
    component: WorldSelector,
    defaultProps: {},
    description: 'Sélecteur de monde',
  },
  {
    id: 'world-card',
    name: 'WorldCard',
    category: 'Matrices Magiques',
    filePath: 'src/games/09-matrices-magiques/components/WorldCard.tsx',
    component: WorldCard,
    defaultProps: {
      world: { id: 'forest', name: 'Forêt', icon: '🌲' },
    },
    description: 'Carte de monde',
  },
  {
    id: 'shape-renderer',
    name: 'ShapeRenderer',
    category: 'Matrices Magiques',
    filePath: 'src/games/09-matrices-magiques/components/ShapeRenderer.tsx',
    component: ShapeRenderer,
    defaultProps: {
      shape: 'circle',
      color: '#5B8DEE',
    },
    description: 'Rendu de forme',
  },
  {
    id: 'pixel-mascot',
    name: 'PixelMascot',
    category: 'Matrices Magiques',
    filePath: 'src/games/09-matrices-magiques/components/PixelMascot.tsx',
    component: PixelMascot,
    defaultProps: {},
    description: 'Mascotte Pixel',
  },
  {
    id: 'pixel-with-bubble',
    name: 'PixelWithBubble',
    category: 'Matrices Magiques',
    filePath: 'src/games/09-matrices-magiques/components/PixelWithBubble.tsx',
    component: PixelWithBubble,
    defaultProps: {
      message: 'Trouve le pattern!',
    },
    description: 'Pixel avec bulle',
  },
  {
    id: 'matrix-cell',
    name: 'MatrixCell',
    category: 'Matrices Magiques',
    filePath: 'src/games/09-matrices-magiques/components/MatrixCell.tsx',
    component: MatrixCell,
    defaultProps: {},
    description: 'Cellule de matrice',
  },
  {
    id: 'matrix-grid',
    name: 'MatrixGrid',
    category: 'Matrices Magiques',
    filePath: 'src/games/09-matrices-magiques/components/MatrixGrid.tsx',
    component: MatrixGrid,
    defaultProps: {},
    description: 'Grille de matrices',
  },

  // ========== SUITES LOGIQUES ==========
  {
    id: 'sequence-display',
    name: 'SequenceDisplay',
    category: 'Suites Logiques',
    filePath: 'src/games/10-suites-logiques/components/SequenceDisplay.tsx',
    component: SequenceDisplay,
    defaultProps: {},
    description: 'Affichage de séquence',
  },
  {
    id: 'sequence-element',
    name: 'SequenceElement',
    category: 'Suites Logiques',
    filePath: 'src/games/10-suites-logiques/components/SequenceElement.tsx',
    component: SequenceElement,
    defaultProps: {
      element: { type: 'shape', value: 'circle' },
    },
    description: 'Élément de séquence',
  },
  {
    id: 'suites-choice-panel',
    name: 'ChoicePanel (Suites)',
    category: 'Suites Logiques',
    filePath: 'src/games/10-suites-logiques/components/ChoicePanel.tsx',
    component: SuitesChoicePanel,
    defaultProps: {},
    description: 'Panneau de choix Suites',
  },
  {
    id: 'mascot-robot',
    name: 'MascotRobot',
    category: 'Suites Logiques',
    filePath: 'src/games/10-suites-logiques/components/MascotRobot.tsx',
    component: MascotRobot,
    defaultProps: {},
    description: 'Mascotte Robot',
  },
  {
    id: 'missing-slot',
    name: 'MissingSlot',
    category: 'Suites Logiques',
    filePath: 'src/games/10-suites-logiques/components/MissingSlot.tsx',
    component: MissingSlot,
    defaultProps: {},
    description: 'Emplacement manquant',
  },

  // ========== LABYRINTHE ==========
  {
    id: 'laby-victory-screen',
    name: 'VictoryScreen (Laby)',
    category: 'Labyrinthe',
    filePath: 'src/games/11-labyrinthe/components/VictoryScreen.tsx',
    component: LabyVictoryScreen,
    defaultProps: {},
    description: 'Écran victoire Laby',
  },
  {
    id: 'interactive-element',
    name: 'InteractiveElement',
    category: 'Labyrinthe',
    filePath: 'src/games/11-labyrinthe/components/InteractiveElement.tsx',
    component: InteractiveElement,
    defaultProps: {},
    description: 'Élément interactif',
  },
  {
    id: 'instruction-queue',
    name: 'InstructionQueue',
    category: 'Labyrinthe',
    filePath: 'src/games/11-labyrinthe/components/InstructionQueue.tsx',
    component: InstructionQueue,
    defaultProps: {
      instructions: ['→', '↑', '→'],
    },
    description: 'File d\'instructions',
  },
  {
    id: 'inventory',
    name: 'Inventory',
    category: 'Labyrinthe',
    filePath: 'src/games/11-labyrinthe/components/Inventory.tsx',
    component: Inventory,
    defaultProps: {
      items: [],
    },
    description: 'Inventaire',
  },
  {
    id: 'path-trail',
    name: 'PathTrail',
    category: 'Labyrinthe',
    filePath: 'src/games/11-labyrinthe/components/PathTrail.tsx',
    component: PathTrail,
    defaultProps: {},
    description: 'Trace du chemin',
  },
  {
    id: 'maze-grid',
    name: 'MazeGrid',
    category: 'Labyrinthe',
    filePath: 'src/games/11-labyrinthe/components/MazeGrid.tsx',
    component: MazeGrid,
    defaultProps: {},
    description: 'Grille du labyrinthe',
  },
  {
    id: 'mascot-bubble',
    name: 'MascotBubble',
    category: 'Labyrinthe',
    filePath: 'src/games/11-labyrinthe/components/MascotBubble.tsx',
    component: MascotBubble,
    defaultProps: {
      message: 'Trouve la sortie!',
    },
    description: 'Bulle mascotte',
  },
  {
    id: 'avatar',
    name: 'Avatar',
    category: 'Labyrinthe',
    filePath: 'src/games/11-labyrinthe/components/Avatar.tsx',
    component: Avatar,
    defaultProps: {},
    description: 'Avatar du joueur',
  },
  {
    id: 'programming-controls',
    name: 'ProgrammingControls',
    category: 'Labyrinthe',
    filePath: 'src/games/11-labyrinthe/components/ProgrammingControls.tsx',
    component: ProgrammingControls,
    defaultProps: {},
    description: 'Contrôles programmation',
  },
  {
    id: 'directional-controls',
    name: 'DirectionalControls',
    category: 'Labyrinthe',
    filePath: 'src/games/11-labyrinthe/components/DirectionalControls.tsx',
    component: DirectionalControls,
    defaultProps: {
      onDirection: () => {},
    },
    description: 'Contrôles directionnels',
  },
  {
    id: 'maze-cell',
    name: 'MazeCell',
    category: 'Labyrinthe',
    filePath: 'src/games/11-labyrinthe/components/MazeCell.tsx',
    component: MazeCell,
    defaultProps: {
      cell: { type: 'path' },
    },
    description: 'Cellule du labyrinthe',
  },

  // ========== LOGIX GRID ==========
  {
    id: 'logix-game-board',
    name: 'GameBoard (Logix)',
    category: 'Logix Grid',
    filePath: 'src/games/12-logix-grid/components/GameBoard.tsx',
    component: LogixGameBoard,
    defaultProps: {},
    description: 'Plateau Logix Grid',
  },
  {
    id: 'clue-panel',
    name: 'CluePanel',
    category: 'Logix Grid',
    filePath: 'src/games/12-logix-grid/components/CluePanel.tsx',
    component: CluePanel,
    defaultProps: {
      clues: [],
    },
    description: 'Panneau d\'indices',
  },
  {
    id: 'logix-grid',
    name: 'LogixGrid',
    category: 'Logix Grid',
    filePath: 'src/games/12-logix-grid/components/LogixGrid.tsx',
    component: LogixGrid,
    defaultProps: {},
    description: 'Grille Logix',
  },
  {
    id: 'grid-cell',
    name: 'GridCell',
    category: 'Logix Grid',
    filePath: 'src/games/12-logix-grid/components/GridCell.tsx',
    component: GridCell,
    defaultProps: {},
    description: 'Cellule de grille',
  },

  // ========== TANGRAM ==========
  {
    id: 'tangram-piece',
    name: 'TangramPiece',
    category: 'Tangram',
    filePath: 'src/games/08-tangram/components/TangramPiece.tsx',
    component: TangramPiece,
    defaultProps: {
      piece: { type: 'triangle', color: '#5B8DEE' },
    },
    description: 'Pièce de Tangram',
  },
  {
    id: 'tangram-board',
    name: 'TangramBoard',
    category: 'Tangram',
    filePath: 'src/games/08-tangram/components/TangramBoard.tsx',
    component: TangramBoard,
    defaultProps: {},
    description: 'Plateau Tangram',
  },
  {
    id: 'shadow-shape',
    name: 'ShadowShape',
    category: 'Tangram',
    filePath: 'src/games/08-tangram/components/ShadowShape.tsx',
    component: ShadowShape,
    defaultProps: {},
    description: 'Forme d\'ombre',
  },
];

// Icône de fermeture
const CloseIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Path
      d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
      fill="#666"
    />
  </Svg>
);

// Icône de recherche
const SearchIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
      fill="#999"
    />
  </Svg>
);

export default function PlaygroundScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComponent, setSelectedComponent] = useState<PlaygroundComponent | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filtrer les composants selon la recherche
  const filteredComponents = useMemo(() => {
    if (!searchQuery.trim()) return COMPONENT_REGISTRY;

    const query = searchQuery.toLowerCase();
    return COMPONENT_REGISTRY.filter(
      (comp) =>
        comp.name.toLowerCase().includes(query) ||
        comp.category.toLowerCase().includes(query) ||
        comp.description?.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Grouper par catégorie
  const groupedComponents = useMemo(() => {
    const groups: Record<string, PlaygroundComponent[]> = {};
    filteredComponents.forEach((comp) => {
      if (!groups[comp.category]) {
        groups[comp.category] = [];
      }
      groups[comp.category].push(comp);
    });
    return groups;
  }, [filteredComponents]);

  const handleSelectComponent = useCallback((comp: PlaygroundComponent) => {
    setSelectedComponent(comp);
    setSearchQuery('');
    setIsSearchFocused(false);
  }, []);

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  const handleClearSelection = useCallback(() => {
    setSelectedComponent(null);
  }, []);

  // Rendu du composant sélectionné
  const renderSelectedComponent = () => {
    if (!selectedComponent) return null;

    const Component = selectedComponent.component;
    return <Component {...selectedComponent.defaultProps} />;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>🎨 Playground</Text>
          <Text style={styles.subtitle}>
            {selectedComponent ? selectedComponent.name : `${COMPONENT_REGISTRY.length} composants disponibles`}
          </Text>
        </View>
        <Pressable onPress={handleClose} style={styles.closeButton}>
          <CloseIcon />
        </Pressable>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, isSearchFocused && styles.searchBarFocused]}>
          <SearchIcon />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un composant..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} style={styles.clearSearch}>
              <Text style={styles.clearSearchText}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* Dropdown de résultats */}
        {isSearchFocused && filteredComponents.length > 0 && (
          <View style={styles.dropdown}>
            <ScrollView style={styles.dropdownScroll} keyboardShouldPersistTaps="handled">
              {Object.entries(groupedComponents).map(([category, components]) => (
                <View key={category}>
                  <Text style={styles.categoryHeader}>{category}</Text>
                  {components.map((comp) => (
                    <Pressable
                      key={comp.id}
                      style={({ pressed }) => [
                        styles.dropdownItem,
                        pressed && styles.dropdownItemPressed,
                      ]}
                      onPress={() => handleSelectComponent(comp)}
                    >
                      <View style={styles.dropdownItemHeader}>
                        <Text style={styles.dropdownItemName}>{comp.name}</Text>
                        <Text style={styles.dropdownItemCategory}>{comp.category}</Text>
                      </View>
                      {comp.filePath && (
                        <Text style={styles.dropdownItemPath}>{comp.filePath}</Text>
                      )}
                      {comp.description && (
                        <Text style={styles.dropdownItemDesc}>{comp.description}</Text>
                      )}
                    </Pressable>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Preview Area */}
      <View style={styles.previewContainer}>
        {selectedComponent ? (
          <>
            <View style={styles.previewHeader}>
              <View style={styles.componentInfo}>
                <Text style={styles.componentCategory}>{selectedComponent.category}</Text>
                <Text style={styles.componentName}>{selectedComponent.name}</Text>
                {selectedComponent.filePath && (
                  <Text style={styles.componentPath}>{selectedComponent.filePath}</Text>
                )}
              </View>
              <Pressable onPress={handleClearSelection} style={styles.changeButton}>
                <Text style={styles.changeButtonText}>Changer</Text>
              </Pressable>
            </View>
            <ScrollView
              style={styles.previewScroll}
              contentContainerStyle={styles.previewContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.componentWrapper}>
                {renderSelectedComponent()}
              </View>
            </ScrollView>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>🔍</Text>
            <Text style={styles.emptyStateTitle}>Aucun composant sélectionné</Text>
            <Text style={styles.emptyStateText}>
              Utilise la barre de recherche ci-dessus pour trouver et prévisualiser un composant
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF0',
  },
  headerLeft: {
    gap: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F2F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    zIndex: 100,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  searchBarFocused: {
    borderColor: '#5B8DEE',
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearSearch: {
    padding: 4,
  },
  clearSearchText: {
    fontSize: 16,
    color: '#999',
  },
  dropdown: {
    position: 'absolute',
    top: 70,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
    maxHeight: 350,
    zIndex: 1000,
  },
  dropdownScroll: {
    padding: 8,
  },
  categoryHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 6,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  dropdownItemPressed: {
    backgroundColor: '#F0F4FF',
  },
  dropdownItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  dropdownItemCategory: {
    fontSize: 11,
    fontWeight: '500',
    color: '#5B8DEE',
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dropdownItemPath: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  dropdownItemDesc: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF0',
  },
  componentInfo: {
    gap: 2,
  },
  componentCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5B8DEE',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  componentName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  componentPath: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  changeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F0F4FF',
    borderRadius: 8,
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5B8DEE',
  },
  previewScroll: {
    flex: 1,
  },
  previewContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  componentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});
