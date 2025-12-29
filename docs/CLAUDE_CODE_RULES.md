# 🚨 RÈGLES OBLIGATOIRES CLAUDE CODE — Hello Guys

> **LIRE EN PREMIER AVANT TOUTE MODIFICATION DE CODE**
> Ce fichier définit les règles NON-NÉGOCIABLES pour maintenir l'homogénéité UI.

---

## ⛔ RÈGLE ABSOLUE #1 : NE JAMAIS RECRÉER

### Composants INTERDITS à recréer

**AVANT de créer TOUT composant UI, VÉRIFIE ces chemins :**

```
src/components/common/
├── BackButton.tsx        ← UTILISER pour tout bouton retour
├── Button.tsx            ← UTILISER pour tous les boutons
├── IconButton.tsx        ← UTILISER pour boutons icônes
├── ScreenHeader.tsx      ← UTILISER pour tous les headers (3 variants)
├── ScreenBackground.tsx  ← UTILISER pour tous les fonds
├── PageContainer.tsx     ← UTILISER pour wrapper toute page
├── GameModal.tsx         ← UTILISER pour toutes les modales
├── VictoryCard.tsx       ← UTILISER pour tous les écrans victoire
└── ParentGate.tsx        ← UTILISER pour protection parentale
```

### ❌ INTERDIT

```tsx
// ❌ INTERDIT - Créer son propre bouton retour
<Pressable onPress={goBack} style={styles.myBackButton}>
  <Text>←</Text>
</Pressable>

// ❌ INTERDIT - Créer son propre header
<View style={styles.customHeader}>
  <Text style={styles.title}>Mon Jeu</Text>
</View>

// ❌ INTERDIT - Créer son propre fond
<View style={{ flex: 1, backgroundColor: '#FFF9F0' }}>

// ❌ INTERDIT - Importer depuis /constants/ (DEPRECATED)
import { Colors } from '@/constants/theme';
```

### ✅ OBLIGATOIRE

```tsx
// ✅ CORRECT - Utiliser les composants existants
import { 
  BackButton, 
  ScreenHeader, 
  PageContainer,
  GameModal 
} from '@/components/common';

// ✅ CORRECT - Importer depuis /theme/
import { theme, colors, typography, spacing } from '@/theme';
```

---

## ⛔ RÈGLE ABSOLUE #2 : STRUCTURE DE PAGE STANDARDISÉE

### Template obligatoire pour TOUT nouvel écran

```tsx
// src/games/[jeu]/screens/[Nom]Screen.tsx

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

// ⚠️ IMPORTS OBLIGATOIRES - NE PAS CHANGER
import { PageContainer, ScreenHeader, GameModal } from '@/components/common';
import { theme } from '@/theme';

export default function [Nom]Screen() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);

  return (
    // ⚠️ WRAPPER OBLIGATOIRE
    <PageContainer variant="playful" scrollable={false}>
      
      {/* ⚠️ HEADER OBLIGATOIRE - variant="game" pour écrans de jeu */}
      <ScreenHeader
        variant="game"
        title="Nom du Jeu"
        emoji="🎮"
        onBack={() => router.back()}
        showParentButton
        onParentPress={() => router.push('/(parent)')}
        showHelpButton
        onHelpPress={() => setShowHelp(true)}
      />

      {/* CONTENU DU JEU */}
      <View style={styles.content}>
        {/* ... */}
      </View>

      {/* MODALE AIDE - SI NÉCESSAIRE */}
      <GameModal
        visible={showHelp}
        onClose={() => setShowHelp(false)}
        variant="info"
        title="Comment jouer"
        emoji="❓"
        content="Instructions..."
        buttons={[{ label: 'Compris !', onPress: () => setShowHelp(false), variant: 'primary' }]}
      />
    </PageContainer>
  );
}

// ⚠️ STYLES AVEC THEME UNIQUEMENT
const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: theme.spacing[4],
    // ❌ JAMAIS : padding: 16,
    // ✅ TOUJOURS : padding: theme.spacing[4],
  },
});
```

