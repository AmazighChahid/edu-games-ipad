# BRIEF REACT NATIVE : MatricesVictoryScreen

## 📋 MÉTADONNÉES
| Champ | Valeur |
|-------|--------|
| **Type** | Screen / Overlay |
| **Priorité** | P1 High |
| **Fichier HTML** | matrices-victory.html |
| **Route** | `/app/(games)/matrices-magiques/victory.tsx` |
| **Dépendances** | VictoryPopup, CollectibleCardFlip, ConfettiCannon, PixelMascot, SkillBadges |

---

## 🌳 STRUCTURE HIÉRARCHIQUE

```
MatricesVictoryScreen
├── [Container] (style: container, fullscreen overlay)
│   │
│   ├── [AnimatedBackground] (position: absolute, z: 0)
│   │   ├── [ConfettiLayer] × 20 (falling confetti, staggered)
│   │   ├── [FlyingStars] × 5 (bursting stars)
│   │   └── [Sparkles] × 10 (twinkling dots)
│   │
│   ├── [VictoryPopup] (style: popup, z: 10, animated appear)
│   │   │
│   │   ├── [PopupHeader] (style: popupHeader, LinearGradient gold)
│   │   │   ├── [Rays] × 12 (rotating sun rays)
│   │   │   ├── [VictoryTitle] "🎉 MALIN! 🎉" (animated bounce)
│   │   │   ├── [Subtitle] "Station Spatiale terminée!"
│   │   │   └── [StarsContainer] (animated pop-in)
│   │   │       └── [Star] × 3 (⭐, staggered appear)
│   │   │
│   │   ├── [CardSection] (style: cardSection)
│   │   │   ├── [CollectibleCardFlip] (animated flip)
│   │   │   │   ├── [CardBack] (pattern, rotateY: 180)
│   │   │   │   └── [CardFront] (character, rotateY: 0)
│   │   │   │       ├── [NewBadge] "NOUVEAU!" (animated pulse)
│   │   │   │       ├── [RarityBadge] "Épique"
│   │   │   │       ├── [CharacterEmoji] 🦊
│   │   │   │       ├── [CardName] "Pixel le Détective"
│   │   │   │       └── [CardTrait] "🔍 Maître des Patterns"
│   │   │   │
│   │   │   ├── [CardMessage]
│   │   │   │   └── [Text] "Tu as débloqué Pixel le Détective!"
│   │   │   │
│   │   │   └── [CollectionProgress]
│   │   │       ├── [Icon] 🃏
│   │   │       ├── [ProgressBar] (9/20)
│   │   │       └── [Text] "9/20 cartes"
│   │   │
│   │   ├── [StatsSection] (style: statsSection, animated fadeIn)
│   │   │   ├── [StatItem] Puzzles: 8
│   │   │   ├── [StatItem] Indices: 2 + Badge "Autonome!"
│   │   │   └── [StatItem] Temps: 4:32
│   │   │
│   │   ├── [SkillsSection] (style: skillsSection, animated)
│   │   │   ├── [SectionTitle] "Compétences maîtrisées"
│   │   │   └── [SkillBadges]
│   │   │       ├── [Badge] 🎨 Couleurs
│   │   │       ├── [Badge] 🔄 Rotation
│   │   │       ├── [Badge] 📐 Distribution
│   │   │       └── [Badge] 🧩 Combiné
│   │   │
│   │   └── [ButtonsSection] (style: buttonsSection)
│   │       ├── [PrimaryButton] "🏰 Monde suivant: Château Magique"
│   │       ├── [SecondaryButton] "🔄 Rejouer ce monde"
│   │       └── [TextButton] "Retour à l'accueil"
│   │
│   └── [MascotCelebration] (position: absolute, bottom-right, z: 20)
│       ├── [SpeechBubble] "INCROYABLE! Tu as trouvé toutes les règles! 🌟"
│       └── [PixelMascot] (celebrating animation)
│           ├── [Body] (jumping)
│           ├── [Arms] (waving)
│           ├── [Tail] (fast wag)
│           └── [Eyes] (happy closed)
```

