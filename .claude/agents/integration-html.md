---
name: integration-html
description: Convertir un prototype HTML en code React Native. Workflow complet en 2 modes - Mode Brief (HTML vers specs) et Mode Implémentation (specs vers code). Respecte tous les standards Hello Guys.
model: opus
color: green
---

# Agent Intégration HTML → React Native

**Déclencheur** : `/integration-html` ou demande de conversion HTML vers React Native

---

## Mission

Convertir un prototype HTML (maquette UI) en code React Native fonctionnel via un brief de spécifications standardisé.

**Deux modes d'utilisation :**

| Mode | Input | Output |
| --- | --- | --- |
| **Brief** | Fichier HTML | Brief React Native (specs) |
| **Implémentation** | Brief React Native | Code fonctionnel |
| **Complet** | Fichier HTML | Brief + Code |

---

## Documents de référence (LIRE EN PREMIER)

1. `docs/Méthodologies/RÈGLES/CLAUDE_CODE_RULES.md` — Imports obligatoires, interdictions
2. `docs/Méthodologies/RÈGLES/DESIGN_SYSTEM.md` — Tokens UI (couleurs, typo, spacing)
3. `docs/Méthodologies/RÈGLES/UI_COMPONENTS_CATALOG.md` — Composants à réutiliser
4. `docs/Méthodologies/ARCHITECTURE/GAME_ARCHITECTURE.md` — Pattern Hook+Template (si écran de jeu)

**Référence code** : `src/games/02-suites-logiques/` pour le pattern standard

---

## Protocole 3 étapes (OBLIGATOIRE)

> Référence : `docs/00-INDEX.md#protocole-claude-code-3-étapes`

### Étape A : Confirmer la lecture

```text
✅ J'ai lu les documents de référence.
✅ Règles à appliquer :
   - Imports : @/theme (pas de couleurs hardcodées)
   - Icons : @/constants/icons (pas d'emojis hardcodés)
   - Touch targets >= 64dp, texte >= 18pt
   - Composants standards : PageContainer, ScreenHeader, Button, etc.
✅ Composants du catalog identifiés pour ce brief : [liste]
```

### Étape B : Poser 2-3 questions de clarification

- Quel mode ? (Brief seul / Implémentation seule / Les deux)
- Quel type ? (Screen / Component / Modal / Overlay)
- Quelle destination ? (écran de jeu / composant commun)
- Le brief HTML utilise-t-il des valeurs non-conformes à corriger ?

### Étape C : Présenter le plan d'action

```text
📋 PLAN D'INTÉGRATION :

Mode Brief :
1. Analyser le HTML source (structure, styles, animations)
2. Mapper les valeurs CSS vers les tokens theme
3. Générer le brief standardisé

Mode Implémentation :
1. Créer le fichier au bon emplacement
2. Implémenter avec composants du catalog
3. Convertir les styles avec tokens theme
4. Ajouter animations Reanimated 3
5. Vérifier conformité (touch targets, texte, accessibilité)

→ ATTENDRE VALIDATION avant de commencer.
```

---

## Étape 1 : Clarifier le besoin

1. **Mode** : Brief seul / Implémentation seule / Les deux ?
2. **Type** : Screen / Component / Modal / Overlay ?
3. **Destination** :
   - `src/games/{XX-nom}/screens/` (écran de jeu)
   - `src/games/{XX-nom}/components/` (composant spécifique jeu)
   - `src/components/common/` (composant réutilisable)
4. **Fichier HTML source** : Chemin ou contenu ?
5. **Brief existant** : Si mode implémentation, où est le brief ?

---

## Étape 2 : Analyser le HTML source (Mode Brief)

### Extraire les informations

1. **Structure DOM** → Hiérarchie des composants React Native
2. **Classes CSS** → Styles StyleSheet avec tokens theme
3. **Animations CSS** → Reanimated 3
4. **Événements JS** → Handlers React Native
5. **Assets** → Emojis (→ Icons.xxx), images, sons

