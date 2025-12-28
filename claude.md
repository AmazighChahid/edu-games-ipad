# CLAUDE.md — Instruction Projet Complète
## Application Éducative iPad pour Enfants 6-10 ans
### Stack : React Native + Expo SDK 52+ • TypeScript • Reanimated 3

---

## 1. VISION PRODUIT & PHILOSOPHIE

### Identité du Projet
- **Nom de code** : "Hello Guys"
- **Plateforme cible** : iPad (support iPhone secondaire)
- **Public** : Enfants 6-10 ans + Interface parent dédiée
- **Inspiration** : Khan Academy Kids, Duolingo, Toca Boca, Endless Alphabet, Montessori

### Philosophie Pédagogique Fondamentale

> **« Apprendre à penser, pas à répondre »**

L'objectif PRINCIPAL n'est PAS de fournir des résultats corrects, mais de **transmettre les MÉTHODES de raisonnement**. L'enfant doit comprendre le "pourquoi" et le "comment", pas seulement obtenir la bonne réponse.

L'application s'appuie sur les principes Montessori :
- Autonomie et auto-correction
- Progression libre au rythme de l'enfant
- Manipulation concrète (interactions tactiles simulant des objets réels)
- Zone de développement proximal (Vygotsky) : ni trop facile, ni trop difficile

### Priorités Absolues (dans l'ordre)
1. **Pédagogie enfant** — L'apprentissage de la méthode prime sur tout
2. **UX claire et rassurante** — L'enfant comprend sans lire
3. **UI tactile iPad** — Adaptée aux petites mains
4. **Architecture modulaire** — Évolutive pour accueillir de nouveaux jeux

---

## 2. PRINCIPES PÉDAGOGIQUES (Non négociables)

### Règles Incontournables

1. **Méthode avant résultat**
   - Chaque activité enseigne un processus de réflexion explicite
   - L'enfant doit pouvoir verbaliser sa démarche

2. **Erreur constructive**
   - Les erreurs sont des opportunités d'apprentissage, JAMAIS des échecs
   - Pas de "mauvaise réponse", mais des "essais à améliorer"

3. **Autonomie progressive (scaffolding)**
   - Guidance décroissante à mesure que l'enfant maîtrise
   - L'aide disparaît progressivement

4. **Transfert des compétences**
   - Les compétences acquises doivent être applicables ailleurs (école, vie quotidienne)

5. **Ne JAMAIS donner la réponse**
   - Guider vers la découverte par des questions et indices

### Compétences Cognitives Ciblées
- Attention et concentration
- Flexibilité mentale
- Raisonnement inductif et déductif
- Raisonnement spatial
- Vitesse de traitement
- Créativité
- Compréhension lecture

---

## 3. STACK TECHNIQUE

### Technologies Imposées
```
Frontend :
- React Native + Expo (SDK 52+)
- TypeScript obligatoire
- React Native Reanimated 3 (animations 60fps)
- Expo Router (navigation par gestes)
- Zustand (gestion d'état)
- i18n (internationalisation)

Stockage :
- AsyncStorage pour progression locale
- Pas de backend complexe au démarrage

Orientation :
- Paysage prioritaire (iPad)
- Support portrait secondaire
```

### Règle Architecture
**Séparation stricte logique métier / UI.** La logique de jeu doit fonctionner indépendamment des composants visuels.

---

## 4. STRUCTURE DU PROJET (Actuelle)

