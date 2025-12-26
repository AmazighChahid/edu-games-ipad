# BRIEF REACT NATIVE : ConteurVictoryScreen

## 📋 MÉTADONNÉES
| Champ | Valeur |
|-------|--------|
| **Type** | Screen |
| **Priorité** | P0 Critical |
| **Dépendances** | PlumeMascot, CollectibleCard, Button, ConfettiLayer, StatsDisplay |
| **Fichier HTML source** | conteur-victory.html |

---

## 🌳 STRUCTURE HIÉRARCHIQUE

```
ConteurVictoryScreen
├── [Container] (style: container, flex: 1)
│   │
│   ├── [CelebrationBackground] (style: celebrationBg, animated)
│   │   ├── [GradientBackground] (purple gradient)
│   │   ├── [FloatingParticles] × 20 (animated drift)
│   │   └── [StarBursts] × 5 (animated sparkle)
│   │
│   ├── [ConfettiLayer] (animated, overlay)
│   │   └── [Confetti] × 30 (animated fall, colors variés)
│   │
│   └── [VictoryPopup] (style: popup, animated entrance)
│       │
│       ├── [PopupHeader] (style: popupHeader, gradient gold)
│       │   ├── [RotatingRays] (animated, 12 rays)
│       │   ├── [VictoryTitle] "🎉 BRAVO ! 🎉" (Fredoka 42px)
│       │   ├── [Subtitle] "Tu as terminé l'histoire !" (18px)
│       │   └── [StarsRow] (animated sequential)
│       │       └── [Star] × 5 (⭐, animated pop)
│       │
│       ├── [CardSection] (style: cardSection)
│       │   ├── [CollectibleCard] (animated flip)
│       │   │   ├── [CardBack] (gradient, pattern)
│       │   │   └── [CardFront]
│       │   │       ├── [NewBadge] "NOUVEAU !" (rotated, pulse)
│       │   │       ├── [RarityBadge] "Légendaire" (gradient)
│       │   │       ├── [AnimalEmoji] 🦊 (80px, bounce)
│       │   │       ├── [CardName] "Félix le Renard"
│       │   │       └── [TraitBadge]
│       │   │           ├── [Icon] 🧠
│       │   │           └── [Label] "Maître Stratège"
│       │   │
│       │   └── [CardMessage]
│       │       ├── [UnlockText] "Tu as débloqué Félix !"
│       │       └── [CollectionProgress]
│       │           ├── [Icon] 🃏
│       │           ├── [ProgressBar]
│       │           └── [Count] "8/20 cartes"
│       │
│       ├── [StatsSection] (style: statsSection, animated fadeIn)
│       │   ├── [StatItem] Questions
│       │   │   ├── [Value] "4/5" (blue)
│       │   │   └── [Label] "Questions"
│       │   │
│       │   ├── [StatItem] Compréhension
│       │   │   ├── [Value] "80%" (green)
│       │   │   ├── [Label] "Compréhension"
│       │   │   └── [Badge] "Excellent !" (conditional)
│       │   │
│       │   └── [StatItem] Temps
│       │       ├── [Value] "3:24" (gold)
│       │       └── [Label] "Temps"
│       │
│       ├── [SkillsEarned] (style: skillsSection, animated)
│       │   ├── [Title] "Compétences développées"
│       │   └── [SkillBadges]
│       │       ├── [Badge] "👂 Écoute active"
│       │       ├── [Badge] "🔗 Cause & Effet"
│       │       ├── [Badge] "🔮 Inférence"
│       │       └── [Badge] "📚 Vocabulaire"
│       │
│       └── [ButtonsSection] (style: buttonsSection, animated fadeIn)
│           ├── [PrimaryButton] "📚 Nouvelle histoire" (64 height)
│           ├── [SecondaryButton] "🔄 Relire cette histoire"
│           └── [TextButton] "Retour à l'accueil"
│
└── [MascotCelebration] (style: mascot, position: absolute)
    ├── [PlumeMascot] (size: large, animation: celebrate)
    │   └── [HappyEyes] (arc eyes)
    │   └── [WingsFlap] (fast animation)
    └── [SpeechBubble] (animated pop)
        └── [CelebrationText] "INCROYABLE ! Tu as tout compris ! 🌟"
```

