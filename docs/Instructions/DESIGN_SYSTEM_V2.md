# Design System â€” App Ã‰ducative iPad

> **Stack**: React Native + Expo SDK 52+ â€¢ TypeScript â€¢ Reanimated 3  
> **Cible**: iPad (principal) + iPhone (secondaire) â€¢ Enfants 6-10 ans  
> **Version**: 2.0 â€” Incluant Home V10 (ForÃªt Magique Immersive)

---

## ðŸ“¦ Installation des dÃ©pendances design

```bash
# Fonts
npx expo install expo-font @expo-google-fonts/nunito @expo-google-fonts/fredoka

# Animations
npx expo install react-native-reanimated

# Gradients (requis pour V10)
npx expo install expo-linear-gradient

# Navigation
npx expo install expo-router

# IcÃ´nes (optionnel)
npx expo install @expo/vector-icons
```

---

## ðŸŽ¨ Couleurs

### Tokens principaux

```typescript
// src/constants/colors.ts

export const Colors = {
  // Couleurs principales
  primary: '#5B8DEE',        // Bleu confiance - boutons, navigation
  primaryDark: '#4A7BD9',    // Bleu foncÃ© - Ã©tats pressed
  primaryLight: '#8BB0F4',   // Bleu clair - backgrounds lÃ©gers
  
  secondary: '#FFB347',      // Orange chaleureux - accents, CTA secondaires
  secondaryDark: '#FFA020',  // Orange foncÃ© - Ã©tats pressed
  secondaryLight: '#FFD699', // Orange clair - highlights
  
  success: '#7BC74D',        // Vert validation - rÃ©ussite, progression
  successDark: '#5FB030',    // Vert foncÃ© - Ã©tats pressed
  successLight: '#A8E080',   // Vert clair - backgrounds succÃ¨s
  
  accent: '#E056FD',         // Violet ludique - Ã©lÃ©ments fun, magie
  accentDark: '#C840E0',     // Violet foncÃ© - Ã©tats pressed
  accentLight: '#F0A0FF',    // Violet clair - highlights
  
  attention: '#F39C12',      // Jaune/Orange - indices, aide, alertes douces
  attentionDark: '#E08900',  // Ã‰tats pressed
  attentionLight: '#FFD966', // Backgrounds attention
  
  // Neutres
  background: '#FFF9F0',     // CrÃ¨me apaisant - fond principal
  backgroundWarm: '#FFF5E6', // CrÃ¨me chaud - sections
  backgroundCool: '#F5F8FF', // Bleu trÃ¨s clair - variante
  
  surface: '#FFFFFF',        // Blanc - cartes, modales
  surfaceElevated: '#FFFFFF',// Blanc avec shadow
  
  // Textes
  textPrimary: '#2D3748',    // Gris foncÃ© - texte principal
  textSecondary: '#4A5568',  // Gris moyen - texte secondaire
  textMuted: '#718096',      // Gris clair - texte dÃ©sactivÃ©
  textOnPrimary: '#FFFFFF',  // Blanc - texte sur couleur primaire
  textOnDark: '#FFFFFF',     // Blanc - texte sur fond sombre
  
  // Ã‰tats
  disabled: '#CBD5E0',       // Gris - Ã©lÃ©ments dÃ©sactivÃ©s
  error: '#E53E3E',          // Rouge doux - erreurs (usage rare)
  
  // Overlays
  overlay: 'rgba(0, 0, 0, 0.4)',      // Fond modal
  overlayLight: 'rgba(0, 0, 0, 0.1)', // Ombres lÃ©gÃ¨res
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

### ðŸŒ² Couleurs Home V10 â€” ForÃªt Magique (NOUVEAU)

```typescript
// src/constants/colorsV10.ts

export const ForestColors = {
  // === CIEL ===
  sky: {
    top: '#87CEEB',           // Bleu ciel clair
    middle: '#B0E0E6',        // Bleu poudre
    horizon: '#98D9A8',       // Transition vert pÃ¢le
    bottom: '#7BC74D',        // Vert herbe (success)
  },
  
  // === SOLEIL ===
  sun: {
    core: '#FFD93D',          // Jaune vif
    glow: '#F5C800',          // Halo dorÃ©
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
      light: '#6B8E7B',       // Vert grisÃ© clair (distance atmosphÃ©rique)
      dark: '#5A7D6A',        // Vert grisÃ© foncÃ©
    },
    near: {
      light: '#4A6D5A',       // Vert saturÃ© clair
      dark: '#3D5C4A',        // Vert saturÃ© foncÃ©
    },
    snow: 'rgba(255, 255, 255, 0.7)', // Neige sommet
  },
  
  // === COLLINES ===
  hills: {
    back: {
      light: '#5BAE6B',       // Vert moyen clair
      dark: '#4A9D5A',        // Vert moyen foncÃ©
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
      dark: '#6B4423',        // Marron foncÃ©
    },
    foliage: {
      light: '#3D8B4F',       // Vert feuillage clair
      dark: '#2D6B3F',        // Vert feuillage foncÃ©
    },
  },
  
  // === BUISSONS ===
  bushes: {
    light: '#4A9D5A',         // Vert buisson clair
    dark: '#3D8B4F',          // Vert buisson foncÃ©
  },
  
  // === SOL / HERBE ===
  ground: '#7BC74D',          // Vert success (cohÃ©rence palette)
  
  // === FLEURS (emojis - pas de couleur CSS) ===
  // ðŸŒ¸ðŸŒ»ðŸŒ·ðŸŒºðŸŒ¼ðŸ’ðŸª»
  
} as const;

