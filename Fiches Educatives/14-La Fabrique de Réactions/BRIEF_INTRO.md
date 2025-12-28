# BRIEF REACT NATIVE : Écran Introduction
## La Fabrique de Réactions - FabriqueIntroScreen

---

## 📋 Informations Générales

| Propriété | Valeur |
|-----------|--------|
| **Fichier** | `src/games/fabrique-reactions/screens/FabriqueIntroScreen.tsx` |
| **Type** | Screen Component |
| **Prototype HTML** | `fabrique-intro.html` |
| **Priorité** | Haute |

---

## 🏗️ Hiérarchie des Composants

```
FabriqueIntroScreen
├── WorkshopBackground                # Fond animé atelier
│   ├── Wall                          # Mur avec panneaux
│   ├── Shelves                       # Étagères avec outils
│   ├── Lamp                          # Lampe suspendue + glow
│   ├── Floor                         # Sol en planches
│   ├── Workbench                     # Établi
│   ├── DecorativeGears               # Engrenages rotatifs
│   └── Particles                     # Copeaux flottants
│
├── Header
│   ├── BackButton                    # Retour accueil
│   ├── TitleSection                  # Titre + sous-titre
│   └── StatsBar                      # Étoiles totales + niveaux
│
├── MainContent
│   ├── MascotSection                 # Section Gédéon
│   │   ├── GedeonCharacter           # Personnage animé
│   │   │   ├── Body                  # Corps hamster
│   │   │   ├── Helmet                # Casque jaune
│   │   │   ├── Goggles               # Lunettes
│   │   │   └── Wrench                # Clé animée
│   │   └── SpeechBubble              # Bulle dialogue
│   │
│   └── WorldsSection
│       ├── SectionTitle              # "Choisis ton Monde"
│       ├── WorldsGrid                # Grille 5 mondes
│       │   └── WorldCard (×5)        # Carte monde
│       │       ├── IconContainer     # Icône thème
│       │       ├── WorldName         # Nom du monde
│       │       ├── ProgressBar       # Barre progression
│       │       ├── StarsDisplay      # Étoiles obtenues
│       │       └── LockOverlay?      # Si verrouillé
│       │
│       └── LevelsSection             # Niveaux du monde actif
│           ├── LevelsHeader
│           └── LevelsScroll
│               └── LevelButton (×15) # Bouton niveau
│
└── Footer
    ├── CurrentLevelInfo              # Badge niveau actuel
    ├── ModeSelector                  # Sélection mode
    │   └── ModeButton (×4)           # Complète/Ordre/Erreur/Créatif
    └── PlayButton                    # Bouton principal
```

---

## 🎨 Design Tokens

### Couleurs

```typescript
const FABRIQUE_COLORS = {
  // Fond atelier
  wallMain: '#D4A574',
  wallSecondary: '#C49A6C',
  floorDark: '#6B4423',
  floorLight: '#8B5A2B',
  wood: '#A0522D',
  
  // Accents
  yellow: '#F1C40F',
  yellowDark: '#D4AC0D',
  orange: '#E67E22',
  
  // Gédéon
  hamsterBody: '#C9A86C',
  hamsterBelly: '#F5E6D3',
  hamsterNose: '#2C1810',
  
  // États mondes
  worldUnlocked: '#FFFFFF',
  worldLocked: 'rgba(255,255,255,0.6)',
  
  // Niveaux
  levelCompleted: '#27AE60',
  levelCurrent: '#F1C40F',
  levelLocked: '#E0E0E0',
  
  // Texte
  textPrimary: '#4A3728',
  textSecondary: '#8B5A2B',
};
```

### Dimensions

```typescript
const FABRIQUE_SIZES = {
  // Header
  backButtonSize: 56,
  statBadgeHeight: 44,
  
  // Mondes
  worldCardWidth: 160,
  worldCardHeight: 200,
  worldIconSize: 80,
  
  // Niveaux
  levelButtonSize: 56,
  levelButtonRadius: 14,
  
  // Gédéon
  gedeonWidth: 180,
  gedeonHeight: 200,
  
  // Bouton jouer
  playButtonHeight: 64,
  playButtonRadius: 20,
};
```

---

## 📱 Props Interface