---

## 🎨 STYLES REACT NATIVE

```typescript
import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // Container (fullscreen overlay)
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Victory Popup
  popup: {
    width: Math.min(580, SCREEN_WIDTH - 48),
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    overflow: 'hidden',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.4,
    shadowRadius: 80,
    elevation: 25,
  },

  // Popup Header with rays
  popupHeader: {
    paddingTop: 30,
    paddingBottom: 80,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  // LinearGradient: ['#FFD93D', '#FFB347']

  raysContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 400,
    height: 400,
    marginLeft: -200,
    marginTop: -200,
  },

  ray: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 4,
    height: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginLeft: -2,
    transformOrigin: 'center top',
    // Each ray rotated by index * 30deg
  },

  victoryTitle: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 48,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 15,
    textAlign: 'center',
    zIndex: 2,
  },

  subtitle: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    zIndex: 2,
  },

  starsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 20,
    zIndex: 2,
  },

  star: {
    fontSize: 48,
    // Filter shadow
  },

  starEmpty: {
    opacity: 0.4,
    // Grayscale effect via tintColor if Image
  },

  // Card Section
  cardSection: {
    paddingHorizontal: 30,
    paddingBottom: 30,
    marginTop: -50,
    alignItems: 'center',
    zIndex: 3,
  },

  // Collectible Card (flip container)
  cardFlipContainer: {
    width: 200,
    height: 280,
    perspective: 1000,
  },

  collectibleCard: {
    width: '100%',
    height: '100%',
    position: 'relative',
    // backfaceVisibility: 'hidden' on children
  },

  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backfaceVisibility: 'hidden',
  },

  cardBack: {
    justifyContent: 'center',
    alignItems: 'center',
    // LinearGradient: ['#5B8DEE', '#E056FD']
    transform: [{ rotateY: '180deg' }],
  },

  cardBackPattern: {
    fontSize: 80,
    opacity: 0.3,
  },

  cardFront: {
    padding: 15,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFD93D',
    // LinearGradient: ['#FFF9F0', '#FFE8D6']
    shadowColor: '#FFB347',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 15,
  },

  newBadge: {
    position: 'absolute',
    top: -10,
    left: -10,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    transform: [{ rotate: '-15deg' }],
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },

  newBadgeText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 11,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  rarityBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    // LinearGradient based on rarity
  },

  rarityText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 10,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  cardAnimal: {
    fontSize: 90,
    marginVertical: 15,
  },

  cardName: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 18,
    color: '#4A4A4A',
    textAlign: 'center',
  },

  cardTrait: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(91, 141, 238, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 8,
  },

  cardTraitIcon: {
    fontSize: 16,
  },

  cardTraitText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 12,
    color: '#5B8DEE',
  },

  // Card Message
  cardMessage: {
    textAlign: 'center',
    marginTop: 20,
  },

  cardMessageText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: '#7A7A7A',
  },

  cardMessageHighlight: {
    color: '#E056FD',
    fontWeight: '700',
  },

  // Collection Progress
  collectionProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 12,
  },

  collectionIcon: {
    fontSize: 18,
  },

  collectionBar: {
    width: 120,
    height: 8,
    backgroundColor: '#EEE',
    borderRadius: 4,
    overflow: 'hidden',
  },

  collectionFill: {
    height: '100%',
    borderRadius: 4,
    // LinearGradient: ['#5B8DEE', '#E056FD']
  },

  collectionText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: '#9A9A9A',
  },

  // Stats Section
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderTopWidth: 2,
    borderTopColor: '#F0F0F0',
  },

  statItem: {
    alignItems: 'center',
  },

  statValue: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 36,
  },

  statValueBlue: {
    color: '#5B8DEE',
  },

  statValueGreen: {
    color: '#7BC74D',
  },

  statValueGold: {
    color: '#FFB347',
  },

  statLabel: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: '#9A9A9A',
    marginTop: 4,
  },

  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(123, 199, 77, 0.15)',
    borderWidth: 2,
    borderColor: '#7BC74D',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },

  statBadgeIcon: {
    fontSize: 18,
  },

  statBadgeText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 13,
    color: '#5BAE6B',
  },

  // Skills Section
  skillsSection: {
    paddingHorizontal: 30,
    paddingBottom: 20,
  },

  skillsTitle: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 14,
    color: '#9A9A9A',
    textAlign: 'center',
    marginBottom: 12,
  },

  skillBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },

  skillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },

  skillBadgeIcon: {
    fontSize: 16,
  },

  skillBadgeText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 13,
    color: '#4A4A4A',
  },

  // Buttons Section
  buttonsSection: {
    padding: 20,
    paddingTop: 10,
    gap: 12,
  },

  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    // LinearGradient: ['#5B8DEE', '#4A7BD9']
    shadowColor: '#5B8DEE',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },

  primaryButtonText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },

  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 32,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
  },

  secondaryButtonText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 18,
    color: '#4A4A4A',
  },

  textButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },

  textButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: '#9A9A9A',
  },

  // Mascot Celebration
  mascotCelebration: {
    position: 'absolute',
    bottom: 50,
    right: 80,
    zIndex: 101,
  },

  mascotSpeechBubble: {
    position: 'absolute',
    bottom: 140,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    maxWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 6,
  },

  mascotSpeechText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: '#4A4A4A',
    lineHeight: 20,
  },

  mascotSpeechPointer: {
    position: 'absolute',
    bottom: -8,
    left: 30,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },

  // Confetti
  confetti: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 2, // or 6 for circles
  },

  // Flying Stars
  flyingStar: {
    position: 'absolute',
    fontSize: 32,
  },

  // Sparkles
  sparkle: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#FFD93D',
    borderRadius: 4,
  },
});
```

