# 🎭 MASCOTTES REGISTRY — Hello Guys

> **Registre centralisé** de toutes les mascottes de l'application
> **Dernière mise à jour** : Décembre 2024

---

## 📋 Vue d'ensemble

L'application utilise des mascottes pour guider les enfants dans chaque activité. Chaque mascotte a une personnalité distincte et un style de dialogue adapté.

| Jeu | Mascotte | Emoji | Personnalité |
|-----|----------|-------|--------------|
| **Global / Home** | Piou | 🦉 | Sage, encourageant, bienveillant |
| Tour de Hanoï | Léo le Singe | 🐵 | Joueur, énergique, curieux |
| Suites Logiques | Pixel le Robot | 🤖 | Logique, méthodique, précis |
| Labyrinthe | Scout l'Écureuil | 🐿️ | Aventurier, agile, observateur |
| Balance Logique | Libra la Chouette | 🦉 | Réfléchie, équilibrée, patiente |
| Sudoku Montessori | Professeur Hoo | 🦉 | Érudit, patient, encourageant |
| Le Conteur Curieux | Plume | 🪶 | Créatif, imaginatif, doux |
| Memory | Memo l'Éléphant | 🐘 | Concentré, calme, mémorise tout |
| Puzzle Formes | Géo le Renard | 🦊 | Malin, créatif, spatial |
| Logix Grid | Ada la Fourmi | 🐜 | Organisée, méthodique, logique |
| Mots Croisés | Lexie le Perroquet | 🦜 | Bavard, joueur avec les mots |
| MathBlocks | Calc le Castor | 🦫 | Constructeur, méthodique |
| Matrices Magiques | Mystic | ✨ | Mystérieux, magique |

---

## 🦉 PIOU — Mascotte Principale

### Identité

| Attribut | Valeur |
|----------|--------|
| **Nom** | Piou |
| **Espèce** | Hibou / Chouette |
| **Emoji** | 🦉 |
| **Rôle** | Guide principal, accueil |
| **Présent sur** | Home, transitions, encouragements généraux |

### Palette de couleurs

```typescript
export const PiouColors = {
  body: {
    main: '#C9A86C',      // Beige/caramel principal
    dark: '#A68B5B',      // Ombre corps
  },
  belly: '#F5E6D3',       // Ventre crème clair
  beak: '#FFB347',        // Bec orange (secondary)
  eyes: {
    white: '#FFFFFF',
    pupil: '#2C1810',     // Marron très foncé
  },
} as const;
```

### Dialogues types

| Contexte | Message exemple |
|----------|-----------------|
| Accueil matin | "Bonjour [Prénom] ! Prêt·e pour de nouvelles aventures ?" |
| Accueil après-midi | "Coucou [Prénom] ! On continue à apprendre ?" |
| Encouragement | "Tu progresses super bien ! Continue comme ça ! 🌟" |
| Série en cours | "Wahou, [X] jours d'affilée ! Tu es incroyable !" |
| Retour après absence | "Tu m'as manqué ! Content de te revoir !" |

### Animations

| Animation | Trigger | Durée |
|-----------|---------|-------|
| Idle (flottement) | Permanent | Loop 3s |
| Clin d'œil | Aléatoire (15-30s) | 500ms |
| Battement d'ailes | Au tap | 800ms |
| Saut de joie | Victoire | 1.2s |

---

## 🐵 LÉO LE SINGE — Tour de Hanoï

### Identité

| Attribut | Valeur |
|----------|--------|
| **Nom** | Léo |
| **Espèce** | Singe |
| **Emoji** | 🐵 |
| **Personnalité** | Joueur, énergique, curieux |
| **Catchphrase** | "Réfléchis avant d'agir !" |

### Dialogues par âge

#### 6-7 ans
| Contexte | Message |
|----------|---------|
| Introduction | "Salut ! Je suis Léo ! Tu veux m'aider à déplacer ces anneaux ?" |
| Règle 1 | "On ne peut bouger qu'un anneau à la fois !" |
| Règle 2 | "Un gros anneau ne peut pas aller sur un petit !" |
| Erreur | "Oups ! Celui-ci est trop gros pour aller là !" |
| Indice | "Essaie de libérer le plus grand anneau d'abord..." |
| Victoire | "YOUHOU ! Tu as réussi ! Tu es super malin ! 🎉" |

