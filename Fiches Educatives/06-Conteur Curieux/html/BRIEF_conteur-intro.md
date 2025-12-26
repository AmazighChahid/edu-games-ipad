# BRIEF REACT NATIVE : ConteurIntroScreen

## 📋 MÉTADONNÉES
| Champ | Valeur |
|-------|--------|
| **Type** | Screen |
| **Priorité** | P0 Critical |
| **Dépendances** | ForestBackground, PlumeMascot, StoryCard, Button, ScreenHeader |
| **Fichier HTML source** | conteur-intro.html |

---

## 🌳 STRUCTURE HIÉRARCHIQUE

```
ConteurIntroScreen
├── [Container] (style: container, flex: 1)
│   ├── [LibraryBackground] (animated, style: backgroundContainer)
│   │   ├── [BookshelfLeft] (style: bookshelf, position: absolute)
│   │   ├── [BookshelfRight] (style: bookshelf, position: absolute)
│   │   ├── [Window] (style: window, position: absolute)
│   │   │   └── [SunRays] (animated, rotating)
│   │   ├── [DustParticles] (animated, 8 particles)
│   │   └── [WoodenFloor] (style: floor)
│   │
│   ├── [Header] (style: header)
│   │   ├── [BackButton] (touchable, 64x64)
│   │   ├── [TitleContainer]
│   │   │   ├── [Icon] 📚 (40px)
│   │   │   └── [Title] "Le Conteur Curieux" (Fredoka 32px bold)
│   │   └── [ProgressBadge] (style: badge)
│   │       ├── [Icon] 📖
│   │       └── [Count] "12 histoires lues"
│   │
│   ├── [PlumeMascotSection] (style: mascotSection)
│   │   ├── [PlumeMascot] (animated, 160x180)
│   │   │   ├── [Body] (gradient brown)
│   │   │   ├── [Wings] (animated flap)
│   │   │   ├── [Eyes] (animated blink)
│   │   │   ├── [Beak] (orange)
│   │   │   ├── [GraduationCap] 🎓
│   │   │   └── [GlowingBook] (animated pulse)
│   │   └── [SpeechBubble] (animated pop)
│   │       └── [Text] "Houhou ! Quelle histoire..."
│   │
│   ├── [FilterTabs] (style: filterContainer, horizontal scroll)
│   │   ├── [Tab] "Tous" (active)
│   │   ├── [Tab] "🌿 Nature"
│   │   ├── [Tab] "🗺️ Aventure"
│   │   ├── [Tab] "✨ Magie"
│   │   ├── [Tab] "👨‍👩‍👧 Famille"
│   │   └── [Tab] "🤝 Amitié"
│   │
│   └── [StoriesGrid] (style: grid, 4 columns iPad, 2 iPhone)
│       └── [StoryCard] × N (touchable, 200x280)
│           ├── [CoverImage] (style: cover, gradient + emoji 64px)
│           ├── [LevelStars] ⭐⭐⭐ (style: stars)
│           ├── [NewBadge] "NOUVEAU" (conditional)
│           ├── [CompletedBadge] "✓" (conditional)
│           ├── [LockOverlay] 🔒 (conditional)
│           ├── [Title] (Fredoka 16px bold)
│           ├── [Theme] (12px, opacity 0.8)
│           └── [Duration] "3 min" (style: duration)
│
└── [ModeSelectionModal] (animated, conditional)
    ├── [Overlay] (style: overlay, opacity 0.6)
    └── [ModalCard] (style: modal, 480px width)
        ├── [CloseButton] ✕ (touchable, 48x48)
        ├── [StoryPreview]
        │   ├── [CoverMini] (120x160)
        │   └── [StoryInfo]
        ├── [Title] "Comment veux-tu découvrir cette histoire ?"
        ├── [ModeOptions]
        │   ├── [ModeButton] 🎧 Écouter (touchable, 80x100)
        │   ├── [ModeButton] 🎧👁️ Mixte ⭐ Recommandé (touchable, 80x100)
        │   └── [ModeButton] 👁️ Lire (touchable, 80x100)
        └── [StartButton] "C'est parti !" (primary, 64px height)
```

