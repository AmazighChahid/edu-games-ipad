# INSTRUCTION : GÃ©nÃ©ration HTML + Brief React Native

> **Ã€ ajouter dans les instructions projet pour Claude Web**

---

## RÃˆGLE OBLIGATOIRE

Lorsque tu gÃ©nÃ¨res un fichier HTML de maquette/prototype pour l'app Ã©ducative, tu DOIS **toujours** produire **deux livrables** :

1. **Le fichier HTML** (design visuel complet)
2. **Le Brief React Native** (spÃ©cifications pour Claude Code)

Le brief doit Ãªtre gÃ©nÃ©rÃ© dans un bloc de code markdown sÃ©parÃ©, prÃªt Ã  Ãªtre copiÃ©-collÃ© pour Claude Code.

---

## FORMAT DU BRIEF REACT NATIVE

```markdown
# BRIEF REACT NATIVE : [Nom du composant/Ã©cran]

## ðŸ“‹ MÃ‰TADONNÃ‰ES
- **Type** : [Screen | Component | Modal | Overlay]
- **PrioritÃ©** : [P0 Critical | P1 High | P2 Medium]
- **DÃ©pendances** : [Liste des composants requis]
- **Fichier HTML source** : [nom-fichier.html]

---

## ðŸŒ³ STRUCTURE HIÃ‰RARCHIQUE

```
ComponentName
â”œâ”€â”€ [Container] (style: container)
â”‚   â”œâ”€â”€ [Header] (style: header)
â”‚   â”‚   â”œâ”€â”€ [BackButton] (touchable, 64x64)
â”‚   â”‚   â”œâ”€â”€ [Title] (Fredoka 24px bold)
â”‚   â”‚   â””â”€â”€ [RightAction] (optional)
â”‚   â”‚
â”‚   â”œâ”€â”€ [Content] (style: content, flex: 1)
â”‚   â”‚   â”œâ”€â”€ [Element1]
â”‚   â”‚   â”‚   â””â”€â”€ [SubElement]
â”‚   â”‚   â””â”€â”€ [Element2]
â”‚   â”‚
â”‚   â””â”€â”€ [Footer] (style: footer)
â”‚       â””â”€â”€ [Buttons]
```

> LÃ©gende :
> - `(touchable)` = Pressable/TouchableOpacity
> - `(animated)` = Animated.View avec Reanimated
> - `(style: xxx)` = rÃ©fÃ©rence au StyleSheet
> - `64x64` = dimensions en dp

---

## ðŸŽ¨ STYLES REACT NATIVE

```typescript
import { StyleSheet } from 'react-native';
import { Colors, Spacing, FontFamily } from '@/constants';

export const styles = StyleSheet.create({
  // Container principal
  container: {
    flex: 1,
    backgroundColor: Colors.background, // #FFF9F0
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPadding, // 24
    paddingVertical: Spacing.md, // 16
  },

  // Exemple card avec shadow
  card: {
    backgroundColor: Colors.surface, // #FFFFFF
    borderRadius: 24,
    padding: Spacing.lg, // 24
    // Shadow iOS
    shadowColor: Colors.primary, // #5B8DEE
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    // Shadow Android
    elevation: 8,
  },

  // Exemple gradient (utiliser expo-linear-gradient)
  // gradient: ['#5B8DEE', '#4A7BD9']
  // start: { x: 0, y: 0 }
  // end: { x: 1, y: 1 }

  // Exemple texte
  title: {
    fontFamily: FontFamily.heading, // 'Fredoka'
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary, // #2D3748
  },

  // [AJOUTER TOUS LES STYLES NÃ‰CESSAIRES]
});
```

### Couleurs utilisÃ©es
| Variable | Hex | Usage |
|----------|-----|-------|
| `Colors.primary` | #5B8DEE | [usage] |
| `Colors.secondary` | #FFB347 | [usage] |
| `Colors.success` | #7BC74D | [usage] |
| `Colors.background` | #FFF9F0 | [usage] |
| [autres...] | | |

### Gradients
| Nom | Couleurs | Direction |
|-----|----------|-----------|
| primaryGradient | ['#5B8DEE', '#4A7BD9'] | 135deg (diagonal) |
| [autres...] | | |

---

## ðŸŽ¬ ANIMATIONS (Reanimated 3)

### Animation 1 : [Nom]
```typescript
// Hook personnalisÃ© ou worklet
const animatedStyle = useAnimatedStyle(() => {
  return {
    opacity: withTiming(1, { duration: 300 }),
    transform: [
      { scale: withSpring(1, { damping: 15, stiffness: 150 }) },
      { translateY: withTiming(0, { duration: 300 }) },
    ],
  };
});
```

| PropriÃ©tÃ© | De | Vers | DurÃ©e | Easing | Delay |
|-----------|-----|------|-------|--------|-------|
| opacity | 0 | 1 | 300ms | timing | 0ms |
| scale | 0.5 | 1 | - | spring (d:15, s:150) | 0ms |
| translateY | 50 | 0 | 300ms | timing | 0ms |

### Animation 2 : [Nom]
[MÃªme format...]

### SÃ©quence d'animations (ordre d'apparition)
1. `[Element1]` - delay: 0ms
2. `[Element2]` - delay: 200ms
3. `[Element3]` - delay: 400ms

---

## ðŸ‘† INTERACTIONS & GESTURES

### Boutons
| Ã‰lÃ©ment | Geste | Feedback visuel | Feedback haptique |
|---------|-------|-----------------|-------------------|
| PrimaryButton | onPress | scale 0.95 â†’ 1 (spring) | impactLight |
| SecondaryButton | onPress | opacity 0.7 â†’ 1 | none |
| IconButton | onPress | scale 0.9 â†’ 1 | impactLight |

### Drag & Drop (si applicable)
```typescript
// Configuration PanGestureHandler
const panGesture = Gesture.Pan()
  .onStart(() => { /* ... */ })
  .onUpdate((event) => {
    translateX.value = event.translationX;
    translateY.value = event.translationY;
  })
  .onEnd(() => {
    // Snap to position ou retour
  });
