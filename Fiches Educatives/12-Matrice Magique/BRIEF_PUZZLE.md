# BRIEF REACT NATIVE : MatricesPuzzleScreen

## 📋 MÉTADONNÉES
| Champ | Valeur |
|-------|--------|
| **Type** | Screen |
| **Priorité** | P0 Critical |
| **Fichier HTML** | matrices-puzzle.html |
| **Route** | `/app/(games)/matrices-magiques/puzzle.tsx` |
| **Dépendances** | MatrixGrid, MatrixCell, ChoicePanel, PixelMascot, HintPopup, FeedbackOverlay |

---

## 🌳 STRUCTURE HIÉRARCHIQUE

```
MatricesPuzzleScreen
├── [Container] (style: container, LinearGradient per world)
│   │
│   ├── [BackgroundDecorations] (animated, position: absolute, z: 0)
│   │   ├── [Stars] × 20 (twinkling, space theme)
│   │   └── [ThemeDecorations] (planets, trees, etc. per world)
│   │
│   ├── [Header] (style: header, z: 10)
│   │   ├── [WorldTitle] (icon + name)
│   │   ├── [ProgressDots] × 8 (completed/current/remaining)
│   │   ├── [StarsDisplay] (⭐ count)
│   │   └── [HintButton] (touchable, 64×64, with counter)
│   │
│   ├── [GameArea] (style: gameArea, flex: 1)
│   │   │
│   │   ├── [MatrixSection] (style: matrixSection)
│   │   │   └── [MatrixGrid] (3×3 or 2×2)
│   │   │       ├── [MatrixCell] × 8 (filled cells with shapes)
│   │   │       │   └── [ShapeContent] (colored shape)
│   │   │       └── [TargetCell] (style: targetCell, animated pulse)
│   │   │           └── [QuestionMark] "?" (animated)
│   │   │
│   │   ├── [ChoicesSection] (style: choicesSection)
│   │   │   ├── [ChoiceButton] × 6 (touchable, 100×100)
│   │   │   │   └── [ShapeContent] (colored shape)
│   │   │   └── [AttemptsDisplay] (3 dots)
│   │   │
│   │   └── [MascotSection] (style: mascotSection)
│   │       ├── [PixelMascot] (120×140, floating)
│   │       └── [SpeechBubble] (contextual message)
│   │
│   ├── [ValidateButton] (style: validateButton, touchable, disabled state)
│   │   └── [Text] "Valider"
│   │
│   └── [Overlays] (z: 100)
│       ├── [HintPopup] (modal, when hint requested)
│       │   ├── [HintHeader] "💡 Indice"
│       │   ├── [HintLevels] × 4 (buttons with cost)
│       │   ├── [HintContent] (revealed hint text)
│       │   └── [CloseButton]
│       │
│       └── [FeedbackOverlay] (modal, after answer)
│           ├── [FeedbackCard] (success/encourage)
│           │   ├── [Icon] (⭐ or 💪)
│           │   ├── [Message] ("Super !" or "Presque !")
│           │   └── [ActionButton] ("Puzzle suivant" or "Réessayer")
│           └── [Confetti] (if success, animated)
```

---

## 🎨 STYLES REACT NATIVE

