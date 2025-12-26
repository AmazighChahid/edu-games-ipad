# BRIEF REACT NATIVE : Le Conteur Curieux

## 📋 MÉTADONNÉES
| Champ | Valeur |
|-------|--------|
| Type | Game (multi-screen) |
| Fichiers HTML | conteur-intro.html, conteur-story.html, conteur-questions.html, conteur-victory.html |
| Dépendances | expo-av, expo-file-system, react-native-reanimated, expo-linear-gradient |
| Priorité | P0 Critical (priorité 1 du roadmap) |

---

## 🌳 STRUCTURE HIÉRARCHIQUE

```
ConteurCurieux
├── [ConteurIntroScreen] (screen)
│   ├── [LibraryBackground] (animated)
│   │   ├── [BookshelfPattern]
│   │   └── [FloatingDustParticles] (animated)
│   ├── [ScreenHeader]
│   │   ├── [BackButton] (touchable, 48x48)
│   │   └── [FilterTabs] (horizontal scroll)
│   ├── [PlumeGreeting] (animated)
│   │   ├── [PlumeMascot] (120x140)
│   │   └── [SpeechBubble]
│   └── [StoriesGrid] (FlatList, 4 columns)
│       └── [StoryCard] (touchable, 200x280)
│           ├── [StoryCover]
│           ├── [StoryTitle]
│           ├── [LevelStars]
│           ├── [DurationBadge]
│           └── [NewBadge] (conditional)
│
├── [ConteurStoryScreen] (screen)
│   ├── [StoryHeader]
│   │   ├── [BackButton]
│   │   ├── [ProgressBar]
│   │   └── [TextSizeControl]
│   ├── [ContentSplit] (flex row)
│   │   ├── [IllustrationArea] (55%)
│   │   │   └── [AnimatedScene] (story-specific)
│   │   └── [TextArea] (45%)
│   │       ├── [ParagraphText]
│   │       ├── [VocabularyWord] (touchable, underlined)
│   │       └── [VocabularyPopup] (modal)
│   ├── [AudioPlayer]
│   │   ├── [WaveformVisualizer] (animated)
│   │   ├── [PlayPauseButton] (64x64)
│   │   ├── [ProgressSlider]
│   │   └── [TimeDisplay]
│   └── [PlumeMini] (80x80, bottom-left)
│
├── [ConteurQuestionsScreen] (screen)
│   ├── [QuestionsHeader]
│   │   ├── [BackButton]
│   │   ├── [ProgressDots]
│   │   └── [ScoreBadge]
│   ├── [MainContent] (flex row)
│   │   ├── [StoryRecap] (320px)
│   │   │   ├── [MiniImage]
│   │   │   ├── [SummaryText]
│   │   │   └── [ReplayButton]
│   │   ├── [QuestionArea] (flex 1)
│   │   │   ├── [QuestionCard] (animated)
│   │   │   │   ├── [QuestionTypeBadge]
│   │   │   │   ├── [QuestionText]
│   │   │   │   └── [QuestionHint]
│   │   │   ├── [AnswersGrid] (2 columns)
│   │   │   │   └── [AnswerOption] (touchable, animated)
│   │   │   └── [ValidateButton] (touchable, 64h)
│   │   └── [MascotPanel] (280px)
│   │       ├── [PlumeContainer]
│   │       │   ├── [PlumeMascot]
│   │       │   └── [SpeechBubble]
│   │       └── [HintButton] (touchable)
│   └── [FeedbackOverlay] (modal, animated)
│       └── [FeedbackCard]
│
├── [ConteurProductionScreen] (screen)
│   ├── [ProductionHeader]
│   ├── [TaskArea]
│   │   ├── [ImageReorderTask] (6-7 ans)
│   │   ├── [SentenceCompletionTask] (7-8 ans)
│   │   └── [VoiceRecordingTask] (8-10 ans)
│   └── [PlumeMascot]
│
└── [ConteurVictoryScreen] (screen)
    ├── [CelebrationBackground] (animated)
    │   ├── [FloatingParticles]
    │   ├── [Confetti]
    │   └── [StarBursts]
    ├── [VictoryPopup] (animated)
    │   ├── [PopupHeader]
    │   │   ├── [Rays] (animated rotation)
    │   │   ├── [VictoryTitle]
    │   │   └── [StarsRow] (animated sequence)
    │   ├── [CardSection]
    │   │   ├── [CollectibleCard] (flip animation)
    │   │   └── [CollectionProgress]
    │   ├── [StatsSection]
    │   ├── [SkillsSection]
    │   └── [ButtonsSection]
    └── [MascotCelebration] (animated)
```