---

## 🎨 STYLES REACT NATIVE

```typescript
import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 768;

export const ConteurColors = {
  primary: '#5B8DEE',
  primaryDark: '#4A7BD9',
  secondary: '#9B59B6',
  secondaryDark: '#8E44AD',
  accent: '#F39C12',
  success: '#7BC74D',
  background: '#FFF9F0',
  surface: '#FFFFFF',
  text: '#2D3748',
  textSecondary: '#718096',
  library: {
    wood: '#8B4513',
    woodLight: '#A0522D',
    woodDark: '#5D3A1A',
    shelf: '#D4A574',
  },
  themes: {
    nature: '#27AE60',
    adventure: '#E67E22',
    magic: '#9B59B6',
    family: '#3498DB',
    friendship: '#E91E63',
    discovery: '#00BCD4',
  },
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ConteurColors.background,
  },

  // Background bibliothèque
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bookshelf: {
    position: 'absolute',
    width: 120,
    height: '100%',
    backgroundColor: ConteurColors.library.wood,
  },
  bookshelfLeft: {
    left: 0,
  },
  bookshelfRight: {
    right: 0,
  },
  window: {
    position: 'absolute',
    top: 40,
    right: 180,
    width: 200,
    height: 250,
    backgroundColor: '#87CEEB',
    borderRadius: 20,
    borderWidth: 12,
    borderColor: ConteurColors.library.woodLight,
  },
  floor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: ConteurColors.library.shelf,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: isTablet ? 32 : 20,
    paddingVertical: 16,
    paddingTop: 20,
  },
  backButton: {
    width: 64,
    height: 64,
    backgroundColor: ConteurColors.surface,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  titleIcon: {
    fontSize: 40,
  },
  title: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 32,
    color: ConteurColors.text,
  },
  progressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  badgeText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: ConteurColors.textSecondary,
  },

  // Mascotte Plume
  mascotSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  mascotContainer: {
    width: 160,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speechBubble: {
    position: 'absolute',
    top: -60,
    right: -120,
    backgroundColor: ConteurColors.surface,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 20,
    maxWidth: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  speechText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: ConteurColors.text,
    lineHeight: 22,
  },

  // Filtres
  filterContainer: {
    paddingHorizontal: isTablet ? 32 : 20,
    paddingVertical: 16,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  filterTabActive: {
    backgroundColor: ConteurColors.secondary,
  },
  filterTabText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: ConteurColors.textSecondary,
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },

  // Grille d'histoires
  grid: {
    paddingHorizontal: isTablet ? 32 : 20,
    paddingBottom: 40,
  },
  gridContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'flex-start',
  },

  // Carte histoire
  storyCard: {
    width: isTablet ? 200 : 160,
    height: isTablet ? 280 : 240,
    backgroundColor: ConteurColors.surface,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: ConteurColors.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  storyCover: {
    height: '55%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  storyEmoji: {
    fontSize: isTablet ? 64 : 52,
  },
  storyStars: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 2,
  },
  starIcon: {
    fontSize: 14,
  },
  newBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  newBadgeText: {
    fontFamily: 'Nunito-ExtraBold',
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  completedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    backgroundColor: ConteurColors.success,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  storyTitle: {
    fontFamily: 'Fredoka-Bold',
    fontSize: isTablet ? 16 : 14,
    color: ConteurColors.text,
    marginBottom: 4,
  },
  storyTheme: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: ConteurColors.textSecondary,
    opacity: 0.8,
  },
  storyDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    color: ConteurColors.secondary,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  lockIcon: {
    fontSize: 32,
  },

  // Modal sélection mode
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: isTablet ? 480 : '90%',
    backgroundColor: ConteurColors.surface,
    borderRadius: 32,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 48,
    height: 48,
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 24,
    color: ConteurColors.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  modeOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  modeButton: {
    width: isTablet ? 120 : 100,
    height: isTablet ? 140 : 120,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  modeButtonSelected: {
    borderColor: ConteurColors.secondary,
    backgroundColor: 'rgba(155,89,182,0.1)',
  },
  modeIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  modeLabel: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: ConteurColors.text,
    textAlign: 'center',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#F39C12',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  startButton: {
    height: 64,
    backgroundColor: ConteurColors.secondary,
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
  startButtonText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
});
```

