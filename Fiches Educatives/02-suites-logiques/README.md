# 🔢 Suites Logiques - Documentation Complète

## Fiche Activité

### Informations Générales

| Champ | Valeur |
|-------|--------|
| **Nom du jeu** | Suites Logiques |
| **Tranche d'âge** | 6-10 ans |
| **Durée session** | 5-15 minutes |
| **Type de raisonnement** | Inductif, classification, abstraction |

### Objectif Pédagogique

Développer la **pensée structurée** et la capacité à **identifier des régularités**. L'enfant apprend à observer, déduire une règle, et l'appliquer pour prédire la suite.

### Méthode Enseignée

> **"Observer le motif, trouver la règle, prédire la suite"**

1. **Observer** : Examiner attentivement les éléments de la suite
2. **Chercher le motif** : Identifier ce qui se répète ou évolue
3. **Formuler la règle** : Comprendre le "pourquoi" de la séquence
4. **Prédire** : Appliquer la règle pour trouver l'élément manquant
5. **Vérifier** : Confirmer que la réponse respecte le motif

---

## Déroulement UX

### Flow Écran par Écran

```
┌─────────────────────────────────────────────────────────────┐
│  ÉCRAN 1 : Présentation                                      │
│  • Animation mascotte introduisant le concept                │
│  • "Trouve ce qui vient après !"                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  ÉCRAN 2 : Jeu Principal                                     │
│                                                              │
│    🔴  🔵  🔴  🔵  🔴   [ ? ]                               │
│                                                              │
│    ┌────┐  ┌────┐  ┌────┐  ┌────┐                          │
│    │ 🔴 │  │ 🔵 │  │ 🟢 │  │ 🟡 │   ← Choix                │
│    └────┘  └────┘  └────┘  └────┘                          │
│                                                              │
│  Boutons : [🏠] [💡] [➡️ Suivant]                           │
└─────────────────────────────────────────────────────────────┘
```

### Interactions

| Geste | Action | Feedback |
|-------|--------|----------|
| **Tap sur choix** | Sélectionne la réponse | Élément pulse |
| **Drag vers ?** | Place la réponse | Zone s'illumine |
| **Réponse correcte** | Élément s'intègre | Animation + son joyeux |
| **Réponse incorrecte** | Élément retourne | Tremblement doux |

---

## Types de Suites par Âge

### 6-7 ans (Niveau 1-2)
- **ABAB** : 🔴🔵🔴🔵🔴?
- **AABB** : 🔴🔴🔵🔵🔴?
- **Couleurs simples** : Rouge, Bleu, Rouge, Bleu...
- **Formes simples** : ⬛🔵⬛🔵⬛?

### 7-8 ans (Niveau 3-4)
- **ABCABC** : 🔴🔵🟢🔴🔵?
- **Tailles croissantes** : Petit, Moyen, Grand, Petit...
- **Combinaisons** : Forme + Couleur

### 9-10 ans (Niveau 5-6)
- **Suites numériques** : 2, 4, 6, 8, ?
- **Suites géométriques** : 1, 2, 4, 8, ?
- **Suites complexes** : Multi-critères

---

## Système de Feedback

### Réussite
- ✅ Son : "Ding" mélodique
- ✅ Visuel : L'élément s'intègre, la suite brille
- ✅ Message : "Bravo ! Tu as trouvé le motif !"

### Erreur (Constructive)
- ⚠️ Son : Note douce
- ⚠️ Visuel : L'élément secoue la tête, retourne
- ⚠️ Pas de texte "Faux" - juste invitation à réessayer

### Indices Progressifs
1. "Regarde bien, les éléments semblent se répéter..."
2. Surlignage du motif récurrent (ex: 1-2, 3-4 entourés)
3. Seule la bonne réponse reste visible

---

## Personnalisation Thématique

| Thème | Éléments | Attractivité |
|-------|----------|--------------|
| **Ferme** | 🐄🐷🐔 | Enfants 6-7 ans |
| **Espace** | 🚀🌙⭐ | Enfants 7-8 ans |
| **Formes** | ⬛🔵🔺 | Pédagogique neutre |
| **Nombres** | 1, 2, 3... | Enfants 8-10 ans |
| **Musique** | 🎵🎶 | Tous âges |

---

## Fiche Parent

### Compétences Développées

