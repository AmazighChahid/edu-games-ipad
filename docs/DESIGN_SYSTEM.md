# Design System — App Éducative iPad

> **Stack**: React Native + Expo SDK 52+ • TypeScript • Reanimated 3  
> **Cible**: iPad (principal) + iPhone (secondaire) • Enfants 6-10 ans  
> **Version**: 2.0 — Incluant Home V10 (Forêt Magique Immersive)
> **Dernière mise à jour** : Décembre 2024

---

## 📦 Installation des dépendances design

```bash
# Fonts
npx expo install expo-font @expo-google-fonts/nunito @expo-google-fonts/fredoka

# Animations
npx expo install react-native-reanimated

# Gradients (requis pour V10)
npx expo install expo-linear-gradient

# Navigation
npx expo install expo-router

# Icônes (optionnel)
npx expo install @expo/vector-icons
```

---

## 🎨 Couleurs

### Tokens principaux

```typescript
// src/theme/colors.ts (⚠️ CHEMIN OBLIGATOIRE - /src/constants/ est DEPRECATED)

export const Colors = {
  // Couleurs principales
  primary: '#5B8DEE',        // Bleu confiance - boutons, navigation
  primaryDark: '#4A7BD9',    // Bleu foncé - états pressed
  primaryLight: '#8BB0F4',   // Bleu clair - backgrounds légers
  
  secondary: '#FFB347',      // Orange chaleureux - accents, CTA secondaires
  secondaryDark: '#FFA020',  // Orange foncé - états pressed
  secondaryLight: '#FFD699', // Orange clair - highlights
  
  success: '#7BC74D',        // Vert validation - réussite, progression
  successDark: '#5FB030',    // Vert foncé - états pressed
  successLight: '#A8E080',   // Vert clair - backgrounds succès
  
  accent: '#E056FD',         // Violet ludique - éléments fun, magie
  accentDark: '#C840E0',     // Violet foncé - états pressed
  accentLight: '#F0A0FF',    // Violet clair - highlights
  
  attention: '#F39C12',      // Jaune/Orange - indices, aide, alertes douces
  attentionDark: '#E08900',  // États pressed
  attentionLight: '#FFD966', // Backgrounds attention
  
  // Neutres
  background: '#FFF9F0',     // Crème apaisant - fond principal
  backgroundWarm: '#FFF5E6', // Crème chaud - sections
  backgroundCool: '#F5F8FF', // Bleu très clair - variante
  
  surface: '#FFFFFF',        // Blanc - cartes, modales
  surfaceElevated: '#FFFFFF',// Blanc avec shadow
  
  // Textes
  textPrimary: '#2D3748',    // Gris foncé - texte principal
  textSecondary: '#4A5568',  // Gris moyen - texte secondaire
  textMuted: '#718096',      // Gris clair - texte désactivé
  textOnPrimary: '#FFFFFF',  // Blanc - texte sur couleur primaire
  textOnDark: '#FFFFFF',     // Blanc - texte sur fond sombre
  
  // États
  disabled: '#CBD5E0',       // Gris - éléments désactivés
  error: '#E53E3E',          // Rouge doux - erreurs (usage rare)
  
  // Overlays
  overlay: 'rgba(0, 0, 0, 0.4)',      // Fond modal
  overlayLight: 'rgba(0, 0, 0, 0.1)', // Ombres légères
} as const;

// Gradients (pour StyleSheet ou LinearGradient)
export const Gradients = {
  primary: ['#5B8DEE', '#4A7BD9'],
  secondary: ['#FFB347', '#FFA020'],
  success: ['#7BC74D', '#5FB030'],
  accent: ['#E056FD', '#C840E0'],
  attention: ['#F39C12', '#E08900'],
  progress: ['#5B8DEE', '#E056FD'],  // Barre de progression
  background: ['#FFF9F0', '#FFF5E6', '#FFF0DD'],
} as const;
```

### 🌲 Couleurs Home V10 — Forêt Magique

