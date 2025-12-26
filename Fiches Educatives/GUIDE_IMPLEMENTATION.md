# 🚀 Guide d'Implémentation - Claude Code

## Vue d'ensemble

Ce guide fournit les instructions pour implémenter les 5 activités éducatives dans une application React Native / Expo.

---

## 📦 Dépendances Requises

```bash
# Installation des dépendances principales
npx expo install react-native-reanimated react-native-gesture-handler
npx expo install expo-haptics expo-av expo-font
npx expo install @react-native-async-storage/async-storage

# Navigation
npx expo install expo-router

# UI
npx expo install react-native-svg
```

### package.json (extrait)

```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "react-native": "0.76.x",
    "react-native-reanimated": "~3.16.0",
    "react-native-gesture-handler": "~2.20.0",
    "expo-haptics": "~14.0.0",
    "expo-av": "~15.0.0",
    "expo-font": "~13.0.0",
    "expo-router": "~4.0.0",
    "@react-native-async-storage/async-storage": "^2.0.0"
  }
}
```

---

## 🏗️ Structure de Projet Recommandée

```
/app-educative/
├── app/                          # Expo Router
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx             # Accueil enfant
│   │   ├── activities/
│   │   │   ├── tour-hanoi.tsx
│   │   │   ├── suites-logiques.tsx
│   │   │   ├── labyrinthe.tsx
│   │   │   ├── balance.tsx
│   │   │   └── sudoku.tsx
│   │   └── profile.tsx           # Profil enfant
│   └── parent/                   # Espace parent (protégé)
│       ├── _layout.tsx
│       ├── dashboard.tsx
│       └── settings.tsx
│
├── src/
│   ├── components/
│   │   ├── ui/                   # Composants UI partagés
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── IconButton.tsx
│   │   │   └── SafeArea.tsx
│   │   │
│   │   ├── feedback/             # Feedback et animations
│   │   │   ├── SuccessAnimation.tsx
│   │   │   ├── ShakeAnimation.tsx
│   │   │   ├── ConfettiEffect.tsx
│   │   │   └── SoundPlayer.tsx
│   │   │
│   │   ├── mascot/               # Mascotte IA
│   │   │   ├── MascotBubble.tsx
│   │   │   ├── MascotAvatar.tsx
│   │   │   └── DialogueSystem.tsx
│   │   │
│   │   └── activities/           # Composants par activité
│   │       ├── TourHanoi/
│   │       ├── SuitesLogiques/
│   │       ├── Labyrinthe/
│   │       ├── Balance/
│   │       └── Sudoku/
│   │
│   ├── hooks/
│   │   ├── useSound.ts
│   │   ├── useHaptics.ts
│   │   ├── useProgress.ts
│   │   └── useChildProfile.ts
│   │
│   ├── context/
│   │   ├── ProgressContext.tsx
│   │   ├── SettingsContext.tsx
│   │   └── AudioContext.tsx
│   │
│   ├── services/
│   │   ├── storage.ts
│   │   ├── analytics.ts
│   │   └── progressTracker.ts
│   │
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── dimensions.ts
│   │   ├── fonts.ts
│   │   └── sounds.ts
│   │
│   └── types/
│       ├── game.ts
│       ├── progress.ts
│       └── child.ts
│
├── assets/
│   ├── images/
│   │   ├── mascots/
│   │   └── activities/
│   ├── sounds/
│   │   ├── effects/
│   │   └── music/
│   └── fonts/
│       ├── Nunito-Regular.ttf
│       └── OpenDyslexic-Regular.otf
│
└── docs/                         # Documentation (ce dossier)
    └── activites/
```

---

## 🎨 Constantes Globales

### colors.ts

```typescript
export const COLORS = {
  // Palette principale
  primary: '#5B8DEE',
  secondary: '#FFB347',
  success: '#7BC74D',
  background: '#FFF9F0',
  accent: '#E056FD',
  attention: '#F39C12',
  
  // Neutres
  text: '#2C3E50',
  textLight: '#7F8C8D',
  white: '#FFFFFF',
  
  // États
  error: '#E74C3C',
  errorSoft: '#FADBD8',
  
  // Transparences
  overlay: 'rgba(0,0,0,0.5)',
} as const;

export type ColorKey = keyof typeof COLORS;
```

### dimensions.ts