### Couleurs utilisées
| Variable | Hex | Usage |
|----------|-----|-------|
| `overlay` | rgba(0,0,0,0.6) | Fond overlay |
| `header.gold1` | #FFD93D | Header gradient start |
| `header.gold2` | #FFB347 | Header gradient end |
| `surface` | #FFFFFF | Popup background |
| `card.bg1` | #FFF9F0 | Card gradient start |
| `card.bg2` | #FFE8D6 | Card gradient end |
| `card.border` | #FFD93D | Card border gold |
| `newBadge` | #FF6B6B | Badge "Nouveau" |
| `progress.gradient` | ['#5B8DEE', '#E056FD'] | Progress bar fill |
| `stat.blue` | #5B8DEE | Stat puzzles |
| `stat.green` | #7BC74D | Stat hints |
| `stat.gold` | #FFB347 | Stat time |
| `button.primary` | ['#5B8DEE', '#4A7BD9'] | Primary button |

### Gradients de Rareté (Card)
| Rareté | Couleurs | Direction |
|--------|----------|-----------|
| Commun | ['#A0A0A0', '#808080'] | 135deg |
| Rare | ['#E056FD', '#9B59B6'] | 135deg |
| Épique | ['#5B8DEE', '#3498DB'] | 135deg |
| Légendaire | ['#FFD93D', '#F39C12'] | 135deg |

---

## 🎬 ANIMATIONS (Reanimated 3)

### Animation 1 : Popup Appear
```typescript
const popupStyle = useAnimatedStyle(() => {
  return {
    opacity: withTiming(1, { duration: 300 }),
    transform: [
      { scale: withSequence(
        withSpring(1.05, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 12 })
      )},
      { translateY: withSpring(0, { damping: 15, stiffness: 150 }) },
    ],
  };
});
// Initial: opacity: 0, scale: 0.5, translateY: 50
```

| Propriété | De | Vers | Durée | Type | Delay |
|-----------|-----|------|-------|------|-------|
| opacity | 0 | 1 | 300ms | timing | 0ms |
| scale | 0.5 | 1.05 → 1 | - | spring bounce | 0ms |
| translateY | 50 | 0 | - | spring (d:15) | 0ms |

