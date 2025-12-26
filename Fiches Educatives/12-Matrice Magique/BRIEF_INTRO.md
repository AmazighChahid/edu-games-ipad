# BRIEF REACT NATIVE : MatricesIntroScreen

## 📋 MÉTADONNÉES
| Champ | Valeur |
|-------|--------|
| **Type** | Screen |
| **Priorité** | P1 High |
| **Fichier HTML** | matrices-intro.html |
| **Route** | `/app/(games)/matrices-magiques/index.tsx` |
| **Dépendances** | PixelMascot, WorldCard, ProgressBar, BackButton, SpeechBubble |

---

## 🌳 STRUCTURE HIÉRARCHIQUE

```
MatricesIntroScreen
├── [Container] (style: container, LinearGradient)
│   │
│   ├── [FloatingDecorations] (animated, position: absolute, z: 0)
│   │   ├── [ShapeDecoration] × 8 (🔮⭐🔷△ floating)
│   │   └── [Sparkles] × 5 (pulsing dots)
│   │
│   ├── [Header] (style: header, z: 10)
│   │   ├── [BackButton] (touchable, 64×64)
│   │   ├── [TitleContainer]
│   │   │   ├── [Icon] "🔮" (fontSize: 32)
│   │   │   └── [Title] "Matrices Magiques" (Fredoka 28px)
│   │   └── [StatsRow]
│   │       ├── [StatBadge] ⭐ + count
│   │       └── [StatBadge] 🧩 + count
│   │
│   ├── [Content] (style: content, flex: 1, ScrollView)
│   │   │
│   │   ├── [MascotSection] (style: mascotSection)
│   │   │   ├── [PixelMascot] (140×160, animated)
│   │   │   │   ├── [FoxBody] (orange gradient)
│   │   │   │   ├── [Glasses] (purple)
│   │   │   │   ├── [Tail] (animated wag)
│   │   │   │   └── [Eyes] (blinking)
│   │   │   └── [SpeechBubble] (style: speechBubble)
│   │   │       └── [Text] "Choisis un monde..."
│   │   │
│   │   ├── [WorldsGrid] (style: worldsGrid)
│   │   │   ├── [WorldCard] "Forêt Enchantée" (unlocked, 80%)
│   │   │   ├── [WorldCard] "Station Spatiale" (unlocked, 30%, NEW)
│   │   │   ├── [WorldCard] "Château Magique" (locked)
│   │   │   ├── [WorldCard] "Atelier d'Artiste" (locked)
│   │   │   └── [WorldCard] "Dimension Mystère" (locked, full-width)
│   │   │
│   │   └── [DemoSection] (style: demoSection)
│   │       ├── [DemoTitle] "Exemple de puzzle"
│   │       ├── [MiniMatrix] (2×2 grid preview)
│   │       └── [MiniChoices] (3 options)
│   │
│   └── [SafeAreaBottom]
```

---

## 🎨 STYLES REACT NATIVE

