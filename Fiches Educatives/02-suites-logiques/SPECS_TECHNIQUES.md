# ⚙️ SPECS TECHNIQUES : Suites Logiques

## Architecture des Composants

### Structure des Fichiers

```
/src/components/activities/SuitesLogiques/
├── SuitesLogiquesGame.tsx          # Composant principal
├── components/
│   ├── SequenceDisplay.tsx         # Affichage de la suite
│   ├── SequenceElement.tsx         # Élément individuel (image/forme/nombre)
│   ├── MissingSlot.tsx             # Zone "?" pour la réponse
│   ├── ChoicePanel.tsx             # Panel des options de réponse
│   ├── ChoiceButton.tsx            # Bouton de choix individuel
│   ├── ThemeSelector.tsx           # Sélection du thème
│   ├── LevelIndicator.tsx          # Indicateur de niveau/étoiles
│   └── SessionSummary.tsx          # Écran de fin de session
├── hooks/
│   ├── useSuitesGame.ts            # Logique de jeu principale
│   ├── useSequenceGenerator.ts     # Génération des suites
│   ├── useGameState.ts             # État du jeu
│   └── useStreakTracker.ts         # Suivi des séries
├── utils/
│   ├── patternUtils.ts             # Utilitaires pour patterns
│   ├── sequenceValidator.ts        # Validation des réponses
│   └── difficultyScaler.ts         # Ajustement de difficulté
├── data/
│   ├── themes.ts                   # Définition des thèmes
│   ├── patterns.ts                 # Patterns par niveau
│   └── elementAssets.ts            # Assets par thème
├── constants/
│   └── gameConfig.ts               # Configuration du jeu
└── types/
    └── index.ts                    # Types TypeScript
```

---

## Types TypeScript

### Types de Base

```typescript
// types/index.ts

// ============================================
// ÉLÉMENTS DE SÉQUENCE
// ============================================

export type ElementType = 'color' | 'shape' | 'number' | 'image' | 'size';

export interface SequenceElement {
  id: string;
  type: ElementType;
  value: string | number;
  displayAsset: string;           // URI de l'image ou code couleur
  label?: string;                 // Pour accessibilité
  size?: 'small' | 'medium' | 'large';  // Pour patterns de taille
  rotation?: number;              // Pour patterns de rotation (degrés)
}

// ============================================
// PATTERNS
// ============================================

export type PatternType = 
  | 'ABAB'          // Alternance simple
  | 'AABB'          // Doublons alternés
  | 'AAB'           // Asymétrique
  | 'ABC'           // Cycle de 3
  | 'ABBC'          // Cycle complexe
  | 'AABBCC'        // Doublons triples
  | 'increasing'    // Croissant (taille, quantité)
  | 'decreasing'    // Décroissant
  | 'rotation'      // Rotation progressive
  | 'numeric_add'   // Suite +n
  | 'numeric_mult'  // Suite ×n
  | 'fibonacci'     // Suite de Fibonacci
  | 'custom';       // Pattern personnalisé

export interface PatternDefinition {
  type: PatternType;
  cycle: number[];                // Ex: [0, 1] pour ABAB, [0, 1, 2] pour ABC
  transform?: 'none' | 'size' | 'rotation' | 'numeric';
  step?: number;                  // Pour suites numériques (+2, ×2, etc.)
  difficulty: 1 | 2 | 3 | 4 | 5;
}

// ============================================
// SÉQUENCE COMPLÈTE
// ============================================

export interface Sequence {
  id: string;
  elements: SequenceElement[];    // Éléments visibles
  missingIndex: number;           // Index de l'élément manquant (généralement dernier)
  correctAnswer: SequenceElement;
  distractors: SequenceElement[]; // Mauvaises réponses
  patternDef: PatternDefinition;
  theme: ThemeType;
  difficulty: number;
}

// ============================================
// THÈMES
// ============================================

export type ThemeType = 
  | 'farm'      // 🐄 Ferme
  | 'space'     // 🚀 Espace
  | 'shapes'    // 🔷 Formes
  | 'colors'    // 🎨 Couleurs
  | 'numbers'   // 🔢 Nombres
  | 'music';    // 🎵 Musique

export interface Theme {
  id: ThemeType;
  name: string;
  icon: string;
  elements: SequenceElement[];
  unlockCondition: UnlockCondition;
  ageRange: [number, number];     // [min, max]
}

export interface UnlockCondition {
  type: 'default' | 'sequences' | 'level' | 'age';
  value?: number;
}

// ============================================
// ÉTAT DU JEU
// ============================================

export interface GameState {
  currentSequence: Sequence | null;
  selectedAnswer: SequenceElement | null;
  attempts: number;
  hintsUsed: number;
  currentHintLevel: 0 | 1 | 2 | 3 | 4;  // 0 = pas d'indice
  isComplete: boolean;
  status: 'idle' | 'selected' | 'checking' | 'success' | 'error' | 'hint';
}

export interface SessionState {
  sequencesCompleted: number;
  sequencesCorrectFirstTry: number;
  totalAttempts: number;
  totalHints: number;
  currentStreak: number;
  maxStreak: number;
  currentLevel: number;
  startTime: Date;
  theme: ThemeType;
}

// ============================================
// PROGRESSION
// ============================================

export interface PlayerProgress {
  currentLevel: number;
  sequencesPerLevel: Record<number, number>;
  totalSequences: number;
  totalCorrectFirstTry: number;
  unlockedThemes: ThemeType[];
  badges: Badge[];
  lastPlayedAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

// ============================================
// CONFIGURATION
// ============================================

export interface GameConfig {
  sequencesPerSession: number;    // 5-10
  maxAttempts: number;            // Avant révélation
  hintThresholds: number[];       // [2, 3, 4, 5] tentatives
  levelUpThreshold: {
    sequences: number;            // Min suites réussies
    successRate: number;          // Min % premier essai
    maxHintRate: number;          // Max indices/suite
  };
  elementSize: number;            // dp
  choiceSize: number;             // dp
  animationDurations: {
    elementAppear: number;
    success: number;
    error: number;
    hint: number;
  };
}
```

