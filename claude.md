# CLAUDE.md — Instruction Projet Complète
## Application Éducative iPad pour Enfants 6-10 ans
### Stack : React Native + Expo • TypeScript

---

## 1. VISION PRODUIT & PHILOSOPHIE

### Identité du Projet
- **Nom de code** : "Hello Guys"
- **Plateforme cible** : iPad (support iPhone secondaire)
- **Public** : Enfants 6-10 ans + Interface parent dédiée
- **Inspiration** : Khan Academy Kids, Duolingo, Toca Boca, Endless Alphabet, Ecole Montessori

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
- Logique séquentielle et spatiale
- Planification et anticipation
- Mémoire de travail
- Résolution de problèmes
- Raisonnement déductif

---

## 3. STACK TECHNIQUE

### Technologies Imposées
```
Frontend :
- React Native + Expo (SDK 52+)
- TypeScript obligatoire
- React Native Reanimated 3 (animations 60fps)
- Expo Router (navigation par gestes)

Stockage :
- AsyncStorage pour progression locale
- Pas de backend complexe au démarrage

Orientation :
- Paysage prioritaire (iPad)
- Support portrait secondaire
```

### Structure de Fichiers

```
/src
├── /core
│   ├── pedagogy/
│   │   ├── progression.ts      # Système de progression Montessori
│   │   ├── feedback.ts         # Logique de feedback bienveillant
│   │   └── difficulty.ts       # Adaptation du niveau
│   ├── ai/
│   │   └── childAssistant.ts   # Assistant IA pédagogique
│   └── types/
│       └── game.ts             # Types partagés
│
├── /games
│   └── hanoi/                  # Premier jeu : Tour de Hanoï
│       ├── HanoiGame.tsx       # Composant principal
│       ├── HanoiLogic.ts       # Logique métier (séparée de l'UI)
│       ├── HanoiUI.tsx         # Composants visuels
│       ├── hanoi.levels.ts     # Configuration des niveaux
│       └── hanoi.assets.ts     # Assets (images, sons)
│
├── /ui
│   ├── components/
│   │   ├── ButtonLarge.tsx     # Bouton 64x64 dp minimum
│   │   ├── Card.tsx
│   │   ├── FeedbackBubble.tsx  # Bulles d'encouragement
│   │   └── ProgressBar.tsx
│   └── theme/
│       ├── colors.ts           # Palette définie ci-dessous
│       ├── spacing.ts          # Espacements enfant
│       └── typography.ts       # Polices accessibles
│
├── /screens
│   ├── /child                  # Espace enfant
│   └── /parent                 # Espace parent (PIN/FaceID)
│
├── /navigation
│   └── AppNavigator.tsx
│
├── /hooks                      # Logique réutilisable
├── /context                    # État global
├── /services                   # API, stockage
├── /constants                  # Valeurs fixes
└── /assets                     # Images, sons, polices
```

### Règle Architecture
**Séparation stricte logique métier / UI.** La logique de jeu doit fonctionner indépendamment des composants visuels.

---

## 4. CARACTÉRISTIQUES PAR ÂGE

| Âge | Capacités | Implications UX |
|-----|-----------|-----------------|
| **6-7 ans** | Lecture débutante, attention 8-10 min, motricité en développement | Icônes + audio obligatoires, sessions très courtes, zones tactiles extra-larges |
| **8-9 ans** | Lecture acquise, attention 10-15 min, recherche de défis | Texte court accepté, niveaux de difficulté, systèmes de progression |
| **9-10 ans** | Autonomie accrue, attention 15-20 min, sensibilité au "bébé" | Interface plus mature, défis complexes, éviter l'aspect "enfantin" |

**Référence** : Khan Academy Kids adapte son contenu par tranche d'âge avec des parcours personnalisés

---

## 5. RÈGLES UX ENFANT (Non négociables)

### Principes Fondamentaux
- **Aucun texte long** — Phrases de 5-10 mots maximum
- **Une action = un objectif clair**
- **Feedback immédiat** sur chaque interaction
- **Aucune sanction** — Jamais de feedback punitif
- **Pas de chronomètre** — Respect du rythme
- **Pas de compétition** — Pas de classements
- **Navigation par icônes** — 100% compréhensible sans lire
- **Boutons larges** — Zones tactiles généreuses
- **Animations douces** — Lentes et apaisantes