```typescript
// src/theme/colorsV10.ts

export const ForestColors = {
  // === CIEL ===
  sky: {
    top: '#87CEEB',           // Bleu ciel clair
    middle: '#B0E0E6',        // Bleu poudre
    horizon: '#98D9A8',       // Transition vert pâle
    bottom: '#7BC74D',        // Vert herbe (success)
  },
  
  // === SOLEIL ===
  sun: {
    core: '#FFD93D',          // Jaune vif
    glow: '#F5C800',          // Halo doré
    rays: 'rgba(255, 217, 61, 0.3)', // Rayons transparents
  },
  
  // === NUAGES ===
  clouds: {
    primary: '#FFFFFF',       // Blanc pur
    opacity: 0.9,             // Semi-transparent
  },
  
  // === MONTAGNES ===
  mountains: {
    far: {
      light: '#6B8E7B',       // Vert grisé clair (distance atmosphérique)
      dark: '#5A7D6A',        // Vert grisé foncé
    },
    near: {
      light: '#4A6D5A',       // Vert saturé clair
      dark: '#3D5C4A',        // Vert saturé foncé
    },
    snow: 'rgba(255, 255, 255, 0.7)', // Neige sommet
  },
  
  // === COLLINES ===
  hills: {
    back: {
      light: '#5BAE6B',       // Vert moyen clair
      dark: '#4A9D5A',        // Vert moyen foncé
    },
    front: {
      light: '#6BC77B',       // Vert clair vibrant
      dark: '#5BAE6B',        // Vert moyen
    },
  },
  
  // === ARBRES ===
  trees: {
    trunk: {
      light: '#8B5A2B',       // Marron clair
      dark: '#6B4423',        // Marron foncé
    },
    foliage: {
      light: '#3D8B4F',       // Vert feuillage clair
      dark: '#2D6B3F',        // Vert feuillage foncé
    },
  },
  
  // === BUISSONS ===
  bushes: {
    light: '#4A9D5A',         // Vert buisson clair
    dark: '#3D8B4F',          // Vert buisson foncé
  },
  
  // === SOL / HERBE ===
  ground: '#7BC74D',          // Vert success (cohérence palette)
  
  // === FLEURS (emojis) ===
  // 🌸🌻🌷🌺🌼💐🪻
  
} as const;

// === MASCOTTE PIOU ===
export const PiouColors = {
  body: {
    main: '#C9A86C',          // Beige/caramel principal
    dark: '#A68B5B',          // Ombre corps
  },
  belly: '#F5E6D3',           // Ventre crème clair
  beak: '#FFB347',            // Bec orange (secondary)
  eyes: {
    white: '#FFFFFF',
    pupil: '#2C1810',         // Marron très foncé
  },
} as const;

// === MÉDAILLES (Système de progression) ===
export const MedalColors = {
  bronze: {
    light: '#CD7F32',         // Bronze clair
    dark: '#8B5A2B',          // Bronze foncé
  },
  silver: {
    light: '#C0C0C0',         // Argent clair
    dark: '#909090',          // Argent foncé
  },
  gold: {
    light: '#FFD700',         // Or clair
    dark: '#FFA500',          // Or foncé
  },
  diamond: {
    light: '#B9F2FF',         // Diamant clair (cyan pâle)
    dark: '#00CED1',          // Diamant foncé (turquoise)
    text: '#006666',          // Texte sur diamant
  },
  locked: {
    background: 'rgba(255, 255, 255, 0.2)',
    text: 'rgba(255, 255, 255, 0.8)',
  },
} as const;

// === GRADIENTS V10 ===
export const ForestGradients = {
  // Ciel complet (7 couleurs)
  sky: [
    '#87CEEB',  // 0% - Bleu ciel
    '#9DD5ED',  // 15%
    '#B0E0E6',  // 30% - Bleu poudre
    '#C4E8D4',  // 50%
    '#98D9A8',  // 70% - Vert pâle
    '#89CF8A',  // 85%
    '#7BC74D',  // 100% - Vert herbe
  ],
  
  // Montagnes
  mountainFar: ['#6B8E7B', '#5A7D6A'],
  mountainNear: ['#4A6D5A', '#3D5C4A'],
  
  // Collines
  hillBack: ['#5BAE6B', '#4A9D5A'],
  hillFront: ['#6BC77B', '#5BAE6B'],
  
  // Arbres
  treeTrunk: ['#8B5A2B', '#6B4423'],
  treeFoliage: ['#3D8B4F', '#2D6B3F'],
  
  // Piou
  piouBody: ['#C9A86C', '#A68B5B'],
  
  // Médailles
  medalBronze: ['#CD7F32', '#8B5A2B'],
  medalSilver: ['#C0C0C0', '#909090'],
  medalGold: ['#FFD700', '#FFA500'],
  medalDiamond: ['#B9F2FF', '#00CED1'],
  
  // Cartes de jeu par catégorie
  gameCardBlue: ['#5B8DEE', '#3B6FCE'],
  gameCardPurple: ['#9B59B6', '#8E44AD'],
  gameCardGreen: ['#27AE60', '#1E8449'],
  gameCardOrange: ['#F39C12', '#D68910'],
  gameCardTeal: ['#00B894', '#00876A'],
  gameCardPink: ['#FD79A8', '#E84393'],
  gameCardIndigo: ['#6C5CE7', '#5541D7'],
  gameCardRed: ['#E74C3C', '#C0392B'],
} as const;
```