### Animation 2 : Title Bounce
```typescript
const titleStyle = useAnimatedStyle(() => {
  return {
    transform: [
      { scale: withDelay(300, withSequence(
        withTiming(0, { duration: 0 }),
        withSpring(1.2, { damping: 6, stiffness: 200 }),
        withSpring(0.9, { damping: 10 }),
        withSpring(1, { damping: 12 })
      ))},
    ],
  };
});
```

### Animation 3 : Stars Pop-in (Staggered)
```typescript
const starStyle = (index: number) => useAnimatedStyle(() => {
  const delay = 500 + index * 200; // 500ms, 700ms, 900ms
  return {
    opacity: withDelay(delay, withTiming(1, { duration: 100 })),
    transform: [
      { scale: withDelay(delay, withSpring(1, { damping: 8, stiffness: 300 })) },
      { rotate: `${withDelay(delay, withSequence(
        withTiming(-180, { duration: 0 }),
        withTiming(0, { duration: 500 })
      ))}deg` },
    ],
  };
});
// Initial: opacity: 0, scale: 0, rotate: -180deg
```

| Étoile | Delay | Animation |
|--------|-------|-----------|
| Star 1 | 500ms | scale 0→1 (spring), rotate -180→0 |
| Star 2 | 700ms | scale 0→1 (spring), rotate -180→0 |
| Star 3 | 900ms | scale 0→1 (spring), rotate -180→0 |

### Animation 4 : Card Flip
```typescript
const cardFlipStyle = useAnimatedStyle(() => {
  return {
    transform: [
      { perspective: 1000 },
      { rotateY: withDelay(1200, withSequence(
        withTiming('180deg', { duration: 0 }),
        withTiming('90deg', { duration: 500 }),
        withSpring('0deg', { damping: 12 })
      ))},
      { scale: withDelay(1200, withSequence(
        withTiming(0.8, { duration: 0 }),
        withTiming(1.1, { duration: 500 }),
        withSpring(1, { damping: 12 })
      ))},
    ],
  };
});
// Front starts at rotateY: 180, flips to 0
// Back starts at rotateY: 0, flips to 180 (hidden)
```

| Phase | Durée | rotateY | scale |
|-------|-------|---------|-------|
| Initial | 0 | 180deg (back visible) | 0.8 |
| Mid-flip | 500ms | 90deg | 1.1 |
| Final | spring | 0deg (front visible) | 1 |

### Animation 5 : New Badge Pulse
```typescript
const badgePulseStyle = useAnimatedStyle(() => {
  return {
    transform: [
      { scale: withRepeat(
        withSequence(
          withTiming(1.1, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        false
      )},
    ],
  };
});
```

### Animation 6 : Stats Fade-in
```typescript
const statsStyle = useAnimatedStyle(() => {
  return {
    opacity: withDelay(1800, withTiming(1, { duration: 400 })),
    transform: [
      { translateY: withDelay(1800, withTiming(0, { duration: 400 })) },
    ],
  };
});
// Initial: opacity: 0, translateY: 20
```

### Animation 7 : Buttons Fade-in
```typescript
const buttonsStyle = useAnimatedStyle(() => {
  return {
    opacity: withDelay(2200, withTiming(1, { duration: 400 })),
    transform: [
      { translateY: withDelay(2200, withTiming(0, { duration: 400 })) },
    ],
  };
});
// Initial: opacity: 0, translateY: 20
```

### Animation 8 : Confetti Fall
```typescript
const confettiStyle = (index: number) => {
  const startX = Math.random() * SCREEN_WIDTH;
  const endX = startX + (Math.random() - 0.5) * 200;
  const delay = 100 + index * 50;
  
  return useAnimatedStyle(() => ({
    left: startX,
    top: -20,
    transform: [
      { translateY: withDelay(delay, withTiming(SCREEN_HEIGHT + 50, { duration: 3000 })) },
      { translateX: withDelay(delay, withTiming(endX - startX, { duration: 3000 })) },
      { rotate: `${withDelay(delay, withTiming(720, { duration: 3000 }))}deg` },
    ],
    opacity: withDelay(delay + 2500, withTiming(0, { duration: 500 })),
  }));
};
```

