# BRIEF REACT NATIVE : ConteurQuestionsScreen

## 📋 MÉTADONNÉES
| Champ | Valeur |
|-------|--------|
| **Type** | Screen |
| **Priorité** | P0 Critical |
| **Dépendances** | PlumeMascot, QuestionCard, AnswerButton, FeedbackOverlay, ProgressDots |
| **Fichier HTML source** | conteur-questions.html |

---

## 🌳 STRUCTURE HIÉRARCHIQUE

```
ConteurQuestionsScreen
├── [Container] (style: container, flex: 1, flexDirection: row)
│   │
│   ├── [StoryRecapPanel] (style: recapPanel, width: 320)
│   │   ├── [PanelHeader]
│   │   │   └── [Title] "📖 L'histoire" (Fredoka 18px)
│   │   │
│   │   ├── [MiniScene] (style: miniScene, animated)
│   │   │   ├── [SceneImage] (180×120, rounded)
│   │   │   └── [AnimatedElements] (simplified)
│   │   │
│   │   ├── [SummaryText] (style: summaryText)
│   │   │   └── [HighlightedKeywords] (style: keyword, purple)
│   │   │
│   │   └── [ReplayButton] (touchable, 64 height)
│   │       ├── [Icon] 🔄
│   │       └── [Label] "Réécouter"
│   │
│   ├── [QuestionPanel] (style: questionPanel, flex: 1)
│   │   ├── [Header] (style: questionHeader)
│   │   │   ├── [ProgressDots] (5 dots)
│   │   │   │   └── [Dot] × 5 (completed/current/upcoming)
│   │   │   └── [ScoreBadge]
│   │   │       ├── [Icon] ⭐
│   │   │       └── [Score] "2/2"
│   │   │
│   │   ├── [QuestionCard] (style: questionCard, animated)
│   │   │   ├── [TypeBadge] (style: typeBadge, colored by type)
│   │   │   │   └── [TypeLabel] "🔍 Question factuelle"
│   │   │   ├── [QuestionText] (Fredoka 26px bold)
│   │   │   └── [HintText] (style: hintText, optional)
│   │   │
│   │   └── [AnswersGrid] (style: answersGrid, 2×2)
│   │       └── [AnswerButton] × 4 (touchable, animated)
│   │           ├── [LetterBadge] A/B/C/D (style: letterBadge)
│   │           ├── [AnswerText] (Nunito 18px)
│   │           └── [FeedbackIcon] ✓/✗ (conditional, animated)
│   │
│   └── [MascotPanel] (style: mascotPanel, width: 280)
│       ├── [PlumeMascot] (size: medium, 120×140, animated)
│       │   └── [AnimationState] (thinking/happy/encouraging)
│       │
│       ├── [SpeechBubble] (style: speechBubble, animated)
│       │   └── [DialogueText] (Nunito 16px)
│       │
│       └── [HintButton] (touchable, 64 height, conditional)
│           ├── [Icon] 💡
│           ├── [Label] "Indice"
│           └── [HintCounter] "●●●" (3 hints max)
│
└── [FeedbackOverlay] (animated, conditional)
    ├── [Overlay] (style: overlay, semi-transparent)
    └── [FeedbackCard] (style: feedbackCard, animated)
        ├── [ResultIcon] (64px, ⭐ or 💪)
        ├── [ResultTitle] "Super !" / "Presque !"
        ├── [Explanation] (style: explanation)
        └── [ActionButton] "Suivant" / "Réessayer"
```

---

## 🎨 STYLES REACT NATIVE

