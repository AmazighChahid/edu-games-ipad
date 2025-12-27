# BRIEF REACT NATIVE : EmbouteillageVictoryScreen

## 📋 MÉTADONNÉES
| Champ | Valeur |
|-------|--------|
| Type | Overlay / Modal |
| Fichier HTML | embouteillage-victory.html |
| Dépendances | VictoryOverlay, ConfettiLayer, GarageMascot, CollectibleCard, StatsSection, Button |

---

## 🌳 STRUCTURE

```
EmbouteillageVictoryScreen
├── [VictoryOverlay] (style: overlay, animated fade-in)
│   │
│   ├── [ConfettiLayer] (animated, 18+ particles)
│   │
│   ├── [TaxiExitAnimation] (style: taxiExit, animated)
│   │   ├── [Road] (style: road, animated dashed lines)
│   │   └── [Taxi] (animated zoom-out, exit right)
│   │
│   ├── [FlyingEmojis] (style: flyingEmojis)
│   │   └── [Emoji] (🚗⭐🔧🚕🎉, random positions, float up)
│   │
│   ├── [Sparkles] (style: sparkles, pulsing)
│   │
│   ├── [VictoryPopup] (style: popup, animated bounce-in)
│   │   │
│   │   ├── [PopupHeader] (style: popupHeader, gold gradient)
│   │   │   ├── [RotatingRays] (animated, 12 rays)
│   │   │   ├── [Title] ("🎉 BRAVO ! 🎉", animated bounce)
│   │   │   ├── [Subtitle] ("Le taxi est libre !")
│   │   │   └── [StarsDisplay] (3 stars, animated pop)
│   │   │
│   │   ├── [BadgeSection] (style: badgeSection, conditional)
│   │   │   ├── [NewBadge] ("NOUVEAU !" tag)
│   │   │   ├── [BadgeIcon] (vehicle emoji)
│   │   │   └── [BadgeText] ("Tu as débloqué...")
│   │   │
│   │   ├── [StatsSection] (style: statsSection, animated fade-in)
│   │   │   ├── [StatItem] (Tes coups, blue)
│   │   │   ├── [StatItem] (Optimal, green, with badge if perfect)
│   │   │   └── [StatItem] (Temps, gold)
│   │   │
│   │   ├── [ProgressSection] (style: progressSection)
│   │   │   ├── [CategoryBadge] (icon + name)
│   │   │   ├── [ProgressBar] (animated fill)
│   │   │   └── [ProgressText] ("X/Y")
│   │   │
│   │   └── [ButtonsSection] (style: buttonsSection, animated fade-in)
│   │       ├── [PrimaryButton] ("🚀 Niveau suivant")
│   │       ├── [SecondaryButton] ("🔄 Rejouer ce niveau")
│   │       └── [TextButton] ("Retour à l'accueil")
│   │
│   └── [MascotCelebration] (style: mascot, bottom-right)
│       ├── [SpeechBubble] (contextual message)
│       ├── [GarageMascot] (Gus celebrating, animated jump)
│       └── [FlyingWrench] (animated spin)
```

---

## 🎨 STYLES