---

## Composants React Native

### Composant Principal

```typescript
// SuitesLogiquesGame.tsx

import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withSequence,
  withDelay,
  runOnJS
} from 'react-native-reanimated';

import { SequenceDisplay } from './components/SequenceDisplay';
import { ChoicePanel } from './components/ChoicePanel';
import { LevelIndicator } from './components/LevelIndicator';
import { MascotBubble } from '@/components/mascot/MascotBubble';
import { IconButton } from '@/components/ui/IconButton';

import { useSuitesGame } from './hooks/useSuitesGame';
import { useSound } from '@/hooks/useSound';
import { useHaptics } from '@/hooks/useHaptics';

import { COLORS, SIZES } from '@/constants/theme';
import { SequenceElement, ThemeType } from './types';

interface Props {
  theme: ThemeType;
  initialLevel?: number;
  onSessionEnd: (stats: SessionStats) => void;
  onExit: () => void;
}

export const SuitesLogiquesGame: React.FC<Props> = ({
  theme,
  initialLevel = 1,
  onSessionEnd,
  onExit,
}) => {
  const {
    gameState,
    sessionState,
    currentSequence,
    selectAnswer,
    confirmAnswer,
    requestHint,
    nextSequence,
    isSessionComplete,
  } = useSuitesGame({ theme, initialLevel });

  const { playSound } = useSound();
  const { triggerHaptic } = useHaptics();

  // Dialogue de la mascotte
  const [mascotMessage, setMascotMessage] = React.useState<string>('');
  const [showMascot, setShowMascot] = React.useState(true);

  // Initialisation
  useEffect(() => {
    setMascotMessage("Bip bip ! Trouve ce qui vient après !");
    nextSequence();
  }, []);

  // Gestion du feedback
  useEffect(() => {
    if (gameState.status === 'success') {
      playSound('success');
      triggerHaptic('success');
      
      const messages = [
        "Bip ! Bien trouvé ! ✨",
        "Données confirmées : CORRECT !",
        "Tu as trouvé le motif !",
      ];
      setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
    } else if (gameState.status === 'error') {
      playSound('error');
      triggerHaptic('error');
      
      if (gameState.attempts === 1) {
        setMascotMessage("Hmm, pas celui-là... Regarde encore !");
      } else if (gameState.attempts === 2) {
        setMascotMessage("Regarde les premiers éléments...");
      }
    }
  }, [gameState.status]);

  // Sélection d'un élément
  const handleSelect = useCallback((element: SequenceElement) => {
    playSound('tap');
    triggerHaptic('light');
    selectAnswer(element);
  }, [selectAnswer]);

  // Confirmation (drag terminé ou double tap)
  const handleConfirm = useCallback(() => {
    if (gameState.selectedAnswer) {
      confirmAnswer();
    }
  }, [gameState.selectedAnswer, confirmAnswer]);

  // Demande d'indice
  const handleHint = useCallback(() => {
    playSound('hint');
    requestHint();
  }, [requestHint]);

  // Passage à la suite suivante
  const handleNext = useCallback(() => {
    if (isSessionComplete) {
      onSessionEnd({
        completed: sessionState.sequencesCompleted,
        correctFirstTry: sessionState.sequencesCorrectFirstTry,
        maxStreak: sessionState.maxStreak,
        totalTime: Date.now() - sessionState.startTime.getTime(),
      });
    } else {
      nextSequence();
      setMascotMessage("Bip ! Nouvelle suite !");
    }
  }, [isSessionComplete, sessionState, nextSequence, onSessionEnd]);

  if (!currentSequence) {
    return null; // Loading state
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton 
          icon="home" 
          onPress={onExit}
          size={48}
        />
        <LevelIndicator 
          level={sessionState.currentLevel}
          maxLevel={5}
        />
      </View>

      {/* Mascotte */}
      <MascotBubble
        mascot="pixel"
        message={mascotMessage}
        visible={showMascot}
        position="top"
      />

      {/* Zone de la suite */}
      <View style={styles.sequenceArea}>
        <SequenceDisplay
          sequence={currentSequence}
          selectedAnswer={gameState.selectedAnswer}
          status={gameState.status}
          hintLevel={gameState.currentHintLevel}
          onDropInSlot={handleConfirm}
        />
      </View>

      {/* Zone des choix */}
      <View style={styles.choiceArea}>
        <ChoicePanel
          choices={[currentSequence.correctAnswer, ...currentSequence.distractors]}
          selectedId={gameState.selectedAnswer?.id}
          onSelect={handleSelect}
          onDragEnd={handleConfirm}
          disabled={gameState.status === 'checking' || gameState.status === 'success'}
          hintLevel={gameState.currentHintLevel}
          correctAnswerId={currentSequence.correctAnswer.id}
        />
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <IconButton 
          icon="lightbulb" 
          onPress={handleHint}
          disabled={gameState.currentHintLevel >= 4}
          variant="secondary"
        />
        
        {gameState.status === 'success' && (
          <IconButton 
            icon="arrow-right" 
            onPress={handleNext}
            variant="primary"
            size={64}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sequenceArea: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceArea: {
    flex: 1,
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
});
```