### Accessibilité couleurs

```typescript
// Contraste WCAG AA minimum
// Texte sur fond clair: ratio 4.5:1 minimum
// Éléments graphiques: ratio 3:1 minimum

// ⚠️ RÈGLE DALTONISME: Ne jamais utiliser couleur seule pour l'information
// Toujours combiner: couleur + icône + texte

export const AccessiblePairs = {
  // [background, foreground] - ratios vérifiés
  primaryOnWhite: ['#FFFFFF', '#5B8DEE'],     // ✓ 3.5:1 (AA large)
  textOnBackground: ['#FFF9F0', '#2D3748'],   // ✓ 10:1 (AAA)
  whiteOnPrimary: ['#5B8DEE', '#FFFFFF'],     // ✓ 3.5:1 (AA large)
  whiteOnSuccess: ['#7BC74D', '#FFFFFF'],     // ✓ 3:1 (AA graphics)
  
  // V10 - Texte sur cartes de jeu
  whiteOnGameCard: ['#5B8DEE', '#FFFFFF'],    // ✓ 3.5:1
  textOnDiamond: ['#B9F2FF', '#006666'],      // ✓ 4.5:1 (AA)
};
```

---

## 🔤 Typographie

### Configuration des fonts

```typescript
// src/theme/typography.ts (⚠️ CHEMIN OBLIGATOIRE)

export const FontFamily = {
  // Titres et boutons - ludique mais lisible
  heading: 'Fredoka',
  headingBold: 'Fredoka',
  
  // Texte courant - très lisible, dyslexie-friendly
  body: 'Nunito',
  bodyBold: 'Nunito-Bold',
  bodySemiBold: 'Nunito-SemiBold',
  
  // Alternative accessibilité dyslexie
  accessible: 'Nunito', // ou OpenDyslexic si installé
} as const;

export const FontSize = {
  // Titres
  h1: 32,        // Titres principaux écrans
  h2: 28,        // Sous-titres
  h3: 24,        // Titres de section
  h4: 20,        // Titres de carte
  
  // Corps de texte
  bodyLarge: 20, // Instructions importantes
  body: 18,      // Texte courant (MINIMUM pour enfants)
  bodySmall: 16, // Labels, légendes (usage limité)
  
  // Boutons
  buttonLarge: 22,
  button: 18,
  buttonSmall: 16,
  
  // Spéciaux
  caption: 14,   // Très petit texte (adultes uniquement)
  label: 12,     // Tags, badges
  
  // V10 - Home spécifique
  gameCardTitle: 17,    // Titre carte de jeu
  widgetTitle: 16,      // Titre widget
  medalLabel: 13,       // Label médaille
  categoryTitle: 20,    // Titre catégorie
  greetingName: 24,     // Prénom dans "Bonjour [Nom]"
} as const;

export const FontWeight = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
} as const;

export const LineHeight = {
  tight: 1.2,    // Titres
  normal: 1.4,   // Texte courant
  relaxed: 1.6,  // Texte long, accessibilité
} as const;

export const LetterSpacing = {
  tight: -0.5,   // Titres display
  normal: 0,     // Texte courant
  wide: 0.5,     // Accessibilité dyslexie
  extraWide: 1,  // Labels uppercase
} as const;

// Styles prédéfinis
export const TextStyles = {
  h1: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h1,
    fontWeight: FontWeight.bold,
    lineHeight: FontSize.h1 * LineHeight.tight,
    letterSpacing: LetterSpacing.tight,
  },
  h2: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h2,
    fontWeight: FontWeight.semiBold,
    lineHeight: FontSize.h2 * LineHeight.tight,
  },
  h3: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h3,
    fontWeight: FontWeight.semiBold,
    lineHeight: FontSize.h3 * LineHeight.normal,
  },
  body: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.body * LineHeight.relaxed,
    letterSpacing: LetterSpacing.wide,
  },
  bodyBold: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
    lineHeight: FontSize.body * LineHeight.relaxed,
  },
  button: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.button,
    fontWeight: FontWeight.semiBold,
    letterSpacing: LetterSpacing.normal,
  },
  
  // V10 - Styles spécifiques Home
  gameCardTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.gameCardTitle,
    fontWeight: FontWeight.bold,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  categoryTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.categoryTitle,
    fontWeight: FontWeight.bold,
    color: '#2D3436',
  },
  greeting: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.greetingName,
    fontWeight: FontWeight.bold,
    color: '#2D3436',
  },
  greetingHighlight: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.greetingName,
    fontWeight: FontWeight.bold,
    color: '#5B8DEE', // Primary pour le prénom
  },
} as const;
```