```typescript
import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 24 * 2 - 16) / 2; // 2 columns with gap

export const styles = StyleSheet.create({
  // Container avec gradient
  container: {
    flex: 1,
  },
  
  // Gradient colors: ['#667eea', '#764ba2', '#f093fb']
  // start: { x: 0, y: 0 }, end: { x: 1, y: 1 }

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },

  backButton: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  titleIcon: {
    fontSize: 32,
  },

  title: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },

  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  statIcon: {
    fontSize: 18,
  },

  statValue: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 16,
    color: '#4A4A4A',
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },

  // Mascot Section
  mascotSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 24,
    gap: 16,
  },

  mascotContainer: {
    width: 140,
    height: 160,
  },

  speechBubble: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    // Shadow
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    // Triangle pointer (use View with border trick)
  },

  speechText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: '#4A4A4A',
    lineHeight: 24,
  },

  // Worlds Grid
  worldsGrid: {
    gap: 16,
    marginBottom: 24,
  },

  worldsRow: {
    flexDirection: 'row',
    gap: 16,
  },

  // World Card
  worldCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },

  worldCardFullWidth: {
    width: '100%',
  },

  worldCardLocked: {
    opacity: 0.6,
  },

  worldIconContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    // Gradient per world theme
  },

  worldIcon: {
    fontSize: 48,
  },

  worldContent: {
    padding: 16,
  },

  worldName: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 16,
    color: '#2D3436',
    marginBottom: 4,
  },

  worldPuzzleCount: {
    fontFamily: 'Nunito',
    fontSize: 13,
    color: '#7A7A7A',
    marginBottom: 10,
  },

  worldProgressBar: {
    height: 8,
    backgroundColor: '#E8E8E8',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },

  worldProgressFill: {
    height: '100%',
    borderRadius: 4,
    // Gradient per world
  },

  worldStars: {
    flexDirection: 'row',
    gap: 4,
  },

  star: {
    fontSize: 18,
  },

  starEmpty: {
    opacity: 0.3,
  },

  // Badges
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
    fontFamily: 'Fredoka-Bold',
    fontSize: 10,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },

  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  lockIcon: {
    fontSize: 32,
    marginBottom: 8,
  },

  lockText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: '#7A7A7A',
    textAlign: 'center',
  },

  // Demo Section
  demoSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },

  demoTitle: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
  },

  miniMatrix: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 120,
    gap: 4,
    marginBottom: 16,
  },

  miniCell: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  miniCellTarget: {
    borderWidth: 2,
    borderColor: '#FFD93D',
    borderStyle: 'dashed',
  },

  miniChoices: {
    flexDirection: 'row',
    gap: 12,
  },

  miniChoice: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Floating Decorations
  floatingDecoration: {
    position: 'absolute',
    opacity: 0.6,
  },
});
```

### Couleurs utilisées
| Variable | Hex | Usage |
|----------|-----|-------|
| `gradient.start` | #667eea | Fond gradient début |
| `gradient.mid` | #764ba2 | Fond gradient milieu |
| `gradient.end` | #f093fb | Fond gradient fin |
| `surface` | #FFFFFF | Cartes, bulles |
| `textPrimary` | #2D3436 | Titres sur blanc |
| `textSecondary` | #7A7A7A | Texte secondaire |
| `accent.new` | #FF6B6B | Badge "Nouveau" |
| `forest.primary` | #27AE60 | Monde Forêt |
| `space.primary` | #5B8DEE | Monde Spatial |
| `castle.primary` | #9B59B6 | Monde Château |
| `atelier.primary` | #F39C12 | Monde Atelier |
| `mystery.primary` | #1A1A2E | Monde Mystère |

### Gradients par Monde
| Monde | Couleurs | Direction |
|-------|----------|-----------|
| Forêt | ['#27AE60', '#1E8449'] | 135deg |
| Spatial | ['#5B8DEE', '#3B6FCE'] | 135deg |
| Château | ['#9B59B6', '#8E44AD'] | 135deg |
| Atelier | ['#F39C12', '#D68910'] | 135deg |
| Mystère | ['#1A1A2E', '#2D2D44', '#E056FD'] | 135deg |

---

## 🎬 ANIMATIONS (Reanimated 3)

### Animation 1 : Floating Decorations
```typescript
const floatingStyle = useAnimatedStyle(() => {
  return {
    transform: [
      { translateY: withRepeat(
        withTiming(20, { duration: 3000 }),
        -1,
        true
      )},
      { rotate: `${withRepeat(
        withTiming(10, { duration: 4000 }),
        -1,
        true
      )}deg` },
    ],
  };
});
```

| Propriété | De | Vers | Durée | Type | Loop |
|-----------|-----|------|-------|------|------|
| translateY | 0 | 20 | 3000ms | timing | reverse |
| rotate | 0deg | 10deg | 4000ms | timing | reverse |

### Animation 2 : Pixel Tail Wag
```typescript
const tailStyle = useAnimatedStyle(() => {
  return {
    transform: [
      { rotate: `${withRepeat(
        withSequence(
          withTiming(-15, { duration: 300 }),
          withTiming(15, { duration: 300 })
        ),
        -1,
        false
      )}deg` },
    ],
  };
});
```

| Propriété | De | Vers | Durée | Type | Loop |
|-----------|-----|------|-------|------|------|
| rotate | -15deg | 15deg | 600ms | sequence | infinite |

### Animation 3 : Card Appear (staggered)
```typescript
const cardStyle = useAnimatedStyle(() => {
  return {
    opacity: withDelay(index * 100, withTiming(1, { duration: 400 })),
    transform: [
      { translateY: withDelay(index * 100, withSpring(0, { damping: 15 })) },
      { scale: withDelay(index * 100, withSpring(1, { damping: 12 })) },
    ],
  };
});
```

