# 📦 CATALOGUE COMPOSANTS UI — Hello Guys

> **Copier-coller ces patterns** — Ne JAMAIS recréer ces composants

---

## 🔙 BackButton

### Import

```tsx
import { BackButton } from '@/components/common';
```

### Variantes

```tsx
// Variant ICON (défaut) - Cercle blanc avec flèche
<BackButton
  onPress={() => router.back()}
  variant="icon"
  size="medium"
/>

// Variant TEXT - Bouton rectangulaire avec label
<BackButton
  onPress={() => router.push('/')}
  variant="text"
  label="Menu"
/>

// Variant ICON large
<BackButton
  onPress={() => router.back()}
  variant="icon"
  size="large"
/>
```

---

## 🏠 ScreenHeader

### Import

```tsx
import { ScreenHeader } from '@/components/common';
```

### Variant HOME (accueil enfant)

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

### Variant GAME (écrans de jeu) ⭐ LE PLUS UTILISÉ

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

### Variant PARENT (espace parents)

```tsx
<ScreenHeader
  variant="parent"
  title="Espace Parents"
  onBack={() => router.back()}
/>
```

---

## 📦 PageContainer

### Import

```tsx
import { PageContainer } from '@/components/common';
```

### Variantes de fond

```tsx
// PLAYFUL - Fond ludique avec décorations (jeux enfants)
<PageContainer variant="playful" scrollable={false}>
  {/* contenu */}
</PageContainer>

// NEUTRAL - Fond crème sobre
<PageContainer variant="neutral" scrollable>
  {/* contenu */}
</PageContainer>

// PARENT - Fond sobre pour espace parent
<PageContainer variant="parent" scrollable>
  {/* contenu */}
</PageContainer>

// TRANSPARENT - Pour layouts custom
<PageContainer variant="transparent">
  {/* contenu */}
</PageContainer>
```

---

## 🎮 GameModal

### Import

```tsx
import { GameModal } from '@/components/common';
```

### Variant INFO (règles, aide)

```tsx
const [showHelp, setShowHelp] = useState(false);

<GameModal
  visible={showHelp}
  onClose={() => setShowHelp(false)}
  variant="info"
  title="Comment jouer"
  emoji="❓"
  content="Déplace les disques un par un. Un gros disque ne peut pas aller sur un petit !"
  buttons={[
    { 
      label: 'Compris !', 
      onPress: () => setShowHelp(false), 
      variant: 'primary' 
    }
  ]}
/>
```

### Variant CHOICE (choix utilisateur)

```tsx
<GameModal
  visible={showChoice}
  onClose={() => setShowChoice(false)}
  variant="choice"
  title="Recommencer ?"
  emoji="🔄"
  content="Tu veux recommencer cette partie ?"
  buttons={[
    { 
      label: 'Non, continuer', 
      onPress: () => setShowChoice(false), 
      variant: 'secondary' 
    },
    { 
      label: 'Oui, recommencer', 
      onPress: handleRestart, 
      variant: 'primary' 
    }
  ]}
/>
```

### Variant DEMO (tutoriel animé)

```tsx
<GameModal
  visible={showDemo}
  onClose={() => setShowDemo(false)}
  variant="demo"
  title="Regarde bien !"
  emoji="👀"
  demoContent={<AnimatedDemo />}
  buttons={[
    { 
      label: "J'ai compris !", 
      onPress: () => setShowDemo(false), 
      variant: 'primary' 
    }
  ]}
/>
```

---

## 🏆 VictoryCard

### Import

```tsx
import { VictoryCard } from '@/components/common';
import type { VictoryStats } from '@/components/common';
```

### Usage standard

```tsx
const stats: VictoryStats = {
  moves: 15,
  optimalMoves: 7,
  time: 125, // secondes
  stars: 3,
  isNewRecord: true,
};

<VictoryCard
  visible={gameWon}
  stats={stats}
  levelName="Niveau 1"
  encouragement="Super travail !"
  onNextLevel={() => router.push('/next')}
  onReplay={() => resetGame()}
  onHome={() => router.push('/')}
  showNextButton={true}
/>
```

