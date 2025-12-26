# ⚖️ Balance Logique - Documentation Complète

## Fiche Activité

### Informations Générales

| Champ | Valeur |
|-------|--------|
| **Nom du jeu** | Balance Logique |
| **Tranche d'âge** | 6-10 ans |
| **Durée session** | 5-15 minutes |
| **Type de raisonnement** | Quantitatif, équivalence, pré-algébrique |

### Objectif Pédagogique

Développer la compréhension intuitive de l'**égalité** et de l'**équivalence**. L'enfant découvre que des ensembles différents peuvent avoir la même "valeur" et prépare les bases de l'algèbre.

### Méthode Enseignée

> **"Pour équilibrer, les deux côtés doivent avoir la même valeur"**

1. **Observer** : Voir l'état de la balance (penchée ou équilibrée)
2. **Comparer** : Estimer quel côté est plus lourd
3. **Expérimenter** : Ajouter ou retirer des objets
4. **Découvrir** : Comprendre les équivalences (1 pastèque = 3 pommes)
5. **Vérifier** : La balance horizontale confirme l'égalité

---

## Déroulement UX

### Flow Écran par Écran

```
┌─────────────────────────────────────────────────────────────┐
│  ÉCRAN 1 : Atelier Scientifique                             │
│  • Mascotte présente le défi                                │
│  • "Fais pencher la balance des deux côtés pareils !"       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  ÉCRAN 2 : Balance Interactive                               │
│                                                              │
│         [🏠]                              [💡] [🔄]          │
│                                                              │
│                      ╱╲                                      │
│                     ╱  ╲                                     │
│            ┌──────╱    ╲──────┐                             │
│            │ 🍎🍎 │      │     │   ← Balance penchée        │
│            └──────┘      └──────┘                           │
│                                                              │
│   ┌────────────────────────────────────────────┐            │
│   │  🍎 🍎 🍎 🍌 🍌 🍉                          │ ← Stock   │
│   │  ×5    ×3    ×2                            │            │
│   └────────────────────────────────────────────┘            │
│                                                              │
│   🔬 "Ajoute des fruits à droite pour équilibrer !"        │
└─────────────────────────────────────────────────────────────┘
```

### Interactions

| Geste | Action | Feedback |
|-------|--------|----------|
| **Drag objet → plateau** | Ajoute l'objet | Balance bouge en temps réel |
| **Drag objet ← plateau** | Retire l'objet | Balance se réajuste |
| **Balance s'équilibre** | Victoire ! | Son harmonieux + animation |
| **Tap sur objet (stock)** | Sélectionne | Objet pulse |

---

## Niveaux de Difficulté

### Niveau 1-3 : Objets Identiques (6-7 ans)

| Défi | Plateau Gauche | Objectif |
|------|----------------|----------|
| 1 | 🍎🍎 | Mettre 2 pommes à droite |
| 2 | 🍎🍎🍎 | Mettre 3 pommes à droite |
| 3 | 🍎🍎🍎🍎 | Mettre 4 pommes à droite |

### Niveau 4-6 : Équivalences Simples (7-8 ans)

| Défi | Équivalence | Plateau Gauche | Solution |
|------|-------------|----------------|----------|
| 4 | 1🍉 = 2🍎 | 🍉 | 🍎🍎 |
| 5 | 1🍌 = 2🍎 | 🍌🍌 | 🍎🍎🍎🍎 |
| 6 | 1🍉 = 3🍎 | 🍉 | 🍎🍎🍎 |

### Niveau 7-10 : Poids Numériques (8-9 ans)

| Défi | Plateau Gauche | Stock | Solution |
|------|----------------|-------|----------|
| 7 | [5] | [2] [3] | [2]+[3] = 5 |
| 8 | [7] | [4] [3] [2] | [4]+[3] ou [5]+[2] |
| 9 | [3]+[4] | [1-9] | [7] ou [6]+[1]... |

### Niveau 11+ : Pré-Algèbre (9-10 ans)

| Défi | Plateau Gauche | Plateau Droit | Trouver |
|------|----------------|---------------|---------|
| 11 | [5] | [?]+[2] | [?] = 3 |
| 12 | [3]+[?] | [8] | [?] = 5 |

---

## Système de Feedback

### Balance en Temps Réel
- **Penche à gauche** : Gauche plus lourd → plateau gauche descend
- **Penche à droite** : Droite plus lourd → plateau droit descend
- **Horizontale** : Égalité ! ✨

### Son et Animation
| État | Feedback Visuel | Feedback Sonore |
|------|-----------------|-----------------|
| Déséquilibre fort | Balance très inclinée | Léger grincement |
| Déséquilibre léger | Balance peu inclinée | Silence |
| Presque équilibré | Balance oscille | Tintement doux |
| Équilibré ! | Balance stable + halo | Accord harmonieux |

### Message Pédagogique (post-réussite)
> "Tu as découvert que 1 pastèque = 3 pommes ! 🍉 = 🍎🍎🍎"

---

## Fiche Parent

### Compétences Développées

| Compétence | Description | Application Scolaire |
|------------|-------------|---------------------|
| **Sens de l'égalité** | Comprendre que "=" signifie "même valeur" | Mathématiques |
| **Équivalence** | Des ensembles différents peuvent être égaux | Fractions, proportions |
| **Raisonnement quantitatif** | Estimer, comparer des quantités | Problèmes de maths |
| **Pré-algèbre** | Trouver une inconnue | Équations simples |

### Base Scientifique