```typescript
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

export const styles = StyleSheet.create({
  // === OVERLAY ===
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },

  // === CONFETTI ===
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  
  confetti: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  // === TAXI EXIT ===
  taxiExitContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    height: 80,
    overflow: 'hidden',
  },
  
  road: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#3D3D3D',
  },
  
  roadLine: {
    position: 'absolute',
    top: '50%',
    height: 4,
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
  
  exitingTaxi: {
    position: 'absolute',
    bottom: 10,
    fontSize: 48,
  },

  // === FLYING EMOJIS ===
  flyingEmoji: {
    position: 'absolute',
    fontSize: 32,
  },

  // === SPARKLES ===
  sparkle: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#FFD93D',
    borderRadius: 4,
  },

  // === POPUP ===
  popup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    width: isTablet ? 580 : 340,
    maxWidth: '90%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.4,
    shadowRadius: 80,
    elevation: 20,
  },

  // === POPUP HEADER ===
  popupHeader: {
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 80,
    alignItems: 'center',
    overflow: 'hidden',
    // LinearGradient: ['#FFD93D', '#FFB347']
  },
  
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
    backgroundColor: 'rgba(255,255,255,0.3)',
    transformOrigin: 'center top',
  },
  
  victoryTitle: {
    fontFamily: 'Fredoka',
    fontSize: isTablet ? 48 : 36,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 15,
    zIndex: 2,
  },
  
  victorySubtitle: {
    fontFamily: 'Nunito',
    fontSize: isTablet ? 20 : 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 8,
    zIndex: 2,
  },
  
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 20,
    zIndex: 2,
  },
  
  star: {
    fontSize: isTablet ? 48 : 36,
  },
  
  starEmpty: {
    opacity: 0.4,
    // grayscale filter (use tintColor or separate image)
  },

  // === BADGE SECTION ===
  badgeSection: {
    paddingHorizontal: 30,
    paddingBottom: 20,
    marginTop: -50,
    alignItems: 'center',
    zIndex: 3,
  },
  
  badgeCard: {
    backgroundColor: '#FFF9F0',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD93D',
    shadowColor: '#FFB347',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  
  newTag: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#E74C3C',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    transform: [{ rotate: '15deg' }],
  },
  
  newTagText: {
    fontFamily: 'Fredoka',
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  
  badgeIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  
  badgeName: {
    fontFamily: 'Fredoka',
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3436',
  },
  
  badgeMessage: {
    fontFamily: 'Nunito',
    fontSize: 14,
    color: '#7A7A7A',
    marginTop: 4,
  },

  // === STATS SECTION ===
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: isTablet ? 40 : 24,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderTopWidth: 2,
    borderTopColor: '#F0F0F0',
  },
  
  statItem: {
    alignItems: 'center',
  },
  
  statValue: {
    fontFamily: 'Fredoka',
    fontSize: isTablet ? 36 : 28,
    fontWeight: '700',
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
    fontFamily: 'Nunito',
    fontSize: 14,
    color: '#9A9A9A',
    marginTop: 4,
  },
  
  perfectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(123, 199, 77, 0.15)',
    borderWidth: 2,
    borderColor: '#7BC74D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  
  perfectBadgeText: {
    fontFamily: 'Fredoka',
    fontSize: 13,
    fontWeight: '700',
    color: '#5BAE6B',
  },

  // === PROGRESS SECTION ===
  progressSection: {
    paddingHorizontal: 30,
    paddingVertical: 16,
  },
  
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  
  categoryIcon: {
    fontSize: 18,
  },
  
  categoryName: {
    fontFamily: 'Fredoka',
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
  },
  
  progressBarContainer: {
    flex: 1,
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
    // LinearGradient: ['#FFB347', '#FFA020']
  },
  
  progressText: {
    fontFamily: 'Fredoka',
    fontSize: 14,
    fontWeight: '600',
    color: '#7A7A7A',
  },

  // === BUTTONS SECTION ===
  buttonsSection: {
    paddingHorizontal: 30,
    paddingBottom: 30,
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
    // LinearGradient: ['#FFD700', '#FFA500']
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  
  primaryButtonText: {
    fontFamily: 'Fredoka',
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  
  secondaryButtonText: {
    fontFamily: 'Fredoka',
    fontSize: 16,
    fontWeight: '600',
    color: '#4A4A4A',
  },
  
  textButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  
  textButtonText: {
    fontFamily: 'Nunito',
    fontSize: 14,
    fontWeight: '600',
    color: '#9A9A9A',
  },

  // === MASCOT CELEBRATION ===
  mascotContainer: {
    position: 'absolute',
    bottom: 50,
    right: isTablet ? 80 : 20,
    alignItems: 'center',
  },
  
  mascotSpeechBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    maxWidth: 180,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  
  mascotSpeechArrow: {
    position: 'absolute',
    bottom: -8,
    left: 30,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },
  
  mascotSpeechText: {
    fontFamily: 'Nunito',
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    lineHeight: 20,
    textAlign: 'center',
  },
  
  flyingWrench: {
    position: 'absolute',
    top: -20,
    right: -10,
    fontSize: 24,
  },
});
```