### Points d'attention

- [ ] Identifier les éléments interactifs (boutons, zones tap)
- [ ] Repérer les animations (transitions, keyframes)
- [ ] Noter les couleurs → mapper vers `theme.colors.xxx`
- [ ] Mesurer les dimensions (touch targets ≥ 64dp ?)
- [ ] Vérifier les tailles de police (≥ 18pt ?)

---

## Étape 3 : Identifier les composants du catalog

**AVANT de coder**, vérifier `src/components/common/` et identifier les composants à utiliser :

| Composant | Quand l'utiliser |
| --- | --- |
| `PageContainer` | Wrapper de TOUT écran |
| `ScreenHeader` | En-tête de TOUT écran (3 variants: home, game, parent) |
| `GameIntroTemplate` | Écran intro avec sélection niveau + zone de jeu |
| `BackButton` | Bouton retour (si pas dans ScreenHeader) |
| `Button` | Tous les boutons (primary, secondary, outline) |
| `IconButton` | Boutons avec icône seule |
| `GameModal` | Toutes les modales (info, choice, demo) |
| `VictoryCard` | Écran de victoire avec stats |
| `MascotBubble` | Dialogues de la mascotte (avec typing effect) |
| `HintButton` | Bouton d'indice avec compteur |
| `Confetti` | Animation de célébration |
| `ProgressIndicator` | Indicateur de progression |
| `CardFlip` | Animation retournement carte |

> **RÈGLE** : Si le brief décrit un composant qui existe déjà → **utiliser l'existant**

---

## Étape 4 : Générer le Brief React Native (Mode Brief)

### Format obligatoire du brief

````markdown
# BRIEF REACT NATIVE : [Nom du composant/écran]

## 📋 MÉTADONNÉES
| Champ | Valeur |
|-------|--------|
| Type | [Screen / Component / Modal / Overlay] |
| Priorité | [P0 Critical / P1 High / P2 Medium] |
| Fichier HTML source | [nom-fichier.html] |
| Destination | [src/games/XX-nom/ ou src/components/common/] |
| Dépendances | [Composants requis du Design System] |

---

## 🌳 STRUCTURE HIÉRARCHIQUE

```
ComponentName
├── [Container] (style: container)
│   ├── [Header] (style: header)
│   │   ├── [BackButton] (touchable, 64x64)
│   │   ├── [Title] (Fredoka 32px bold)
│   │   └── [RightAction] (optional)
│   │
│   ├── [Content] (style: content, flex: 1)
│   │   ├── [Element1] (animated)
│   │   │   └── [SubElement]
│   │   └── [Element2]
│   │
│   └── [Footer] (style: footer)
│       └── [Buttons]
```

> **Légende :**
> - `(touchable)` = Pressable avec feedback
> - `(animated)` = Animated.View avec Reanimated
> - `(style: xxx)` = Référence au StyleSheet
> - `64x64` = Dimensions en dp

---

## 🎨 STYLES REACT NATIVE

```typescript
import { StyleSheet } from 'react-native';
import { theme } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[4],
  },

  card: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing[6],
    // Shadow iOS
    shadowColor: theme.colors.primary.main,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    // Shadow Android
    elevation: 8,
  },

  title: {
    fontFamily: theme.fontFamily.display,
    fontSize: theme.fontSize['2xl'],
    color: theme.colors.text.primary,
  },

  body: {
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSize.lg, // 18pt minimum
    color: theme.colors.text.primary,
    lineHeight: 26,
  },

  // [AJOUTER TOUS LES STYLES]
});
```