| Propriété | De | Vers | Durée | Type | Delay |
|-----------|-----|------|-------|------|-------|
| opacity | 0 | 1 | 400ms | timing | index × 100ms |
| translateY | 30 | 0 | - | spring (d:15) | index × 100ms |
| scale | 0.9 | 1 | - | spring (d:12) | index × 100ms |

### Animation 4 : Speech Bubble Appear
```typescript
const bubbleStyle = useAnimatedStyle(() => {
  return {
    opacity: withDelay(300, withTiming(1, { duration: 300 })),
    transform: [
      { scale: withDelay(300, withSpring(1, { damping: 12, stiffness: 150 })) },
    ],
  };
});
```

### Séquence d'apparition
1. `Header` - delay: 0ms
2. `Mascot` - delay: 100ms
3. `SpeechBubble` - delay: 300ms
4. `WorldCard[0]` - delay: 400ms
5. `WorldCard[1]` - delay: 500ms
6. `WorldCard[2]` - delay: 600ms
7. `WorldCard[3]` - delay: 700ms
8. `WorldCard[4]` - delay: 800ms
9. `DemoSection` - delay: 1000ms

---

## 👆 INTERACTIONS & GESTURES

### Boutons
| Élément | Geste | Feedback visuel | Feedback haptique |
|---------|-------|-----------------|-------------------|
| BackButton | onPress | scale 0.9 → 1 (spring) | impactLight |
| WorldCard (unlocked) | onPress | scale 0.97 → 1, brightness +10% | impactMedium |
| WorldCard (locked) | onPress | shake + lock icon pulse | notificationWarning |

### World Card Press
```typescript
const pressedStyle = useAnimatedStyle(() => {
  return {
    transform: [
      { scale: withSpring(isPressed.value ? 0.97 : 1, { damping: 15 }) },
    ],
    // Subtle brightness boost via overlay
  };
});
```

### Locked Card Shake
```typescript
const shakeCard = () => {
  translateX.value = withSequence(
    withTiming(-8, { duration: 50 }),
    withTiming(8, { duration: 50 }),
    withTiming(-8, { duration: 50 }),
    withTiming(8, { duration: 50 }),
    withTiming(0, { duration: 50 })
  );
  // Haptic feedback
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
};
```

---

## 👶 CONTRAINTES UX ENFANT

### Zones tactiles
- [x] BackButton : 64×64 dp ✓
- [x] WorldCard : min 150×180 dp ✓
- [x] StatBadge : 80×40 dp (info only, not critical) ✓
- [x] Espacement entre cartes : 16dp ✓

### Accessibilité
- [x] Contraste texte blanc sur gradient ≥ 4.5:1 (shadow helps)
- [x] Lock indicator : 🔒 icône + texte
- [x] Progress : barre + étoiles + pourcentage
- [x] Labels accessibilité sur tous les touchables

```typescript
// WorldCard
accessibilityLabel={`Monde ${worldName}, ${progress}% complété, ${isLocked ? 'verrouillé' : 'disponible'}`}
accessibilityHint={isLocked ? "Ce monde est verrouillé" : "Appuie pour jouer dans ce monde"}
accessibilityRole="button"
accessibilityState={{ disabled: isLocked }}
```

### Feedback obligatoire
- [x] Feedback visuel immédiat sur tap carte
- [x] Shake sur carte verrouillée (pas punitif, informatif)
- [x] Mascotte réagit au tap (clignement, petit saut)

### Navigation
- [x] Bouton retour coin supérieur gauche
- [x] Profondeur : Home → Intro (niveau 2)
- [x] Retour accueil en 1 tap

---

## 🖼️ ASSETS & RESSOURCES

### Emojis/Icônes
| Usage | Emoji/Icône | Fallback |
|-------|-------------|----------|
| Titre | 🔮 | Lucide: Sparkles |
| Stats étoiles | ⭐ | Lucide: Star |
| Stats puzzles | 🧩 | Lucide: Puzzle |
| Forêt | 🌲 | - |
| Spatial | 🚀 | - |
| Château | 🏰 | - |
| Atelier | 🎨 | - |
| Mystère | 🌀 | - |
| Lock | 🔒 | Lucide: Lock |
| Déco | 🔷△⭐ | - |