---

## 🎨 STYLES REACT NATIVE

```typescript
import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 768;

export const ConteurColors = {
  primary: '#5B8DEE',
  secondary: '#9B59B6',
  accent: '#F39C12',
  success: '#7BC74D',
  gold: '#FFD93D',
  background: '#FFF9F0',
  surface: '#FFFFFF',
  text: '#2D3748',
  textSecondary: '#718096',
  celebration: {
    purple: '#9B59B6',
    purpleDark: '#8E44AD',
    gold: '#FFD93D',
    goldDark: '#F5C800',
  },
  rarity: {
    common: ['#A8A8A8', '#787878'],
    rare: ['#5B8DEE', '#4A7BD9'],
    epic: ['#9B59B6', '#8E44AD'],
    legendary: ['#FFD93D', '#F5C800'],
  },
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },

  // Celebration Background
  celebrationBg: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientContainer: {
    flex: 1,
  },
  floatingParticle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.6,
  },
  starBurst: {
    position: 'absolute',
    fontSize: 24,
  },

  // Confetti Layer
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    pointerEvents: 'none',
  },
  confetti: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  confettiRound: {
    borderRadius: 6,
  },
  confettiSquare: {
    transform: [{ rotate: '45deg' }],
  },

  // Victory Popup
  popupContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    zIndex: 20,
  },
  popup: {
    width: isTablet ? 650 : '95%',
    maxHeight: SCREEN_HEIGHT * 0.9,
    backgroundColor: ConteurColors.surface,
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.4,
    shadowRadius: 50,
    elevation: 25,
  },

  // Popup Header
  popupHeader: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  raysContainer: {
    position: 'absolute',
    width: 400,
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ray: {
    position: 'absolute',
    width: 4,
    height: 200,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  victoryTitle: {
    fontFamily: 'Fredoka-Bold',
    fontSize: isTablet ? 42 : 36,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 15,
    zIndex: 2,
  },
  subtitle: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
    zIndex: 2,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
    zIndex: 2,
  },
  star: {
    fontSize: 48,
  },
  starEmpty: {
    opacity: 0.3,
    // Grayscale effect using overlay
  },

  // Card Section
  cardSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: -50, // Overlap with header
    zIndex: 3,
  },
  cardContainer: {
    width: 180,
    height: 250,
    perspective: 1000,
  },
  cardFlipContainer: {
    width: '100%',
    height: '100%',
    transformStyle: 'preserve-3d',
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardBack: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotateY: '180deg' }],
  },
  cardBackPattern: {
    fontSize: 80,
    opacity: 0.3,
  },
  cardFront: {
    backgroundColor: '#FFF9F0',
    borderWidth: 4,
    borderColor: ConteurColors.gold,
    padding: 16,
    alignItems: 'center',
    shadowColor: ConteurColors.gold,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 12,
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
    zIndex: 10,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  newBadgeText: {
    fontFamily: 'Nunito-ExtraBold',
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
  },
  rarityText: {
    fontFamily: 'Nunito-ExtraBold',
    fontSize: 10,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  animalEmoji: {
    fontSize: 80,
    marginTop: 16,
    marginBottom: 12,
  },
  cardName: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 18,
    color: ConteurColors.text,
    textAlign: 'center',
  },
  traitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(91, 141, 238, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 10,
  },
  traitIcon: {
    fontSize: 16,
  },
  traitLabel: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    color: ConteurColors.primary,
  },
  cardMessage: {
    alignItems: 'center',
    marginTop: 20,
  },
  unlockText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: ConteurColors.textSecondary,
  },
  unlockHighlight: {
    fontFamily: 'Nunito-Bold',
    color: ConteurColors.secondary,
  },
  collectionProgress: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  collectionCount: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: ConteurColors.textSecondary,
  },

  // Stats Section
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    paddingVertical: 24,
    borderTopWidth: 2,
    borderTopColor: '#F0F0F0',
    marginTop: 24,
    marginHorizontal: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 36,
  },
  statValueBlue: {
    color: ConteurColors.primary,
  },
  statValueGreen: {
    color: ConteurColors.success,
  },
  statValueGold: {
    color: ConteurColors.accent,
  },
  statLabel: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: ConteurColors.textSecondary,
    marginTop: 4,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(123, 199, 77, 0.15)',
    borderWidth: 2,
    borderColor: ConteurColors.success,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  statBadgeIcon: {
    fontSize: 18,
  },
  statBadgeText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 13,
    color: '#5BAE6B',
  },

  // Skills Section
  skillsSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  skillsTitle: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 16,
    color: ConteurColors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  skillsBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  skillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(155, 89, 182, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 182, 0.2)',
  },
  skillIcon: {
    fontSize: 16,
  },
  skillText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 13,
    color: ConteurColors.secondary,
  },

  // Buttons Section
  buttonsSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
    gap: 12,
  },
  primaryButton: {
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    shadowColor: ConteurColors.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  secondaryButton: {
    height: 56,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButtonText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 18,
    color: ConteurColors.text,
  },
  textButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: ConteurColors.textSecondary,
  },

  // Mascot Celebration
  mascotContainer: {
    position: 'absolute',
    bottom: isTablet ? 60 : 40,
    right: isTablet ? 80 : 40,
    zIndex: 30,
  },
  mascotSpeech: {
    position: 'absolute',
    bottom: 150,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 20,
    maxWidth: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  mascotSpeechArrow: {
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
  mascotSpeechText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 15,
    color: ConteurColors.text,
    lineHeight: 22,
  },
});
```

