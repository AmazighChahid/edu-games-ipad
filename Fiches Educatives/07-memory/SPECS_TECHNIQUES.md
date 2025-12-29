# ⚙️ SPECS TECHNIQUES : Super Mémoire

## Architecture des Composants

### Structure des Fichiers

```
/src/games/07-memory/
├── index.ts                      # Exports
├── types.ts                      # Types TypeScript
├── components/
│   ├── MemoryGame.tsx            # Composant principal
│   ├── MemoryBoard.tsx           # Plateau de jeu
│   ├── MemoryCard.tsx            # Carte individuelle (flip)
│   ├── CardBack.tsx              # Dos de carte
│   ├── CardFront.tsx             # Face de carte (image)
│   ├── ThemeSelector.tsx         # Sélection du thème
│   ├── LevelSelector.tsx         # Sélection du niveau
│   └── GameStats.tsx             # Statistiques en cours
├── hooks/
│   ├── useMemoryGame.ts          # Logique de jeu principale
│   ├── useCardFlip.ts            # Animation de retournement
│   └── useGameTimer.ts           # Chronomètre optionnel
├── data/
│   ├── themes.ts                 # Définition des thèmes
│   ├── levels.ts                 # Configuration des niveaux
│   └── cards.ts                  # Assets des cartes
├── screens/
│   ├── MemoryIntroScreen.tsx     # Écran d'introduction
│   ├── MemoryGameScreen.tsx      # Écran de jeu
│   └── MemoryVictoryScreen.tsx   # Écran de victoire
└── utils/
    ├── shuffle.ts                # Mélange des cartes
    └── pairGenerator.ts          # Génération des paires
```

---

## Types TypeScript

```typescript
// types.ts

// ============================================
// CARTES
// ============================================

export interface Card {
  id: string;
  pairId: string;              // ID de la paire
  imageAsset: string;          // URI de l'image
  label: string;               // Pour accessibilité
  themeId: ThemeType;
}

export interface CardState {
  card: Card;
  isFlipped: boolean;          // Face visible
  isMatched: boolean;          // Paire trouvée
  position: number;            // Position sur le plateau
}

// ============================================
// THÈMES
// ============================================

export type ThemeType =
  | 'animals'     // 🐾 Animaux
  | 'fruits'      // 🍎 Fruits
  | 'vehicles'    // 🚗 Véhicules
  | 'nature'      // 🌿 Nature
  | 'space'       // 🚀 Espace
  | 'emojis';     // 😀 Expressions

export interface Theme {
  id: ThemeType;
  name: string;
  icon: string;
  cards: Card[];
  unlockCondition?: {
    type: 'games' | 'level';
    value: number;
  };
}

// ============================================
// NIVEAUX
// ============================================

export interface Level {
  id: number;
  name: string;
  pairCount: number;           // Nombre de paires (4, 6, 8, 10, 12)
  gridColumns: number;         // Colonnes de la grille
  ageRange: [number, number];
  showTimer: boolean;
  targetTime?: number;         // Temps cible en secondes
}

// ============================================
// ÉTAT DU JEU
// ============================================

export interface GameState {
  cards: CardState[];
  flippedCards: string[];      // IDs des cartes retournées (max 2)
  matchedPairs: number;
  attempts: number;
  status: 'idle' | 'flipping' | 'checking' | 'matched' | 'unmatched' | 'complete';
}

export interface SessionState {
  theme: ThemeType;
  level: Level;
  startTime: Date;
  endTime?: Date;
  totalAttempts: number;
  hintsUsed: number;
  stars: 1 | 2 | 3;
}

// ============================================
// CONFIGURATION
// ============================================

export interface GameConfig {
  flipDuration: number;        // ms pour l'animation flip
  matchDelay: number;          // ms avant de cacher les cartes non matchées
  cardSize: number;            // Taille des cartes en dp
  cardGap: number;             // Espacement entre cartes
}
```

---

## Composants React Native

### Composant Principal

