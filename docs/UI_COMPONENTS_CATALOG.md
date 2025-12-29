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

---

## 🎮 GameIntroTemplate ⭐ NOUVEAU

> **Template unifié pour tous les écrans d'introduction de jeux**

### Import

```tsx
import { GameIntroTemplate, LevelConfig } from '@/components/common';
```

### Architecture à 2 vues

| Vue | Description | Éléments |
|-----|-------------|----------|
| **SELECTION** | L'enfant choisit son niveau | Header, grille niveaux, mascotte centrale, bouton "C'est parti !" |
| **PLAY** | L'enfant joue | Header, panneau progression, mascotte latérale, zone de jeu, boutons flottants |

### Props principales

```tsx
interface GameIntroTemplateProps {
  // Header
  title: string;
  emoji: string;
  onBack: () => void;
  onParentPress?: () => void;
  onHelpPress?: () => void;
  showParentButton?: boolean;
  showHelpButton?: boolean;

  // Niveaux
  levels: LevelConfig[];
  selectedLevel: LevelConfig | null;
  onSelectLevel: (level: LevelConfig) => void;
  renderLevelCard?: (level: LevelConfig, isSelected: boolean) => ReactNode;
  levelColumns?: number;

  // Mode entraînement
  showTrainingMode?: boolean;
  trainingConfig?: TrainingConfig;
  onTrainingPress?: () => void;
  isTrainingMode?: boolean;

  // Zone de jeu
  renderGame: () => ReactNode;
  isPlaying: boolean;
  onStartPlaying?: () => void;

  // Progression
  renderProgress?: () => ReactNode;

  // Mascotte
  mascotComponent?: ReactNode;
  mascotMessage?: string;
  mascotMessageType?: 'intro' | 'hint' | 'error' | 'encourage' | 'victory';

  // Boutons flottants
  showResetButton?: boolean;
  onReset?: () => void;
  showHintButton?: boolean;
  onHint?: () => void;
  hintsRemaining?: number;
  hintsDisabled?: boolean;
  showForceCompleteButton?: boolean;
  onForceComplete?: () => void;

  // Victoire
  isVictory?: boolean;
  victoryComponent?: ReactNode;

  // Bouton jouer
  showPlayButton?: boolean;
  playButtonText?: string;
  playButtonEmoji?: string;
}
```

### Usage standard

```tsx
export default function MonJeuIntroScreen() {
  const intro = useMonJeuIntro(); // Hook orchestrateur

  const renderGame = useCallback(() => (
    <MonJeuGameArea {...intro} />
  ), [intro]);

  return (
    <GameIntroTemplate
      // Header
      title="Mon Super Jeu"
      emoji="🎮"
      onBack={intro.handleBack}
      onParentPress={intro.handleParentPress}
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
        <MonJeuMascot
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

### Helpers exportés

```tsx
// Calcule les niveaux débloqués selon l'âge
calculateLevelsForAge(age: number): number

// Génère une config de niveaux par défaut
generateDefaultLevels(count?: number): LevelConfig[]

// Configuration d'animation par défaut
DEFAULT_ANIMATION_CONFIG: IntroAnimationConfig
```

---

## 💬 MascotBubble ⭐ NOUVEAU

> **Bulle de dialogue style panneau bois pour les mascottes**

### Import

```tsx
import { MascotBubble, bubbleTextStyles } from '@/components/common';
```

### Props

```tsx
interface MascotBubbleProps {
  /** Message (texte ou JSX avec highlights) */
  message: React.ReactNode;
  /** Texte du bouton CTA */
  buttonText?: string;
  /** Icône emoji du bouton */
  buttonIcon?: string;
  /** Callback au press */
  onPress?: () => void;
  /** Couleur du bouton */
  buttonVariant?: 'orange' | 'blue' | 'green';
  /** Décorations (gland, champignon, feuille) */
  showDecorations?: boolean;
  /** Sparkles animés */
  showSparkles?: boolean;
  /** Position de la queue */
  tailPosition?: 'left' | 'right' | 'bottom' | 'top';
  /** Masquer la queue */
  hideTail?: boolean;
  /** Largeur max (défaut: 380) */
  maxWidth?: number;
  /** Effet frappe progressive */
  typing?: boolean;
  /** Vitesse frappe ms/caractère (défaut: 25) */
  typingSpeed?: number;
  /** Callback fin de frappe */
  onTypingComplete?: () => void;
}
```

### Usage basique

```tsx
<MascotBubble
  message="Bonjour ! Prêt à jouer ?"
  buttonText="C'est parti !"
  onPress={() => startGame()}
/>
```

### Avec highlights

```tsx
import { MascotBubble, bubbleTextStyles } from '@/components/common';

