# 🎨 DESIGN SYSTEM — Hello Guys
## App Éducative iPad • Enfants 6-10 ans

> **Version** : 3.0 (Fusion V1 + V2) • Décembre 2024
> **Source de vérité code** : `/src/theme/`

---

## 📌 Règle d'import unique

```typescript
// ✅ SEUL IMPORT AUTORISÉ
import { theme } from '@/theme';
// ou
import { colors, spacing, typography } from '@/theme';

// ❌ INTERDIT (deprecated)
import { Colors } from '@/constants/colors';
import { theme } from '@/constants/theme';
```

---

## 🎨 Couleurs

### Palette principale

| Nom | Code | Usage | Émotion |
|-----|------|-------|---------|
| **Primary** | `#5B8DEE` | Boutons, navigation | Confiance, calme |
| **Secondary** | `#FFB347` | Accents, CTA | Chaleur, énergie |
| **Success** | `#7BC74D` | Validation, réussite | Accomplissement |
| **Accent** | `#E056FD` | Éléments ludiques | Créativité, magie |
| **Attention** | `#F39C12` | Indices, aide | Curiosité |
| **Background** | `#FFF9F0` | Fond principal | Douceur |
| **Error** | `#E17055` | Erreurs (rare) | Orange doux, PAS rouge |

### Tokens dans le code

```typescript
// Accès via theme
theme.colors.primary.main        // #5B8DEE
theme.colors.secondary.main      // #FFB347
theme.colors.feedback.success    // #7BC74D
theme.colors.feedback.error      // #E57373
theme.colors.background.main     // #FFF9F0
theme.colors.background.card     // #FFFFFF
theme.colors.text.primary        // #2D3748
theme.colors.text.secondary      // #4A5568
```

### Gradients

```typescript
// Utilisation avec expo-linear-gradient
theme.gradients = {
  primary: ['#5B8DEE', '#4A7BD9'],
  secondary: ['#FFB347', '#FFA020'],
  success: ['#7BC74D', '#5FB030'],
  accent: ['#E056FD', '#C840E0'],
}
```

### Accessibilité couleurs

```typescript
// Contraste WCAG AA minimum : 4.5:1 (texte), 3:1 (graphiques)

// ⚠️ RÈGLE DALTONISME (8% des garçons)
// Ne JAMAIS utiliser couleur seule pour l'information
// Toujours combiner : couleur + icône + texte
```

---

## 🔤 Typographie

### Polices

| Police | Usage | Fichier |
|--------|-------|---------|
| **Fredoka** | Titres, boutons | @expo-google-fonts/fredoka |
| **Nunito** | Texte courant | @expo-google-fonts/nunito |

### Tailles

| Token | Valeur | Usage |
|-------|--------|-------|
| `h1` | 32px | Titres principaux |
| `h2` | 28px | Sous-titres |
| `h3` | 24px | Titres section |
| `h4` | 20px | Titres carte |
| `bodyLarge` | 20px | Instructions importantes |
| `body` | **18px** | Texte courant (MINIMUM enfant) |
| `bodySmall` | 16px | Labels (usage limité) |
| `button` | 18px | Texte bouton |

### Tokens dans le code

```typescript
theme.fontSize.h1           // 32
theme.fontSize.body         // 18 (minimum enfant)
theme.fontFamily.heading    // 'Fredoka'
theme.fontFamily.body       // 'Nunito'
theme.lineHeight.normal     // 1.4
```

---

## 📐 Espacements

### Grille 4pt

| Token | Valeur | Usage |
|-------|--------|-------|
| `spacing[1]` | 4px | Micro-espacement |
| `spacing[2]` | 8px | Entre éléments proches |
| `spacing[3]` | 12px | Padding interne |
| `spacing[4]` | 16px | Padding standard |
| `spacing[5]` | 20px | — |
| `spacing[6]` | 24px | Padding écran |
| `spacing[8]` | 32px | Entre sections |

### Border radius

```typescript
theme.borderRadius.sm    // 8
theme.borderRadius.md    // 12
theme.borderRadius.lg    // 16
theme.borderRadius.xl    // 24
theme.borderRadius.full  // 9999
```

---

## 👆 Touch Targets (CRITIQUE)

### Tailles obligatoires

| Élément | Minimum | Recommandé |
|---------|---------|------------|
| Boutons principaux | 48dp | **64dp** ✅ |
| Icônes interactives | 44dp | **60dp** |
| Éléments draggables | — | **80dp** |
| Cartes de jeu | — | **320×180dp** |