```typescript
import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 768;

export const ConteurColors = {
  primary: '#5B8DEE',
  secondary: '#9B59B6',
  accent: '#F39C12',
  success: '#7BC74D',
  encourage: '#FFB347', // Orange doux pour erreur (JAMAIS rouge)
  background: '#FFF9F0',
  surface: '#FFFFFF',
  text: '#2D3748',
  textSecondary: '#718096',
  // Types de questions
  questionTypes: {
    factual: '#5B8DEE',      // Bleu
    sequential: '#9B59B6',   // Violet
    causal: '#27AE60',       // Vert
    emotional: '#E91E63',    // Rose
    inferential: '#F39C12',  // Orange
    opinion: '#00BCD4',      // Cyan
  },
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: ConteurColors.background,
  },

  // Story Recap Panel
  recapPanel: {
    width: isTablet ? 320 : 0, // Hidden on iPhone
    backgroundColor: ConteurColors.surface,
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.05)',
    padding: 24,
  },
  recapTitle: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 18,
    color: ConteurColors.text,
    marginBottom: 20,
  },
  miniScene: {
    width: '100%',
    height: 140,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#87CEEB',
  },
  summaryText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 15,
    color: ConteurColors.text,
    lineHeight: 24,
    marginBottom: 20,
  },
  keyword: {
    fontFamily: 'Nunito-Bold',
    color: ConteurColors.secondary,
    backgroundColor: 'rgba(155, 89, 182, 0.1)',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  replayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 56,
    backgroundColor: 'rgba(155, 89, 182, 0.1)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: ConteurColors.secondary,
  },
  replayButtonText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 16,
    color: ConteurColors.secondary,
  },

  // Question Panel
  questionPanel: {
    flex: 1,
    padding: isTablet ? 40 : 24,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 12,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(155, 89, 182, 0.2)',
  },
  dotCompleted: {
    backgroundColor: ConteurColors.success,
  },
  dotCurrent: {
    backgroundColor: ConteurColors.secondary,
    transform: [{ scale: 1.2 }],
  },
  dotUpcoming: {
    backgroundColor: 'rgba(155, 89, 182, 0.2)',
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 217, 61, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  scoreIcon: {
    fontSize: 20,
  },
  scoreText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 18,
    color: ConteurColors.accent,
  },

  // Question Card
  questionCard: {
    backgroundColor: ConteurColors.surface,
    borderRadius: 28,
    padding: 32,
    marginBottom: 32,
    shadowColor: ConteurColors.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    marginBottom: 20,
  },
  typeBadgeText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 13,
    color: '#FFFFFF',
  },
  questionText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: isTablet ? 26 : 22,
    color: ConteurColors.text,
    lineHeight: isTablet ? 38 : 32,
    marginBottom: 12,
  },
  hintText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 15,
    color: ConteurColors.textSecondary,
    fontStyle: 'italic',
  },

  // Answers Grid
  answersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  answerButton: {
    width: '48%',
    minHeight: 80,
    backgroundColor: ConteurColors.surface,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 3,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  answerButtonSelected: {
    borderColor: ConteurColors.secondary,
    backgroundColor: 'rgba(155, 89, 182, 0.05)',
  },
  answerButtonCorrect: {
    borderColor: ConteurColors.success,
    backgroundColor: 'rgba(123, 199, 77, 0.1)',
  },
  answerButtonIncorrect: {
    borderColor: ConteurColors.encourage, // Orange, JAMAIS rouge
    backgroundColor: 'rgba(255, 179, 71, 0.1)',
  },
  letterBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterBadgeSelected: {
    backgroundColor: ConteurColors.secondary,
  },
  letterBadgeCorrect: {
    backgroundColor: ConteurColors.success,
  },
  letterBadgeIncorrect: {
    backgroundColor: ConteurColors.encourage,
  },
  letterText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 18,
    color: ConteurColors.textSecondary,
  },
  letterTextSelected: {
    color: '#FFFFFF',
  },
  answerText: {
    flex: 1,
    fontFamily: 'Nunito-SemiBold',
    fontSize: 17,
    color: ConteurColors.text,
    lineHeight: 24,
  },
  feedbackIcon: {
    fontSize: 24,
  },

  // Mascot Panel
  mascotPanel: {
    width: isTablet ? 280 : 0, // Hidden on iPhone
    backgroundColor: 'rgba(155, 89, 182, 0.05)',
    padding: 24,
    alignItems: 'center',
  },
  mascotContainer: {
    marginBottom: 20,
  },
  speechBubble: {
    backgroundColor: ConteurColors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
  },
  speechBubbleArrow: {
    position: 'absolute',
    top: -10,
    left: '50%',
    marginLeft: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: ConteurColors.surface,
  },
  dialogueText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: ConteurColors.text,
    lineHeight: 24,
    textAlign: 'center',
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: ConteurColors.accent,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: ConteurColors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  hintButtonDisabled: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
  },
  hintButtonText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  hintCounter: {
    flexDirection: 'row',
    gap: 4,
  },
  hintDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  hintDotUsed: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  // Feedback Overlay
  feedbackOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  feedbackCard: {
    width: isTablet ? 450 : '85%',
    backgroundColor: ConteurColors.surface,
    borderRadius: 32,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 20,
  },
  feedbackCardSuccess: {
    borderTopWidth: 6,
    borderTopColor: ConteurColors.success,
  },
  feedbackCardEncourage: {
    borderTopWidth: 6,
    borderTopColor: ConteurColors.encourage,
  },
  resultIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  resultTitle: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 32,
    marginBottom: 16,
  },
  resultTitleSuccess: {
    color: ConteurColors.success,
  },
  resultTitleEncourage: {
    color: ConteurColors.encourage,
  },
  explanation: {
    fontFamily: 'Nunito-Regular',
    fontSize: 17,
    color: ConteurColors.text,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 32,
    maxWidth: 350,
  },
  actionButton: {
    height: 60,
    paddingHorizontal: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonSuccess: {
    backgroundColor: ConteurColors.success,
  },
  actionButtonEncourage: {
    backgroundColor: ConteurColors.secondary,
  },
  actionButtonText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
});
```

