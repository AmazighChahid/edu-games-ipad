# Plan d'Implémentation - Écran d'Accueil V9 "Forêt Magique" 🌲✨

> **Version** : 9.0
> **Auteur** : Équipe Développement
> **Dernière mise à jour** : Décembre 2025
> **Statut** : 📋 En cours de planification

---

## 📚 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Structure des fichiers](#structure-des-fichiers)
3. [Phase 1 : Types et Configuration](#phase-1--types-et-configuration-30-min)
4. [Phase 2 : Background Animé](#phase-2--background-animé-2h)
5. [Phase 3 : Header](#phase-3--header-45-min)
6. [Phase 4 : Widgets Section](#phase-4--widgets-section-1h30)
7. [Phase 5 : Section Jeux par Catégorie](#phase-5--section-jeux-par-catégorie-1h30)
8. [Phase 6 : Intégration](#phase-6--intégration-appindextsx-1h)
9. [Phase 7 : Connexion au Store](#phase-7--connecter-au-store-1h)
10. [Phase 8 : Animations & Polish](#phase-8--animations--polish-1h)
11. [Phase 9 : Tests & Validation](#phase-9--tests--validation-30-min)
12. [Estimation & Planning](#estimation-totale--10h)
13. [Risques & Mitigations](#-risques-identifiés)
14. [Definition of Done](#-definition-of-done)

---

## Vue d'ensemble

Refonte complète de l'écran d'accueil avec un background animé "forêt magique", 4 widgets de progression, et jeux organisés par catégorie avec scroll horizontal.

### 🎯 Objectifs principaux
- **Engagement visuel** : Créer un environnement immersif et enchanteur pour les enfants
- **Progression claire** : Visualiser les accomplissements via widgets et médailles
- **Navigation intuitive** : Accès rapide aux jeux par catégories thématiques
- **Performance** : Animations fluides à 60fps même sur appareils modestes

### 📱 Compatibilité cible
| Plateforme | Version min | Résolution |
|------------|-------------|------------|
| iOS | 14.0+ | iPhone SE → iPhone 15 Pro Max |
| Android | API 24+ | 360dp → 428dp largeur |

### 🎨 Palette de couleurs principale
```
Primaire    : #5B8DEE (Bleu ciel)
Secondaire  : #9B59B6 (Violet magique)
Succès      : #27AE60 (Vert forêt)
Énergie     : #F39C12 (Orange soleil)
Fond ciel   : #87CEEB → #B0E0E6 (Dégradé)
Herbe       : #7BC74D → #98D9A8 (Dégradé)
```

## Structure des fichiers

```
src/
├── components/
│   ├── background/                    # NOUVEAU - Background animé
│   │   ├── ForestBackground.tsx       # Container principal
│   │   ├── Sky.tsx                    # Dégradé ciel
│   │   ├── Mountains.tsx              # 4 montagnes avec neige
│   │   ├── Hills.tsx                  # 3 collines vertes
│   │   ├── Trees.tsx                  # 4 arbres (tronc + couronne)
│   │   ├── Flowers.tsx                # 5 fleurs avec balancement
│   │   ├── Sun.tsx                    # Soleil avec pulse/glow
│   │   ├── AnimatedCloud.tsx          # Nuages flottants (3)
│   │   └── animals/                   # Animaux animés
│   │       ├── Butterfly.tsx          # Papillons (3)
│   │       ├── Bird.tsx               # Oiseaux (3)
│   │       ├── Squirrel.tsx           # Écureuil (1)
│   │       ├── Rabbit.tsx             # Lapin (1)
│   │       ├── Bee.tsx                # Abeille (1)
│   │       ├── Ladybug.tsx            # Coccinelle (1)
│   │       └── Dragonfly.tsx          # Libellule (1)
│   │
│   ├── home/                          # REFONTE - Composants home V9
│   │   ├── HomeHeader.tsx             # Header avec profil
│   │   ├── WidgetsSection.tsx         # Grille 2x2 widgets
│   │   ├── widgets/                   # Widgets individuels
│   │   │   ├── PiouWidget.tsx         # Conseil Piou (bleu)
│   │   │   ├── GardenWidget.tsx       # Mon Jardin (vert)
│   │   │   ├── StreakWidget.tsx       # Ma Série (orange)
│   │   │   └── CollectionWidget.tsx   # Ma Collection (violet)
│   │   ├── GameCategoriesSection.tsx  # Section jeux par catégorie
│   │   ├── CategoryRow.tsx            # Une catégorie avec scroll
│   │   └── GameCardV9.tsx             # Carte de jeu V9
│   │
│   └── shared/
│       └── PiouMascot.tsx             # Mascotte Piou réutilisable
│
├── types/
│   └── home.types.ts                  # Types spécifiques V9
│
├── data/
│   └── gamesConfig.ts                 # Configuration jeux/catégories
│
└── hooks/
    └── useHomeData.ts                 # Hook données home
```

---

## Phase 1 : Types et Configuration (30 min)

### 1.1 Types home.types.ts
```typescript
// Types pour le profil utilisateur
interface UserProfile {
  name: string;
  avatarEmoji: string;
  level: number;
  gems: number;
  totalMedals: number;
}

// Types pour les widgets
interface PiouAdvice {
  message: string;
  highlightedPart: string;
  actionLabel: string;
  targetGameId?: string;
}

interface GardenStats {
  flowers: FlowerType[];
  totalGames: number;
  totalTime: string;
}

interface StreakData {
  currentStreak: number;
  weekDays: WeekDay[];
}

interface CollectionData {
  unlockedCards: string[];
  totalCards: number;
}

// Types pour les jeux
type MedalType = 'none' | 'bronze' | 'silver' | 'gold' | 'diamond';
type BadgeType = 'new' | 'hot' | 'soon';
type GameColor = 'blue' | 'purple' | 'green' | 'orange' | 'teal' | 'pink' | 'indigo' | 'red';

interface GameV9 {
  id: string;
  name: string;
  icon: string;
  color: GameColor;
  medal: MedalType;
  badge?: BadgeType;
  isLocked: boolean;
}

interface GameCategory {
  id: string;
  icon: string;
  title: string;
  games: GameV9[];
}
```

### 1.2 Configuration gamesConfig.ts
- Mapping des jeux existants vers les catégories V9
- Couleurs par jeu
- Icônes par jeu

---

## Phase 2 : Background Animé (2h)

### 2.1 Éléments statiques
- **Sky.tsx** : LinearGradient vertical (#87CEEB → #B0E0E6 → #98D9A8 → #7BC74D)
- **Mountains.tsx** : 4 triangles CSS avec View + borderWidth trick
- **Hills.tsx** : 3 ellipses vertes avec borderRadius
- **Trees.tsx** : 4 arbres (View pour tronc + LinearGradient pour couronne)
- **Flowers.tsx** : 5 Text emoji avec animation rotate

### 2.2 Éléments animés

| Composant | Animation | Durée | Technique | Easing |
|-----------|-----------|-------|-----------|--------|
| Sun.tsx | scale pulse + glow | 4s | withRepeat + withSequence | easeInOut |
| AnimatedCloud.tsx | translateX loop | 25-35s | withRepeat + withTiming | linear |
| Butterfly.tsx | translateX/Y ondulé | 12-20s | withRepeat + interpolation | bezier |
| Bird.tsx | translateX linéaire | 10-14s | withRepeat + withTiming | linear |
| Squirrel.tsx | translateX aller-retour | 20s | withRepeat + withSequence | easeInOut |
| Rabbit.tsx | translateX/Y bonds | 15s | withRepeat + withSequence | bounce |
| Bee.tsx | translateX/Y zigzag | 18s | withRepeat + interpolation | bezier |
| Ladybug.tsx | translateX/Y lent | 25s | withRepeat + withTiming | linear |
| Dragonfly.tsx | translateX dards | 12s | withRepeat + withSequence | easeOut |

### 2.3 Schéma visuel du Background

```
┌─────────────────────────────────────────────────────────────┐
│  ☀️                  ☁️           ☁️                        │ ← Ciel
│         🦋                              🐦                  │
│    ⛰️      ⛰️⛰️    ⛰️                                      │ ← Montagnes
│  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~       │
│     🌲    🌲       🌲    🌲                                 │ ← Arbres
│  ~~~~~~~~~~~~~~~🐿️~~~~~~~~~~~~~~🐰~~~~~~~~~~~~~~~~~~~~~~   │ ← Collines
│    🌸  🌻  🌷  🐝 🌺  🐞  🌼                               │ ← Fleurs
└─────────────────────────────────────────────────────────────┘
```

### 2.4 ForestBackground.tsx
- Container avec position: absolute, pointerEvents: 'none'
- Ordre de rendu (z-index) : Sky → Mountains → Hills → Trees → Flowers → Animals
- Support `useReducedMotion()` pour accessibilité

### 2.5 ⚡ Optimisations Performance
```typescript
// Utiliser des worklets pour les animations complexes
const animatedStyle = useAnimatedStyle(() => {
  'worklet';
  return {
    transform: [{ translateX: withTiming(position.value) }]
  };
});

// Lazy mount des animaux après le premier render
const [showAnimals, setShowAnimals] = useState(false);
useEffect(() => {
  const timer = setTimeout(() => setShowAnimals(true), 500);
  return () => clearTimeout(timer);
}, []);
```

### 2.6 🌙 Mode Nuit (Bonus futur)
Prévoir la structure pour un thème nuit :
- Ciel : #1a1a2e → #16213e
- Lune à la place du soleil
- Étoiles scintillantes
- Hibou au lieu des oiseaux
- Lucioles au lieu des papillons

---

## Phase 3 : Header (45 min)

### 3.1 HomeHeader.tsx
Layout flex avec 3 sections :

**Gauche - Bouton Parent**
- Container blanc arrondi avec shadow
- Icône gradient violet (#9B59B6)
- Texte "Espace Parent"
- onPress → navigation parent (avec PIN gate)

**Centre - Profil**
- Avatar cercle avec gradient (#5B8DEE → #9B59B6)
- Badge niveau (cercle orange avec numéro)
- Texte "Bonjour {name} !"
- Sous-texte "Prête pour une nouvelle aventure ?"

**Droite - Stats**
- 2 pills blancs avec icône + valeur
- 💎 Gems count
- 🏅 Medals count

---

## Phase 4 : Widgets Section (1h30)

### 4.1 WidgetsSection.tsx
- Container avec padding horizontal 28px
- Grid 2x2 avec gap 14px
- Hauteur fixe 140px par widget

### 📐 Layout Widgets (2x2)
```
┌─────────────────────────────────────────────────────────┐
│  ┌─────────────────────┐  ┌─────────────────────┐      │
│  │  🦉 CONSEIL PIOU    │  │  🌻 MON JARDIN      │      │
│  │  ─────────────────  │  │  ─────────────────  │      │
│  │  "Tu as presque     │  │  🌸🌻🌷🌺🌼          │      │
│  │   débloqué le       │  │  12 jeux · 45min    │      │
│  │   niveau Or !"      │  │                     │      │
│  │      [C'est parti!] │  │                     │      │
│  └─────────────────────┘  └─────────────────────┘      │
│  ┌─────────────────────┐  ┌─────────────────────┐      │
│  │  🔥 MA SÉRIE        │  │  🏆 COLLECTION      │      │
│  │  ─────────────────  │  │  ─────────────────  │      │
│  │  ○ ○ ● ● ● ● ○      │  │  🃏🃏🃏🃏🔒          │      │
│  │  L M M J V S D      │  │  7 / 20             │      │
│  │  5 jours d'affilée! │  │  ████████░░░░ 35%   │      │
│  └─────────────────────┘  └─────────────────────┘      │
└─────────────────────────────────────────────────────────┘
```

### 4.2 PiouWidget.tsx (bleu)
- Gradient bleu (#5B8DEE → #3B6FCE)
- Mascotte Piou à gauche (avec bounce animation)
- Message avec texte highlighted
- Bouton "C'est parti !" blanc
- Icône fond 🦉 opacity 0.15

### 4.3 GardenWidget.tsx (vert)
- Gradient vert (#27AE60 → #1E8449)
- Visualisation 5 fleurs avec tiges
- Stats : Fleurs, Jeux, Temps
- Icône fond 🌻 opacity 0.15

### 4.4 StreakWidget.tsx (orange)
- Gradient orange (#F39C12 → #D68910)
- 7 cercles jours (L M M J V S D)
- États : completed (blanc), today (blanc + ring), pending (transparent)
- Compteur streak "5 jours d'affilée !"
- Icône fond 🔥 opacity 0.15

### 4.5 CollectionWidget.tsx (violet)
- Gradient violet (#9B59B6 → #8E44AD)
- 5 cartes preview (4 débloquées + 1 locked)
- Compteur "7 / 20"
- Barre de progression
- Icône fond 🏆 opacity 0.15

---

## Phase 5 : Section Jeux par Catégorie (1h30)

### 5.1 GameCategoriesSection.tsx
- Container avec padding horizontal 28px
- Liste verticale de CategoryRow
- 5 catégories : Logique, Chiffres, Formes, Mémoire, Mots

### 5.2 CategoryRow.tsx
- Header léger : icône + titre + " · " + count
- ScrollView horizontal pour les cartes
- Gap 14px entre cartes

### 5.3 GameCardV9.tsx
Dimensions : 200x170px

**Structure :**
- LinearGradient background selon `color`
- Emoji fond (fontSize 120, opacity 0.2)
- Badge optionnel (NOUVEAU, 🔥 HOT, BIENTÔT)
- Nom du jeu (Fredoka 17px bold blanc)
- Médaille avec gradient correspondant

**📐 Wireframe GameCard**
```
┌────────────────────────────┐
│ [NOUVEAU]                  │  ← Badge top-left
│                            │
│         🎮                 │  ← Emoji fond (grande taille, opacity 0.2)
│                            │
│  ┌─────────────────────┐   │
│  │  Nom du Jeu         │   │  ← Titre blanc
│  └─────────────────────┘   │
│            🥇              │  ← Médaille bottom-right
└────────────────────────────┘
```

**Médailles :**
| Niveau | Couleurs | Emoji | Condition |
|--------|----------|-------|-----------|
| Bronze | #CD7F32 → #8B5A2B | 🥉 | 1 niveau complété |
| Silver | #C0C0C0 → #909090 | 🥈 | 2 niveaux complétés |
| Gold | #FFD700 → #FFA500 | 🥇 | 4 niveaux complétés |
| Diamond | #B9F2FF → #00CED1 | 💎 | 6 niveaux complétés |
| Locked | rgba blanc 20% | 🔒 | Jeu non accessible |

**Animations :**
- onPressIn : translateY(-5) + scale(1.02)
- Transition 300ms cubic-bezier
- Haptic feedback léger sur press

**États :**
- coming-soon : opacity 0.6, disabled, badge "BIENTÔT"

**Code Animation**
```typescript
const pressAnimation = useAnimatedStyle(() => ({
  transform: [
    { translateY: withSpring(pressed.value ? -5 : 0) },
    { scale: withSpring(pressed.value ? 1.02 : 1) },
  ],
}));
```

---

## Phase 6 : Intégration app/index.tsx (1h)

### 6.1 Structure principale
```tsx
<View style={styles.container}>
  {/* Background fixe */}
  <ForestBackground />

  {/* Contenu scrollable */}
  <ScrollView style={styles.contentLayer}>
    <HomeHeader />
    <WidgetsSection />
    <GameCategoriesSection />
  </ScrollView>
</View>
```

### 6.2 Hook useHomeData
Centralise toutes les données :
- Profil depuis store
- Calcul streak depuis screenTime
- Calcul jardin depuis progress
- Collection depuis collectionSlice
- Conseil Piou (algorithme personnalisé)
- Jeux par catégorie avec médailles calculées

---

## Phase 7 : Connecter au Store (1h)

### 7.1 Données profil
```typescript
const profile = useActiveProfile();
const { getTotalCompletions, getAllProgress } = useGameProgress();
```

### 7.2 Calcul médailles
```typescript
function getMedalForGame(gameId: string): MedalType {
  const progress = getAllProgress()[gameId];
  if (!progress) return 'none';
  const completedCount = Object.keys(progress.completedLevels).length;
  if (completedCount >= 6) return 'diamond';
  if (completedCount >= 4) return 'gold';
  if (completedCount >= 2) return 'silver';
  if (completedCount >= 1) return 'bronze';
  return 'none';
}
```

### 7.3 Calcul streak
```typescript
function calculateStreak(): StreakData {
  const { dailyRecords } = useScreenTime();
  // Parcourir les 7 derniers jours
  // Marquer completed si totalMinutes > 0
  // Calculer currentStreak
}
```

### 7.4 Calcul jardin
```typescript
function calculateGarden(): GardenStats {
  const totalCompletions = getTotalCompletions();
  const flowerCount = Math.min(5, Math.floor(totalCompletions / 10));
  const flowers = ['🌸', '🌻', '🌷', '🌺', '🌼'].slice(0, flowerCount);
  const totalTime = formatPlayTime(getAllProgress());
  return { flowers, totalGames: totalCompletions, totalTime };
}
```

### 7.5 Conseil Piou
```typescript
function getPiouAdvice(): PiouAdvice {
  // Logique de recommandation :
  // 1. Si proche d'un nouveau rang → encourager
  // 2. Si streak cassé → motiver
  // 3. Si nouveau jeu disponible → suggérer
  // 4. Défaut : féliciter progression
}
```

---

## Phase 8 : Animations & Polish (1h)

### 8.1 Animations d'entrée
- Header : fadeIn + slideDown
- Widgets : staggered fadeIn
- Catégories : staggered fadeIn

### 8.2 Interactions
- Tous les boutons : spring scale
- Cartes jeux : translateY + scale on press
- Widgets : subtle hover effect

### 8.3 Performance
- React.memo sur tous les composants
- useCallback pour handlers
- Lazy loading des animaux (delay initial)

---

## Phase 9 : Tests & Validation (30 min)

### 9.1 Checklist visuelle
- [ ] Background complet avec tous éléments
- [ ] Header responsive
- [ ] 4 widgets fonctionnels
- [ ] 5 catégories de jeux
- [ ] Scroll vertical fluide
- [ ] Scroll horizontal par catégorie
- [ ] Animations 60fps
- [ ] Touch targets ≥ 64dp

### 9.2 Checklist fonctionnelle
- [ ] Navigation Espace Parent
- [ ] Navigation vers jeux
- [ ] Navigation collection
- [ ] Données réelles depuis store
- [ ] Médailles calculées correctement
- [ ] Streak affiché correctement

### 9.3 🧪 Tests de Performance
```bash
# Profiler les animations
npx react-native start --profile

# Vérifier les re-renders inutiles
# Ajouter dans les composants critiques :
console.count('ForestBackground render');
```

| Métrique | Objectif | Critique |
|----------|----------|----------|
| First Paint | < 500ms | < 1000ms |
| Time to Interactive | < 1500ms | < 2500ms |
| FPS Animations | 60fps | 45fps |
| Memory Peak | < 150MB | < 200MB |

### 9.4 ♿ Accessibilité
- [ ] `accessibilityLabel` sur tous les boutons
- [ ] `accessibilityRole="button"` sur les cartes
- [ ] Support VoiceOver / TalkBack
- [ ] `useReducedMotion()` respecté
- [ ] Contraste texte ≥ 4.5:1

---

## Ordre d'exécution

1. **Types & Config** - Fondations
2. **Background statique** - Sky, Mountains, Hills, Trees, Flowers
3. **Background animé** - Sun, Clouds, Animals
4. **Header** - Layout complet
5. **Widgets** - 4 widgets avec données mock
6. **Jeux** - Categories + Cards
7. **Intégration** - app/index.tsx
8. **Store** - Connexion données réelles
9. **Polish** - Animations entrée + perf

---

## Estimation totale : ~10h

| Phase | Durée | Priorité | Dépendances |
|-------|-------|----------|-------------|
| Types & Config | 30 min | 🔴 Critique | - |
| Background statique | 1h | 🔴 Critique | Phase 1 |
| Background animé | 1h | 🟡 Haute | Phase 2.1 |
| Header | 45 min | 🔴 Critique | Phase 1 |
| Widgets | 1h30 | 🟡 Haute | Phase 1, 3 |
| Jeux | 1h30 | 🔴 Critique | Phase 1 |
| Intégration | 1h | 🔴 Critique | Toutes |
| Store | 1h | 🟡 Haute | Phase 6 |
| Polish | 1h | 🟢 Moyenne | Phase 7 |
| Tests | 30 min | 🟡 Haute | Phase 8 |

---

## 📊 Diagramme de Gantt simplifié

```
Jour 1 (4h)
├── Types & Config ████
├── Background statique ████████
├── Background animé ████████
└── Header ██████

Jour 2 (4h)
├── Widgets ████████████
├── Jeux ████████████
└── Intégration partielle ████

Jour 3 (2h)
├── Store ████████
├── Polish ████████
└── Tests ████
```

---

## 🚨 Risques identifiés

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Animations saccadées sur Android low-end | Élevé | Moyenne | Lazy loading + useReducedMotion |
| Trop d'éléments animés simultanés | Moyen | Haute | Limiter à 5 animaux visibles |
| Memory leak sur animations | Élevé | Basse | Cleanup useEffect + cancelAnimation |
| Temps de développement sous-estimé | Moyen | Moyenne | Buffer 20% sur chaque phase |

---

## 📝 Notes de développement

### Imports communs
```typescript
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
  interpolate,
  useReducedMotion,
  cancelAnimation,
} from 'react-native-reanimated';
```

### Constantes globales
```typescript
// constants/home.ts
export const HOME_CONSTANTS = {
  WIDGET_HEIGHT: 140,
  CARD_WIDTH: 200,
  CARD_HEIGHT: 170,
  HORIZONTAL_PADDING: 28,
  GAP: 14,
  ANIMATION_DELAY_ANIMALS: 500,
  MAX_VISIBLE_ANIMALS: 5,
};
```

---

## ✅ Definition of Done

Une phase est considérée "terminée" quand :
1. ✅ Le code compile sans erreur
2. ✅ Le composant s'affiche correctement sur iOS ET Android
3. ✅ Les animations tournent à 60fps
4. ✅ Le code est commenté si complexe
5. ✅ Le composant est wrappé dans React.memo si nécessaire
6. ✅ Les props sont typées avec TypeScript

---

## 🚀 Prochaines étapes après V9

### V9.1 - Améliorations mineures
- [ ] Mode nuit automatique (basé sur l'heure)
- [ ] Sons ambiants optionnels (oiseaux, vent)
- [ ] Tutoriel de première utilisation
- [ ] Animations de célébration sur déblocage médaille

### V9.2 - Personnalisation
- [ ] Choix du thème (Forêt, Océan, Espace, Jungle)
- [ ] Personnalisation de l'avatar
- [ ] Skins pour Piou débloquables avec gems
- [ ] Stickers de récompense

### V10 - Évolutions majeures
- [ ] Mode hors-ligne complet
- [ ] Synchronisation cloud progression
- [ ] Défis quotidiens avec récompenses
- [ ] Mode multijoueur (défis entre amis)

---

## 💡 Idées d'améliorations UX

### Micro-interactions suggérées
```
• Shake device → Animation spéciale des animaux
• Long press sur widget → Preview détaillé
• Pull-to-refresh → Nouvelle citation Piou
• Scroll rapide → Effet parallax sur le background
```

### Gamification supplémentaire
```
• Compteur de visites quotidiennes → Récompense fidélité
• "Animal du jour" → Nouvel animal chaque jour
• Événements saisonniers → Décors Noël, Halloween, Pâques
• Challenges hebdomadaires → Objectifs spéciaux
```

---

## 📞 Ressources & Liens

| Ressource | Lien |
|-----------|------|
| 🎨 Maquettes Figma | `[À compléter]` |
| 📱 TestFlight | `[À compléter]` |
| 📊 Analytics | `[À compléter]` |
| 🐛 Bug Tracker | `[À compléter]` |

---

<div align="center">

### 🌲 Forêt Magique V9 🌲

*Créer de la magie pour l'apprentissage des enfants*

**Made with 💚 by the Team**

</div>
