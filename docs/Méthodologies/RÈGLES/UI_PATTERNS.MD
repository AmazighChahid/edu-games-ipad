# 🎨 UI PATTERNS — Guide de Standardisation

> Documentation des composants et patterns d'interface standardisés
> **Projet** : Hello Guys — App Éducative iPad
> **Dernière mise à jour** : Décembre 2024

---

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Composants Standardisés](#composants-standardisés)
3. [Patterns par Type de Page](#patterns-par-type-de-page)
4. [Guidelines Obligatoires](#guidelines-obligatoires)
5. [Migration depuis l'ancien code](#migration-depuis-lancien-code)
6. [Exemples Complets](#exemples-complets)

---

## 🎯 Vue d'ensemble

### Problème Résolu

Avant cette standardisation, chaque page réimplémentait son propre header, background et boutons **inline** avec des styles différents. Cela créait :

- ❌ **4 headers différents** pour 4 pages
- ❌ **Imports obsolètes** de `/constants/` au lieu de `/theme/`
- ❌ **Violations des guidelines** (touch targets < 64dp, tailles texte < 18pt)
- ❌ **Code dupliqué** et difficile à maintenir

### Solution Implémentée

✅ **4 composants réutilisables** créés :
- `<ScreenHeader />` - Header unifié avec 3 variants
- `<BackButton />` - Bouton retour standardisé
- `<ScreenBackground />` - Backgrounds cohérents
- `<PageContainer />` - Wrapper avec SafeArea + padding

✅ **Centralisation du theme** : tout utilise `/theme/` (plus `/constants/`)

✅ **Respect des guidelines** : touch targets ≥ 64dp, texte ≥ 18pt, animations spring

---

## 🧩 Composants Standardisés

### 1. ScreenHeader

**Emplacement** : `src/components/common/ScreenHeader.tsx`

**3 variants disponibles** :

#### Variant 'home' (Page d'accueil enfant)

```tsx
<ScreenHeader
  variant="home"
  childName="Emma"
  avatarEmoji="🦊"
  level={5}
  totalStars={42}
  totalBadges={12}
  onAvatarPress={() => router.push('/avatar')}
  showParentButton
  onParentPress={() => router.push('/(parent)')}
/>
```

**Affichage** :
```
[🦊 Avatar Niv.5] Bonjour Emma ! 👋     [👨‍👩‍👧 Espace Parents]
                  Prêt·e pour de nouvelles aventures ?
                  [⭐ 42 étoiles] [🏆 12 badges]
```

---

#### Variant 'game' (Écrans de jeux)

```tsx
<ScreenHeader
  variant="game"
  title="La Tour Magique"
  emoji="🏰"
  onBack={() => router.back()}
  showParentButton
  onParentPress={() => router.push('/(parent)')}
  showHelpButton
  onHelpPress={() => setShowHelp(true)}
/>
```

**Affichage** :
```
[←]   🏰 La Tour Magique ✨   [👨‍👩‍👧] [?]
```

---

#### Variant 'parent' (Espace parents)

```tsx
<ScreenHeader
  variant="parent"
  title="Espace Parents"
  onBack={() => router.back()}
/>
```

**Affichage** :
```
Espace Parents                         [Retour]
```

---

### 2. BackButton

**Emplacement** : `src/components/common/BackButton.tsx`

**2 variants** :

#### Icon (défaut)

```tsx
<BackButton
  onPress={() => router.back()}
  variant="icon"
  size="medium" // ou "large"
/>
```

**Affichage** : Cercle blanc avec flèche "←" (64x64dp minimum)

---

#### Text

```tsx
<BackButton
  onPress={() => router.push('/')}
  variant="text"
  label="Menu"
/>
```

**Affichage** : Bouton rectangulaire bleu avec "← Menu"

---

### 3. ScreenBackground

**Emplacement** : `src/components/common/ScreenBackground.tsx`

**4 variants** :

```tsx
// Variant ludique (décorations animées)
<ScreenBackground variant="playful" showDecorations={true}>
  {children}
</ScreenBackground>

// Variant neutre (fond crème apaisant)
<ScreenBackground variant="neutral">
  {children}
</ScreenBackground>

// Variant parent (sobre)
<ScreenBackground variant="parent">
  {children}
</ScreenBackground>

// Variant transparent (pour layouts custom)
<ScreenBackground variant="transparent">
  {children}
</ScreenBackground>
```

---

### 4. PageContainer

**Emplacement** : `src/components/common/PageContainer.tsx`

**Wrapper tout-en-un** : SafeArea + Background + Scroll

```tsx
<PageContainer
  variant="playful"
  scrollable={true}
  showDecorations={true}
  safeAreaEdges={['top', 'bottom']}
  contentContainerStyle={{ paddingBottom: 100 }}
>
  {children}
</PageContainer>
```

**Caractéristiques** :
- ✅ SafeAreaView automatique (gère l'encoche iPad/iPhone)
- ✅ Background intégré via variant
- ✅ ScrollView optionnel
- ✅ Padding standardisé

---

## 📱 Patterns par Type de Page

### Pattern 1 : Page Home (Accueil Enfant)

```tsx
import { PageContainer, ScreenHeader } from '@/components/common';
import { theme } from '@/theme';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[
          theme.colors.home.gradients.skyTop,
          theme.colors.home.gradients.grassBottom,
        ]}
        style={{ flex: 1 }}
      >
        {/* Décorations... */}

        <SafeAreaView style={{ flex: 1 }}>
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

          <ScrollView>{/* Contenu... */}</ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
```

---

### Pattern 2 : Page Intro Jeu

```tsx
import { PageContainer, ScreenHeader } from '@/components/common';

export function MathIntroScreen() {
  const router = useRouter();

  return (
    <PageContainer variant="playful" scrollable>
      <ScreenHeader
        variant="game"
        title="MathBlocks"
        emoji="🧮"
        onBack={() => router.push('/')}
        showParentButton
        onParentPress={() => router.push('/(parent)')}
      />

      {/* Contenu du jeu... */}
    </PageContainer>
  );
}
```

---

### Pattern 3 : Page Parent

```tsx
import { PageContainer, ScreenHeader } from '@/components/common';

export default function ParentDashboard() {
  const router = useRouter();

  return (
    <PageContainer variant="parent" scrollable>
      <ScreenHeader
        variant="parent"
        title="Espace Parents"
        onBack={() => router.back()}
      />

      {/* Stats, graphs, etc. */}
    </PageContainer>
  );
}
```

---

## ✅ Guidelines Obligatoires

### 1. Imports

**✅ TOUJOURS utiliser** :
```tsx
import { theme } from '@/theme';
```

**❌ NE JAMAIS utiliser** :
```tsx
import { COLORS } from '@/constants/colors'; // ❌ OBSOLÈTE
import { SPACING } from '@/constants/spacing'; // ❌ OBSOLÈTE
```

---

### 2. Touch Targets (CRITIQUE pour enfants)

**Règle** : Tous les boutons et zones interactives ≥ 64dp

```tsx
// ✅ BON
const styles = StyleSheet.create({
  button: {
    width: theme.touchTargets.child, // 64dp
    height: theme.touchTargets.child,
    minHeight: 64, // ou explicite
  },
});

// ❌ MAUVAIS
const styles = StyleSheet.create({
  button: {
    width: 48, // ❌ Trop petit
    height: 40, // ❌ Trop petit
  },
});
```

---

### 3. Tailles de Texte (CRITIQUE pour enfants)

**Règle** : Texte courant ≥ 18pt (jamais < 16pt)

```tsx
// ✅ BON
const styles = StyleSheet.create({
  body: {
    fontSize: 18, // ✅ Minimum enfant
    ...theme.textStyles.body, // ✅ Utilise les styles du theme
  },
});

// ❌ MAUVAIS
const styles = StyleSheet.create({
  body: {
    fontSize: 14, // ❌ Trop petit pour enfants
  },
});
```

---

### 4. Animations

**Règle** : Utiliser Reanimated avec spring physics

```tsx
// ✅ BON
const scale = useSharedValue(1);

const handlePressIn = () => {
  scale.value = withSpring(0.95, { damping: 10, stiffness: 200 });
};

const handlePressOut = () => {
  scale.value = withSpring(1, { damping: 10, stiffness: 200 });
};

// ❌ MAUVAIS (pas d'animation)
<Pressable onPress={...}>
  <View style={styles.button} />
</Pressable>
```

---

### 5. Polices

**Règle** : Fredoka (titres) + Nunito (corps)

```tsx
// ✅ BON
const styles = StyleSheet.create({
  title: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 32,
  },
  body: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 18,
  },
});

// ❌ MAUVAIS (polices système)
const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold', // ❌ Pas de fontFamily
  },
});
```

---

## 🔄 Migration depuis l'ancien code

### Avant (ancien code)

```tsx
import { COLORS } from '@/constants/colors';
import { SPACING } from '@/constants/spacing';

export function OldScreen() {
  return (
    <ScrollView style={{ backgroundColor: COLORS.background }}>
      <View style={{ paddingHorizontal: SPACING.lg }}>
        <Pressable onPress={...} style={{ backgroundColor: COLORS.primary }}>
          <Text style={{ fontSize: 14, color: COLORS.white }}>
            Retour
          </Text>
        </Pressable>

        <Text style={{ fontSize: 32, color: COLORS.textDark }}>
          Titre du Jeu
        </Text>

        {/* ... */}
      </View>
    </ScrollView>
  );
}
```

### Après (nouveau code)

```tsx
import { theme } from '@/theme';
import { PageContainer, ScreenHeader } from '@/components/common';

export function NewScreen() {
  return (
    <PageContainer variant="playful" scrollable>
      <ScreenHeader
        variant="game"
        title="Titre du Jeu"
        emoji="🎮"
        onBack={() => router.back()}
        showParentButton
        onParentPress={() => router.push('/(parent)')}
      />

      {/* ... */}
    </PageContainer>
  );
}
```

---

## 📸 Exemples Complets

### Exemple 1 : Écran Intro Jeu (MathBlocks)

```tsx
/**
 * MathBlocks Intro Screen
 * ✅ Utilise les composants standardisés
 */

import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/theme';
import { PageContainer, ScreenHeader } from '@/components/common';

export function MathIntroScreen() {
  const router = useRouter();

  return (
    <PageContainer variant="playful" scrollable>
      {/* Header standardisé ✅ */}
      <ScreenHeader
        variant="game"
        title="MathBlocks"
        emoji="🧮"
        onBack={() => router.push('/')}
        showParentButton
        onParentPress={() => router.push('/(parent)')}
      />

      {/* Contenu */}
      <View style={styles.content}>
        <Text style={styles.subtitle}>Calcul Mental</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Comment jouer ?</Text>
          <Text style={styles.instruction}>
            1. Trouve les paires : un calcul et son résultat
          </Text>
          {/* ... */}
        </View>

        <Pressable style={styles.playButton} onPress={...}>
          <Text style={styles.playButtonText}>Jouer</Text>
        </Pressable>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing[6],
  },
  subtitle: {
    ...theme.textStyles.h3,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginVertical: theme.spacing[4],
  },
  card: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing[5],
    marginBottom: theme.spacing[6],
    ...theme.shadows.md,
  },
  cardTitle: {
    ...theme.textStyles.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[3],
  },
  instruction: {
    fontSize: 18, // ✅ ≥ 18pt
    color: theme.colors.text.secondary,
    lineHeight: 26,
    fontFamily: 'Nunito_400Regular',
  },
  playButton: {
    backgroundColor: theme.colors.secondary.main,
    paddingVertical: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    minHeight: theme.touchTargets.child, // ✅ 64dp minimum
    justifyContent: 'center',
  },
  playButtonText: {
    ...theme.textStyles.button,
    color: theme.colors.text.inverse,
  },
});
```

---

## 🎯 Checklist Validation Page

Avant de commit, vérifier :

- [ ] ✅ Utilise `import { theme } from '@/theme'`
- [ ] ✅ Pas d'imports de `/constants/colors` ou `/constants/spacing`
- [ ] ✅ Header utilise `<ScreenHeader />` ou équivalent
- [ ] ✅ Background utilise `<ScreenBackground />` ou `<PageContainer />`
- [ ] ✅ Tous les boutons ≥ 64x64dp
- [ ] ✅ Tout le texte ≥ 18pt (sauf badges 12-14pt)
- [ ] ✅ Polices : Fredoka (titres) + Nunito (corps)
- [ ] ✅ Animations spring avec Reanimated
- [ ] ✅ SafeAreaView présent
- [ ] ✅ Feedback visuel immédiat sur tous les taps

---

## 🌲 Patterns V10 - Forêt Immersive

La version V10 de l'écran d'accueil introduit une expérience immersive avec une forêt animée.

### ForestBackgroundV10

**Emplacement** : `src/components/home-v10/ForestBackgroundV10.tsx`

**Composition en couches** (du fond vers l'avant) :
1. `Sky` - Gradient de ciel
2. `Sun` - Soleil animé avec pulse
3. `MountainsFar` - Montagnes lointaines
4. `Clouds` - Nuages animés
5. `MountainsNear` - Montagnes proches
6. `Hills` - Collines
7. `Trees` - Arbres
8. `Bushes` - Buissons
9. `Garden` - Jardin de progression
10. Animaux : `Birds`, `Butterflies`, `Squirrel`, `Rabbit`, `Bee`, `Ladybug`

```tsx
import { ForestBackgroundV10 } from '@/components/home-v10';

export function HomeScreenV10() {
  return (
    <ForestBackgroundV10>
      <SafeAreaView style={{ flex: 1 }}>
        <HomeHeaderV10 />
        {/* Contenu... */}
      </SafeAreaView>
    </ForestBackgroundV10>
  );
}
```

**Caractéristiques** :
- ✅ Respecte `useReducedMotion()` pour l'accessibilité
- ✅ Performances optimisées avec `memo`
- ✅ Responsive (utilise `useWindowDimensions`)

---

### HomeHeaderV10

**Emplacement** : `src/components/home-v10/HomeHeaderV10.tsx`

```tsx
<HomeHeaderV10
  childName="Emma"
  avatarEmoji="🦊"
  level={5}
  onAvatarPress={() => {}}
  onParentPress={() => router.push('/(parent)')}
/>
```

---

### GameCardV10

**Emplacement** : `src/components/home-v10/GameCardV10.tsx`

Carte de jeu avec style "nature" intégré à la forêt.

```tsx
<GameCardV10
  game={gameMetadata}
  onPress={() => router.push(game.route)}
  stars={3}
  isNew={false}
/>
```

---

### Widgets Flottants V10

**CollectionFloating** et **PiouFloating** : widgets flottants positionnés dans le paysage.

```tsx
<PiouFloating
  message="Bonjour ! Prêt pour une aventure ?"
  onPress={() => {}}
/>

<CollectionFloating
  totalCards={42}
  unlockedCards={12}
  onPress={() => router.push('/(games)/collection')}
/>
```

---

### Palette de couleurs V10

**Emplacement** : `src/theme/home-v10-colors.ts`

```typescript
import { homeV10Colors } from '@/theme/home-v10-colors';

// Utilisation
backgroundColor: homeV10Colors.sky.top
mountainColor: homeV10Colors.mountains.far
grassColor: homeV10Colors.grass.light
```

---

## 🚀 Pour Aller Plus Loin

### Patterns déjà standardisés

- [x] **GameModal** - Modale standardisée (`src/components/common/GameModal.tsx`)
- [x] **VictoryCard** - Carte de victoire (`src/components/common/VictoryCard.tsx`)
- [ ] **TransitionAnimations** - Transitions de pages cohérentes
- [ ] **FeedbackToast** - Messages de feedback standardisés

### Migration V9 → V10

Pour migrer un écran de V9 vers V10 :

1. Remplacer `<ScreenBackground variant="playful">` par `<ForestBackgroundV10>`
2. Remplacer `<HomeHeaderV9>` par `<HomeHeaderV10>`
3. Remplacer `<GameCardV9>` par `<GameCardV10>`
4. Utiliser les couleurs de `home-v10-colors.ts`

---

*Document vivant - Mise à jour continue avec l'évolution du projet*
*Dernière mise à jour : Décembre 2024*