### Couleurs utilisées
| Variable | Hex | Usage |
|----------|-----|-------|
| `celebration.purple` | #9B59B6 | Background gradient |
| `celebration.gold` | #FFD93D | Header, étoiles |
| `ConteurColors.success` | #7BC74D | Stats positifs, badges |
| `rarity.legendary` | ['#FFD93D', '#F5C800'] | Carte légendaire |
| `rarity.epic` | ['#9B59B6', '#8E44AD'] | Carte épique |
| `rarity.rare` | ['#5B8DEE', '#4A7BD9'] | Carte rare |

### Gradients
| Nom | Couleurs | Direction |
|-----|----------|-----------|
| celebrationBg | ['#9B59B6', '#8E44AD', '#7D3A98'] | 180deg |
| headerGold | ['#FFD93D', '#F5C800'] | 135deg |
| collectionProgress | ['#5B8DEE', '#9B59B6'] | 90deg |
| cardBackGradient | ['#5B8DEE', '#9B59B6'] | 135deg |
| legendaryCard | ['#FFD93D', '#F5C800'] | 135deg |

---

## 🎬 ANIMATIONS (Reanimated 3)

### Animation 1 : Victory Popup Entrance
```typescript
const popupAppear = useAnimatedStyle(() => ({
  opacity: withDelay(200, withTiming(1, { duration: 400 })),
  transform: [
    { scale: withDelay(200, withSpring(1, { damping: 12, stiffness: 150 })) },
    { translateY: withDelay(200, withSpring(0, { damping: 15, stiffness: 120 })) },
  ],
}));
```

| Propriété | De | Vers | Durée | Delay |
|-----------|-----|------|-------|-------|
| opacity | 0 | 1 | 400ms | 200ms |
| scale | 0.5 | 1 | spring | 200ms |
| translateY | 100 | 0 | spring | 200ms |