```typescript
// components/MemoryGame.tsx

import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { MemoryBoard } from './MemoryBoard';
import { GameStats } from './GameStats';
import { MascotBubble } from '@/components/mascot/MascotBubble';
import { IconButton } from '@/components/common/IconButton';

import { useMemoryGame } from '../hooks/useMemoryGame';
import { useSound } from '@/hooks/useSound';
import { useHaptics } from '@/hooks/useHaptics';

import { Level, ThemeType, SessionStats } from '../types';

interface Props {
  theme: ThemeType;
  level: Level;
  onComplete: (stats: SessionStats) => void;
  onExit: () => void;
}

export const MemoryGame: React.FC<Props> = ({
  theme,
  level,
  onComplete,
  onExit,
}) => {
  const {
    gameState,
    sessionState,
    flipCard,
    isGameComplete,
  } = useMemoryGame({ theme, level });

  const { playSound } = useSound();
  const { triggerHaptic } = useHaptics();

  // Dialogue de la mascotte
  const [mascotMessage, setMascotMessage] = React.useState(
    "Je suis Memo ! Un éléphant n'oublie jamais. Et toi ?"
  );

  // Gestion du flip
  const handleCardPress = useCallback((cardId: string) => {
    if (gameState.flippedCards.length >= 2) return;
    if (gameState.cards.find(c => c.card.id === cardId)?.isMatched) return;

    playSound('flip');
    triggerHaptic('light');
    flipCard(cardId);
  }, [gameState, flipCard, playSound, triggerHaptic]);

  // Feedback selon l'état
  useEffect(() => {
    if (gameState.status === 'matched') {
      playSound('match');
      triggerHaptic('success');
      setMascotMessage("Bravo ! Une paire de trouvée ! 🎉");
    } else if (gameState.status === 'unmatched') {
      playSound('nomatch');
      setMascotMessage("Pas cette fois, mais retiens bien !");
    } else if (gameState.status === 'complete') {
      playSound('victory');
      triggerHaptic('success');
      setMascotMessage("Incroyable ! Tu as une mémoire d'éléphant ! 🐘");
      onComplete(sessionState);
    }
  }, [gameState.status]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="home" onPress={onExit} size={48} />
        <GameStats
          pairs={gameState.matchedPairs}
          totalPairs={level.pairCount}
          attempts={gameState.attempts}
        />
      </View>

      {/* Mascotte */}
      <MascotBubble
        mascot="memo"
        message={mascotMessage}
        position="top"
      />

      {/* Plateau de jeu */}
      <View style={styles.boardArea}>
        <MemoryBoard
          cards={gameState.cards}
          columns={level.gridColumns}
          onCardPress={handleCardPress}
          disabled={gameState.status === 'checking'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4FF',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  boardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

### Composant MemoryCard

```typescript
// components/MemoryCard.tsx

import React from 'react';
import { Pressable, StyleSheet, Image, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

import { CardState } from '../types';

interface Props {
  cardState: CardState;
  size: number;
  onPress: () => void;
  disabled: boolean;
}

export const MemoryCard: React.FC<Props> = ({
  cardState,
  size,
  onPress,
  disabled,
}) => {
  const { card, isFlipped, isMatched } = cardState;
  const rotation = useSharedValue(isFlipped ? 180 : 0);

  // Animation du flip
  React.useEffect(() => {
    rotation.value = withTiming(isFlipped ? 180 : 0, { duration: 300 });
  }, [isFlipped]);

  // Style de la face avant (dos de carte)
  const frontStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(
      rotation.value,
      [0, 180],
      [0, 180],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
    };
  });

  // Style de la face arrière (image)
  const backStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(
      rotation.value,
      [0, 180],
      [180, 360],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
    };
  });

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isFlipped || isMatched}
      style={[styles.container, { width: size, height: size }]}
      accessibilityLabel={isFlipped ? card.label : "Carte cachée"}
      accessibilityHint="Double-tap pour retourner"
    >
      {/* Dos de carte */}
      <Animated.View style={[styles.card, styles.cardFront, frontStyle]}>
        <View style={styles.cardBack}>
          <Image
            source={require('@/assets/images/card-back.png')}
            style={styles.backImage}
            resizeMode="cover"
          />
        </View>
      </Animated.View>

      {/* Face de carte (image) */}
      <Animated.View style={[styles.card, styles.cardBack, backStyle]}>
        <Image
          source={{ uri: card.imageAsset }}
          style={[styles.cardImage, isMatched && styles.matched]}
          resizeMode="contain"
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    perspective: 1000,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardFront: {
    zIndex: 1,
  },
  cardBack: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  cardImage: {
    width: '80%',
    height: '80%',
  },
  matched: {
    opacity: 0.6,
  },
});
```

---

## Hook Principal

```typescript
// hooks/useMemoryGame.ts

