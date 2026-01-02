# 🚨 RÈGLES OBLIGATOIRES CLAUDE CODE — Hello Guys

> **LIRE EN PREMIER AVANT TOUTE MODIFICATION DE CODE**
> Ce fichier est la **SOURCE DE VÉRITÉ** pour les règles de code.

---

## ⛔ RÈGLE ABSOLUE #1 : NE JAMAIS RECRÉER

### Composants INTERDITS à recréer

**AVANT de créer TOUT composant UI, VÉRIFIE** `src/components/common/` :

```
src/components/common/
├── BackButton.tsx        ← Tout bouton retour
├── Button.tsx            ← Tous les boutons
├── IconButton.tsx        ← Boutons icônes
├── ScreenHeader.tsx      ← Tous les headers (3 variants)
├── ScreenBackground.tsx  ← Tous les fonds
├── PageContainer.tsx     ← Wrapper toute page
├── GameModal.tsx         ← Toutes les modales
├── VictoryCard.tsx       ← Tous les écrans victoire
├── ParentGate.tsx        ← Protection parentale
├── GameIntroTemplate.tsx ← Écrans intro jeux
├── MascotBubble.tsx      ← Bulles dialogue mascotte
├── HintButton.tsx        ← Boutons indice
├── Confetti.tsx          ← Animations célébration
├── ProgressIndicator.tsx ← Indicateurs progression
└── PetalsIndicator.tsx   ← Indicateur pétales
```

> **Props détaillées de chaque composant** → `UI_COMPONENTS_CATALOG.md`

### ❌ INTERDIT

```tsx
// ❌ Créer son propre bouton retour
<Pressable onPress={goBack} style={styles.myBackButton}>
  <Text>←</Text>
</Pressable>

// ❌ Créer son propre header
<View style={styles.customHeader}>
  <Text style={styles.title}>Mon Jeu</Text>
</View>

// ❌ Créer son propre fond
<View style={{ flex: 1, backgroundColor: '#E8F4FC' }}>

// ❌ Importer depuis /constants/ (DEPRECATED)
import { Colors } from '@/constants/theme';

// ❌ Hardcoder des emojis
<Text>🎮</Text>
```

### ✅ OBLIGATOIRE

```tsx
// ✅ Utiliser les composants existants
import { 
  BackButton, 
  ScreenHeader, 
  PageContainer,
  GameModal,
  MascotBubble,
  HintButton
} from '@/components/common';

// ✅ Importer depuis /theme/
import { theme } from '@/theme';

// ✅ Utiliser les icônes centralisées
import { Icons } from '@/constants/icons';
<Text>{Icons.game}</Text>
```

---

## ⛔ RÈGLE ABSOLUE #2 : STRUCTURE DE PAGE STANDARDISÉE

### Template obligatoire pour TOUT nouvel écran

```tsx
// src/games/[jeu]/screens/[Nom]Screen.tsx

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

// ⚠️ IMPORTS OBLIGATOIRES
import { PageContainer, ScreenHeader, GameModal } from '@/components/common';
import { theme } from '@/theme';
import { Icons } from '@/constants/icons';

export default function NomScreen() {
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
        {/* CONTENU DU JEU */}
      </View>

      <GameModal
        visible={showHelp}
        onClose={() => setShowHelp(false)}
        variant="info"
        title="Comment jouer"
        emoji={Icons.help}
        content="Instructions..."
        buttons={[{ 
          label: 'Compris !', 
          onPress: () => setShowHelp(false), 
          variant: 'primary' 
        }]}
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

---

## ⛔ RÈGLE ABSOLUE #3 : TOKENS DU THEME UNIQUEMENT

> **Référence complète des tokens** → `DESIGN_SYSTEM.md`

### Valeurs hardcodées INTERDITES

```tsx
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8F4FC',     // Couleur en dur
    padding: 16,                     // Spacing en dur
    borderRadius: 12,                // Border radius en dur
    fontSize: 18,                    // Font size en dur
    fontFamily: 'Nunito',           // Font family en dur
  },
});
```

### Tokens du theme OBLIGATOIRES

```tsx
import { theme } from '@/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
  },
  text: {
    fontSize: theme.fontSize.lg,        // 18pt minimum
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.text.primary,
  },
});
```

### Tokens les plus utilisés

```typescript
// COULEURS
theme.colors.primary.main        // #4A90D9
theme.colors.secondary.main      // #F5A623
theme.colors.feedback.success    // #48BB78
theme.colors.feedback.error      // #F56565
theme.colors.feedback.warning    // #ECC94B
theme.colors.background.primary  // #E8F4FC
theme.colors.background.card     // #FFFFFF
theme.colors.text.primary        // #2D3748

// ESPACEMENTS
theme.spacing[1]   // 4
theme.spacing[2]   // 8
theme.spacing[3]   // 12
theme.spacing[4]   // 16
theme.spacing[6]   // 24
theme.spacing[8]   // 32

// TYPOGRAPHIE
theme.fontSize.sm    // 14
theme.fontSize.base  // 16
theme.fontSize.lg    // 18 (minimum texte courant)
theme.fontSize.xl    // 24
theme.fontSize['2xl'] // 32