### Avec badges

```tsx
import type { VictoryBadge } from '@/components/common';

const badges: VictoryBadge[] = [
  { id: 'speed', emoji: '⚡', name: 'Rapide', unlocked: true },
  { id: 'perfect', emoji: '💎', name: 'Parfait', unlocked: stats.stars === 3 },
];

<VictoryCard
  visible={gameWon}
  stats={stats}
  levelName="Niveau 5"
  badges={badges}
  onNextLevel={handleNext}
  onReplay={handleReplay}
  onHome={handleHome}
/>
```

---

## 🔘 Button

### Import

```tsx
import { Button } from '@/components/common';
```

### Variantes

```tsx
// PRIMARY - Action principale
<Button
  title="Jouer"
  onPress={handlePlay}
  variant="primary"
  size="large"
  icon="🎮"
/>

// SECONDARY - Action secondaire
<Button
  title="Plus tard"
  onPress={handleLater}
  variant="secondary"
  size="medium"
/>

// OUTLINE - Action tertiaire
<Button
  title="Annuler"
  onPress={handleCancel}
  variant="outline"
  size="small"
/>

// Avec état loading
<Button
  title="Chargement..."
  onPress={handleLoad}
  loading={isLoading}
  disabled={isLoading}
/>
```

---

## 🔷 IconButton

### Import

```tsx
import { IconButton } from '@/components/common';
```

### Usage

```tsx
// Bouton aide
<IconButton
  icon="❓"
  onPress={() => setShowHelp(true)}
  size={64}
  backgroundColor={theme.colors.secondary.main}
  accessibilityLabel="Aide"
/>

// Bouton paramètres
<IconButton
  icon="⚙️"
  onPress={() => router.push('/settings')}
  size={64}
  backgroundColor={theme.colors.primary.main}
  accessibilityLabel="Paramètres"
/>

// Bouton son
<IconButton
  icon={isMuted ? "🔇" : "🔊"}
  onPress={toggleSound}
  size={48}
  accessibilityLabel={isMuted ? "Activer le son" : "Couper le son"}
/>
```

---

## 📱 Template Écran Complet

### Écran Intro de jeu

```tsx
// src/games/mon-jeu/screens/MonJeuIntroScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  PageContainer, 
  ScreenHeader, 
  GameModal,
  Button 
} from '@/components/common';
import { theme } from '@/theme';

export default function MonJeuIntroScreen() {
  const router = useRouter();
  const [showRules, setShowRules] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const handlePlay = () => {
    if (selectedLevel) {
      router.push(`/games/mon-jeu/play?level=${selectedLevel}`);
    }
  };

  return (
    <PageContainer variant="playful" scrollable={false}>
      <ScreenHeader
        variant="game"
        title="Mon Super Jeu"
        emoji="🎯"
        onBack={() => router.back()}
        showParentButton
        onParentPress={() => router.push('/(parent)')}
        showHelpButton
        onHelpPress={() => setShowRules(true)}
      />

      <View style={styles.content}>
        {/* Sélection niveau */}
        <View style={styles.levelGrid}>
          {[1, 2, 3, 4, 5].map((level) => (
            <Button
              key={level}
              title={`Niveau ${level}`}
              onPress={() => setSelectedLevel(level)}
              variant={selectedLevel === level ? 'primary' : 'outline'}
              size="medium"
            />
          ))}
        </View>

        {/* Bouton jouer */}
        <Button
          title="C'est parti !"
          onPress={handlePlay}
          variant="primary"
          size="large"
          icon="🚀"
          disabled={!selectedLevel}
        />
      </View>

      {/* Modale règles */}
      <GameModal
        visible={showRules}
        onClose={() => setShowRules(false)}
        variant="info"
        title="Les règles"
        emoji="📖"
        content="Voici comment jouer..."
        buttons={[
          { 
            label: 'Compris !', 
            onPress: () => setShowRules(false), 
            variant: 'primary' 
          }
        ]}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[6],
    gap: theme.spacing[8],
  },
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing[4],
  },
});
```