### Tokens

```typescript
theme.touchTargets.minimum   // 44
theme.touchTargets.child     // 64 (OBLIGATOIRE)
theme.touchTargets.large     // 80
```

### Hit slop (zone invisible élargie)

```typescript
theme.hitSlop.small   // { top: 8, bottom: 8, left: 8, right: 8 }
theme.hitSlop.medium  // { top: 12, ... }
theme.hitSlop.large   // { top: 16, ... }
```

---

## 🌊 Animations

### Durées

| Type | Durée | Usage |
|------|-------|-------|
| `instant` | 100ms | Micro-feedback |
| `fast` | 200ms | Boutons, hover |
| `normal` | 300ms | Transitions standard |
| `slow` | 500ms | Entrées/sorties |
| `verySlow` | 800ms | Animations décor |

### Springs Reanimated

```typescript
// Feedback tactile
withSpring(value, { damping: 15, stiffness: 150 })

// Entrée élément
withSpring(value, { damping: 12, stiffness: 100 })

// Bounce ludique
withSpring(value, { damping: 8, stiffness: 200 })
```

### Animations feedback

| Événement | Animation | Son |
|-----------|-----------|-----|
| Succès | Confetti/étoiles + scale | Carillon joyeux |
| Erreur | Shake horizontal (3x) | "Hmm" doux, PAS buzzer |
| Tap | Scale 0.95 → 1 | Pop léger |
| Indice | Pulse ampoule | Ding léger |

---

## 🏠 Home V10 — Forêt Magique

### Dimensions

| Élément | Valeur |
|---------|--------|
| Viewport | 1194 × 834px (iPad) |
| Padding écran | 60px |
| Carte de jeu | 320 × 180dp |
| Espacement cartes | 60dp |
| Widget | 100% width × 140dp |

### Couleurs Forêt

| Élément | Couleurs |
|---------|----------|
| Ciel (gradient) | `#87CEEB` → `#7BC74D` |
| Soleil | `#FFD93D` + halo |
| Nuages | `#FFFFFF` 90% |
| Montagnes lointaines | `#6B8E7B`, `#5A7D6A` |
| Collines | `#5BAE6B`, `#6BC77B` |
| Arbres tronc | `#8B5A2B` → `#6B4423` |
| Arbres feuillage | `#3D8B4F` → `#2D6B3F` |
| Piou (mascotte) | Corps `#C9A86C`, bec `#FFB347` |

### Z-index

```typescript
// Ordre d'empilement
zIndex: {
  forestBackground: 0,
  mountains: 1,
  trees: 2,
  content: 10,        // Cartes, widgets
  mascotPiou: 20,
  collectionButton: 20,
  modal: 100,
}
```

---

## 🎮 Cartes de Jeu V10

### Style

```typescript
GameCardV10Style = {
  width: 320,
  height: 180,
  borderRadius: 20,
  padding: 16,
  
  // Icône de fond
  backgroundIcon: {
    size: 120,
    opacity: 0.2,
  },
  
  // Shadow
  shadow: {
    color: '#000',
    offset: { width: 0, height: 8 },
    opacity: 0.2,
    radius: 24,
  },
}
```

### Variantes par catégorie

| Catégorie | Gradient |
|-----------|----------|
| Logique | `['#5B8DEE', '#3B6FCE']` |
| Formes | `['#9B59B6', '#8E44AD']` |
| Chiffres | `['#27AE60', '#1E8449']` |
| Mémoire | `['#F39C12', '#D68910']` |
| Mots | `['#E74C3C', '#C0392B']` |

### Badges

| Type | Background | Text |
|------|------------|------|
| Nouveau | `#FFFFFF` | `#27AE60` |
| Hot 🔥 | `#FFFFFF` | `#E74C3C` |
| Bientôt | `#FFFFFF` | `#F39C12` |

---

## 🏅 Système de Médailles

| Niveau | Gradient | Icône | Seuil |
|--------|----------|-------|-------|
| Bronze | `['#CD7F32', '#8B5A2B']` | 🥉 | Niveau 1 |
| Argent | `['#C0C0C0', '#909090']` | 🥈 | Niveau 3 |
| Or | `['#FFD700', '#FFA500']` | 🥇 | Niveau 5 |
| Diamant | `['#B9F2FF', '#00CED1']` | 💎 | Tous niveaux + bonus |
| Verrouillé | `rgba(255,255,255,0.2)` | 🔒 | — |

---

## 📊 Widgets V10

### Style commun

