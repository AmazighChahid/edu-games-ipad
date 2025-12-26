# BRIEF REACT NATIVE : ConteurStoryScreen

## 📋 MÉTADONNÉES
| Champ | Valeur |
|-------|--------|
| **Type** | Screen |
| **Priorité** | P0 Critical |
| **Dépendances** | PlumeMascot, AudioPlayer, VocabularyBubble, Button, ProgressBar |
| **Fichier HTML source** | conteur-story.html |

---

## 🌳 STRUCTURE HIÉRARCHIQUE

```
ConteurStoryScreen
├── [Container] (style: container, flex: 1)
│   ├── [Header] (style: header)
│   │   ├── [BackButton] (touchable, 64x64)
│   │   ├── [ProgressSection]
│   │   │   ├── [ProgressBar] (style: progressBar)
│   │   │   └── [PageIndicator] "2/6"
│   │   └── [OptionsGroup]
│   │       ├── [TextSizeButton] (touchable, 48x48)
│   │       └── [OptionsButton] (touchable, 48x48)
│   │
│   ├── [ContentSplit] (style: contentSplit, flexDirection: row)
│   │   │
│   │   ├── [IllustrationPanel] (style: illustrationPanel, flex: 0.55)
│   │   │   ├── [SceneContainer] (animated)
│   │   │   │   ├── [Sky] (gradient blue)
│   │   │   │   ├── [Sun] (animated pulse, position: absolute)
│   │   │   │   ├── [Clouds] × 2 (animated drift)
│   │   │   │   ├── [Trees] × 3 (animated sway)
│   │   │   │   ├── [Character] (animated walk/idle)
│   │   │   │   ├── [Butterfly] (animated flutter, conditional)
│   │   │   │   ├── [Flowers] × 5 (animated sway)
│   │   │   │   └── [Ground] (grass gradient)
│   │   │   └── [SceneCaption] (style: caption, optional)
│   │   │
│   │   └── [TextPanel] (style: textPanel, flex: 0.45)
│   │       ├── [TextContainer] (scrollable)
│   │       │   ├── [Paragraph] × N
│   │       │   │   ├── [Sentence] (style: sentence)
│   │       │   │   │   └── [Word] × N (touchable for vocabulary)
│   │       │   │   └── [HighlightedSentence] (style: highlighted, conditional)
│   │       │   └── [VocabularyWord] (style: vocabularyWord, underline dotted)
│   │       │
│   │       └── [ReadingIndicator] (style: readingIndicator, conditional)
│   │           ├── [WaveBars] × 5 (animated)
│   │           └── [Label] "En train d'écouter..."
│   │
│   ├── [AudioPlayerBar] (style: audioPlayer, conditional on mode)
│   │   ├── [WaveformVisualization]
│   │   │   └── [Bar] × 25 (animated height)
│   │   ├── [ControlsGroup]
│   │   │   ├── [SkipBackButton] (touchable, 48x48)
│   │   │   ├── [PlayPauseButton] (touchable, 64x64)
│   │   │   └── [SkipForwardButton] (touchable, 48x48)
│   │   ├── [ProgressSlider]
│   │   │   ├── [Track] (style: track)
│   │   │   ├── [Progress] (style: progress, animated width)
│   │   │   └── [Thumb] (style: thumb, draggable)
│   │   └── [TimeDisplay]
│   │       ├── [CurrentTime] "1:12"
│   │       └── [TotalTime] "/3:45"
│   │
│   └── [PlumeMini] (style: plumeMini, position: absolute, bottom-left)
│       └── [PlumeMascot] (size: small, 80px, animated bounce)
│
├── [VocabularyPopup] (animated, conditional)
│   ├── [PopupCard] (style: vocabularyCard)
│   │   ├── [Word] (Fredoka bold)
│   │   ├── [Definition] (Nunito)
│   │   └── [Example] (italic, lighter)
│   └── [Arrow] (pointing to word)
│
└── [OptionsModal] (conditional)
    ├── [Overlay]
    └── [OptionsCard]
        ├── [FontSizeSlider]
        ├── [DyslexiaToggle]
        ├── [HighContrastToggle]
        └── [CloseButton]
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
  background: '#FFF9F0',
  surface: '#FFFFFF',
  text: '#2D3748',
  textSecondary: '#718096',
  vocabulary: '#9B59B6',
  highlight: 'rgba(155, 89, 182, 0.15)',
  scene: {
    sky: '#87CEEB',
    skyLight: '#B0E2FF',
    grass: '#7BC74D',
    grassDark: '#5BAE6B',
    tree: '#228B22',
    treeDark: '#006400',
    sun: '#FFD93D',
  },
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ConteurColors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: isTablet ? 32 : 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    width: 48,
    height: 48,
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSection: {
    flex: 1,
    marginHorizontal: 24,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    maxWidth: 400,
    height: 8,
    backgroundColor: 'rgba(155, 89, 182, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: ConteurColors.secondary,
    borderRadius: 4,
  },
  pageIndicator: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: ConteurColors.textSecondary,
    marginTop: 6,
  },
  optionsGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    width: 48,
    height: 48,
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Content Split
  contentSplit: {
    flex: 1,
    flexDirection: 'row',
  },

  // Illustration Panel
  illustrationPanel: {
    flex: 0.55,
    overflow: 'hidden',
  },
  sceneContainer: {
    flex: 1,
    position: 'relative',
  },
  sky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  sun: {
    position: 'absolute',
    top: 40,
    right: 60,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: ConteurColors.scene.sun,
  },
  sunGlow: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 217, 61, 0.3)',
  },
  cloud: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 30,
  },
  tree: {
    position: 'absolute',
    bottom: 80,
  },
  treeTrunk: {
    width: 20,
    height: 60,
    backgroundColor: '#8B4513',
    alignSelf: 'center',
  },
  treeCrown: {
    width: 80,
    height: 100,
    backgroundColor: ConteurColors.scene.tree,
    borderRadius: 40,
    marginBottom: -10,
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  character: {
    position: 'absolute',
    bottom: 100,
    left: '40%',
  },
  characterBody: {
    fontSize: 60,
  },
  butterfly: {
    position: 'absolute',
    fontSize: 28,
  },
  flower: {
    position: 'absolute',
    bottom: 85,
    fontSize: 24,
  },

  // Text Panel
  textPanel: {
    flex: 0.45,
    backgroundColor: ConteurColors.surface,
    borderTopLeftRadius: 32,
    borderBottomLeftRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  textContainer: {
    flex: 1,
    padding: 32,
    paddingTop: 40,
  },
  paragraph: {
    marginBottom: 24,
  },
  sentence: {
    fontFamily: 'Nunito-Regular',
    fontSize: 20,
    color: ConteurColors.text,
    lineHeight: 36, // 1.8 line-height
    letterSpacing: 0.3,
  },
  highlightedSentence: {
    backgroundColor: ConteurColors.highlight,
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  vocabularyWord: {
    color: ConteurColors.vocabulary,
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  },
  readingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    backgroundColor: 'rgba(155, 89, 182, 0.1)',
    borderRadius: 16,
    marginTop: 20,
  },
  waveBarsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 20,
  },
  waveBar: {
    width: 4,
    backgroundColor: ConteurColors.secondary,
    borderRadius: 2,
  },
  readingLabel: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: ConteurColors.secondary,
  },

  // Audio Player
  audioPlayer: {
    backgroundColor: ConteurColors.surface,
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 40,
    gap: 3,
    marginBottom: 16,
  },
  waveformBar: {
    width: 6,
    backgroundColor: ConteurColors.secondary,
    borderRadius: 3,
    opacity: 0.3,
  },
  waveformBarActive: {
    opacity: 1,
  },
  controlsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 16,
  },
  skipButton: {
    width: 48,
    height: 48,
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playPauseButton: {
    width: 64,
    height: 64,
    backgroundColor: ConteurColors.secondary,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ConteurColors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  playIcon: {
    fontSize: 28,
    color: '#FFFFFF',
    marginLeft: 4, // Visual centering for play icon
  },
  pauseIcon: {
    fontSize: 28,
    color: '#FFFFFF',
  },
  progressSlider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  track: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(155, 89, 182, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: ConteurColors.secondary,
    borderRadius: 3,
  },
  thumb: {
    width: 20,
    height: 20,
    backgroundColor: ConteurColors.secondary,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  timeDisplay: {
    flexDirection: 'row',
    minWidth: 80,
  },
  currentTime: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: ConteurColors.text,
  },
  totalTime: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: ConteurColors.textSecondary,
  },

  // Plume Mini
  plumeMini: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    zIndex: 10,
  },

  // Vocabulary Popup
  vocabularyOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  vocabularyCard: {
    position: 'absolute',
    backgroundColor: ConteurColors.surface,
    borderRadius: 20,
    padding: 20,
    maxWidth: 300,
    shadowColor: ConteurColors.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  vocabularyWord: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 20,
    color: ConteurColors.secondary,
    marginBottom: 8,
  },
  vocabularyDefinition: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: ConteurColors.text,
    lineHeight: 24,
    marginBottom: 12,
  },
  vocabularyExample: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: ConteurColors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  vocabularyArrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: ConteurColors.surface,
  },
});
```