```typescript
interface FabriqueIntroScreenProps {
  childName: string;
  progress: FabriqueProgress;
  onStartLevel: (worldId: number, levelId: number, mode: GameMode) => void;
  onBack: () => void;
}

interface FabriqueProgress {
  currentWorld: number;
  currentLevel: number;
  totalStars: number;
  levelsCompleted: number;
  worldProgress: WorldProgress[];
  unlockedElements: string[];
}

interface WorldProgress {
  worldId: number;
  isUnlocked: boolean;
  levelsCompleted: number;
  totalLevels: number;
  stars: number;
  maxStars: number;
  levelDetails: LevelProgress[];
}

interface LevelProgress {
  levelId: number;
  isCompleted: boolean;
  stars: 0 | 1 | 2 | 3;
  bestMoves: number;
  bestTime: number;
}

type GameMode = 'complete' | 'reorder' | 'findError' | 'creative';
```

---

## 🎬 Animations Reanimated 3

### 1. Gédéon Bounce Idle

```typescript
// Animation de respiration/bounce
const gedeonTranslateY = useSharedValue(0);

useEffect(() => {
  gedeonTranslateY.value = withRepeat(
    withSequence(
      withTiming(-10, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
    ),
    -1, // Infinite
    true // Reverse
  );
}, []);

const gedeonStyle = useAnimatedStyle(() => ({
  transform: [{ translateY: gedeonTranslateY.value }],
}));
```

### 2. Wrench Wiggle

```typescript
// Animation de la clé qui oscille
const wrenchRotation = useSharedValue(-30);

useEffect(() => {
  wrenchRotation.value = withRepeat(
    withSequence(
      withTiming(-20, { duration: 500, easing: Easing.inOut(Easing.ease) }),
      withTiming(-30, { duration: 500, easing: Easing.inOut(Easing.ease) })
    ),
    -1,
    true
  );
}, []);

const wrenchStyle = useAnimatedStyle(() => ({
  transform: [{ rotate: `${wrenchRotation.value}deg` }],
}));
```

### 3. Decorative Gears Rotation

```typescript
// Rotation continue des engrenages décoratifs
const gearRotation = useSharedValue(0);

useEffect(() => {
  gearRotation.value = withRepeat(
    withTiming(360, { duration: 15000, easing: Easing.linear }),
    -1,
    false
  );
}, []);

const gearStyle = useAnimatedStyle(() => ({
  transform: [{ rotate: `${gearRotation.value}deg` }],
  opacity: 0.2,
}));
```

### 4. Lamp Glow Flicker

```typescript
// Effet de scintillement de la lampe
const lampOpacity = useSharedValue(0.8);

useEffect(() => {
  lampOpacity.value = withRepeat(
    withSequence(
      withTiming(1, { duration: 1500 }),
      withTiming(0.8, { duration: 1500 })
    ),
    -1,
    true
  );
}, []);

const lampGlowStyle = useAnimatedStyle(() => ({
  opacity: lampOpacity.value,
}));
```

### 5. World Card Selection

```typescript
// Sélection d'une carte monde
const worldScale = useSharedValue(1);
const worldBorderWidth = useSharedValue(0);

const selectWorld = (worldId: number) => {
  worldScale.value = withSequence(
    withSpring(1.05, { damping: 15, stiffness: 300 }),
    withSpring(1, { damping: 15, stiffness: 300 })
  );
  worldBorderWidth.value = withTiming(4, { duration: 200 });
};

const worldCardStyle = useAnimatedStyle(() => ({
  transform: [{ scale: worldScale.value }],
  borderWidth: worldBorderWidth.value,
  borderColor: '#F1C40F',
}));
```

### 6. Current Level Pulse

```typescript
// Pulsation du niveau actuel
const levelPulse = useSharedValue(0);

useEffect(() => {
  levelPulse.value = withRepeat(
    withSequence(
      withTiming(8, { duration: 1000 }),
      withTiming(4, { duration: 1000 })
    ),
    -1,
    true
  );
}, []);

const currentLevelStyle = useAnimatedStyle(() => ({
  shadowRadius: levelPulse.value,
  shadowColor: '#F1C40F',
  shadowOpacity: 0.5,
}));
```