### Sons
| Événement | Fichier | Durée | Notes |
|-----------|---------|-------|-------|
| Card tap | card-tap.mp3 | 100ms | Pop léger |
| World select | world-select.mp3 | 300ms | Whoosh magique |
| Locked tap | locked.mp3 | 200ms | Doux "bonk" |

---

## 📱 RESPONSIVE & ADAPTATION

### iPad (principal)
| Élément | Valeur |
|---------|--------|
| Padding écran | 24dp |
| Colonnes mondes | 2 |
| Card width | (screen - 48 - 16) / 2 |
| Mascotte | 140×160 |
| Font title | 28px |

### iPhone (secondaire)
| Élément | Valeur |
|---------|--------|
| Padding écran | 16dp |
| Colonnes mondes | 1 (scroll horizontal) |
| Card width | 280px fixed |
| Mascotte | 100×120 |
| Font title | 24px |

### Adaptation par âge
| Élément | 7-8 ans | 9-10 ans |
|---------|---------|----------|
| Touch target | 150×180dp | 140×160dp |
| Font size body | 16px | 15px |
| Mascotte speech | Toujours visible | Collapse option |

---

## 🧩 COMPOSANTS RÉUTILISABLES

### Design System existant
- [x] `<BackButton />` - Bouton retour standard
- [x] `<ProgressBar />` - Barre de progression
- [ ] `<Badge variant="new" />` - À créer

### Composants à créer pour cet écran
- [ ] `<PixelMascot mood="happy|thinking|excited" />` - Mascotte renard
- [ ] `<SpeechBubble position="right" />` - Bulle de dialogue
- [ ] `<WorldCard world={WorldConfig} onPress={} />` - Carte de monde
- [ ] `<FloatingDecoration emoji="🔮" />` - Décoration flottante
- [ ] `<MiniMatrix grid={2x2} />` - Preview de puzzle

---

## ✅ CHECKLIST AVANT IMPLÉMENTATION

### Structure
- [x] Arborescence des composants claire
- [x] Props définies pour chaque composant
- [x] Types TypeScript dans SPECS_TECHNIQUES.md

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

1. **Gradient Background** : Utiliser `expo-linear-gradient` avec 3 couleurs. Ne pas oublier `start` et `end` pour direction diagonale.

2. **Pixel Mascot** : Ce composant sera réutilisé sur tous les écrans du jeu. Prévoir les props `mood`, `size`, `animated`. La queue doit être un élément séparé pour l'animation.

3. **World Cards Grid** : Sur iPad utiliser 2 colonnes, sur iPhone un FlatList horizontal. Le dernier monde (Mystère) prend toute la largeur.

4. **Locked State** : L'overlay de verrouillage doit être semi-transparent. Le shake doit être court (250ms total) et non répété.

5. **Progress Persistence** : Récupérer la progression depuis le store Zustand `useStore().worldProgress`.

6. **Navigation** : Utiliser `router.push('/(games)/matrices-magiques/puzzle')` avec le worldId en param.

7. **Floating Decorations** : Utiliser `position: absolute` avec des positions aléatoires. Chaque décoration a un timing légèrement différent pour éviter la synchronisation.

---

## 📄 CODE DE DÉMARRAGE

```typescript
// screens/MatricesIntroScreen.tsx
import React from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  withDelay,
  useSharedValue,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { PixelMascot } from '../components/PixelMascot';
import { SpeechBubble } from '../components/SpeechBubble';
import { WorldCard } from '../components/WorldCard';
import { BackButton } from '@/components/common';
import { useStore } from '@/store/useStore';
import { WORLDS } from '../data/worlds';

export const MatricesIntroScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const worldProgress = useStore(state => state.worldProgress);
  
  const handleWorldPress = (worldId: string, isLocked: boolean) => {
    if (isLocked) {
      // Shake animation + haptic
      return;
    }
    router.push({
      pathname: '/(games)/matrices-magiques/puzzle',
      params: { worldId },
    });
  };
  
  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Floating Decorations */}
      {/* Header */}
      {/* Mascot Section */}
      {/* Worlds Grid */}
      {/* Demo Section */}
    </LinearGradient>
  );
};
```
