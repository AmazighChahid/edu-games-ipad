# 🔧 PROMPT REFACTORING HOMOGÉNÉISATION

> **Guide pour refactoriser les activités vers le pattern Hook + Template**
> Basé sur l'expérience de refactoring de Suites Logiques (Décembre 2024)

---

## Architecture Cible : Hook + Template

> **Détails complets** → `GAME_ARCHITECTURE.md`

Chaque activité DOIT suivre cette architecture :

```
src/games/XX-nom-jeu/
├── hooks/
│   ├── useXxxGame.ts       # Logique de jeu PURE
│   ├── useXxxSound.ts      # Sons
│   └── useXxxIntro.ts      # ORCHESTRATEUR
├── screens/
│   └── XxxIntroScreen.tsx  # Assemblage MINIMAL (~100-150 lignes)
├── components/
│   └── XxxMascot.tsx       # Mascotte spécifique
├── data/
│   ├── levels.ts
│   └── parentGuideData.ts
└── types/
    └── index.ts
```

**Objectif :** Screen de ~100-150 lignes qui utilise `GameIntroTemplate`

**Référence implémentation** : `src/games/02-suites-logiques/`

---

## PROMPT PRINCIPAL DE REFACTORING

```
Tu es un expert React Native/Expo spécialisé dans les applications éducatives enfants.

## MISSION
Refactoriser les écrans de jeux pour garantir une homogénéité UI complète.

## DOCUMENTS À LIRE AVANT DE COMMENCER
1. `CLAUDE_CODE_RULES.md` — Règles non-négociables
2. `UI_COMPONENTS_CATALOG.md` — Composants à utiliser
3. `DESIGN_SYSTEM.md` — Tokens theme

## PROCESSUS DE REFACTORING

Pour CHAQUE fichier écran (*Screen.tsx) :

### Étape 1 : Audit
1. Identifier les imports obsolètes (`/constants/`)
2. Identifier les headers custom
3. Identifier les boutons custom
4. Identifier les emojis hardcodés
5. Vérifier touch targets et tailles texte

### Étape 2 : Migration
1. Remplacer imports `/constants/` → `/theme/`
2. Remplacer header custom → `ScreenHeader`
3. Remplacer boutons custom → `Button`, `IconButton`
4. Remplacer modale custom → `GameModal`
5. Remplacer emojis → `Icons.xxx`
6. Migrer couleurs hardcodées → `theme.colors`
7. Migrer spacing hardcodés → `theme.spacing`

### Étape 3 : Validation
- Vérifier checklist CLAUDE_CODE_RULES.md
- Tester visuellement
- Vérifier performances (pas de re-render inutile)

## RAPPORT APRÈS CHAQUE FICHIER
- ✅ Changements effectués
- ⚠️ Points d'attention
- 📊 Conformité (%) avec les guidelines
```

---

## PROMPT DE VÉRIFICATION POST-REFACTORING

```
## AUDIT POST-REFACTORING

Pour chaque *Screen.tsx, vérifier :

1. **Imports**
   - [ ] Aucun import depuis `/constants/`
   - [ ] Import `{ theme }` depuis `@/theme`
   - [ ] Import composants depuis `@/components/common`
   - [ ] Import `{ Icons }` depuis `@/constants/icons`

2. **Structure**
   - [ ] `PageContainer` comme wrapper racine
   - [ ] `ScreenHeader` avec variant correct
   - [ ] Aucun header/bouton retour custom

3. **Styles**
   - [ ] Aucune couleur hardcodée (#XXX)
   - [ ] Aucun spacing hardcodé
   - [ ] `fontFamily` explicite sur tous Text
   - [ ] Touch targets ≥ 64dp
   - [ ] Texte courant ≥ 18pt

4. **Icônes**
   - [ ] Aucun emoji hardcodé
   - [ ] Utilisation de `Icons.xxx`

### Commandes de vérification

```bash
grep -r "from '@/constants" src/games/
grep -rn "#[A-Fa-f0-9]\{6\}" src/games/ --include="*.tsx"
grep -rn "padding: [0-9]" src/games/ --include="*.tsx"
```
```