### Couleurs par type de question
| Type | Couleur | Badge |
|------|---------|-------|
| Factuelle | #5B8DEE (bleu) | 🔍 |
| Séquentielle | #9B59B6 (violet) | 📋 |
| Causale | #27AE60 (vert) | 🔗 |
| Émotionnelle | #E91E63 (rose) | 💭 |
| Inférentielle | #F39C12 (orange) | 🔮 |
| Opinion | #00BCD4 (cyan) | 💡 |

---

## 🎬 ANIMATIONS (Reanimated 3)

### Animation 1 : Question Card Entrance
```typescript
const questionEntrance = useAnimatedStyle(() => ({
  opacity: withTiming(1, { duration: 400 }),
  transform: [
    { translateX: withSpring(0, { damping: 15, stiffness: 100 }) },
  ],
}));
```

| Propriété | De | Vers | Durée | Type |
|-----------|-----|------|-------|------|
| opacity | 0 | 1 | 400ms | timing |
| translateX | 100 | 0 | - | spring (d:15, s:100) |

### Animation 2 : Answer Button Correct
```typescript
const correctPulse = useAnimatedStyle(() => ({
  transform: [
    { scale: withSequence(
      withTiming(1.05, { duration: 150 }),
      withTiming(1, { duration: 150 })
    )}
  ],
  borderColor: withTiming('#7BC74D', { duration: 300 }),
}));
```

| Propriété | De | Vers | Durée | Type |
|-----------|-----|------|-------|------|
| scale | 1 | 1.05 → 1 | 300ms | sequence |
| borderColor | gray | #7BC74D | 300ms | timing |

### Animation 3 : Answer Button Incorrect (Shake)
```typescript
const incorrectShake = useAnimatedStyle(() => ({
  transform: [
    { translateX: withSequence(
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(0, { duration: 50 })
    )}
  ],
  borderColor: withTiming('#FFB347', { duration: 300 }), // Orange, pas rouge
}));
```

### Animation 4 : Feedback Overlay Appear
```typescript
const feedbackAppear = useAnimatedStyle(() => ({
  opacity: withTiming(1, { duration: 300 }),
}));

const feedbackCardAppear = useAnimatedStyle(() => ({
  opacity: withDelay(100, withTiming(1, { duration: 300 })),
  transform: [
    { scale: withDelay(100, withSpring(1, { damping: 12, stiffness: 150 })) },
    { translateY: withDelay(100, withSpring(0, { damping: 15, stiffness: 120 })) },
  ],
}));
```

### Animation 5 : Progress Dot Complete
```typescript
const dotComplete = useAnimatedStyle(() => ({
  backgroundColor: withTiming('#7BC74D', { duration: 400 }),
  transform: [
    { scale: withSequence(
      withTiming(1.3, { duration: 200 }),
      withSpring(1, { damping: 10 })
    )}
  ],
}));
```

