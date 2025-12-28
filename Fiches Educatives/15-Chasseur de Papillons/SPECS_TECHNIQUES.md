# SPÉCIFICATIONS TECHNIQUES : Chasseur de Papillons 🦋

> **Stack** : React Native + Expo SDK 52+ • TypeScript • Reanimated 3
> **Plateforme** : iPad (principal) • iPhone (secondaire)

---

## 📁 Architecture des Fichiers

```
src/games/chasseur-papillons/
├── index.ts
├── types.ts
│
├── components/
│   ├── core/
│   │   ├── Butterfly.tsx           # Papillon animé
│   │   ├── ButterflyWings.tsx      # Ailes battantes
│   │   ├── SequenceBar.tsx         # Barre séquence couleurs
│   │   ├── SequenceSlot.tsx        # Slot individuel
│   │   └── GameArea.tsx            # Zone de jeu touchable
│   │
│   ├── distractors/
│   │   ├── Bee.tsx                 # Abeille distracteur
│   │   ├── Petal.tsx               # Pétale flottant
│   │   └── Dragonfly.tsx           # Libellule
│   │
│   ├── mascot/
│   │   ├── Flora.tsx               # Flora complète
│   │   ├── FloraWings.tsx          # Ailes de fée
│   │   ├── FloraBaguette.tsx       # Baguette magique
│   │   └── SpeechBubble.tsx        # Bulle dialogue
│   │
│   ├── backgrounds/
│   │   ├── TulipGarden.tsx         # Monde 1
│   │   ├── SunflowerField.tsx      # Monde 2
│   │   ├── TropicalForest.tsx      # Monde 3
│   │   ├── CherryBlossom.tsx       # Monde 4
│   │   └── EnchantedGarden.tsx     # Monde 5
│   │
│   └── feedback/
│       ├── CaptureEffect.tsx       # Effet capture réussie
│       ├── ErrorEffect.tsx         # Effet erreur
│       ├── VictoryOverlay.tsx      # Victoire
│       └── StarsBurst.tsx          # Étoiles animées
│
├── hooks/
│   ├── useChasseurGame.ts          # Hook principal
│   ├── useButterflyPhysics.ts      # Physique papillons
│   ├── useSequence.ts              # Gestion séquence
│   └── useCaptureDetection.ts      # Détection touches
│
├── logic/
│   ├── butterflyMovement.ts        # Algorithme mouvement
│   ├── collisionDetection.ts       # Détection collisions
│   └── difficultyScaling.ts        # Échelle difficulté
│
├── data/
│   ├── butterflies.ts              # Définitions papillons
│   ├── levels.ts                   # Configuration niveaux
│   ├── worlds.ts                   # Configuration mondes
│   └── dialogues.ts                # Scripts Flora
│
└── screens/
    ├── ChasseurIntroScreen.tsx
    ├── ChasseurGameScreen.tsx
    └── ChasseurVictoryScreen.tsx
```

---

## 🔷 Types TypeScript

```typescript
// types.ts

export type ButterflyColor = 
  | 'blue' | 'yellow' | 'pink' | 'green' 
  | 'orange' | 'purple' | 'red';

export interface ButterflyDefinition {
  id: ButterflyColor;
  name: string;
  hex: string;
  wingShape: 'rounded' | 'pointed' | 'wavy' | 'wide' | 'thin' | 'double' | 'heart';
  pattern: string;  // Pour accessibilité daltonien
}

export interface Butterfly {
  id: string;
  color: ButterflyColor;
  position: Position;
  velocity: Velocity;
  wingPhase: number;      // 0-1 pour animation
  scale: number;
  rotation: number;
  isTarget: boolean;
  isCaught: boolean;
  spawnTime: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  vx: number;
  vy: number;
}

export interface ChasseurLevel {
  id: string;
  worldId: number;
  levelNumber: number;
  
  butterflyCount: number;
  sequenceLength: number;
  timeLimit: number;
  
  speed: 'slow' | 'normal' | 'fast' | 'very_fast';
  
  distractors: {
    bees: number;
    petals: boolean;
    dragonflies: number;
  };
  
  stars3Criteria: {
    maxTime: number;
    maxErrors: number;
  };
  stars2Criteria: {
    maxTime: number;
    maxErrors: number;
  };
}

export interface GameState {
  butterflies: Butterfly[];
  sequence: ButterflyColor[];
  currentTargetIndex: number;
  caughtCount: number;
  errorCount: number;
  timeRemaining: number;
  score: number;
  
  isPlaying: boolean;
  isComplete: boolean;
  isWin: boolean;
  
  floraMessage: string;
  floraExpression: FloraExpression;
}

export type FloraExpression = 
  | 'neutral' | 'happy' | 'excited' | 'sad' | 'pointing';

export interface GameResult {
  success: boolean;
  stars: 0 | 1 | 2 | 3;
  caughtCount: number;
  errorCount: number;
  timeUsed: number;
  score: number;
}
```