### Chargement des fonts (App.tsx)

```typescript
import { useFonts } from 'expo-font';
import { 
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import {
  Fredoka_400Regular,
  Fredoka_500Medium,
  Fredoka_600SemiBold,
  Fredoka_700Bold,
} from '@expo-google-fonts/fredoka';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Nunito': Nunito_400Regular,
    'Nunito-SemiBold': Nunito_600SemiBold,
    'Nunito-Bold': Nunito_700Bold,
    'Nunito-ExtraBold': Nunito_800ExtraBold,
    'Fredoka': Fredoka_400Regular,
    'Fredoka-Medium': Fredoka_500Medium,
    'Fredoka-SemiBold': Fredoka_600SemiBold,
    'Fredoka-Bold': Fredoka_700Bold,
  });

  if (!fontsLoaded) {
    return null; // ou SplashScreen
  }
  
  return <AppNavigator />;
}
```

---

## 📐 Espacements

```typescript
// src/theme/spacing.ts (⚠️ CHEMIN OBLIGATOIRE)

export const Spacing = {
  // Base scale (multiples de 4)
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  
  // Sémantique
  screenPadding: 24,        // Marge écran iPad
  screenPaddingPhone: 16,   // Marge écran iPhone
  cardPadding: 20,          // Padding intérieur cartes
  sectionGap: 32,           // Entre sections
  itemGap: 16,              // Entre éléments liste
  inlineGap: 8,             // Entre éléments inline
  
  // V10 - Home spécifique
  homeHeaderPadding: 16,    // Padding header V10
  homeSidePadding: 80,      // Marge latérale contenu
  homeTopPadding: 260,      // Espace haut pour header
  gameCardGap: 60,          // Espacement entre cartes de jeu
  widgetGap: 14,            // Espacement entre widgets
  categoryGap: 24,          // Espacement entre catégories
} as const;

// ⚠️ TAILLES TACTILES ENFANT (CRITIQUE)
export const TouchTarget = {
  minimum: 48,        // Minimum absolu (adulte)
  child: 64,          // Minimum enfant (OBLIGATOIRE)
  recommended: 80,    // Recommandé drag & drop
  large: 96,          // Éléments principaux
} as const;

// V10 - Dimensions des composants Home
export const HomeV10Dimensions = {
  // Écran iPad cible
  screen: {
    width: 1194,
    height: 834,
  },
  
  // Cartes de jeu
  gameCard: {
    width: 320,
    height: 180,
    borderRadius: 20,
    iconSize: 120,        // Emoji de fond
    iconOpacity: 0.2,
  },
  
  // Widgets
  widget: {
    height: 140,
    borderRadius: 20,
    aspectRatio: 2,       // Ratio 2:1
  },
  
  // Éléments flottants
  piouMascot: {
    width: 80,
    height: 85,
    positionLeft: 40,
    positionBottom: 100,
  },
  collectionBook: {
    width: 140,
    height: 100,
    positionRight: 40,
    positionBottom: 100,
  },
  miniCard: {
    width: 70,
    height: 95,
  },
  
  // Header
  avatar: {
    size: 64,
    levelBadgeSize: 24,
  },
  headerStat: {
    height: 36,
    borderRadius: 10,
  },
} as const;
```