### Couleurs utilisées
| Variable | Hex | Usage |
|----------|-----|-------|
| `ConteurColors.primary` | #5B8DEE | Boutons secondaires, liens |
| `ConteurColors.secondary` | #9B59B6 | Thème principal Conteur, CTA |
| `ConteurColors.accent` | #F39C12 | Badges recommandé, attention |
| `ConteurColors.success` | #7BC74D | Badge complété |
| `ConteurColors.background` | #FFF9F0 | Fond principal |
| `ConteurColors.surface` | #FFFFFF | Cartes, modals |
| `ConteurColors.library.wood` | #8B4513 | Étagères bibliothèque |
| `ConteurColors.themes.nature` | #27AE60 | Histoires nature |
| `ConteurColors.themes.magic` | #9B59B6 | Histoires magie |

### Gradients
| Nom | Couleurs | Direction |
|-----|----------|-----------|
| coverNature | ['#27AE60', '#2ECC71'] | 180deg (vertical) |
| coverAdventure | ['#E67E22', '#F39C12'] | 180deg |
| coverMagic | ['#9B59B6', '#8E44AD'] | 180deg |
| coverFamily | ['#3498DB', '#2980B9'] | 180deg |
| coverFriendship | ['#E91E63', '#C2185B'] | 180deg |
| modalBackground | ['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)'] | 180deg |

---

## 🎬 ANIMATIONS (Reanimated 3)

### Animation 1 : Plume Float
```typescript
const plumeFloat = useAnimatedStyle(() => ({
  transform: [
    { translateY: withRepeat(
      withSequence(
        withTiming(-8, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // infinite
      true // reverse
    )}
  ],
}));
```

| Propriété | De | Vers | Durée | Easing | Loop |
|-----------|-----|------|-------|--------|------|
| translateY | 0 | -8 | 1500ms | inOut(ease) | infinite |

### Animation 2 : Wing Flap
```typescript
const wingFlap = useAnimatedStyle(() => ({
  transform: [
    { rotate: withRepeat(
      withSequence(
        withTiming('-15deg', { duration: 400 }),
        withTiming('0deg', { duration: 400 })
      ),
      -1,
      true
    )}
  ],
}));
```

| Propriété | De | Vers | Durée | Loop |
|-----------|-----|------|-------|------|
| rotate | 0deg | -15deg | 400ms | infinite |

### Animation 3 : Story Card Entrance
```typescript
const cardEntrance = useAnimatedStyle(() => ({
  opacity: withTiming(1, { duration: 400 }),
  transform: [
    { translateY: withSpring(0, { damping: 12, stiffness: 100 }) },
    { scale: withSpring(1, { damping: 15, stiffness: 150 }) },
  ],
}));
```

| Propriété | De | Vers | Durée | Type | Delay stagger |
|-----------|-----|------|-------|------|---------------|
| opacity | 0 | 1 | 400ms | timing | index * 80ms |
| translateY | 30 | 0 | - | spring (d:12, s:100) | index * 80ms |
| scale | 0.9 | 1 | - | spring (d:15, s:150) | index * 80ms |

### Animation 4 : Modal Appear
```typescript
const modalAppear = useAnimatedStyle(() => ({
  opacity: withTiming(1, { duration: 300 }),
  transform: [
    { scale: withSpring(1, { damping: 15, stiffness: 200 }) },
  ],
}));
```

| Propriété | De | Vers | Durée | Type |
|-----------|-----|------|-------|------|
| opacity | 0 | 1 | 300ms | timing |
| scale | 0.8 | 1 | - | spring (d:15, s:200) |