### Couleurs utilisées
| Variable | Hex | Usage |
|----------|-----|-------|
| `ConteurColors.secondary` | #9B59B6 | Thème dominant, progress, audio |
| `ConteurColors.vocabulary` | #9B59B6 | Mots de vocabulaire cliquables |
| `ConteurColors.highlight` | rgba(155,89,182,0.15) | Phrase en cours de lecture |
| `ConteurColors.scene.sky` | #87CEEB | Ciel de la scène |
| `ConteurColors.scene.grass` | #7BC74D | Herbe |
| `ConteurColors.scene.sun` | #FFD93D | Soleil |
| `ConteurColors.scene.tree` | #228B22 | Feuillage arbres |

### Gradients
| Nom | Couleurs | Direction |
|-----|----------|-----------|
| skyGradient | ['#87CEEB', '#B0E2FF'] | 180deg |
| grassGradient | ['#7BC74D', '#5BAE6B'] | 180deg |
| sunGlow | ['rgba(255,217,61,0.5)', 'transparent'] | radial |

---

## 🎬 ANIMATIONS (Reanimated 3)

### Animation 1 : Sun Pulse
```typescript
const sunPulse = useAnimatedStyle(() => ({
  transform: [
    { scale: withRepeat(
      withSequence(
        withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1
    )}
  ],
  opacity: withRepeat(
    withSequence(
      withTiming(1, { duration: 2000 }),
      withTiming(0.8, { duration: 2000 })
    ),
    -1
  ),
}));
```