---

## 🌲 Home V10 — Architecture Z-Index

```typescript
// src/theme/zIndex.ts

/**
 * Structure en couches de la Home V10 - Forêt Magique
 * 
 * Le design utilise 12 couches distinctes pour créer la profondeur.
 * Le background couvre 100% de l'écran (position: absolute, inset: 0).
 * Le contenu scrolle au-dessus du décor fixe.
 */

export const ZIndex = {
  // === COUCHE DÉCOR (fixe, non-scrollable) ===
  
  sky: 0,              // Fond gradient ciel
  mountainsFar: 2,     // Montagnes lointaines (effet atmosphérique)
  mountainsNear: 3,    // Montagnes proches
  clouds: 4,           // Nuages animés
  sun: 5,              // Soleil avec halo
  hills: 6,            // Collines (2 couches)
  trees: 7,            // Arbres (3 profondeurs)
  bushes: 8,           // Buissons
  garden: 9,           // Fleurs + papillons
  animals: 11,         // Animaux animés (oiseaux, écureuil, etc.)
  
  // === COUCHE CONTENU (scrollable) ===
  
  contentLayer: 30,    // ScrollView avec header, widgets, cartes
  
  // === COUCHE FLOTTANTE (fixe, au-dessus de tout) ===
  
  floatingElements: 50, // Piou mascotte + Livre collection
  
  // === MODALES & OVERLAYS ===
  
  modal: 100,          // Modales
  toast: 110,          // Notifications toast
  
} as const;

// Configuration des couches du décor
export const ForestLayers = {
  // Montagnes
  mountains: {
    far: {
      count: 4,
      zIndex: ZIndex.mountainsFar,
      positions: [
        { left: -50, width: 360, height: 160 },
        { left: 200, width: 440, height: 200 },
        { right: 100, width: 400, height: 180 },
        { right: -100, width: 500, height: 220 },
      ],
    },
    near: {
      count: 3,
      zIndex: ZIndex.mountainsNear,
    },
  },
  
  // Nuages
  clouds: {
    count: 4,
    zIndex: ZIndex.clouds,
    animationDurations: [35, 40, 45, 50], // secondes
  },
  
  // Collines
  hills: {
    back: { count: 3, zIndex: ZIndex.hills },
    front: { count: 3, zIndex: ZIndex.hills },
  },
  
  // Arbres
  trees: {
    far: { count: 4, scale: 0.7 },
    mid: { count: 6, scale: 0.85 },
    near: { count: 6, scale: 1.0 },
    zIndex: ZIndex.trees,
  },
  
  // Jardin (fleurs)
  garden: {
    flowers: ['🌸', '🌻', '🌷', '🌺', '🌼', '💐', '🪻'],
    butterflies: 3,
    zIndex: ZIndex.garden,
  },
  
  // Animaux
  animals: {
    birds: 3,
    squirrel: 1,
    rabbit: 1,
    ladybug: 1,
    bee: 1,
    dragonfly: 1,
    zIndex: ZIndex.animals,
  },
} as const;
```

---

## 📘 Composants

### Boutons