<MascotBubble
  message={
    <>
      Tu es à <Text style={bubbleTextStyles.highlightOrange}>2 niveaux</Text> du rang{' '}
      <Text style={bubbleTextStyles.highlightGold}>Or</Text> !
    </>
  }
  buttonText="C'est parti !"
  buttonIcon="🎯"
  onPress={handleStart}
  showDecorations
  showSparkles
/>
```

### Avec effet typewriter

```tsx
<MascotBubble
  message="Analyse du pattern en cours..."
  typing
  typingSpeed={30}
  onTypingComplete={() => setReady(true)}
  tailPosition="left"
/>
```

---

## 💡 HintButton ⭐ NOUVEAU

> **Bouton d'indices animé avec indicateur de restants**

### Import

```tsx
import { HintButton } from '@/components/common';
```

### Props

```tsx
interface HintButtonProps {
  /** Indices restants (requis) */
  hintsRemaining: number;
  /** Maximum d'indices (défaut: 3) */
  maxHints?: number;
  /** Callback au clic (requis) */
  onPress: () => void;
  /** Désactivé */
  disabled?: boolean;
  /** Taille */
  size?: 'small' | 'medium' | 'large';
  /** Schéma de couleur */
  colorScheme?: 'orange' | 'blue' | 'green' | 'purple';
  /** Afficher label texte */
  showLabel?: boolean;
  /** Position du label */
  labelPosition?: 'right' | 'bottom';
  /** Texte label personnalisé */
  customLabel?: string;
  /** Icône (défaut: '💡') */
  icon?: string;
  /** Désactiver vibrations */
  disableHaptics?: boolean;
}
```

### Usage

```tsx
// Standard
<HintButton
  hintsRemaining={3}
  maxHints={3}
  onPress={handleHint}
/>

// Compact avec couleur
<HintButton
  hintsRemaining={2}
  maxHints={3}
  onPress={handleHint}
  size="small"
  colorScheme="blue"
/>

// Avec label
<HintButton
  hintsRemaining={1}
  maxHints={3}
  onPress={handleHint}
  showLabel
  labelPosition="right"
/>
```

---

## 🎊 Confetti ⭐ NOUVEAU

> **Animation de confettis pour les célébrations**

### Import

```tsx
import { Confetti } from '@/components/common';
```

### Usage

```tsx
<Confetti
  active={showVictory}
  count={50}
  duration={3000}
/>
```

---

## 🃏 CardFlip ⭐ NOUVEAU

> **Animation de retournement de carte**

### Import

```tsx
import { CardFlip } from '@/components/common';
```

### Usage

```tsx
<CardFlip
  isFlipped={cardFlipped}
  frontContent={<CardFront />}
  backContent={<CardBack />}
  duration={300}
/>
```

---

## 📊 ProgressIndicator ⭐ NOUVEAU

> **Indicateur de progression avec statistiques**

### Import

```tsx
import { ProgressIndicator } from '@/components/common';
```

### Usage

```tsx
<ProgressIndicator
  current={5}
  total={10}
  label="Niveau"
  showPercentage
/>
```

---

## 🎮 GameActionButtons ⭐ NOUVEAU

> **Groupe de boutons d'actions de jeu (reset, hint, etc.)**

### Import

```tsx
import { GameActionButtons } from '@/components/common';
```

### Usage

```tsx
<GameActionButtons
  onReset={handleReset}
  onHint={handleHint}
  hintsRemaining={2}
  showForceComplete={isDev}
  onForceComplete={handleForceComplete}
/>
```

---

## 📈 PerformanceStats ⭐ NOUVEAU

> **Affichage des statistiques de performance**

### Import

```tsx
import { PerformanceStats } from '@/components/common';
```

### Usage

```tsx
<PerformanceStats
  moves={15}
  optimalMoves={7}
  timeElapsed={125}
  hintsUsed={2}
/>
```

---

## 🏆 VictoryOverlayBase ⭐ NOUVEAU

> **Base pour les overlays de victoire personnalisés**

### Import

```tsx
import { VictoryOverlayBase } from '@/components/common';
```

### Usage

```tsx
<VictoryOverlayBase
  visible={isVictory}
  onClose={handleClose}
>
  <CustomVictoryContent />
</VictoryOverlayBase>
```

---

## 🔒 ParentGate ⭐ NOUVEAU

> **Protection d'accès parental**

### Import

```tsx
import { ParentGate } from '@/components/common';
```

### Usage

```tsx
<ParentGate
  onSuccess={() => router.push('/(parent)')}
  onCancel={() => setShowGate(false)}
/>
```

---

## 🖼️ ScreenBackground ⭐ NOUVEAU

> **Fond d'écran avec variantes**

### Import

```tsx
import { ScreenBackground } from '@/components/common';
```

### Variantes

```tsx
// Fond ludique
<ScreenBackground variant="playful" />

// Fond neutre
<ScreenBackground variant="neutral" />

// Fond parent
<ScreenBackground variant="parent" />

// Transparent (custom)
<ScreenBackground variant="transparent" />
```