### Animation 2 : Tree Sway
```typescript
const treeSway = useAnimatedStyle(() => ({
  transform: [
    { rotate: withRepeat(
      withSequence(
        withTiming('-3deg', { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming('3deg', { duration: 2500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    )}
  ],
}));
```

### Animation 3 : Character Walk
```typescript
const characterWalk = useAnimatedStyle(() => ({
  transform: [
    { translateX: withRepeat(
      withSequence(
        withTiming(50, { duration: 3000, easing: Easing.linear }),
        withTiming(0, { duration: 3000, easing: Easing.linear })
      ),
      -1
    )},
    { translateY: withRepeat(
      withSequence(
        withTiming(-5, { duration: 300 }),
        withTiming(0, { duration: 300 })
      ),
      -1
    )}
  ],
}));
```

### Animation 4 : Butterfly Flutter
```typescript
const butterflyFlutter = useAnimatedStyle(() => ({
  transform: [
    { translateX: withRepeat(
      withSequence(
        withTiming(100, { duration: 4000 }),
        withTiming(-50, { duration: 3000 }),
        withTiming(30, { duration: 2000 })
      ),
      -1
    )},
    { translateY: withRepeat(
      withSequence(
        withTiming(-30, { duration: 1500 }),
        withTiming(20, { duration: 1500 }),
        withTiming(-10, { duration: 1000 })
      ),
      -1
    )},
    { rotate: withRepeat(
      withSequence(
        withTiming('10deg', { duration: 500 }),
        withTiming('-10deg', { duration: 500 })
      ),
      -1,
      true
    )}
  ],
}));
```

