# BRIEF REACT NATIVE : Écran Victoire
## Chasseur de Papillons - ChasseurVictoryScreen

---

## 📋 Informations Générales

| Propriété | Valeur |
|-----------|--------|
| **Fichier** | `src/games/chasseur-papillons/screens/ChasseurVictoryScreen.tsx` |
| **Prototype HTML** | `chasseur-victory.html` |
| **Type** | Modal transparent |

---

## 🏗️ Hiérarchie des Composants

```
ChasseurVictoryScreen
├── BlurredOverlay
│
├── FallingPetals (×10)
├── FlyingButterflies (×4)
├── SparkleStars (×4)
│
└── VictoryCard
    ├── RecordBadge?
    │
    ├── FloraVictory
    │   ├── Wings (flutter rapide)
    │   ├── Head + HappyEyes
    │   ├── Dress
    │   ├── WavingArms
    │   └── Baguette (burst)
    │
    ├── TitleSection
    ├── CapturedDisplay (3 papillons)
    ├── StarsEarned (×3)
    ├── StatsRow (4 stats)
    ├── FloraMessage
    ├── UnlockSection?
    └── ActionButtons (3)
```

---

## 🎨 Design Tokens

```typescript
const VICTORY_COLORS = {
  overlay: 'rgba(0,0,0,0.5)',
  cardBg: ['rgba(255,255,255,0.95)', 'rgba(255,247,230,0.95)'],
  cardBorder: '#FFB7C5',
  
  petals: ['#FFB7C5', '#FF91A4', '#F8B4D9'],
  stars: '#FFD93D',
  unlock: '#27AE60',
};
```

---

## 🎬 Animations

### 1. Petal Fall
```typescript
const petalY = useSharedValue(-50);
const petalRotation = useSharedValue(0);

useEffect(() => {
  petalY.value = withDelay(
    index * 300,
    withTiming(900, { duration: 5000, easing: Easing.linear })
  );
  petalRotation.value = withDelay(
    index * 300,
    withTiming(360, { duration: 5000, easing: Easing.linear })
  );
}, []);
```

### 2. Butterfly Celebrate
```typescript
const butterflyX = useSharedValue(0);
const butterflyY = useSharedValue(0);
const butterflyRotation = useSharedValue(-10);

useEffect(() => {
  butterflyX.value = withRepeat(
    withSequence(
      withTiming(30, { duration: 1000 }),
      withTiming(60, { duration: 1000 }),
      withTiming(30, { duration: 1000 }),
      withTiming(0, { duration: 1000 })
    ), -1, true
  );
  butterflyY.value = withRepeat(
    withSequence(
      withTiming(-20, { duration: 1000 }),
      withTiming(0, { duration: 1000 }),
      withTiming(20, { duration: 1000 }),
      withTiming(0, { duration: 1000 })
    ), -1, true
  );
}, []);
```

### 3. Card Bounce
```typescript
const cardScale = useSharedValue(0.8);
const cardOpacity = useSharedValue(0);

useEffect(() => {
  cardScale.value = withDelay(100, withSpring(1, { damping: 12 }));
  cardOpacity.value = withDelay(100, withTiming(1, { duration: 300 }));
}, []);
```

### 4. Flora Jump
```typescript
const floraY = useSharedValue(0);

useEffect(() => {
  floraY.value = withRepeat(
    withSequence(
      withTiming(-20, { duration: 300, easing: Easing.out(Easing.ease) }),
      withTiming(0, { duration: 300, easing: Easing.in(Easing.ease) })
    ), -1, true
  );
}, []);
```

### 5. Arm Wave
```typescript
const leftArmRotation = useSharedValue(-45);
const rightArmRotation = useSharedValue(45);

useEffect(() => {
  leftArmRotation.value = withRepeat(
    withSequence(
      withTiming(-70, { duration: 150 }),
      withTiming(-45, { duration: 150 })
    ), -1, true
  );
  rightArmRotation.value = withRepeat(
    withSequence(
      withTiming(70, { duration: 150 }),
      withTiming(45, { duration: 150 })
    ), -1, true
  );
}, []);
```