```
hello-guys/
├── app/                        # Routes Expo Router
│   ├── _layout.tsx             # Layout racine, polices, providers
│   ├── index.tsx               # Écran d'accueil (Home V10)
│   ├── (games)/                # Groupe de routes jeux
│   │   ├── balance/            # Balance Logique
│   │   ├── hanoi/              # Tour de Hanoï
│   │   ├── labyrinthe/         # Labyrinthe
│   │   ├── logix-grid/         # Logix Grid
│   │   ├── math-blocks/        # MathBlocks
│   │   ├── memory/             # Memory (placeholder)
│   │   ├── sudoku/             # Sudoku Montessori
│   │   ├── suites-logiques/    # Suites Logiques
│   │   ├── tangram/            # Tangram (placeholder)
│   │   └── collection/         # Système de collection
│   └── (parent)/               # Espace Parents
│       ├── index.tsx           # Dashboard parent
│       └── settings.tsx        # Paramètres
│
├── src/
│   ├── components/
│   │   ├── activities/         # Composants d'activités (Labyrinthe)
│   │   ├── assistant/          # Assistant IA / Mascotte
│   │   ├── background/         # Décor forêt animée (Home V10)
│   │   │   └── animals/        # Animaux animés
│   │   ├── collection/         # Système de cartes à collectionner
│   │   ├── common/             # UI réutilisables
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── BackButton.tsx
│   │   │   ├── GameModal.tsx
│   │   │   ├── PageContainer.tsx
│   │   │   ├── ParentGate.tsx
│   │   │   └── VictoryCard.tsx
│   │   ├── decorations/        # Éléments décoratifs
│   │   ├── home/               # Composants Home
│   │   │   ├── HomeHeaderV9.tsx
│   │   │   ├── GameCardV9.tsx
│   │   │   ├── CategoryRow.tsx
│   │   │   ├── PiouMascot.tsx
│   │   │   └── widgets/        # Widgets (Streak, Garden, Collection, Piou)
│   │   ├── layout/             # Containers de mise en page
│   │   └── parent/             # Dashboard parent complet
│   │
│   ├── games/                  # Implémentation des jeux
│   │   ├── registry.ts         # Registre central des jeux
│   │   ├── balance/            # Balance Logique
│   │   │   ├── components/
│   │   │   ├── hooks/useBalanceGame.ts
│   │   │   ├── logic/balanceEngine.ts
│   │   │   ├── data/
│   │   │   └── screens/
│   │   ├── hanoi/              # Tour de Hanoï (complet)
│   │   │   ├── components/
│   │   │   │   └── feedback/   # Victoire, confettis, cartes
│   │   │   ├── hooks/useHanoiGame.ts
│   │   │   ├── logic/
│   │   │   │   ├── hanoiEngine.ts
│   │   │   │   ├── moveValidator.ts
│   │   │   │   └── cardAwardEngine.ts
│   │   │   ├── data/
│   │   │   │   ├── levels.ts
│   │   │   │   ├── assistantScripts.ts
│   │   │   │   └── collectibleCards.ts
│   │   │   └── screens/
│   │   ├── math-blocks/        # MathBlocks
│   │   ├── sudoku/             # Sudoku Montessori
│   │   └── suites-logiques/    # Suites Logiques
│   │
│   ├── hooks/                  # Hooks globaux
│   │   ├── useCardUnlock.ts
│   │   ├── useChildProfile.ts
│   │   ├── useGamesProgress.ts
│   │   ├── useHomeData.ts
│   │   └── useSound.ts
│   │
│   ├── store/                  # État Zustand
│   │   ├── useStore.ts         # Store principal
│   │   └── slices/
│   │       ├── profileSlice.ts
│   │       ├── progressSlice.ts
│   │       ├── collectionSlice.ts
│   │       ├── gameSessionSlice.ts
│   │       ├── goalsSlice.ts
│   │       └── screenTimeSlice.ts
│   │
│   ├── theme/                  # Design System
│   │   ├── index.ts
│   │   ├── colors.ts           # Palette complète (~234 lignes)
│   │   ├── typography.ts       # Fredoka, Nunito
│   │   ├── spacing.ts          # Grille 4pt
│   │   └── touchTargets.ts     # 64dp minimum enfant
│   │
│   ├── types/                  # Types TypeScript
│   │   ├── game.types.ts
│   │   ├── home.types.ts
│   │   ├── parent.types.ts
│   │   └── assistant.types.ts
│   │
│   ├── data/                   # Données statiques
│   │   ├── cards.ts            # Cartes collectibles
│   │   └── gamesConfig.ts
│   │
│   ├── i18n/                   # Internationalisation
│   └── utils/
│
├── assets/                     # Images, sons, polices
│   ├── images/
│   ├── sounds/
│   └── AppIcons/
│
├── docs/                       # Documentation technique
│   └── Etat-Historique/        # Documents d'état et historique (rapports, synthèses)
└── Fiches Educatives/          # Spécifications pédagogiques
    ├── 01-Tour de Hanoï/
    ├── 02-suites-logiques/
    ├── 03-labyrinthe/
    ├── 04-balance/
    └── 05-sudoku/
```