### Animation 2 : Stars Pop Sequence
```typescript
const starPop = (index: number) => useAnimatedStyle(() => ({
  opacity: withDelay(500 + index * 200, withTiming(1, { duration: 300 })),
  transform: [
    { scale: withDelay(500 + index * 200, 
      withSequence(
        withSpring(1.3, { damping: 6, stiffness: 200 }),
        withSpring(1, { damping: 10 })
      )
    )},
    { rotate: withDelay(500 + index * 200,
      withSequence(
        withTiming('-20deg', { duration: 150 }),
        withSpring('0deg', { damping: 8 })
      )
    )},
  ],
}));
```

| Étoile | Delay |
|--------|-------|
| ⭐ 1 | 500ms |
| ⭐ 2 | 700ms |
| ⭐ 3 | 900ms |
| ⭐ 4 | 1100ms |
| ⭐ 5 | 1300ms |

### Animation 3 : Card Flip
```typescript
const cardFlip = useAnimatedStyle(() => ({
  transform: [
    { perspective: 1000 },
    { rotateY: withDelay(1500, 
      withSequence(
        withTiming('90deg', { duration: 400, easing: Easing.in(Easing.ease) }),
        withTiming('0deg', { duration: 400, easing: Easing.out(Easing.ease) })
      )
    )},
  ],
}));

// Card back fades out at 90deg, card front fades in
const cardBackOpacity = useAnimatedStyle(() => ({
  opacity: withDelay(1500, withTiming(0, { duration: 400 })),
}));
const cardFrontOpacity = useAnimatedStyle(() => ({
  opacity: withDelay(1900, withTiming(1, { duration: 400 })),
}));
```

### Animation 4 : Confetti Fall
```typescript
const confettiFall = (index: number) => {
  const randomX = Math.random() * SCREEN_WIDTH;
  const randomDelay = Math.random() * 500;
  const randomDuration = 2000 + Math.random() * 1000;
  const randomRotation = Math.random() * 720;
  
  return useAnimatedStyle(() => ({
    opacity: withDelay(randomDelay, 
      withSequence(
        withTiming(1, { duration: 100 }),
        withDelay(randomDuration - 500, withTiming(0, { duration: 500 }))
      )
    ),
    transform: [
      { translateY: withDelay(randomDelay, 
        withTiming(SCREEN_HEIGHT + 50, { duration: randomDuration, easing: Easing.linear })
      )},
      { translateX: withDelay(randomDelay,
        withSequence(
          withTiming(30, { duration: randomDuration / 3 }),
          withTiming(-30, { duration: randomDuration / 3 }),
          withTiming(0, { duration: randomDuration / 3 })
        )
      )},
      { rotate: withDelay(randomDelay,
        withTiming(`${randomRotation}deg`, { duration: randomDuration })
      )},
      { scale: withDelay(randomDelay + randomDuration - 500,
        withTiming(0.5, { duration: 500 })
      )},
    ],
  }));
};
```

### Animation 5 : Rotating Rays
```typescript
const raysRotate = useAnimatedStyle(() => ({
  transform: [
    { rotate: withRepeat(
      withTiming('360deg', { duration: 20000, easing: Easing.linear }),
      -1
    )},
  ],
}));
```

### Animation 6 : New Badge Pulse
```typescript
const newBadgePulse = useAnimatedStyle(() => ({
  transform: [
    { rotate: '-15deg' },
    { scale: withRepeat(
      withSequence(
        withTiming(1.1, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      -1
    )},
  ],
}));
```

### Animation 7 : Animal Emoji Bounce
```typescript
const animalBounce = useAnimatedStyle(() => ({
  transform: [
    { translateY: withRepeat(
      withSequence(
        withTiming(-10, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1
    )},
  ],
}));
```

### Animation 8 : Mascot Celebration
```typescript
const mascotJump = useAnimatedStyle(() => ({
  transform: [
    { translateY: withRepeat(
      withSequence(
        withTiming(-25, { duration: 400 }),
        withSpring(0, { damping: 6 })
      ),
      -1
    )},
    { rotate: withRepeat(
      withSequence(
        withTiming('-8deg', { duration: 400 }),
        withTiming('8deg', { duration: 400 })
      ),
      -1,
      true
    )},
  ],
}));
```

