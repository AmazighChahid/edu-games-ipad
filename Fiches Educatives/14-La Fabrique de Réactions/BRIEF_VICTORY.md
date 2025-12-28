# BRIEF REACT NATIVE : Écran Victoire
## La Fabrique de Réactions - FabriqueVictoryScreen

---

## 📋 Informations Générales

| Propriété | Valeur |
|-----------|--------|
| **Fichier** | `src/games/fabrique-reactions/screens/FabriqueVictoryScreen.tsx` |
| **Type** | Modal Screen Component |
| **Prototype HTML** | `fabrique-victoire.html` |
| **Priorité** | Haute |

---

## 🏗️ Hiérarchie des Composants

```
FabriqueVictoryScreen
├── BlurredOverlay                    # Fond flouté semi-transparent
│
├── ConfettiSystem                    # Système de confettis
│   └── Confetti (×20+)               # Particules individuelles
│
├── SparkleSystem                     # Étincelles
│   └── Sparkle (×6)                  # Points lumineux
│
├── LightRays                         # Rayons de lumière rotatifs
│
└── VictoryCard                       # Carte principale
    ├── DecorativeGears               # Engrenages décoratifs
    ├── NewRecordBadge?               # Badge nouveau record
    │
    ├── GedeonVictory                 # Gédéon qui célèbre
    │   ├── Body
    │   ├── Arms (animés)
    │   ├── HappyEyes
    │   └── StarBursts
    │
    ├── TitleSection
    │   ├── VictoryTitle              # "BRAVO !"
    │   └── VictorySubtitle           # "Niveau X complété !"
    │
    ├── StarsEarned                   # Étoiles gagnées (×3)
    │
    ├── StatsRow                      # Stats (essais, temps, indices)
    │
    ├── GedeonMessage                 # Message personnalisé
    │
    ├── UnlockSection?                # Déblocage (si applicable)
    │
    └── ActionButtons
        ├── MenuButton                # Retour menu
        ├── ReplayButton              # Rejouer
        └── NextButton                # Niveau suivant
```

---

## 🎨 Design Tokens

### Couleurs Victory

```typescript
const VICTORY_COLORS = {
  // Overlay
  overlayBg: 'rgba(0,0,0,0.6)',
  
  // Card
  cardBg: '#FFFFFF',
  
  // Confettis
  confettiColors: ['#F1C40F', '#E74C3C', '#3498DB', '#27AE60', '#9B59B6', '#E67E22', '#1ABC9C'],
  
  // Sparkles
  sparkleColor: '#FFD93D',
  sparkleGlow: '#F1C40F',
  
  // Text gradient
  titleGradientStart: '#F1C40F',
  titleGradientEnd: '#E67E22',
  
  // Stars
  starActive: '#F1C40F',
  starInactive: 'rgba(241, 196, 15, 0.25)',
  
  // Buttons
  btnMenu: 'rgba(74, 55, 40, 0.1)',
  btnMenuBorder: '#D4A574',
  btnReplay: '#3498DB',
  btnNext: '#27AE60',
  
  // Unlock
  unlockBg: 'rgba(46, 204, 113, 0.1)',
  unlockBorder: '#27AE60',
  
  // Record badge
  recordBg: '#E74C3C',
  
  // Light rays
  rayColor: 'rgba(241, 196, 15, 0.1)',
};
```

### Dimensions Victory

```typescript
const VICTORY_SIZES = {
  // Card
  cardMaxWidth: 700,
  cardPaddingH: 60,
  cardPaddingV: 40,
  cardRadius: 32,
  
  // Gédéon
  gedeonWidth: 160,
  gedeonHeight: 180,
  gedeonMarginTop: -80, // Dépasse du haut de la carte
  
  // Stars
  starSize: 80,
  starFontSize: 50,
  starGap: 20,
  
  // Stats
  statIconSize: 32,
  statValueSize: 28,
  
  // Buttons
  btnPaddingV: 16,
  btnPaddingH: 36,
  btnRadius: 18,
  btnGap: 20,
  
  // Gear deco
  gearSize: 60,
  gearOffset: -30,
};
```