### Couleurs Confettis
```typescript
const CONFETTI_COLORS = [
  '#5B8DEE', // Blue
  '#FFB347', // Orange
  '#7BC74D', // Green
  '#E056FD', // Purple
  '#FFD93D', // Yellow
  '#FF6B6B', // Red
];
```

---

## 🎬 ANIMATIONS

### Séquence d'Animations (Timeline)
```typescript
const ANIMATION_TIMELINE = {
  overlay: { delay: 0, duration: 300 },
  confetti: { delay: 0, duration: 3000 },
  taxiExit: { delay: 0, duration: 1500 },
  popup: { delay: 500, duration: 600 },
  title: { delay: 800, duration: 600 },
  stars: { delay: 1000, duration: 500, stagger: 200 },
  badge: { delay: 1600, duration: 500 },
  stats: { delay: 2000, duration: 500 },
  progress: { delay: 2200, duration: 500 },
  buttons: { delay: 2400, duration: 500 },
  mascot: { delay: 2600, duration: 500 },
  flyingEmojis: { delay: 1000, duration: 2000 },
};
```

### Animation 1 : Overlay Fade In
```typescript
const overlayStyle = useAnimatedStyle(() => ({
  opacity: withTiming(1, { duration: 300 }),
}));
```

### Animation 2 : Confetti Fall
```typescript
const createConfettiAnimation = (index: number) => {
  const delay = index * 100;
  return useAnimatedStyle(() => ({
    opacity: withDelay(delay, withSequence(
      withTiming(1, { duration: 0 }),
      withTiming(0, { duration: 3000 })
    )),
    transform: [
      { translateY: withDelay(delay, withTiming(height, { 
        duration: 3000,
        easing: Easing.out(Easing.quad)
      }))},
      { rotate: withDelay(delay, withTiming('720deg', { duration: 3000 })) },
      { scale: withDelay(delay, withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.5, { duration: 1500 })
      ))}
    ],
  }));
};
```

### Animation 3 : Taxi Exit
```typescript
const taxiExitStyle = useAnimatedStyle(() => ({
  transform: [
    { translateX: withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(100, { duration: 300 }),
      withTiming(width + 100, { duration: 500 })
    )},
    { scale: withDelay(300, withTiming(0.5, { duration: 500 })) },
  ],
  opacity: withDelay(600, withTiming(0, { duration: 200 })),
}));
```

### Animation 4 : Road Lines
```typescript
const roadLineStyle = useAnimatedStyle(() => ({
  transform: [
    { translateX: withRepeat(
      withTiming(-40, { duration: 500, easing: Easing.linear }),
      -1,
      false
    )}
  ],
}));
```

### Animation 5 : Popup Bounce In
```typescript
const popupStyle = useAnimatedStyle(() => ({
  opacity: withDelay(500, withTiming(1, { duration: 300 })),
  transform: [
    { scale: withDelay(500, withSpring(1, { 
      damping: 12, 
      stiffness: 180,
      mass: 0.8
    }))},
    { translateY: withDelay(500, withSpring(0, { 
      damping: 15, 
      stiffness: 150 
    }))}
  ],
}));
// Initial: opacity: 0, scale: 0.5, translateY: 50
```

### Animation 6 : Title Bounce
```typescript
const titleStyle = useAnimatedStyle(() => ({
  transform: [
    { scale: withDelay(800, withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(1.2, { duration: 300 }),
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 200 })
    ))}
  ],
}));
```

### Animation 7 : Stars Pop (Staggered)
```typescript
const createStarAnimation = (index: number) => {
  const delay = 1000 + index * 200;
  return useAnimatedStyle(() => ({
    opacity: withDelay(delay, withTiming(1, { duration: 200 })),
    transform: [
      { scale: withDelay(delay, withSpring(1, { 
        damping: 8, 
        stiffness: 200 
      }))},
      { rotate: withDelay(delay, withSequence(
        withTiming('-180deg', { duration: 0 }),
        withSpring('0deg', { damping: 12, stiffness: 150 })
      ))}
    ],
  }));
};
// Initial: opacity: 0, scale: 0, rotate: -180deg
```

### Animation 8 : Rotating Rays
```typescript
const raysStyle = useAnimatedStyle(() => ({
  transform: [
    { rotate: withRepeat(
      withTiming('360deg', { duration: 10000, easing: Easing.linear }),
      -1,
      false
    )}
  ],
}));
```