import { useState, useCallback, useEffect, useMemo } from 'react';
import { generateCards, shuffleCards } from '../utils/pairGenerator';
import { GameState, SessionState, Level, ThemeType, CardState } from '../types';
import { THEMES } from '../data/themes';

interface UseMemoryGameProps {
  theme: ThemeType;
  level: Level;
}

const MATCH_DELAY = 1000;
const UNMATCH_DELAY = 800;

export function useMemoryGame({ theme, level }: UseMemoryGameProps) {
  // État du jeu
  const [gameState, setGameState] = useState<GameState>(() => ({
    cards: initializeCards(theme, level.pairCount),
    flippedCards: [],
    matchedPairs: 0,
    attempts: 0,
    status: 'idle',
  }));

  // État de la session
  const [sessionState, setSessionState] = useState<SessionState>({
    theme,
    level,
    startTime: new Date(),
    totalAttempts: 0,
    hintsUsed: 0,
    stars: 3,
  });

  // Jeu terminé ?
  const isGameComplete = gameState.matchedPairs >= level.pairCount;

  // Retourner une carte
  const flipCard = useCallback((cardId: string) => {
    setGameState(prev => {
      // Ne pas retourner si déjà 2 cartes ou carte déjà retournée
      if (prev.flippedCards.length >= 2) return prev;
      if (prev.flippedCards.includes(cardId)) return prev;

      const newFlippedCards = [...prev.flippedCards, cardId];
      const newCards = prev.cards.map(c =>
        c.card.id === cardId ? { ...c, isFlipped: true } : c
      );

      return {
        ...prev,
        cards: newCards,
        flippedCards: newFlippedCards,
        status: newFlippedCards.length === 2 ? 'checking' : 'flipping',
      };
    });
  }, []);

  // Vérifier les paires quand 2 cartes sont retournées
  useEffect(() => {
    if (gameState.flippedCards.length !== 2) return;

    const [firstId, secondId] = gameState.flippedCards;
    const firstCard = gameState.cards.find(c => c.card.id === firstId)!;
    const secondCard = gameState.cards.find(c => c.card.id === secondId)!;

    const isMatch = firstCard.card.pairId === secondCard.card.pairId;

    if (isMatch) {
      // Paire trouvée !
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          cards: prev.cards.map(c =>
            c.card.pairId === firstCard.card.pairId
              ? { ...c, isMatched: true }
              : c
          ),
          flippedCards: [],
          matchedPairs: prev.matchedPairs + 1,
          attempts: prev.attempts + 1,
          status: prev.matchedPairs + 1 >= level.pairCount ? 'complete' : 'matched',
        }));
      }, MATCH_DELAY);
    } else {
      // Pas de paire
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          cards: prev.cards.map(c =>
            prev.flippedCards.includes(c.card.id) && !c.isMatched
              ? { ...c, isFlipped: false }
              : c
          ),
          flippedCards: [],
          attempts: prev.attempts + 1,
          status: 'unmatched',
        }));
      }, UNMATCH_DELAY);
    }
  }, [gameState.flippedCards, gameState.cards, level.pairCount]);

  // Calculer les étoiles à la fin
  useEffect(() => {
    if (gameState.status === 'complete') {
      const minAttempts = level.pairCount; // Minimum théorique
      const actualAttempts = gameState.attempts;
      const ratio = actualAttempts / minAttempts;

      let stars: 1 | 2 | 3 = 1;
      if (ratio <= 1.5) stars = 3;
      else if (ratio <= 2.5) stars = 2;

      setSessionState(prev => ({
        ...prev,
        endTime: new Date(),
        totalAttempts: actualAttempts,
        stars,
      }));
    }
  }, [gameState.status, gameState.attempts, level.pairCount]);

  return {
    gameState,
    sessionState,
    flipCard,
    isGameComplete,
  };
}