---

## ⚙️ Physique des Papillons

```typescript
// logic/butterflyMovement.ts

interface ButterflyPhysicsConfig {
  speed: {
    slow: number;
    normal: number;
    fast: number;
    very_fast: number;
  };
  wobble: {
    amplitude: number;
    frequency: number;
  };
  bounds: {
    margin: number;
    bounceForce: number;
  };
}

const PHYSICS_CONFIG: ButterflyPhysicsConfig = {
  speed: {
    slow: 50,      // pixels/seconde
    normal: 100,
    fast: 150,
    very_fast: 200,
  },
  wobble: {
    amplitude: 30,  // pixels
    frequency: 2,   // oscillations/seconde
  },
  bounds: {
    margin: 50,     // marge des bords
    bounceForce: 0.8,
  },
};

export function updateButterflyPosition(
  butterfly: Butterfly,
  deltaTime: number,
  gameAreaSize: { width: number; height: number },
  speedSetting: 'slow' | 'normal' | 'fast' | 'very_fast'
): Butterfly {
  const baseSpeed = PHYSICS_CONFIG.speed[speedSetting];
  const time = Date.now() / 1000;
  
  // Mouvement de base
  let newX = butterfly.position.x + butterfly.velocity.vx * deltaTime;
  let newY = butterfly.position.y + butterfly.velocity.vy * deltaTime;
  
  // Ajout du wobble (oscillation naturelle)
  const wobbleOffset = Math.sin(time * PHYSICS_CONFIG.wobble.frequency * Math.PI * 2) 
    * PHYSICS_CONFIG.wobble.amplitude * deltaTime;
  newX += wobbleOffset * (butterfly.velocity.vy > 0 ? 1 : -1);
  
  // Rebond sur les bords
  const margin = PHYSICS_CONFIG.bounds.margin;
  let newVx = butterfly.velocity.vx;
  let newVy = butterfly.velocity.vy;
  
  if (newX < margin || newX > gameAreaSize.width - margin) {
    newVx *= -PHYSICS_CONFIG.bounds.bounceForce;
    newX = Math.max(margin, Math.min(newX, gameAreaSize.width - margin));
  }
  if (newY < margin || newY > gameAreaSize.height - margin) {
    newVy *= -PHYSICS_CONFIG.bounds.bounceForce;
    newY = Math.max(margin, Math.min(newY, gameAreaSize.height - margin));
  }
  
  // Légère attraction vers le centre (éviter les coins)
  const centerX = gameAreaSize.width / 2;
  const centerY = gameAreaSize.height / 2;
  const toCenterX = (centerX - newX) * 0.001;
  const toCenterY = (centerY - newY) * 0.001;
  newVx += toCenterX;
  newVy += toCenterY;
  
  // Normaliser la vitesse
  const currentSpeed = Math.sqrt(newVx * newVx + newVy * newVy);
  if (currentSpeed > 0) {
    newVx = (newVx / currentSpeed) * baseSpeed;
    newVy = (newVy / currentSpeed) * baseSpeed;
  }
  
  // Mettre à jour la phase des ailes
  const newWingPhase = (butterfly.wingPhase + deltaTime * 8) % 1;
  
  return {
    ...butterfly,
    position: { x: newX, y: newY },
    velocity: { vx: newVx, vy: newVy },
    wingPhase: newWingPhase,
    rotation: Math.atan2(newVy, newVx) * 0.3, // Légère inclinaison
  };
}
```