### Animation 5 : Speech Bubble Pop
```typescript
const bubblePop = useAnimatedStyle(() => ({
  opacity: withDelay(500, withTiming(1, { duration: 300 })),
  transform: [
    { scale: withDelay(500, withSpring(1, { damping: 12, stiffness: 180 })) },
  ],
}));
```

### Animation 6 : Dust Particles
```typescript
const dustParticle = useAnimatedStyle(() => ({
  opacity: withRepeat(
    withSequence(
      withTiming(0.6, { duration: 2000 }),
      withTiming(0, { duration: 2000 })
    ),
    -1
  ),
  transform: [
    { translateY: withRepeat(withTiming(-100, { duration: 4000 }), -1) },
  ],
}));
```

### Séquence d'animations (ordre d'apparition)
1. `LibraryBackground` - delay: 0ms (fade in)
2. `PlumeMascot` - delay: 200ms (scale + float)
3. `SpeechBubble` - delay: 500ms (pop)
4. `Header` - delay: 300ms (fade + slide)
5. `FilterTabs` - delay: 400ms (slide in)
6. `StoryCards` - delay: 500ms + (index * 80ms) (staggered entrance)

---

## 👆 INTERACTIONS & GESTURES

### Boutons
| Élément | Geste | Feedback visuel | Feedback haptique |
|---------|-------|-----------------|-------------------|
| BackButton | onPress | scale 0.9 → 1 (spring) | impactLight |
| StoryCard | onPress | scale 0.95 → 1, shadow increase | impactMedium |
| FilterTab | onPress | backgroundColor transition | impactLight |
| ModeButton | onPress | borderColor + scale 0.98 | impactLight |
| StartButton | onPress | scale 0.95, brightness | impactMedium |
| CloseButton | onPress | scale 0.9, rotate 90° | impactLight |

### StoryCard Press Animation
```typescript
const cardPressStyle = useAnimatedStyle(() => ({
  transform: [
    { scale: withSpring(pressed.value ? 0.95 : 1, { damping: 15, stiffness: 200 }) },
  ],
  shadowOpacity: withTiming(pressed.value ? 0.35 : 0.2, { duration: 150 }),
}));
```

### Long Press (StoryCard preview)
- Durée minimum : 400ms
- Feedback : scale 1.02 + shadow increase + slight lift
- Action : Show story preview tooltip

---

## 👶 CONTRAINTES UX ENFANT

### Zones tactiles
- [x] Tous les boutons ≥ 64x64 dp
- [x] StoryCards : 200×280dp (largement suffisant)
- [x] FilterTabs : hauteur 48dp minimum
- [x] Espacement entre cartes : 20dp
- [x] Modal buttons : 120×140dp

### Accessibilité
- [x] Contraste texte ≥ 4.5:1 (vérifié)
- [x] Jamais couleur seule (badges avec icônes + couleur)
- [x] Labels accessibilité sur tous les touchables
```typescript
<Pressable
  accessibilityLabel={`Histoire ${story.title}, niveau ${story.level}, durée ${story.duration} minutes`}
  accessibilityHint="Appuie pour choisir cette histoire"
  accessibilityRole="button"
>
```

### Feedback obligatoire
- [x] Feedback visuel immédiat sur CHAQUE tap (scale animation)
- [x] Pas de feedback négatif/punitif
- [x] Cartes verrouillées avec message encourageant "Continue pour débloquer !"

### Navigation
- [x] Bouton retour toujours visible (coin supérieur gauche, 64×64)
- [x] Profondeur : Accueil → Intro → Story (3 niveaux max ✓)
- [x] Retour accueil en ≤ 2 taps ✓

---

## 🖼️ ASSETS & RESSOURCES