### Animation 9 : Flying Stars Burst
```typescript
const starBurstStyle = (index: number) => {
  const angle = (index / 5) * Math.PI * 2;
  const distance = 100 + Math.random() * 50;
  const delay = 200 + index * 100;
  
  return useAnimatedStyle(() => ({
    transform: [
      { scale: withDelay(delay, withSequence(
        withTiming(0, { duration: 0 }),
        withSpring(1.5, { damping: 6 }),
        withTiming(0.5, { duration: 500 })
      ))},
      { translateX: withDelay(delay, withTiming(Math.cos(angle) * distance, { duration: 800 })) },
      { translateY: withDelay(delay, withTiming(Math.sin(angle) * distance - 50, { duration: 800 })) },
      { rotate: `${withDelay(delay, withTiming(360, { duration: 800 }))}deg` },
    ],
    opacity: withDelay(delay + 600, withTiming(0, { duration: 200 })),
  }));
};
```

### Animation 10 : Mascot Jump
```typescript
const mascotJumpStyle = useAnimatedStyle(() => {
  return {
    transform: [
      { translateY: withRepeat(
        withSequence(
          withSpring(-20, { damping: 6, stiffness: 200 }),
          withSpring(0, { damping: 8 })
        ),
        -1,
        false
      )},
      { rotate: withRepeat(
        withSequence(
          withTiming('-5deg', { duration: 500 }),
          withTiming('5deg', { duration: 500 })
        ),
        -1,
        true
      )},
    ],
  };
});
```

### Animation 11 : Rays Rotation
```typescript
const raysStyle = useAnimatedStyle(() => {
  return {
    transform: [
      { rotate: `${withRepeat(
        withTiming(360, { duration: 10000, easing: Easing.linear }),
        -1,
        false
      )}deg` },
    ],
  };
});
```

### Animation 12 : Mascot Speech Pop
```typescript
const speechStyle = useAnimatedStyle(() => {
  return {
    opacity: withDelay(2500, withTiming(1, { duration: 200 })),
    transform: [
      { scale: withDelay(2500, withSpring(1, { damping: 10, stiffness: 200 })) },
    ],
  };
});
// Initial: opacity: 0, scale: 0.8
```

### Séquence complète d'animations
| Étape | Élément | Delay |
|-------|---------|-------|
| 1 | Popup appear | 0ms |
| 2 | Title bounce | 300ms |
| 3 | Stars pop-in | 500/700/900ms |
| 4 | Card flip | 1200ms |
| 5 | Card message fade | 1800ms |
| 6 | Stats fade-in | 2000ms |
| 7 | Skills fade-in | 2200ms |
| 8 | Buttons fade-in | 2400ms |
| 9 | Mascot speech pop | 2500ms |
| ∞ | Confetti (loop) | 100ms+ |
| ∞ | Rays rotation (loop) | 0ms |
| ∞ | Badge pulse (loop) | 0ms |
| ∞ | Mascot jump (loop) | 0ms |

---

## 👆 INTERACTIONS & GESTURES

### Boutons
| Élément | Geste | Feedback visuel | Feedback haptique |
|---------|-------|-----------------|-------------------|
| PrimaryButton | onPress | scale 0.95 → 1 (spring), glow | impactMedium |
| SecondaryButton | onPress | scale 0.97 → 1, darken bg | impactLight |
| TextButton | onPress | opacity 0.5 → 1 | none |
| Card | onPress | scale 1.02, subtle glow | impactLight |

### Button Press Animation
```typescript
const buttonPressStyle = useAnimatedStyle(() => {
  return {
    transform: [
      { scale: withSpring(isPressed.value ? 0.95 : 1, { damping: 15, stiffness: 200 }) },
    ],
  };
});
```