### Structure Standard d'un Jeu

```
src/games/{nomJeu}/
├── index.ts                    # Exports publics
├── types.ts                    # Types TypeScript
├── components/
│   ├── index.ts
│   ├── {Element}.tsx           # Composants UI spécifiques
│   └── feedback/               # Composants de victoire
├── hooks/
│   └── use{NomJeu}Game.ts      # Hook principal (~400 lignes)
├── logic/
│   ├── {nomJeu}Engine.ts       # Logique pure (pas de React)
│   └── validator.ts            # Validation des actions
├── data/
│   ├── levels.ts               # Configuration des niveaux
│   ├── assistantScripts.ts     # Scripts mascotte IA
│   └── themes.ts               # Thèmes visuels (optionnel)
└── screens/
    ├── index.ts
    ├── {NomJeu}IntroScreen.tsx
    └── {NomJeu}VictoryScreen.tsx
```

---

## 5. CARACTÉRISTIQUES PAR ÂGE

| Âge | Attention | Touch Target | Requis | Interface |
|-----|-----------|--------------|--------|-----------|
| **6-7 ans** | 8-10 min | 80 dp | Audio + Icônes obligatoires | Sessions très courtes |
| **8-9 ans** | 10-15 min | 64 dp | Texte court accepté | Niveaux de difficulté |
| **9-10 ans** | 15-20 min | 64 dp | Autonomie | UI mature, éviter "bébé" |

**Référence** : Khan Academy Kids adapte son contenu par tranche d'âge

---

## 6. RÈGLES UX ENFANT (Non négociables)

### Principes Fondamentaux
- **Aucun texte long** — Phrases de 5-10 mots maximum
- **Une action = un objectif clair**
- **Feedback immédiat** sur chaque interaction
- **Aucune sanction** — Jamais de feedback punitif
- **Pas de chronomètre stressant** — Respect du rythme
- **Pas de compétition** — Pas de classements entre enfants
- **Navigation par icônes** — 100% compréhensible sans lire
- **Boutons larges** — Zones tactiles généreuses
- **Animations douces** — Lentes et apaisantes

### Navigation
1. **Profondeur maximale : 3 niveaux** — Retour à l'accueil en 2 taps max
2. **Pas de menu hamburger** — Les enfants ne comprennent pas
3. **Bouton retour** : Flèche gauche, toujours coin supérieur gauche
4. **Lancement immédiat** pour les 6-7 ans

---

## 7. ZONES TACTILES ET INTERACTIONS

### Tailles Obligatoires

| Élément | Minimum | Recommandé Enfant |
|---------|---------|-------------------|
| Boutons principaux | 48 × 48 dp | **64 × 64 dp** |
| Icônes interactives | 44 × 44 pt | **60 × 60 dp** |
| Éléments draggables | — | **80 × 80 dp** |
| Cartes de jeu (Home) | 200 × 120 dp | **320 × 180 dp** |
| Espacement éléments | 8 dp | **16-24 dp** |

### Gestes

**✓ Recommandés :**
- Tap simple (un doigt)
- Drag & drop basique
- Swipe horizontal/vertical
- Long press (avec feedback visuel)

**✗ À éviter :**
- Double tap
- Gestes multi-doigts complexes
- Rotation à deux doigts
- Swipe avec timing précis

---

## 8. PALETTE DE COULEURS