```typescript
import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const GRID_SIZE_3x3 = Math.min(450, SCREEN_WIDTH - 48);
const CELL_SIZE_3x3 = (GRID_SIZE_3x3 - 16) / 3; // ~130px with gaps

export const styles = StyleSheet.create({
  // Container - gradient changes per world
  container: {
    flex: 1,
  },
  
  // World gradients:
  // Forest: ['#1a4d2e', '#2d5a3d', '#87CEEB']
  // Space: ['#1A1A2E', '#16213E', '#0F3460']
  // Castle: ['#4A235A', '#633974', '#9B59B6']
  // Atelier: ['#F5E6D3', '#FFE8CC', '#FFF5E6']
  // Mystery: ['#0D0D0D', '#1A1A2E', '#2D2D44']

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },

  worldTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  worldIcon: {
    fontSize: 24,
  },

  worldName: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 20,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  progressDots: {
    flexDirection: 'row',
    gap: 8,
  },

  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },

  progressDotCompleted: {
    backgroundColor: '#7BC74D',
  },

  progressDotCurrent: {
    backgroundColor: '#FFFFFF',
    // Pulsing animation
  },

  starsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  starsIcon: {
    fontSize: 18,
  },

  starsCount: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },

  hintButton: {
    width: 64,
    height: 64,
    backgroundColor: '#F39C12',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow
    shadowColor: '#F39C12',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },

  hintIcon: {
    fontSize: 28,
  },

  hintCounter: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },

  hintDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },

  hintDotUsed: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },

  // Game Area
  gameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  // Matrix Section
  matrixSection: {
    marginBottom: 32,
  },

  matrixGrid: {
    width: GRID_SIZE_3x3,
    height: GRID_SIZE_3x3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  matrixCell: {
    width: CELL_SIZE_3x3,
    height: CELL_SIZE_3x3,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  targetCell: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 3,
    borderColor: '#FFD93D',
    borderStyle: 'dashed',
    // Pulsing glow animation
  },

  questionMark: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 48,
    color: '#FFD93D',
    textShadowColor: 'rgba(255, 217, 61, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },

  shapeInCell: {
    width: '70%',
    height: '70%',
  },

  // Choices Section
  choicesSection: {
    alignItems: 'center',
    marginBottom: 24,
  },

  choicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    maxWidth: 380,
  },

  choiceButton: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  choiceSelected: {
    borderColor: '#5B8DEE',
    backgroundColor: '#FFFFFF',
    // Glow effect
    shadowColor: '#5B8DEE',
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },

  choiceCorrect: {
    borderColor: '#7BC74D',
    backgroundColor: '#E8F8E0',
  },

  choiceIncorrect: {
    borderColor: '#FFB347',
    backgroundColor: '#FFF4E6',
  },

  attemptsDisplay: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },

  attemptDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },

  attemptDotUsed: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },

  // Mascot Section
  mascotSection: {
    position: 'absolute',
    bottom: 120,
    right: 24,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },

  mascotSmall: {
    width: 100,
    height: 120,
  },

  speechBubbleSmall: {
    maxWidth: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  speechTextSmall: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: '#4A4A4A',
    lineHeight: 20,
  },

  // Validate Button
  validateButton: {
    width: 200,
    height: 64,
    backgroundColor: '#5B8DEE',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    // Shadow
    shadowColor: '#5B8DEE',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },

  validateButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    shadowOpacity: 0,
    elevation: 0,
  },

  validateText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 20,
    color: '#FFFFFF',
  },

  validateTextDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },

  // Hint Popup
  hintOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },

  hintPopup: {
    width: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    overflow: 'hidden',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 15,
  },

  hintHeader: {
    backgroundColor: '#F39C12',
    padding: 20,
    alignItems: 'center',
  },

  hintTitle: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 24,
    color: '#FFFFFF',
  },

  hintLevels: {
    padding: 20,
    gap: 12,
  },

  hintLevelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  hintLevelActive: {
    borderColor: '#F39C12',
    backgroundColor: '#FFF8E6',
  },

  hintLevelUsed: {
    opacity: 0.5,
  },

  hintLevelText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: '#4A4A4A',
    flex: 1,
  },

  hintCost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  hintCostText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 14,
    color: '#F39C12',
  },

  hintContent: {
    padding: 20,
    backgroundColor: '#FFF8E6',
  },

  hintContentText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: '#4A4A4A',
    lineHeight: 24,
    textAlign: 'center',
  },

  hintCloseButton: {
    margin: 20,
    padding: 16,
    backgroundColor: '#F39C12',
    borderRadius: 16,
    alignItems: 'center',
  },

  hintCloseText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },

  // Feedback Overlay
  feedbackOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },

  feedbackCard: {
    width: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 15,
  },

  feedbackIcon: {
    fontSize: 64,
    marginBottom: 16,
  },

  feedbackMessage: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 28,
    color: '#2D3436',
    marginBottom: 8,
    textAlign: 'center',
  },

  feedbackSubtext: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: '#7A7A7A',
    marginBottom: 24,
    textAlign: 'center',
  },

  feedbackButton: {
    width: '100%',
    padding: 16,
    backgroundColor: '#5B8DEE',
    borderRadius: 16,
    alignItems: 'center',
  },

  feedbackButtonText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },

  // Background Decorations
  twinklingStar: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },

  planet: {
    position: 'absolute',
    fontSize: 40,
  },
});
```