### Navigation Actions
```typescript
// Monde suivant
const handleNextWorld = () => {
  router.push({
    pathname: '/(games)/matrices-magiques/puzzle',
    params: { worldId: nextWorldId },
  });
};

// Rejouer
const handleReplay = () => {
  router.replace({
    pathname: '/(games)/matrices-magiques/puzzle',
    params: { worldId: currentWorldId },
  });
};

// Retour accueil
const handleHome = () => {
  router.replace('/');
};
```

---

## 👶 CONTRAINTES UX ENFANT

### Zones tactiles
- [x] PrimaryButton : 100% width × 54 dp ✓
- [x] SecondaryButton : 100% width × 54 dp ✓
- [x] TextButton : 100% width × 44 dp ✓
- [x] Card (tap info) : 200×280 dp ✓

### Accessibilité
- [x] Confettis ne gênent pas la lecture
- [x] Contraste texte blanc sur or ≥ 3:1 (shadow aide)
- [x] Actions principales clairement visibles
- [x] Étoiles : visuel + nombre

```typescript
// Primary Button
accessibilityLabel={`Continuer vers le monde ${nextWorldName}`}
accessibilityHint="Appuie pour commencer le prochain monde"
accessibilityRole="button"

// Card
accessibilityLabel={`Carte débloquée: ${cardName}, rareté ${rarity}`}
```

### Feedback obligatoire
- [x] Célébration visuelle immédiate (confettis, étoiles)
- [x] Feedback sonore joyeux (non intrusif)
- [x] Mascotte qui célèbre avec l'enfant
- [x] Message personnalisé selon performance

### Navigation
- [x] Action principale visible (Monde suivant)
- [x] Option de rejouer disponible
- [x] Retour possible mais pas proéminent

---

## 🖼️ ASSETS & RESSOURCES

### Emojis/Icônes
| Usage | Emoji/Icône | Fallback |
|-------|-------------|----------|
| Titre | 🎉 | Lucide: PartyPopper |
| Étoiles | ⭐ | Lucide: Star (filled) |
| Carte ? | ❓ | Text: "?" |
| Mascotte | 🦊 | Custom SVG |
| Skills | 🎨🔄📐🧩 | - |
| Collection | 🃏 | Lucide: Cards |
| Badge | 🎯 | Lucide: Target |

### Confetti Colors
| Couleur | Hex |
|---------|-----|
| Blue | #5B8DEE |
| Orange | #FFB347 |
| Green | #7BC74D |
| Purple | #E056FD |
| Yellow | #FFD93D |
| Red | #FF6B6B |

### Sons
| Événement | Fichier | Durée | Notes |
|-----------|---------|-------|-------|
| Victory fanfare | victory-fanfare.mp3 | 2s | Mélodie joyeuse |
| Card flip | card-flip.mp3 | 400ms | Whoosh + reveal |
| Star pop | star-pop.mp3 | 200ms | Pop magique |
| Confetti | confetti-pop.mp3 | 1s | Pétillements |
| Button tap | button-tap.mp3 | 100ms | Click satisfaisant |

---

## 📱 RESPONSIVE & ADAPTATION

### iPad (principal)
| Élément | Valeur |
|---------|--------|
| Popup width | 580px |
| Card size | 200×280 |
| Title font | 48px |
| Button height | 54dp |

### iPhone (secondaire)
| Élément | Valeur |
|---------|--------|
| Popup width | screen - 32px |
| Card size | 160×224 |
| Title font | 36px |
| Button height | 50dp |
| Stats layout | 2 rows |

---

## 🧩 COMPOSANTS RÉUTILISABLES

### Design System existant
- [x] `<Button variant="primary|secondary|ghost" />` - Boutons
- [x] `<ProgressBar />` - Collection progress
- [ ] `<Modal />` - Base popup

### Composants à créer
- [ ] `<VictoryPopup>` - Popup de victoire (réutilisable entre jeux)
- [ ] `<CollectibleCardFlip card={Card} />` - Animation flip carte
- [ ] `<ConfettiCannon count={20} />` - Confettis animés
- [ ] `<RotatingRays count={12} />` - Rayons tournants
- [ ] `<SkillBadges skills={string[]} />` - Badges compétences
- [ ] `<StatsDisplay stats={Stats} />` - Affichage stats