---

## 📱 Props Interface

```typescript
interface FabriqueVictoryScreenProps {
  result: LevelResult;
  levelConfig: LevelConfig;
  childName: string;
  isNewRecord: boolean;
  unlockedItem?: UnlockedItem;
  onMenu: () => void;
  onReplay: () => void;
  onNextLevel: () => void;
}

interface LevelResult {
  success: boolean;
  stars: 1 | 2 | 3;
  moves: number;
  hintsUsed: number;
  time: number; // en secondes
}

interface UnlockedItem {
  type: 'element' | 'badge' | 'card';
  id: string;
  name: string;
  emoji: string;
}
```

---

## 🎬 Animations Reanimated 3

### 1. Card Entrance (Spring Pop)

```typescript
const cardScale = useSharedValue(0.8);
const cardOpacity = useSharedValue(0);

useEffect(() => {
  cardScale.value = withDelay(
    100,
    withSpring(1, { 
      damping: 12, 
      stiffness: 150,
      mass: 0.8 
    })
  );
  cardOpacity.value = withDelay(
    100,
    withTiming(1, { duration: 300 })
  );
}, []);

const cardStyle = useAnimatedStyle(() => ({
  transform: [{ scale: cardScale.value }],
  opacity: cardOpacity.value,
}));
```

### 2. Gédéon Jump Animation

```typescript
const gedeonY = useSharedValue(0);

useEffect(() => {
  gedeonY.value = withRepeat(
    withSequence(
      withTiming(-20, { duration: 400, easing: Easing.out(Easing.ease) }),
      withTiming(0, { duration: 400, easing: Easing.in(Easing.ease) })
    ),
    -1,
    true
  );
}, []);

const gedeonStyle = useAnimatedStyle(() => ({
  transform: [{ translateY: gedeonY.value }],
}));
```

### 3. Arm Wave Animation

```typescript
const leftArmRotation = useSharedValue(-30);
const rightArmRotation = useSharedValue(30);

useEffect(() => {
  leftArmRotation.value = withRepeat(
    withSequence(
      withTiming(-50, { duration: 250 }),
      withTiming(-30, { duration: 250 })
    ),
    -1,
    true
  );
  
  rightArmRotation.value = withRepeat(
    withSequence(
      withTiming(50, { duration: 250 }),
      withTiming(30, { duration: 250 })
    ),
    -1,
    true
  );
}, []);

const leftArmStyle = useAnimatedStyle(() => ({
  transform: [{ rotate: `${leftArmRotation.value}deg` }],
}));

const rightArmStyle = useAnimatedStyle(() => ({
  transform: [{ rotate: `${rightArmRotation.value}deg` }],
}));
```

### 4. Title Bounce

```typescript
const titleScale = useSharedValue(0);

useEffect(() => {
  titleScale.value = withDelay(
    300,
    withSpring(1, { damping: 8, stiffness: 150 })
  );
}, []);

const titleStyle = useAnimatedStyle(() => ({
  transform: [{ scale: titleScale.value }],
}));
```

### 5. Stars Reveal (Staggered)

```typescript
const createStarAnimation = (index: number, isEarned: boolean) => {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(-180);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    const delay = 500 + (index * 200); // 500ms, 700ms, 900ms
    
    scale.value = withDelay(
      delay,
      withSpring(1, { damping: 10, stiffness: 150 })
    );
    rotation.value = withDelay(
      delay,
      withSpring(0, { damping: 12, stiffness: 100 })
    );
    opacity.value = withDelay(
      delay,
      withTiming(isEarned ? 1 : 0.25, { duration: 200 })
    );
  }, []);
  
  return useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));
};
```

### 6. Stats Fade In