### Couleurs utilisées
| Variable | Hex | Usage |
|----------|-----|-------|
| `space.bg1` | #1A1A2E | Background sombre (Space) |
| `space.bg2` | #16213E | Background mid |
| `space.bg3` | #0F3460 | Background light |
| `surface` | #FFFFFF (0.95 alpha) | Cellules, cartes |
| `target.border` | #FFD93D | Bordure cellule cible |
| `selected.border` | #5B8DEE | Choix sélectionné |
| `correct.border` | #7BC74D | Bonne réponse |
| `correct.bg` | #E8F8E0 | Fond bonne réponse |
| `incorrect.border` | #FFB347 | Mauvaise réponse (doux) |
| `incorrect.bg` | #FFF4E6 | Fond erreur (doux) |
| `hint` | #F39C12 | Bouton indice |

### Gradients par Monde (fond d'écran)
| Monde | Couleurs | Notes |
|-------|----------|-------|
| Forest | ['#1a4d2e', '#2d5a3d', '#87CEEB'] | Forêt → ciel |
| Space | ['#1A1A2E', '#16213E', '#0F3460'] | Nuit étoilée |
| Castle | ['#4A235A', '#633974', '#9B59B6'] | Violet royal |
| Atelier | ['#F5E6D3', '#FFE8CC', '#FFF5E6'] | Crème artistique |
| Mystery | ['#0D0D0D', '#1A1A2E', '#2D2D44'] | Noir mystique |

---

## 🎬 ANIMATIONS (Reanimated 3)

### Animation 1 : Target Cell Pulse
```typescript
const targetPulseStyle = useAnimatedStyle(() => {
  return {
    transform: [
      { scale: withRepeat(
        withSequence(
          withTiming(1.05, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        false
      )},
    ],
    shadowOpacity: withRepeat(
      withSequence(
        withTiming(0.6, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      false
    ),
  };
});
```

| Propriété | De | Vers | Durée | Type | Loop |
|-----------|-----|------|-------|------|------|
| scale | 1 | 1.05 | 1600ms | sequence | infinite |
| shadowOpacity | 0.3 | 0.6 | 1600ms | sequence | infinite |

### Animation 2 : Choice Selection
```typescript
const selectedStyle = useAnimatedStyle(() => {
  return {
    transform: [
      { scale: withSpring(isSelected ? 1.08 : 1, { damping: 12, stiffness: 200 }) },
    ],
    borderColor: withTiming(isSelected ? '#5B8DEE' : 'transparent', { duration: 150 }),
  };
});
```

### Animation 3 : Correct Answer
```typescript
const correctSequence = () => {
  // 1. Scale bounce
  scale.value = withSequence(
    withSpring(1.15, { damping: 8, stiffness: 300 }),
    withSpring(1, { damping: 12 })
  );
  // 2. Color change
  borderColor.value = withTiming('#7BC74D', { duration: 200 });
  backgroundColor.value = withTiming('#E8F8E0', { duration: 200 });
  // 3. Fly to target (after delay)
  translateX.value = withDelay(400, withTiming(targetX, { duration: 400 }));
  translateY.value = withDelay(400, withTiming(targetY, { duration: 400 }));
  opacity.value = withDelay(750, withTiming(0, { duration: 150 }));
};
```

| Phase | Propriété | Valeur | Durée | Delay |
|-------|-----------|--------|-------|-------|
| 1 | scale | 1 → 1.15 → 1 | 300ms | 0ms |
| 2 | borderColor | → #7BC74D | 200ms | 0ms |
| 3 | translateX/Y | → target | 400ms | 400ms |
| 4 | opacity | 1 → 0 | 150ms | 750ms |