---

## ✅ CHECKLIST AVANT IMPLÉMENTATION

### Structure
- [x] Arborescence des composants claire
- [x] Props définies pour chaque composant
- [x] Types TypeScript prévus

### Styles
- [x] Tous les styles traduits en StyleSheet
- [x] Gradients identifiés (header, card, buttons)
- [x] Shadows iOS + elevation Android

### Animations
- [x] Popup appear ✓
- [x] Title bounce ✓
- [x] Stars staggered pop ✓
- [x] Card flip ✓
- [x] Stats/buttons fade ✓
- [x] Confetti fall ✓
- [x] Stars burst ✓
- [x] Rays rotation ✓
- [x] Mascot celebration ✓
- [x] Speech bubble pop ✓

### UX Enfant
- [x] Touch targets vérifiés
- [x] Célébration positive et engageante
- [x] Actions claires (next/replay/home)
- [x] Accessibilité prévue

---

## 💬 NOTES POUR CLAUDE CODE

1. **Card Flip avec Perspective** : Utiliser `perspective: 1000` sur le parent. Les deux faces (front/back) doivent avoir `backfaceVisibility: 'hidden'`. Le back commence à `rotateY: 0`, le front à `rotateY: 180deg`.

2. **Confetti Performance** : Créer exactement 20 confettis. Utiliser `removeClippedSubviews` sur le container. Les confettis peuvent être des View simples avec backgroundColor random.

3. **Staggered Stars** : Utiliser un array [0,1,2].map() avec delay = 500 + index * 200.

4. **Mascot Celebration** : Pixel doit avoir les yeux fermés (happy) et les bras levés. Le tail wag est plus rapide que d'habitude.

5. **Data from Route** : Les stats (puzzles, hints, time) viennent du state ou des params de navigation. La carte débloquée est déterminée par `cardAwardEngine.ts`.

6. **Sound Sequence** : 
   - 0ms: victory-fanfare.mp3
   - 1200ms: card-flip.mp3
   - 500/700/900ms: star-pop.mp3 (3×)

7. **Next World Logic** : Si le monde actuel est le dernier débloqué, le bouton devient "🎊 Retour à la sélection". Vérifier `worldProgress` dans le store.

8. **Card Unlock** : Si l'enfant a déjà la carte, afficher "Carte dupliquée → +10⭐" au lieu de "NOUVEAU!".

9. **Rays Container** : Les 12 rayons sont des View rectangulaires, chacun pivoté de `index * 30deg`. Le container entier tourne.

10. **Button Disabled State** : Si pas de monde suivant disponible, le bouton primaire navigue vers la sélection des mondes.

---

## 📄 CODE DE DÉMARRAGE

```typescript
// screens/MatricesVictoryScreen.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  useSharedValue,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { ConfettiCannon } from '../components/feedback/ConfettiCannon';
import { CollectibleCardFlip } from '../components/feedback/CollectibleCardFlip';
import { PixelMascot } from '../components/PixelMascot';
import { SpeechBubble } from '../components/SpeechBubble';
import { useStore } from '@/store/useStore';
import { useSound } from '@/hooks/useSound';

interface VictoryParams {
  worldId: string;
  puzzlesCompleted: string;
  hintsUsed: string;
  timeSeconds: string;
  unlockedCardId?: string;
}

export const MatricesVictoryScreen: React.FC = () => {
  const params = useLocalSearchParams<VictoryParams>();
  const { playSound } = useSound();
  
  // Parse params
  const stats = {
    puzzles: parseInt(params.puzzlesCompleted || '0'),
    hints: parseInt(params.hintsUsed || '0'),
    time: parseInt(params.timeSeconds || '0'),
  };
  
  // Animation triggers
  useEffect(() => {
    playSound('victory-fanfare');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);
  
  return (
    <View style={styles.container}>
      <ConfettiCannon count={20} />
      {/* Victory Popup */}
      {/* Mascot Celebration */}
    </View>
  );
};
```