### Animation 5 : Waveform Bars
```typescript
const waveformBar = (index: number) => useAnimatedStyle(() => ({
  height: withRepeat(
    withSequence(
      withTiming(10 + Math.random() * 30, { duration: 200 + index * 50 }),
      withTiming(5 + Math.random() * 20, { duration: 200 + index * 50 })
    ),
    -1
  ),
}));
```

### Animation 6 : Reading Indicator Wave
```typescript
const readingWave = (index: number) => useAnimatedStyle(() => ({
  height: withRepeat(
    withDelay(index * 100,
      withSequence(
        withTiming(20, { duration: 400, easing: Easing.inOut(Easing.ease) }),
        withTiming(8, { duration: 400, easing: Easing.inOut(Easing.ease) })
      )
    ),
    -1
  ),
}));
```

### Animation 7 : Sentence Highlight
```typescript
const sentenceHighlight = useAnimatedStyle(() => ({
  backgroundColor: withTiming(
    isCurrentSentence ? 'rgba(155, 89, 182, 0.15)' : 'transparent',
    { duration: 300 }
  ),
}));
```

### Animation 8 : Vocabulary Popup
```typescript
const vocabularyPopup = useAnimatedStyle(() => ({
  opacity: withTiming(visible ? 1 : 0, { duration: 200 }),
  transform: [
    { scale: withSpring(visible ? 1 : 0.8, { damping: 15, stiffness: 200 }) },
    { translateY: withSpring(visible ? 0 : 10, { damping: 15, stiffness: 200 }) },
  ],
}));
```

### Séquence d'animations
1. `Scene elements` - delay: 0ms (fade in parallax)
2. `Text panel` - delay: 300ms (slide from right)
3. `Audio player` - delay: 500ms (slide up)
4. `Plume mini` - delay: 600ms (bounce in)
5. `Reading starts` - delay: 800ms (highlight + audio sync)

---

## 👆 INTERACTIONS & GESTURES

### Boutons
| Élément | Geste | Feedback visuel | Feedback haptique |
|---------|-------|-----------------|-------------------|
| BackButton | onPress | scale 0.9 → 1 | impactLight |
| PlayPauseButton | onPress | scale 0.95 + glow | impactMedium |
| SkipButtons | onPress | scale 0.9 | impactLight |
| VocabularyWord | onPress | highlight + popup | impactLight |
| ProgressSlider | onPan | thumb follows finger | none |
| OptionsButton | onPress | scale 0.9 | impactLight |

### Audio Slider Gesture
```typescript
const sliderGesture = Gesture.Pan()
  .onStart(() => {
    isDragging.value = true;
  })
  .onUpdate((event) => {
    const newProgress = Math.max(0, Math.min(1, 
      event.x / sliderWidth.value
    ));
    progress.value = newProgress;
  })
  .onEnd(() => {
    isDragging.value = false;
    runOnJS(seekToPosition)(progress.value);
  });
```

### Vocabulary Word Tap
```typescript
const handleWordPress = (word: VocabularyWord, layout: LayoutRectangle) => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  setSelectedWord(word);
  setPopupPosition({
    x: layout.x + layout.width / 2,
    y: layout.y - 10,
  });
  setShowVocabulary(true);
};
```

---

## 👶 CONTRAINTES UX ENFANT

### Zones tactiles
- [x] PlayPauseButton : 64×64dp
- [x] SkipButtons : 48×48dp
- [x] BackButton : 48×48dp (acceptable car navigation)
- [x] VocabularyWords : zone élargie avec padding
- [x] Slider thumb : 20dp visible, 44dp hitSlop