---

## 🎨 STYLES REACT NATIVE

```typescript
// src/games/conteur-curieux/styles/conteurStyles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 768;

export const ConteurColors = {
  // Primary colors
  primary: '#5B8DEE',
  primaryDark: '#4A7BD9',
  secondary: '#9B59B6',
  secondaryLight: '#BB8FCE',
  secondaryDark: '#8E44AD',
  
  // Feedback
  success: '#7BC74D',
  successLight: '#A8E080',
  warning: '#FFB347',
  warningDark: '#F39C12',
  gold: '#F5A623',
  goldLight: '#FFD93D',
  
  // Backgrounds
  background: '#FFF9F0',
  backgroundWarm: '#FFF5E6',
  libraryBg: '#E8D5B7',
  libraryBgDark: '#D4C4A8',
  surface: '#FFFFFF',
  
  // Text
  textDark: '#2D3748',
  textMedium: '#4A5568',
  textLight: '#9A9A9A',
  
  // Plume mascot
  plumeBody: '#8B6914',
  plumeBodyDark: '#6B5210',
  plumeBelly: '#F5E6D3',
  plumeBeak: '#F5A623',
};

export const ConteurGradients = {
  libraryBg: ['#E8D5B7', '#D4C4A8', '#C9B896'],
  secondary: ['#9B59B6', '#8E44AD'],
  gold: ['#FFD93D', '#F5A623'],
  celebration: ['#9B59B6', '#8E44AD', '#7D3C98'],
  progress: ['#9B59B6', '#BB8FCE'],
};

export const styles = StyleSheet.create({
  // ========== CONTAINERS ==========
  screenContainer: {
    flex: 1,
    backgroundColor: ConteurColors.libraryBg,
  },
  
  contentSplit: {
    flex: 1,
    flexDirection: 'row',
  },
  
  // ========== HEADER ==========
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: isTablet ? 28 : 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(155,89,182,0.2)',
  },
  
  backButton: {
    width: 48,
    height: 48,
    backgroundColor: ConteurColors.surface,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // ========== STORY CARD ==========
  storyCard: {
    width: 200,
    height: 280,
    backgroundColor: ConteurColors.surface,
    borderRadius: 20,
    overflow: 'hidden',
    // Shadow iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    // Shadow Android
    elevation: 8,
  },
  
  storyCover: {
    height: 140,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  storyEmoji: {
    fontSize: 64,
  },
  
  storyInfo: {
    padding: 14,
  },
  
  storyTitle: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 16,
    color: ConteurColors.textDark,
    marginBottom: 8,
  },
  
  levelStars: {
    flexDirection: 'row',
    gap: 4,
  },
  
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(155,89,182,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  
  // ========== QUESTION CARD ==========
  questionCard: {
    backgroundColor: ConteurColors.surface,
    borderRadius: 24,
    padding: 28,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 8,
  },
  
  questionTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  
  questionText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 26,
    color: ConteurColors.textDark,
    lineHeight: 36,
    marginBottom: 8,
  },
  
  // ========== ANSWER OPTION ==========
  answersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  
  answerOption: {
    width: '48%',
    backgroundColor: ConteurColors.surface,
    borderWidth: 3,
    borderColor: '#E8E8E8',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    minHeight: 90,
  },
  
  answerOptionSelected: {
    borderColor: ConteurColors.secondary,
    backgroundColor: 'rgba(155,89,182,0.1)',
  },
  
  answerOptionCorrect: {
    borderColor: ConteurColors.success,
    backgroundColor: 'rgba(123,199,77,0.15)',
  },
  
  answerOptionIncorrect: {
    borderColor: ConteurColors.warning,
    backgroundColor: 'rgba(255,179,71,0.15)',
  },
  
  answerLetter: {
    width: 44,
    height: 44,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  answerText: {
    fontSize: 17,
    fontWeight: '600',
    color: ConteurColors.textDark,
    flex: 1,
  },
  
  // ========== AUDIO PLAYER ==========
  audioPlayer: {
    backgroundColor: ConteurColors.surface,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  waveformContainer: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  
  waveformBar: {
    width: 4,
    backgroundColor: ConteurColors.secondary,
    borderRadius: 2,
  },
  
  // ========== PLUME MASCOT ==========
  plumeMascot: {
    width: 120,
    height: 140,
    position: 'relative',
  },
  
  plumeBody: {
    width: 100,
    height: 110,
    backgroundColor: ConteurColors.plumeBody,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
  
  plumeBelly: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    width: 70,
    height: 55,
    backgroundColor: ConteurColors.plumeBelly,
    borderRadius: 35,
  },
  
  plumeEye: {
    position: 'absolute',
    top: 15,
    width: 28,
    height: 28,
    backgroundColor: '#fff',
    borderRadius: 14,
  },
  
  plumePupil: {
    width: 14,
    height: 14,
    backgroundColor: '#2C1810',
    borderRadius: 7,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -7,
    marginLeft: -7,
  },
  
  plumeBeak: {
    position: 'absolute',
    top: 35,
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderTopWidth: 18,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: ConteurColors.plumeBeak,
  },
  
  plumeWing: {
    position: 'absolute',
    top: 50,
    width: 30,
    height: 45,
    backgroundColor: ConteurColors.plumeBodyDark,
    borderRadius: 22,
  },
  
  // ========== SPEECH BUBBLE ==========
  speechBubble: {
    backgroundColor: 'rgba(155,89,182,0.1)',
    borderWidth: 2,
    borderColor: ConteurColors.secondary,
    borderRadius: 16,
    padding: 14,
    maxWidth: 280,
  },
  
  speechBubbleText: {
    fontSize: 15,
    lineHeight: 22,
    color: ConteurColors.textDark,
    textAlign: 'center',
  },
  
  // ========== VALIDATE BUTTON ==========
  validateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 20,
    // Shadow
    shadowColor: '#9B59B6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  
  validateButtonText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 20,
    color: '#fff',
  },
  
  // ========== FEEDBACK CARD ==========
  feedbackOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  
  feedbackCard: {
    backgroundColor: ConteurColors.surface,
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    maxWidth: 450,
    borderWidth: 4,
  },
  
  feedbackIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  
  feedbackTitle: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 28,
    marginBottom: 12,
  },
  
  feedbackMessage: {
    fontSize: 17,
    color: ConteurColors.textMedium,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 24,
  },
  
  // ========== VICTORY POPUP ==========
  victoryPopup: {
    backgroundColor: ConteurColors.surface,
    borderRadius: 32,
    width: isTablet ? 700 : '90%',
    overflow: 'hidden',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.3,
    shadowRadius: 80,
    elevation: 20,
  },
  
  popupHeader: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    paddingBottom: 70,
    position: 'relative',
    overflow: 'hidden',
  },
  
  victoryTitle: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 48,
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 15,
  },
  
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 20,
  },
  
  // ========== COLLECTIBLE CARD ==========
  collectibleCard: {
    width: 180,
    height: 250,
    alignSelf: 'center',
    marginTop: -50,
  },
  
  cardFront: {
    width: '100%',
    height: '100%',
    borderWidth: 4,
    borderColor: ConteurColors.secondary,
    borderRadius: 20,
    alignItems: 'center',
    padding: 15,
    // Shadow
    shadowColor: '#9B59B6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 15,
  },
  
  cardAnimal: {
    fontSize: 80,
    marginVertical: 10,
  },
  
  cardName: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 16,
    color: '#4A4A4A',
    textAlign: 'center',
  },
  
  cardTrait: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(155,89,182,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 8,
  },
  
  // ========== STATS SECTION ==========
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
    fontSize: 32,
  },
  
  statLabel: {
    fontSize: 13,
    color: '#9A9A9A',
    marginTop: 4,
  },
  
  // ========== BUTTONS ==========
  buttonPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    // Shadow
    shadowColor: '#9B59B6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  
  buttonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  
  buttonText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 18,
    color: '#fff',
  },
});
```