```typescript
const statsOpacity = useSharedValue(0);
const statsY = useSharedValue(20);

useEffect(() => {
  const delay = 1100;
  
  statsOpacity.value = withDelay(
    delay,
    withTiming(1, { duration: 300 })
  );
  statsY.value = withDelay(
    delay,
    withSpring(0, { damping: 15 })
  );
}, []);

const statsStyle = useAnimatedStyle(() => ({
  opacity: statsOpacity.value,
  transform: [{ translateY: statsY.value }],
}));
```

### 7. Unlock Section Slide

```typescript
const unlockOpacity = useSharedValue(0);
const unlockY = useSharedValue(20);
const unlockIconScale = useSharedValue(0);

useEffect(() => {
  unlockOpacity.value = withDelay(
    1200,
    withTiming(1, { duration: 300 })
  );
  unlockY.value = withDelay(
    1200,
    withSpring(0, { damping: 15 })
  );
  unlockIconScale.value = withDelay(
    1400,
    withSpring(1, { damping: 8, stiffness: 150 })
  );
}, []);

const unlockStyle = useAnimatedStyle(() => ({
  opacity: unlockOpacity.value,
  transform: [{ translateY: unlockY.value }],
}));

const unlockIconStyle = useAnimatedStyle(() => ({
  transform: [{ scale: unlockIconScale.value }],
}));
```

### 8. Buttons Appear

```typescript
const buttonsOpacity = useSharedValue(0);
const buttonsY = useSharedValue(20);

useEffect(() => {
  buttonsOpacity.value = withDelay(
    1000,
    withTiming(1, { duration: 300 })
  );
  buttonsY.value = withDelay(
    1000,
    withSpring(0, { damping: 15 })
  );
}, []);

const buttonsStyle = useAnimatedStyle(() => ({
  opacity: buttonsOpacity.value,
  transform: [{ translateY: buttonsY.value }],
}));
```

### 9. Confetti System

```typescript
interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  rotation: number;
  isCircle: boolean;
}

const generateConfetti = (count: number): ConfettiPiece[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100, // % position
    color: VICTORY_COLORS.confettiColors[i % VICTORY_COLORS.confettiColors.length],
    delay: Math.random() * 500,
    duration: 3000 + Math.random() * 1000,
    rotation: Math.random() * 720,
    isCircle: Math.random() > 0.5,
  }));
};

const ConfettiPiece: React.FC<{ piece: ConfettiPiece }> = ({ piece }) => {
  const translateY = useSharedValue(-100);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    opacity.value = withDelay(
      piece.delay,
      withTiming(1, { duration: 100 })
    );
    translateY.value = withDelay(
      piece.delay,
      withTiming(900, { 
        duration: piece.duration,
        easing: Easing.out(Easing.quad)
      })
    );
    rotation.value = withDelay(
      piece.delay,
      withTiming(piece.rotation, { duration: piece.duration })
    );
  }, []);
  
  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    left: `${piece.x}%`,
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));
  
  return (
    <Animated.View
      style={[
        style,
        {
          width: 12,
          height: 12,
          backgroundColor: piece.color,
          borderRadius: piece.isCircle ? 6 : 0,
        },
      ]}
    />
  );
};
```

### 10. Sparkle Animation

```typescript
const Sparkle: React.FC<{ x: number; y: number; delay: number }> = ({ x, y, delay }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    const animate = () => {
      scale.value = withDelay(
        delay,
        withSequence(
          withTiming(1.5, { duration: 300 }),
          withTiming(0, { duration: 300 })
        )
      );
      opacity.value = withDelay(
        delay,
        withSequence(
          withTiming(1, { duration: 200 }),
          withTiming(0, { duration: 400 })
        )
      );
      
      // Loop
      setTimeout(animate, 2000);
    };
    
    animate();
  }, []);
  
  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    left: `${x}%`,
    top: `${y}%`,
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  
  return (
    <Animated.View
      style={[
        style,
        {
          width: 8,
          height: 8,
          backgroundColor: VICTORY_COLORS.sparkleColor,
          borderRadius: 4,
          shadowColor: VICTORY_COLORS.sparkleGlow,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 15,
        },
      ]}
    />
  );
};
```