```typescript
// src/theme/colors.ts

export const Colors = {
  // Couleurs principales
  primary: '#5B8DEE',        // Bleu confiance
  primaryDark: '#4A7BD9',
  primaryLight: '#8BB0F4',
  
  secondary: '#FFB347',      // Orange chaleureux
  secondaryDark: '#FFA020',
  secondaryLight: '#FFD699',
  
  success: '#7BC74D',        // Vert validation
  successDark: '#5FB030',
  successLight: '#A8E080',
  
  accent: '#E056FD',         // Violet ludique
  accentDark: '#C840E0',
  accentLight: '#F0A0FF',
  
  attention: '#F39C12',      // Jaune indices/aide
  attentionDark: '#E08900',
  attentionLight: '#FFD966',
  
  // Fond
  background: '#FFF9F0',     // Crème apaisant
  backgroundWarm: '#FFF5E6',
  surface: '#FFFFFF',
  
  // Texte
  textPrimary: '#2D3748',
  textSecondary: '#4A5568',
  textMuted: '#718096',
  textOnPrimary: '#FFFFFF',
  
  // États
  error: '#E17055',          // Orange doux (PAS de rouge agressif)
  disabled: '#CBD5E0',
};

// Gradients
export const Gradients = {
  primary: ['#5B8DEE', '#4A7BD9'],
  secondary: ['#FFB347', '#FFA020'],
  success: ['#7BC74D', '#5FB030'],
  accent: ['#E056FD', '#C840E0'],
  progress: ['#5B8DEE', '#E056FD'],
};
```

### Règles d'Accessibilité
- **Contraste WCAG AA** : 4.5:1 pour texte, 3:1 pour graphiques
- **Daltonisme** : Toujours combiner couleur + forme/icône
- **Pas de couleurs vives sur fond vif** : Préférer fonds neutres

---

## 9. TYPOGRAPHIE

```typescript
// src/theme/typography.ts

export const FontFamily = {
  heading: 'Fredoka',        // Titres, boutons
  body: 'Nunito',            // Texte courant
  accessible: 'Nunito',      // Dyslexie-friendly
};

export const FontSize = {
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  bodyLarge: 20,
  body: 18,                  // MINIMUM pour enfants
  bodySmall: 16,
  button: 18,
  buttonLarge: 22,
};
```

### Règles de Rédaction
- Phrases courtes : 5-10 mots maximum
- Vocabulaire simple et concret
- Éviter les négations ("Ne pas..." → "Essaie plutôt...")
- Tutoiement bienveillant
- Toujours accompagner le texte d'une icône

---

## 10. SYSTÈME DE FEEDBACK

### Feedback Positif (réussite)
- **Visuel** : Confettis, étoiles, personnage qui danse
- **Son** : Court (<2s), mélodique, non strident
- **Message** : "Super !", "Bravo !", "Tu as compris !"
- **Progression** : Jauge qui se remplit, étoiles qui s'allument

### Feedback sur Erreur (JAMAIS punitif)
- **Pas de son négatif** — Son neutre/doux
- **Pas de rouge agressif** — Orange doux ou animation subtile
- **Message constructif** : "Essaie encore !", "Presque !"
- **Indice progressif** : Après 2 erreurs, proposer un indice

### Récompenses (non compétitives)
- **Badges d'effort** : "Persévérant", "Curieux"
- **Collection de cartes** : Animaux à débloquer
- **Jardin qui grandit** : Fleurs avec la progression
- **Séries quotidiennes** : "5 jours d'affilée !"

---

## 11. ANIMATIONS (Reanimated 3)

### Principes
- **Fluidité 60 FPS** obligatoire
- **Durée** : 200-400ms transitions, 500-1000ms célébrations
- **Easing** : ease-out apparitions, ease-in-out mouvements
- **Option réduction** : Respecter préférences système

### Animations Essentielles

| Contexte | Animation |
|----------|-----------|
| Tap bouton | Scale 0.95 → 1.0 avec spring (damping: 15) |
| Bonne réponse | Confettis + scale up + son joyeux |
| Mauvaise réponse | Shake horizontal léger (3x) + retour doux |
| Drag & drop | Suit doigt + ombre + zone cible s'illumine |
| Niveau complété | Mascotte + étoiles + fanfare + carte |
| Indice disponible | Pulsation douce ampoule (glow) |
| Carte de jeu hover | translateY -5dp + scale 1.02 |