---

## 🎬 ANIMATIONS (Reanimated 3)

### Animation 1: Plume Float
```typescript
// Mascot floating animation
const floatAnimation = useAnimatedStyle(() => {
  return {
    transform: [
      {
        translateY: withRepeat(
          withSequence(
            withTiming(-8, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        ),
      },
    ],
  };
});
```

| Propriété | De → Vers | Durée | Type | Loop |
|-----------|-----------|-------|------|------|
| translateY | 0 → -8 → 0 | 3000ms | timing (easeInOut) | infinite |

### Animation 2: Wing Flap
```typescript
// Wing flapping animation
const wingAnimation = useAnimatedStyle(() => {
  return {
    transform: [
      {
        rotate: withRepeat(
          withSequence(
            withTiming('-10deg', { duration: 400 }),
            withTiming('0deg', { duration: 400 })
          ),
          -1,
          true
        ),
      },
    ],
  };
});
```

### Animation 3: Question Card Slide In
```typescript
const cardSlideIn = useAnimatedStyle(() => {
  return {
    opacity: withTiming(1, { duration: 300 }),
    transform: [
      { translateY: withSpring(0, { damping: 15, stiffness: 150 }) },
    ],
  };
});
```

| Propriété | De → Vers | Durée | Type | Delay |
|-----------|-----------|-------|------|-------|
| opacity | 0 → 1 | 300ms | timing | 0ms |
| translateY | 20 → 0 | - | spring (d:15, s:150) | 0ms |