### Composant SequenceDisplay

```typescript
// components/SequenceDisplay.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  FadeIn, 
  FadeInRight,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

import { SequenceElement } from './SequenceElement';
import { MissingSlot } from './MissingSlot';
import { Sequence, SequenceElement as ElementType, GameStatus } from '../types';

interface Props {
  sequence: Sequence;
  selectedAnswer: ElementType | null;
  status: GameStatus;
  hintLevel: number;
  onDropInSlot: () => void;
}

export const SequenceDisplay: React.FC<Props> = ({
  sequence,
  selectedAnswer,
  status,
  hintLevel,
  onDropInSlot,
}) => {
  // Animation d'apparition séquentielle
  const renderElements = () => {
    return sequence.elements.map((element, index) => {
      const shouldPulse = hintLevel >= 2 && isPartOfPattern(element, sequence);
      
      return (
        <Animated.View
          key={element.id}
          entering={FadeInRight.delay(index * 100).springify()}
        >
          <SequenceElement
            element={element}
            index={index}
            isPulsing={shouldPulse}
            isHighlighted={hintLevel >= 1 && index < 2}
          />
        </Animated.View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.sequenceRow}>
        {renderElements()}
        
        {/* Zone manquante */}
        <MissingSlot
          expectedElement={sequence.correctAnswer}
          placedElement={status === 'success' ? sequence.correctAnswer : selectedAnswer}
          status={status}
          onDrop={onDropInSlot}
        />
      </View>
    </View>
  );
};

// Utilitaire pour identifier les éléments du pattern
function isPartOfPattern(element: ElementType, sequence: Sequence): boolean {
  // Retourne true si cet élément fait partie du motif récurrent
  const pattern = sequence.patternDef;
  // Logique selon le type de pattern
  return true; // Simplifié
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 20,
  },
  sequenceRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
});
```

### Composant SequenceElement

```typescript
// components/SequenceElement.tsx

import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

import { SequenceElement as ElementType } from '../types';
import { COLORS, SIZES } from '@/constants/theme';

interface Props {
  element: ElementType;
  index: number;
  isPulsing?: boolean;
  isHighlighted?: boolean;
  size?: number;
}

export const SequenceElement: React.FC<Props> = ({
  element,
  index,
  isPulsing = false,
  isHighlighted = false,
  size = SIZES.sequenceElement,
}) => {
  // Animation de pulsation pour les indices
  const pulseStyle = useAnimatedStyle(() => {
    if (!isPulsing) return {};
    
    return {
      transform: [
        {
          scale: withRepeat(
            withSequence(
              withTiming(1.1, { duration: 500, easing: Easing.inOut(Easing.ease) }),
              withTiming(1.0, { duration: 500, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
          ),
        },
      ],
      shadowOpacity: withRepeat(
        withSequence(
          withTiming(0.5, { duration: 500 }),
          withTiming(0.2, { duration: 500 })
        ),
        -1,
        true
      ),
    };
  }, [isPulsing]);

  const renderContent = () => {
    switch (element.type) {
      case 'image':
        return (
          <Image
            source={{ uri: element.displayAsset }}
            style={[styles.image, { width: size - 16, height: size - 16 }]}
            resizeMode="contain"
          />
        );
      
      case 'color':
        return (
          <View
            style={[
              styles.colorCircle,
              { 
                backgroundColor: element.displayAsset,
                width: size - 16,
                height: size - 16,
              }
            ]}
          />
        );
      
      case 'shape':
        return (
          <ShapeRenderer
            shape={element.value as string}
            color={element.displayAsset}
            size={size - 16}
            rotation={element.rotation}
          />
        );
      
      case 'number':
        return (
          <Text style={[styles.numberText, { fontSize: size * 0.5 }]}>
            {element.value}
          </Text>
        );
      
      default:
        return null;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { width: size, height: size },
        isHighlighted && styles.highlighted,
        pulseStyle,
      ]}
      accessibilityLabel={element.label || `Élément ${index + 1}`}
    >
      {renderContent()}
    </Animated.View>
  );
};

// Sous-composant pour les formes géométriques
const ShapeRenderer: React.FC<{
  shape: string;
  color: string;
  size: number;
  rotation?: number;
}> = ({ shape, color, size, rotation = 0 }) => {
  const shapeStyle = {
    transform: [{ rotate: `${rotation}deg` }],
  };

  switch (shape) {
    case 'circle':
      return (
        <View
          style={[
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
            },
            shapeStyle,
          ]}
        />
      );
    
    case 'square':
      return (
        <View
          style={[
            {
              width: size,
              height: size,
              backgroundColor: color,
            },
            shapeStyle,
          ]}
        />
      );
    
    case 'triangle':
      return (
        <View
          style={[
            {
              width: 0,
              height: 0,
              borderLeftWidth: size / 2,
              borderRightWidth: size / 2,
              borderBottomWidth: size,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: color,
            },
            shapeStyle,
          ]}
        />
      );
    
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  highlighted: {
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  image: {
    borderRadius: 8,
  },
  colorCircle: {
    borderRadius: 100,
  },
  numberText: {
    fontFamily: 'NunitoSans-Bold',
    color: COLORS.text,
  },
});
```

### Composant ChoicePanel

