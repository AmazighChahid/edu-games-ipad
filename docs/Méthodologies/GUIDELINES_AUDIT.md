# 🔍 AUDIT DES GUIDELINES UX ENFANT

> Rapport de conformité avec les guidelines du DESIGN_SYSTEM.md
> **Date** : Décembre 2024 (mis à jour 29/12)
> **Projet** : Hello Guys — App Éducative iPad
> **Conformité globale** : **91%** ✅
> **Dernière mise à jour documentation** : 29 Décembre 2024

---

## 📋 Résumé Exécutif

### ✅ CONFORMITÉS MAJEURES

1. **Design System centralisé**
   - ✅ Tous les nouveaux composants utilisent `/src/theme/`
   - ✅ Header.tsx migré vers `/theme/`
   - ✅ MathIntroScreen refactoré avec theme
   - ✅ Home V10 utilise exclusivement `/theme/`

2. **Composants Standardisés Créés**
   - ✅ ScreenHeader (3 variants : home, game, parent)
   - ✅ BackButton (2 variants : icon, text)
   - ✅ ScreenBackground (4 variants)
   - ✅ PageContainer
   - ✅ GameModal (3 variants : info, choice, demo)
   - ✅ VictoryCard
   - ✅ Button & IconButton
   - ✅ **GameIntroTemplate** (template unifié pour écrans d'intro) — 5 jeux l'utilisent
   - ✅ **HintButton** (bouton d'indices avec badge compteur)
   - ✅ **MascotBubble** (bulle dialogue style bois avec typewriter)
   - ✅ **Confetti** (animation célébration)
   - ✅ **CardFlip** (animation retournement)
   - ✅ **ProgressIndicator** (indicateur progression)
   - ✅ **GameActionButtons** (groupe boutons jeu)
   - ✅ **PerformanceStats** (stats performance)
   - ✅ **VictoryOverlayBase** (base overlay victoire)
   - ✅ **ParentGate** (protection parentale)

3. **Icônes Centralisées**
   - ✅ `src/constants/icons.ts` avec 78 emojis
   - ✅ Helper `getIcon()` avec fallback
   - ✅ Type `IconName` pour autocomplétion

4. **Touch Targets Principaux**
   - ✅ ScreenHeader : tous boutons 64x64dp
   - ✅ BackButton : garantis 64x64dp
   - ✅ GameModal : boutons minHeight 64dp
   - ✅ VictoryCard : boutons minHeight 64dp
   - ✅ MathIntroScreen : playButton minHeight 64dp
   - ✅ Home V10 : GameCards touch targets OK

5. **Polices**
   - ✅ Fredoka pour titres (Header, composants nouveaux)
   - ✅ Nunito pour corps de texte
   - ✅ Fonts chargées correctement dans App.tsx

6. **Home V10 — Forêt Magique**
   - ✅ Background couvre 100% écran
   - ✅ Z-index respectés (12 couches)
   - ✅ Animations fluides 60fps
   - ✅ Cartes 320×180dp avec espacement 60dp
   - ✅ Piou et Collection flottants visibles

---

## ⚠️ VIOLATIONS DÉTECTÉES

### 1. Tailles de Texte < 18pt

**Règle** : Texte courant ≥ 18pt, jamais < 16pt

| Fichier | Problème | Priorité |
|---------|----------|----------|
| `src/games/sudoku/screens/SudokuIntroScreen.tsx` | Instructions 15pt | 🟠 Moyenne |
| `src/games/hanoi/screens/HanoiIntroScreen.tsx` | Labels 14pt | 🟠 Moyenne |
| `src/components/activities/Labyrinthe/components/Inventory.tsx` | Texte 14pt | 🟠 Moyenne |
| `src/games/math-blocks/screens/MathPlayScreen.tsx` | Timer 14pt | 🟠 Moyenne |

**Note** : Les badges (12pt) et labels de stats (14pt) sont acceptables pour les éléments secondaires.

**Recommandation** :
- ✅ **Badges/Labels** : 12-14pt acceptable (petits éléments)
- ⚠️ **Instructions/Corps** : À corriger → 18pt minimum

---

### 2. Touch Targets Potentiellement < 64dp

**Règle** : Boutons interactifs ≥ 64dp pour enfants

| Fichier | Élément | Action |
|---------|---------|--------|
| `src/games/hanoi/components/FloatingButtons.tsx` | Boutons flottants | Vérifier |
| `src/components/home/CategoriesNav.tsx` | Boutons catégories | Vérifier |
| `src/games/sudoku/components/SudokuCell.tsx` | Cellules grille | Vérifier |

---

### 3. Imports `/constants/` obsolètes

**Règle** : Utiliser `/src/theme/` exclusivement

Fichiers utilisant encore `/constants/` :
- Quelques fichiers legacy non migrés
- Migration en cours de finalisation

---

## 📊 STATISTIQUES DÉTAILLÉES

### Conformité par Catégorie

| Catégorie | Conformité | Commentaire |
|-----------|------------|-------------|
| **Design System** | 95% | Quasi tous fichiers utilisent theme |
| **Touch Targets** | 85% | Nouveaux composants 100%, anciens à vérifier |
| **Tailles Texte** | 80% | Instructions à corriger, badges OK |
| **Polices** | 95% | Fredoka + Nunito partout |
| **Animations** | 90% | Reanimated avec spring |
| **SafeArea** | 100% | Tous écrans gèrent l'encoche |
| **Home V10** | 95% | Conforme aux specs |

**Moyenne pondérée** : **89%** ✅

---

## ✅ COMPOSANTS 100% CONFORMES

### Liste des fichiers validés

- [x] `src/components/common/ScreenHeader.tsx`
- [x] `src/components/common/BackButton.tsx`
- [x] `src/components/common/ScreenBackground.tsx`
- [x] `src/components/common/PageContainer.tsx`
- [x] `src/components/common/GameModal.tsx`
- [x] `src/components/common/VictoryCard.tsx`
- [x] `src/components/common/Button.tsx`
- [x] `src/components/common/IconButton.tsx`
- [x] `src/components/home/Header.tsx` (après migration)
- [x] `src/games/math-blocks/screens/MathIntroScreen.tsx` (après refactor)
- [x] `app/(parent)/index.tsx` (après refactor)
- [x] `src/components/home-v10/ForestBackgroundV10.tsx`
- [x] `src/components/home-v10/HomeHeaderV10.tsx`
- [x] `src/components/home-v10/GameCardV10.tsx`
- [x] `src/components/home-v10/layers/*.tsx`
- [x] `src/components/home-v10/animals/*.tsx`

### Fichiers à corriger

- [ ] `src/games/sudoku/screens/SudokuIntroScreen.tsx` → fontSize 18pt
- [ ] `src/games/hanoi/screens/HanoiIntroScreen.tsx` → fontSize 16pt+
- [ ] `src/components/activities/Labyrinthe/components/Inventory.tsx` → fontSize 16pt+
- [ ] `src/games/math-blocks/screens/MathPlayScreen.tsx` → fontSize timer 18pt
- [ ] `src/games/hanoi/components/FloatingButtons.tsx` → verify touch targets
- [ ] `src/components/home/CategoriesNav.tsx` → verify touch targets

---

## 🎓 RAPPEL DES RÈGLES

### Touch Targets (CRITIQUE)

```typescript
// ✅ BON
const styles = StyleSheet.create({
  button: {
    width: theme.touchTargets.child, // 64dp
    height: theme.touchTargets.child, // 64dp
    // OU
    minHeight: 64,
    minWidth: 64,
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

### Tailles de Texte

```typescript
// ✅ BON
const styles = StyleSheet.create({
  body: {
    fontSize: 18, // ✅ Minimum enfant
    // ou
    fontSize: theme.fontSize.lg,
  },
  badge: {
    fontSize: 12, // ✅ OK pour badges
  },
});

// ❌ MAUVAIS
const styles = StyleSheet.create({
  instruction: {
    fontSize: 14, // ❌ Trop petit pour instructions
  },
});
```

### Import Theme

```typescript
// ✅ OBLIGATOIRE
import { theme } from '@/theme';
// ou
import { colors, spacing, typography } from '@/theme';

// ❌ DEPRECATED - NE PLUS UTILISER
import { Colors } from '@/constants/colors';
```

---

## 📈 ÉVOLUTION DE LA CONFORMITÉ

| Date | Conformité | Actions |
|------|------------|---------|
| **Avant projet** | 60% | Code legacy, pas de standards |
| **Nov 2024** | 85% | Composants créés, migrations démarrées |
| **Déc 2024** | 89% | Home V10, nouveaux jeux, migration /theme/ |
| **Objectif** | 95%+ | Corriger fichiers restants |

---

## 🎯 PLAN D'ACTION RECOMMANDÉ

### Priorité HAUTE ✅ (Fait)

1. ✅ Créer composants standardisés
2. ✅ Migrer Header.tsx vers /theme/
3. ✅ Refactoriser MathIntroScreen
4. ✅ Refactoriser ParentDashboard
5. ✅ Créer composants Home V10
6. ✅ Ajouter nouveaux jeux (11 disponibles)

### Priorité MOYENNE 🔄 (En cours)

7. **Instructions de jeux** : Augmenter fontSize 15pt → 18pt
   - SudokuIntroScreen
   - Labyrinthe/Inventory
   - MathPlayScreen (timer)

8. **Touch targets** : Vérifier et corriger
   - FloatingButtons (Hanoi)
   - CategoriesNav (Home)
   - SudokuCell (si cliquable)

### Priorité BASSE 📋 (Optionnel)

9. **Stats/Labels** : Garder 14pt (acceptable pour éléments secondaires)
10. **Badges** : Garder 12pt (acceptable pour badges)

---

## 🛠️ COMMANDES DE VÉRIFICATION

### Détecter fontSize < 16

```bash
grep -rn "fontSize:\s*\([0-9]\|1[0-5]\)\s*[,;]" src/
```

### Détecter touch targets < 60

```bash
grep -rn "\(width\|height\):\s*\([1-5][0-9]\)\s*[,;]" src/
```

### Détecter imports obsolètes

```bash
grep -rn "from.*constants" src/ --include="*.tsx" --include="*.ts"
```

### Détecter couleurs hardcodées

```bash
grep -rn "#[0-9A-Fa-f]\{6\}" src/ --include="*.tsx" | grep -v theme
```

---

## 📝 CHECKLIST VALIDATION NOUVEAU COMPOSANT

Avant chaque commit d'un nouveau composant :

- [ ] Import `theme` depuis `@/theme`
- [ ] Touch targets ≥ 64dp
- [ ] fontSize ≥ 18pt (texte courant)
- [ ] fontFamily explicite
- [ ] Couleurs via theme.colors
- [ ] Spacing via theme.spacing
- [ ] accessibilityLabel sur éléments interactifs
- [ ] Animation avec withSpring (si applicable)

---

## 🎮 ÉTAT DES 15 JEUX

| # | Jeu | UI | Architecture | GameIntroTemplate | Mascotte | Notes |
|---|-----|:---:|:---:|:---:|:---:|-------|
| 01 | Hanoi | 90% | Partiel | ❌ | ✅ MascotOwl | Manque useXxxSound/Intro |
| 02 | Suites Logiques | **95%** | **COMPLET** | ✅ | ✅ MascotRobot | **RÉFÉRENCE** |
| 03 | Labyrinthe | 80% | Partiel | ✅ | ❌ | Inventory fontSize |
| 04 | Balance | 90% | Partiel | ✅ | ✅ DrHibou | Manque hooks |
| 05 | Sudoku | 85% | Partiel | ❌ | ✅ ProfessorHoo | IntroScreen custom |
| 06 | Conteur Curieux | 90% | Partiel | ❌ | ✅ PlumeMascot | IntroScreen custom |
| 07 | Memory | 90% | Partiel | ✅ | ❌ TBD | Mascotte à créer |
| 08 | Tangram | 90% | Partiel | ❌ | ❌ TBD | Manque intro/mascotte |
| 09 | Logix Grid | 90% | Partiel | ❌ | ❌ TBD | Manque intro/mascotte |
| 10 | Mots Croisés | 90% | Partiel | ❌ | ❌ TBD | Manque intro/mascotte |
| 11 | MathBlocks | 85% | Partiel | ✅ | ❌ TBD | Timer fontSize |
| 12 | Matrices Magiques | 90% | Partiel | ❌ | ✅ PixelMascot | IntroScreen custom |
| 13 | Embouteillage | - | **STUB** | ❌ | ❌ | En développement |
| 14 | Fabrique Réactions | - | **STUB** | ❌ | ❌ | En développement |
| 15 | Chasseur Papillons | - | **STUB** | ❌ | ❌ | En développement |

### Résumé Architecture

- **1 jeu** avec architecture complète (02-suites-logiques) — RÉFÉRENCE
- **5 jeux** utilisant GameIntroTemplate (02, 03, 04, 07, 11)
- **6 jeux** avec mascottes implémentées
- **3 jeux** en stub/placeholder (13-15)
- **11 jeux** nécessitent refactoring vers architecture standard

---

## 🔴 PROBLÈMES RÉSOLUS (Apprentissages Décembre 2024)

### 1. BackButton en mode jeu
**Problème :** Le BackButton ne retournait pas à la sélection quand `isPlaying=true`.

**Solution :** `GameIntroTemplate.handleBack()` doit TOUJOURS appeler `onBack()` pour que le hook parent gère l'état.

### 2. Centrage sur iPad
**Problème :** Éléments non centrés malgré `maxWidth: 600`.

**Solution :** Ne JAMAIS utiliser `width: '100%'` avec `maxWidth`. Utiliser uniquement `alignSelf: 'center'`.

### 3. Centrage du titre
**Problème :** Titre décalé selon les boutons gauche/droite.

**Solution :** `position: absolute` avec `left: 0, right: 0, alignItems: 'center'` sur le wrapper du titre.

### 4. Organisation des styles
**Bonne pratique :**
- Extraire les couleurs spécifiques en constante `COLORS`
- Organiser les styles par section avec commentaires `// ============`

---

## 📐 ARCHITECTURE CIBLE

### Structure obligatoire pour chaque jeu

```
XX-nom-activite/
├── components/              # Composants UI spécifiques
│   ├── XxxGame.tsx          # Composant principal gameplay
│   └── VictoryScreen.tsx    # Utilise VictoryCard
├── data/                    # Configuration statique
│   ├── levels.ts            # [OBLIGATOIRE]
│   ├── parentGuideData.ts   # [OBLIGATOIRE]
│   └── assistantScripts.ts  # [OBLIGATOIRE]
├── hooks/                   # Logique React
│   ├── useXxxIntro.ts       # [OBLIGATOIRE]
│   ├── useXxxGame.ts        # [OBLIGATOIRE]
│   └── useXxxSound.ts       # [RECOMMANDÉ]
├── logic/                   # Logique métier pure
├── screens/
│   └── XxxIntroScreen.tsx   # Utilise GameIntroTemplate
├── types/
│   └── index.ts             # Types centralisés
├── index.ts
└── README.md                # [OPTIONNEL]
```

### Éléments Obligatoires

| Élément | Description |
|---------|-------------|
| `components/XxxGame.tsx` | Composant principal de gameplay |
| `components/VictoryScreen.tsx` | Écran de victoire (utilise VictoryCard) |
| `data/levels.ts` | Configuration des niveaux |
| `data/parentGuideData.ts` | Données pour ParentDrawer |
| `data/assistantScripts.ts` | Dialogues de la mascotte |
| `hooks/useXxxIntro.ts` | Hook orchestrateur intro |
| `hooks/useXxxGame.ts` | Hook logique de jeu |
| `screens/XxxIntroScreen.tsx` | Écran intro (utilise GameIntroTemplate) |
| `types/index.ts` | Types centralisés |
| `index.ts` | Exports du module |

### Éléments Recommandés

| Élément | Description |
|---------|-------------|
| `hooks/useXxxSound.ts` | Gestion audio |
| `logic/` | Logique métier pure (engine) |
| `README.md` | Documentation du jeu |

### Référence : `src/games/02-suites-logiques/`

---

---

## 📝 MISES À JOUR DOCUMENTATION (29 Déc 2024)

### Fichiers mis à jour ce jour

| Document | Modification |
|----------|--------------|
| `UI_COMPONENTS_CATALOG.md` | +10 composants (GameIntroTemplate, MascotBubble, HintButton, etc.) |
| `00-INDEX_UPDATED.md` | +Section icônes, +Pré-prompt MascotBubble, règles mises à jour |
| `GAME_ARCHITECTURE.md` | +Tableau conformité 15 jeux, clarification RÉFÉRENCE |
| `ICONS_REGISTRY.md` | **NOUVEAU** — Registre 78 icônes centralisées |
| `GUIDELINES_AUDIT.md` | Mise à jour score, tableau 15 jeux |

### Nouveautés documentées

- Architecture Hook+Template (useXxxGame, useXxxSound, useXxxIntro)
- GameIntroTemplate comme template unifié pour écrans d'intro
- MascotBubble avec effet typewriter et highlights
- HintButton avec indicateur d'indices restants
- Icons centralisés dans `src/constants/icons.ts`

---

*Document mis à jour — 29 Décembre 2024*
*Score conformité : 91%*
*15 jeux (12 disponibles + 3 stubs)*
*Prochaine révision : Après refactoring des jeux restants*