```typescript
// src/theme/components.ts

export const ButtonSize = {
  small: {
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    iconSize: 20,
    borderRadius: 12,
  },
  medium: {
    height: 64,           // MINIMUM ENFANT
    paddingHorizontal: 24,
    fontSize: 18,
    iconSize: 24,
    borderRadius: 16,
  },
  large: {
    height: 80,
    paddingHorizontal: 32,
    fontSize: 22,
    iconSize: 28,
    borderRadius: 20,
  },
} as const;

export const ButtonVariant = {
  primary: {
    background: Colors.primary,
    backgroundPressed: Colors.primaryDark,
    text: Colors.textOnPrimary,
    shadow: '0 4px 12px rgba(91, 141, 238, 0.3)',
  },
  secondary: {
    background: Colors.secondary,
    backgroundPressed: Colors.secondaryDark,
    text: Colors.textPrimary,
    shadow: '0 4px 12px rgba(255, 179, 71, 0.3)',
  },
  success: {
    background: Colors.success,
    backgroundPressed: Colors.successDark,
    text: Colors.textOnPrimary,
    shadow: '0 4px 12px rgba(123, 199, 77, 0.3)',
  },
  accent: {
    background: Colors.accent,
    backgroundPressed: Colors.accentDark,
    text: Colors.textOnPrimary,
    shadow: '0 4px 12px rgba(224, 86, 253, 0.3)',
  },
  outline: {
    background: 'transparent',
    backgroundPressed: Colors.primaryLight,
    text: Colors.primary,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  ghost: {
    background: 'transparent',
    backgroundPressed: Colors.overlayLight,
    text: Colors.textPrimary,
  },
} as const;
```

### Cartes

```typescript
export const CardStyle = {
  default: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#5B8DEE',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 8,
  },
  elevated: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 40,
    elevation: 12,
  },
  flat: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 20,
  },
  game: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
} as const;
```

### 🎮 Cartes de Jeu V10

```typescript
// src/theme/gameCardV10.ts

export const GameCardV10Style = {
  // Dimensions
  width: 320,
  height: 180,
  borderRadius: 20,
  padding: 16,
  
  // Background
  gradientDirection: { x: 0, y: 0, x1: 1, y1: 1 }, // 135°
  
  // Icône de fond (emoji)
  backgroundIcon: {
    size: 120,
    opacity: 0.2,
    position: 'right',
    offset: 0,
  },
  
  // Shadow
  shadow: {
    color: '#000',
    offset: { width: 0, height: 8 },
    opacity: 0.2,
    radius: 24,
  },
  shadowHover: {
    color: '#000',
    offset: { width: 0, height: 15 },
    opacity: 0.2,
    radius: 35,
  },
  
  // Badge (Nouveau, Hot, Bientôt)
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    fontSize: 10,
    fontWeight: '800',
    position: { top: 12, left: 12 },
  },
  
  // Médaille
  medal: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    fontSize: 13,
    fontWeight: '600',
    iconSize: 16,
  },
} as const;

// Variantes de couleur par catégorie
export const GameCardVariants = {
  blue: {
    gradient: ['#5B8DEE', '#3B6FCE'],
    category: 'Logique',
  },
  purple: {
    gradient: ['#9B59B6', '#8E44AD'],
    category: 'Formes',
  },
  green: {
    gradient: ['#27AE60', '#1E8449'],
    category: 'Chiffres',
  },
  orange: {
    gradient: ['#F39C12', '#D68910'],
    category: 'Mémoire',
  },
  teal: {
    gradient: ['#00B894', '#00876A'],
    category: 'Logique',
  },
  pink: {
    gradient: ['#FD79A8', '#E84393'],
    category: 'Formes',
  },
  indigo: {
    gradient: ['#6C5CE7', '#5541D7'],
    category: 'Logique',
  },
  red: {
    gradient: ['#E74C3C', '#C0392B'],
    category: 'Mots',
  },
} as const;

// États des badges
export const GameCardBadges = {
  new: {
    background: '#FFFFFF',
    text: '#27AE60',
    label: 'Nouveau',
  },
  hot: {
    background: '#FFFFFF',
    text: '#E74C3C',
    label: '🔥 Hot',
  },
  soon: {
    background: '#FFFFFF',
    text: '#F39C12',
    label: 'Bientôt',
  },
} as const;
```

### 🏅 Système de Médailles V10