---

## PROMPT POUR NOUVEAUX ÉCRANS

```
## CRÉATION D'UN NOUVEL ÉCRAN

AVANT de coder, lire :
1. `CLAUDE_CODE_RULES.md` — Règles non-négociables
2. `UI_COMPONENTS_CATALOG.md` — Composants à utiliser

## TEMPLATE DE BASE

→ Voir template complet dans `CLAUDE_CODE_RULES.md` section "Structure de page"

## CHECKLIST RAPIDE
- [ ] `PageContainer` wrapper
- [ ] `ScreenHeader variant="game"`
- [ ] `GameModal` pour modales
- [ ] `Icons.xxx` pour emojis
- [ ] `theme.xxx` pour styles
- [ ] Touch targets ≥ 64dp
- [ ] Texte ≥ 18pt
```

---

## COMPOSANTS CLÉS POUR REFACTORING

> **Props détaillées** → `UI_COMPONENTS_CATALOG.md`

### GameIntroTemplate

Template principal pour écrans intro de jeux. Gère 2 vues : sélection et jeu.

```tsx
import { GameIntroTemplate } from '@/components/common';

<GameIntroTemplate
  isPlaying={isPlaying}
  isVictory={isVictory}
  title="Nom du Jeu"
  emoji={Icons.puzzle}
  onBack={handleBack}
  mascotComponent={<MaMascotte />}
  mascotMessage={mascotMessage}
  levelSelectorComponent={<MonSelecteur />}
  gameComponent={<MonJeu />}
  hintButton={<HintButton remaining={hints} onPress={handleHint} />}
/>
```

### MascotBubble

Bulle de dialogue avec effet typewriter.

```tsx
import { MascotBubble } from '@/components/common';

<MascotBubble
  message="Bienvenue !"
  highlights={['niveau']}
  onComplete={() => {}}
  typingSpeed={30}
/>
```

### HintButton

Bouton indice avec compteur.

```tsx
import { HintButton } from '@/components/common';

<HintButton
  remaining={3}
  maxHints={3}
  onPress={handleShowHint}
  disabled={remaining === 0}
/>
```

---

## POINTS D'ATTENTION CRITIQUES

### 1. BackButton en mode jeu

Le `GameIntroTemplate` gère le comportement du BackButton :
- Mode jeu (`isPlaying=true`) : retour à la sélection (pas navigation)
- Mode sélection (`isPlaying=false`) : navigation vers accueil

### 2. Centrage titre iPad

Le titre doit être centré indépendamment des boutons. Utiliser `ScreenHeader` qui gère cela automatiquement.

### 3. Animations

Toujours utiliser Reanimated 3 avec spring pour les animations :

```tsx
import { withSpring } from 'react-native-reanimated';

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: withSpring(pressed.value ? 0.95 : 1) }],
}));
```

---

## Checklist Finale de Validation

### Structure
- [ ] Screen ≤ 150 lignes
- [ ] Hook `useXxxIntro.ts` orchestre tout
- [ ] Hook `useXxxGame.ts` = logique pure
- [ ] Utilise `GameIntroTemplate`
- [ ] Mascotte via `MascotBubble`

### UX Enfant
- [ ] Touch targets ≥ 64dp
- [ ] fontSize ≥ 18pt
- [ ] Animations fluides (spring)
- [ ] Feedback jamais punitif

### Code Quality
- [ ] Imports corrects (`@/theme`, `@/constants/icons`)
- [ ] Pas de valeurs hardcodées
- [ ] Types TypeScript complets

---

## Fichiers de Référence

| Fichier | Rôle |
|---------|------|
| `src/games/02-suites-logiques/` | **RÉFÉRENCE** implémentation complète |
| `UI_COMPONENTS_CATALOG.md` | Props de tous les composants |
| `CLAUDE_CODE_RULES.md` | Règles non-négociables |
| `ICONS_REGISTRY.md` | Liste des 78 icônes |

---

*Document mis à jour - Décembre 2024*