#### 8-10 ans
| Contexte | Message |
|----------|---------|
| Introduction | "Hey ! Prêt pour un défi de logique ?" |
| Indice | "Pense à ta stratégie : quel mouvement te rapproche du but ?" |
| Victoire | "Excellent ! Tu maîtrises la récursivité sans le savoir ! 🧠" |

### Fichier source
`src/games/hanoi/data/assistantScripts.ts`

---

## 🤖 PIXEL LE ROBOT — Suites Logiques

### Identité

| Attribut | Valeur |
|----------|--------|
| **Nom** | Pixel |
| **Espèce** | Robot |
| **Emoji** | 🤖 |
| **Personnalité** | Logique, méthodique, précis |
| **Catchphrase** | "Détecte le pattern !" |

### Design visuel

```typescript
// Implémentation SVG dans MascotRobot.tsx
export const RobotColors = {
  body: '#5B8DEE',        // Bleu principal
  accent: '#FFB347',      // Orange accents
  screen: '#7BC74D',      // Vert écran
  eyes: '#FFFFFF',        // Blanc yeux
};
```

### Dialogues

| Contexte | Message |
|----------|---------|
| Introduction | "Bip bop ! Je suis Pixel. Aide-moi à trouver la suite logique !" |
| Pattern simple | "Observe bien : qu'est-ce qui se répète ?" |
| Pattern complexe | "Analyse : couleur, forme, taille... Quel est le critère ?" |
| Erreur | "Hmm, vérifie ta réponse. Le pattern continue comment ?" |
| Victoire | "Calcul confirmé : tu as trouvé ! Efficacité maximale ! ⚡" |

### Fichier source
- Composant : `src/games/suites-logiques/components/MascotRobot.tsx`
- Scripts : `src/games/suites-logiques/data/assistantScripts.ts`
- Documentation : `docs/MASCOT_ROBOT_IMPLEMENTATION.md`

---

## 🐿️ SCOUT L'ÉCUREUIL — Labyrinthe

### Identité

| Attribut | Valeur |
|----------|--------|
| **Nom** | Scout |
| **Espèce** | Écureuil |
| **Emoji** | 🐿️ |
| **Personnalité** | Aventurier, agile, observateur |
| **Catchphrase** | "Explore et observe !" |

### Dialogues

| Contexte | Message |
|----------|---------|
| Introduction | "Salut explorateur ! Je cherche mes noisettes. Tu m'aides ?" |
| Début niveau | "Par où on commence ? Regarde bien le chemin..." |
| Impasse | "Oh non, un cul-de-sac ! Revenons sur nos pas." |
| Objet collecté | "Super ! Une noisette de plus ! 🌰" |
| Victoire | "On a trouvé la sortie ! Quelle aventure ! 🎊" |

---

## 🦉 LIBRA LA CHOUETTE — Balance Logique

### Identité

| Attribut | Valeur |
|----------|--------|
| **Nom** | Libra |
| **Espèce** | Chouette |
| **Emoji** | 🦉 |
| **Personnalité** | Réfléchie, équilibrée, patiente |
| **Catchphrase** | "Trouve l'équilibre !" |

### Dialogues

| Contexte | Message |
|----------|---------|
| Introduction | "Bienvenue dans mon laboratoire de la balance !" |
| Règle | "Une balance s'équilibre quand les deux côtés ont le même poids." |
| Indice | "Compare les objets : lequel est le plus lourd ?" |
| Victoire | "Parfait équilibre ! Tu as l'esprit d'un scientifique ! ⚖️" |

---

## 🦉 PROFESSEUR HOO — Sudoku Montessori

### Identité

| Attribut | Valeur |
|----------|--------|
| **Nom** | Professeur Hoo |
| **Espèce** | Hibou savant |
| **Emoji** | 🦉 |
| **Personnalité** | Érudit, patient, encourageant |
| **Accessoire** | Lunettes rondes |
| **Catchphrase** | "Chaque case a sa place !" |