```typescript
// Exemple animation Reanimated 3
const animatedStyle = useAnimatedStyle(() => ({
  transform: [
    { scale: withSpring(1, { damping: 15, stiffness: 150 }) },
    { translateY: withTiming(0, { duration: 300 }) },
  ],
}));
```

---

## 12. HOME V10 — FORÊT MAGIQUE IMMERSIVE

### Philosophie
Le décor de forêt magique couvre 100% de l'écran (1194×834px iPad). Le contenu scrollable flotte au-dessus de ce paysage vivant.

### Architecture en Couches (Z-Index)

| Z | Couche | Contenu |
|---|--------|---------|
| 0-5 | Background | Ciel (gradient 7 couleurs), montagnes, soleil, nuages |
| 6-8 | Décor | Collines (6), arbres (16), buissons |
| 9-11 | Vie | Jardin (7 fleurs emoji), papillons (3), animaux |
| 30 | Content | ScrollView (header, widgets, cartes de jeu) |
| 50 | Floating | Piou volant + Livre de collection flottant |

### Palette Forêt

| Élément | Couleurs |
|---------|----------|
| Ciel | #87CEEB → #7BC74D (gradient 7 couleurs) |
| Soleil | #FFD93D avec halo |
| Montagnes lointaines | #6B8E7B, #5A7D6A |
| Montagnes proches | #4A6D5A, #3D5C4A |
| Collines | #5BAE6B, #6BC77B |
| Arbres tronc | #8B5A2B, #6B4423 |
| Arbres feuillage | #3D8B4F, #2D6B3F |
| Piou corps | #C9A86C, #A68B5B |
| Piou ventre | #F5E6D3 |
| Piou bec | #FFB347 |

### Animations Décor

| Élément | Animation | Durée |
|---------|-----------|-------|
| Nuages | translateX infini | 35-50s |
| Soleil | scale pulse 1.0→1.05 | 4s |
| Fleurs | rotate ±5° sway | 3s |
| Papillons | vol en 8 organique | 8s |
| Oiseaux | traversée écran | 14-22s |
| Écureuil | aller-retour + flip | 28s |
| Lapin | sauts avec rebonds | 22s |
| Piou | vol stationnaire + ailes | 6s |
| Collection | flottement magique | 5s |

### Cartes de Jeu V10
- **Taille** : 320 × 180 dp (ratio 16:9)
- **Espacement** : 60 dp
- **Disposition** : 3 cartes par ligne max
- **Border-radius** : 20 dp
- **Animation press** : translateY -5dp + scale 1.02

### Système de Médailles

| Médaille | Couleurs | Signification |
|----------|----------|---------------|
| 🥉 Bronze | #CD7F32 → #8B5A2B | Niveau débutant |
| 🥈 Argent | #C0C0C0 → #909090 | Intermédiaire |
| 🥇 Or | #FFD700 → #FFA500 | Avancé |
| 💎 Diamant | #B9F2FF → #00CED1 | Excellence |
| 🔒 Verrouillé | rgba(255,255,255,0.2) | Non débloqué |

---

## 13. MASCOTTES

| Mascotte | Emoji | Jeu/Contexte | Personnalité |
|----------|-------|--------------|--------------|
| **Piou** | 🦉 | Global/Home | Guide bienveillant, encourage |
| **Luna** | 🌙 | Attention | Calme, observatrice |
| **Pixel** | 🤖 | Suites Logiques | Curieux, analytique |
| **Noisette** | 🐿️ | Mémoire | Énergique, joueur |
| **Dr. Hibou** | 🎓 | Balance | Sage, patient |
| **Félix** | 🦊 | Stratégie/Hanoï | Rusé, stratège |
| **Gédéon** | 🐹 | Ingénierie | Bricoleur, inventif |
| **Plume** | 📖 | Compréhension | Conteur, expressif |

### Règles IA Mascotte
1. N'intervient JAMAIS sans action de l'enfant
2. Donne des indices, JAMAIS la solution complète
3. Ton calme, simple, rassurant
4. Pose des questions pour guider la réflexion