---

## ⛔ RÈGLE ABSOLUE #3 : TOKENS DU THEME UNIQUEMENT

### ❌ INTERDIT - Valeurs hardcodées

```tsx
// ❌ INTERDIT
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF9F0',     // ❌ Couleur en dur
    padding: 16,                     // ❌ Spacing en dur
    borderRadius: 12,                // ❌ Border radius en dur
    fontSize: 18,                    // ❌ Font size en dur
    fontFamily: 'Nunito',           // ❌ Font family en dur
  },
});
```

### ✅ OBLIGATOIRE - Tokens du theme

```tsx
import { theme } from '@/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.main,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
  },
  text: {
    fontSize: theme.fontSize.lg,        // 18pt
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.text.primary,
  },
});
```

### Référence rapide des tokens

```typescript
// COULEURS
theme.colors.primary.main        // #5B8DEE - Bleu principal
theme.colors.secondary.main      // #FFB347 - Orange secondaire
theme.colors.feedback.success    // #7BC74D - Vert succès
theme.colors.feedback.error      // #E57373 - Rouge erreur
theme.colors.background.main     // #FFF9F0 - Fond crème
theme.colors.background.card     // #FFFFFF - Cartes
theme.colors.text.primary        // #2D3748 - Texte principal
theme.colors.text.secondary      // #4A5568 - Texte secondaire

// ESPACEMENTS
theme.spacing[1]   // 4
theme.spacing[2]   // 8
theme.spacing[3]   // 12
theme.spacing[4]   // 16
theme.spacing[5]   // 20
theme.spacing[6]   // 24
theme.spacing[8]   // 32
theme.spacing[10]  // 40

// TYPOGRAPHIE - POLICES
theme.fontFamily.regular         // 'Nunito_400Regular'
theme.fontFamily.medium          // 'Nunito_600SemiBold'
theme.fontFamily.semiBold        // 'Nunito_600SemiBold'
theme.fontFamily.bold            // 'Nunito_700Bold'
theme.fontFamily.display         // 'Fredoka_600SemiBold' (titres)
theme.fontFamily.title           // 'FredokaOne-Regular' (grands titres)

// TYPOGRAPHIE - TAILLES
theme.fontSize.xs                // 12
theme.fontSize.sm                // 14
theme.fontSize.base              // 16
theme.fontSize.lg                // 18 (minimum enfant)
theme.fontSize.xl                // 24
theme.fontSize['2xl']            // 32
theme.fontSize['3xl']            // 40

// TYPOGRAPHIE - STYLES PRÉDÉFINIS (spreader)
...theme.textStyles.body         // Style complet pour texte courant
...theme.textStyles.h1           // Style complet pour titre H1
...theme.textStyles.button       // Style complet pour boutons

// BORDER RADIUS
theme.borderRadius.sm            // 8
theme.borderRadius.md            // 12
theme.borderRadius.lg            // 16
theme.borderRadius.xl            // 24
theme.borderRadius.round         // 9999

// TOUCH TARGETS (CRITIQUE ENFANT)
theme.touchTargets.child         // 64 - MINIMUM pour enfants
theme.touchTargets.adult         // 48
theme.touchTargets.large         // 72

// SHADOWS
theme.shadows.sm                 // Ombre légère
theme.shadows.md                 // Ombre moyenne
theme.shadows.lg                 // Ombre forte
```

---

## ⛔ RÈGLE ABSOLUE #4 : CONTRAINTES ENFANT 6-10 ANS

### Touch Targets

```tsx
// ❌ INTERDIT - Trop petit
const styles = StyleSheet.create({
  button: {
    width: 48,  // ❌ < 64dp
    height: 40, // ❌ < 64dp
  },
});

// ✅ OBLIGATOIRE - 64dp minimum
const styles = StyleSheet.create({
  button: {
    minWidth: theme.touchTargets.child,  // 64dp
    minHeight: theme.touchTargets.child, // 64dp
  },
});
```