```typescript
// components/ChoicePanel.tsx

import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

import { ChoiceButton } from './ChoiceButton';
import { SequenceElement } from '../types';
import { SIZES } from '@/constants/theme';

interface Props {
  choices: SequenceElement[];
  selectedId: string | undefined;
  onSelect: (element: SequenceElement) => void;
  onDragEnd: (element: SequenceElement) => void;
  disabled: boolean;
  hintLevel: number;
  correctAnswerId: string;
}

export const ChoicePanel: React.FC<Props> = ({
  choices,
  selectedId,
  onSelect,
  onDragEnd,
  disabled,
  hintLevel,
  correctAnswerId,
}) => {
  // Mélanger les choix une seule fois
  const shuffledChoices = useMemo(() => {
    return [...choices].sort(() => Math.random() - 0.5);
  }, [choices]);

  // Filtrer selon le niveau d'indice
  const visibleChoices = useMemo(() => {
    if (hintLevel >= 3) {
      // Ne montrer que 2 options (correct + 1 distracteur)
      const correct = shuffledChoices.find(c => c.id === correctAnswerId)!;
      const distractor = shuffledChoices.find(c => c.id !== correctAnswerId)!;
      return [correct, distractor].sort(() => Math.random() - 0.5);
    }
    if (hintLevel >= 4) {
      // Ne montrer que la bonne réponse (brille)
      return shuffledChoices.filter(c => c.id === correctAnswerId);
    }
    return shuffledChoices;
  }, [shuffledChoices, hintLevel, correctAnswerId]);

  return (
    <View style={styles.container}>
      <View style={styles.choicesRow}>
        {visibleChoices.map((choice) => (
          <ChoiceButton
            key={choice.id}
            element={choice}
            isSelected={choice.id === selectedId}
            isCorrect={choice.id === correctAnswerId}
            isRevealed={hintLevel >= 4}
            disabled={disabled}
            onPress={() => onSelect(choice)}
            onDragEnd={() => onDragEnd(choice)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    marginHorizontal: 20,
  },
  choicesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
});
```

---

## Hooks Personnalisés

### useSuitesGame

```typescript
// hooks/useSuitesGame.ts

import { useState, useCallback, useMemo } from 'react';
import { useSequenceGenerator } from './useSequenceGenerator';
import { useGameState } from './useGameState';
import { useStreakTracker } from './useStreakTracker';
import { saveProgress, loadProgress } from '@/services/storage';

import { 
  GameState, 
  SessionState, 
  Sequence, 
  SequenceElement,
  ThemeType,
  GameConfig 
} from '../types';

const DEFAULT_CONFIG: GameConfig = {
  sequencesPerSession: 8,
  maxAttempts: 5,
  hintThresholds: [2, 3, 4, 5],
  levelUpThreshold: {
    sequences: 5,
    successRate: 0.6,
    maxHintRate: 1,
  },
  elementSize: 80,
  choiceSize: 96,
  animationDurations: {
    elementAppear: 100,
    success: 500,
    error: 300,
    hint: 400,
  },
};

interface UseSuitesGameProps {
  theme: ThemeType;
  initialLevel?: number;
  config?: Partial<GameConfig>;
}

export function useSuitesGame({ 
  theme, 
  initialLevel = 1,
  config: customConfig 
}: UseSuitesGameProps) {
  const config = { ...DEFAULT_CONFIG, ...customConfig };
  
  // État du jeu
  const [gameState, setGameState] = useState<GameState>({
    currentSequence: null,
    selectedAnswer: null,
    attempts: 0,
    hintsUsed: 0,
    currentHintLevel: 0,
    isComplete: false,
    status: 'idle',
  });

  // État de la session
  const [sessionState, setSessionState] = useState<SessionState>({
    sequencesCompleted: 0,
    sequencesCorrectFirstTry: 0,
    totalAttempts: 0,
    totalHints: 0,
    currentStreak: 0,
    maxStreak: 0,
    currentLevel: initialLevel,
    startTime: new Date(),
    theme,
  });

  // Générateur de séquences
  const { generateSequence } = useSequenceGenerator(theme);
  
  // Tracker de séries
  const { streak, incrementStreak, resetStreak } = useStreakTracker();

  // Séquence courante
  const currentSequence = gameState.currentSequence;

  // Session complète ?
  const isSessionComplete = sessionState.sequencesCompleted >= config.sequencesPerSession;

  // Sélectionner une réponse
  const selectAnswer = useCallback((element: SequenceElement) => {
    if (gameState.status === 'checking' || gameState.status === 'success') return;
    
    setGameState(prev => ({
      ...prev,
      selectedAnswer: element,
      status: 'selected',
    }));
  }, [gameState.status]);

  // Confirmer la réponse
  const confirmAnswer = useCallback(() => {
    const { selectedAnswer, currentSequence } = gameState;
    if (!selectedAnswer || !currentSequence) return;

    setGameState(prev => ({ ...prev, status: 'checking' }));

    const isCorrect = selectedAnswer.id === currentSequence.correctAnswer.id;

    setTimeout(() => {
      if (isCorrect) {
        // Succès
        const wasFirstTry = gameState.attempts === 0;
        incrementStreak();
        
        setGameState(prev => ({
          ...prev,
          status: 'success',
          isComplete: true,
        }));

        setSessionState(prev => ({
          ...prev,
          sequencesCompleted: prev.sequencesCompleted + 1,
          sequencesCorrectFirstTry: prev.sequencesCorrectFirstTry + (wasFirstTry ? 1 : 0),
          totalAttempts: prev.totalAttempts + gameState.attempts + 1,
          currentStreak: streak + 1,
          maxStreak: Math.max(prev.maxStreak, streak + 1),
        }));
      } else {
        // Erreur
        const newAttempts = gameState.attempts + 1;
        const shouldShowHint = config.hintThresholds.includes(newAttempts);
        const newHintLevel = shouldShowHint 
          ? Math.min(gameState.currentHintLevel + 1, 4) as 0 | 1 | 2 | 3 | 4
          : gameState.currentHintLevel;

        setGameState(prev => ({
          ...prev,
          attempts: newAttempts,
          selectedAnswer: null,
          status: newAttempts >= config.maxAttempts ? 'success' : 'error', // Révélation si max atteint
          currentHintLevel: newHintLevel,
          isComplete: newAttempts >= config.maxAttempts,
        }));

        if (newAttempts >= config.maxAttempts) {
          resetStreak();
          setSessionState(prev => ({
            ...prev,
            sequencesCompleted: prev.sequencesCompleted + 1,
            totalAttempts: prev.totalAttempts + newAttempts,
            currentStreak: 0,
          }));
        }
      }
    }, 300); // Délai pour l'animation
  }, [gameState, config, incrementStreak, resetStreak, streak]);

  // Demander un indice
  const requestHint = useCallback(() => {
    if (gameState.currentHintLevel >= 4) return;

    setGameState(prev => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
      currentHintLevel: Math.min(prev.currentHintLevel + 1, 4) as 0 | 1 | 2 | 3 | 4,
      status: 'hint',
    }));

    setSessionState(prev => ({
      ...prev,
      totalHints: prev.totalHints + 1,
    }));

    // Retour à idle après animation
    setTimeout(() => {
      setGameState(prev => ({ ...prev, status: 'idle' }));
    }, config.animationDurations.hint);
  }, [gameState.currentHintLevel, config.animationDurations.hint]);

  // Passer à la séquence suivante
  const nextSequence = useCallback(() => {
    const newSequence = generateSequence(sessionState.currentLevel);
    
    setGameState({
      currentSequence: newSequence,
      selectedAnswer: null,
      attempts: 0,
      hintsUsed: 0,
      currentHintLevel: 0,
      isComplete: false,
      status: 'idle',
    });
  }, [generateSequence, sessionState.currentLevel]);

  // Vérifier si niveau up
  const checkLevelUp = useCallback(() => {
    const { sequences, successRate, maxHintRate } = config.levelUpThreshold;
    const currentLevelSequences = sessionState.sequencesCompleted;
    const currentSuccessRate = sessionState.sequencesCorrectFirstTry / sessionState.sequencesCompleted;
    const currentHintRate = sessionState.totalHints / sessionState.sequencesCompleted;

    if (
      currentLevelSequences >= sequences &&
      currentSuccessRate >= successRate &&
      currentHintRate <= maxHintRate &&
      sessionState.currentLevel < 5
    ) {
      setSessionState(prev => ({
        ...prev,
        currentLevel: prev.currentLevel + 1,
      }));
      return true;
    }
    return false;
  }, [sessionState, config.levelUpThreshold]);

  return {
    gameState,
    sessionState,
    currentSequence,
    selectAnswer,
    confirmAnswer,
    requestHint,
    nextSequence,
    isSessionComplete,
    checkLevelUp,
  };
}
```