### Navigation
1. **Profondeur maximale : 3 niveaux** — Retour à l'accueil en 2 taps max
2. **Pas de menu hamburger** — Les enfants ne comprennent pas cette convention
3. **Bouton retour** : Flèche gauche universelle, toujours coin supérieur gauche
4. **Lancement immédiat** pour les 6-7 ans (pas d'écran d'accueil complexe)

**Référence** : Toca Boca utilise des menus visuels avec 3-5 choix maximum par écran

---

## 6. ZONES TACTILES ET INTERACTIONS

### Tailles Obligatoires

| Élément | Minimum | Recommandé Enfant |
|---------|---------|-------------------|
| Boutons principaux | 48 × 48 dp | **64 × 64 dp** |
| Icônes interactives | 44 × 44 pt | **60 × 60 dp** |
| Éléments draggables | — | **80 × 80 dp** |
| Espacement entre éléments | 8 dp | **16-24 dp** |

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

**Référence** : Duolingo Kids utilise des boutons extra-larges (+15% de taux de réussite)

---

## 7. PALETTE DE COULEURS

```typescript
// /src/ui/theme/colors.ts

export const colors = {
  // Couleurs principales
  primary: '#5B8DEE',      // Bleu confiance — Boutons principaux, navigation
  secondary: '#FFB347',    // Orange chaleureux — Accents, CTA secondaires
  success: '#7BC74D',      // Vert validation — Réussite, progression
  accent: '#E056FD',       // Violet ludique — Éléments fun, surprises
  background: '#FFF9F0',   // Crème apaisant — Fond principal
  attention: '#F39C12',    // Jaune — Indices, aide, zones d'attention
  
  // Texte
  textPrimary: '#2D3436',  // Gris foncé lisible
  textSecondary: '#636E72',
  textMuted: '#B2BEC3',
  
  // États
  error: '#E17055',        // Orange doux (PAS de rouge agressif)
  disabled: '#DFE6E9',
  
  // Fond
  surface: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.3)',
};
```

### Règles d'Accessibilité Couleurs
- **Contraste WCAG AA** : 4.5:1 pour texte, 3:1 pour graphiques
- **Daltonisme** : 8% des garçons sont daltoniens → toujours combiner couleur + forme/icône
- **Mode daltonien** : Prévoir icônes distinctives (succès = check, erreur = X)
- **Pas de couleurs vives sur fond vif** : Préférer fonds neutres

**Référence** : Duolingo utilise des couleurs vives mais toujours sur fond blanc/neutre

---

## 8. TYPOGRAPHIE

### Polices Recommandées

| Police | Usage | Avantage |
|--------|-------|----------|
| **Nunito / Nunito Sans** | Texte principal | Ronde, amicale, très lisible |
| **Fredoka One** | Titres, boutons | Ludique mais lisible |
| **OpenDyslexic** | Option accessibilité | Conçue pour la dyslexie |
| **Lexie Readable** | Alternative dyslexie | Plus discrète |

### Tailles

```typescript
// /src/ui/theme/typography.ts

export const typography = {
  titleLarge: 32,      // Titres principaux (28-32 pt min)
  titleMedium: 26,
  buttonText: 22,      // Texte bouton (20-24 pt min)
  body: 20,            // Texte courant (18-22 pt, jamais < 16)
  caption: 16,
  
  lineHeight: 1.5,     // Interligne 1.4-1.6
  maxLineLength: 60,   // 45-75 caractères max par ligne
};
```

### Règles de Rédaction
- Phrases courtes : 5-10 mots maximum
- Vocabulaire simple et concret
- Éviter les négations ("Ne pas..." → "Essaie plutôt...")
- Tutoiement bienveillant
- Toujours accompagner le texte d'une icône

**Référence** : Endless Alphabet utilise animations + audio pour expliquer sans texte

---

## 9. SYSTÈME DE FEEDBACK

### Feedback Positif (Réussite)

```typescript
// Exemple d'implémentation
const successFeedback = {
  visual: 'confetti',           // Animation confettis/étoiles
  sound: 'success_chime.mp3',   // Son court < 2sec, mélodique
  message: ['Super !', 'Bravo !', 'Tu as compris !', 'Bien joué !'],
  haptic: 'light',              // Vibration légère
};
```

### Feedback sur Erreur (JAMAIS punitif)