### Tailles de texte

```tsx
// ❌ INTERDIT - Trop petit pour lecture enfant
fontSize: 14, // ❌
fontSize: 12, // ❌

// ✅ OBLIGATOIRE - 18pt minimum pour texte courant
fontSize: theme.fontSize.lg, // 18pt ✅

// ⚠️ EXCEPTION : badges, labels courts peuvent être 12-14pt
```

### Polices

```tsx
// ❌ INTERDIT - System fonts
fontFamily: 'System',
fontFamily: undefined,

// ✅ OBLIGATOIRE - Polices explicites
fontFamily: theme.fontFamily.display,  // Fredoka (titres)
fontFamily: theme.fontFamily.regular,  // Nunito (corps)
```

---

## ⛔ RÈGLE ABSOLUE #5 : ANIMATIONS AVEC REANIMATED

### Configuration Spring standard

```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

// ⚠️ CONFIG SPRING STANDARD - NE PAS MODIFIER
const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
};

// ✅ UTILISATION
scale.value = withSpring(1, SPRING_CONFIG);

// ❌ INTERDIT - Animations sans spring pour UI interactive
scale.value = withTiming(1); // ❌ Pas de spring
```

### Pattern bouton animé standard

```tsx
const ButtonAnimated: React.FC<Props> = ({ onPress, children }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </Pressable>
  );
};
```

---

## ⛔ RÈGLE ABSOLUE #6 : ACCESSIBILITÉ

### Props obligatoires sur éléments interactifs

```tsx
// ✅ OBLIGATOIRE sur tout Pressable/TouchableOpacity
<Pressable
  onPress={handlePress}
  accessible={true}
  accessibilityLabel="Description de l'action"
  accessibilityRole="button"
  accessibilityHint="Ce qui va se passer"
>
```

---

## 📋 CHECKLIST AVANT COMMIT

Avant de soumettre du code, vérifier :

### Structure
- [ ] `PageContainer` utilisé comme wrapper racine
- [ ] `ScreenHeader` utilisé (variant correct)
- [ ] Aucun import depuis `/constants/` (utiliser `/theme/`)

### Styles
- [ ] Aucune couleur hardcodée (#XXX) → utiliser `theme.colors`
- [ ] Aucun spacing hardcodé (16, 24...) → utiliser `theme.spacing`
- [ ] Aucune police sans fontFamily explicite

### Enfant
- [ ] Touch targets ≥ 64dp
- [ ] Texte courant ≥ 18pt
- [ ] Feedback visuel sur toute interaction

### Composants
- [ ] `BackButton` utilisé (pas de bouton retour custom)
- [ ] `GameModal` utilisé (pas de modale custom)
- [ ] `Button` utilisé (pas de bouton custom)

---

## 🔧 COMMANDES UTILES

### Vérifier les imports obsolètes

```bash
# Trouver les imports depuis /constants/ (deprecated)
grep -r "from '@/constants" src/
grep -r "from '../constants" src/
grep -r "from '../../constants" src/
```

### Vérifier les couleurs hardcodées

```bash
# Trouver les couleurs en dur dans StyleSheet
grep -rn "#[A-Fa-f0-9]\{6\}" src/ --include="*.tsx"
```

---

## 📚 RESSOURCES

- **Design System complet** : `docs/DESIGN_SYSTEM_V2.md`
- **Patterns UI** : `docs/UI_PATTERNS.md`
- **Audit Guidelines** : `docs/GUIDELINES_AUDIT.md`
- **Structure Projet** : `docs/PROJECT_STRUCTURE.md`

---

## ⚠️ EN CAS DE DOUTE

1. **Chercher d'abord** dans `src/components/common/`
2. **Lire** `docs/UI_PATTERNS.md` pour exemples
3. **Demander** avant de créer un nouveau composant

---

*Dernière mise à jour : Décembre 2024*
*Ce fichier doit être LU EN PREMIER par Claude Code à chaque session.*