---

## 🎣 Hook Principal

```typescript
// hooks/useChasseurGame.ts

interface UseChasseurGameReturn {
  // État
  gameState: GameState;
  currentLevel: ChasseurLevel;
  
  // Papillons
  butterflies: Butterfly[];
  currentTarget: ButterflyColor | null;
  
  // Actions
  handleTap: (position: Position) => CaptureResult;
  startGame: () => void;
  pauseGame: () => void;
  resetGame: () => void;
  
  // Flora
  floraMessage: string;
  floraExpression: FloraExpression;
  
  // Queries
  isGameOver: boolean;
  isWin: boolean;
  potentialStars: number;
}

export function useChasseurGame(
  level: ChasseurLevel,
  onComplete: (result: GameResult) => void
): UseChasseurGameReturn {
  const [gameState, setGameState] = useState<GameState>(
    createInitialState(level)
  );
  
  // Animation loop pour les papillons
  useFrameCallback((frameInfo) => {
    if (!gameState.isPlaying) return;
    
    const deltaTime = frameInfo.timeSincePreviousFrame / 1000;
    
    setGameState(prev => {
      // Mettre à jour positions des papillons
      const updatedButterflies = prev.butterflies.map(b => 
        updateButterflyPosition(b, deltaTime, gameAreaSize, level.speed)
      );
      
      // Mettre à jour le timer
      const newTime = prev.timeRemaining - deltaTime;
      
      if (newTime <= 0) {
        // Temps écoulé = échec
        onComplete(calculateResult(prev, false));
        return { ...prev, isPlaying: false, isComplete: true, isWin: false };
      }
      
      return {
        ...prev,
        butterflies: updatedButterflies,
        timeRemaining: newTime,
      };
    });
  });
  
  const handleTap = useCallback((position: Position): CaptureResult => {
    const { butterflies, sequence, currentTargetIndex } = gameState;
    const targetColor = sequence[currentTargetIndex];
    
    // Trouver le papillon touché
    const tappedButterfly = butterflies.find(b => 
      !b.isCaught && isPointInButterfly(position, b)
    );
    
    if (!tappedButterfly) {
      return { success: false, reason: 'miss' };
    }
    
    if (tappedButterfly.color === targetColor) {
      // Capture réussie !
      const newCaughtCount = gameState.caughtCount + 1;
      const isComplete = newCaughtCount >= sequence.length;
      
      setGameState(prev => ({
        ...prev,
        butterflies: prev.butterflies.map(b => 
          b.id === tappedButterfly.id ? { ...b, isCaught: true } : b
        ),
        currentTargetIndex: prev.currentTargetIndex + 1,
        caughtCount: newCaughtCount,
        score: prev.score + calculateCaptureScore(prev.timeRemaining),
        floraMessage: getEncouragementMessage(),
        floraExpression: 'happy',
      }));
      
      if (isComplete) {
        onComplete(calculateResult(gameState, true));
      }
      
      return { success: true, butterfly: tappedButterfly };
    } else {
      // Mauvais papillon
      setGameState(prev => ({
        ...prev,
        errorCount: prev.errorCount + 1,
        floraMessage: getErrorMessage(targetColor),
        floraExpression: 'sad',
      }));
      
      return { success: false, reason: 'wrong_color' };
    }
  }, [gameState, onComplete]);
  
  return {
    gameState,
    currentLevel: level,
    butterflies: gameState.butterflies,
    currentTarget: gameState.sequence[gameState.currentTargetIndex] || null,
    handleTap,
    startGame: () => setGameState(prev => ({ ...prev, isPlaying: true })),
    pauseGame: () => setGameState(prev => ({ ...prev, isPlaying: false })),
    resetGame: () => setGameState(createInitialState(level)),
    floraMessage: gameState.floraMessage,
    floraExpression: gameState.floraExpression,
    isGameOver: gameState.isComplete,
    isWin: gameState.isWin,
    potentialStars: calculatePotentialStars(gameState, level),
  };
}
```

---

## 🎨 Constantes Visuelles