### Écran de jeu

```tsx
// src/games/mon-jeu/screens/MonJeuPlayScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  PageContainer, 
  ScreenHeader, 
  GameModal,
  VictoryCard 
} from '@/components/common';
import { theme } from '@/theme';

export default function MonJeuPlayScreen() {
  const router = useRouter();
  const { level } = useLocalSearchParams<{ level: string }>();
  const [showPause, setShowPause] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const handlePause = () => setShowPause(true);
  const handleResume = () => setShowPause(false);
  const handleQuit = () => router.back();
  const handleReplay = () => {
    setGameWon(false);
    // Reset game logic
  };

  return (
    <PageContainer variant="playful" scrollable={false}>
      <ScreenHeader
        variant="game"
        title={`Niveau ${level}`}
        emoji="🎮"
        onBack={handlePause}
        showParentButton
        onParentPress={() => router.push('/(parent)')}
      />

      <View style={styles.gameArea}>
        {/* Votre logique de jeu ici */}
      </View>

      {/* Modale pause */}
      <GameModal
        visible={showPause}
        onClose={handleResume}
        variant="choice"
        title="Pause"
        emoji="⏸️"
        content="Que veux-tu faire ?"
        buttons={[
          { label: 'Continuer', onPress: handleResume, variant: 'primary' },
          { label: 'Quitter', onPress: handleQuit, variant: 'secondary' },
        ]}
      />

      {/* Victoire */}
      <VictoryCard
        visible={gameWon}
        stats={{ moves: 10, optimalMoves: 7, time: 60, stars: 3 }}
        levelName={`Niveau ${level}`}
        onNextLevel={() => router.push(`/games/mon-jeu/play?level=${Number(level) + 1}`)}
        onReplay={handleReplay}
        onHome={() => router.push('/')}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[4],
  },
});
```

---

## 🎨 Patterns de Style Récurrents

### Card standard

```tsx
const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing[5],
    ...theme.shadows.md,
  },
});
```

### Titre de section

```tsx
const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: theme.typography.sizes.h2,
    fontFamily: theme.typography.fonts.heading,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
  },
});
```

### Texte instruction

```tsx
const styles = StyleSheet.create({
  instruction: {
    fontSize: theme.typography.sizes.body, // 18pt minimum
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 26,
  },
});
```

### Container centré

```tsx
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[6],
  },
});
```

### Grille de boutons

```tsx
const styles = StyleSheet.create({
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing[4],
  },
});
```

### Bouton tactile enfant

```tsx
const styles = StyleSheet.create({
  touchableItem: {
    minWidth: theme.touchTargets.child,  // 64dp
    minHeight: theme.touchTargets.child, // 64dp
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.primary.main,
    ...theme.shadows.sm,
  },
});
```

---

## ⚠️ ANTI-PATTERNS À ÉVITER

### ❌ Ne JAMAIS faire

```tsx
// ❌ Créer son propre header
const MyHeader = () => (
  <View style={styles.header}>
    <Text>Mon Titre</Text>
  </View>
);

// ❌ Couleurs en dur
backgroundColor: '#5B8DEE',

// ❌ Spacing en dur
padding: 16,
marginTop: 24,

// ❌ Touch target trop petit
width: 40,
height: 40,

// ❌ Texte trop petit
fontSize: 14,

// ❌ Import deprecated
import { Colors } from '@/constants/theme';
```

### ✅ Toujours faire

```tsx
// ✅ Utiliser ScreenHeader
<ScreenHeader variant="game" title="Mon Titre" ... />

// ✅ Token couleur
backgroundColor: theme.colors.primary.main,

// ✅ Token spacing
padding: theme.spacing[4],
marginTop: theme.spacing[6],

// ✅ Touch target enfant
minWidth: theme.touchTargets.child,
minHeight: theme.touchTargets.child,

// ✅ Texte lisible
fontSize: theme.typography.sizes.body,

// ✅ Import theme
import { theme } from '@/theme';
```

---

*Ce catalogue doit être consulté AVANT de créer tout composant UI.*