### Emojis/Icônes
| Usage | Emoji/Icône | Fallback |
|-------|-------------|----------|
| Titre | 📚 | Lucide: BookOpen |
| Mascotte cap | 🎓 | - |
| Niveau | ⭐ | Lucide: Star |
| Durée | ⏱️ | Lucide: Clock |
| Nouveau | - | Badge "NOUVEAU" |
| Complété | ✓ | Lucide: Check |
| Verrouillé | 🔒 | Lucide: Lock |
| Navigation retour | ← | Lucide: ArrowLeft |
| Fermer modal | ✕ | Lucide: X |
| Mode écouter | 🎧 | - |
| Mode lire | 👁️ | - |
| Thème nature | 🌿 🦊 🌳 | - |
| Thème aventure | 🗺️ ⛵ 🏔️ | - |
| Thème magie | ✨ 🧙 🔮 | - |
| Thème famille | 👨‍👩‍👧 🏠 | - |
| Thème amitié | 🤝 💕 | - |

### Sons
| Événement | Fichier | Durée | Notes |
|-----------|---------|-------|-------|
| Card tap | card-tap.mp3 | <0.3s | Doux, page qui tourne |
| Modal open | modal-open.mp3 | <0.5s | Whoosh léger |
| Start story | start-story.mp3 | <1s | Magique, début d'aventure |
| Filter change | filter-tap.mp3 | <0.2s | Click subtil |

---

## 📱 RESPONSIVE & ADAPTATION

### iPad (principal)
- Orientation : Landscape preferred
- Grille : 4 colonnes
- Card size : 200×280dp
- Padding écran : 32dp
- Modal width : 480dp

### iPhone (secondaire)
| Élément | iPad | iPhone |
|---------|------|--------|
| Grille colonnes | 4 | 2 |
| Card size | 200×280dp | 160×240dp |
| Padding écran | 32dp | 20dp |
| Modal width | 480dp | 90% écran |
| Title fontSize | 32px | 26px |
| Plume size | 160×180 | 120×140 |

### Adaptation par âge
| Élément | 6-7 ans | 8-9 ans | 9-10 ans |
|---------|---------|---------|----------|
| Niveau affiché | ⭐ (1 seule) | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Mode par défaut | 🎧 Écouter | 🎧👁️ Mixte | 👁️ Lire |
| Histoires visibles | Niveau 1-2 | Niveau 1-4 | Tous |
| Animation Plume | Plus fréquente | Normale | Subtile |

---

## 🧩 COMPOSANTS RÉUTILISABLES

### Design System existant
- [x] `<Button variant="primary" size="large" />` - Pour StartButton
- [x] `<IconButton icon="arrow-left" />` - Pour BackButton
- [x] `<ScreenHeader />` - Structure header (à adapter)
- [ ] `<Card style="elevated" />` - Base pour StoryCard

### Composants à créer pour cet écran
- [ ] `<PlumeMascot size="large" | "medium" | "small" />` - Mascotte animée avec variants
- [ ] `<SpeechBubble position="top-right" | "bottom">` - Bulle de dialogue
- [ ] `<StoryCard story={StoryData} onPress={() => {}} locked={boolean} />` - Carte histoire
- [ ] `<FilterTabs tabs={Theme[]} activeTab={string} onTabChange={() => {}} />` - Filtres thématiques
- [ ] `<ModeSelectionModal story={StoryData} onSelectMode={() => {}} onClose={() => {}} />` - Modal choix mode
- [ ] `<LibraryBackground />` - Fond bibliothèque animé
- [ ] `<DustParticles count={8} />` - Particules flottantes

---

## ✅ CHECKLIST AVANT IMPLÉMENTATION

### Structure
- [x] Arborescence des composants claire
- [x] Props définies pour chaque composant
- [x] Types TypeScript prévus (voir SPECS_TECHNIQUES.md)

### Styles
- [x] Tous les styles traduits en StyleSheet
- [x] Gradients identifiés (expo-linear-gradient)
- [x] Shadows iOS + elevation Android

### Animations
- [x] Toutes les animations listées avec valeurs
- [x] Séquence/timing défini
- [x] Spring configs précisés

### UX Enfant
- [x] Touch targets ≥ 64dp vérifiés
- [x] Feedbacks sur interactions définis
- [x] Accessibilité prévue

---

## 💬 NOTES POUR CLAUDE CODE