```typescript
WidgetV10Style = {
  height: 140,
  borderRadius: 20,
  padding: 18,
  backgroundIcon: {
    size: 130,
    opacity: 0.15,
  },
}
```

### Variantes

| Widget | Gradient | Icône |
|--------|----------|-------|
| Piou (mascotte) | `['#5B8DEE', '#3B6FCE']` | 🦉 |
| Jardin | `['#27AE60', '#1E8449']` | 🌻 |
| Série (streak) | `['#F39C12', '#D68910']` | 🔥 |
| Collection | `['#9B59B6', '#8E44AD']` | 🃏 |

---

## ✅ Checklist Design

### Avant commit

- [ ] Couleurs via `theme.colors` (pas de `#XXX`)
- [ ] Spacing via `theme.spacing` (pas de `16`)
- [ ] Touch targets ≥ 64dp
- [ ] Texte ≥ 18pt
- [ ] `fontFamily` explicite
- [ ] Feedback visuel sur toute interaction
- [ ] Pas de feedback négatif/punitif

---

## 📚 Fichiers source

| Fichier | Contenu |
|---------|---------|
| `src/theme/colors.ts` | Palette complète |
| `src/theme/typography.ts` | Polices, tailles |
| `src/theme/spacing.ts` | Grille, radius, shadows |
| `src/theme/touchTargets.ts` | Zones tactiles |
| `src/theme/index.ts` | Export unifié |

---

## 🧩 Composants UI Standardisés

### ScreenHeader (`src/components/common/ScreenHeader.tsx`)

3 variants disponibles :

```tsx
// Variant 'home' (Page d'accueil enfant)
<ScreenHeader
  variant="home"
  childName="Emma"
  avatarEmoji="🦊"
  level={5}
  totalStars={42}
  totalBadges={12}
  onAvatarPress={() => {}}
  showParentButton
  onParentPress={() => router.push('/(parent)')}
/>

// Variant 'game' (Écrans de jeux)
<ScreenHeader
  variant="game"
  title="La Tour Magique"
  emoji="🏰"
  onBack={() => router.back()}
  showParentButton
  showHelpButton
/>

// Variant 'parent' (Espace parents)
<ScreenHeader
  variant="parent"
  title="Espace Parents"
  onBack={() => router.back()}
/>
```

### BackButton (`src/components/common/BackButton.tsx`)

```tsx
// Variant 'icon' (défaut) - Cercle blanc avec flèche
<BackButton onPress={() => router.back()} variant="icon" size="medium" />

// Variant 'text' - Bouton rectangulaire
<BackButton onPress={() => router.push('/')} variant="text" label="Menu" />
```

### PageContainer (`src/components/common/PageContainer.tsx`)

Wrapper tout-en-un : SafeArea + Background + Scroll

```tsx
<PageContainer
  variant="playful"   // 'playful' | 'neutral' | 'parent' | 'transparent'
  scrollable={true}
  showDecorations={true}
  safeAreaEdges={['top', 'bottom']}
>
  {children}
</PageContainer>
```

### Pattern Page Jeu

```tsx
import { PageContainer, ScreenHeader } from '@/components/common';

export function GameIntroScreen() {
  return (
    <PageContainer variant="playful" scrollable>
      <ScreenHeader
        variant="game"
        title="Nom du Jeu"
        emoji="🎮"
        onBack={() => router.push('/')}
        showParentButton
        onParentPress={() => router.push('/(parent)')}
      />
      {/* Contenu */}
    </PageContainer>
  );
}
```

---

## 🌲 Home V10 — Composants Forêt

### ForestBackgroundV10 (`src/components/home-v10/ForestBackgroundV10.tsx`)

Couches (du fond vers l'avant) : Sky → Sun → MountainsFar → Clouds → MountainsNear → Hills → Trees → Bushes → Garden → Animaux

```tsx
<ForestBackgroundV10>
  <SafeAreaView style={{ flex: 1 }}>
    <HomeHeaderV10 />
    {/* Contenu */}
  </SafeAreaView>
</ForestBackgroundV10>
```

### HomeHeaderV10 & GameCardV10

```tsx
<HomeHeaderV10
  childName="Emma"
  avatarEmoji="🦊"
  level={5}
  onAvatarPress={() => {}}
  onParentPress={() => router.push('/(parent)')}
/>

<GameCardV10
  game={gameMetadata}
  onPress={() => router.push(game.route)}
  stars={3}
  isNew={false}
/>
```

---

*Version 4.0 • Fusion avec UI_PATTERNS.md*
*Source de vérité : `/src/theme/`*
