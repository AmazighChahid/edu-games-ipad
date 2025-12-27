# BRIEF REACT NATIVE : EmbouteillageIntroScreen

## 📋 MÉTADONNÉES
| Champ | Valeur |
|-------|--------|
| Type | Screen |
| Fichier HTML | embouteillage-intro.html |
| Dépendances | GarageMascot, CategoryCard, Button, PageContainer |

---

## 🌳 STRUCTURE

```
EmbouteillageIntroScreen
├── [PageContainer] (style: container)
│   │
│   ├── [GarageBackground] (style: background, animated)
│   │   ├── [AsphaltFloor] (style: floor)
│   │   │   └── [ParkingLines] (yellow dashed lines)
│   │   ├── [GarageWall] (style: wall)
│   │   │   ├── [WallPanel] (style: panel, "🚗 EMBOUTEILLAGE 🚕")
│   │   │   └── [WallTools] (style: tools, 🔧🪛⚙️)
│   │   ├── [GarageLamp] (animated, flickering)
│   │   ├── [Decorations]
│   │   │   ├── [Cones] (animated wobble)
│   │   │   ├── [OilBarrels]
│   │   │   └── [TireStacks]
│   │   ├── [AnimatedCars] (3 cars crossing, animated)
│   │   └── [TaxiShowcase] (center, pulsing)
│   │
│   ├── [Header] (style: header)
│   │   ├── [BackButton] (touchable, 64×64)
│   │   ├── [TitleSection]
│   │   │   ├── [GameIcon] (🚗)
│   │   │   └── [Title] (Fredoka 28px "Embouteillage")
│   │   └── [StatsRow]
│   │       ├── [StarsBadge] (⭐ count)
│   │       └── [ProgressBadge] (🏆 completed/total)
│   │
│   ├── [ContentArea] (style: content)
│   │   ├── [MascotSection] (style: mascotSection)
│   │   │   ├── [GarageMascot] (Gus, 180×200, animated)
│   │   │   └── [SpeechBubble] (style: speechBubble)
│   │   │       └── [Text] (intro message)
│   │   │
│   │   └── [CategoriesGrid] (style: categoriesGrid)
│   │       ├── [CategoryCard] (Débutant 🌱)
│   │       ├── [CategoryCard] (Apprenti 🔧)
│   │       ├── [CategoryCard] (Mécanicien ⚙️)
│   │       ├── [CategoryCard] (Expert 🏆)
│   │       └── [CategoryCard] (Maître 👑, locked)
│   │
│   └── [Footer] (style: footer)
│       ├── [CurrentCategory] (text)
│       └── [PlayButton] (primary, large, "▶️ Jouer niveau X")
```

---

## 🎨 STYLES

```typescript
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2C2C', // Dark garage
  },

  // === BACKGROUND ===
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  floor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: '#3D3D3D', // Asphalt
  },
  
  parkingLine: {
    position: 'absolute',
    width: 4,
    height: 30,
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
  
  wall: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '65%',
    backgroundColor: '#4A4A4A',
  },
  
  wallPanel: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: '#5C4033',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 4,
    borderColor: '#8B4513',
  },
  
  wallPanelText: {
    fontFamily: 'Fredoka',
    fontSize: 24,
    fontWeight: '700',
    color: '#FFD700',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  
  garageLamp: {
    position: 'absolute',
    top: 0,
    right: 100,
    width: 60,
    height: 100,
  },
  
  lampLight: {
    position: 'absolute',
    top: 80,
    width: 200,
    height: 300,
    // Conical gradient simulated with multiple views
  },

  // === HEADER ===
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    zIndex: 10,
  },
  
  backButton: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  gameIcon: {
    fontSize: 32,
  },
  
  title: {
    fontFamily: 'Fredoka',
    fontSize: isTablet ? 28 : 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  
  statIcon: {
    fontSize: 18,
  },
  
  statValue: {
    fontFamily: 'Fredoka',
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3436',
  },

  // === CONTENT ===
  content: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    zIndex: 10,
  },
  
  mascotSection: {
    width: isTablet ? 220 : 160,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  
  speechBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    maxWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  
  speechBubbleArrow: {
    position: 'absolute',
    bottom: -10,
    left: '50%',
    marginLeft: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },
  
  speechText: {
    fontFamily: 'Nunito',
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    lineHeight: 20,
    textAlign: 'center',
  },

  // === CATEGORIES GRID ===
  categoriesGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    gap: 16,
    paddingHorizontal: 20,
  },

  // === FOOTER ===
  footer: {
    alignItems: 'center',
    paddingBottom: 24,
    paddingHorizontal: 24,
    gap: 12,
    zIndex: 10,
  },
  
  currentCategory: {
    fontFamily: 'Nunito',
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 20,
    minWidth: 280,
    // Gradient: ['#FFD700', '#FFA500']
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  
  playButtonText: {
    fontFamily: 'Fredoka',
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
```

### Couleurs
| Token | Hex | Usage |
|-------|-----|-------|
| garageDark | #2C2C2C | Fond garage |
| asphalt | #3D3D3D | Sol asphalte |
| wall | #4A4A4A | Mur garage |
| wood | #5C4033 | Panneau bois |
| woodBorder | #8B4513 | Bordure bois |
| taxiYellow | #FFD700 | Taxi, lignes parking |
| orangeAccent | #FF6B35 | Salopette Gus |
| redCap | #E74C3C | Casquette Gus |
| raccoonGray | #708090 | Fourrure Gus |