### useSequenceGenerator

```typescript
// hooks/useSequenceGenerator.ts

import { useCallback, useMemo } from 'react';
import { 
  Sequence, 
  SequenceElement, 
  PatternDefinition, 
  PatternType,
  ThemeType 
} from '../types';
import { THEMES } from '../data/themes';
import { PATTERNS } from '../data/patterns';
import { generateId, shuffle } from '@/utils/helpers';

export function useSequenceGenerator(theme: ThemeType) {
  // Éléments du thème
  const themeElements = useMemo(() => {
    return THEMES[theme].elements;
  }, [theme]);

  // Sélectionner un pattern selon la difficulté
  const selectPattern = useCallback((difficulty: number): PatternDefinition => {
    const availablePatterns = PATTERNS.filter(p => p.difficulty === difficulty);
    return availablePatterns[Math.floor(Math.random() * availablePatterns.length)];
  }, []);

  // Générer une séquence
  const generateSequence = useCallback((difficulty: number): Sequence => {
    const pattern = selectPattern(difficulty);
    const sequenceLength = getSequenceLength(difficulty);
    
    // Sélectionner les éléments de base pour ce pattern
    const baseElements = selectBaseElements(themeElements, pattern.cycle.length);
    
    // Construire la séquence selon le pattern
    const elements: SequenceElement[] = [];
    
    for (let i = 0; i < sequenceLength; i++) {
      const cycleIndex = pattern.cycle[i % pattern.cycle.length];
      let element = { ...baseElements[cycleIndex] };
      
      // Appliquer les transformations si nécessaire
      if (pattern.transform === 'size') {
        element = applySizeTransform(element, i, pattern.step || 1);
      } else if (pattern.transform === 'rotation') {
        element = applyRotationTransform(element, i, pattern.step || 90);
      } else if (pattern.transform === 'numeric') {
        element = applyNumericTransform(element, i, pattern.step || 1, pattern.type);
      }
      
      elements.push({
        ...element,
        id: generateId(),
      });
    }

    // L'élément manquant est le dernier
    const correctAnswer = elements.pop()!;
    
    // Générer les distracteurs
    const distractors = generateDistractors(
      themeElements,
      correctAnswer,
      3,
      pattern
    );

    return {
      id: generateId(),
      elements,
      missingIndex: elements.length,
      correctAnswer,
      distractors,
      patternDef: pattern,
      theme,
      difficulty,
    };
  }, [themeElements, selectPattern, theme]);

  return { generateSequence };
}

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

function getSequenceLength(difficulty: number): number {
  const lengths: Record<number, number> = {
    1: 5,   // 4 visibles + 1 manquant
    2: 6,
    3: 7,
    4: 7,
    5: 8,
  };
  return lengths[difficulty] || 5;
}

function selectBaseElements(
  elements: SequenceElement[], 
  count: number
): SequenceElement[] {
  const shuffled = shuffle([...elements]);
  return shuffled.slice(0, count);
}

function applySizeTransform(
  element: SequenceElement, 
  index: number, 
  step: number
): SequenceElement {
  const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
  const sizeIndex = Math.min(index * step, sizes.length - 1);
  return {
    ...element,
    size: sizes[sizeIndex],
  };
}

function applyRotationTransform(
  element: SequenceElement, 
  index: number, 
  step: number
): SequenceElement {
  return {
    ...element,
    rotation: (index * step) % 360,
  };
}

function applyNumericTransform(
  element: SequenceElement,
  index: number,
  step: number,
  patternType: PatternType
): SequenceElement {
  let value: number;
  
  switch (patternType) {
    case 'numeric_add':
      value = (index + 1) * step;
      break;
    case 'numeric_mult':
      value = Math.pow(step, index);
      break;
    case 'fibonacci':
      value = fibonacci(index);
      break;
    default:
      value = index + 1;
  }

  return {
    ...element,
    type: 'number',
    value,
    displayAsset: value.toString(),
  };
}

function fibonacci(n: number): number {
  if (n <= 1) return n === 0 ? 1 : 1;
  let a = 1, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

function generateDistractors(
  allElements: SequenceElement[],
  correctAnswer: SequenceElement,
  count: number,
  pattern: PatternDefinition
): SequenceElement[] {
  const distractors: SequenceElement[] = [];
  const usedIds = new Set([correctAnswer.id]);

  // Stratégie de distracteurs selon le type
  if (pattern.transform === 'numeric') {
    // Distracteurs numériques proches
    const correctValue = correctAnswer.value as number;
    const possibleDistractors = [
      correctValue - 1,
      correctValue + 1,
      correctValue - 2,
      correctValue + 2,
      correctValue * 2,
      Math.floor(correctValue / 2),
    ].filter(v => v > 0 && v !== correctValue);

    for (const value of shuffle(possibleDistractors).slice(0, count)) {
      distractors.push({
        ...correctAnswer,
        id: generateId(),
        value,
        displayAsset: value.toString(),
      });
    }
  } else {
    // Distracteurs basés sur d'autres éléments du thème
    const candidates = allElements.filter(e => e.id !== correctAnswer.id);
    
    for (const element of shuffle(candidates).slice(0, count)) {
      distractors.push({
        ...element,
        id: generateId(),
      });
    }
  }

  // S'assurer d'avoir assez de distracteurs
  while (distractors.length < count) {
    const randomElement = allElements[Math.floor(Math.random() * allElements.length)];
    if (!usedIds.has(randomElement.id)) {
      distractors.push({
        ...randomElement,
        id: generateId(),
      });
      usedIds.add(randomElement.id);
    }
  }

  return distractors.slice(0, count);
}
```