```typescript
import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const DIMENSIONS = {
  window: { width, height },
  
  // Boutons (accessibilité enfant)
  button: {
    min: 48,
    recommended: 64,
    large: 80,
  },
  
  // Espacement
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  
  // Typographie
  fontSize: {
    title: 32,
    heading: 24,
    body: 20,
    caption: 16,
  },
  
  // Border radius
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    round: 9999,
  },
  
  // Pour iPad
  isTablet: width >= 768,
} as const;
```

---

## 🧱 Composants UI Partagés

### Button.tsx

```typescript
import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS, DIMENSIONS } from '@/constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'normal' | 'large';
  disabled?: boolean;
  icon?: React.ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'normal',
  disabled = false,
  icon,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const buttonStyle = [
    styles.button,
    styles[variant],
    size === 'large' && styles.large,
    disabled && styles.disabled,
  ];

  return (
    <AnimatedPressable
      style={[buttonStyle, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      {icon}
      <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: DIMENSIONS.spacing.lg,
    paddingVertical: DIMENSIONS.spacing.md,
    borderRadius: DIMENSIONS.radius.md,
    minWidth: DIMENSIONS.button.recommended,
    minHeight: DIMENSIONS.button.recommended,
    gap: DIMENSIONS.spacing.sm,
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  large: {
    minHeight: DIMENSIONS.button.large,
    paddingVertical: DIMENSIONS.spacing.lg,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: DIMENSIONS.fontSize.body,
    fontWeight: '600',
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryText: {
    color: COLORS.text,
  },
  ghostText: {
    color: COLORS.primary,
  },
});
```

### IconButton.tsx

```typescript
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS, DIMENSIONS } from '@/constants';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: number;
  backgroundColor?: string;
  accessibilityLabel: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = DIMENSIONS.button.recommended,
  backgroundColor = COLORS.white,
  accessibilityLabel,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[
        styles.button,
        { width: size, height: size, backgroundColor },
        animatedStyle,
      ]}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.9);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
    >
      {icon}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: DIMENSIONS.radius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
```

---

## 🎭 Système de Mascotte

### MascotBubble.tsx

```typescript
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { COLORS, DIMENSIONS } from '@/constants';

interface MascotBubbleProps {
  message: string;
  mascotType: 'monkey' | 'robot' | 'squirrel' | 'owl' | 'fox';
  onDismiss?: () => void;
  autoHide?: number; // ms
}

const MASCOT_IMAGES = {
  monkey: require('@/assets/images/mascots/monkey.png'),
  robot: require('@/assets/images/mascots/robot.png'),
  squirrel: require('@/assets/images/mascots/squirrel.png'),
  owl: require('@/assets/images/mascots/owl.png'),
  fox: require('@/assets/images/mascots/fox.png'),
};

export const MascotBubble: React.FC<MascotBubbleProps> = ({
  message,
  mascotType,
  onDismiss,
  autoHide = 5000,
}) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1);

    if (autoHide && onDismiss) {
      const timer = setTimeout(onDismiss, autoHide);
      return () => clearTimeout(timer);
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={styles.container}
    >
      <Image source={MASCOT_IMAGES[mascotType]} style={styles.mascot} />
      <Animated.View style={[styles.bubble, animatedStyle]}>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.arrow} />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: DIMENSIONS.spacing.xl,
    left: DIMENSIONS.spacing.lg,
    right: DIMENSIONS.spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  mascot: {
    width: 80,
    height: 80,
    marginRight: DIMENSIONS.spacing.md,
  },
  bubble: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: DIMENSIONS.radius.lg,
    padding: DIMENSIONS.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  message: {
    fontSize: DIMENSIONS.fontSize.body,
    color: COLORS.text,
    lineHeight: DIMENSIONS.fontSize.body * 1.4,
  },
  arrow: {
    position: 'absolute',
    bottom: 10,
    left: -10,
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderRightWidth: 15,
    borderBottomWidth: 10,
    borderTopColor: 'transparent',
    borderRightColor: COLORS.white,
    borderBottomColor: 'transparent',
  },
});
```

---

## 🔊 Hooks Audio et Haptics

### useSound.ts