### Gradients
| Nom | Couleurs | Direction |
|-----|----------|-----------|
| playButton | ['#FFD700', '#FFA500'] | 135deg |
| debutant | ['#7BC74D', '#5BAE6B'] | 135deg |
| apprenti | ['#5B8DEE', '#4A7BD9'] | 135deg |
| mecanicien | ['#FFB347', '#FFA020'] | 135deg |
| expert | ['#E056FD', '#C840E0'] | 135deg |
| maitre | ['#2C2C2C', '#4A4A4A'] | 135deg (locked) |

---

## 🎬 ANIMATIONS

### Animation 1 : Taxi Showcase Pulse
```typescript
const taxiPulse = useAnimatedStyle(() => ({
  transform: [
    { scale: withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    )}
  ],
}));
```

### Animation 2 : Garage Lamp Flicker
```typescript
const lampFlicker = useAnimatedStyle(() => ({
  opacity: withRepeat(
    withSequence(
      withTiming(1, { duration: 100 }),
      withTiming(0.7, { duration: 50 }),
      withTiming(1, { duration: 100 }),
      withTiming(0.9, { duration: 2000 }),
    ),
    -1,
    false
  ),
}));
```

### Animation 3 : Cones Wobble
```typescript
const coneWobble = useAnimatedStyle(() => ({
  transform: [
    { rotate: withRepeat(
      withSequence(
        withTiming('-3deg', { duration: 1500 }),
        withTiming('3deg', { duration: 1500 })
      ),
      -1,
      true
    )}
  ],
}));
```

### Animation 4 : Animated Cars
```typescript
const carMove = useAnimatedStyle(() => ({
  transform: [
    { translateX: withRepeat(
      withTiming(width + 200, { duration: 20000 }),
      -1,
      false
    )}
  ],
}));
// Start from -200, reset on complete
```

### Animation 5 : Gus Idle
```typescript
const gusIdle = useAnimatedStyle(() => ({
  transform: [
    { translateY: withRepeat(
      withSequence(
        withTiming(-5, { duration: 1500 }),
        withTiming(0, { duration: 1500 })
      ),
      -1,
      true
    )}
  ],
}));
```

### Animation 6 : Category Card Hover
```typescript
const cardPress = useAnimatedStyle(() => ({
  transform: [
    { scale: withSpring(pressed.value ? 0.95 : 1, {
      damping: 15,
      stiffness: 200
    })}
  ],
}));
```

| Élément | Propriété | Animation | Durée |
|---------|-----------|-----------|-------|
| Taxi | scale | 1 → 1.05 → 1 | 2s loop |
| Lamp | opacity | 1 → 0.7 → 1 | flicker |
| Cones | rotate | -3deg → 3deg | 3s loop |
| Cars | translateX | -200 → width+200 | 20-25s |
| Gus | translateY | 0 → -5 → 0 | 3s loop |
| Cards | scale | 1 → 0.95 | spring |

---

## 👆 INTERACTIONS

| Élément | Geste | Feedback |
|---------|-------|----------|
| BackButton | onPress | scale 0.95, navigate back |
| CategoryCard | onPress | scale 0.95, select category |
| CategoryCard | disabled | opacity 0.5 (locked) |
| PlayButton | onPress | scale 0.95, navigate to game |

---

## 👶 CONTRAINTES ENFANT

- [x] Touch targets ≥ 64dp (BackButton 64×64, Cards 180×100, PlayButton 280×56)
- [x] Contraste ≥ 4.5:1 (white text on dark background)
- [x] Feedback immédiat sur tap
- [x] Pas de feedback punitif
- [x] Bouton retour visible (top left)
- [x] Catégories verrouillées clairement indiquées (🔒 + grisé)

---

## 🖼️ ASSETS

### Emojis/Icônes
| Usage | Valeur |
|-------|--------|
| Game icon | 🚗 |
| Taxi | 🚕 |
| Stars | ⭐ |
| Trophy | 🏆 |
| Categories | 🌱 🔧 ⚙️ 🏆 👑 |
| Lock | 🔒 |
| Play | ▶️ |
| Tools | 🔧🪛⚙️ |

### Sons
| Événement | Fichier |
|-----------|---------|
| Category select | soft-tap.mp3 |
| Play button | engine-start.mp3 |
| Navigate | whoosh.mp3 |

---

## 🧩 COMPOSANTS À CRÉER

### CategoryCard
```typescript
interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
  completed: number;
  total: number;
  stars: 0 | 1 | 2 | 3;
  locked: boolean;
  selected: boolean;
  onPress: () => void;
}
```

### GarageMascot (Gus)
```typescript
interface GarageMascotProps {
  size?: 'small' | 'medium' | 'large';
  expression?: 'neutral' | 'happy' | 'thinking';
  animate?: boolean;
}
```

---

## 💬 NOTES CLAUDE CODE

1. **Parking Lines** : Utiliser un loop pour créer les lignes jaunes pointillées sur le sol, espacées de 80px
2. **Animated Cars** : 3 voitures avec delays différents (0s, 8s, 16s) sur un cycle de 24s
3. **Category Lock** : Le niveau Maître est verrouillé si moins de 60% des niveaux Expert sont complétés
4. **Play Button** : Affiche le prochain niveau non complété de la catégorie sélectionnée
5. **Progress Calculation** : stars = sum of all puzzle stars, completed = puzzles with at least 1 star
6. **Gus Mascot** : Raton laveur avec salopette orange, casquette rouge, masque noir, clé à molette

---