---

## Données de Configuration

### Thèmes

```typescript
// data/themes.ts

import { Theme, ThemeType } from '../types';

export const THEMES: Record<ThemeType, Theme> = {
  farm: {
    id: 'farm',
    name: 'La Ferme',
    icon: '🐄',
    ageRange: [6, 8],
    unlockCondition: { type: 'default' },
    elements: [
      { id: 'cow', type: 'image', value: 'cow', displayAsset: 'farm_cow.png', label: 'Vache' },
      { id: 'pig', type: 'image', value: 'pig', displayAsset: 'farm_pig.png', label: 'Cochon' },
      { id: 'chicken', type: 'image', value: 'chicken', displayAsset: 'farm_chicken.png', label: 'Poule' },
      { id: 'sheep', type: 'image', value: 'sheep', displayAsset: 'farm_sheep.png', label: 'Mouton' },
      { id: 'horse', type: 'image', value: 'horse', displayAsset: 'farm_horse.png', label: 'Cheval' },
    ],
  },
  
  space: {
    id: 'space',
    name: 'L\'Espace',
    icon: '🚀',
    ageRange: [7, 10],
    unlockCondition: { type: 'sequences', value: 10 },
    elements: [
      { id: 'rocket', type: 'image', value: 'rocket', displayAsset: 'space_rocket.png', label: 'Fusée' },
      { id: 'moon', type: 'image', value: 'moon', displayAsset: 'space_moon.png', label: 'Lune' },
      { id: 'star', type: 'image', value: 'star', displayAsset: 'space_star.png', label: 'Étoile' },
      { id: 'planet', type: 'image', value: 'planet', displayAsset: 'space_planet.png', label: 'Planète' },
      { id: 'alien', type: 'image', value: 'alien', displayAsset: 'space_alien.png', label: 'Alien' },
    ],
  },

  shapes: {
    id: 'shapes',
    name: 'Formes',
    icon: '🔷',
    ageRange: [6, 10],
    unlockCondition: { type: 'default' },
    elements: [
      { id: 'circle', type: 'shape', value: 'circle', displayAsset: '#5B8DEE', label: 'Cercle' },
      { id: 'square', type: 'shape', value: 'square', displayAsset: '#FFB347', label: 'Carré' },
      { id: 'triangle', type: 'shape', value: 'triangle', displayAsset: '#7BC74D', label: 'Triangle' },
      { id: 'diamond', type: 'shape', value: 'diamond', displayAsset: '#E056FD', label: 'Losange' },
    ],
  },

  colors: {
    id: 'colors',
    name: 'Couleurs',
    icon: '🎨',
    ageRange: [6, 7],
    unlockCondition: { type: 'default' },
    elements: [
      { id: 'red', type: 'color', value: 'red', displayAsset: '#E74C3C', label: 'Rouge' },
      { id: 'blue', type: 'color', value: 'blue', displayAsset: '#3498DB', label: 'Bleu' },
      { id: 'green', type: 'color', value: 'green', displayAsset: '#27AE60', label: 'Vert' },
      { id: 'yellow', type: 'color', value: 'yellow', displayAsset: '#F1C40F', label: 'Jaune' },
      { id: 'purple', type: 'color', value: 'purple', displayAsset: '#9B59B6', label: 'Violet' },
    ],
  },

  numbers: {
    id: 'numbers',
    name: 'Nombres',
    icon: '🔢',
    ageRange: [8, 10],
    unlockCondition: { type: 'level', value: 3 },
    elements: [
      // Générés dynamiquement selon le pattern numérique
      { id: 'num_1', type: 'number', value: 1, displayAsset: '1', label: 'Un' },
      { id: 'num_2', type: 'number', value: 2, displayAsset: '2', label: 'Deux' },
      // etc.
    ],
  },

  music: {
    id: 'music',
    name: 'Musique',
    icon: '🎵',
    ageRange: [7, 9],
    unlockCondition: { type: 'level', value: 2 },
    elements: [
      { id: 'note1', type: 'image', value: 'note1', displayAsset: 'music_note1.png', label: 'Note' },
      { id: 'note2', type: 'image', value: 'note2', displayAsset: 'music_note2.png', label: 'Double croche' },
      { id: 'clef', type: 'image', value: 'clef', displayAsset: 'music_clef.png', label: 'Clé de sol' },
      { id: 'drum', type: 'image', value: 'drum', displayAsset: 'music_drum.png', label: 'Tambour' },
    ],
  },
};
```