### Accessibilité
- [x] Contraste texte ≥ 4.5:1
- [x] Option dyslexie (OpenDyslexic font)
- [x] Option taille de texte (+/-20%)
- [x] Labels accessibilité
```typescript
<Pressable
  accessibilityLabel="Lecture en cours, page 2 sur 6"
  accessibilityHint="Appuie pour mettre en pause"
  accessibilityRole="button"
>
```

### Feedback obligatoire
- [x] Phrase surlignée pendant lecture audio
- [x] Waveform animé pendant lecture
- [x] Indicateur "En train d'écouter..."
- [x] Popup vocabulaire immédiat

### Navigation
- [x] Bouton retour visible
- [x] Pause automatique si navigation

---

## 🖼️ ASSETS & RESSOURCES

### Emojis/Icônes
| Usage | Emoji/Icône | Fallback |
|-------|-------------|----------|
| Personnage Léo | 👦 | Custom SVG |
| Papillon | 🦋 | - |
| Fleurs | 🌸 🌼 🌷 | - |
| Play | ▶️ | Lucide: Play |
| Pause | ⏸️ | Lucide: Pause |
| Skip back | ⏪ | Lucide: SkipBack |
| Skip forward | ⏩ | Lucide: SkipForward |
| Options | ⚙️ | Lucide: Settings |
| Text size | Aa | Lucide: Type |
| Retour | ← | Lucide: ArrowLeft |

### Sons
| Événement | Fichier | Durée | Notes |
|-----------|---------|-------|-------|
| Histoire audio | story_{id}.mp3 | 2-5min | Voix off professionnelle |
| Word tap | word-tap.mp3 | <0.2s | Pop subtil |
| Page turn | page-turn.mp3 | <0.5s | Bruitage papier |

---

## 📱 RESPONSIVE & ADAPTATION

### iPad (principal)
- Layout split : 55% / 45%
- Text size : 20px
- Line-height : 36px (1.8)

### iPhone (secondaire)
| Élément | iPad | iPhone |
|---------|------|--------|
| Layout | Split horizontal | Stacked vertical |
| Illustration | 55% width | 40% height top |
| Text panel | 45% width | 60% height bottom |
| Font size | 20px | 18px |
| Audio bar | Fixed bottom | Floating overlay |

### Adaptation par âge
| Élément | 6-7 ans | 8-9 ans | 9-10 ans |
|---------|---------|---------|----------|
| Mode par défaut | Audio only | Mixed | Read |
| Font size | 22px | 20px | 18px |
| Vocabulary highlights | Beaucoup | Modéré | Peu |
| Auto-scroll | Oui | Optionnel | Non |

---

## 🧩 COMPOSANTS RÉUTILISABLES

### Design System existant
- [x] `<IconButton />` - Skip, options
- [x] `<ProgressBar />` - Progression histoire
- [ ] `<Slider />` - À adapter pour audio

### Composants à créer
- [ ] `<AnimatedScene theme={string} />` - Illustration animée
- [ ] `<AudioPlayer audio={AudioSource} onProgress={() => {}} />` - Lecteur audio complet
- [ ] `<SyncedText sentences={Sentence[]} currentIndex={number} />` - Texte synchronisé
- [ ] `<VocabularyPopup word={VocabularyWord} position={Position} />` - Popup définition
- [ ] `<WaveformVisualizer isPlaying={boolean} />` - Visualisation audio
- [ ] `<ReadingIndicator />` - Indicateur lecture en cours

---

## ✅ CHECKLIST AVANT IMPLÉMENTATION

### Structure
- [x] Split layout horizontal (iPad) / vertical (iPhone)
- [x] Audio player conditionnel selon mode
- [x] Synchronisation texte-audio

### Styles
- [x] Scène animée avec éléments nature
- [x] Panel texte avec fond blanc
- [x] Gradients ciel et herbe

### Animations
- [x] Éléments scène animés (soleil, arbres, personnage)
- [x] Waveform synchronisé
- [x] Highlight phrases

### UX Enfant
- [x] Touch targets validés
- [x] Options accessibilité (dyslexie, taille)
- [x] Pause/reprise facile

---