---

## 14. 18 ACTIVITÉS PRÉVUES

### Priorités de Développement

| # | Activité | Catégorie | Compétence | Priorité |
|---|----------|-----------|------------|----------|
| 1 | Le Conteur Curieux 📚 | Compréhension | Lecture, vocabulaire | ⭐⭐⭐⭐⭐ |
| 2 | Matrices Magiques 🔮 | Raisonnement | Patterns, inductif | ⭐⭐⭐⭐ |
| 3 | L'Intrus Mystère 🔍 | Catégorisation | Classification | ⭐⭐⭐⭐ |
| 4 | Embouteillage 🚗 | Planification | Anticipation | ⭐⭐⭐⭐ |
| 5 | La Fabrique de Réactions ⚙️ | Ingénierie | Cause → Effet | ⭐⭐⭐⭐⭐ |
| 6 | Code Secret 🔐 | Déduction | Élimination | ⭐⭐⭐⭐ |
| 7 | Chasseur de Papillons 🦋 | Attention | Tracking visuel | ⭐⭐⭐ |

### Jeux Implémentés

| Jeu | Status | Compétences |
|-----|--------|-------------|
| Tour de Hanoï 🏰 | ✅ Complet | Planification, récursivité |
| Sudoku Montessori 🔢 | ✅ Complet | Déduction, logique |
| MathBlocks 🧮 | ✅ Complet | Calcul mental, patterns |
| Suites Logiques 🔮 | ✅ Complet | Raisonnement inductif |
| Balance Logique ⚖️ | ✅ Complet | Équivalences, mesure |
| Labyrinthe 🗺️ | ⏳ En cours | Spatial, planification |
| Memory 🧠 | 📋 Placeholder | Mémoire visuelle |
| Tangram 🧩 | 📋 Placeholder | Spatial, géométrie |

### Catégories Complètes (18 activités)

**Attention** : Chasseur de Papillons, Écoute Attentive  
**Flexibilité** : Caméléon des Règles, Double Mission  
**Raisonnement** : Matrices Magiques, L'Intrus Mystère, Dominos Enchantés, Analogies Visuelles  
**Spatial** : Miroir Magique, Cube Explorer  
**Planification** : Embouteillage, Tour de Hanoï  
**Vitesse** : Flash Memory, Course aux Calculs  
**Déduction** : Code Secret, Qui est-ce Logique  
**Créativité** : Combien d'Usages ?  
**Ingénierie** : La Fabrique de Réactions  
**Compréhension** : Le Conteur Curieux

---

## 15. ASSISTANT IA PÉDAGOGIQUE

### Rôle
L'IA agit comme un **compagnon bienveillant**, jamais comme un professeur.

### Exemples de Dialogues

**Avant de commencer :**
```
"Salut ! Tu vois ces disques ? On va les déplacer là-bas.
Mais attention, un grand disque ne peut pas aller sur un petit !
Tu veux essayer ?"
```

**Après une erreur :**
```
"Hmm, ce disque est trop grand pour aller ici.
Regarde : le disque en dessous est plus petit.
Tu peux essayer un autre pilier ?"
```

**Indice contextuel :**
```
"Tu veux déplacer ce disque.
Est-ce qu'il peut aller ici sans écraser le plus petit ?"
```

**Après réussite :**
```
"Bravo ! Tu as trouvé la méthode.
Tu as vu ? Il fallait d'abord déplacer les petits disques.
C'est comme ça qu'on résout les grands problèmes : étape par étape !"
```

---

## 16. ESPACE PARENT

### Accès Sécurisé
- **Gate parentale** : Calcul simple (ex: "15 + 27 = ?") ou PIN 4 chiffres
- **FaceID/TouchID** : Option pour accès rapide
- **Icône discrète** : Petit cadenas en haut à droite

### Contenu