### Patterns

```typescript
// data/patterns.ts

import { PatternDefinition } from '../types';

export const PATTERNS: PatternDefinition[] = [
  // Niveau 1 - Alternances simples
  { type: 'ABAB', cycle: [0, 1], difficulty: 1 },
  { type: 'AABB', cycle: [0, 0, 1, 1], difficulty: 1 },
  
  // Niveau 2 - Motifs à 3 éléments
  { type: 'ABC', cycle: [0, 1, 2], difficulty: 2 },
  { type: 'AAB', cycle: [0, 0, 1], difficulty: 2 },
  { type: 'ABBC', cycle: [0, 1, 1, 2], difficulty: 2 },
  
  // Niveau 3 - Progressions visuelles
  { type: 'increasing', cycle: [0], transform: 'size', step: 1, difficulty: 3 },
  { type: 'rotation', cycle: [0], transform: 'rotation', step: 90, difficulty: 3 },
  { type: 'AABBCC', cycle: [0, 0, 1, 1, 2, 2], difficulty: 3 },
  
  // Niveau 4 - Suites numériques simples
  { type: 'numeric_add', cycle: [0], transform: 'numeric', step: 1, difficulty: 4 },
  { type: 'numeric_add', cycle: [0], transform: 'numeric', step: 2, difficulty: 4 },
  
  // Niveau 5 - Suites complexes
  { type: 'numeric_mult', cycle: [0], transform: 'numeric', step: 2, difficulty: 5 },
  { type: 'fibonacci', cycle: [0], transform: 'numeric', difficulty: 5 },
  { type: 'custom', cycle: [0, 1, 0, 2, 0, 1, 0, 2], difficulty: 5 },
];
```

---

## Animations

### Animations Principales

```typescript
// utils/animations.ts

import { 
  withSpring, 
  withTiming, 
  withSequence, 
  withDelay,
  withRepeat,
  Easing,
  SharedValue,
} from 'react-native-reanimated';

// Configuration des ressorts
export const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
  mass: 1,
};

export const SPRING_BOUNCY = {
  damping: 10,
  stiffness: 180,
  mass: 0.8,
};

// Animation de succès
export function animateSuccess(scale: SharedValue<number>) {
  'worklet';
  scale.value = withSequence(
    withSpring(1.2, SPRING_BOUNCY),
    withSpring(1.0, SPRING_CONFIG)
  );
}

// Animation d'erreur (shake)
export function animateError(translateX: SharedValue<number>) {
  'worklet';
  translateX.value = withSequence(
    withTiming(-10, { duration: 50 }),
    withTiming(10, { duration: 50 }),
    withTiming(-10, { duration: 50 }),
    withTiming(10, { duration: 50 }),
    withTiming(0, { duration: 50 })
  );
}

// Animation de pulsation
export function animatePulse(scale: SharedValue<number>, active: boolean) {
  'worklet';
  if (active) {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0, { duration: 500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  } else {
    scale.value = withSpring(1.0, SPRING_CONFIG);
  }
}

// Animation d'apparition séquentielle
export function animateSequentialAppear(
  opacity: SharedValue<number>,
  index: number,
  delayPerItem: number = 100
) {
  'worklet';
  opacity.value = withDelay(
    index * delayPerItem,
    withTiming(1, { duration: 300 })
  );
}

// Animation de confettis (simplifiée)
export function getConfettiConfig() {
  return {
    count: 30,
    duration: 1500,
    colors: ['#5B8DEE', '#FFB347', '#7BC74D', '#E056FD', '#F39C12'],
  };
}
```