| Compétence | Application Réelle |
|------------|-------------------|
| **Logique séquentielle** | Suivre des instructions, organiser |
| **Classification** | Ranger, trier, catégoriser |
| **Abstraction** | Comprendre les règles mathématiques |
| **Attention aux détails** | Observation, concentration |

### Conseils d'Accompagnement

✅ **À faire** :
- "Qu'est-ce que tu remarques ?"
- "Vois-tu quelque chose qui se répète ?"
- Célébrer la découverte du motif

❌ **À éviter** :
- Donner la réponse directement
- Dire "C'est facile, regarde..."

### Transfert Vie Quotidienne

- Repérer les motifs dans le papier peint
- Créer des suites avec des jouets
- Observer les rythmes en musique
- Décorer avec des motifs répétitifs

---

## Spécifications Techniques

### Structure Composants

```
/src/components/activities/SuitesLogiques/
├── SuitesLogiquesGame.tsx
├── components/
│   ├── SequenceDisplay.tsx    # Affichage de la suite
│   ├── ChoicePanel.tsx        # Options de réponse
│   ├── SequenceElement.tsx    # Élément individuel
│   └── ThemeSelector.tsx      # Sélection thème
├── hooks/
│   ├── useSuitesGame.ts       # Logique de jeu
│   └── useSequenceGenerator.ts # Génération de suites
└── data/
    └── sequencePatterns.ts    # Patterns par difficulté
```

### Types Principaux

```typescript
interface SequenceElement {
  id: string;
  type: 'color' | 'shape' | 'number' | 'image';
  value: string | number;
  displayAsset: string;
}

interface Sequence {
  id: string;
  pattern: SequenceElement[];
  missingIndex: number;
  correctAnswer: SequenceElement;
  distractors: SequenceElement[];
  difficulty: 1 | 2 | 3 | 4 | 5 | 6;
  patternType: 'ABAB' | 'AABB' | 'ABC' | 'numeric' | 'complex';
}

interface GameState {
  currentSequence: Sequence;
  selectedAnswer: SequenceElement | null;
  attempts: number;
  hintsUsed: number;
  isComplete: boolean;
  streak: number;  // Suites réussies d'affilée
}
```

### Algorithme Générateur

```typescript
function generateSequence(difficulty: number): Sequence {
  const patternType = selectPatternType(difficulty);
  const theme = getCurrentTheme();
  const elements = getThemeElements(theme);
  
  // Générer le pattern
  const pattern = buildPattern(patternType, elements, difficulty);
  
  // Choisir l'élément manquant
  const missingIndex = pattern.length - 1; // Toujours le dernier
  const correctAnswer = pattern[missingIndex];
  
  // Générer les distracteurs
  const distractors = generateDistractors(
    elements, 
    correctAnswer, 
    3  // 3 mauvaises réponses
  );
  
  return {
    pattern: pattern.slice(0, -1),
    missingIndex,
    correctAnswer,
    distractors: shuffle([correctAnswer, ...distractors]),
    difficulty,
    patternType,
  };
}
```

---

## Dialogues IA (Mascotte : Pixel le Robot 🤖)

### Introduction
> "Salut ! Moi c'est Pixel ! 🤖
> Tu vois cette suite ? Il manque un élément à la fin.
> Observe bien... et trouve ce qui vient après !"

### Indice Niveau 1
> "Hmm... Regarde les premiers éléments.
> Tu vois quelque chose qui se répète ?"

### Indice Niveau 2
*[Les éléments identiques pulsent ensemble]*
> "Les éléments qui brillent sont pareils.
> Tu vois le rythme maintenant ?"

### Réussite
> "Génial ! 🌟 Tu as trouvé la règle !
> La suite continue comme ça : un, puis l'autre, puis un..."

### Erreur
> "Pas tout à fait... Mais continue de chercher !
> Regarde encore une fois le début de la suite."

---

## Métriques de Succès

| Métrique | Objectif | Seuil d'Alerte |
|----------|----------|----------------|
| Taux réussite 1er essai | > 60% | < 30% |
| Temps moyen par suite | 30-60s | > 2 min |
| Streak moyen | 3-5 | < 2 |
| Usage indices | < 1/suite | > 2/suite |
| Passage niveau supérieur | 70% tentent | < 40% |

---

*Suites Logiques | Application Éducative Montessori iPad*