### 11. Light Rays Rotation

```typescript
const rayRotation = useSharedValue(0);

useEffect(() => {
  rayRotation.value = withRepeat(
    withTiming(360, { duration: 30000, easing: Easing.linear }),
    -1,
    false
  );
}, []);

const raysStyle = useAnimatedStyle(() => ({
  transform: [{ rotate: `${rayRotation.value}deg` }],
}));
```

### 12. Record Badge Wiggle

```typescript
const badgeRotation = useSharedValue(15);

useEffect(() => {
  badgeRotation.value = withRepeat(
    withSequence(
      withTiming(10, { duration: 500 }),
      withTiming(15, { duration: 500 })
    ),
    -1,
    true
  );
}, []);

const badgeStyle = useAnimatedStyle(() => ({
  transform: [{ rotate: `${badgeRotation.value}deg` }],
}));
```

### 13. Decorative Gears Spin

```typescript
const gear1Rotation = useSharedValue(0);
const gear2Rotation = useSharedValue(0);

useEffect(() => {
  gear1Rotation.value = withRepeat(
    withTiming(360, { duration: 8000, easing: Easing.linear }),
    -1,
    false
  );
  gear2Rotation.value = withRepeat(
    withTiming(-360, { duration: 8000, easing: Easing.linear }),
    -1,
    false
  );
}, []);

const gear1Style = useAnimatedStyle(() => ({
  transform: [{ rotate: `${gear1Rotation.value}deg` }],
  opacity: 0.15,
}));

const gear2Style = useAnimatedStyle(() => ({
  transform: [{ rotate: `${gear2Rotation.value}deg` }],
  opacity: 0.15,
}));
```

---

## 📦 Composants

### VictoryCard

```typescript
const VictoryCard: React.FC<VictoryCardProps> = ({
  result,
  levelConfig,
  childName,
  isNewRecord,
  unlockedItem,
  onMenu,
  onReplay,
  onNextLevel,
}) => {
  return (
    <Animated.View style={[styles.card, cardStyle]}>
      {/* Gears décoratives */}
      <Animated.Text style={[styles.gearDeco, styles.gear1, gear1Style]}>⚙️</Animated.Text>
      <Animated.Text style={[styles.gearDeco, styles.gear2, gear2Style]}>⚙️</Animated.Text>
      
      {/* Badge record */}
      {isNewRecord && (
        <Animated.View style={[styles.recordBadge, badgeStyle]}>
          <Text style={styles.recordText}>🏆 NOUVEAU RECORD !</Text>
        </Animated.View>
      )}
      
      {/* Gédéon */}
      <GedeonVictory />
      
      {/* Titre */}
      <Animated.View style={titleStyle}>
        <Text style={styles.title}>🎉 BRAVO ! 🎉</Text>
        <Text style={styles.subtitle}>
          Niveau {levelConfig.levelNumber} complété !
        </Text>
      </Animated.View>
      
      {/* Étoiles */}
      <View style={styles.starsRow}>
        {[1, 2, 3].map((star) => (
          <AnimatedStar
            key={star}
            index={star - 1}
            isEarned={star <= result.stars}
          />
        ))}
      </View>
      
      {/* Stats */}
      <Animated.View style={[styles.statsRow, statsStyle]}>
        <StatItem icon="🔄" value={result.moves} label="essais" />
        <StatItem icon="⏱️" value={formatTime(result.time)} label="temps" />
        <StatItem icon="💡" value={result.hintsUsed} label="indices" />
      </Animated.View>
      
      {/* Message Gédéon */}
      <View style={styles.messageBox}>
        <Text style={styles.messageText}>
          {getVictoryMessage(result, childName)}
        </Text>
      </View>
      
      {/* Déblocage */}
      {unlockedItem && (
        <Animated.View style={[styles.unlockSection, unlockStyle]}>
          <Animated.View style={[styles.unlockIcon, unlockIconStyle]}>
            <Text style={styles.unlockEmoji}>🔓</Text>
          </Animated.View>
          <View style={styles.unlockInfo}>
            <Text style={styles.unlockTitle}>
              {unlockedItem.type === 'element' && 'Nouvel élément débloqué !'}
              {unlockedItem.type === 'badge' && 'Nouveau badge !'}
              {unlockedItem.type === 'card' && 'Nouvelle carte !'}
            </Text>
            <Text style={styles.unlockName}>
              {unlockedItem.emoji} {unlockedItem.name}
            </Text>
          </View>
        </Animated.View>
      )}
      
      {/* Boutons */}
      <Animated.View style={[styles.buttonsRow, buttonsStyle]}>
        <ActionButton
          variant="secondary"
          icon="🏠"
          label="Menu"
          onPress={onMenu}
        />
        <ActionButton
          variant="replay"
          icon="🔄"
          label="Rejouer"
          onPress={onReplay}
        />
        <ActionButton
          variant="primary"
          icon="▶️"
          label="Niveau suivant"
          onPress={onNextLevel}
        />
      </Animated.View>
    </Animated.View>
  );
};
```