---

## Tests

### Tests Unitaires

```typescript
// __tests__/useSequenceGenerator.test.ts

import { renderHook } from '@testing-library/react-hooks';
import { useSequenceGenerator } from '../hooks/useSequenceGenerator';

describe('useSequenceGenerator', () => {
  it('génère une séquence valide pour le niveau 1', () => {
    const { result } = renderHook(() => useSequenceGenerator('colors'));
    const sequence = result.current.generateSequence(1);

    expect(sequence).toBeDefined();
    expect(sequence.elements.length).toBeGreaterThanOrEqual(4);
    expect(sequence.correctAnswer).toBeDefined();
    expect(sequence.distractors.length).toBe(3);
  });

  it('génère des distracteurs différents de la bonne réponse', () => {
    const { result } = renderHook(() => useSequenceGenerator('shapes'));
    const sequence = result.current.generateSequence(2);

    const distractorIds = sequence.distractors.map(d => d.id);
    expect(distractorIds).not.toContain(sequence.correctAnswer.id);
  });

  it('respecte le pattern ABAB', () => {
    const { result } = renderHook(() => useSequenceGenerator('colors'));
    
    // Générer plusieurs séquences niveau 1 (pattern ABAB ou AABB)
    for (let i = 0; i < 10; i++) {
      const sequence = result.current.generateSequence(1);
      const pattern = sequence.patternDef;
      
      expect(['ABAB', 'AABB']).toContain(pattern.type);
    }
  });

  it('génère des suites numériques correctes', () => {
    const { result } = renderHook(() => useSequenceGenerator('numbers'));
    const sequence = result.current.generateSequence(4);

    if (sequence.patternDef.type === 'numeric_add') {
      const values = sequence.elements.map(e => e.value as number);
      const step = values[1] - values[0];
      
      for (let i = 1; i < values.length; i++) {
        expect(values[i] - values[i-1]).toBe(step);
      }
    }
  });
});

// __tests__/useSuitesGame.test.ts

import { renderHook, act } from '@testing-library/react-hooks';
import { useSuitesGame } from '../hooks/useSuitesGame';

describe('useSuitesGame', () => {
  it('initialise correctement l\'état du jeu', () => {
    const { result } = renderHook(() => useSuitesGame({ 
      theme: 'colors', 
      initialLevel: 1 
    }));

    expect(result.current.gameState.status).toBe('idle');
    expect(result.current.sessionState.currentLevel).toBe(1);
    expect(result.current.sessionState.sequencesCompleted).toBe(0);
  });

  it('sélectionne une réponse correctement', () => {
    const { result } = renderHook(() => useSuitesGame({ theme: 'colors' }));
    
    act(() => {
      result.current.nextSequence();
    });

    const answer = result.current.currentSequence!.correctAnswer;
    
    act(() => {
      result.current.selectAnswer(answer);
    });

    expect(result.current.gameState.selectedAnswer).toBe(answer);
    expect(result.current.gameState.status).toBe('selected');
  });

  it('confirme une bonne réponse', async () => {
    const { result, waitForNextUpdate } = renderHook(() => 
      useSuitesGame({ theme: 'colors' })
    );
    
    act(() => {
      result.current.nextSequence();
    });

    const correctAnswer = result.current.currentSequence!.correctAnswer;
    
    act(() => {
      result.current.selectAnswer(correctAnswer);
      result.current.confirmAnswer();
    });

    await waitForNextUpdate();

    expect(result.current.gameState.status).toBe('success');
  });

  it('incrémente le streak après réussite', async () => {
    const { result, waitForNextUpdate } = renderHook(() => 
      useSuitesGame({ theme: 'colors' })
    );
    
    // Première séquence réussie
    act(() => { result.current.nextSequence(); });
    act(() => {
      result.current.selectAnswer(result.current.currentSequence!.correctAnswer);
      result.current.confirmAnswer();
    });
    await waitForNextUpdate();

    expect(result.current.sessionState.currentStreak).toBe(1);

    // Deuxième séquence réussie
    act(() => { result.current.nextSequence(); });
    act(() => {
      result.current.selectAnswer(result.current.currentSequence!.correctAnswer);
      result.current.confirmAnswer();
    });
    await waitForNextUpdate();

    expect(result.current.sessionState.currentStreak).toBe(2);
  });
});
```

---

## Accessibilité

### Configuration VoiceOver

```typescript
// utils/accessibility.ts

export function getSequenceAccessibilityLabel(sequence: Sequence): string {
  const elements = sequence.elements
    .map((e, i) => e.label || `Élément ${i + 1}`)
    .join(', puis ');
  
  return `Suite logique : ${elements}, puis un élément manquant à trouver.`;
}

export function getChoiceAccessibilityHint(
  choice: SequenceElement, 
  isSelected: boolean
): string {
  const base = choice.label || `Choix ${choice.value}`;
  if (isSelected) {
    return `${base}, sélectionné. Double-tap pour confirmer.`;
  }
  return `${base}. Double-tap pour sélectionner.`;
}

export function getHintAccessibilityAnnouncement(hintLevel: number): string {
  switch (hintLevel) {
    case 1:
      return "Indice : observe ce qui se répète dans la suite.";
    case 2:
      return "Les éléments similaires sont maintenant mis en évidence.";
    case 3:
      return "Il ne reste plus que deux choix possibles.";
    case 4:
      return "La bonne réponse est maintenant visible.";
    default:
      return "";
  }
}
```

---

*Spécifications Techniques Suites Logiques | Application Éducative Montessori iPad*
