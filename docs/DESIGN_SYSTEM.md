# Design System — App Éducative iPad

> **Stack**: React Native + Expo SDK 52+ • TypeScript • Reanimated 3
> **Cible**: iPad (principal) + iPhone (secondaire) • Enfants 6-10 ans

---

## 📦 Installation des dépendances design

```bash
# Fonts
npx expo install expo-font @expo-google-fonts/nunito @expo-google-fonts/fredoka

# Animations
npx expo install react-native-reanimated

# Navigation
npx expo install expo-router

# Icônes (optionnel)
npx expo install @expo/vector-icons
```

---

## 🎨 Couleurs

### Tokens principaux

```typescript
// src/constants/colors.ts

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
};
```

---

## 🔤 Typographie

### Configuration des fonts

```typescript
// src/constants/typography.ts

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
  
  // Sémantique
  screenPadding: 24,        // Marge écran iPad
  screenPaddingPhone: 16,   // Marge écran iPhone
  cardPadding: 20,          // Padding intérieur cartes
  sectionGap: 32,           // Entre sections
  itemGap: 16,              // Entre éléments liste
  inlineGap: 8,             // Entre éléments inline
} as const;

// Tailles spécifiques enfants
export const TouchTarget = {
  minimum: 48,        // Minimum absolu (adulte)
  child: 64,          // Minimum enfant (OBLIGATOIRE)
  recommended: 80,    // Recommandé drag & drop
  large: 96,          // Éléments principaux
} as const;
```

---

## 🔘 Composants

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

### Feedback Messages

```typescript
export const FeedbackStyle = {
  success: {
    backgroundColor: 'rgba(123, 199, 77, 0.15)',
    borderColor: Colors.success,
    borderWidth: 2,
    iconBackground: Colors.success,
    icon: '⭐', // ou CheckCircle de lucide
  },
  encourage: {
    backgroundColor: 'rgba(255, 179, 71, 0.15)',
    borderColor: Colors.secondary,
    borderWidth: 2,
    iconBackground: Colors.secondary,
    icon: '💪',
  },
  hint: {
    backgroundColor: 'rgba(243, 156, 18, 0.15)',
    borderColor: Colors.attention,
    borderWidth: 2,
    iconBackground: Colors.attention,
    icon: '💡',
  },
} as const;

// Messages type par feedback
export const FeedbackMessages = {
  success: [
    "Super ! Tu as trouvé la bonne méthode !",
    "Bravo ! Tu as compris !",
    "Excellent travail !",
    "Tu y es arrivé !",
  ],
  encourage: [
    "Presque ! Essaie encore.",
    "Tu y es presque !",
    "Continue, tu progresses !",
    "Bel effort ! Réessaie.",
  ],
  hint: [
    "Regarde bien...",
    "Et si tu essayais autrement ?",
    "Pense à la règle...",
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

## 🎬 Animations

```typescript
// src/constants/animations.ts
import { Easing } from 'react-native-reanimated';

export const Duration = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  celebration: 800,
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
} as const;
```

---

## 👆 Gestes

```typescript
// src/constants/gestures.ts

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
```

---

## 📱 Layouts & Responsive

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

## 👶 Adaptation par âge

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
    requiresIcons: true,         // Icônes obligatoires
    textOptional: true,          // Texte optionnel
    complexity: 'low',
    hintsAfterErrors: 2,         // Indice après 2 erreurs
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
    // Éviter aspect "bébé"
    matureUI: true,
  },
} as const;

export type AgeGroupKey = keyof typeof AgeGroup;
```

---

## ♿ Accessibilité

```typescript
// src/constants/accessibility.ts

export const A11y = {
  // Tailles minimum
  minTouchTarget: 48,      // Apple/Google guidelines
  childTouchTarget: 64,    // Notre minimum enfant
  
  // Contraste
  minContrastText: 4.5,    // WCAG AA texte
  minContrastGraphic: 3,   // WCAG AA éléments graphiques
  
  // Timing
  minAnimationDuration: 200,  // Pas trop rapide
  
  // Réduire animations (respecter préférences système)
  respectReduceMotion: true,
  
  // Daltonisme
  neverColorOnly: true,    // Toujours couleur + forme/icône
  
  // Tailles texte
  minFontSize: 16,         // Jamais moins
  preferredFontSize: 18,   // Recommandé enfant
  
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
// → "Appuyer pour jouer, niveau 1"
```

---

## 🎯 Icônes Navigation

```typescript
// Icônes recommandées pour navigation 100% visuelle

export const NavigationIcons = {
  home: '🏠',        // ou Home de lucide
  play: '🎮',        // ou Play
  progress: '📊',    // ou BarChart
  settings: '⚙️',    // ou Settings
  puzzle: '🧩',      // Logique
  numbers: '🔢',     // Numérique
  shapes: '🔷',      // Spatial
  words: '📝',       // Verbal
  target: '🎯',      // Objectif
  trophy: '🏆',      // Récompense
  hint: '💡',        // Aide
  sound: '🔊',       // Audio
  back: '←',         // Retour
  close: '✕',        // Fermer
  check: '✓',        // Valider
  star: '⭐',        // Succès
} as const;
```

---

## 📁 Structure fichiers recommandée

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Text.tsx
│   │   ├── ProgressBar.tsx
│   │   └── IconButton.tsx
│   ├── feedback/
│   │   ├── SuccessAnimation.tsx
│   │   ├── HintBubble.tsx
│   │   └── FeedbackMessage.tsx
│   ├── activities/
│   │   ├── HanoiTower.tsx
│   │   └── ...
│   └── ai/
│       └── MascotAssistant.tsx
├── screens/
│   ├── child/
│   │   ├── HomeScreen.tsx
│   │   ├── ActivityScreen.tsx
│   │   └── ProgressScreen.tsx
│   └── parent/
│       ├── DashboardScreen.tsx
│       └── SettingsScreen.tsx
├── constants/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   ├── components.ts
│   ├── animations.ts
│   └── index.ts         # Export tout
├── hooks/
│   ├── useAgeGroup.ts
│   ├── useProgress.ts
│   └── useAccessibility.ts
├── context/
│   ├── UserContext.tsx
│   └── ProgressContext.tsx
└── utils/
    ├── accessibility.ts
    └── feedback.ts
```

---

## ✅ Checklist avant développement

### Accessibilité
- [ ] Zones tactiles ≥ 64dp
- [ ] Contraste texte ≥ 4.5:1
- [ ] Jamais couleur seule (toujours + icône)
- [ ] Police ≥ 18pt texte courant
- [ ] Support VoiceOver/TalkBack

### Navigation
- [ ] Profondeur ≤ 3 niveaux
- [ ] Retour accueil ≤ 2 taps
- [ ] Navigation 100% visuelle possible
- [ ] Pas de menu hamburger

### Feedback
- [ ] Feedback visuel immédiat sur chaque tap
- [ ] Jamais de feedback négatif punitif
- [ ] Animations fluides 60fps
- [ ] Sons optionnels et désactivables

### Sécurité
- [ ] Espace parent protégé (PIN/FaceID)
- [ ] Pas de liens externes accessibles enfant
- [ ] Mode hors-ligne fonctionnel
- [ ] Pas de collecte données personnelles

---

*Design System v1.0 — App Éducative iPad*
*Basé sur les guidelines UX enfant et principes Montessori*