### Animation 4: Correct Answer Pulse
```typescript
const correctPulse = useAnimatedStyle(() => {
  return {
    transform: [
      {
        scale: withSequence(
          withTiming(1.02, { duration: 150 }),
          withTiming(1, { duration: 150 })
        ),
      },
    ],
    borderColor: withTiming('#7BC74D', { duration: 200 }),
    backgroundColor: withTiming('rgba(123,199,77,0.15)', { duration: 200 }),
  };
});
```

### Animation 5: Incorrect Answer Shake
```typescript
const incorrectShake = useAnimatedStyle(() => {
  return {
    transform: [
      {
        translateX: withSequence(
          withTiming(-8, { duration: 50 }),
          withTiming(8, { duration: 50 }),
          withTiming(-8, { duration: 50 }),
          withTiming(8, { duration: 50 }),
          withTiming(0, { duration: 50 })
        ),
      },
    ],
  };
});
```

### Animation 6: Victory Popup Appear
```typescript
const popupAppear = useAnimatedStyle(() => {
  return {
    opacity: withTiming(1, { duration: 300 }),
    transform: [
      { scale: withSpring(1, { damping: 12, stiffness: 200 }) },
      { translateY: withTiming(0, { duration: 400 }) },
    ],
  };
});
```

| Propriété | De → Vers | Durée | Type | Delay |
|-----------|-----------|-------|------|-------|
| opacity | 0 → 1 | 300ms | timing | 0ms |
| scale | 0.5 → 1 | - | spring (d:12, s:200) | 0ms |
| translateY | 50 → 0 | 400ms | timing | 0ms |

### Animation 7: Stars Pop Sequence
```typescript
// Each star appears with delay
const starPop = (index: number) => useAnimatedStyle(() => {
  const delay = 500 + (index * 200); // 500ms, 700ms, 900ms...
  return {
    opacity: withDelay(delay, withTiming(1, { duration: 300 })),
    transform: [
      {
        scale: withDelay(delay, withSpring(1, { damping: 10, stiffness: 200 })),
      },
      {
        rotate: withDelay(delay, withTiming('0deg', { duration: 500 })),
      },
    ],
  };
});
```

### Animation 8: Card Flip
```typescript
const cardFlip = useAnimatedStyle(() => {
  const delay = 1500;
  return {
    transform: [
      {
        rotateY: withDelay(
          delay,
          withSequence(
            withTiming('90deg', { duration: 400 }),
            withTiming('0deg', { duration: 400 })
          )
        ),
      },
      {
        scale: withDelay(
          delay,
          withSequence(
            withTiming(1.1, { duration: 400 }),
            withTiming(1, { duration: 400 })
          )
        ),
      },
    ],
  };
});
```