### Design visuel

```typescript
// Dans ProfessorHooMascot.tsx
export const HooColors = {
  body: '#8B7355',        // Marron doux
  glasses: '#FFD700',     // Or
  bowtie: '#E74C3C',      // Rouge nœud papillon
};
```

### Dialogues

| Contexte | Message |
|----------|---------|
| Introduction | "Bienvenue dans ma bibliothèque ! Résolvons ce Sudoku ensemble." |
| Règle | "Chaque symbole doit apparaître une seule fois par ligne et colonne." |
| Erreur | "Hmm, ce symbole est déjà présent ici. Observe bien la grille." |
| Indice | "Regarde cette ligne : il ne manque qu'un seul symbole..." |
| Victoire | "Magnifique ! Tu as résolu le puzzle ! 📚✨" |

### Fichier source
`src/games/sudoku/components/ProfessorHooMascot.tsx`

---

## 🪶 PLUME — Le Conteur Curieux

### Identité

| Attribut | Valeur |
|----------|--------|
| **Nom** | Plume |
| **Espèce** | Plume magique |
| **Emoji** | 🪶 |
| **Personnalité** | Créatif, imaginatif, doux |
| **Catchphrase** | "Chaque histoire est une aventure !" |

### Design visuel

```typescript
// Corps en plume avec effet flottant
export const PlumeColors = {
  feather: '#E8D5B7',     // Beige plume
  tip: '#8B4513',         // Pointe marron
  sparkle: '#FFD700',     // Paillettes dorées
};
```

### Dialogues

| Contexte | Message |
|----------|---------|
| Introduction | "Bienvenue dans ma bibliothèque enchantée ! Quelle histoire veux-tu découvrir ?" |
| Choix histoire | "Ah, excellent choix ! Cette histoire est passionnante..." |
| Question | "As-tu bien écouté ? Voyons si tu as compris..." |
| Bonne réponse | "Bravo ! Tu as l'oreille d'un vrai conteur ! 📖" |

### Fichier source
`Fiches Educatives/06-Conteur Curieux/`

---

## 🐘 MEMO L'ÉLÉPHANT — Memory

### Identité

| Attribut | Valeur |
|----------|--------|
| **Nom** | Memo |
| **Espèce** | Éléphant |
| **Emoji** | 🐘 |
| **Personnalité** | Concentré, calme, mémorise tout |
| **Catchphrase** | "Un éléphant n'oublie jamais !" |

### Dialogues

| Contexte | Message |
|----------|---------|
| Introduction | "Bonjour ! Je suis Memo. Ma mémoire est légendaire ! Et la tienne ?" |
| Début | "Observe bien les cartes... puis retrouve les paires !" |
| Paire trouvée | "Excellent ! Ta mémoire s'améliore ! 🧠" |
| Victoire | "Incroyable ! Tu as une mémoire d'éléphant maintenant ! 🎉" |

---

## 🦊 GÉO LE RENARD — Puzzle Formes (Tangram)

### Identité

| Attribut | Valeur |
|----------|--------|
| **Nom** | Géo |
| **Espèce** | Renard |
| **Emoji** | 🦊 |
| **Personnalité** | Malin, créatif, spatial |
| **Catchphrase** | "Chaque pièce a sa place !" |

### Dialogues

| Contexte | Message |
|----------|---------|
| Introduction | "Salut ! Je suis Géo. J'adore les formes et les puzzles !" |
| Règle | "Place les pièces pour recréer la silhouette." |
| Indice | "Essaie de tourner cette pièce..." |
| Victoire | "Parfait ! Tu as l'œil d'un artiste ! 🎨" |

---

## 🐜 ADA LA FOURMI — Logix Grid

### Identité

| Attribut | Valeur |
|----------|--------|
| **Nom** | Ada |
| **Espèce** | Fourmi |
| **Emoji** | 🐜 |
| **Personnalité** | Organisée, méthodique, logique |
| **Référence** | Ada Lovelace |
| **Catchphrase** | "Organise, déduis, résous !" |