```typescript
const errorFeedback = {
  visual: 'gentle_shake',       // Shake horizontal léger (3x)
  sound: 'soft_pop.mp3',        // Son neutre/doux, PAS de buzzer
  message: ['Essaie encore !', 'Presque !', 'Tu y es presque !'],
  color: '#E17055',             // Orange doux, PAS rouge agressif
  returnAnimation: 'ease_back', // Retour doux à la position
  hintAfterErrors: 2,           // Proposer indice après 2 erreurs
};
```

### Messages d'Erreur Spécifiques (Tour de Hanoï)
```
"Regarde bien, ce disque est un peu trop grand."
"Ce disque ne peut pas aller ici. Cherche un autre pilier."
"Hmm, le petit disque est en dessous. Que peux-tu faire ?"
```

### Messages de Succès Spécifiques
```
"Bien joué, tu avais un plan !"
"Tu as trouvé la bonne méthode !"
"Excellent, tu réfléchis comme un champion !"
```

### Système de Récompenses (Non compétitif)
- **Badges d'effort** : "Persévérant", "Curieux", "10 essais aujourd'hui"
- **Collection personnelle** : Objets à débloquer pour avatar
- **Monde qui grandit** : Visualisation de la progression globale
- **Séries quotidiennes** : "5 jours d'affilée !" (sans pression)

**Référence** : Khan Academy Kids utilise sons positifs et animations pour +50% de taux de complétion

---

## 10. ANIMATIONS

### Principes

```typescript
// Configuration animations
export const animationConfig = {
  fps: 60,                        // Fluidité obligatoire
  transitionDuration: 300,        // 200-400ms pour transitions
  celebrationDuration: 800,       // 500-1000ms pour célébrations
  easing: {
    appear: 'ease-out',
    move: 'ease-in-out',
    bounce: 'spring',
  },
  respectReduceMotion: true,      // Préférences système
};
```

### Animations par Contexte

| Contexte | Animation |
|----------|-----------|
| Tap bouton | Scale 0.95 → 1.0 avec bounce léger |
| Bonne réponse | Confettis + scale up + son joyeux |
| Mauvaise réponse | Shake horizontal léger (3x) + retour doux |
| Drag & drop | Élément suit doigt + ombre portée + zone cible s'illumine |
| Niveau complété | Animation mascotte + étoiles + fanfare |
| Indice disponible | Pulsation douce icône ampoule (glow) |

---

## 11. JEU 1 — TOUR DE HANOÏ

### Objectifs Pédagogiques
- Comprendre et respecter une règle
- Anticiper les conséquences d'une action
- Structurer une suite logique
- Apprendre par l'erreur sans frustration
- **Méthode enseignée** : Décomposition récursive d'un problème complexe

### Règles du Jeu
1. Un seul disque déplacé à la fois
2. Un disque plus grand ne peut JAMAIS être posé sur un plus petit
3. Objectif : déplacer toute la tour du pilier gauche vers le pilier droit

### Progression Montessori

| Niveau | Disques | Aide Visuelle | Assistance IA | Débloqué si |
|--------|---------|---------------|---------------|-------------|
| 1 | 3 | Forte (zones cibles illuminées) | Explication guidée | — |
| 2 | 4 | Moyenne (indices subtils) | Indices contextuels | Niveau 1 réussi 2x |
| 3 | 5 | Faible | Encouragements seuls | Niveau 2 réussi 2x |
| 4 | 6 | Aucune | Autonomie totale | Niveau 3 réussi 2x |

**La progression est proposée mais jamais imposée.**

### UI Tour de Hanoï

```
┌─────────────────────────────────────────────────────────────┐
│  [←]                    ⭐⭐⭐☆☆                    [?] [⚙]  │  ← Zone haute
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                                                             │
│         ┃           ┃           ┃                          │
│        ▄▄▄          ┃           ┃                          │
│       ▄▄▄▄▄         ┃           ┃                          │  ← Zone centrale
│      ▄▄▄▄▄▄▄        ┃           ┃                          │     (jeu)
│    ═══════════  ═══════════  ═══════════                   │
│      Départ       Milieu       Arrivée                     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│       [💡 Indice]              [↩️ Annuler]    [🔄 Rejouer]  │  ← Zone basse
└─────────────────────────────────────────────────────────────┘
```