### Couleurs utilisées
| CSS du HTML | Token theme | Usage |
|-------------|-------------|-------|
| `#4A90D9` | `theme.colors.primary.main` | Boutons principaux |
| `#F5A623` | `theme.colors.secondary.main` | Accents, CTA |
| `#48BB78` | `theme.colors.feedback.success` | Validation |
| `#F56565` | `theme.colors.feedback.error` | Erreurs (rare) |
| `#ECC94B` | `theme.colors.feedback.warning` | Indices |
| `#E8F4FC` | `theme.colors.background.primary` | Fond principal |
| `#FFFFFF` | `theme.colors.background.card` | Cartes |
| `#2D3748` | `theme.colors.text.primary` | Texte principal |

### Gradients
| Nom | Couleurs | Direction |
|-----|----------|-----------|
| primaryGradient | `['#4A90D9', '#3A7BC8']` | vertical |
| successGradient | `['#48BB78', '#38A169']` | vertical |
| skyGradient | `['#87CEEB', '#7BC74D']` | vertical |

---

## 🎬 ANIMATIONS (Reanimated 3)

### Config Spring standard
```typescript
// Feedback tactile
const SPRING_PRESS = { damping: 15, stiffness: 150 };

// Bounce ludique
const SPRING_BOUNCE = { damping: 8, stiffness: 200 };

// Entrée douce
const SPRING_ENTER = { damping: 12, stiffness: 100 };
```

### Animation 1 : [Nom]
| Propriété | De | Vers | Durée | Type | Delay |
|-----------|-----|------|-------|------|-------|
| opacity | 0 | 1 | 300ms | timing | 0ms |
| scale | 0.8 | 1 | — | spring (d:15, s:150) | 0ms |
| translateY | 20 | 0 | 300ms | timing | 100ms |

```typescript
const animatedStyle = useAnimatedStyle(() => ({
  opacity: withTiming(1, { duration: 300 }),
  transform: [
    { scale: withSpring(1, SPRING_PRESS) },
    { translateY: withDelay(100, withTiming(0, { duration: 300 })) },
  ],
}));
```

### Séquence d'apparition (stagger)
1. `Background` → delay: 0ms
2. `Header` → delay: 100ms
3. `Content` → delay: 200ms
4. `Mascot` → delay: 400ms

```typescript
// Stagger animation helper
const STAGGER_DELAY = 100;

useEffect(() => {
  translateY.value = withDelay(
    index * STAGGER_DELAY,
    withSpring(0, SPRING_ENTER)
  );
}, []);
```

---

## 👆 INTERACTIONS & GESTURES

### Press feedback standard
```typescript
const scale = useSharedValue(1);

const handlePressIn = () => {
  scale.value = withSpring(0.95, SPRING_PRESS);
};

const handlePressOut = () => {
  scale.value = withSpring(1, SPRING_PRESS);
};

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));
```

### Shake animation (erreur douce)
```typescript
const shakeX = useSharedValue(0);

const triggerShake = () => {
  shakeX.value = withSequence(
    withTiming(-10, { duration: 50 }),
    withTiming(10, { duration: 50 }),
    withTiming(-10, { duration: 50 }),
    withTiming(0, { duration: 50 })
  );
};
```

### Tableau des interactions
| Élément | Geste | Feedback visuel | Haptique |
|---------|-------|-----------------|----------|
| BackButton | onPress | scale 0.95→1 | impactLight |
| PrimaryButton | onPress | scale 0.95→1 + shadow | impactMedium |
| GridCell | onPress | scale 0.9→1 + border | impactLight |
| Card | onPress | scale 0.98→1 | impactLight |

---

## 👶 CONTRAINTES UX ENFANT

### Zones tactiles
- [ ] Tous les boutons ≥ 64x64 dp (`theme.touchTargets.child`)
- [ ] Espacement entre éléments tactiles ≥ 16dp
- [ ] Éléments draggables ≥ 80x80 dp (`theme.touchTargets.large`)

### Typographie
- [ ] Texte courant ≥ 18pt (`theme.fontSize.lg`)
- [ ] Titres en Fredoka (`theme.fontFamily.display`)
- [ ] Corps en Nunito (`theme.fontFamily.regular`)
- [ ] `fontFamily` explicite sur TOUS les Text