// Initialiser les cartes
function initializeCards(theme: ThemeType, pairCount: number): CardState[] {
  const themeData = THEMES[theme];
  const selectedCards = themeData.cards.slice(0, pairCount);

  // Créer les paires
  const pairs: CardState[] = [];
  selectedCards.forEach((card, index) => {
    // Carte 1 de la paire
    pairs.push({
      card: { ...card, id: `${card.pairId}-a` },
      isFlipped: false,
      isMatched: false,
      position: index * 2,
    });
    // Carte 2 de la paire
    pairs.push({
      card: { ...card, id: `${card.pairId}-b` },
      isFlipped: false,
      isMatched: false,
      position: index * 2 + 1,
    });
  });

  // Mélanger
  return shuffleCards(pairs);
}

function shuffleCards(cards: CardState[]): CardState[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.map((card, index) => ({ ...card, position: index }));
}
```

---

## Données de Configuration

### Thèmes

```typescript
// data/themes.ts

import { Theme, ThemeType, Card } from '../types';

export const THEMES: Record<ThemeType, Theme> = {
  animals: {
    id: 'animals',
    name: 'Animaux',
    icon: '🐾',
    cards: [
      { pairId: 'cat', imageAsset: 'memory/animals/cat.png', label: 'Chat', themeId: 'animals' },
      { pairId: 'dog', imageAsset: 'memory/animals/dog.png', label: 'Chien', themeId: 'animals' },
      { pairId: 'elephant', imageAsset: 'memory/animals/elephant.png', label: 'Éléphant', themeId: 'animals' },
      { pairId: 'lion', imageAsset: 'memory/animals/lion.png', label: 'Lion', themeId: 'animals' },
      { pairId: 'rabbit', imageAsset: 'memory/animals/rabbit.png', label: 'Lapin', themeId: 'animals' },
      { pairId: 'bird', imageAsset: 'memory/animals/bird.png', label: 'Oiseau', themeId: 'animals' },
      { pairId: 'fish', imageAsset: 'memory/animals/fish.png', label: 'Poisson', themeId: 'animals' },
      { pairId: 'turtle', imageAsset: 'memory/animals/turtle.png', label: 'Tortue', themeId: 'animals' },
      { pairId: 'bear', imageAsset: 'memory/animals/bear.png', label: 'Ours', themeId: 'animals' },
      { pairId: 'fox', imageAsset: 'memory/animals/fox.png', label: 'Renard', themeId: 'animals' },
      { pairId: 'owl', imageAsset: 'memory/animals/owl.png', label: 'Hibou', themeId: 'animals' },
      { pairId: 'penguin', imageAsset: 'memory/animals/penguin.png', label: 'Pingouin', themeId: 'animals' },
    ],
  },

  fruits: {
    id: 'fruits',
    name: 'Fruits',
    icon: '🍎',
    cards: [
      { pairId: 'apple', imageAsset: 'memory/fruits/apple.png', label: 'Pomme', themeId: 'fruits' },
      { pairId: 'banana', imageAsset: 'memory/fruits/banana.png', label: 'Banane', themeId: 'fruits' },
      { pairId: 'orange', imageAsset: 'memory/fruits/orange.png', label: 'Orange', themeId: 'fruits' },
      { pairId: 'strawberry', imageAsset: 'memory/fruits/strawberry.png', label: 'Fraise', themeId: 'fruits' },
      { pairId: 'grape', imageAsset: 'memory/fruits/grape.png', label: 'Raisin', themeId: 'fruits' },
      { pairId: 'watermelon', imageAsset: 'memory/fruits/watermelon.png', label: 'Pastèque', themeId: 'fruits' },
      { pairId: 'pear', imageAsset: 'memory/fruits/pear.png', label: 'Poire', themeId: 'fruits' },
      { pairId: 'cherry', imageAsset: 'memory/fruits/cherry.png', label: 'Cerise', themeId: 'fruits' },
      { pairId: 'kiwi', imageAsset: 'memory/fruits/kiwi.png', label: 'Kiwi', themeId: 'fruits' },
      { pairId: 'lemon', imageAsset: 'memory/fruits/lemon.png', label: 'Citron', themeId: 'fruits' },
      { pairId: 'mango', imageAsset: 'memory/fruits/mango.png', label: 'Mangue', themeId: 'fruits' },
      { pairId: 'peach', imageAsset: 'memory/fruits/peach.png', label: 'Pêche', themeId: 'fruits' },
    ],
  },

  vehicles: {
    id: 'vehicles',
    name: 'Véhicules',
    icon: '🚗',
    unlockCondition: { type: 'games', value: 5 },
    cards: [
      { pairId: 'car', imageAsset: 'memory/vehicles/car.png', label: 'Voiture', themeId: 'vehicles' },
      { pairId: 'bus', imageAsset: 'memory/vehicles/bus.png', label: 'Bus', themeId: 'vehicles' },
      { pairId: 'train', imageAsset: 'memory/vehicles/train.png', label: 'Train', themeId: 'vehicles' },
      { pairId: 'plane', imageAsset: 'memory/vehicles/plane.png', label: 'Avion', themeId: 'vehicles' },
      { pairId: 'boat', imageAsset: 'memory/vehicles/boat.png', label: 'Bateau', themeId: 'vehicles' },
      { pairId: 'bike', imageAsset: 'memory/vehicles/bike.png', label: 'Vélo', themeId: 'vehicles' },
      { pairId: 'helicopter', imageAsset: 'memory/vehicles/helicopter.png', label: 'Hélicoptère', themeId: 'vehicles' },
      { pairId: 'rocket', imageAsset: 'memory/vehicles/rocket.png', label: 'Fusée', themeId: 'vehicles' },
      { pairId: 'truck', imageAsset: 'memory/vehicles/truck.png', label: 'Camion', themeId: 'vehicles' },
      { pairId: 'motorcycle', imageAsset: 'memory/vehicles/motorcycle.png', label: 'Moto', themeId: 'vehicles' },
      { pairId: 'tractor', imageAsset: 'memory/vehicles/tractor.png', label: 'Tracteur', themeId: 'vehicles' },
      { pairId: 'submarine', imageAsset: 'memory/vehicles/submarine.png', label: 'Sous-marin', themeId: 'vehicles' },
    ],
  },

  // ... autres thèmes (nature, space, emojis)
};
```

### Niveaux

```typescript
// data/levels.ts