### Dialogues

| Contexte | Message |
|----------|---------|
| Introduction | "Je suis Ada ! J'organise tout dans ma fourmilière. Tu m'aides ?" |
| Règle | "Place chaque élément selon les indices." |
| Indice | "Cet indice te dit où NE PAS mettre l'objet..." |
| Victoire | "Organisation parfaite ! Tu ferais une excellente fourmi ! 🏆" |

---

## 🦜 LEXIE LE PERROQUET — Mots Croisés

### Identité

| Attribut | Valeur |
|----------|--------|
| **Nom** | Lexie |
| **Espèce** | Perroquet |
| **Emoji** | 🦜 |
| **Personnalité** | Bavard, joueur avec les mots |
| **Catchphrase** | "Les mots sont mes amis !" |

### Dialogues

| Contexte | Message |
|----------|---------|
| Introduction | "Coucou ! Je suis Lexie ! J'adooore les mots !" |
| Définition | "Voici l'indice : [définition]. Tu trouves ?" |
| Lettre correcte | "Oui oui oui ! Cette lettre est bonne !" |
| Victoire | "Bravo ! Tu parles comme un vrai perroquet savant ! 🗣️" |

---

## 🦫 CALC LE CASTOR — MathBlocks

### Identité

| Attribut | Valeur |
|----------|--------|
| **Nom** | Calc |
| **Espèce** | Castor |
| **Emoji** | 🦫 |
| **Personnalité** | Constructeur, méthodique |
| **Catchphrase** | "Construisons avec les chiffres !" |

### Dialogues

| Contexte | Message |
|----------|---------|
| Introduction | "Salut bâtisseur ! Je suis Calc. Construisons ensemble !" |
| Opération | "Combine les blocs pour atteindre le résultat." |
| Erreur | "Hmm, le calcul n'est pas bon. Réessaie !" |
| Victoire | "Construction parfaite ! Tu es un as des maths ! 🧱" |

---

## ✨ MYSTIC — Matrices Magiques

### Identité

| Attribut | Valeur |
|----------|--------|
| **Nom** | Mystic |
| **Espèce** | Créature magique |
| **Emoji** | ✨ |
| **Personnalité** | Mystérieux, magique |
| **Statut** | 🔜 Coming soon |

---

## 🎨 GUIDELINES VISUELLES

### Proportions standard

```typescript
export const MascotSizes = {
  // Taille dans les bulles de dialogue
  bubble: {
    width: 60,
    height: 60,
  },
  // Taille flottante (Home)
  floating: {
    width: 80,
    height: 85,
  },
  // Taille plein écran (intro)
  fullscreen: {
    width: 200,
    height: 220,
  },
};
```

### Animations standard

Toutes les mascottes partagent ces animations de base :

```typescript
export const MascotAnimations = {
  idle: {
    type: 'floating',
    translateY: [-5, 5],
    duration: 3000,
    loop: true,
  },
  speak: {
    type: 'bounce',
    scale: [1, 1.05, 1],
    duration: 300,
  },
  celebrate: {
    type: 'jump',
    translateY: [0, -20, 0],
    rotate: [-5, 5, -5, 5, 0],
    duration: 1000,
  },
  wave: {
    type: 'wave',
    rotate: [-10, 10, -10, 10, 0],
    duration: 800,
  },
};
```

---

## 📁 FICHIERS SOURCES

| Mascotte | Composant | Scripts |
|----------|-----------|---------|
| Piou | `src/components/home/PiouMascot.tsx` | `src/data/piouScripts.ts` |
| Léo | `src/games/hanoi/components/LeoMascot.tsx` | `src/games/hanoi/data/assistantScripts.ts` |
| Pixel | `src/games/suites-logiques/components/MascotRobot.tsx` | `src/games/suites-logiques/data/` |
| Professeur Hoo | `src/games/sudoku/components/ProfessorHooMascot.tsx` | — |
| Plume | `src/games/conteur-curieux/components/PlumeMascot.tsx` | — |

---

*Document de référence pour l'implémentation des mascottes*
*Mis à jour : Décembre 2024*