```

### Long Press (si applicable)
- DurÃ©e minimum : 500ms
- Feedback : scale 1.05 + glow/highlight

---

## ðŸ‘¶ CONTRAINTES UX ENFANT

### Zones tactiles
- [ ] Tous les boutons â‰¥ 64x64 dp
- [ ] Espacement entre Ã©lÃ©ments tactiles â‰¥ 16dp
- [ ] Ã‰lÃ©ments draggables â‰¥ 80x80 dp

### AccessibilitÃ©
- [ ] Contraste texte â‰¥ 4.5:1
- [ ] Jamais couleur seule (toujours + icÃ´ne)
- [ ] Labels accessibilitÃ© sur tous les touchables
```typescript
accessibilityLabel="Jouer au niveau suivant"
accessibilityHint="Appuie pour commencer le niveau 4"
accessibilityRole="button"
```

### Feedback obligatoire
- [ ] Feedback visuel immÃ©diat sur CHAQUE tap
- [ ] Pas de feedback nÃ©gatif/punitif (pas de buzz, pas de rouge agressif)
- [ ] Animation de retour douce sur erreur (shake lÃ©ger)

### Navigation
- [ ] Bouton retour toujours visible (coin supÃ©rieur gauche)
- [ ] Profondeur max 3 niveaux
- [ ] Retour accueil en â‰¤ 2 taps

---

## ðŸ–¼ï¸ ASSETS & RESSOURCES

### Emojis/IcÃ´nes
| Usage | Emoji/IcÃ´ne | Fallback |
|-------|-------------|----------|
| [usage1] | ðŸŽ‰ | - |
| [usage2] | â­ | - |
| [navigation] | Lucide: ArrowLeft | - |

### Images (si nÃ©cessaires)
| Nom | Dimensions | Format | Notes |
|-----|------------|--------|-------|
| - | - | - | - |

### Sons (si applicables)
| Ã‰vÃ©nement | Fichier | DurÃ©e | Notes |
|-----------|---------|-------|-------|
| SuccÃ¨s | success.mp3 | <2s | Joyeux, mÃ©lodique |
| Erreur | soft-tap.mp3 | <1s | Neutre, doux |
| [autre] | | | |

---

## ðŸ“± RESPONSIVE & ADAPTATION

### iPad (principal)
- Orientation : Landscape preferred
- Safe areas : respecter useSafeAreaInsets()

### iPhone (secondaire)
| Ã‰lÃ©ment | iPad | iPhone |
|---------|------|--------|
| Padding Ã©cran | 24dp | 16dp |
| Colonnes grille | 3 | 2 |
| Taille boutons | 64dp | 56dp |

### Adaptation par Ã¢ge (si applicable)
| Ã‰lÃ©ment | 6-7 ans | 8-9 ans | 9-10 ans |
|---------|---------|---------|----------|
| Touch target | 80dp | 64dp | 64dp |
| Font size body | 20px | 18px | 18px |
| Audio requis | Oui | Non | Non |

---

## ðŸ§© COMPOSANTS RÃ‰UTILISABLES

Liste des composants du Design System Ã  utiliser :
- [ ] `<Button variant="primary" size="large" />`
- [ ] `<Card style="elevated" />`
- [ ] `<Text variant="h1" />`
- [ ] `<ProgressBar />`
- [ ] `<FeedbackMessage type="success" />`
- [ ] [autres...]

Composants Ã  crÃ©er pour cet Ã©cran :
- [ ] `<NomComposant1 />` - [description]
- [ ] `<NomComposant2 />` - [description]

---

## âœ… CHECKLIST AVANT IMPLÃ‰MENTATION

### Structure
- [ ] Arborescence des composants claire
- [ ] Props dÃ©finies pour chaque composant
- [ ] Types TypeScript prÃ©vus

### Styles
- [ ] Tous les styles traduits en StyleSheet
- [ ] Gradients identifiÃ©s (expo-linear-gradient)
- [ ] Shadows iOS + elevation Android

### Animations
- [ ] Toutes les animations listÃ©es avec valeurs
- [ ] SÃ©quence/timing dÃ©fini
- [ ] Spring configs ou timing configs prÃ©cisÃ©s

### UX Enfant
- [ ] Touch targets â‰¥ 64dp vÃ©rifiÃ©s
- [ ] Feedbacks sur interactions dÃ©finis
- [ ] AccessibilitÃ© prÃ©vue

---

## ðŸ’¬ NOTES POUR CLAUDE CODE

[Ajouter ici toute information contextuelle importante, piÃ¨ges Ã  Ã©viter, ou prÃ©cisions sur l'intention design]

Exemple :
- "L'animation des confettis doit utiliser plusieurs Animated.View avec des delays staggerÃ©s, pas une seule animation"
- "Le flip de carte utilise rotateY, penser Ã  perspective: 1000"
- "La mascotte doit rester visible mÃªme pendant le scroll"

---

## ðŸ“„ CODE DE DÃ‰MARRAGE (optionnel)

```typescript
// [NomComposant].tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  // DÃ©finir les props
}