```typescript
import { useRef, useCallback } from 'react';
import { Audio } from 'expo-av';

const SOUNDS = {
  success: require('@/assets/sounds/effects/success.mp3'),
  error: require('@/assets/sounds/effects/error.mp3'),
  tap: require('@/assets/sounds/effects/tap.mp3'),
  victory: require('@/assets/sounds/effects/victory.mp3'),
  hint: require('@/assets/sounds/effects/hint.mp3'),
};

type SoundName = keyof typeof SOUNDS;

export const useSound = () => {
  const soundsRef = useRef<Record<string, Audio.Sound>>({});

  const playSound = useCallback(async (name: SoundName) => {
    try {
      // Charger si pas en cache
      if (!soundsRef.current[name]) {
        const { sound } = await Audio.Sound.createAsync(SOUNDS[name]);
        soundsRef.current[name] = sound;
      }

      const sound = soundsRef.current[name];
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch (error) {
      console.warn('Sound play error:', error);
    }
  }, []);

  const cleanup = useCallback(async () => {
    for (const sound of Object.values(soundsRef.current)) {
      await sound.unloadAsync();
    }
    soundsRef.current = {};
  }, []);

  return { playSound, cleanup };
};
```

### useHaptics.ts

```typescript
import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const useHaptics = () => {
  const light = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const medium = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, []);

  const success = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  const error = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, []);

  return { light, medium, success, error };
};
```

---

## 💾 Stockage de Progression

### storage.ts

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  CHILD_PROFILE: '@child_profile',
  PROGRESS: '@progress',
  SETTINGS: '@settings',
};

export interface ChildProfile {
  name: string;
  age: number;
  avatarId: string;
  createdAt: string;
}

export interface ActivityProgress {
  activityId: string;
  highestLevel: number;
  totalAttempts: number;
  totalSuccess: number;
  totalTimeSpent: number;
  lastPlayedAt: string;
  achievements: string[];
}

export const storage = {
  // Profil enfant
  async getChildProfile(): Promise<ChildProfile | null> {
    const data = await AsyncStorage.getItem(KEYS.CHILD_PROFILE);
    return data ? JSON.parse(data) : null;
  },

  async setChildProfile(profile: ChildProfile): Promise<void> {
    await AsyncStorage.setItem(KEYS.CHILD_PROFILE, JSON.stringify(profile));
  },

  // Progression
  async getProgress(activityId: string): Promise<ActivityProgress | null> {
    const data = await AsyncStorage.getItem(`${KEYS.PROGRESS}_${activityId}`);
    return data ? JSON.parse(data) : null;
  },

  async setProgress(activityId: string, progress: ActivityProgress): Promise<void> {
    await AsyncStorage.setItem(
      `${KEYS.PROGRESS}_${activityId}`,
      JSON.stringify(progress)
    );
  },

  async getAllProgress(): Promise<Record<string, ActivityProgress>> {
    const keys = await AsyncStorage.getAllKeys();
    const progressKeys = keys.filter(k => k.startsWith(KEYS.PROGRESS));
    
    const result: Record<string, ActivityProgress> = {};
    for (const key of progressKeys) {
      const data = await AsyncStorage.getItem(key);
      if (data) {
        const activityId = key.replace(`${KEYS.PROGRESS}_`, '');
        result[activityId] = JSON.parse(data);
      }
    }
    
    return result;
  },
};
```

---

## 📋 Checklist d'Implémentation

### Phase 1 : Infrastructure
- [ ] Setup projet Expo SDK 52+
- [ ] Configuration Reanimated et Gesture Handler
- [ ] Création structure de dossiers
- [ ] Implémentation constantes (colors, dimensions)
- [ ] Composants UI de base (Button, IconButton)
- [ ] Système de stockage

### Phase 2 : Système Commun
- [ ] Système de mascotte et dialogues
- [ ] Hooks audio et haptics
- [ ] Animations de feedback (success, error, confetti)
- [ ] Navigation avec Expo Router
- [ ] Gestion de la progression

### Phase 3 : Activités
- [ ] Tour de Hanoï
- [ ] Suites Logiques
- [ ] Labyrinthe Logique
- [ ] Balance Logique
- [ ] Sudoku Montessori

### Phase 4 : Espaces
- [ ] Accueil enfant
- [ ] Profil enfant
- [ ] Espace parent (protégé par PIN)
- [ ] Dashboard parent

### Phase 5 : Polish
- [ ] Accessibilité (VoiceOver, contraste)
- [ ] Mode hors-ligne
- [ ] Sons et musique d'ambiance
- [ ] Tests sur iPad réel

---

## 🔗 Ressources Utiles

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Expo Router](https://expo.github.io/router/docs/)
- [Apple Human Interface Guidelines - iPad](https://developer.apple.com/design/human-interface-guidelines/ipad)

---

*Guide d'Implémentation | Application Éducative Montessori iPad*