import { Level } from '../types';

export const LEVELS: Level[] = [
  {
    id: 1,
    name: 'Découverte',
    pairCount: 4,
    gridColumns: 4,
    ageRange: [4, 6],
    showTimer: false,
  },
  {
    id: 2,
    name: 'Facile',
    pairCount: 6,
    gridColumns: 4,
    ageRange: [5, 7],
    showTimer: false,
  },
  {
    id: 3,
    name: 'Moyen',
    pairCount: 8,
    gridColumns: 4,
    ageRange: [6, 8],
    showTimer: false,
  },
  {
    id: 4,
    name: 'Difficile',
    pairCount: 10,
    gridColumns: 5,
    ageRange: [7, 9],
    showTimer: true,
    targetTime: 120,
  },
  {
    id: 5,
    name: 'Expert',
    pairCount: 12,
    gridColumns: 6,
    ageRange: [8, 10],
    showTimer: true,
    targetTime: 150,
  },
];
```

---

## Animations

```typescript
// utils/animations.ts

import {
  withSpring,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

export const FLIP_DURATION = 300;

export const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
};

// Animation de match trouvé
export function animateMatch(scale: SharedValue<number>) {
  'worklet';
  scale.value = withSequence(
    withSpring(1.15, SPRING_CONFIG),
    withSpring(1.0, SPRING_CONFIG)
  );
}