### Animation 4 : Incorrect Answer (Shake)
```typescript
const incorrectShake = () => {
  translateX.value = withSequence(
    withTiming(-8, { duration: 50 }),
    withTiming(8, { duration: 50 }),
    withTiming(-8, { duration: 50 }),
    withTiming(8, { duration: 50 }),
    withTiming(0, { duration: 50 })
  );
  // Soft orange flash (NOT red)
  borderColor.value = withSequence(
    withTiming('#FFB347', { duration: 100 }),
    withDelay(200, withTiming('transparent', { duration: 200 }))
  );
};
```

### Animation 5 : Twinkling Stars (Background)
```typescript
const twinkleStyle = useAnimatedStyle(() => {
  return {
    opacity: withRepeat(
      withSequence(
        withTiming(0.2, { duration: 1000 + Math.random() * 1000 }),
        withTiming(1, { duration: 1000 + Math.random() * 1000 })
      ),
      -1,
      false
    ),
  };
});
```

### Animation 6 : Mascot Float
```typescript
const floatStyle = useAnimatedStyle(() => {
  return {
    transform: [
      { translateY: withRepeat(
        withSequence(
          withTiming(-8, { duration: 1500 }),
          withTiming(0, { duration: 1500 })
        ),
        -1,
        false
      )},
    ],
  };
});
```

### Animation 7 : Feedback Popup Appear
```typescript
const popupStyle = useAnimatedStyle(() => {
  return {
    opacity: withTiming(1, { duration: 200 }),
    transform: [
      { scale: withSpring(1, { damping: 12, stiffness: 150 }) },
      { translateY: withSpring(0, { damping: 15 }) },
    ],
  };
});
// Initial: opacity: 0, scale: 0.8, translateY: 50
```

### Animation 8 : Confetti (Success)
```typescript
// Create 20+ confetti pieces with staggered animations
const confettiStyle = (index: number) => useAnimatedStyle(() => {
  const delay = index * 50;
  return {
    transform: [
      { translateY: withDelay(delay, withTiming(800, { duration: 2000 })) },
      { translateX: withDelay(delay, withTiming(
        (Math.random() - 0.5) * 200, 
        { duration: 2000 }
      ))},
      { rotate: `${withDelay(delay, withTiming(720, { duration: 2000 }))}deg` },
    ],
    opacity: withDelay(delay + 1500, withTiming(0, { duration: 500 })),
  };
});
```

---

## 👆 INTERACTIONS & GESTURES

### Boutons
| Élément | Geste | Feedback visuel | Feedback haptique |
|---------|-------|-----------------|-------------------|
| ChoiceButton | onPress | scale 0.95 → 1.08 (selected) | impactLight |
| HintButton | onPress | scale 0.9 → 1, glow pulse | impactMedium |
| ValidateButton | onPress | scale 0.95 → 1 | impactMedium |
| ValidateButton (disabled) | onPress | shake léger | none |

### Choice Selection Flow
```typescript
const handleChoicePress = (choiceId: string) => {
  // 1. Deselect previous
  if (selectedChoice) {
    // Animate previous to normal state
  }
  // 2. Select new
  setSelectedChoice(choiceId);
  // 3. Animate selection
  // 4. Enable validate button
};
```

### Validate Flow
```typescript
const handleValidate = () => {
  if (!selectedChoice) return;
  
  const isCorrect = checkAnswer(selectedChoice);
  
  if (isCorrect) {
    // 1. Play correct animation on choice
    // 2. Fly choice to target cell
    // 3. Show success feedback
    // 4. After delay, next puzzle or victory
  } else {
    // 1. Shake choice
    // 2. Decrement attempts
    // 3. Update mascot message
    // 4. If attempts === 0, reveal + move on
  }
};
```

---

## 👶 CONTRAINTES UX ENFANT

### Zones tactiles
- [x] ChoiceButton : 100×100 dp ✓
- [x] HintButton : 64×64 dp ✓
- [x] ValidateButton : 200×64 dp ✓
- [x] Espacement entre choix : 12dp ✓

### Accessibilité
- [x] Formes avec couleur + forme différente (pas couleur seule)
- [x] Target cell : bordure pointillée + "?" + glow
- [x] Sélection : bordure bleue + scale up (double feedback)
- [x] Erreur : ORANGE doux, jamais rouge

