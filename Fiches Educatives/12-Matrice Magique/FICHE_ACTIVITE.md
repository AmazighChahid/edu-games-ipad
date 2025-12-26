# FICHE ACTIVITÉ : Matrices Magiques 🔮

> **Catégorie** : Raisonnement inductif  
> **Âge cible** : 7-10 ans  
> **Durée session** : 10-15 minutes  
> **Inspiration** : Matrices Progressives de Raven

---

## 🎯 Objectif Pédagogique Principal

**Développer le raisonnement inductif** : capacité à identifier des règles et patterns à partir d'observations, puis les appliquer pour prédire un élément manquant.

### Compétences Cognitives Ciblées

| Compétence | Description | Indicateur de maîtrise |
|------------|-------------|------------------------|
| **Reconnaissance de patterns** | Identifier les régularités visuelles | Trouve la règle en < 3 observations |
| **Raisonnement analogique** | Appliquer une règle à un nouveau contexte | Transfert entre lignes/colonnes |
| **Pensée abstraite** | Manipuler des concepts non-concrets | Gère les transformations combinées |
| **Attention aux détails** | Observer précisément les différences | Repère les variations subtiles |
| **Inhibition** | Résister aux distracteurs visuels | Ignore les attributs non-pertinents |

---

## 📚 Fondement Pédagogique

### Pourquoi les matrices ?

Les matrices de type Raven mesurent l'**intelligence fluide** — la capacité à résoudre des problèmes nouveaux indépendamment des connaissances acquises. C'est un prédicteur fort de la réussite académique.

### Approche Montessori adaptée

1. **Du concret à l'abstrait** : Commencer avec des objets familiers (animaux, fruits) avant les formes géométriques pures
2. **Auto-correction** : L'enfant vérifie lui-même si sa réponse "complète" logiquement la grille
3. **Progression autonome** : Difficulté adaptative basée sur la performance

### La méthode enseignée

> « **Observe ligne par ligne, colonne par colonne. Trouve CE QUI CHANGE.** »

Cette méthode systématique enseigne à :
1. Analyser horizontalement (qu'est-ce qui change entre cases d'une ligne ?)
2. Analyser verticalement (qu'est-ce qui change entre cases d'une colonne ?)
3. Croiser les deux analyses pour déduire la pièce manquante

---

## 🔮 Types de Transformations

### Niveau 1 — Transformations Simples (7 ans)

| Type | Exemple | Difficulté |
|------|---------|------------|
| **Identité** | Même forme répétée | ⭐ |
| **Couleur** | Rouge → Bleu → Vert | ⭐ |
| **Taille** | Petit → Moyen → Grand | ⭐ |
| **Quantité** | 1 → 2 → 3 éléments | ⭐⭐ |
| **Rotation simple** | 0° → 90° → 180° | ⭐⭐ |

### Niveau 2 — Transformations Moyennes (8-9 ans)

| Type | Exemple | Difficulté |
|------|---------|------------|
| **Addition** | Forme + élément ajouté | ⭐⭐ |
| **Soustraction** | Forme - élément retiré | ⭐⭐ |
| **Superposition** | Forme A + Forme B = AB | ⭐⭐⭐ |
| **Rotation combinée** | Rotation + changement couleur | ⭐⭐⭐ |
| **Symétrie** | Miroir horizontal/vertical | ⭐⭐⭐ |

### Niveau 3 — Transformations Complexes (9-10 ans)

| Type | Exemple | Difficulté |
|------|---------|------------|
| **Double règle** | Couleur ET taille changent | ⭐⭐⭐⭐ |
| **Règle conditionnelle** | Si cercle → rotation, si carré → couleur | ⭐⭐⭐⭐ |
| **Distribution** | Chaque élément apparaît 1x par ligne/colonne | ⭐⭐⭐⭐ |
| **Négation** | Ce qui n'est PAS dans A et B | ⭐⭐⭐⭐⭐ |

---

## 🎮 Structure d'une Session

### Écran 1 : Introduction (MatricesIntroScreen)

**Objectif** : Présenter l'activité et choisir le niveau