// POLICES
theme.fontFamily.regular  // Nunito_400Regular
theme.fontFamily.bold     // Nunito_700Bold
theme.fontFamily.display  // Fredoka_600SemiBold (titres)
theme.fontFamily.title    // FredokaOne-Regular (gros titres)

// TOUCH TARGETS
theme.touchTargets.child     // 64 (minimum enfant)
theme.touchTargets.minimum   // 44
```

---

## ⛔ RÈGLE ABSOLUE #4 : CONTRAINTES ENFANT

| Contrainte | Valeur | Raison |
|------------|--------|--------|
| Touch targets | ≥ **64dp** | Petites mains, motricité en développement |
| Texte courant | ≥ **18pt** | Lisibilité, accessibilité |
| Texte badges | ≥ **12pt** | Exception pour éléments secondaires |
| Polices | Explicites | Pas de font system par défaut |
| Navigation | ≤ **3 niveaux** | Simplicité |
| Feedback erreur | **Jamais punitif** | Bienveillance |

### Vérification touch targets

```tsx
// ✅ BON
const styles = StyleSheet.create({
  button: {
    minWidth: theme.touchTargets.child,  // 64dp
    minHeight: theme.touchTargets.child, // 64dp
  },
});

// ❌ MAUVAIS
const styles = StyleSheet.create({
  button: {
    width: 48,  // Trop petit
    height: 40, // Trop petit
  },
});
```

---

## ⛔ RÈGLE ABSOLUE #5 : ICÔNES CENTRALISÉES

> **Source de vérité** → `src/constants/icons.ts` (consulter le code)

### ❌ INTERDIT

```tsx
// ❌ Emoji hardcodé
<Text>🎮</Text>
<GameCard emoji="🧩" />
const message = `Bravo ! 🏆`;
```

### ✅ OBLIGATOIRE

```tsx
import { Icons } from '@/constants/icons';

// ✅ Utiliser Icons.xxx
<Text>{Icons.game}</Text>
<GameCard emoji={Icons.puzzle} />
const message = `Bravo ! ${Icons.trophy}`;
```

### Icônes les plus utilisées

```typescript
// Navigation
Icons.home, Icons.back, Icons.settings

// Récompenses
Icons.star, Icons.trophy, Icons.sparkles, Icons.medal

// Jeux
Icons.puzzle, Icons.brain, Icons.math, Icons.hanoi

// Mascottes
Icons.owl, Icons.robot, Icons.squirrel

// Feedback
Icons.success, Icons.error, Icons.warning, Icons.hint
```

---

## ⛔ RÈGLE ABSOLUE #6 : ACCESSIBILITÉ

### Props obligatoires sur éléments interactifs

```tsx
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

### Structure
- [ ] `PageContainer` utilisé comme wrapper racine
- [ ] `ScreenHeader` utilisé (variant correct)
- [ ] Aucun import depuis `/constants/` (utiliser `/theme/`)

### Styles
- [ ] Aucune couleur hardcodée (#XXX) → utiliser `theme.colors`
- [ ] Aucun spacing hardcodé → utiliser `theme.spacing`
- [ ] Aucune police sans fontFamily explicite

### Enfant
- [ ] Touch targets ≥ 64dp
- [ ] Texte courant ≥ 18pt
- [ ] Feedback visuel sur toute interaction
- [ ] Pas de feedback punitif

### Composants
- [ ] Aucun composant interdit recréé
- [ ] `GameModal` utilisé (pas de modale custom)
- [ ] `MascotBubble` pour dialogues mascotte
- [ ] Icônes via `Icons.xxx` (pas d'emoji hardcodé)

### Accessibilité
- [ ] `accessibilityLabel` sur éléments interactifs

---

## 🔧 COMMANDES VÉRIFICATION

```bash
# Trouver les imports obsolètes
grep -r "from '@/constants" src/

# Trouver les couleurs hardcodées
grep -rn "#[A-Fa-f0-9]\{6\}" src/ --include="*.tsx"

# Trouver les emojis hardcodés (approximatif)
grep -rn "['\"]\p{Emoji}" src/ --include="*.tsx"
```

---

## 📚 RESSOURCES

### Documentation (règles stables)

| Document | Contenu |
|----------|---------|
| `DESIGN_SYSTEM.md` | Tokens (couleurs, typo, spacing) |
| `UI_COMPONENTS_CATALOG.md` | Props des composants |
| `GAME_ARCHITECTURE.md` | Pattern Hook+Template |

### Code source (état actuel)

| Fichier | Consulter pour |
|---------|----------------|
| `src/constants/icons.ts` | Liste des icônes disponibles |
| `src/games/registry.ts` | Liste des jeux et leur statut |
| `src/games/*/components/*Mascot.tsx` | Mascottes implémentées |
| `src/components/common/` | Composants UI disponibles |
| `src/store/slices/` | Slices Zustand |

---

*Ce fichier doit être LU EN PREMIER par Claude Code à chaque session.*