### 6. Captured Butterfly Pop
```typescript
capturedButterflies.forEach((_, i) => {
  scales[i].value = withDelay(
    300 + i * 200,
    withSpring(1, { damping: 10 })
  );
});
```

### 7. Star Spin
```typescript
stars.forEach((_, i) => {
  starScales[i].value = withDelay(
    900 + i * 200,
    withSpring(1, { damping: 8, stiffness: 150 })
  );
  starRotations[i].value = withDelay(
    900 + i * 200,
    withSpring(0, { damping: 12 })
  );
});
```

---

## 📦 Composants

### FloraVictory
```typescript
const FloraVictory: React.FC = () => {
  const floraY = useSharedValue(0);
  const leftArm = useSharedValue(-45);
  const rightArm = useSharedValue(45);
  const wingRotateY = useSharedValue(0);
  
  // Jump animation
  useEffect(() => {
    floraY.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: 300 }),
        withTiming(0, { duration: 300 })
      ), -1, true
    );
  }, []);
  
  // Fast wing flutter
  useEffect(() => {
    wingRotateY.value = withRepeat(
      withSequence(
        withTiming(40, { duration: 100 }),
        withTiming(0, { duration: 100 })
      ), -1, true
    );
  }, []);
  
  // Arm wave
  useEffect(() => {
    leftArm.value = withRepeat(
      withSequence(
        withTiming(-70, { duration: 150 }),
        withTiming(-45, { duration: 150 })
      ), -1, true
    );
  }, []);
  
  return (
    <Animated.View style={[styles.flora, jumpStyle]}>
      <View style={styles.wings}>
        <Animated.View style={[styles.wing, styles.left, wingStyle]} />
        <Animated.View style={[styles.wing, styles.right, wingStyle]} />
      </View>
      <View style={styles.body}>
        <View style={styles.head}>
          <View style={styles.hair} />
          <View style={styles.happyEyes}>
            <View style={styles.happyEye} />
            <View style={styles.happyEye} />
          </View>
          <View style={styles.bigSmile} />
        </View>
        <View style={styles.dress}>
          <Animated.View style={[styles.arm, styles.left, armLStyle]} />
          <Animated.View style={[styles.arm, styles.right, armRStyle]}>
            <View style={styles.baguette}>
              <Animated.Text style={styles.sparkle}>✨</Animated.Text>
            </View>
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );
};
```

### CapturedDisplay
```typescript
const CapturedDisplay: React.FC<{ colors: ButterflyColor[] }> = ({ colors }) => (
  <View style={styles.capturedContainer}>
    <Text style={styles.capturedLabel}>PAPILLONS ATTRAPÉS</Text>
    <View style={styles.capturedRow}>
      {colors.map((color, i) => (
        <Animated.View
          key={i}
          style={[
            styles.capturedButterfly,
            { backgroundColor: BUTTERFLY_COLORS[color][0] },
            capturedStyles[i],
          ]}
        >
          <Text style={styles.butterflyEmoji}>🦋</Text>
        </Animated.View>
      ))}
    </View>
  </View>
);
```

---

## 🔊 Sons

| Événement | Fichier | Délai |
|-----------|---------|-------|
| Ouverture | `victory_fanfare.mp3` | 0ms |
| Papillon 1 | `pop_1.mp3` | 300ms |
| Papillon 2 | `pop_2.mp3` | 500ms |
| Papillon 3 | `pop_3.mp3` | 700ms |
| Étoile 1 | `star_1.mp3` | 900ms |
| Étoile 2 | `star_2.mp3` | 1100ms |
| Étoile 3 | `star_3.mp3` | 1300ms |
| Déblocage | `unlock.mp3` | 1500ms |

---

## ✅ Checklist

- [ ] Overlay avec blur
- [ ] Pétales tombants
- [ ] Papillons volants décoratifs
- [ ] Étoiles scintillantes
- [ ] Carte avec bounce
- [ ] Flora qui saute et agite les bras
- [ ] Papillons capturés animés
- [ ] Étoiles avec spin
- [ ] Stats row
- [ ] Message Flora contextuel
- [ ] Section déblocage conditionnelle
- [ ] 3 boutons

---

*Brief v1.0 — ChasseurVictoryScreen*