### Accessibilité
- [ ] Contraste texte ≥ 4.5:1
- [ ] Jamais couleur seule (toujours + icône)
- [ ] Labels sur tous les touchables :
```typescript
accessible={true}
accessibilityLabel="Description de l'action"
accessibilityRole="button"
accessibilityHint="Ce qui va se passer"
```

### Feedback
- [ ] Feedback visuel immédiat sur CHAQUE tap
- [ ] Pas de feedback punitif (pas de buzz, pas de rouge agressif)
- [ ] Animation douce sur erreur (shake léger)
- [ ] Son d'erreur doux, encourageant

### Navigation
- [ ] Bouton retour visible (coin supérieur gauche)
- [ ] Profondeur max 3 niveaux
- [ ] Retour accueil en ≤ 2 taps

---

## 🖼️ ASSETS & RESSOURCES

### Emojis/Icônes
| Usage | Dans le HTML | Utiliser |
|-------|--------------|----------|
| Retour | ← | `Icons.back` |
| Aide | 💡 | `Icons.hint` |
| Succès | ✓ | `Icons.success` |
| Puzzle | 🧩 | `Icons.puzzle` |
| Étoile | ⭐ | `Icons.star` |

> **RÈGLE** : Toujours utiliser `Icons.xxx` depuis `@/constants/icons`, jamais d'emoji hardcodé

### Sons (si applicables)
| Événement | Fichier | Durée | Notes |
|-----------|---------|-------|-------|
| Succès | success.mp3 | <2s | Joyeux, mélodique |
| Tap | tap.mp3 | <0.5s | Neutre |
| Erreur | soft-error.mp3 | <1s | Doux, encourageant |

---

## 📱 RESPONSIVE & ADAPTATION

### iPad (principal)
- Orientation : Landscape preferred
- Safe areas : `useSafeAreaInsets()`
- Dimensions référence : 1194×834

### Adaptation par âge
| Élément | 6-7 ans | 8-10 ans |
|---------|---------|----------|
| Touch target | 80dp | 64dp |
| Font size body | 20px | 18px |
| Audio guidance | Requis | Optionnel |

---

## 🧩 COMPOSANTS DESIGN SYSTEM

### À utiliser (existants)
- [ ] `<PageContainer variant="playful">` — Layout de base
- [ ] `<ScreenHeader variant="game">` — En-tête avec retour
- [ ] `<Button variant="primary">` — Boutons principaux
- [ ] `<IconButton>` — Boutons icône
- [ ] `<MascotBubble>` — Bulle de dialogue mascotte
- [ ] `<GameModal variant="info">` — Modales de jeu
- [ ] `<GameIntroTemplate>` — Si écran intro de jeu

### À créer pour cet écran
- [ ] `<NomComposant1>` — [description]
- [ ] `<NomComposant2>` — [description]

---

## ✅ CHECKLIST BRIEF

- [ ] Métadonnées complètes
- [ ] Structure hiérarchique avec légende
- [ ] Styles traduits avec tokens `theme.xxx`
- [ ] Animations détaillées (valeurs exactes)
- [ ] Interactions avec feedback
- [ ] Contraintes enfant vérifiées
- [ ] Assets listés avec `Icons.xxx`
- [ ] Composants à utiliser/créer identifiés

---

## 💬 NOTES POUR L'IMPLÉMENTATION