### Animation 9: Confetti Fall
```typescript
// For each confetti piece
const confettiFall = (index: number) => {
  const startDelay = index * 100;
  const duration = 3000;
  
  return useAnimatedStyle(() => ({
    opacity: withDelay(startDelay, 
      withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(0, { duration: duration - 100 })
      )
    ),
    transform: [
      {
        translateY: withDelay(startDelay, withTiming(850, { duration })),
      },
      {
        rotate: withDelay(startDelay, withTiming('720deg', { duration })),
      },
      {
        scale: withDelay(startDelay, 
          withSequence(
            withTiming(1, { duration: 100 }),
            withTiming(0.5, { duration: duration - 100 })
          )
        ),
      },
    ],
  }));
};
```

### Animation 10: Speech Bubble Pop
```typescript
const bubblePop = useAnimatedStyle(() => {
  return {
    opacity: withSpring(1, { damping: 15 }),
    transform: [
      { scale: withSpring(1, { damping: 10, stiffness: 200 }) },
    ],
  };
});
```

### Animation 11: Waveform Bars
```typescript
// Audio visualization bars
const waveformBar = (index: number) => useAnimatedStyle(() => {
  const height = Math.random() * 30 + 10; // 10-40px
  return {
    height: withRepeat(
      withSequence(
        withTiming(height, { duration: 200 + index * 50 }),
        withTiming(10, { duration: 200 + index * 50 })
      ),
      -1,
      true
    ),
  };
});
```

### Séquence d'animations (Écran Victoire)
1. `[popupAppear]` - delay: 0ms
2. `[titleBounce]` - delay: 300ms
3. `[stars[0]]` - delay: 500ms
4. `[stars[1]]` - delay: 700ms
5. `[stars[2]]` - delay: 900ms
6. `[stars[3]]` - delay: 1100ms
7. `[stars[4]]` - delay: 1300ms
8. `[cardFlip]` - delay: 1500ms
9. `[cardMessage]` - delay: 2000ms
10. `[statsSection]` - delay: 2200ms
11. `[skillsSection]` - delay: 2400ms
12. `[buttonsSection]` - delay: 2600ms
13. `[mascotSpeech]` - delay: 2800ms

---

## 👆 INTERACTIONS & GESTURES

### Boutons
| Élément | Geste | Feedback visuel | Feedback haptique |
|---------|-------|-----------------|-------------------|
| StoryCard | onPress | scale 0.95 → 1 (spring) | impactLight |
| PlayButton | onPress | scale 0.9 → 1 + rotation | impactMedium |
| AnswerOption | onPress | borderColor change + scale | impactLight |
| ValidateButton | onPress | scale 0.95 → 1 | impactMedium |
| HintButton | onPress | scale 0.95 + glow pulse | impactLight |

### Vocabulary Word Tap
```typescript
const handleVocabularyTap = (word: VocabularyWord) => {
  // Trigger haptic
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  
  // Highlight word
  setHighlightedWord(word.id);
  
  // Show popup with definition
  setVocabularyPopup({
    visible: true,
    word: word.word,
    definition: word.definition,
    example: word.example,
  });
};
```

### Audio Slider
```typescript
// Slider pour la progression audio
<Slider
  value={audioProgress}
  onValueChange={handleSeek}
  minimumTrackTintColor={ConteurColors.secondary}
  maximumTrackTintColor="#E0E0E0"
  thumbTintColor={ConteurColors.secondary}
  style={{ flex: 1, height: 40 }}
/>
```

---

## 👶 CONTRAINTES UX ENFANT

### Zones tactiles
- [x] Tous les boutons ≥ 64×64 dp
- [x] StoryCard: 200×280 dp
- [x] AnswerOption: min-height 90dp
- [x] PlayButton: 64×64 dp
- [x] Espacement entre options: 16dp

### Accessibilité
- [x] Contraste texte ≥ 4.5:1
- [x] Jamais couleur seule (icône + texte + couleur)
- [x] Option OpenDyslexic font
- [x] High contrast mode available

```typescript
// Accessibility labels
accessibilityLabel={`Histoire ${story.title}, niveau ${story.level}, durée ${story.duration} minutes`}
accessibilityHint="Appuie pour écouter cette histoire"
accessibilityRole="button"
```