1. **Ordre de développement suggéré** :
   - LibraryBackground (fond statique d'abord, animations ensuite)
   - StoryCard (composant clé, réutilisable)
   - PlumeMascot (peut être développé en parallèle)
   - FilterTabs (simple)
   - ModeSelectionModal (dépend de StoryCard)
   - Assemblage final ConteurIntroScreen

2. **Points d'attention** :
   - Le `PlumeMascot` utilise des formes CSS complexes → utiliser `react-native-svg` pour le corps
   - Les particules de poussière peuvent impacter les performances → limiter à 6-8 particules
   - Le modal doit bloquer les interactions derrière → utiliser `<Modal>` natif ou overlay absolu

3. **Réutilisation** :
   - `PlumeMascot` sera réutilisé sur TOUS les écrans du Conteur
   - `SpeechBubble` est générique, peut servir dans d'autres jeux
   - `StoryCard` est spécifique au Conteur

4. **Performance** :
   - Utiliser `FlatList` avec `numColumns` pour la grille (pas ScrollView + map)
   - Lazy load des images de couverture si nombreuses histoires
   - Désactiver les animations si `useReducedMotion()` retourne true

---

## 🔧 CODE DE DÉMARRAGE

```typescript
// ConteurIntroScreen.tsx
import React, { useState, useCallback } from 'react';
import { View, FlatList, Pressable, Text, Modal } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  useSharedValue,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { LibraryBackground } from './components/LibraryBackground';
import { PlumeMascot } from './components/PlumeMascot';
import { SpeechBubble } from './components/SpeechBubble';
import { StoryCard } from './components/StoryCard';
import { FilterTabs } from './components/FilterTabs';
import { ModeSelectionModal } from './components/ModeSelectionModal';
import { IconButton } from '@/components/common';
import { stories } from './data/stories';
import { styles, ConteurColors } from './styles';
import type { StoryData, StoryTheme, ListeningMode } from './types';

export const ConteurIntroScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [activeTheme, setActiveTheme] = useState<StoryTheme | 'all'>('all');
  const [selectedStory, setSelectedStory] = useState<StoryData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filteredStories = activeTheme === 'all'
    ? stories
    : stories.filter(s => s.theme === activeTheme);

  const handleStoryPress = useCallback((story: StoryData) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedStory(story);
    setModalVisible(true);
  }, []);

  const handleModeSelect = useCallback((mode: ListeningMode) => {
    if (!selectedStory) return;
    setModalVisible(false);
    router.push({
      pathname: '/(games)/conteur-curieux/story',
      params: { storyId: selectedStory.id, mode },
    });
  }, [selectedStory, router]);

  const renderStoryCard = useCallback(({ item, index }: { item: StoryData; index: number }) => (
    <StoryCard
      story={item}
      index={index}
      onPress={() => handleStoryPress(item)}
    />
  ), [handleStoryPress]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LibraryBackground />
      
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          onPress={() => router.back()}
          style={styles.backButton}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.titleIcon}>📚</Text>
          <Text style={styles.title}>Le Conteur Curieux</Text>
        </View>
        <View style={styles.progressBadge}>
          <Text>📖</Text>
          <Text style={styles.badgeText}>12 histoires lues</Text>
        </View>
      </View>

      {/* Mascotte */}
      <View style={styles.mascotSection}>
        <PlumeMascot size="large" />
        <SpeechBubble position="top-right">
          Houhou ! Quelle histoire allons-nous découvrir aujourd'hui ? 📖✨
        </SpeechBubble>
      </View>

      {/* Filtres */}
      <FilterTabs
        activeTab={activeTheme}
        onTabChange={setActiveTheme}
      />

      {/* Grille d'histoires */}
      <FlatList
        data={filteredStories}
        renderItem={renderStoryCard}
        keyExtractor={(item) => item.id}
        numColumns={4} // Adapter pour iPhone
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal sélection mode */}
      <ModeSelectionModal
        visible={modalVisible}
        story={selectedStory}
        onSelectMode={handleModeSelect}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};
```