### Animation 9 : Stats Fade In
```typescript
const statsFadeIn = useAnimatedStyle(() => ({
  opacity: withDelay(2000, withTiming(1, { duration: 500 })),
  transform: [
    { translateY: withDelay(2000, withSpring(0, { damping: 15, stiffness: 100 })) },
  ],
}));
```

### Animation 10 : Buttons Entrance
```typescript
const buttonEntrance = (index: number) => useAnimatedStyle(() => ({
  opacity: withDelay(2200 + index * 150, withTiming(1, { duration: 400 })),
  transform: [
    { translateY: withDelay(2200 + index * 150, withSpring(0, { damping: 15, stiffness: 120 })) },
  ],
}));
```

### Séquence d'animations complète
1. `CelebrationBackground` - 0ms (fade in)
2. `ConfettiLayer` - 100ms (start falling)
3. `VictoryPopup` - 200ms (scale + slide up)
4. `Stars` - 500ms → 1300ms (sequential pop)
5. `CollectibleCard` - 1500ms (flip)
6. `NewBadge` - 2000ms (pulse start)
7. `StatsSection` - 2000ms (fade + slide)
8. `SkillsBadges` - 2200ms (staggered fade)
9. `Buttons` - 2400ms (staggered entrance)
10. `MascotSpeech` - 2800ms (pop in)

---

## 👆 INTERACTIONS & GESTURES

### Boutons
| Élément | Geste | Feedback visuel | Feedback haptique |
|---------|-------|-----------------|-------------------|
| PrimaryButton | onPress | scale 0.95 + shadow increase | impactMedium |
| SecondaryButton | onPress | scale 0.98 + bg darken | impactLight |
| TextButton | onPress | opacity 0.7 | none |
| CollectibleCard | onPress | scale 1.02 | impactLight |

### Card Tap Detail
```typescript
const handleCardPress = useCallback(() => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  router.push('/(games)/collection');
}, [router]);
```

---

## 👶 CONTRAINTES UX ENFANT

### Zones tactiles
- [x] PrimaryButton : 64dp height
- [x] SecondaryButton : 56dp height
- [x] CollectibleCard : 180×250dp (large enough)
- [x] TextButton : 48dp height

### Accessibilité
```typescript
<Pressable
  accessibilityLabel="Nouvelle histoire"
  accessibilityHint="Appuie pour découvrir une nouvelle histoire"
  accessibilityRole="button"
>
```

### Feedback positif uniquement
- [x] Célébration joyeuse
- [x] Étoiles pleines = succès, vides = potentiel (pas échec)
- [x] Mascotte enthousiaste
- [x] Carte = récompense tangible

---

## 🖼️ ASSETS & RESSOURCES

### Emojis/Icônes
| Usage | Emoji/Icône |
|-------|-------------|
| Titre célébration | 🎉 |
| Étoile | ⭐ |
| Carte back | ❓ |
| Animaux cartes | 🦊 🦉 🦋 🐰 🦔 🐿️ |
| Traits | 🧠 📚 👂 🔗 🔮 💡 |
| Questions icon | ❓ |
| Compréhension | 🎯 |
| Temps | ⏱️ |
| Collection | 🃏 |
| Trophée | 🏆 |
| Nouvelle histoire | 📚 |
| Relire | 🔄 |

### Sons
| Événement | Fichier | Durée | Notes |
|-----------|---------|-------|-------|
| Victory fanfare | victory-fanfare.mp3 | 2-3s | Joyeux, triomphant |
| Confetti pop | confetti-pop.mp3 | <0.5s | Léger pop |
| Star pop | star-chime.mp3 | <0.5s | Ding mélodique |
| Card flip | card-flip.mp3 | <0.5s | Whoosh + reveal |
| Card unlock | card-unlock.mp3 | <1s | Magique, special |
| Button tap | button-tap.mp3 | <0.2s | Click satisfaisant |