### GedeonVictory

```typescript
const GedeonVictory: React.FC = () => {
  return (
    <Animated.View style={[styles.gedeon, gedeonStyle]}>
      {/* Star bursts */}
      <Animated.Text style={[styles.starBurst, styles.starBurst1, starBurst1Style]}>⭐</Animated.Text>
      <Animated.Text style={[styles.starBurst, styles.starBurst2, starBurst2Style]}>✨</Animated.Text>
      <Animated.Text style={[styles.starBurst, styles.starBurst3, starBurst3Style]}>⭐</Animated.Text>
      <Animated.Text style={[styles.starBurst, styles.starBurst4, starBurst4Style]}>✨</Animated.Text>
      
      <View style={styles.gedeonBody}>
        {/* Casque */}
        <View style={styles.gedeonHelmet} />
        
        {/* Oreilles */}
        <View style={[styles.gedeonEar, styles.earLeft]} />
        <View style={[styles.gedeonEar, styles.earRight]} />
        
        {/* Bras animés */}
        <Animated.View style={[styles.gedeonArm, styles.armLeft, leftArmStyle]} />
        <Animated.View style={[styles.gedeonArm, styles.armRight, rightArmStyle]} />
        
        {/* Yeux heureux */}
        <View style={[styles.gedeonEye, styles.eyeLeft]}>
          <View style={styles.happyEye} />
        </View>
        <View style={[styles.gedeonEye, styles.eyeRight]}>
          <View style={styles.happyEye} />
        </View>
        
        {/* Nez */}
        <View style={styles.gedeonNose} />
        
        {/* Bouche souriante */}
        <View style={styles.gedeonMouth}>
          <View style={styles.tongue} />
        </View>
        
        {/* Ventre */}
        <View style={styles.gedeonBelly} />
      </View>
    </Animated.View>
  );
};
```

### AnimatedStar

```typescript
interface AnimatedStarProps {
  index: number;
  isEarned: boolean;
}

const AnimatedStar: React.FC<AnimatedStarProps> = ({ index, isEarned }) => {
  const starStyle = createStarAnimation(index, isEarned);
  
  return (
    <Animated.View style={[styles.starSlot, starStyle]}>
      <Text style={styles.starEmoji}>⭐</Text>
    </Animated.View>
  );
};
```

### ActionButton