### 7. Play Button Hover

```typescript
// Animation du bouton jouer au press
const playScale = useSharedValue(1);
const playTranslateY = useSharedValue(0);

const onPlayPressIn = () => {
  playScale.value = withSpring(0.95, { damping: 15 });
};

const onPlayPressOut = () => {
  playScale.value = withSpring(1, { damping: 10, stiffness: 200 });
};

const playButtonStyle = useAnimatedStyle(() => ({
  transform: [
    { scale: playScale.value },
    { translateY: playTranslateY.value },
  ],
}));
```

### 8. Floating Wood Shavings

```typescript
// Copeaux flottants
const shavingY = useSharedValue(0);
const shavingRotation = useSharedValue(0);
const shavingOpacity = useSharedValue(0.6);

useEffect(() => {
  shavingY.value = withRepeat(
    withTiming(-15, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
    -1,
    true
  );
  shavingRotation.value = withRepeat(
    withTiming(180, { duration: 8000 }),
    -1,
    true
  );
  shavingOpacity.value = withRepeat(
    withSequence(
      withTiming(1, { duration: 4000 }),
      withTiming(0.6, { duration: 4000 })
    ),
    -1,
    true
  );
}, []);

const shavingStyle = useAnimatedStyle(() => ({
  transform: [
    { translateY: shavingY.value },
    { rotate: `${shavingRotation.value}deg` },
  ],
  opacity: shavingOpacity.value,
}));
```

---

## 📦 Composants Réutilisables

### WorldCard

```typescript
interface WorldCardProps {
  world: WorldConfig;
  progress: WorldProgress;
  isSelected: boolean;
  onSelect: (worldId: number) => void;
}

const WorldCard: React.FC<WorldCardProps> = ({
  world,
  progress,
  isSelected,
  onSelect,
}) => {
  const isLocked = !progress.isUnlocked;
  
  return (
    <Pressable
      onPress={() => !isLocked && onSelect(world.id)}
      style={[
        styles.worldCard,
        isSelected && styles.worldCardSelected,
        isLocked && styles.worldCardLocked,
      ]}
    >
      <View style={[styles.worldIcon, { backgroundColor: world.bgColor }]}>
        <Text style={styles.worldEmoji}>{world.emoji}</Text>
      </View>
      
      <Text style={styles.worldName}>{world.name}</Text>
      
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {progress.levelsCompleted}/{progress.totalLevels} niveaux
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${(progress.levelsCompleted / progress.totalLevels) * 100}%`,
                backgroundColor: world.accentColor,
              }
            ]} 
          />
        </View>
      </View>
      
      <View style={styles.starsRow}>
        {renderStars(progress.stars, progress.maxStars)}
      </View>
      
      {isLocked && (
        <View style={styles.lockOverlay}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.unlockReq}>
            Besoin de {world.requiredStars} ⭐
          </Text>
        </View>
      )}
    </Pressable>
  );
};
```

### LevelButton

```typescript
interface LevelButtonProps {
  level: LevelProgress;
  levelNumber: number;
  isCurrent: boolean;
  onPress: (levelNumber: number) => void;
}

const LevelButton: React.FC<LevelButtonProps> = ({
  level,
  levelNumber,
  isCurrent,
  onPress,
}) => {
  const isLocked = !level.isCompleted && !isCurrent;
  
  const getStyle = () => {
    if (level.isCompleted) return styles.levelCompleted;
    if (isCurrent) return styles.levelCurrent;
    return styles.levelLocked;
  };
  
  return (
    <Pressable
      onPress={() => !isLocked && onPress(levelNumber)}
      style={[styles.levelButton, getStyle()]}
    >
      {isLocked ? (
        <Text style={styles.lockEmoji}>🔒</Text>
      ) : (
        <>
          <Text style={styles.levelNumber}>{levelNumber}</Text>
          {level.isCompleted && (
            <Text style={styles.levelStars}>
              {'⭐'.repeat(level.stars)}
              {'☆'.repeat(3 - level.stars)}
            </Text>
          )}
        </>
      )}
    </Pressable>
  );
};
```

### ModeSelector

```typescript
const GAME_MODES = [
  { id: 'complete', label: '🧩 Complète', desc: 'Remplis les trous' },
  { id: 'reorder', label: '🔢 Ordre', desc: 'Replace les éléments' },
  { id: 'findError', label: '🔍 Erreur', desc: 'Trouve le problème' },
  { id: 'creative', label: '🏗️ Créatif', desc: 'Crée librement' },
];