### Animation 6 : Plume Reaction
```typescript
// Happy (correct answer)
const plumeHappy = useAnimatedStyle(() => ({
  transform: [
    { translateY: withSequence(
      withTiming(-15, { duration: 200 }),
      withSpring(0, { damping: 8 })
    )}
  ],
}));

// Encouraging (incorrect)
const plumeEncouraging = useAnimatedStyle(() => ({
  transform: [
    { rotate: withSequence(
      withTiming('-10deg', { duration: 200 }),
      withTiming('10deg', { duration: 200 }),
      withSpring('0deg', { damping: 8 })
    )}
  ],
}));
```

### Animation 7 : Hint Button Pulse
```typescript
const hintPulse = useAnimatedStyle(() => ({
  transform: [
    { scale: withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1
    )}
  ],
  shadowOpacity: withRepeat(
    withSequence(
      withTiming(0.5, { duration: 1000 }),
      withTiming(0.3, { duration: 1000 })
    ),
    -1
  ),
}));
```

### Séquence d'animations par question
1. `QuestionCard` - delay: 0ms (slide in from right)
2. `AnswerButtons` - delay: 200ms + (index * 100ms) (staggered fade + scale)
3. `SpeechBubble` - delay: 600ms (pop)
4. `HintButton` - delay: 800ms (fade in + pulse start)

---

## 👆 INTERACTIONS & GESTURES

### Boutons
| Élément | Geste | Feedback visuel | Feedback haptique |
|---------|-------|-----------------|-------------------|
| AnswerButton | onPress | scale 0.98 + border highlight | impactMedium |
| ReplayButton | onPress | scale 0.95 | impactLight |
| HintButton | onPress | scale 0.95 + glow | impactLight |
| ActionButton (feedback) | onPress | scale 0.95 | impactMedium |

### Answer Selection Flow
```typescript
const handleAnswerPress = async (answerIndex: number) => {
  // 1. Haptic feedback
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  
  // 2. Visual selection
  setSelectedAnswer(answerIndex);
  
  // 3. Validate after short delay
  setTimeout(() => {
    const isCorrect = answerIndex === question.correctAnswer;
    
    if (isCorrect) {
      // Correct animation
      playCorrectAnimation();
      incrementScore();
    } else {
      // Shake + encourage (max 3 attempts)
      playIncorrectAnimation();
      incrementAttempts();
    }
    
    // 4. Show feedback overlay
    setTimeout(() => {
      setShowFeedback(true);
    }, 500);
  }, 300);
};
```

---

## 👶 CONTRAINTES UX ENFANT

### Zones tactiles
- [x] AnswerButtons : min 80dp height, 48% width
- [x] ReplayButton : 56dp height
- [x] HintButton : 64dp width minimum
- [x] ActionButton : 60dp height

### Accessibilité
- [x] Contraste badges type ≥ 3:1
- [x] Labels accessibilité
```typescript
<Pressable
  accessibilityLabel={`Réponse ${letter}: ${answer.text}`}
  accessibilityHint={isSelected ? "Sélectionnée" : "Appuie pour sélectionner"}
  accessibilityRole="button"
>
```