```typescript
// ChoiceButton
accessibilityLabel={`Choix ${index + 1}: ${shapeDescription}`}
accessibilityHint="Appuie pour sélectionner cette réponse"
accessibilityRole="button"
accessibilityState={{ selected: isSelected }}
```

### Feedback obligatoire
- [x] Selection immédiate avec scale + border
- [x] Correct = scale bounce + fly animation + confetti
- [x] Incorrect = shake doux + orange flash (pas de buzzer)
- [x] Mascotte réagit à chaque action

### Erreurs non punitives
- [x] 3 tentatives par puzzle
- [x] Message d'encouragement après erreur ("Presque !")
- [x] Après 3 erreurs : révélation douce + explication
- [x] JAMAIS de son négatif, JAMAIS de rouge

---

## 🖼️ ASSETS & RESSOURCES

### Emojis/Icônes
| Usage | Emoji/Icône | Fallback |
|-------|-------------|----------|
| Hint | 💡 | Lucide: Lightbulb |
| Success | ⭐ | Lucide: Star |
| Encourage | 💪 | Lucide: ThumbsUp |
| Target | ❓ | Text: "?" |
| Progress complete | ● (filled) | - |
| Progress current | ◐ (half) | - |
| Progress remaining | ○ (empty) | - |

### Formes (SVG ou composants)
| Forme | Couleurs | Notes |
|-------|----------|-------|
| Circle | Rouge, Bleu, Vert, Jaune | Filled |
| Square | Rouge, Bleu, Vert, Jaune | Filled |
| Triangle | Rouge, Bleu, Vert, Jaune | Filled, pointing up |
| Star | Rouge, Bleu, Vert, Jaune | 5 points |
| Heart | Rouge, Rose | Filled |
| Diamond | Bleu, Violet | Rotated square |

### Sons
| Événement | Fichier | Durée | Notes |
|-----------|---------|-------|-------|
| Select choice | tap.mp3 | 50ms | Click léger |
| Correct | success-chime.mp3 | 800ms | Mélodie joyeuse |
| Incorrect | soft-bonk.mp3 | 200ms | Son neutre, doux |
| Hint reveal | hint-reveal.mp3 | 300ms | Ding magique |
| Confetti | confetti.mp3 | 1000ms | Pétillement |

---

## 📱 RESPONSIVE & ADAPTATION

### iPad (principal)
| Élément | Valeur |
|---------|--------|
| Grid 3×3 | 450×450 |
| Cell size | ~130×130 |
| Choice size | 100×100 |
| Mascot | 100×120 |
| Font puzzle | 48px (?) |

### iPhone (secondaire)
| Élément | Valeur |
|---------|--------|
| Grid 3×3 | 300×300 |
| Cell size | ~90×90 |
| Choice size | 70×70 |
| Mascot | 80×100 |
| Font puzzle | 36px (?) |

### Adaptation par âge
| Élément | 7-8 ans | 9-10 ans |
|---------|---------|----------|
| Grid size | 2×2 mondes 1-2 | 3×3 mondes 3+ |
| Tentatives | 3 | 3 |
| Hint gratuit | Niveau 1 toujours | Niveau 1 toujours |
| Mascotte aide | Fréquente | Moins fréquente |

---

## 🧩 COMPOSANTS RÉUTILISABLES

### Design System existant
- [x] `<ProgressBar />` - Pour progress dots
- [x] `<Button variant="primary" />` - Validate button
- [ ] `<Modal />` - Pour HintPopup et FeedbackOverlay

### Composants à créer
- [ ] `<MatrixGrid size={2|3} cells={Cell[]} />` - Grille principale
- [ ] `<MatrixCell shape={Shape} isTarget={bool} />` - Cellule
- [ ] `<ChoicePanel choices={Choice[]} onSelect={} />` - Panel choix
- [ ] `<ShapeRenderer shape={ShapeConfig} size={} />` - Rendu formes
- [ ] `<HintPopup hints={Hint[]} onUse={} onClose={} />` - Popup indices
- [ ] `<FeedbackOverlay type="success|encourage" onAction={} />` - Feedback
- [ ] `<TwinklingStars count={20} />` - Étoiles arrière-plan
- [ ] `<ConfettiCannon />` - Confettis de célébration