---

## 📱 RESPONSIVE & ADAPTATION

### iPad (principal)
- Popup width : 650dp
- Mascot : visible en bas à droite

### iPhone (secondaire)
| Élément | iPad | iPhone |
|---------|------|--------|
| Popup width | 650dp | 95% |
| Card size | 180×250 | 150×210 |
| Stats gap | 40dp | 24dp |
| Mascot | Visible | Caché |
| Title font | 42px | 32px |

---

## 🧩 COMPOSANTS RÉUTILISABLES

### Design System existant
- [x] `<Button variant="primary" />` - PrimaryButton
- [x] `<Button variant="secondary" />` - SecondaryButton
- [ ] `<ProgressBar />` - Collection progress

### Composants à créer
- [ ] `<ConfettiLayer count={30} colors={string[]} />` - Confettis animés
- [ ] `<CollectibleCard card={Card} isNew={boolean} onPress={() => {}} />` - Carte avec flip
- [ ] `<StarsRow count={5} earned={4} />` - Étoiles séquentielles
- [ ] `<RotatingRays />` - Rayons qui tournent
- [ ] `<StatsDisplay stats={Stats} />` - Section statistiques
- [ ] `<SkillBadges skills={Skill[]} />` - Badges compétences

---

## ✅ CHECKLIST AVANT IMPLÉMENTATION

### Structure
- [x] Layout popup centré
- [x] Mascotte position absolute
- [x] Confettis en overlay

### Styles
- [x] Gradients celebration
- [x] Card avec shadow gold
- [x] Stats avec badges conditionnels

### Animations
- [x] Séquence timing défini
- [x] Card flip 3D
- [x] Confettis variés

### UX Enfant
- [x] Célébration positive
- [x] Touch targets validés
- [x] Pas de déception visible

---

## 💬 NOTES POUR CLAUDE CODE

1. **Performance confettis** :
   - Limiter à 25-30 pièces
   - Désactiver après 3-4 secondes
   - useReducedMotion = moins de confettis

2. **Card flip 3D** :
   - Utiliser `perspective` sur le parent
   - Deux faces avec `backfaceVisibility: 'hidden'`
   - Swap à 90° de rotation

3. **Séquence audio** :
   - Victory fanfare au mount
   - Star chimes synchronisés avec animations
   - Card unlock sound au flip

4. **Données carte** :
   - Calculer rareté selon performance
   - Perfect score = légendaire
   - Bon score = épique
   - Normal = rare

5. **Navigation** :
   - "Nouvelle histoire" → retour intro avec transition
   - "Relire" → même histoire, mode défaut
   - "Accueil" → pop to root

---

## 🔧 CODE DE DÉMARRAGE