### Feedback obligatoire
- [x] Feedback visuel immédiat sur CHAQUE tap
- [x] Pas de feedback punitif (orange pour erreur, pas rouge)
- [x] Animation shake douce sur erreur
- [x] Toujours proposer "Réessayer" ou "Indice"

### Navigation
- [x] Bouton retour toujours visible (coin supérieur gauche)
- [x] Profondeur max 3 niveaux
- [x] Retour accueil en ≤ 2 taps

---

## 🖼️ ASSETS & RESSOURCES

### Emojis/Icônes
| Usage | Emoji | Fallback |
|-------|-------|----------|
| Plume mascot | 🦉 | Custom SVG |
| Story themes | 🌲🏔️🌊✨🏠👨‍👩‍👧 | - |
| Question types | 📖🔗💭❓🤔💡 | - |
| Stars | ⭐ | Custom SVG |
| Navigation | ← | Lucide ArrowLeft |
| Audio | ▶️ ⏸️ | Lucide Play/Pause |

### Sons (expo-av)
| Événement | Fichier | Durée | Notes |
|-----------|---------|-------|-------|
| Story audio | story_{id}.mp3 | 2-5min | Voix off narrative |
| Correct answer | success.mp3 | <1s | Joyeux, mélodique |
| Incorrect | soft-tap.mp3 | <0.5s | Neutre, doux |
| Hint reveal | hint.mp3 | <1s | Magical chime |
| Victory | celebration.mp3 | 2-3s | Fanfare joyeuse |
| Card unlock | card-flip.mp3 | <1s | Whoosh + sparkle |
| Button tap | tap.mp3 | <0.2s | Soft click |

---

## 📱 RESPONSIVE & ADAPTATION

### iPad (principal) vs iPhone
| Élément | iPad | iPhone |
|---------|------|--------|
| Padding écran | 28dp | 16dp |
| StoriesGrid columns | 4 | 2 |
| StoryCard size | 200×280 | 160×220 |
| Question layout | 3-column | Stack vertical |
| Plume size | 120×140 | 80×100 |
| Font questionText | 26px | 22px |

### Adaptation par âge
| Élément | 6-7 ans | 8-9 ans | 9-10 ans |
|---------|---------|---------|----------|
| Story mode | Audio only | Mixed | Read option |
| Question count | 4 | 5 | 6 |
| Production task | Image reorder | Sentences | Voice recording |
| Hint availability | 3 hints | 2 hints | 2 hints |
| Touch targets | 80dp | 64dp | 64dp |
| Audio required | Yes | Optional | Optional |

---

## 🧩 COMPOSANTS DESIGN SYSTEM

### À utiliser depuis le Design System existant
- [x] `<Button variant="primary" size="large" />`
- [x] `<ScreenHeader />`
- [x] `<PageContainer />`
- [x] `<ProgressBar />`
- [x] `<FeedbackMessage type="success|encourage" />`
- [x] `<CollectibleCard />`
- [x] `<VictoryPopup />`

### Composants à créer pour ce jeu
- [ ] `<PlumeMascot state="neutral|thinking|happy|excited" />` - Mascotte avec animations
- [ ] `<StoryCard story={StoryContent} />` - Carte d'histoire cliquable
- [ ] `<QuestionCard question={Question} />` - Carte de question
- [ ] `<AnswerOption answer={Answer} state="default|selected|correct|incorrect" />` - Option de réponse
- [ ] `<AudioPlayer audioUri={string} />` - Lecteur audio avec waveform
- [ ] `<VocabularyPopup word={VocabularyWord} />` - Popup définition
- [ ] `<SpeechBubble message={string} />` - Bulle de dialogue
- [ ] `<LibraryBackground />` - Fond bibliothèque animé
- [ ] `<CelebrationBackground />` - Fond de célébration avec particules
- [ ] `<ImageReorderTask images={Image[]} />` - Tâche de remise en ordre
- [ ] `<SentenceCompletionTask sentence={string} options={string[]} />` - Complétion de phrases
- [ ] `<VoiceRecordingTask prompt={string} />` - Enregistrement vocal

---

## ✅ CHECKLIST AVANT IMPLÉMENTATION