**Éléments** :
- Mascotte Pixel le Renard 🦊 qui accueille
- Explication visuelle du concept (animation montrant une matrice qui se complète)
- Sélection du monde/thème :
  - 🌲 Forêt Enchantée (objets naturels)
  - 🚀 Station Spatiale (formes géométriques)
  - 🏰 Château Magique (symboles fantastiques)
  - 🎨 Atelier d'Artiste (couleurs et formes)
- Indicateur de progression par monde

### Écran 2 : Puzzle (MatricesPuzzleScreen)

**Objectif** : Résoudre la matrice

**Layout** :
```
┌─────────────────────────────────────────────┐
│  [←]  Matrices Magiques    ⭐⭐⭐  [💡]     │
├─────────────────────────────────────────────┤
│                                             │
│         ┌───┬───┬───┐                       │
│         │ A │ B │ C │                       │
│         ├───┼───┼───┤                       │
│         │ D │ E │ F │      🦊 Pixel         │
│         ├───┼───┼───┤      [Bulle aide]     │
│         │ G │ H │ ? │                       │
│         └───┴───┴───┘                       │
│                                             │
│    Choix:  [1] [2] [3] [4] [5] [6]          │
│                                             │
└─────────────────────────────────────────────┘
```

**Interactions** :
- Tap sur une case pour la mettre en surbrillance
- Tap sur un choix pour le sélectionner
- Animation de placement dans la case "?"
- Validation automatique après sélection

### Écran 3 : Feedback Intermédiaire

**Si correct** :
- Confettis légers
- Case "?" se remplit avec animation satisfaisante
- Pixel félicite : « Bravo ! Tu as trouvé la règle ! »
- Bouton "Puzzle suivant"

**Si incorrect** :
- Shake doux de la réponse
- La réponse retourne à sa place
- Pixel encourage : « Hmm, regarde bien ce qui change... »
- Proposition d'indice après 2 erreurs
- Après 3 erreurs : montrer la solution avec explication

### Écran 4 : Victoire (MatricesVictoryScreen)

**Après 5-8 puzzles réussis** :
- Célébration avec animations
- Carte à collectionner débloquée
- Stats : puzzles résolus, indices utilisés, temps
- Badge de compétence acquise
- Options : continuer / autre niveau / accueil

---

## 🦊 Mascotte : Pixel le Renard Malin

### Personnalité
- **Malin et observateur** : Excellent pour repérer les détails
- **Patient** : Encourage sans presser
- **Joueur** : Présente les puzzles comme des énigmes à résoudre
- **Jamais condescendant** : Ne donne pas l'impression que c'est "facile"

### Apparence
- Renard stylisé aux couleurs violet/orange
- Lunettes rondes (aspect "détective")
- Queue qui s'agite quand excité
- Expression qui change selon le contexte

### Rôle pédagogique
1. **Modéliser la méthode** : Montre comment analyser ligne/colonne
2. **Questionner** : "Que remarques-tu entre ces deux cases ?"
3. **Valider le processus** : "Tu as bien observé le changement !"
4. **Ne JAMAIS donner la réponse** : Guide vers la découverte

---

## 💡 Système d'Indices Progressifs

### Niveau 1 : Indice général (gratuit)
> « Regarde bien chaque ligne. Qu'est-ce qui est pareil ? Qu'est-ce qui change ? »

### Niveau 2 : Indice directionnel (coûte 1 ⭐)
> « Concentre-toi sur la dernière colonne. Compare les formes du haut vers le bas. »

### Niveau 3 : Indice sur la règle (coûte 2 ⭐)
> « Dans ce puzzle, la COULEUR change à chaque case. »

### Niveau 4 : Élimination (coûte 3 ⭐)
> « Les réponses 2 et 5 ne peuvent pas être correctes. Pourquoi ? »

---

## 📊 Progression et Niveaux

### Structure des Mondes

| Monde | Thème | Grille | Transformations | Choix |
|-------|-------|--------|-----------------|-------|
| 1. Forêt Enchantée | Animaux, plantes | 2×2 | Simples | 4 |
| 2. Station Spatiale | Formes géométriques | 2×2 → 3×3 | Simples + moyennes | 4-5 |
| 3. Château Magique | Symboles | 3×3 | Moyennes | 5-6 |
| 4. Atelier d'Artiste | Abstraites | 3×3 | Complexes | 6 |
| 5. Dimension Mystère | Mixte | 3×3 | Combinées | 6 |