```typescript
// ConteurVictoryScreen.tsx
import React, { useEffect, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { ConfettiLayer } from './components/ConfettiLayer';
import { CollectibleCard } from './components/CollectibleCard';
import { StarsRow } from './components/StarsRow';
import { RotatingRays } from './components/RotatingRays';
import { StatsDisplay } from './components/StatsDisplay';
import { SkillBadges } from './components/SkillBadges';
import { PlumeMascot } from './components/PlumeMascot';
import { SpeechBubble } from './components/SpeechBubble';
import { useVictoryData } from './hooks/useVictoryData';
import { styles, ConteurColors } from './styles';

export const ConteurVictoryScreen: React.FC = () => {
  const { storyId } = useLocalSearchParams<{ storyId: string }>();
  const router = useRouter();
  
  const {
    starsEarned,
    questionsScore,
    comprehensionPercent,
    timeSpent,
    unlockedCard,
    skillsEarned,
    collectionProgress,
  } = useVictoryData(storyId);

  // Entrance animations
  const popupScale = useSharedValue(0.5);
  const popupOpacity = useSharedValue(0);
  const popupTranslateY = useSharedValue(100);

  useEffect(() => {
    // Play victory sound
    // playSound('victory-fanfare');
    
    // Trigger entrance
    popupOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
    popupScale.value = withDelay(200, withSpring(1, { damping: 12, stiffness: 150 }));
    popupTranslateY.value = withDelay(200, withSpring(0, { damping: 15, stiffness: 120 }));
  }, []);

  const popupStyle = useAnimatedStyle(() => ({
    opacity: popupOpacity.value,
    transform: [
      { scale: popupScale.value },
      { translateY: popupTranslateY.value },
    ],
  }));

  const handleNewStory = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/(games)/conteur-curieux');
  };

  const handleReplay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace({
      pathname: '/(games)/conteur-curieux/story',
      params: { storyId, mode: 'mixed' },
    });
  };

  const handleHome = () => {
    router.push('/');
  };

  return (
    <View style={styles.container}>
      {/* Background */}
      <LinearGradient
        colors={['#9B59B6', '#8E44AD', '#7D3A98']}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Confetti */}
      <ConfettiLayer count={30} />
      
      {/* Victory Popup */}
      <Animated.View style={[styles.popupContainer, popupStyle]}>
        <View style={styles.popup}>
          {/* Header */}
          <LinearGradient
            colors={['#FFD93D', '#F5C800']}
            style={styles.popupHeader}
          >
            <RotatingRays />
            <Text style={styles.victoryTitle}>🎉 BRAVO ! 🎉</Text>
            <Text style={styles.subtitle}>Tu as terminé l'histoire !</Text>
            <StarsRow total={5} earned={starsEarned} />
          </LinearGradient>
          
          {/* Card Section */}
          <View style={styles.cardSection}>
            <CollectibleCard
              card={unlockedCard}
              isNew={true}
              onPress={() => router.push('/(games)/collection')}
            />
            <View style={styles.cardMessage}>
              <Text style={styles.unlockText}>
                Tu as débloqué <Text style={styles.unlockHighlight}>{unlockedCard.name}</Text> !
              </Text>
              <View style={styles.collectionProgress}>
                <Text style={styles.collectionIcon}>🃏</Text>
                <View style={styles.collectionBar}>
                  <LinearGradient
                    colors={['#5B8DEE', '#9B59B6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.collectionFill, { width: `${collectionProgress.percent}%` }]}
                  />
                </View>
                <Text style={styles.collectionCount}>
                  {collectionProgress.current}/{collectionProgress.total} cartes
                </Text>
              </View>
            </View>
          </View>
          
          {/* Stats */}
          <StatsDisplay
            questions={questionsScore}
            comprehension={comprehensionPercent}
            time={timeSpent}
          />
          
          {/* Skills */}
          <SkillBadges skills={skillsEarned} />
          
          {/* Buttons */}
          <View style={styles.buttonsSection}>
            <Pressable onPress={handleNewStory}>
              <LinearGradient
                colors={['#9B59B6', '#8E44AD']}
                style={styles.primaryButton}
              >
                <Text>📚</Text>
                <Text style={styles.primaryButtonText}>Nouvelle histoire</Text>
              </LinearGradient>
            </Pressable>
            
            <Pressable style={styles.secondaryButton} onPress={handleReplay}>
              <Text>🔄</Text>
              <Text style={styles.secondaryButtonText}>Relire cette histoire</Text>
            </Pressable>
            
            <Pressable style={styles.textButton} onPress={handleHome}>
              <Text style={styles.textButtonText}>Retour à l'accueil</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
      
      {/* Mascot */}
      <View style={styles.mascotContainer}>
        <View style={styles.mascotSpeech}>
          <Text style={styles.mascotSpeechText}>
            INCROYABLE ! Tu as tout compris ! 🌟
          </Text>
          <View style={styles.mascotSpeechArrow} />
        </View>
        <PlumeMascot animation="celebrate" size="large" />
      </View>
    </View>
  );
};
```