interface ModeSelectorProps {
  selectedMode: GameMode;
  availableModes: GameMode[];
  onSelectMode: (mode: GameMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({
  selectedMode,
  availableModes,
  onSelectMode,
}) => {
  return (
    <View style={styles.modeContainer}>
      {GAME_MODES.map((mode) => {
        const isAvailable = availableModes.includes(mode.id as GameMode);
        const isSelected = selectedMode === mode.id;
        
        return (
          <Pressable
            key={mode.id}
            onPress={() => isAvailable && onSelectMode(mode.id as GameMode)}
            style={[
              styles.modeButton,
              isSelected && styles.modeButtonActive,
              !isAvailable && styles.modeButtonDisabled,
            ]}
          >
            <Text style={styles.modeLabel}>{mode.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};
```

---

## 📐 StyleSheet

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Background
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  wall: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: '#D4A574',
  },
  floor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: '#8B5A2B',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  titleSection: {
    alignItems: 'center',
  },
  gameTitle: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 36,
    color: '#4A3728',
  },
  gameSubtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: '#8B5A2B',
    marginTop: 4,
  },
  
  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  statIcon: {
    fontSize: 20,
  },
  statValue: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 18,
    color: '#4A3728',
  },
  
  // Main area
  mainArea: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 32,
    gap: 24,
  },
  
  // Mascot section
  mascotSection: {
    width: 320,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gedeonContainer: {
    position: 'relative',
  },
  speechBubble: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginTop: 20,
    maxWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6,
  },
  speechText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: '#4A3728',
    lineHeight: 22,
    textAlign: 'center',
  },
  
  // Worlds grid
  worldsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 22,
    color: '#4A3728',
    marginBottom: 16,
  },
  worldsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  worldCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  },
  worldCardSelected: {
    borderWidth: 4,
    borderColor: '#F1C40F',
  },
  worldCardLocked: {
    opacity: 0.6,
  },
  worldIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  worldEmoji: {
    fontSize: 40,
  },
  worldName: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 15,
    color: '#4A3728',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#EEE',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  
  // Levels section
  levelsSection: {
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 16,
  },
  levelsScroll: {
    flexDirection: 'row',
    gap: 10,
  },
  levelButton: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelCompleted: {
    backgroundColor: '#27AE60',
  },
  levelCurrent: {
    backgroundColor: '#F1C40F',
  },
  levelLocked: {
    backgroundColor: '#E0E0E0',
  },
  levelNumber: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 18,
    color: '#fff',
  },
  levelStars: {
    fontSize: 10,
    marginTop: 2,
  },
  
  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#27AE60',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 20,
    shadowColor: '#27AE60',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 6,
  },
  playButtonText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 22,
    color: '#fff',
  },
  playButtonIcon: {
    fontSize: 26,
  },
});
```

---

## 🔊 Sons

| Action | Fichier | Description |
|--------|---------|-------------|
| Sélection monde | `world_select.mp3` | Pop doux |
| Sélection niveau | `level_select.mp3` | Clic mécanique |
| Bouton jouer | `play_button.mp3` | Engrenage + cloche |
| Hover carte | `card_hover.mp3` | Swoosh léger |
| Mode sélectionné | `mode_switch.mp3` | Click toggle |

---

## ✅ Checklist Implémentation

- [ ] Structure de base et navigation
- [ ] Fond atelier avec éléments décoratifs
- [ ] Animations engrenages et lampe
- [ ] Composant Gédéon avec animations
- [ ] Grille des mondes avec états
- [ ] Sélection de monde interactive
- [ ] Liste des niveaux scrollable
- [ ] Sélecteur de mode de jeu
- [ ] Bouton jouer avec animation
- [ ] Intégration sons
- [ ] Gestion état Zustand
- [ ] Tests unitaires

---

*Brief React Native v1.0 — FabriqueIntroScreen*