### Feedback obligatoire (JAMAIS PUNITIF)
- [x] Bonne réponse : ⭐ "Super !" + explication + confettis
- [x] Mauvaise réponse : 💪 "Presque !" + encouragement + possibilité réessayer
- [x] Orange (#FFB347) au lieu de rouge pour les erreurs
- [x] Maximum 3 tentatives avant aide forcée
- [x] Plume réagit positivement dans tous les cas

### Navigation
- [x] Bouton retour (confirmation si progression)
- [x] Progress dots clairs

---

## 🖼️ ASSETS & RESSOURCES

### Emojis/Icônes
| Usage | Emoji/Icône | Fallback |
|-------|-------------|----------|
| Type factuelle | 🔍 | Lucide: Search |
| Type séquentielle | 📋 | Lucide: List |
| Type causale | 🔗 | Lucide: Link |
| Type émotionnelle | 💭 | Lucide: Heart |
| Type inférentielle | 🔮 | Lucide: Sparkles |
| Type opinion | 💡 | Lucide: Lightbulb |
| Succès | ⭐ | - |
| Encouragement | 💪 | - |
| Indice | 💡 | Lucide: Lightbulb |
| Replay | 🔄 | Lucide: RotateCcw |
| Correct | ✓ | Lucide: Check |

### Sons
| Événement | Fichier | Durée | Notes |
|-----------|---------|-------|-------|
| Answer tap | answer-tap.mp3 | <0.2s | Click doux |
| Correct | correct-chime.mp3 | <1s | Joyeux, mélodique |
| Encourage | soft-encourage.mp3 | <0.5s | Doux, pas négatif |
| Hint | hint-pop.mp3 | <0.3s | Pop magique |
| Next question | page-turn.mp3 | <0.3s | Transition |

---

## 📱 RESPONSIVE & ADAPTATION

### iPad (principal)
- Layout : 3 colonnes (Recap 320 | Questions flex | Mascot 280)
- Grille réponses : 2×2

### iPhone (secondaire)
| Élément | iPad | iPhone |
|---------|------|--------|
| Layout | 3 colonnes | 1 colonne |
| Recap panel | Visible (320) | Caché |
| Mascot panel | Visible (280) | Mini en bas |
| Grille réponses | 2×2 | 1×4 (vertical) |
| Question font | 26px | 22px |

### Adaptation par âge
| Élément | 6-7 ans | 8-9 ans | 9-10 ans |
|---------|---------|---------|----------|
| Nb questions | 4 | 5 | 6 |
| Types questions | Factuel, Séquentiel | + Causal, Émotionnel | + Inférentiel |
| Hints disponibles | 4 | 3 | 2 |
| Lecture question | Audio + Texte | Texte (audio option) | Texte seul |

---

## 🧩 COMPOSANTS RÉUTILISABLES

### Design System existant
- [x] `<Button variant="primary" />` - ActionButton
- [x] `<IconButton />` - BackButton
- [ ] `<ProgressBar />` - À adapter en dots

### Composants à créer
- [ ] `<QuestionCard question={Question} />` - Carte question avec type badge
- [ ] `<AnswerButton answer={Answer} state={AnswerState} onPress={() => {}} />` - Bouton réponse animé
- [ ] `<ProgressDots total={5} current={2} completed={[0,1]} />` - Points de progression
- [ ] `<FeedbackOverlay type="success"|"encourage" message={string} onAction={() => {}} />` - Overlay feedback
- [ ] `<MiniScene theme={string} />` - Scène miniature
- [ ] `<StoryRecapPanel story={Story} onReplay={() => {}} />` - Panel récapitulatif

---

## ✅ CHECKLIST AVANT IMPLÉMENTATION

### Structure
- [x] Layout 3 colonnes iPad
- [x] Grille réponses 2×2
- [x] Feedback overlay modal

### Styles
- [x] Couleurs par type de question
- [x] États réponses (default, selected, correct, incorrect)
- [x] Orange pour erreurs (pas rouge)

### Animations
- [x] Entrance question (slide)
- [x] Pulse correct / Shake incorrect
- [x] Feedback overlay

### UX Enfant
- [x] Touch targets validés
- [x] Feedback JAMAIS punitif
- [x] Plume encourage toujours

---

## 💬 NOTES POUR CLAUDE CODE

1. **Logique de scoring** :
   - Score affiché = bonnes réponses du premier coup
   - 3 tentatives max par question
   - Après 3 erreurs, montrer la réponse avec explication
   - Toujours passer à la suite (pas bloquer)

2. **États des réponses** :
   ```typescript
   type AnswerState = 'default' | 'selected' | 'correct' | 'incorrect' | 'disabled';
   ```

3. **Types de questions** :
   - Bien typer les 6 types
   - Couleur badge selon type
   - Icône emoji selon type

4. **Feedback textes** :
   - Correct : toujours positif avec explication
   - Incorrect : encourager + indice subtil
   - Utiliser les scripts de DIALOGUES_IA.md

5. **Hint system** :
   - 3 hints max
   - Hint 1 : Indice général
   - Hint 2 : Éliminer 1 mauvaise réponse
   - Hint 3 : Highlight passage pertinent

---

## 🔧 CODE DE DÉMARRAGE

```typescript
// ConteurQuestionsScreen.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { QuestionCard } from './components/QuestionCard';
import { AnswerButton } from './components/AnswerButton';
import { ProgressDots } from './components/ProgressDots';
import { FeedbackOverlay } from './components/FeedbackOverlay';
import { PlumeMascot } from './components/PlumeMascot';
import { SpeechBubble } from './components/SpeechBubble';
import { MiniScene } from './components/MiniScene';
import { useQuestionFlow } from './hooks/useQuestionFlow';
import { styles, ConteurColors } from './styles';
import type { Question, AnswerState } from './types';

export const ConteurQuestionsScreen: React.FC = () => {
  const { storyId } = useLocalSearchParams<{ storyId: string }>();
  const router = useRouter();
  
  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    score,
    completedQuestions,
    hintsRemaining,
    plumeDialogue,
    plumeAnimation,
    submitAnswer,
    useHint,
    nextQuestion,
    retryQuestion,
  } = useQuestionFlow(storyId);

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerStates, setAnswerStates] = useState<AnswerState[]>(['default', 'default', 'default', 'default']);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'success' | 'encourage'>('success');

  const handleAnswerPress = useCallback(async (index: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedAnswer(index);
    
    // Update visual state
    const newStates = [...answerStates];
    newStates[index] = 'selected';
    setAnswerStates(newStates);
    
    // Validate after animation
    setTimeout(async () => {
      const result = await submitAnswer(index);
      
      const finalStates = [...answerStates];
      if (result.isCorrect) {
        finalStates[index] = 'correct';
        setFeedbackType('success');
      } else {
        finalStates[index] = 'incorrect';
        setFeedbackType('encourage');
      }
      setAnswerStates(finalStates);
      
      setTimeout(() => setShowFeedback(true), 500);
    }, 300);
  }, [answerStates, submitAnswer]);

  const handleFeedbackAction = useCallback(() => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    setAnswerStates(['default', 'default', 'default', 'default']);
    
    if (feedbackType === 'success' || currentQuestion.attempts >= 3) {
      if (currentIndex < totalQuestions - 1) {
        nextQuestion();
      } else {
        router.push('/(games)/conteur-curieux/victory');
      }
    } else {
      retryQuestion();
    }
  }, [feedbackType, currentIndex, totalQuestions, nextQuestion, retryQuestion, router]);

  if (!currentQuestion) return null;

  return (
    <View style={styles.container}>
      {/* Story Recap Panel */}
      <View style={styles.recapPanel}>
        <Text style={styles.recapTitle}>📖 L'histoire</Text>
        <MiniScene theme={currentQuestion.storyTheme} />
        <Text style={styles.summaryText}>{currentQuestion.storySummary}</Text>
        <Pressable style={styles.replayButton}>
          <Text>🔄</Text>
          <Text style={styles.replayButtonText}>Réécouter</Text>
        </Pressable>
      </View>

      {/* Question Panel */}
      <View style={styles.questionPanel}>
        <View style={styles.questionHeader}>
          <ProgressDots
            total={totalQuestions}
            current={currentIndex}
            completed={completedQuestions}
          />
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreIcon}>⭐</Text>
            <Text style={styles.scoreText}>{score}/{currentIndex}</Text>
          </View>
        </View>

        <QuestionCard question={currentQuestion} />

        <View style={styles.answersGrid}>
          {currentQuestion.answers.map((answer, index) => (
            <AnswerButton
              key={index}
              letter={String.fromCharCode(65 + index)}
              answer={answer}
              state={answerStates[index]}
              onPress={() => handleAnswerPress(index)}
              disabled={showFeedback}
            />
          ))}
        </View>
      </View>

      {/* Mascot Panel */}
      <View style={styles.mascotPanel}>
        <PlumeMascot animation={plumeAnimation} size="medium" />
        <SpeechBubble>{plumeDialogue}</SpeechBubble>
        <Pressable
          style={[styles.hintButton, hintsRemaining === 0 && styles.hintButtonDisabled]}
          onPress={useHint}
          disabled={hintsRemaining === 0}
        >
          <Text>💡</Text>
          <Text style={styles.hintButtonText}>Indice</Text>
          <View style={styles.hintCounter}>
            {[0, 1, 2].map(i => (
              <View
                key={i}
                style={[styles.hintDot, i >= hintsRemaining && styles.hintDotUsed]}
              />
            ))}
          </View>
        </Pressable>
      </View>

      {/* Feedback Overlay */}
      <FeedbackOverlay
        visible={showFeedback}
        type={feedbackType}
        explanation={currentQuestion.explanation}
        onAction={handleFeedbackAction}
      />
    </View>
  );
};
```