### Animation 9 : Perfect Badge Pulse
```typescript
const perfectBadgeStyle = useAnimatedStyle(() => ({
  transform: [
    { scale: withRepeat(
      withSequence(
        withTiming(1.05, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      -1,
      true
    )}
  ],
}));
```

### Animation 10 : Gus Jump
```typescript
const gusJumpStyle = useAnimatedStyle(() => ({
  transform: [
    { translateY: withRepeat(
      withSequence(
        withTiming(-20, { duration: 500 }),
        withTiming(0, { duration: 500 })
      ),
      -1,
      true
    )},
    { rotate: withRepeat(
      withSequence(
        withTiming('-5deg', { duration: 500 }),
        withTiming('5deg', { duration: 500 })
      ),
      -1,
      true
    )}
  ],
}));
```

### Animation 11 : Flying Wrench
```typescript
const wrenchStyle = useAnimatedStyle(() => ({
  transform: [
    { rotate: withRepeat(
      withTiming('360deg', { duration: 1000, easing: Easing.linear }),
      -1,
      false
    )},
    { translateY: withRepeat(
      withSequence(
        withTiming(-10, { duration: 500 }),
        withTiming(0, { duration: 500 })
      ),
      -1,
      true
    )}
  ],
}));
```

### Animation 12 : Flying Emojis
```typescript
const createFlyingEmojiAnimation = (index: number) => {
  const delay = 1000 + index * 300;
  const randomX = Math.random() * width;
  return useAnimatedStyle(() => ({
    opacity: withDelay(delay, withSequence(
      withTiming(1, { duration: 200 }),
      withDelay(1500, withTiming(0, { duration: 300 }))
    )),
    transform: [
      { translateX: randomX },
      { translateY: withDelay(delay, withTiming(-200, { 
        duration: 2000,
        easing: Easing.out(Easing.quad)
      }))}
    ],
  }));
};
```

### Animation 13 : Sparkles Pulse
```typescript
const sparkleStyle = useAnimatedStyle(() => ({
  opacity: withRepeat(
    withSequence(
      withTiming(0, { duration: 750 }),
      withTiming(1, { duration: 750 })
    ),
    -1,
    true
  ),
  transform: [
    { scale: withRepeat(
      withSequence(
        withTiming(0, { duration: 750 }),
        withTiming(1, { duration: 750 })
      ),
      -1,
      true
    )}
  ],
}));
```

### Animation 14 : Progress Bar Fill
```typescript
const progressFillStyle = useAnimatedStyle(() => ({
  width: withDelay(2200, withTiming(`${progress}%`, { 
    duration: 800,
    easing: Easing.out(Easing.cubic)
  })),
}));
```

| Élément | Animation | Delay | Durée |
|---------|-----------|-------|-------|
| Overlay | fadeIn | 0ms | 300ms |
| Confetti | fall + rotate + scale | stagger 100ms | 3s |
| Taxi | exit right + scale down | 0ms | 1.5s |
| Road lines | scroll | 0ms | infinite |
| Popup | bounce in | 500ms | 600ms |
| Title | bounce scale | 800ms | 600ms |
| Stars | pop + rotate | 1s/1.2s/1.4s | 500ms each |
| Badge | fade up | 1.6s | 500ms |
| Stats | fade up | 2s | 500ms |
| Progress bar | fill | 2.2s | 800ms |
| Buttons | fade up | 2.4s | 500ms |
| Mascot speech | pop | 2.6s | 500ms |
| Flying emojis | float up | stagger 300ms | 2s |
| Sparkles | pulse | 0ms | infinite |
| Rays | rotate | 0ms | 10s infinite |
| Gus | jump + rotate | 0ms | 1s infinite |
| Wrench | spin + float | 0ms | 1s infinite |
| Perfect badge | pulse | 0ms | 1s infinite |

---

## 👆 INTERACTIONS

| Élément | Geste | Feedback |
|---------|-------|----------|
| PrimaryButton | onPress | scale 0.95, navigate to next level |
| SecondaryButton | onPress | scale 0.95, restart current level |
| TextButton | onPress | opacity 0.7, navigate to home |
| Popup | none | not dismissable by tap outside |