```typescript
// src/theme/medals.ts

export const MedalStyle = {
  bronze: {
    gradient: ['#CD7F32', '#8B5A2B'],
    icon: '🥉',
    label: 'Bronze',
    textColor: '#FFFFFF',
  },
  silver: {
    gradient: ['#C0C0C0', '#909090'],
    icon: '🥈',
    label: 'Argent',
    textColor: '#FFFFFF',
  },
  gold: {
    gradient: ['#FFD700', '#FFA500'],
    icon: '🥇',
    label: 'Or',
    textColor: '#FFFFFF',
  },
  diamond: {
    gradient: ['#B9F2FF', '#00CED1'],
    icon: '💎',
    label: 'Diamant',
    textColor: '#006666',
  },
  locked: {
    gradient: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)'],
    icon: '🔒',
    label: 'Verrouillé',
    textColor: 'rgba(255, 255, 255, 0.8)',
  },
} as const;

// Seuils de progression pour les médailles
export const MedalThresholds = {
  bronze: 1,    // Niveau 1 complété
  silver: 3,    // Niveau 3 complété
  gold: 5,      // Niveau 5 complété
  diamond: 10,  // Tous niveaux + défis bonus
} as const;
```

### 📊 Widgets V10

```typescript
// src/theme/widgets.ts

export const WidgetV10Style = {
  // Dimensions
  height: 140,
  borderRadius: 20,
  padding: 18,
  
  // Background icon
  backgroundIcon: {
    size: 130,
    opacity: 0.15,
    position: 'right',
    offset: -10,
  },
  
  // Variantes
  variants: {
    piou: {
      gradient: ['rgba(91,141,238,0.95)', 'rgba(59,111,206,0.95)'],
      icon: '🦉',
    },
    garden: {
      gradient: ['rgba(39,174,96,0.95)', 'rgba(30,132,73,0.95)'],
      icon: '🌻',
    },
    streak: {
      gradient: ['rgba(243,156,18,0.95)', 'rgba(214,137,16,0.95)'],
      icon: '🔥',
    },
    collection: {
      gradient: ['rgba(155,89,182,0.95)', 'rgba(142,68,173,0.95)'],
      icon: '🃏',
    },
  },
} as const;

// Widget Streak - jours de la semaine
export const StreakDays = {
  size: 36,
  borderRadius: 18,
  fontSize: 13,
  states: {
    completed: {
      background: '#FFFFFF',
      textColor: '#F39C12',
    },
    today: {
      background: '#FFFFFF',
      textColor: '#F39C12',
      ring: 'rgba(255,255,255,0.4)',
      ringWidth: 3,
    },
    future: {
      background: 'rgba(255,255,255,0.25)',
      textColor: 'rgba(255,255,255,0.8)',
    },
  },
} as const;
```

---

## 🎬 Animations

### Configurations de base

```typescript
// src/theme/animations.ts
import { Easing } from 'react-native-reanimated';

export const Duration = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  celebration: 800,
  
  // V10 - Durées longues pour décor
  cloudSlow: 35000,     // 35s
  cloudMedium: 40000,   // 40s
  cloudFast: 50000,     // 50s
  animalCycle: 20000,   // 20s
} as const;

export const AnimationEasing = {
  // Apparitions
  easeOut: Easing.out(Easing.cubic),
  easeOutBack: Easing.out(Easing.back(1.5)),
  
  // Mouvements
  easeInOut: Easing.inOut(Easing.cubic),
  
  // Rebonds
  bounce: Easing.bounce,
  elastic: Easing.elastic(1),
  
  // Spring configs pour useAnimatedStyle
  springGentle: {
    damping: 15,
    stiffness: 150,
  },
  springBouncy: {
    damping: 10,
    stiffness: 200,
  },
  
  // V10 - Spring pour cartes
  springCard: {
    damping: 12,
    stiffness: 180,
  },
} as const;

// Animations prédéfinies
export const Animations = {
  // Tap feedback
  buttonPress: {
    scale: 0.95,
    duration: Duration.instant,
  },
  buttonRelease: {
    scale: 1,
    duration: Duration.fast,
    easing: AnimationEasing.easeOutBack,
  },
  
  // Succès
  successPop: {
    scale: [1, 1.2, 1],
    duration: Duration.normal,
  },
  
  // Erreur (shake doux)
  errorShake: {
    translateX: [0, -10, 10, -10, 10, 0],
    duration: Duration.normal,
  },
  
  // Hint pulsation
  hintPulse: {
    scale: [1, 1.08, 1],
    duration: 2000,
    loop: true,
  },
  
  // Apparition élément
  fadeInUp: {
    opacity: [0, 1],
    translateY: [20, 0],
    duration: Duration.normal,
    easing: AnimationEasing.easeOut,
  },
  
  // V10 - Carte de jeu hover
  gameCardHover: {
    translateY: -5,
    scale: 1.02,
    spring: AnimationEasing.springCard,
  },
} as const;
```