### Structure
- [ ] Arborescence `/src/games/conteur-curieux/` créée
- [ ] Types TypeScript définis dans `types.ts`
- [ ] Routes Expo Router configurées
- [ ] Hook `useConteurGame` implémenté

### Styles
- [ ] Tous les styles traduits en StyleSheet
- [ ] Gradients avec expo-linear-gradient
- [ ] Shadows iOS + elevation Android
- [ ] Responsive iPad/iPhone

### Animations
- [ ] Plume float + wing flap
- [ ] Question card slide in
- [ ] Answer feedback (correct pulse, incorrect shake)
- [ ] Victory sequence (popup, stars, card flip)
- [ ] Confetti particles

### Audio
- [ ] expo-av configuré
- [ ] Lecture audio stories
- [ ] Sons de feedback
- [ ] Voice recording (expo-file-system)

### UX Enfant
- [ ] Touch targets ≥ 64dp
- [ ] Feedback sur tous les taps
- [ ] Pas de feedback punitif
- [ ] Bouton retour visible

---

## 💬 NOTES POUR CLAUDE CODE

### Points critiques
1. **Audio synchronisation**: Le texte doit se surligner en sync avec l'audio. Utiliser des timestamps dans les fichiers story data.

2. **Vocabulary tap**: Détecter les taps sur des mots spécifiques dans un Text. Utiliser un composant custom avec des Text imbriqués cliquables.

3. **Question types**: 6 types différents avec des badges colorés distincts. Créer une map de couleurs par type.

4. **Production tasks**: 3 types selon l'âge. Utiliser un composant wrapper qui rend le bon type selon `userAgeGroup`.

5. **Card flip animation**: Utiliser `perspective: 1000` et `rotateY` avec Reanimated. Attention à `backfaceVisibility: 'hidden'`.

6. **Confetti**: Créer 15-20 éléments animés indépendamment avec des délais staggerés.

7. **Speech bubble pointer**: Utiliser une View triangulaire avec `borderWidth` trick ou un SVG simple.

8. **Waveform**: Créer 25 barres avec des hauteurs animées aléatoires pendant la lecture.

### Pièges à éviter
- Ne pas oublier le `transform-origin` pour les rotations des ailes
- Les gradients doivent utiliser `expo-linear-gradient`, pas de CSS gradients
- L'audio doit être préchargé pour éviter les délais
- Le voice recording nécessite les permissions micro
- Tester sur iPad réel pour les performances d'animation

---

## 📄 CODE DE DÉMARRAGE

```typescript
// src/games/conteur-curieux/index.ts
export { ConteurIntroScreen } from './screens/ConteurIntroScreen';
export { ConteurStoryScreen } from './screens/ConteurStoryScreen';
export { ConteurQuestionsScreen } from './screens/ConteurQuestionsScreen';
export { ConteurVictoryScreen } from './screens/ConteurVictoryScreen';
export { useConteurGame } from './hooks/useConteurGame';
export * from './types';
```

```typescript
// src/games/conteur-curieux/screens/ConteurIntroScreen.tsx
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ScreenHeader } from '@/components/common';
import { PlumeMascot } from '../components/PlumeMascot';
import { StoryCard } from '../components/StoryCard';
import { LibraryBackground } from '../components/LibraryBackground';
import { useConteurGame } from '../hooks/useConteurGame';
import { ConteurColors, ConteurGradients, styles } from '../styles/conteurStyles';

export const ConteurIntroScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { stories, selectedTheme, setSelectedTheme } = useConteurGame();
  
  const handleStorySelect = (storyId: string) => {
    router.push(`/(games)/conteur-curieux/story/${storyId}`);
  };
  
  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <LibraryBackground />
      
      <ScreenHeader 
        title="Le Conteur Curieux"
        onBack={() => router.back()}
      />
      
      <PlumeMascot 
        state="greeting"
        message="Houhou ! Quelle histoire veux-tu découvrir aujourd'hui ?"
      />
      
      <FlatList
        data={stories}
        numColumns={4}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StoryCard
            story={item}
            onPress={() => handleStorySelect(item.id)}
          />
        )}
        contentContainerStyle={styles.storiesGrid}
      />
    </View>
  );
};
```

---

*Brief React Native v1.0 — Le Conteur Curieux*
*Basé sur les prototypes HTML et le Design System existant*