---

## 👶 CONTRAINTES ENFANT

- [x] Touch targets ≥ 64dp (buttons full width, min height 56dp)
- [x] Contraste ≥ 4.5:1
- [x] Feedback immédiat sur tap
- [x] Pas de feedback punitif (all positive)
- [x] Animations joyeuses et célébratoires
- [x] Message personnalisé selon performance

---

## 🖼️ ASSETS

### Emojis/Icônes
| Usage | Valeur |
|-------|--------|
| Title decoration | 🎉 |
| Stars | ⭐ |
| Trophy | 🏆 |
| Flying emojis | 🚗⭐🔧🚕🎉 |
| Next level | 🚀 |
| Replay | 🔄 |
| Perfect badge | 🏆 |
| Category icons | 🌱 🔧 ⚙️ 🏆 👑 |
| Wrench | 🔧 |

### Collectible Cards (Unlockable)
| Niveau | Carte | Emoji |
|--------|-------|-------|
| 1-10 | Taxi New-Yorkais | 🚕 |
| 11-20 | Bus Londonien | 🚌 |
| 21-30 | Tuk-Tuk Thaïlandais | 🛺 |
| 31-40 | Coccinelle Vintage | 🐞 |
| 41-50 | Voiture de Course | 🏎️ |
| 51-60 | Monster Truck | 🛻 |
| 61-70 | Limousine | 🚙 |
| 71-80 | Voiture Volante | 🚀 |

### Sons
| Événement | Fichier |
|-----------|---------|
| Victory fanfare | victory-fanfare.mp3 |
| Star pop | star-pop.mp3 |
| Badge unlock | badge-unlock.mp3 |
| Button tap | soft-tap.mp3 |
| Confetti | confetti-pop.mp3 |

---

## 🧩 COMPOSANTS À CRÉER

### ConfettiLayer
```typescript
interface ConfettiLayerProps {
  count?: number;
  colors?: string[];
  duration?: number;
}
```

### VictoryStar
```typescript
interface VictoryStarProps {
  index: number; // 0, 1, 2
  filled: boolean;
  size?: number;
  delay?: number;
}
```

### StatItem
```typescript
interface StatItemProps {
  value: string | number;
  label: string;
  color: 'blue' | 'green' | 'gold';
  badge?: {
    icon: string;
    text: string;
  };
}
```

### ProgressBar
```typescript
interface ProgressBarProps {
  current: number;
  total: number;
  categoryIcon: string;
  categoryName: string;
  animated?: boolean;
}
```

---

## 💬 NOTES CLAUDE CODE

1. **Star Calculation** : 
   - 3 stars: moves ≤ optimal + 2
   - 2 stars: moves ≤ optimal + 5
   - 1 star: level completed
2. **Confetti Positions** : Distribute evenly across top (10%, 20%, 30%...) with random slight offset
3. **Flying Emojis** : Start from bottom center, float up with random X drift
4. **Perfect Badge** : Only show when moves === optimal
5. **Badge Unlock** : Show new collectible card if unlocked, otherwise hide badge section
6. **Progress Calculation** : (completed levels in category) / (total levels in category)
7. **Mascot Message** : 
   - Perfect: "SUPER PLANIFICATION ! Tu es un vrai pro ! 🔧⭐"
   - Near optimal (≤+2): "Excellente stratégie ! 🚗✨"
   - Good (≤+5): "Bien joué ! Tu progresses ! 🔧"
   - Completed: "Bravo, tu as réussi ! 🚕"
8. **Next Level Logic** : If current was last in category, show "Catégorie suivante" or "Retour" if all complete

---

## 🔧 PROPS POUR L'ÉCRAN

```typescript
interface EmbouteillageVictoryScreenProps {
  puzzleId: number;
  moves: number;
  optimal: number;
  time: number; // seconds
  stars: 1 | 2 | 3;
  category: string;
  categoryIcon: string;
  categoryProgress: { current: number; total: number };
  unlockedCard?: CollectibleCard;
  unlockedBadge?: Badge;
  isPerfect: boolean;
  isNewRecord: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onHome: () => void;
}
```

---