```typescript
// constants/chasseurTheme.ts

export const CHASSEUR_COLORS = {
  // Fonds
  skyBlue: '#87CEEB',
  grassGreen: '#A8E6CF',
  
  // Flora
  floraDress: '#FFB7C5',
  floraWings: 'rgba(255,255,255,0.6)',
  floraBaguette: '#FFD93D',
  
  // Papillons
  butterfly: {
    blue: '#3498DB',
    yellow: '#F1C40F',
    pink: '#E91E8C',
    green: '#27AE60',
    orange: '#E67E22',
    purple: '#9B59B6',
    red: '#E74C3C',
  },
  
  // UI
  sequenceActive: '#FFD93D',
  sequenceComplete: '#27AE60',
  sequencePending: 'rgba(255,255,255,0.5)',
  
  // Texte
  textPrimary: '#2D5A27',
  textSecondary: '#5A8F5A',
};

export const CHASSEUR_SIZES = {
  // Papillons
  butterflyWidth: 80,
  butterflyHeight: 60,
  butterflyHitbox: 100, // Zone de tap élargie
  
  // Flora
  floraWidth: 120,
  floraHeight: 160,
  
  // Séquence
  sequenceSlotSize: 50,
  sequenceGap: 12,
  
  // Effets
  captureRingSize: 120,
};

export const CHASSEUR_ANIMATIONS = {
  wingFlap: {
    duration: 150, // ms par frame
    frames: 4,
  },
  capture: {
    duration: 400,
    scale: 1.5,
    rotation: 720,
  },
  error: {
    duration: 300,
    shakeAmount: 10,
  },
};
```

---

## 📊 Données des Papillons

```typescript
// data/butterflies.ts

export const BUTTERFLIES: ButterflyDefinition[] = [
  {
    id: 'blue',
    name: 'Bleu Ciel',
    hex: '#3498DB',
    wingShape: 'rounded',
    pattern: 'stripes',
  },
  {
    id: 'yellow',
    name: 'Jaune Citron',
    hex: '#F1C40F',
    wingShape: 'pointed',
    pattern: 'dots',
  },
  {
    id: 'pink',
    name: 'Rose Bonbon',
    hex: '#E91E8C',
    wingShape: 'wavy',
    pattern: 'checker',
  },
  {
    id: 'green',
    name: 'Vert Prairie',
    hex: '#27AE60',
    wingShape: 'wide',
    pattern: 'lines',
  },
  {
    id: 'orange',
    name: 'Orange Soleil',
    hex: '#E67E22',
    wingShape: 'thin',
    pattern: 'zigzag',
  },
  {
    id: 'purple',
    name: 'Violet Lavande',
    hex: '#9B59B6',
    wingShape: 'double',
    pattern: 'stars',
  },
  {
    id: 'red',
    name: 'Rouge Coquelicot',
    hex: '#E74C3C',
    wingShape: 'heart',
    pattern: 'waves',
  },
];

export function getButterflyById(id: ButterflyColor): ButterflyDefinition {
  return BUTTERFLIES.find(b => b.id === id)!;
}
```

---

## ✅ Checklist Développement

### Phase 1 : Core (3 jours)
- [ ] Types TypeScript
- [ ] Physique papillons (mouvement, rebond)
- [ ] Hook useChasseurGame
- [ ] Détection capture (tap)
- [ ] Gestion séquence

### Phase 2 : UI (4 jours)
- [ ] Composant Butterfly animé
- [ ] Barre de séquence
- [ ] Flora mascotte
- [ ] 5 fonds de mondes
- [ ] Effets visuels (capture, erreur)

### Phase 3 : Modes (3 jours)
- [ ] Mode Classique
- [ ] Mode Infini
- [ ] Mode Memory
- [ ] Mode Arc-en-ciel
- [ ] Mode Zen

### Phase 4 : Niveaux (3 jours)
- [ ] 60 niveaux (12 × 5 mondes)
- [ ] Distracteurs (abeilles, pétales)
- [ ] Système d'étoiles
- [ ] Badges et récompenses

### Phase 5 : Polish (2 jours)
- [ ] Sons et musique
- [ ] Accessibilité (formes, contrastes)
- [ ] Optimisation performance
- [ ] Tests

---

*Spécifications Techniques v1.0 — Chasseur de Papillons*