---

## 👆 Gestes

```typescript
// src/theme/gestures.ts

export const Gestures = {
  // ✅ RECOMMANDÉS
  recommended: {
    tap: true,           // Tap simple un doigt
    dragDrop: true,      // Glisser-déposer
    swipeHorizontal: true,
    swipeVertical: true,
    longPress: true,     // Avec feedback visuel obligatoire
    pinchZoom: true,     // Optionnel, pour zoom images
  },
  
  // ❌ À ÉVITER
  avoid: {
    doubleTap: false,    // Trop complexe pour enfants
    multiTouch: false,   // 2+ doigts simultanés
    rotation: false,     // Rotation 2 doigts
    precisionSwipe: false, // Swipe avec timing précis
  },
} as const;

// Config pour PanGestureHandler
export const DragConfig = {
  minDistance: 10,       // Distance min pour déclencher
  activeOffsetX: [-10, 10],
  activeOffsetY: [-10, 10],
  failOffsetX: [-100, 100],
  failOffsetY: [-100, 100],
} as const;

// V10 - Gestes sur cartes de jeu
export const GameCardGestures = {
  tap: {
    feedback: 'scale',
    scaleValue: 0.97,
    duration: 100,
  },
  longPress: {
    minDuration: 500,
    feedback: 'glow',
  },
} as const;
```

---

## 📱 Layouts & Responsive

```typescript
// src/theme/layout.ts
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Screen = {
  width,
  height,
  isTablet: width >= 768,
  isLandscape: width > height,
} as const;

export const Layout = {
  // Profondeur navigation max
  maxDepth: 3,
  
  // Retour accueil en max X taps
  maxTapsToHome: 2,
  
  // Nombre max d'options par écran
  maxOptionsPerScreen: 5,
  
  // Grille activités
  activityGrid: {
    tablet: 3,      // colonnes iPad
    phone: 2,       // colonnes iPhone
    gap: 24,
  },
} as const;

// Safe areas
export const SafeArea = {
  top: 48,         // Estimation, utiliser useSafeAreaInsets()
  bottom: 34,      // Home indicator iPad/iPhone
  horizontal: 24,
} as const;
```

---

## ⚠️ RÈGLES CRITIQUES — RÉSUMÉ

### Import obligatoire

```typescript
// ✅ TOUJOURS
import { theme } from '@/theme';
// ou
import { colors, spacing, typography } from '@/theme';

// ❌ JAMAIS (DEPRECATED)
import { Colors } from '@/constants/colors';
import { SPACING } from '@/constants';
```

### Touch Targets Enfant

```typescript
// ✅ OBLIGATOIRE - Minimum 64dp
const styles = StyleSheet.create({
  button: {
    minWidth: 64,
    minHeight: 64,
    // ou
    width: theme.touchTargets.child,
    height: theme.touchTargets.child,
  },
});
```

### Tailles de texte

```typescript
// ✅ OBLIGATOIRE - Minimum 18pt pour texte courant
const styles = StyleSheet.create({
  text: {
    fontSize: 18, // Minimum
    // ou
    fontSize: theme.fontSize.lg,
  },
});
```

### Polices explicites

```typescript
// ✅ TOUJOURS spécifier la police
const styles = StyleSheet.create({
  title: {
    fontFamily: 'Fredoka',
    // ou
    fontFamily: theme.fontFamily.display,
  },
  body: {
    fontFamily: 'Nunito',
    // ou
    fontFamily: theme.fontFamily.regular,
  },
});
```

---

*Design System v2.0 — App Éducative iPad "Hello Guys"*
*Dernière mise à jour : Décembre 2024*
*Encodage : UTF-8*