## 💬 NOTES POUR CLAUDE CODE

1. **Synchronisation audio-texte** :
   - Utiliser `expo-av` pour l'audio
   - Timestamps par phrase dans les données histoire
   - `onPlaybackStatusUpdate` pour position actuelle
   - Calculer quelle phrase highlight basé sur position

2. **Performance scène** :
   - Utiliser `react-native-svg` pour arbres/nuages
   - Limiter les animations simultanées
   - `useReducedMotion` pour respecter préférences

3. **Vocabulaire interactif** :
   - Détecter tap sur mots spécifiques (composant Text imbriqué)
   - Calculer position pour le popup (ne pas déborder écran)
   - Fermer popup sur tap ailleurs

4. **Mode offline** :
   - Précharger audio avec `downloadAsync`
   - Stocker en cache local
   - Indicateur de téléchargement si nécessaire

---

## 🔧 CODE DE DÉMARRAGE

```typescript
// ConteurStoryScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedScene } from './components/AnimatedScene';
import { AudioPlayer } from './components/AudioPlayer';
import { SyncedText } from './components/SyncedText';
import { VocabularyPopup } from './components/VocabularyPopup';
import { PlumeMascot } from './components/PlumeMascot';
import { IconButton } from '@/components/common';
import { useStoryAudio } from './hooks/useStoryAudio';
import { stories } from './data/stories';
import { styles, ConteurColors } from './styles';
import type { VocabularyWord, ListeningMode } from './types';

export const ConteurStoryScreen: React.FC = () => {
  const { storyId, mode } = useLocalSearchParams<{ storyId: string; mode: ListeningMode }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const story = stories.find(s => s.id === storyId);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);
  
  const {
    isPlaying,
    progress,
    duration,
    currentTime,
    play,
    pause,
    seek,
    skipBack,
    skipForward,
  } = useStoryAudio(story?.audioUrl);

  // Sync text with audio
  useEffect(() => {
    if (story && currentTime) {
      const sentenceIndex = story.sentences.findIndex(
        (s, i) => currentTime >= s.startTime && 
                  (i === story.sentences.length - 1 || currentTime < story.sentences[i + 1].startTime)
      );
      if (sentenceIndex !== -1) {
        setCurrentSentenceIndex(sentenceIndex);
      }
    }
  }, [currentTime, story]);

  const handleVocabularyPress = useCallback((word: VocabularyWord) => {
    setSelectedWord(word);
  }, []);

  if (!story) return null;

  const showAudioPlayer = mode === 'listen' || mode === 'mixed';
  const showText = mode === 'read' || mode === 'mixed';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} />
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.pageIndicator}>
            {currentSentenceIndex + 1}/{story.sentences.length}
          </Text>
        </View>
        <View style={styles.optionsGroup}>
          <IconButton icon="type" onPress={() => {/* text size */}} />
          <IconButton icon="settings" onPress={() => {/* options */}} />
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentSplit}>
        <View style={styles.illustrationPanel}>
          <AnimatedScene theme={story.theme} />
        </View>
        
        {showText && (
          <View style={styles.textPanel}>
            <ScrollView style={styles.textContainer}>
              <SyncedText
                sentences={story.sentences}
                currentIndex={currentSentenceIndex}
                onVocabularyPress={handleVocabularyPress}
              />
            </ScrollView>
          </View>
        )}
      </View>

      {/* Audio Player */}
      {showAudioPlayer && (
        <AudioPlayer
          isPlaying={isPlaying}
          progress={progress}
          currentTime={currentTime}
          duration={duration}
          onPlayPause={isPlaying ? pause : play}
          onSeek={seek}
          onSkipBack={skipBack}
          onSkipForward={skipForward}
        />
      )}

      {/* Plume Mini */}
      <View style={styles.plumeMini}>
        <PlumeMascot size="small" />
      </View>

      {/* Vocabulary Popup */}
      {selectedWord && (
        <VocabularyPopup
          word={selectedWord}
          onClose={() => setSelectedWord(null)}
        />
      )}
    </View>
  );
};
```