// === MASCOTTE PIOU ===
export const PiouColors = {
  body: {
    main: '#C9A86C',          // Beige/caramel principal
    dark: '#A68B5B',          // Ombre corps
  },
  belly: '#F5E6D3',           // Ventre crÃ¨me clair
  beak: '#FFB347',            // Bec orange (secondary)
  eyes: {
    white: '#FFFFFF',
    pupil: '#2C1810',         // Marron trÃ¨s foncÃ©
  },
} as const;

// === MÃ‰DAILLES (SystÃ¨me de progression) ===
export const MedalColors = {
  bronze: {
    light: '#CD7F32',         // Bronze clair
    dark: '#8B5A2B',          // Bronze foncÃ©
  },
  silver: {
    light: '#C0C0C0',         // Argent clair
    dark: '#909090',          // Argent foncÃ©
  },
  gold: {
    light: '#FFD700',         // Or clair
    dark: '#FFA500',          // Or foncÃ©
  },
  diamond: {
    light: '#B9F2FF',         // Diamant clair (cyan pÃ¢le)
    dark: '#00CED1',          // Diamant foncÃ© (turquoise)
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
    '#98D9A8',  // 70% - Vert pÃ¢le
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
  
  // MÃ©dailles
  medalBronze: ['#CD7F32', '#8B5A2B'],
  medalSilver: ['#C0C0C0', '#909090'],
  medalGold: ['#FFD700', '#FFA500'],
  medalDiamond: ['#B9F2FF', '#00CED1'],
  
  // Cartes de jeu par catÃ©gorie
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

### AccessibilitÃ© couleurs

```typescript
// Contraste WCAG AA minimum
// Texte sur fond clair: ratio 4.5:1 minimum
// Ã‰lÃ©ments graphiques: ratio 3:1 minimum

// âš ï¸ RÃˆGLE DALTONISME: Ne jamais utiliser couleur seule pour l'information
// Toujours combiner: couleur + icÃ´ne + texte

export const AccessiblePairs = {
  // [background, foreground] - ratios vÃ©rifiÃ©s
  primaryOnWhite: ['#FFFFFF', '#5B8DEE'],     // âœ“ 3.5:1 (AA large)
  textOnBackground: ['#FFF9F0', '#2D3748'],   // âœ“ 10:1 (AAA)
  whiteOnPrimary: ['#5B8DEE', '#FFFFFF'],     // âœ“ 3.5:1 (AA large)
  whiteOnSuccess: ['#7BC74D', '#FFFFFF'],     // âœ“ 3:1 (AA graphics)
  
  // V10 - Texte sur cartes de jeu
  whiteOnGameCard: ['#5B8DEE', '#FFFFFF'],    // âœ“ 3.5:1
  textOnDiamond: ['#B9F2FF', '#006666'],      // âœ“ 4.5:1 (AA)
};
```

---

## ðŸ“¤ Typographie

### Configuration des fonts

```typescript
// src/constants/typography.ts

export const FontFamily = {
  // Titres et boutons - ludique mais lisible
  heading: 'Fredoka',
  headingBold: 'Fredoka',
  
  // Texte courant - trÃ¨s lisible, dyslexie-friendly
  body: 'Nunito',
  bodyBold: 'Nunito-Bold',
  bodySemiBold: 'Nunito-SemiBold',
  
  // Alternative accessibilitÃ© dyslexie
  accessible: 'Nunito', // ou OpenDyslexic si installÃ©
} as const;

export const FontSize = {
  // Titres
  h1: 32,        // Titres principaux Ã©crans
  h2: 28,        // Sous-titres
  h3: 24,        // Titres de section
  h4: 20,        // Titres de carte
  
  // Corps de texte
  bodyLarge: 20, // Instructions importantes
  body: 18,      // Texte courant (MINIMUM pour enfants)
  bodySmall: 16, // Labels, lÃ©gendes (usage limitÃ©)
  
  // Boutons
  buttonLarge: 22,
  button: 18,
  buttonSmall: 16,
  
  // SpÃ©ciaux
  caption: 14,   // TrÃ¨s petit texte (adultes uniquement)
  label: 12,     // Tags, badges
  
  // V10 - Home spÃ©cifique
  gameCardTitle: 17,    // Titre carte de jeu
  widgetTitle: 16,      // Titre widget
  medalLabel: 13,       // Label mÃ©daille
  categoryTitle: 20,    // Titre catÃ©gorie
  greetingName: 24,     // PrÃ©nom dans "Bonjour [Nom]"
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
  relaxed: 1.6,  // Texte long, accessibilitÃ©
} as const;

export const LetterSpacing = {
  tight: -0.5,   // Titres display
  normal: 0,     // Texte courant
  wide: 0.5,     // AccessibilitÃ© dyslexie
  extraWide: 1,  // Labels uppercase
} as const;

// Styles prÃ©dÃ©finis
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
  
  // V10 - Styles spÃ©cifiques Home
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
    color: '#5B8DEE', // Primary pour le prÃ©nom
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

## ðŸ“ Espacements

```typescript
// src/constants/spacing.ts

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
  
  // SÃ©mantique
  screenPadding: 24,        // Marge Ã©cran iPad
  screenPaddingPhone: 16,   // Marge Ã©cran iPhone
  cardPadding: 20,          // Padding intÃ©rieur cartes
  sectionGap: 32,           // Entre sections
  itemGap: 16,              // Entre Ã©lÃ©ments liste
  inlineGap: 8,             // Entre Ã©lÃ©ments inline
  
  // V10 - Home spÃ©cifique
  homeHeaderPadding: 16,    // Padding header V10
  homeSidePadding: 80,      // Marge latÃ©rale contenu
  homeTopPadding: 260,      // Espace haut pour header
  gameCardGap: 60,          // Espacement entre cartes de jeu
  widgetGap: 14,            // Espacement entre widgets
  categoryGap: 24,          // Espacement entre catÃ©gories
} as const;

// Tailles spÃ©cifiques enfants
export const TouchTarget = {
  minimum: 48,        // Minimum absolu (adulte)
  child: 64,          // Minimum enfant (OBLIGATOIRE)
  recommended: 80,    // RecommandÃ© drag & drop
  large: 96,          // Ã‰lÃ©ments principaux
} as const;

// V10 - Dimensions des composants Home
export const HomeV10Dimensions = {
  // Ã‰cran iPad cible
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
  
  // Ã‰lÃ©ments flottants
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

## ðŸŒ² Home V10 â€” Architecture Z-Index (NOUVEAU)

```typescript
// src/constants/zIndex.ts

/**
 * Structure en couches de la Home V10 - ForÃªt Magique
 * 
 * Le design utilise 12 couches distinctes pour crÃ©er la profondeur.
 * Le background couvre 100% de l'Ã©cran (position: absolute, inset: 0).
 * Le contenu scrolle au-dessus du dÃ©cor fixe.
 */

export const ZIndex = {
  // === COUCHE DÃ‰COR (fixe, non-scrollable) ===
  
  sky: 0,              // Fond gradient ciel
  mountainsFar: 2,     // Montagnes lointaines (effet atmosphÃ©rique)
  mountainsNear: 3,    // Montagnes proches
  clouds: 4,           // Nuages animÃ©s
  sun: 5,              // Soleil avec halo
  hills: 6,            // Collines (2 couches)
  trees: 7,            // Arbres (3 profondeurs)
  bushes: 8,           // Buissons
  garden: 9,           // Fleurs + papillons
  animals: 11,         // Animaux animÃ©s (oiseaux, Ã©cureuil, etc.)
  
  // === COUCHE CONTENU (scrollable) ===
  
  contentLayer: 30,    // ScrollView avec header, widgets, cartes
  
  // === COUCHE FLOTTANTE (fixe, au-dessus de tout) ===
  
  floatingElements: 50, // Piou mascotte + Livre collection
  
  // === MODALES & OVERLAYS ===
  
  modal: 100,          // Modales
  toast: 110,          // Notifications toast
  
} as const;

// Configuration des couches du dÃ©cor
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
    flowers: ['ðŸŒ¸', 'ðŸŒ»', 'ðŸŒ·', 'ðŸŒº', 'ðŸŒ¼', 'ðŸ’', 'ðŸª»'],
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

## ðŸ“˜ Composants

### Boutons

```typescript
// src/constants/components.ts

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

### ðŸŽ® Cartes de Jeu V10 (NOUVEAU)

```typescript
// src/constants/gameCardV10.ts

export const GameCardV10Style = {
  // Dimensions
  width: 320,
  height: 180,
  borderRadius: 20,
  padding: 16,
  
  // Background
  gradientDirection: { x: 0, y: 0, x1: 1, y1: 1 }, // 135Â°
  
  // IcÃ´ne de fond (emoji)
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
  
  // Badge (Nouveau, Hot, BientÃ´t)
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    fontSize: 10,
    fontWeight: '800',
    position: { top: 12, left: 12 },
  },
  
  // MÃ©daille
  medal: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    fontSize: 13,
    fontWeight: '600',
    iconSize: 16,
  },
} as const;

// Variantes de couleur par catÃ©gorie
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
    category: 'MÃ©moire',
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

// Ã‰tats des badges
export const GameCardBadges = {
  new: {
    background: '#FFFFFF',
    text: '#27AE60',
    label: 'Nouveau',
  },
  hot: {
    background: '#FFFFFF',
    text: '#E74C3C',
    label: 'ðŸ”¥ Hot',
  },
  soon: {
    background: '#FFFFFF',
    text: '#F39C12',
    label: 'BientÃ´t',
  },
} as const;
```

### ðŸ… SystÃ¨me de MÃ©dailles V10 (NOUVEAU)

```typescript
// src/constants/medals.ts

export const MedalStyle = {
  bronze: {
    gradient: ['#CD7F32', '#8B5A2B'],
    icon: 'ðŸ¥‰',
    label: 'Bronze',
    textColor: '#FFFFFF',
  },
  silver: {
    gradient: ['#C0C0C0', '#909090'],
    icon: 'ðŸ¥ˆ',
    label: 'Argent',
    textColor: '#FFFFFF',
  },
  gold: {
    gradient: ['#FFD700', '#FFA500'],
    icon: 'ðŸ¥‡',
    label: 'Or',
    textColor: '#FFFFFF',
  },
  diamond: {
    gradient: ['#B9F2FF', '#00CED1'],
    icon: 'ðŸ’Ž',
    label: 'Diamant',
    textColor: '#006666',
  },
  locked: {
    gradient: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)'],
    icon: 'ðŸ”’',
    label: 'VerrouillÃ©',
    textColor: 'rgba(255, 255, 255, 0.8)',
  },
} as const;

// Seuils de progression pour les mÃ©dailles
export const MedalThresholds = {
  bronze: 1,    // Niveau 1 complÃ©tÃ©
  silver: 3,    // Niveau 3 complÃ©tÃ©
  gold: 5,      // Niveau 5 complÃ©tÃ©
  diamond: 10,  // Tous niveaux + dÃ©fis bonus
} as const;
```

### ðŸ“Š Widgets V10 (NOUVEAU)

```typescript
// src/constants/widgets.ts

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
      icon: 'ðŸ¦‰',
    },
    garden: {
      gradient: ['rgba(39,174,96,0.95)', 'rgba(30,132,73,0.95)'],
      icon: 'ðŸŒ»',
    },
    streak: {
      gradient: ['rgba(243,156,18,0.95)', 'rgba(214,137,16,0.95)'],
      icon: 'ðŸ”¥',
    },
    collection: {
      gradient: ['rgba(155,89,182,0.95)', 'rgba(142,68,173,0.95)'],
      icon: 'ðŸƒ',
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

### ðŸ¦ Mascotte Piou V10 (NOUVEAU)

```typescript
// src/constants/piou.ts

export const PiouStyle = {
  // Dimensions
  body: {
    width: 60,
    height: 65,
  },
  
  // Couleurs
  colors: {
    bodyMain: '#C9A86C',
    bodyDark: '#A68B5B',
    belly: '#F5E6D3',
    beak: '#FFB347',
    eyeWhite: '#FFFFFF',
    eyePupil: '#2C1810',
  },
  
  // Proportions (relatives au body)
  proportions: {
    belly: { width: 0.63, height: 0.43, bottomOffset: 0.08 },
    eye: { size: 0.23, top: 0.22 },
    pupil: { size: 0.12 },
    beak: { width: 0.23, height: 0.15, top: 0.43 },
  },
  
  // Animation
  animation: {
    bounce: {
      translateY: [-4, 0, -4],
      duration: 2000,
    },
    wingFlap: {
      rotate: [0, -20, 0],
      duration: 400,
    },
  },
} as const;
```

### Feedback Messages

```typescript
export const FeedbackStyle = {
  success: {
    backgroundColor: 'rgba(123, 199, 77, 0.15)',
    borderColor: Colors.success,
    borderWidth: 2,
    iconBackground: Colors.success,
    icon: 'â­', // ou CheckCircle de lucide
  },
  encourage: {
    backgroundColor: 'rgba(255, 179, 71, 0.15)',
    borderColor: Colors.secondary,
    borderWidth: 2,
    iconBackground: Colors.secondary,
    icon: 'ðŸ’ª',
  },
  hint: {
    backgroundColor: 'rgba(243, 156, 18, 0.15)',
    borderColor: Colors.attention,
    borderWidth: 2,
    iconBackground: Colors.attention,
    icon: 'ðŸ’¡',
  },
} as const;

// Messages type par feedback
export const FeedbackMessages = {
  success: [
    "Super ! Tu as trouvÃ© la bonne mÃ©thode !",
    "Bravo ! Tu as compris !",
    "Excellent travail !",
    "Tu y es arrivÃ© !",
  ],
  encourage: [
    "Presque ! Essaie encore.",
    "Tu y es presque !",
    "Continue, tu progresses !",
    "Bel effort ! RÃ©essaie.",
  ],
  hint: [
    "Regarde bien...",
    "Et si tu essayais autrement ?",
    "Pense Ã  la rÃ¨gle...",
    "Observe ce qui se passe.",
  ],
} as const;
```

### Progress Bar

```typescript
export const ProgressStyle = {
  height: 12,
  borderRadius: 6,
  backgroundColor: 'rgba(91, 141, 238, 0.2)',
  fillGradient: Gradients.progress,
} as const;
```

---

## ðŸŽ¬ Animations

### Configurations de base

```typescript
// src/constants/animations.ts
import { Easing } from 'react-native-reanimated';

export const Duration = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  celebration: 800,
  
  // V10 - DurÃ©es longues pour dÃ©cor
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

// Animations prÃ©dÃ©finies
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
  
  // SuccÃ¨s
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
  
  // Apparition Ã©lÃ©ment
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

### ðŸŒ² Animations V10 â€” DÃ©cor ForÃªt Magique (NOUVEAU)

```typescript
// src/constants/animationsV10.ts

/**
 * Animations du dÃ©cor Home V10
 * Toutes utilisent Reanimated 3 avec useNativeDriver: true
 */

export const ForestAnimations = {
  // === CIEL ===
  
  sun: {
    pulse: {
      scale: [1, 1.05, 1],
      duration: 4000,
      easing: 'easeInOut',
      loop: true,
    },
    glow: {
      opacity: [0.5, 1, 0.5],
      scale: [1, 1.2, 1],
      duration: 3000,
      loop: true,
    },
  },
  
  clouds: {
    drift: {
      translateX: [0, 1400], // Traverse l'Ã©cran
      duration: [35000, 40000, 45000, 50000], // Vitesses variÃ©es
      easing: 'linear',
      loop: true,
    },
  },
  
  // === VÃ‰GÃ‰TATION ===
  
  flowers: {
    sway: {
      rotate: [-5, 5],
      duration: 3000,
      easing: 'easeInOut',
      loop: true,
      staggerDelay: [0, 500, 300, 1000, 1500, 200, 800], // 7 fleurs
    },
  },
  
  trees: {
    gentleSway: {
      rotate: [-1, 1],
      duration: 5000,
      easing: 'easeInOut',
      loop: true,
    },
  },
  
  // === ANIMAUX ===
  
  butterfly: {
    flight: {
      // Mouvement en 8
      translateX: [0, 100, 200, 100, 0],
      translateY: [0, -30, 0, 30, 0],
      rotate: [-10, 10, -10, 10, -10],
      duration: 8000,
      easing: 'easeInOut',
      loop: true,
    },
  },
  
  bird: {
    flyAcross: {
      translateX: [0, 1300],
      translateY: [0, -30, 10, -20, 0], // Ondulation
      opacity: [0, 1, 1, 1, 0],
      duration: [14000, 18000, 22000], // 3 oiseaux
      easing: 'linear',
      loop: true,
    },
  },
  
  squirrel: {
    scurry: {
      translateX: [0, 550, 550, 0],
      scaleX: [1, 1, -1, -1], // Flip direction
      duration: 28000,
      easing: 'easeInOut',
      loop: true,
    },
  },
  
  rabbit: {
    hop: {
      translateX: [0, -80, -160, -240, -240, -160, -80, 0],
      translateY: [0, -25, 0, -20, 0, -25, 0, -20, 0],
      duration: 22000,
      easing: 'easeOut',
      loop: true,
    },
  },
  
  ladybug: {
    crawl: {
      translateX: [0, 100, 50, 120, 0],
      translateY: [0, -10, 5, -5, 0],
      duration: 25000,
      easing: 'linear',
      loop: true,
    },
  },
  
  bee: {
    buzz: {
      translateX: [0, 200, 400, 600, 800, 1000],
      translateY: [0, -30, 20, -40, 10, -20],
      duration: 18000,
      easing: 'easeInOut',
      loop: true,
    },
  },
  
  dragonfly: {
    dart: {
      translateX: [0, -300, -250, -500, -450, -700, -1000],
      translateY: [0, -20, 30, -10, 40, 0, -30],
      duration: 12000,
      easing: 'easeInOut',
      loop: true,
    },
  },
  
  // === Ã‰LÃ‰MENTS FLOTTANTS ===
  
  piouMascot: {
    hover: {
      translateY: [0, -8, 0],
      duration: 3000,
      easing: 'easeInOut',
      loop: true,
    },
    wingFlap: {
      rotate: [0, -15, 0, 15, 0],
      duration: 400,
      loop: true,
    },
  },
  
  collectionBook: {
    float: {
      translateY: [0, -6, 0],
      rotate: [-2, 2, -2],
      duration: 5000,
      easing: 'easeInOut',
      loop: true,
    },
  },
  
} as const;

// Hooks recommandÃ©s pour les animations V10
export const AnimationHooks = {
  useCloudAnimation: 'Anime les nuages en boucle infinie',
  useSunPulse: 'Animation de pulsation du soleil',
  useFlowerSway: 'Balancement des fleurs avec stagger',
  useButterflyFlight: 'Vol en 8 des papillons',
  useBirdFlight: 'TraversÃ©e d\'Ã©cran des oiseaux',
  useAnimalMovement: 'Mouvements Ã©cureuil/lapin/coccinelle',
  usePiouHover: 'Vol stationnaire de Piou',
  useCollectionFloat: 'Flottement du livre de collection',
} as const;
```

---

## ðŸ‘† Gestes

```typescript
// src/constants/gestures.ts

export const Gestures = {
  // âœ… RECOMMANDÃ‰S
  recommended: {
    tap: true,           // Tap simple un doigt
    dragDrop: true,      // Glisser-dÃ©poser
    swipeHorizontal: true,
    swipeVertical: true,
    longPress: true,     // Avec feedback visuel obligatoire
    pinchZoom: true,     // Optionnel, pour zoom images
  },
  
  // âŒ Ã€ Ã‰VITER
  avoid: {
    doubleTap: false,    // Trop complexe pour enfants
    multiTouch: false,   // 2+ doigts simultanÃ©s
    rotation: false,     // Rotation 2 doigts
    precisionSwipe: false, // Swipe avec timing prÃ©cis
  },
} as const;

// Config pour PanGestureHandler
export const DragConfig = {
  minDistance: 10,       // Distance min pour dÃ©clencher
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

## ðŸ“± Layouts & Responsive

```typescript
// src/constants/layout.ts
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
  
  // Nombre max d'options par Ã©cran
  maxOptionsPerScreen: 5,
  
  // Grille activitÃ©s
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

### ðŸ  Layout Home V10 (NOUVEAU)

```typescript
// src/constants/layoutV10.ts

export const HomeV10Layout = {
  // Ã‰cran cible
  screen: {
    width: 1194,      // iPad landscape
    height: 834,
  },
  
  // Background (couvre 100%)
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  // Content layer (scrollable)
  content: {
    zIndex: 30,
    paddingTop: 0,        // Header intÃ©grÃ©
    paddingHorizontal: 80,
  },
  
  // Header
  header: {
    height: 'auto',
    paddingVertical: 16,
    paddingHorizontal: 28,
  },
  
  // Widgets section
  widgets: {
    paddingHorizontal: 28,
    paddingBottom: 20,
    gridColumns: 2,
    gap: 14,
  },
  
  // Games section
  games: {
    paddingHorizontal: 28,
    paddingBottom: 28,
    categoryGap: 24,
    cardGap: 60,
    cardsPerRow: 3,
  },
  
  // Floating elements
  floating: {
    piou: {
      position: 'absolute',
      left: 40,
      bottom: 100,
      zIndex: 50,
    },
    collection: {
      position: 'absolute',
      right: 40,
      bottom: 100,
      zIndex: 50,
    },
  },
} as const;

// Responsive breakpoints
export const Breakpoints = {
  phone: 0,
  phoneL: 414,
  tablet: 768,
  tabletL: 1024,
  desktop: 1194,
} as const;

// Adaptations responsive
export const ResponsiveV10 = {
  gameCard: {
    phone: { width: 280, height: 160, gap: 16 },
    tablet: { width: 320, height: 180, gap: 60 },
  },
  widget: {
    phone: { height: 120, columns: 1 },
    tablet: { height: 140, columns: 2 },
  },
  cardsPerRow: {
    phone: 2,
    tablet: 3,
  },
} as const;
```

---

## ðŸ‘¶ Adaptation par Ã¢ge

```typescript
// src/constants/ageGroups.ts

export const AgeGroup = {
  '6-7': {
    label: '6-7 ans',
    sessionDuration: 8 * 60,     // 8 minutes en secondes
    maxSessionDuration: 10 * 60, // 10 minutes max
    touchTargetSize: 80,         // Plus grand
    fontSize: {
      body: 20,
      button: 20,
    },
    requiresAudio: true,         // Audio obligatoire
    requiresIcons: true,         // IcÃ´nes obligatoires
    textOptional: true,          // Texte optionnel
    complexity: 'low',
    hintsAfterErrors: 2,         // Indice aprÃ¨s 2 erreurs
  },
  '8-9': {
    label: '8-9 ans',
    sessionDuration: 12 * 60,
    maxSessionDuration: 15 * 60,
    touchTargetSize: 64,
    fontSize: {
      body: 18,
      button: 18,
    },
    requiresAudio: false,
    requiresIcons: true,
    textOptional: false,
    complexity: 'medium',
    hintsAfterErrors: 3,
  },
  '9-10': {
    label: '9-10 ans',
    sessionDuration: 15 * 60,
    maxSessionDuration: 20 * 60,
    touchTargetSize: 64,
    fontSize: {
      body: 18,
      button: 18,
    },
    requiresAudio: false,
    requiresIcons: true,
    textOptional: false,
    complexity: 'high',
    hintsAfterErrors: 4,
    // Ã‰viter aspect "bÃ©bÃ©"
    matureUI: true,
  },
} as const;

export type AgeGroupKey = keyof typeof AgeGroup;
```

---

## â™¿ AccessibilitÃ©

```typescript
// src/constants/accessibility.ts

export const A11y = {
  // Tailles minimum
  minTouchTarget: 48,      // Apple/Google guidelines
  childTouchTarget: 64,    // Notre minimum enfant
  
  // Contraste
  minContrastText: 4.5,    // WCAG AA texte
  minContrastGraphic: 3,   // WCAG AA Ã©lÃ©ments graphiques
  
  // Timing
  minAnimationDuration: 200,  // Pas trop rapide
  
  // RÃ©duire animations (respecter prÃ©fÃ©rences systÃ¨me)
  respectReduceMotion: true,
  
  // Daltonisme
  neverColorOnly: true,    // Toujours couleur + forme/icÃ´ne
  
  // Tailles texte
  minFontSize: 16,         // Jamais moins
  preferredFontSize: 18,   // RecommandÃ© enfant
  
  // Labels
  requireAccessibilityLabel: true,
  requireAccessibilityHint: true,
} as const;

// Helper pour les accessibilityLabel
export const getAccessibilityLabel = (
  action: string,
  target: string,
  state?: string
): string => {
  let label = `${action} ${target}`;
  if (state) label += `, ${state}`;
  return label;
};

// Exemple: getAccessibilityLabel('Appuyer pour', 'jouer', 'niveau 1')
// â†’ "Appuyer pour jouer, niveau 1"
```

---

## ðŸŽ¯ IcÃ´nes Navigation

```typescript
// IcÃ´nes recommandÃ©es pour navigation 100% visuelle

export const NavigationIcons = {
  home: 'ðŸ ',        // ou Home de lucide
  play: 'ðŸŽ®',        // ou Play
  progress: 'ðŸ“Š',    // ou BarChart
  settings: 'âš™ï¸',    // ou Settings
  puzzle: 'ðŸ§©',      // Logique
  numbers: 'ðŸ”¢',     // NumÃ©rique
  shapes: 'ðŸ”·',      // Spatial
  words: 'ðŸ”',       // Verbal
  target: 'ðŸŽ¯',      // Objectif
  trophy: 'ðŸ†',      // RÃ©compense
  hint: 'ðŸ’¡',        // Aide
  sound: 'ðŸ”Š',       // Audio
  back: 'â†',         // Retour
  close: 'âœ•',        // Fermer
  check: 'âœ“',        // Valider
  star: 'â­',        // SuccÃ¨s
  
  // V10 - IcÃ´nes Home
  parent: 'ðŸ‘¨â€ðŸ‘©â€ðŸ‘§',     // Espace parent
  collection: 'ðŸƒ',  // Collection cartes
  streak: 'ðŸ”¥',      // SÃ©rie quotidienne
  garden: 'ðŸŒ±',      // Jardin progression
  diamond: 'ðŸ’Ž',     // Points/gemmes
  medal: 'ðŸ…°ï¸',       // MÃ©dailles
} as const;

// Emojis dÃ©cor V10
export const ForestEmojis = {
  flowers: ['ðŸŒ¸', 'ðŸŒ»', 'ðŸŒ·', 'ðŸŒº', 'ðŸŒ¼', 'ðŸ’', 'ðŸª»'],
  animals: {
    bird: 'ðŸ¦',
    butterfly: 'ðŸ¦‹',
    squirrel: 'ðŸ¿ï¸',
    rabbit: 'ðŸ°',
    ladybug: 'ðŸž',
    bee: 'ðŸ',
    dragonfly: 'ðŸª»',
  },
  mascot: 'ðŸ¦‰',      // Piou le hibou
} as const;
```

---

## ðŸ“ Structure fichiers recommandÃ©e

```
src/
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ ui/
â”‚   â”‚   â”œâ”€â”€ Button.tsx
â”‚   â”‚   â”œâ”€â”€ Card.tsx
â”‚   â”‚   â”œâ”€â”€ Text.tsx
â”‚   â”‚   â”œâ”€â”€ ProgressBar.tsx
â”‚   â”‚   â””â”€â”€ IconButton.tsx
â”‚   â”œâ”€â”€ feedback/
â”‚   â”‚   â”œâ”€â”€ SuccessAnimation.tsx
â”‚   â”‚   â”œâ”€â”€ HintBubble.tsx
â”‚   â”‚   â””â”€â”€ FeedbackMessage.tsx
â”‚   â”œâ”€â”€ activities/
â”‚   â”‚   â”œâ”€â”€ HanoiTower.tsx
â”‚   â”‚   â””â”€â”€ ...
â”‚   â”œâ”€â”€ ai/
â”‚   â”‚   â””â”€â”€ MascotAssistant.tsx
â”‚   â”‚
â”‚   â”œâ”€â”€ home/                    # V10 - Composants Home
â”‚   â”‚   â”œâ”€â”€ index.ts
â”‚   â”‚   â”œâ”€â”€ HomeHeaderV10.tsx
â”‚   â”‚   â”œâ”€â”€ GameCardV10.tsx
â”‚   â”‚   â”œâ”€â”€ CategoryRow.tsx
â”‚   â”‚   â”œâ”€â”€ PiouMascot.tsx
â”‚   â”‚   â””â”€â”€ widgets/
â”‚   â”‚       â”œâ”€â”€ WidgetsSection.tsx
â”‚   â”‚       â”œâ”€â”€ PiouWidget.tsx
â”‚   â”‚       â”œâ”€â”€ GardenWidget.tsx
â”‚   â”‚       â”œâ”€â”€ StreakWidget.tsx
â”‚   â”‚       â””â”€â”€ CollectionWidgetV10.tsx
â”‚   â”‚
â”‚   â”œâ”€â”€ background/              # V10 - DÃ©cor ForÃªt
â”‚   â”‚   â”œâ”€â”€ index.ts
â”‚   â”‚   â”œâ”€â”€ ForestBackground.tsx
â”‚   â”‚   â”œâ”€â”€ Sun.tsx
â”‚   â”‚   â”œâ”€â”€ AnimatedCloud.tsx
â”‚   â”‚   â”œâ”€â”€ Mountains.tsx
â”‚   â”‚   â”œâ”€â”€ Hills.tsx
â”‚   â”‚   â”œâ”€â”€ Trees.tsx
â”‚   â”‚   â”œâ”€â”€ Flowers.tsx
â”‚   â”‚   â””â”€â”€ animals/
â”‚   â”‚       â”œâ”€â”€ Bird.tsx
â”‚   â”‚       â”œâ”€â”€ Butterfly.tsx
â”‚   â”‚       â”œâ”€â”€ Squirrel.tsx
â”‚   â”‚       â”œâ”€â”€ Rabbit.tsx
â”‚   â”‚       â”œâ”€â”€ Ladybug.tsx
â”‚   â”‚       â”œâ”€â”€ Bee.tsx
â”‚   â”‚       â””â”€â”€ Dragonfly.tsx
â”‚   â”‚
â”‚   â””â”€â”€ collection/              # V10 - Collection cartes
â”‚       â”œâ”€â”€ index.ts
â”‚       â”œâ”€â”€ CollectionBook.tsx
â”‚       â”œâ”€â”€ CollectionCard.tsx
â”‚       â””â”€â”€ CardDetailModal.tsx
â”‚
â”œâ”€â”€ screens/
â”‚   â”œâ”€â”€ child/
â”‚   â”‚   â”œâ”€â”€ HomeScreen.tsx       # Utilise ForestBackground + composants V10
â”‚   â”‚   â”œâ”€â”€ ActivityScreen.tsx
â”‚   â”‚   â””â”€â”€ ProgressScreen.tsx
â”‚   â””â”€â”€ parent/
â”‚       â”œâ”€â”€ DashboardScreen.tsx
â”‚       â””â”€â”€ SettingsScreen.tsx
â”‚
â”œâ”€â”€ constants/
â”‚   â”œâ”€â”€ colors.ts
â”‚   â”œâ”€â”€ colorsV10.ts             # NOUVEAU
â”‚   â”œâ”€â”€ typography.ts
â”‚   â”œâ”€â”€ spacing.ts
â”‚   â”œâ”€â”€ components.ts
â”‚   â”œâ”€â”€ gameCardV10.ts           # NOUVEAU
â”‚   â”œâ”€â”€ widgets.ts               # NOUVEAU
â”‚   â”œâ”€â”€ medals.ts                # NOUVEAU
â”‚   â”œâ”€â”€ piou.ts                  # NOUVEAU
â”‚   â”œâ”€â”€ animations.ts
â”‚   â”œâ”€â”€ animationsV10.ts         # NOUVEAU
â”‚   â”œâ”€â”€ zIndex.ts                # NOUVEAU
â”‚   â”œâ”€â”€ layoutV10.ts             # NOUVEAU
â”‚   â””â”€â”€ index.ts                 # Export tout
â”‚
â”œâ”€â”€ hooks/
â”‚   â”œâ”€â”€ useAgeGroup.ts
â”‚   â”œâ”€â”€ useProgress.ts
â”‚   â”œâ”€â”€ useAccessibility.ts
â”‚   â”œâ”€â”€ useCloudAnimation.ts     # NOUVEAU V10
â”‚   â”œâ”€â”€ useAnimalAnimation.ts    # NOUVEAU V10
â”‚   â””â”€â”€ usePiouAnimation.ts      # NOUVEAU V10
â”‚
â”œâ”€â”€ context/
â”‚   â”œâ”€â”€ UserContext.tsx
â”‚   â””â”€â”€ ProgressContext.tsx
â”‚
â””â”€â”€ utils/
    â”œâ”€â”€ accessibility.ts
    â””â”€â”€ feedback.ts
```

---

## âœ… Checklist avant dÃ©veloppement

### AccessibilitÃ©
- [ ] Zones tactiles â‰¥ 64dp
- [ ] Contraste texte â‰¥ 4.5:1
- [ ] Jamais couleur seule (toujours + icÃ´ne)
- [ ] Police â‰¥ 18pt texte courant
- [ ] Support VoiceOver/TalkBack

### Navigation
- [ ] Profondeur â‰¤ 3 niveaux
- [ ] Retour accueil â‰¤ 2 taps
- [ ] Navigation 100% visuelle possible
- [ ] Pas de menu hamburger

### Feedback
- [ ] Feedback visuel immÃ©diat sur chaque tap
- [ ] Jamais de feedback nÃ©gatif punitif
- [ ] Animations fluides 60fps
- [ ] Sons optionnels et dÃ©sactivables

### SÃ©curitÃ©
- [ ] Espace parent protÃ©gÃ© (PIN/FaceID)
- [ ] Pas de liens externes accessibles enfant
- [ ] Mode hors-ligne fonctionnel
- [ ] Pas de collecte donnÃ©es personnelles

### ðŸŒ² Home V10 spÃ©cifique (NOUVEAU)
- [ ] Background couvre 100% Ã©cran (1194Ã—834 iPad)
- [ ] Animations dÃ©cor fluides et non-intrusives (60fps)
- [ ] Z-index respectÃ©s (dÃ©cor < contenu < flottants)
- [ ] Cartes de jeu 320Ã—180dp avec espacement 60dp
- [ ] Widgets ratio 2:1 avec backdrop blur
- [ ] Piou et Collection flottants toujours visibles
- [ ] Scroll vertical fluide sans saccades
- [ ] MÃ©dailles avec gradients corrects
- [ ] Nuages avec animation infinie (35-50s)
- [ ] Animaux avec cycles d'animation variÃ©s

---

## ðŸ“Š RÃ©capitulatif des ajouts V2

| Section | Ã‰lÃ©ments ajoutÃ©s |
|---------|------------------|
| **Couleurs** | +35 tokens ForÃªt Magique, +5 gradients mÃ©dailles, +8 gradients cartes |
| **Typographie** | +6 tailles V10 (gameCardTitle, widgetTitle, etc.) |
| **Espacements** | +8 valeurs V10 (gameCardGap, widgetGap, etc.) |
| **Z-Index** | Nouvelle section complÃ¨te (12 couches) |
| **Composants** | +GameCardV10, +Widgets, +MÃ©dailles, +Piou |
| **Animations** | +12 animations dÃ©cor (nuages, animaux, fleurs) |
| **Layout** | +HomeV10Layout avec responsive |
| **Structure** | +15 fichiers recommandÃ©s |
| **Checklist** | +10 points Home V10 |

---

*Design System v2.0 â€” App Ã‰ducative iPad*  
*Incluant Home V10 (ForÃªt Magique Immersive)*  
*BasÃ© sur les guidelines UX enfant et principes Montessori*