### Critères de passage

| De → Vers | Condition |
|-----------|-----------|
| Niveau 1 → 2 | 8/10 puzzles réussis avec ≤ 1 indice moyen |
| Niveau 2 → 3 | 8/10 puzzles réussis avec ≤ 2 erreurs totales |
| Niveau 3 → 4 | 10/12 puzzles réussis |
| Niveau 4 → 5 | 10/12 puzzles réussis + temps < 2min/puzzle moyen |

---

## 🎨 Éléments Visuels par Thème

### 🌲 Forêt Enchantée
- **Éléments** : 🦊 🐰 🦉 🍄 🌸 🍂 🌳 🦋
- **Couleurs** : Verts, bruns, oranges naturels
- **Fond** : Clairière avec arbres en arrière-plan

### 🚀 Station Spatiale
- **Éléments** : ⭐ 🌙 ⚫ 🔺 🔷 ⬡ ◯ ▢
- **Couleurs** : Bleus, violets, argentés
- **Fond** : Espace étoilé avec planètes

### 🏰 Château Magique
- **Éléments** : 👑 🗝️ 🛡️ ⚔️ 🔮 📜 🏆 💎
- **Couleurs** : Dorés, pourpres, émeraudes
- **Fond** : Salle du trône avec bannières

### 🎨 Atelier d'Artiste
- **Éléments** : Formes pures avec variations
- **Couleurs** : Arc-en-ciel complet
- **Fond** : Atelier avec chevalets

---

## ♿ Accessibilité

### Daltonisme
- Jamais de distinction couleur seule
- Toujours combiner : couleur + forme OU couleur + motif
- Option "mode contraste" avec patterns distinctifs

### Dyslexie
- Pas de texte dans les matrices
- Instructions en police Nunito 18pt+
- Option audio pour les consignes

### Motricité
- Zones de tap ≥ 80×80dp pour les choix
- Pas de drag & drop requis
- Temps illimité par défaut

---

## 📈 Métriques de Suivi (Espace Parent)

### Par session
- Nombre de puzzles tentés/réussis
- Indices utilisés (par type)
- Temps moyen par puzzle
- Erreurs avant réussite

### Progression long terme
- Évolution du niveau atteint
- Types de transformations maîtrisées
- Tendance d'amélioration
- Comparaison avec objectifs

### Indicateurs d'alerte
- ⚠️ > 5 puzzles échoués d'affilée → proposer niveau inférieur
- ⚠️ Toujours besoin d'indices niveau 3+ → revoir les bases
- ✅ < 30s/puzzle moyen → prêt pour niveau supérieur

---

## 🔗 Transfert Vie Quotidienne

### Pour les parents : activités complémentaires

1. **Jeux de société** : 
   - SET (reconnaissance de patterns)
   - Qwirkle (lignes/colonnes avec règles)
   - Rush Hour Junior (planification)

2. **Activités quotidiennes** :
   - "Trouve l'intrus" dans les courses
   - Compléter des séquences (mettre la table)
   - Observer les patterns dans la nature (feuilles, coquillages)

3. **Questions à poser** :
   - "Qu'est-ce qui se répète ici ?"
   - "Si ça continue, que viendrait après ?"
   - "Qu'est-ce qui est pareil ? Différent ?"

---

## 🎵 Ambiance Sonore

### Musique de fond
- Mélodie douce et mystérieuse
- Tempo modéré (pas stressant)
- Variations par monde/thème

### Effets sonores
| Action | Son |
|--------|-----|
| Sélection choix | "Pop" léger |
| Bonne réponse | Carillon joyeux |
| Mauvaise réponse | "Womp" doux (pas punitif) |
| Indice | Tintement magique |
| Niveau complété | Fanfare courte |

---

*Fiche Activité v1.0 — Matrices Magiques*
*Application Éducative iPad — Enfants 7-10 ans*