- **Zone haute** : Navigation discrète + progression (étoiles)
- **Zone centrale** : Jeu immersif, sans distraction
- **Zone basse** : Actions principales (boutons 64x64 dp)

---

## 12. ASSISTANT IA PÉDAGOGIQUE

### Rôle
L'IA agit comme un **compagnon bienveillant**, jamais comme un professeur.

### Règles Strictes
1. **N'intervient JAMAIS sans action de l'enfant**
2. **Donne des indices, JAMAIS la solution complète**
3. **Ton calme, simple, rassurant**
4. **Pose des questions pour guider la réflexion**

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

**Encouragement :**
```
"Tu réfléchis bien ! Continue, tu y es presque."
```

**Après réussite :**
```
"Bravo ! Tu as trouvé la méthode.
Tu as vu ? Il fallait d'abord déplacer les petits disques.
C'est comme ça qu'on résout les grands problèmes : étape par étape !"
```

---

## 13. ESPACE PARENT

### Accès Sécurisé
- **Gate parentale** : Calcul simple (ex: "15 + 27 = ?") ou PIN 4 chiffres
- **FaceID/TouchID** : Option pour accès rapide
- **Icône discrète** : Petit cadenas en haut à droite

### Contenu

| Fonctionnalité | Description |
|----------------|-------------|
| **Tableau de bord** | Temps de jeu, activités complétées, progression par compétence |
| **Fiches pédagogiques** | Objectifs de chaque activité, compétences visées |
| **Conseils d'accompagnement** | Comment aider sans interférer, questions à poser |
| **Paramètres temps** | Limite quotidienne, rappels de pause, horaires autorisés |
| **Transfert vie quotidienne** | Suggestions d'activités réelles liées aux apprentissages |

**Référence** : Toca Boca utilise un "parent gate" pour protéger les paramètres

---

## 14. SÉCURITÉ ET CONFIDENTIALITÉ

### Règles Obligatoires
- **Pas de publicité** — Aucune pub, aucun lien externe
- **Pas de collecte données enfant** — Conformité COPPA/RGPD
- **Pas de chat** — Aucune fonctionnalité sociale
- **Pas d'achats in-app accessibles** — Tout achat derrière gate parentale
- **Mode hors-ligne** — L'app doit fonctionner sans internet

**Référence** : Toca Boca est reconnu pour son environnement 100% sûr

---

## 15. TEMPLATE FICHE ACTIVITÉ

Pour chaque nouvelle activité, produire :

### Fiche Activité
```markdown
- **Nom du jeu** : [Nom]
- **Tranche d'âge** : [6-7 / 7-8 / 8-9 / 9-10 ans]
- **Objectif pédagogique** : [Ce que l'enfant apprend]
- **Type de raisonnement** : [Déductif, inductif, spatial, etc.]
- **Méthode enseignée** : [Le processus de réflexion explicité]
- **Déroulement UX** : [Flow écran par écran]
- **Éléments UI clés** : [Composants visuels essentiels]
- **Système de feedback** : [Réactions visuelles/sonores]
- **Script IA exemple** : [Dialogue type pour expliquer]
```

### Fiche Parent Associée
```markdown
- **Objectifs détaillés** : [Explication pour les parents]
- **Compétences mobilisées** : [Liste complète]
- **Conseils d'accompagnement** : [Comment aider sans interférer]
- **Signaux de progression** : [Comment savoir si l'enfant progresse]
- **Transfert vie quotidienne** : [Applications concrètes]
```

---

## 16. CHECKLIST VALIDATION

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

---

## 17. ÉVOLUTIVITÉ

Le code doit permettre :
- L'ajout de nouveaux jeux logiques (Tangram, Sudoku, etc.)
- Un espace parent enrichi
- Des analytics pédagogiques locales
- Une future marketplace de jeux

**Ce projet est une fondation produit, pas un mini-jeu isolé.**

---

## 18. EXIGENCES QUALITÉ CODE

- Code lisible et structuré
- Fonctions courtes (< 30 lignes)
- Nommage explicite en anglais
- Commentaires sur logique complexe
- Séparation stricte logique / UI
- Tests unitaires sur la logique métier
- TypeScript strict mode

---

## 19. RÈGLE FINALE

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
*Version 2.0 • Projet App Éducative iPad*
*Dernière mise à jour : Décembre 2024*