```typescript
interface ActionButtonProps {
  variant: 'primary' | 'secondary' | 'replay';
  icon: string;
  label: string;
  onPress: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  variant,
  icon,
  label,
  onPress,
}) => {
  const scale = useSharedValue(1);
  
  const onPressIn = () => {
    scale.value = withSpring(0.95, { damping: 15 });
  };
  
  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.btnPrimary;
      case 'replay':
        return styles.btnReplay;
      default:
        return styles.btnSecondary;
    }
  };
  
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View style={[styles.btn, getButtonStyle(), animatedStyle]}>
        <Text style={styles.btnIcon}>{icon}</Text>
        <Text style={[styles.btnLabel, variant !== 'secondary' && styles.btnLabelLight]}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};
```

---

## 📐 StyleSheet

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: VICTORY_COLORS.overlayBg,
  },
  
  // Card
  card: {
    backgroundColor: VICTORY_COLORS.cardBg,
    borderRadius: 32,
    paddingHorizontal: 60,
    paddingVertical: 40,
    maxWidth: 700,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 30 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 20,
    overflow: 'visible',
  },
  
  // Gears
  gearDeco: {
    position: 'absolute',
    fontSize: 60,
    opacity: 0.15,
  },
  gear1: {
    top: -30,
    left: -30,
  },
  gear2: {
    bottom: -25,
    right: -25,
  },
  
  // Record badge
  recordBadge: {
    position: 'absolute',
    top: 20,
    right: -10,
    backgroundColor: VICTORY_COLORS.recordBg,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: VICTORY_COLORS.recordBg,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  recordText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 14,
    color: '#fff',
  },
  
  // Gédéon
  gedeon: {
    width: 160,
    height: 180,
    marginTop: -80,
    marginBottom: 20,
  },
  gedeonBody: {
    width: '100%',
    height: '100%',
    backgroundColor: '#C9A86C',
    borderRadius: 80,
    position: 'relative',
  },
  gedeonBelly: {
    position: 'absolute',
    bottom: 18,
    left: '50%',
    marginLeft: -45,
    width: 90,
    height: 65,
    backgroundColor: '#F5E6D3',
    borderRadius: 45,
  },
  gedeonHelmet: {
    position: 'absolute',
    top: -25,
    left: '50%',
    marginLeft: -45,
    width: 90,
    height: 55,
    backgroundColor: '#F1C40F',
    borderRadius: 45,
    zIndex: 3,
  },
  gedeonEar: {
    position: 'absolute',
    top: -12,
    width: 35,
    height: 40,
    backgroundColor: '#C9A86C',
    borderRadius: 17,
  },
  earLeft: {
    left: 20,
    transform: [{ rotate: '-15deg' }],
  },
  earRight: {
    right: 20,
    transform: [{ rotate: '15deg' }],
  },
  gedeonArm: {
    position: 'absolute',
    top: 50,
    width: 30,
    height: 60,
    backgroundColor: '#C9A86C',
    borderRadius: 15,
  },
  armLeft: {
    left: -20,
  },
  armRight: {
    right: -20,
  },
  gedeonEye: {
    position: 'absolute',
    top: 40,
    width: 32,
    height: 32,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  eyeLeft: {
    left: 22,
  },
  eyeRight: {
    right: 22,
  },
  happyEye: {
    position: 'absolute',
    bottom: 8,
    left: '50%',
    marginLeft: -8,
    width: 16,
    height: 8,
    backgroundColor: '#2C1810',
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  gedeonNose: {
    position: 'absolute',
    top: 72,
    left: '50%',
    marginLeft: -10,
    width: 20,
    height: 15,
    backgroundColor: '#2C1810',
    borderRadius: 10,
  },
  gedeonMouth: {
    position: 'absolute',
    top: 90,
    left: '50%',
    marginLeft: -25,
    width: 50,
    height: 25,
    backgroundColor: '#2C1810',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: 'hidden',
  },
  tongue: {
    position: 'absolute',
    bottom: 5,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 10,
    backgroundColor: '#E74C3C',
    borderRadius: 5,
  },
  
  // Star bursts
  starBurst: {
    position: 'absolute',
    fontSize: 28,
  },
  starBurst1: { top: -20, left: 30 },
  starBurst2: { top: -10, right: 40 },
  starBurst3: { top: 40, left: -10 },
  starBurst4: { top: 60, right: 0 },
  
  // Title
  title: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 20,
    color: '#8B5A2B',
    textAlign: 'center',
    marginBottom: 30,
  },
  
  // Stars
  starsRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 30,
  },
  starSlot: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starEmoji: {
    fontSize: 50,
  },
  
  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  statValue: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 28,
    color: '#4A3728',
  },
  statLabel: {
    fontFamily: 'Nunito-Regular',
    fontSize: 13,
    color: '#8B5A2B',
  },
  
  // Message
  messageBox: {
    backgroundColor: '#FFF9F0',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginBottom: 30,
    borderLeftWidth: 5,
    borderLeftColor: '#F1C40F',
  },
  messageText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 18,
    color: '#4A3728',
    lineHeight: 27,
    textAlign: 'center',
  },
  
  // Unlock
  unlockSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: VICTORY_COLORS.unlockBg,
    borderWidth: 2,
    borderColor: VICTORY_COLORS.unlockBorder,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 30,
    width: '100%',
  },
  unlockIcon: {
    width: 60,
    height: 60,
    backgroundColor: VICTORY_COLORS.unlockBorder,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockEmoji: {
    fontSize: 30,
  },
  unlockInfo: {
    flex: 1,
  },
  unlockTitle: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 16,
    color: VICTORY_COLORS.unlockBorder,
    marginBottom: 4,
  },
  unlockName: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 20,
    color: '#4A3728',
  },
  
  // Buttons
  buttonsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 18,
  },
  btnPrimary: {
    backgroundColor: VICTORY_COLORS.btnNext,
    shadowColor: VICTORY_COLORS.btnNext,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 6,
  },
  btnReplay: {
    backgroundColor: VICTORY_COLORS.btnReplay,
    shadowColor: VICTORY_COLORS.btnReplay,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 6,
  },
  btnSecondary: {
    backgroundColor: VICTORY_COLORS.btnMenu,
    borderWidth: 2,
    borderColor: VICTORY_COLORS.btnMenuBorder,
  },
  btnIcon: {
    fontSize: 24,
  },
  btnLabel: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 20,
    color: '#4A3728',
  },
  btnLabelLight: {
    color: '#fff',
  },
  
  // Light rays (SVG background)
  lightRays: {
    position: 'absolute',
    width: 800,
    height: 800,
    borderRadius: 400,
  },
});
```

---

## 🔊 Sons

| Évènement | Fichier | Timing |
|-----------|---------|--------|
| Ouverture popup | `victory_fanfare.mp3` | 0ms |
| Étoile 1 | `star_earn_1.mp3` | 500ms |
| Étoile 2 | `star_earn_2.mp3` | 700ms |
| Étoile 3 | `star_earn_3.mp3` | 900ms |
| Déblocage | `unlock_item.mp3` | 1200ms |
| Clic bouton | `button_click.mp3` | On press |

---

## ✅ Checklist Implémentation

- [ ] Structure modal overlay
- [ ] Système confettis avec positions random
- [ ] Système sparkles
- [ ] Light rays (SVG/Canvas)
- [ ] Animation carte entrée
- [ ] Gédéon avec bras animés
- [ ] Étoiles staggerées
- [ ] Stats avec fade in
- [ ] Section déblocage conditionnelle
- [ ] Boutons avec press states
- [ ] Badge record wiggle
- [ ] Engrenages rotatifs
- [ ] Sons synchronisés
- [ ] Haptic feedback sur actions

---

*Brief React Native v1.0 — FabriqueVictoryScreen*
