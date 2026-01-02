# Créer ou Modifier une Mascotte

> **Usage** : Ajouter une nouvelle mascotte ou modifier une existante
> **Source de vérité** : `src/games/*/components/*Mascot.tsx`

---

## Protocole 3 étapes

### Étape 1 : Confirmer la lecture

```text
✅ J'ai lu : MASCOTTES_GUIDELINES.md
✅ Mascottes existantes consultées : src/games/*/components/*Mascot.tsx
✅ Jeu concerné : [nom du jeu]
```

### Étape 2 : Questions de clarification

**Pour une création :**
1. Quel animal/personnage ?
2. Quels traits de personnalité ? (3 max)
3. Quel ton de voix ? (enjoué / calme / curieux / sage)
4. Palette de couleurs souhaitée ?

**Pour une modification :**
1. Quel aspect modifier ? (visuel / dialogues / animations)
2. Pourquoi ce changement ?
3. Impact sur les dialogues existants ?

### Étape 3 : Plan

```text
📋 PLAN :
1. Créer/modifier le composant {Nom}Mascot.tsx
2. Définir les dialogues dans assistantScripts.ts
3. Intégrer avec MascotBubble
4. Tester les animations

→ ATTENDRE VALIDATION avant de commencer
```

---

## Document de référence

| Document | Contenu |
|----------|---------|
| `CONTEXTE/MASCOTTES_GUIDELINES.md` | Règles de personnalité, ton, comportement |

**Code de référence** : `src/games/02-suites-logiques/components/PixelMascot.tsx`

---

## Mascottes existantes

> **Source de vérité** : Consulter le code `src/games/*/components/*Mascot.tsx`

| Jeu | Mascotte | Animal |
|-----|----------|--------|
| Tour de Hanoï | Piou | Chouette |
| Suites Logiques | Pixel | Robot |
| Labyrinthe | Scout | Écureuil |
| Balance Logique | Dr. Hibou | Hibou |
| Sudoku | Prof. Hoo | Hibou |
| Conteur Curieux | Plume | Plume |
| Memory | Memo | Éléphant |
| Tangram | Géo | Renard |
| Logix Grid | Ada | Fourmi |
| Mots Croisés | Lexie | Perroquet |
| MathBlocks | Calc | Castor |
| Matrices Magiques | Pixel | Renard |

---

## Structure d'une mascotte

### Fichier composant

```
src/games/{XX-nomjeu}/components/
└── {Nom}Mascot.tsx
```

### Template TypeScript

```typescript
// src/games/{XX-nomjeu}/components/{Nom}Mascot.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  useSharedValue,
} from 'react-native-reanimated';
import { theme } from '@/theme';

// ============================================
// TYPES
// ============================================

export type MascotEmotion = 'neutral' | 'happy' | 'thinking' | 'encouraging';

export interface {Nom}MascotProps {
  emotion?: MascotEmotion;
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
}

// ============================================
// CONSTANTES
// ============================================

const SIZES = {
  small: 48,
  medium: 80,
  large: 120,
};

// ============================================
// COMPOSANT
// ============================================

export function {Nom}Mascot({
  emotion = 'neutral',
  size = 'medium',
  onPress,
}: {Nom}MascotProps) {
  // Animation idle (léger mouvement)
  const bounce = useSharedValue(0);

  React.useEffect(() => {
    bounce.value = withRepeat(
      withSequence(
        withSpring(-5, { damping: 2 }),
        withSpring(0, { damping: 2 })
      ),
      -1, // infini
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  const dimensions = SIZES[size];

  return (
    <Animated.View style={[styles.container, animatedStyle, { width: dimensions, height: dimensions }]}>
      {/* SVG ou Image de la mascotte */}
      {/* Adapter l'expression selon emotion */}
    </Animated.View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default {Nom}Mascot;
```

---

## Intégration avec MascotBubble

```typescript
import { MascotBubble } from '@/components/common';
import { {Nom}Mascot } from '../components/{Nom}Mascot';

// Dans l'écran de jeu
<MascotBubble
  message={currentMessage}
  mascot={<{Nom}Mascot emotion="happy" size="medium" />}
  position="bottom-left"
  onDismiss={handleDismiss}
/>
```

---

## Dialogues (assistantScripts.ts)

```typescript
// src/games/{XX-nomjeu}/data/assistantScripts.ts

export const assistantScripts = {
  // Introduction
  intro: {
    '6-7': "Salut ! Je suis {Nom}. On va s'amuser ensemble !",
    '8-10': "Bonjour ! Je m'appelle {Nom}. Prêt pour un défi ?",
  },

  // Succès
  success: [
    "Super ! Tu as trouvé !",
    "Bravo ! Continue comme ça !",
    "Excellent travail !",
  ],

  // Encouragement après erreur (JAMAIS punitif)
  encouragement: [
    "Pas tout à fait... Essaie encore !",
    "Presque ! Réfléchis bien...",
    "Ce n'est pas grave, on apprend en essayant !",
  ],

  // Indices progressifs
  hints: {
    level1: "Regarde bien...",
    level2: "Et si tu essayais de...",
    level3: "La solution est proche de...",
  },

  // Victoire
  victory: {
    normal: "Félicitations ! Tu as réussi !",
    perfect: "Incroyable ! Sans aucune erreur !",
  },

  // Inactivité (> 30s)
  idle: "Tu réfléchis ? Prends ton temps !",
};
```

---

## Règles de personnalité

### Ton général

- **Bienveillant** : Toujours encourageant, jamais moqueur
- **Simple** : Phrases courtes, vocabulaire adapté à l'âge
- **Patient** : L'erreur est normale, on apprend en essayant

### Émotions

| Émotion | Quand l'utiliser |
|---------|------------------|
| `neutral` | État par défaut, observation |
| `happy` | Succès, encouragement |
| `thinking` | Indice, réflexion avec l'enfant |
| `encouraging` | Après une erreur |

### Ce qu'une mascotte ne fait JAMAIS

- Donner la réponse directement
- Critiquer ou se moquer
- Interrompre l'enfant qui réfléchit
- Utiliser un vocabulaire complexe

---

## Checklist

**Création**
- [ ] Composant `{Nom}Mascot.tsx` créé
- [ ] Animations idle implémentées
- [ ] 4 émotions supportées
- [ ] Export dans `index.ts` du jeu

**Dialogues**
- [ ] Scripts par tranche d'âge (6-7 / 8-10)
- [ ] Messages de succès variés (3+)
- [ ] Messages d'encouragement (jamais punitifs)
- [ ] Indices progressifs (3 niveaux)

**Intégration**
- [ ] Fonctionne avec `MascotBubble`
- [ ] Testé sur différentes tailles d'écran

---

*Préprompt mascotte — Décembre 2024*