export const NomComposant: React.FC<Props> = ({ }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={styles.container}>
      {/* Structure de base */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```
```

---

## EXEMPLE D'APPLICATION

### Demande utilisateur :
> "CrÃ©e-moi un Ã©cran de victoire avec confettis, Ã©toiles animÃ©es, et une carte Ã  collectionner qui se retourne"

### RÃ©ponse Claude Web :
1. **Fichier HTML** : `victory-screen-v2.html` (design complet)
2. **Brief React Native** : (bloc markdown avec toutes les specs ci-dessus remplies)

---

## RÃˆGLES DE REMPLISSAGE DU BRIEF

1. **ÃŠtre exhaustif** : Chaque Ã©lÃ©ment visuel du HTML doit apparaÃ®tre dans la structure
2. **Traduire les CSS** : Convertir TOUTES les propriÃ©tÃ©s CSS en Ã©quivalent React Native
3. **DÃ©tailler les animations** : Valeurs exactes, pas de "animation sympa"
4. **Penser enfant** : VÃ©rifier systÃ©matiquement les contraintes UX enfant
5. **Rester cohÃ©rent** : Utiliser les tokens du Design System existant

---

## CORRESPONDANCES CSS â†’ REACT NATIVE

| CSS | React Native | Notes |
|-----|--------------|-------|
| `background: linear-gradient(...)` | `<LinearGradient>` | expo-linear-gradient |
| `box-shadow` | `shadowColor/Offset/Opacity/Radius` + `elevation` | iOS + Android sÃ©parÃ©s |
| `position: fixed` | `position: 'absolute'` | Pas de fixed en RN |
| `overflow: hidden` | `overflow: 'hidden'` | OK |
| `border-radius: 50%` | `borderRadius: width/2` | Calculer la valeur |
| `gap` | `gap` (RN 0.71+) ou `margin` | VÃ©rifier version |
| `@keyframes` | Reanimated worklets | Conversion manuelle |
| `transition` | `withTiming/withSpring` | Reanimated |
| `transform: rotate()` | `transform: [{ rotate: 'Xdeg' }]` | String avec unitÃ© |
| `vh/vw` | `Dimensions.get('window')` | Import Dimensions |
| `rem/em` | Valeur fixe en nombre | Pas d'unitÃ©s relatives |
| `:hover` | N/A ou `Pressable` states | Pas de hover tactile |
| `cursor: pointer` | N/A | Implicite sur Pressable |

---

*Instruction v1.0 â€” App Ã‰ducative iPad*