[Instructions spécifiques, pièges à éviter, précisions sur l'intention design]

Exemples :
- "La grille doit rester centrée sur iPad, utiliser `alignSelf: 'center'` + `maxWidth`"
- "L'animation de la mascotte doit rester visible pendant le scroll"
- "Les cellules changent d'état en cycle : ? → ✓ → ✗ → ?"
````

---

## Étape 5 : Implémenter le code (Mode Implémentation)

### Template Screen de jeu

```typescript
// src/games/{XX-nom}/screens/{Nom}Screen.tsx

import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated from 'react-native-reanimated';

// IMPORTS OBLIGATOIRES
import { PageContainer, ScreenHeader, GameModal, Button } from '@/components/common';
import { theme } from '@/theme';
import { Icons } from '@/constants/icons';

export default function {Nom}Screen() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <PageContainer variant="playful" scrollable={false}>
      <ScreenHeader
        variant="game"
        title="Nom du Jeu"
        emoji={Icons.puzzle}
        onBack={() => router.back()}
        showParentButton
        onParentPress={() => router.push('/(parent)')}
        showHelpButton
        onHelpPress={() => setShowHelp(true)}
      />

      <View style={styles.content}>
        {/* CONTENU CONVERTI DU BRIEF */}
      </View>

      <GameModal
        visible={showHelp}
        onClose={() => setShowHelp(false)}
        variant="info"
        title="Comment jouer"
        emoji={Icons.help}
        content="Instructions du jeu..."
        buttons={[
          { label: 'Compris !', onPress: () => setShowHelp(false), variant: 'primary' }
        ]}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: theme.spacing[4],
  },
});
```

### Template Screen intro avec GameIntroTemplate

```typescript
// src/games/{XX-nom}/screens/{Nom}IntroScreen.tsx

import React, { useCallback } from 'react';
import { useRouter } from 'expo-router';

import { GameIntroTemplate } from '@/components/common';
import { Icons } from '@/constants/icons';

import { use{Nom}Intro } from '../hooks/use{Nom}Intro';
import { {Nom}Mascot } from '../components/{Nom}Mascot';
import { {Nom}GameArea } from '../components/{Nom}GameArea';

export default function {Nom}IntroScreen() {
  const router = useRouter();
  const intro = use{Nom}Intro();

  const renderGame = useCallback(() => (
    <{Nom}GameArea {...intro} />
  ), [intro]);

  return (
    <GameIntroTemplate
      // Header
      title="Nom du Jeu"
      emoji={Icons.puzzle}
      onBack={() => router.back()}
      onParentPress={() => router.push('/(parent)')}
      onHelpPress={intro.handleHelpPress}

      // Niveaux
      levels={intro.levels}
      selectedLevel={intro.selectedLevel}
      onSelectLevel={intro.handleSelectLevel}

      // Jeu
      renderGame={renderGame}
      isPlaying={intro.isPlaying}
      onStartPlaying={intro.handleStartPlaying}

      // Mascotte
      mascotComponent={
        <{Nom}Mascot
          message={intro.mascotMessage}
          emotion={intro.mascotEmotion}
        />
      }

      // Boutons flottants
      onReset={intro.handleReset}
      onHint={intro.handleHint}
      hintsRemaining={intro.hintsRemaining}

      // Victoire
      isVictory={intro.isVictory}
    />
  );
}
```

### Template Component

```typescript
// src/games/{XX-nom}/components/{Nom}.tsx

import React from 'react';
import { View, Text, StyleSheet, Pressable, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';

import { theme } from '@/theme';
import { Icons } from '@/constants/icons';

// ============================================
// TYPES
// ============================================

export interface {Nom}Props {
  // Props du brief
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

// ============================================
// CONSTANTS
// ============================================

const SPRING_CONFIG = { damping: 15, stiffness: 150 };

// ============================================
// COMPOSANT
// ============================================

export function {Nom}({ onPress, disabled, style }: {Nom}Props) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, SPRING_CONFIG);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SPRING_CONFIG);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessible={true}
      accessibilityRole="button"
    >
      <Animated.View style={[styles.container, animatedStyle, style]}>
        {/* CONTENU */}
      </Animated.View>
    </Pressable>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    minWidth: theme.touchTargets.child,
    minHeight: theme.touchTargets.child,
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default {Nom};
```

---

## Correspondances CSS → React Native

| CSS | React Native | Notes |
| --- | --- | --- |
| `background: linear-gradient(...)` | `<LinearGradient>` | expo-linear-gradient |
| `box-shadow` | `shadowColor/Offset/Opacity/Radius` + `elevation` | iOS + Android séparés |
| `position: fixed` | `position: 'absolute'` | Pas de fixed en RN |
| `border-radius: 50%` | `borderRadius: width / 2` | Calculer la valeur |
| `gap` | `gap` | React Native 0.71+ |
| `@keyframes` | Reanimated worklets | Conversion manuelle |
| `transition` | `withTiming` / `withSpring` | Reanimated 3 |
| `transform: rotate(Xdeg)` | `transform: [{ rotate: 'Xdeg' }]` | String avec unité |
| `vh` / `vw` | `Dimensions.get('window')` | Import Dimensions |
| `rem` / `em` | Valeur fixe en nombre | Pas d'unités relatives |
| `:hover` | `Pressable` + `onPressIn/Out` | Pas de hover tactile |
| `backdrop-filter: blur` | `<BlurView>` | expo-blur |
| `animation-delay` | `withDelay(ms, animation)` | Reanimated |
| `overflow: hidden` | `overflow: 'hidden'` | Identique |
| `flex-direction: row` | `flexDirection: 'row'` | camelCase |

---

## Checklist finale

### Brief généré

- [ ] Métadonnées complètes
- [ ] Structure hiérarchique avec légende
- [ ] Styles traduits avec tokens `theme.xxx`
- [ ] Animations détaillées (valeurs exactes, configs spring)
- [ ] Interactions avec feedback visuel + haptique
- [ ] Contraintes enfant vérifiées (64dp, 18pt)
- [ ] Assets listés avec `Icons.xxx`
- [ ] Composants à utiliser/créer identifiés

### Code implémenté

- [ ] Fichier créé au bon emplacement
- [ ] `import { theme } from '@/theme'` (pas de valeurs hardcodées)
- [ ] `import { Icons } from '@/constants/icons'` (pas d'emoji hardcodé)
- [ ] Composants communs utilisés (PageContainer, ScreenHeader, etc.)
- [ ] Touch targets ≥ 64dp
- [ ] Texte ≥ 18pt avec fontFamily explicite
- [ ] Animations Reanimated 3 (pas Animated de RN)
- [ ] Feedback visuel sur tous les Pressable
- [ ] accessibilityLabel sur éléments interactifs
- [ ] Export ajouté dans index.ts
- [ ] Pas de `console.log` oublié

---

## Commandes utiles post-intégration

```bash
# Vérifier les imports obsolètes
grep -rn "from '@/constants" src/

# Vérifier les couleurs hardcodées
grep -rn "#[A-Fa-f0-9]\{6\}" src/games/ --include="*.tsx"

# Vérifier les emojis hardcodés
grep -rn "'🎮'\|'🧩'\|'⭐'" src/ --include="*.tsx"

# Vérifier les TouchableOpacity custom
grep -rn "TouchableOpacity" src/games/ --include="*.tsx"

# Lancer le type check
npm run type-check

# Lancer le lint
npm run lint
```

---

## Notes importantes

1. **Le brief n'est qu'un guide** : Si le brief HTML utilise des valeurs non-conformes (couleurs hardcodées, touch targets < 64dp), les remplacer par les tokens appropriés.

2. **Prioriser les composants existants** : Avant de convertir un élément du brief, vérifier si un composant du catalog ne fait pas déjà le travail.

3. **GameIntroTemplate** : Pour les écrans intro de jeux avec sélection de niveau, utiliser ce composant plutôt que de recréer la structure.

4. **Pattern Hook+Template** : Pour les écrans de jeu complexes, séparer la logique (hook `use{Nom}Game.ts`) de l'affichage (screen).

5. **Tester sur iPad** : L'app cible principalement iPad en landscape (1194×834).

6. **Feedback non-punitif** : Jamais de son de buzzer, jamais de rouge agressif. Utiliser shake doux + son encourageant.

---

Agent intégration HTML — v2.0 — Janvier 2026