> "La manipulation de balances aide les enfants à développer une compréhension intuitive de l'égalité, fondamentale pour l'algèbre plus tard."
> — Recherche en didactique des mathématiques

### Conseils d'Accompagnement

✅ **À faire** :
- "Que se passe-t-il si tu ajoutes une pomme ?"
- "Combien de pommes pour équilibrer la pastèque ?"
- "Si tu enlèves la même chose des deux côtés, que se passe-t-il ?"

❌ **À éviter** :
- Donner directement la solution
- Compter à sa place

### Transfert Vie Quotidienne

- Balance de cuisine : peser ingrédients
- Balançoire : équilibrer avec un ami
- Partager équitablement (gâteau, bonbons)
- Jeux de marchande : échange équitable

---

## Spécifications Techniques

### Structure Composants

```
/src/components/activities/Balance/
├── BalanceGame.tsx
├── components/
│   ├── BalanceScale.tsx       # Balance animée
│   ├── BalancePlate.tsx       # Plateau (gauche/droite)
│   ├── WeightObject.tsx       # Objet draggable
│   ├── ObjectStock.tsx        # Réserve d'objets
│   └── EquivalenceDisplay.tsx # Affichage équivalence
├── hooks/
│   ├── useBalanceGame.ts      # Logique de jeu
│   └── useBalancePhysics.ts   # Animation balance
└── data/
    └── puzzles.ts             # Défis par niveau
```

### Types Principaux

```typescript
interface WeightObject {
  id: string;
  type: 'fruit' | 'weight' | 'animal';
  name: string;
  value: number;           // Poids réel (caché au début)
  displayValue?: number;   // Affiché pour niveaux avancés
  asset: string;
}

interface BalancePlate {
  side: 'left' | 'right';
  objects: WeightObject[];
  totalWeight: number;
}

interface BalanceState {
  leftPlate: BalancePlate;
  rightPlate: BalancePlate;
  angle: number;            // -45 à +45 degrés
  isBalanced: boolean;
  tolerance: number;        // Marge d'équilibre
}

interface Puzzle {
  id: string;
  difficulty: number;
  initialLeft: WeightObject[];
  initialRight: WeightObject[];
  availableObjects: WeightObject[];
  targetBalance: boolean;   // Doit équilibrer
  hints: string[];
  equivalencesLearned: string[]; // Ex: "1🍉=3🍎"
}
```

### Physique de la Balance

```typescript
function useBalancePhysics(leftWeight: number, rightWeight: number) {
  const angle = useSharedValue(0);
  
  useEffect(() => {
    // Calculer l'angle basé sur la différence de poids
    const diff = leftWeight - rightWeight;
    const maxAngle = 30; // degrés
    const sensitivity = 5; // poids par degré
    
    const targetAngle = Math.max(
      -maxAngle,
      Math.min(maxAngle, diff / sensitivity * maxAngle)
    );
    
    // Animation fluide vers l'angle cible
    angle.value = withSpring(targetAngle, {
      damping: 15,
      stiffness: 100,
    });
  }, [leftWeight, rightWeight]);
  
  const isBalanced = Math.abs(leftWeight - rightWeight) < 0.1;
  
  return { angle, isBalanced };
}
```

---

## Dialogues IA (Mascotte : Dr. Hibou 🦉)

### Introduction
> "Bienvenue dans mon laboratoire ! 🦉
> Cette balance magique peut mesurer tout !
> Ton défi : faire en sorte qu'elle soit bien droite."

### Première Manipulation
> "Touche un objet et glisse-le sur le plateau.
> Regarde ce qui se passe !"

### Balance Penchée
> "Hmm, le côté gauche est plus lourd...
> Que pourrais-tu faire du côté droit ?"

### Découverte d'Équivalence
> "Eurêka ! 🎓
> Tu as découvert que la pastèque pèse autant que 3 pommes !
> 1 🍉 = 3 🍎"

### Indice Niveau 1
> "Regarde bien les deux côtés...
> Lequel est le plus lourd ?"

### Indice Niveau 2
> "Essaie d'ajouter [X] du côté droit."
*[L'objet suggéré pulse]*

### Victoire
> "Parfait équilibre ! ⚖️✨
> Tu es un vrai scientifique maintenant !"

---

## Mode Libre (Sandbox)

### Description
Mode sans objectif où l'enfant peut librement expérimenter avec la balance.

### Fonctionnalités
- Tous les objets disponibles
- Pas de "réussite" ou "échec"
- Découverte libre des équivalences
- Affichage optionnel des valeurs

### Intérêt Pédagogique
- Exploration autonome (Montessori)
- Compréhension intuitive par manipulation
- Formulation d'hypothèses

---

## Métriques de Succès

| Métrique | Objectif | Interprétation |
|----------|----------|----------------|
| Taux réussite | > 80% | Difficulté bien dosée |
| Tentatives avant réussite | 2-4 | Exploration sans frustration |
| Découverte équivalences | 100% | Concept compris |
| Passage aux nombres | > 60% | Transition concret → abstrait |
| Temps par puzzle | 1-3 min | Engagement optimal |

---

## Accessibilité

- ✅ **Feedback multimodal** : Visuel (inclinaison) + Sonore (grincement/harmonie)
- ✅ **Objets larges** : 80dp minimum pour le drag
- ✅ **Daltonisme** : Objets identifiables par forme (pas juste couleur)
- ✅ **Mode simplifié** : Valeurs numériques affichées si besoin

---

*Balance Logique | Application Éducative Montessori iPad*