| Fonctionnalité | Description |
|----------------|-------------|
| **Tableau de bord** | Temps de jeu, activités complétées, progression |
| **Fiches pédagogiques** | Objectifs de chaque activité |
| **Conseils d'accompagnement** | Comment aider sans interférer |
| **Paramètres temps** | Limite quotidienne, rappels pause |
| **Transfert vie quotidienne** | Activités réelles liées aux apprentissages |
| **Radar compétences** | Visualisation des points forts |
| **Insights comportementaux** | Analyse IA du style d'apprentissage |

---

## 17. SÉCURITÉ ET CONFIDENTIALITÉ

### Règles Obligatoires
- **Pas de publicité** — Aucune pub, aucun lien externe
- **Pas de collecte données enfant** — Conformité COPPA/RGPD
- **Pas de chat** — Aucune fonctionnalité sociale
- **Pas d'achats in-app accessibles** — Tout achat derrière gate parentale
- **Mode hors-ligne** — L'app doit fonctionner sans internet

---

## 18. WORKFLOW HTML → REACT NATIVE

### Processus
1. **Claude Web** génère le HTML de maquette
2. **Brief React Native** produit en même temps (INSTRUCTION_HTML_BRIEF.md)
3. **Claude Code** implémente avec le brief comme spec

### Correspondances CSS → React Native

| CSS | React Native |
|-----|--------------|
| `linear-gradient` | `<LinearGradient>` expo-linear-gradient |
| `box-shadow` | `shadowColor/Offset/Opacity/Radius` + `elevation` |
| `border-radius: 50%` | `borderRadius: width/2` |
| `@keyframes` | Reanimated worklets |
| `transition` | `withTiming/withSpring` |
| `:hover` | `Pressable` states |
| `vh/vw` | `Dimensions.get('window')` |
| `gap` | `gap` (RN 0.71+) ou `margin` |

---

## 19. CONVENTIONS DE CODE

### Nommage

| Type | Convention | Exemple |
|------|------------|---------|
| Composant | PascalCase | `GameCard.tsx` |
| Hook | camelCase + use | `useHanoiGame.ts` |
| Type | PascalCase | `GameMetadata` |
| Fichier logique | camelCase | `hanoiEngine.ts` |
| Constante | SCREAMING_SNAKE | `MAX_DISKS` |
| Dossier | kebab-case | `math-blocks/` |

### Imports Recommandés

```typescript
// Theme
import { colors, typography, spacing } from '@/theme';

// Composants communs
import { Button, Card, PageContainer } from '@/components/common';

// Jeu spécifique
import { useHanoiGame } from './hooks/useHanoiGame';
import type { GameState } from './types';
```

### Qualité Code
- Fonctions courtes (< 30 lignes)
- Nommage explicite en anglais
- Commentaires sur logique complexe
- Séparation stricte logique / UI
- TypeScript strict mode

---

## 20. TEMPLATE FICHE ACTIVITÉ

### Fiche Activité
```markdown
- **Nom du jeu** : [Nom]
- **Tranche d'âge** : [6-7 / 8-9 / 9-10 ans]
- **Objectif pédagogique** : [Ce que l'enfant apprend]
- **Type de raisonnement** : [Déductif, inductif, spatial, etc.]
- **Méthode enseignée** : [Processus de réflexion explicité]
- **Déroulement UX** : [Flow écran par écran]
- **Éléments UI clés** : [Composants visuels]
- **Système de feedback** : [Réactions visuelles/sonores]
- **Script IA exemple** : [Dialogue mascotte]
```

### Fiche Parent Associée
```markdown
- **Objectifs détaillés** : [Explication pour les parents]
- **Compétences mobilisées** : [Liste complète]
- **Conseils d'accompagnement** : [Aider sans interférer]
- **Signaux de progression** : [Comment savoir si progrès]
- **Transfert vie quotidienne** : [Applications concrètes]
```

---

## 21. CHECKLIST VALIDATION

### Avant Chaque Release

**Accessibilité :**
- [ ] Zones tactiles ≥ 64×64 dp
- [ ] Contraste texte ≥ 4.5:1
- [ ] Pas de couleur seule pour l'information
- [ ] Police ≥ 18 pt pour texte courant

**Navigation :**
- [ ] Profondeur ≤ 3 niveaux
- [ ] Retour accueil en ≤ 2 taps
- [ ] Actions compréhensibles sans lire
- [ ] Pas de menu hamburger