---

## ✅ CHECKLIST AVANT IMPLÉMENTATION

### Structure
- [x] Arborescence des composants claire
- [x] Props définies pour chaque composant
- [x] Types TypeScript dans SPECS_TECHNIQUES.md

### Styles
- [x] Tous les styles traduits en StyleSheet
- [x] Gradients par monde identifiés
- [x] Shadows iOS + elevation Android

### Animations
- [x] Target pulse ✓
- [x] Choice selection ✓
- [x] Correct answer sequence ✓
- [x] Incorrect shake ✓
- [x] Twinkling stars ✓
- [x] Mascot float ✓
- [x] Feedback popup ✓
- [x] Confetti ✓

### UX Enfant
- [x] Touch targets ≥ 64dp vérifiés
- [x] Feedbacks sur interactions définis
- [x] Erreurs non punitives (orange, pas rouge)
- [x] Accessibilité prévue

---

## 💬 NOTES POUR CLAUDE CODE

1. **Puzzle Generation** : Utiliser le `puzzleEngine.ts` de la spec technique. La génération doit inclure des distracteurs plausibles (même couleur OU même forme, jamais random).

2. **State Management** : 
   - `currentPuzzle` : configuration du puzzle actuel
   - `selectedChoice` : ID du choix sélectionné
   - `attemptsRemaining` : 3 → 0
   - `hintsUsed` : [false, false, false, false]
   - `puzzleProgress` : index dans le monde

3. **Fly-to-Target Animation** : Calculer les coordonnées avec `measure()` ou `onLayout`. L'élément doit voler depuis sa position vers le centre de la cellule cible.

4. **Thèmes par Monde** : Le gradient de fond ET les décorations changent selon `worldId`. Utiliser un switch/map pour les couleurs.

5. **Mascotte Messages** : Importer depuis `pixelDialogues.ts`. Les messages sont contextuels :
   - Début puzzle : encouragement
   - Après 30s : petit conseil
   - Après erreur : réconfort
   - Après 2 erreurs : proposition d'indice

6. **Hint System** : Les indices sont progressifs. Niveau 1 gratuit, autres coûtent des étoiles. Une fois utilisé, un niveau reste révélé pour ce puzzle.

7. **Confetti** : Créer 20 éléments avec `map()`. Chaque confetti a position X aléatoire en haut, couleurs variées, rotation différente.

8. **Performance** : Les étoiles en arrière-plan peuvent impacter les performances. Utiliser `removeClippedSubviews` et limiter à 15-20 étoiles.

---

## 📄 CODE DE DÉMARRAGE

```typescript
// screens/MatricesPuzzleScreen.tsx
import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

import { MatrixGrid } from '../components/MatrixGrid';
import { ChoicePanel } from '../components/ChoicePanel';
import { PixelMascot } from '../components/PixelMascot';
import { HintPopup } from '../components/HintPopup';
import { FeedbackOverlay } from '../components/FeedbackOverlay';
import { TwinklingStars } from '../components/TwinklingStars';
import { useMatricesGame } from '../hooks/useMatricesGame';
import { WORLD_THEMES } from '../data/worlds';

export const MatricesPuzzleScreen: React.FC = () => {
  const { worldId } = useLocalSearchParams<{ worldId: string }>();
  const insets = useSafeAreaInsets();
  const theme = WORLD_THEMES[worldId];
  
  const {
    currentPuzzle,
    selectedChoice,
    attemptsRemaining,
    hintsUsed,
    mascotMessage,
    showHintPopup,
    showFeedback,
    feedbackType,
    selectChoice,
    validateAnswer,
    useHint,
    nextPuzzle,
  } = useMatricesGame(worldId);
  
  return (
    <LinearGradient
      colors={theme.gradient}
      style={styles.container}
    >
      <TwinklingStars count={20} />
      {/* Header */}
      {/* Game Area */}
      {/* Validate Button */}
      {showHintPopup && <HintPopup />}
      {showFeedback && <FeedbackOverlay type={feedbackType} />}
    </LinearGradient>
  );
};
```
