# BRIEF REACT NATIVE : Écran de Jeu
## Chasseur de Papillons - ChasseurGameScreen

---

## 📋 Informations Générales

| Propriété | Valeur |
|-----------|--------|
| **Fichier** | `src/games/chasseur-papillons/screens/ChasseurGameScreen.tsx` |
| **Prototype HTML** | `chasseur-game.html` |
| **Priorité** | Critique |

---

## 🏗️ Hiérarchie des Composants

```
ChasseurGameScreen
├── PrairieBackground
│   ├── Sun
│   ├── Clouds
│   ├── Sunflowers
│   └── Grass
│
├── Header
│   ├── BackButton
│   ├── LevelInfo (WorldBadge + Level)
│   ├── SequenceBar
│   │   └── SequenceSlot (×3-5)
│   ├── Timer
│   └── StarsDisplay
│
├── GameArea (touchable)
│   ├── Butterfly (×5-8)
│   │   ├── Antennae
│   │   ├── Wings (animated)
│   │   └── Body
│   └── Bee (distracteur)
│
└── BottomZone
    ├── MascotZone
    │   ├── FloraMini
    │   └── MascotSpeech
    └── StatsZone (3 boxes)
```

---

## 🎨 Design Tokens

```typescript
const GAME_COLORS = {
  butterfly: {
    blue: ['#3498DB', '#5DADE2'],
    yellow: ['#F1C40F', '#F9E79F'],
    pink: ['#E91E8C', '#F48FB1'],
    green: ['#27AE60', '#58D68D'],
    orange: ['#E67E22', '#F5B041'],
  },
  sequence: {
    completed: '#27AE60',
    current: '#FFD93D',
    pending: 'rgba(255,255,255,0.5)',
  },
};

const GAME_SIZES = {
  butterflyWidth: 80,
  butterflyHeight: 60,
  butterflyHitbox: 100,
  sequenceSlotSize: 55,
};
```

---

## 🎬 Animations Clés

### 1. Butterfly Movement (Worklet)
```typescript
const updatePosition = (
  x: SharedValue<number>,
  y: SharedValue<number>,
  vx: SharedValue<number>,
  vy: SharedValue<number>,
  bounds: { width: number; height: number }
) => {
  'worklet';
  // Mise à jour position + wobble + rebond bords
};

useFrameCallback(() => {
  butterflies.forEach(b => updatePosition(b.x, b.y, b.vx, b.vy, bounds));
});
```

### 2. Wing Flap
```typescript
const wingRotateY = useSharedValue(0);
useEffect(() => {
  wingRotateY.value = withRepeat(
    withSequence(
      withTiming(50, { duration: 75 }),
      withTiming(0, { duration: 75 })
    ), -1, true
  );
}, []);
```

### 3. Capture Effect
```typescript
const captureButterfly = (id: string) => {
  const scale = butterflyScales[id];
  const rotation = butterflyRotations[id];
  const opacity = butterflyOpacities[id];
  
  scale.value = withTiming(1.5, { duration: 200 });
  rotation.value = withTiming(720, { duration: 400 });
  opacity.value = withDelay(200, withTiming(0, { duration: 200 }));
};
```

### 4. Target Highlight
```typescript
const targetPulse = useSharedValue(1);
useEffect(() => {
  targetPulse.value = withRepeat(
    withSequence(
      withTiming(1.1, { duration: 500 }),
      withTiming(1, { duration: 500 })
    ), -1, true
  );
}, [currentTarget]);
```

### 5. Timer Warning
```typescript
const timerColor = useDerivedValue(() => {
  return timeRemaining.value < 10 ? '#E74C3C' : '#2D5A27';
});
```

---

## 📦 Composants Clés

### Butterfly
```typescript
interface ButterflyProps {
  id: string;
  color: ButterflyColor;
  position: SharedValue<Position>;
  isTarget: boolean;
  onCapture: () => void;
}

const Butterfly: React.FC<ButterflyProps> = ({
  id, color, position, isTarget, onCapture
}) => {
  const wingRotateY = useSharedValue(0);
  const scale = useSharedValue(1);
  
  // Wing animation
  useEffect(() => {
    wingRotateY.value = withRepeat(
      withSequence(
        withTiming(50, { duration: 75 }),
        withTiming(0, { duration: 75 })
      ), -1, true
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: position.value.x },
      { translateY: position.value.y },
      { scale: scale.value },
    ],
  }));
  
  const wingStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${wingRotateY.value}deg` }],
  }));
  
  return (
    <Pressable onPress={onCapture}>
      <Animated.View style={[styles.butterfly, animatedStyle]}>
        {isTarget && <TargetHighlight />}
        <View style={styles.antennae}>
          <View style={styles.antenna} />
          <View style={styles.antenna} />
        </View>
        <Animated.View style={[styles.wing, styles.wingLeft, { backgroundColor: COLORS[color][0] }, wingStyle]} />
        <Animated.View style={[styles.wing, styles.wingRight, { backgroundColor: COLORS[color][0] }, wingStyle]} />
        <View style={styles.body} />
      </Animated.View>
    </Pressable>
  );
};
```

### SequenceBar
```typescript
const SequenceBar: React.FC<{
  sequence: ButterflyColor[];
  currentIndex: number;
}> = ({ sequence, currentIndex }) => (
  <View style={styles.sequenceBar}>
    {sequence.map((color, i) => (
      <React.Fragment key={i}>
        {i > 0 && <Text style={styles.arrow}>→</Text>}
        <SequenceSlot
          color={color}
          status={i < currentIndex ? 'completed' : i === currentIndex ? 'current' : 'pending'}
        />
      </React.Fragment>
    ))}
  </View>
);
```

---

## 🔊 Sons

| Action | Fichier |
|--------|---------|
| Capture correcte | `capture_success.mp3` |
| Mauvais papillon | `wrong_butterfly.mp3` |
| Abeille touchée | `bee_buzz.mp3` |
| Timer warning | `timer_beep.mp3` |
| Niveau terminé | `level_complete.mp3` |

---

## 🎯 Gestion des Touches

```typescript
const handleTap = useCallback((event: GestureEvent) => {
  const { x, y } = event.nativeEvent;
  
  // Vérifier collision avec chaque papillon
  for (const butterfly of butterflies) {
    if (isPointInHitbox({ x, y }, butterfly.position.value, HITBOX_SIZE)) {
      if (butterfly.color === sequence[currentIndex]) {
        // Capture réussie
        captureButterfly(butterfly.id);
        playSound('success');
        setCurrentIndex(prev => prev + 1);
      } else {
        // Mauvais papillon
        playSound('wrong');
        setErrorCount(prev => prev + 1);
        shakeButterfly(butterfly.id);
      }
      return;
    }
  }
  
  // Vérifier abeille
  if (bee && isPointInHitbox({ x, y }, bee.position.value, HITBOX_SIZE)) {
    playSound('bee');
    setErrorCount(prev => prev + 1);
  }
}, [butterflies, sequence, currentIndex, bee]);
```

---

## ✅ Checklist

- [ ] Fond prairie avec tournesols
- [ ] Papillons avec ailes animées
- [ ] Physique de mouvement (worklet)
- [ ] Détection de capture
- [ ] Barre de séquence
- [ ] Timer avec warning
- [ ] Flora mini avec messages
- [ ] Abeille distracteur
- [ ] Effets de capture/erreur
- [ ] Sons

---

*Brief v1.0 — ChasseurGameScreen*