// Animation de carte non matchée (shake)
export function animateNoMatch(translateX: SharedValue<number>) {
  'worklet';
  translateX.value = withSequence(
    withTiming(-8, { duration: 50 }),
    withTiming(8, { duration: 50 }),
    withTiming(-8, { duration: 50 }),
    withTiming(0, { duration: 50 })
  );
}

// Animation de victoire
export function animateVictory(scale: SharedValue<number>, rotate: SharedValue<number>) {
  'worklet';
  scale.value = withSequence(
    withSpring(1.2, SPRING_CONFIG),
    withSpring(1.0, SPRING_CONFIG)
  );
  rotate.value = withSequence(
    withTiming(-5, { duration: 100 }),
    withTiming(5, { duration: 100 }),
    withTiming(-5, { duration: 100 }),
    withTiming(0, { duration: 100 })
  );
}
```

---

## Accessibilité

```typescript
// utils/accessibility.ts

export function getCardAccessibilityLabel(
  card: Card,
  isFlipped: boolean,
  isMatched: boolean
): string {
  if (isMatched) {
    return `${card.label}, paire trouvée`;
  }
  if (isFlipped) {
    return card.label;
  }
  return "Carte cachée";
}

export function getCardAccessibilityHint(
  isFlipped: boolean,
  isMatched: boolean
): string {
  if (isMatched) {
    return "Cette paire a été trouvée";
  }
  if (isFlipped) {
    return "Cette carte est retournée";
  }
  return "Double-tap pour retourner cette carte";
}

export function getBoardAccessibilityLabel(
  matchedPairs: number,
  totalPairs: number
): string {
  return `Plateau de Memory. ${matchedPairs} paires trouvées sur ${totalPairs}.`;
}
```

---

## Tests

```typescript
// __tests__/useMemoryGame.test.ts

import { renderHook, act } from '@testing-library/react-hooks';
import { useMemoryGame } from '../hooks/useMemoryGame';
import { LEVELS } from '../data/levels';

describe('useMemoryGame', () => {
  const defaultProps = {
    theme: 'animals' as const,
    level: LEVELS[0], // 4 paires
  };

  it('initialise correctement le jeu', () => {
    const { result } = renderHook(() => useMemoryGame(defaultProps));

    expect(result.current.gameState.cards.length).toBe(8); // 4 paires = 8 cartes
    expect(result.current.gameState.matchedPairs).toBe(0);
    expect(result.current.gameState.flippedCards.length).toBe(0);
  });

  it('retourne une carte au clic', () => {
    const { result } = renderHook(() => useMemoryGame(defaultProps));

    const firstCardId = result.current.gameState.cards[0].card.id;

    act(() => {
      result.current.flipCard(firstCardId);
    });

    expect(result.current.gameState.flippedCards).toContain(firstCardId);
    expect(
      result.current.gameState.cards.find(c => c.card.id === firstCardId)?.isFlipped
    ).toBe(true);
  });

  it('détecte une paire correcte', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useMemoryGame(defaultProps)
    );

    // Trouver deux cartes de la même paire
    const cards = result.current.gameState.cards;
    const firstCard = cards[0];
    const matchingCard = cards.find(
      c => c.card.pairId === firstCard.card.pairId && c.card.id !== firstCard.card.id
    )!;

    act(() => {
      result.current.flipCard(firstCard.card.id);
      result.current.flipCard(matchingCard.card.id);
    });

    await waitForNextUpdate();

    expect(result.current.gameState.matchedPairs).toBe(1);
  });

  it('calcule les étoiles correctement', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useMemoryGame({ ...defaultProps, level: LEVELS[0] })
    );

    // Simuler une partie parfaite (4 paires en 4 essais)
    // ... (logique de test)

    expect(result.current.sessionState.stars).toBe(3);
  });
});
```

---

*Spécifications Techniques Super Mémoire | Application Éducative Montessori iPad*