**Feedback :**
- [ ] Feedback visuel immédiat
- [ ] Pas de feedback négatif punitif
- [ ] Animations 60 FPS
- [ ] Sons optionnels et désactivables

**Sécurité :**
- [ ] Espace parent protégé
- [ ] Pas de liens externes
- [ ] Fonctionne hors-ligne
- [ ] Pas de collecte données

**Home V10 :**
- [ ] Background couvre 100% écran
- [ ] Animations décor fluides
- [ ] Cartes 320×180dp, espacement 60dp
- [ ] Piou et Collection flottants visibles
- [ ] Z-index respectés

**Pédagogie :**
- [ ] Méthode explicite, pas juste résultat
- [ ] L'IA ne donne jamais la réponse
- [ ] Erreur = opportunité d'apprendre

---

## 22. COMMANDES SLASH DISPONIBLES

Les commandes suivantes automatisent le chargement du contexte approprié :

| Commande | Description | Contexte chargé |
|----------|-------------|-----------------|
| `/nouveau-jeu <nom>` | Créer un nouveau jeu complet | TRAME_REFERENTIEL, PROJECT_STRUCTURE, MASCOTTES_REGISTRY |
| `/nouveau-composant <Nom>` | Créer un composant UI | UI_COMPONENTS_CATALOG, DESIGN_SYSTEM |
| `/fiche-educative <XX-Nom>` | Créer les 4 fiches d'un jeu | Templates Fiches Educatives |
| `/audit` | Audit complet du projet | GUIDELINES_AUDIT, DESIGN_SYSTEM |
| `/sync-docs` | Synchroniser la documentation | 00-INDEX_UPDATED |

### Utilisation
```bash
# Créer un nouveau jeu
/nouveau-jeu chasseur-papillons

# Créer un composant
/nouveau-composant ProgressBar common

# Audit du projet
/audit
```

---

## 23. RESSOURCES PROJET

| Document | Chemin |
|----------|--------|
| **Index documentation** | `/docs/00-INDEX_UPDATED.md` |
| **Trame Référentiel** | `/docs/TRAME_REFERENTIEL.md` |
| Design System | `/docs/DESIGN_SYSTEM.md` |
| Structure Projet | `/docs/PROJECT_STRUCTURE.md` |
| Règles Claude Code | `/docs/CLAUDE_CODE_RULES.md` |
| Composants UI | `/docs/UI_COMPONENTS_CATALOG.md` |
| Guide UX/UI Enfant | `/docs/GUIDE_UX_UI_APP_EDUCATIVE.md` |
| Instructions Projet | `/docs/INSTRUCTIONS_PROJET_APP_EDUCATIVE.md` |
| Fiches Éducatives | `/Fiches Educatives/` |
| **État/Historique** | `/docs/Etat-Historique/` |

### Règle Documentation

**Documents d'état ou historique** (rapports d'audit, synthèses, vérifications) doivent être créés dans `/docs/Etat-Historique/` et non à la racine de `/docs/`.

---

## 24. RÈGLE FINALE

**Toujours privilégier :**

1. 🧒 **L'enfant** avant la technique
2. 🎯 **L'expérience** avant la performance
3. 📚 **La pédagogie** avant la gamification
4. ✨ **La clarté** avant la rapidité d'exécution

> Tu construis la base d'une application éducative premium, durable et évolutive.
> Chaque ligne de code doit servir l'apprentissage de l'enfant.

---

## RÉFÉRENCES

- **Khan Academy Kids** : Leçons 3-5 min, +50% complétion avec feedback positif
- **Duolingo Kids** : Boutons extra-larges, +15% réussite des tâches
- **Toca Boca** : Menus simples, 3-5 choix max, environnement 100% sûr
- **Endless Alphabet** : Animations + audio pour expliquer sans texte

---

*Document d'instructions pour Claude Code*  
*Version 3.0 • Projet App Éducative iPad "Hello Guys"*  
*Dernière mise à jour : Décembre 2024*
