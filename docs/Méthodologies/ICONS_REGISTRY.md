# Registre des Icônes — Hello Guys

> **Fichier source** : `src/constants/icons.ts`
> **Total** : 78 icônes emoji centralisées
> **Dernière mise à jour** : 29 Décembre 2024

---

## Pourquoi centraliser les icônes ?

- **Cohérence** : Même emoji partout dans l'app
- **Maintenance** : Changement en un seul endroit
- **Type-safety** : Autocomplétion TypeScript
- **Éviter les erreurs** : Pas de typos sur les emojis

---

## Import et Usage

### Import standard

```tsx
import { Icons } from '@/constants/icons';

// Usage direct
<Text>{Icons.star}</Text>  // ⭐
<Text>{Icons.trophy}</Text> // 🏆
```

### Avec helper et fallback

```tsx
import { getIcon, IconName } from '@/constants/icons';

// Avec fallback si l'icône n'existe pas
const icon = getIcon('star', '?'); // ⭐ ou ? si non trouvé
```

### Type pour les props

```tsx
import type { IconName } from '@/constants/icons';

interface Props {
  icon: IconName; // Autocomplete des 78 noms d'icônes
}
```

---

## Catalogue des Icônes par Catégorie

### Navigation & Actions (5)

| Clé | Emoji | Usage |
|-----|-------|-------|
| `pedagogy` | 🎓 | Espace pédagogique |
| `help` | ? | Aide |
| `settings` | ⚙️ | Paramètres |
| `home` | 🏠 | Accueil |
| `back` | ← | Retour |

### Famille & Profil (2)

| Clé | Emoji | Usage |
|-----|-------|-------|
| `family` | 👨‍👩‍👧 | Famille |
| `profile` | 👤 | Profil utilisateur |

### Récompenses & Succès (11)

| Clé | Emoji | Usage |
|-----|-------|-------|
| `star` | ⭐ | Étoile de réussite |
| `trophy` | 🏆 | Trophée |
| `sparkles` | ✨ | Célébration |
| `fire` | 🔥 | Streak/série |
| `rocket` | 🚀 | Progression |
| `medalBronze` | 🥉 | Médaille bronze |
| `medalSilver` | 🥈 | Médaille argent |
| `medalGold` | 🥇 | Médaille or |
| `medalDiamond` | 💎 | Médaille diamant |
| `badgeProgress` | 📈 | Badge progression |
| `badgeTarget` | 🎯 | Badge objectif |
| `badgeCelebration` | 🎉 | Badge célébration |

### Salutations & Émotions (3)

| Clé | Emoji | Usage |
|-----|-------|-------|
| `wave` | 👋 | Salutation |
| `thinking` | 🤔 | Réflexion |
| `celebration` | 🎉 | Célébration |

### Catégories de Jeux (7)

| Clé | Emoji | Usage |
|-----|-------|-------|
| `categoryAll` | 🏠 | Tous les jeux |
| `categoryFavorites` | ❤️ | Favoris |
| `categoryLogic` | 🧠 | Logique |
| `categoryMath` | 🔢 | Mathématiques |
| `categoryReading` | 📖 | Lecture |
| `categoryTarget` | 🎯 | Objectifs |
| `categoryPuzzle` | 🧩 | Puzzles |

### Jeux Spécifiques (14)

| Clé | Emoji | Usage |
|-----|-------|-------|
| `hanoi` | 🗼 | Tour de Hanoï |
| `castle` | 🏰 | Château |
| `puzzle` | 🧩 | Puzzle |
| `brain` | 🧠 | Logique/Cerveau |
| `blocks` | 🧱 | Blocs |
| `math` | 🔢 | Mathématiques |
| `abacus` | 🧮 | Calcul |
| `balance` | ⚖️ | Balance |
| `letters` | 🔤 | Lettres |
| `book` | 📚 | Livre/Lecture |
| `writing` | 📝 | Écriture |
| `dice` | 🎲 | Dés |
| `target` | 🎯 | Cible |
| `map` | 🗺️ | Carte/Labyrinthe |
| `crystal` | 🔮 | Magie |
| `car` | 🚗 | Voiture |
| `spiral` | 🌀 | Spirale |
| `cards` | 🃏 | Cartes |
| `colors` | 🎨 | Couleurs |
| `game` | 🎮 | Jeu générique |

### Mascottes & Animaux (14)

| Clé | Emoji | Usage |
|-----|-------|-------|
| `owl` | 🦉 | Piou, Dr. Hibou, Prof. Hoo |
| `rabbit` | 🐰 | Lapin |
| `turtle` | 🐢 | Tortue |
| `cat` | 🐱 | Chat |
| `bear` | 🐻 | Ours |
| `panda` | 🐼 | Panda |
| `penguin` | 🐧 | Pingouin |
| `dragon` | 🐉 | Dragon |
| `tiger` | 🐯 | Tigre |
| `butterfly` | 🦋 | Papillon |
| `bird` | 🐦 | Oiseau |
| `squirrel` | 🐿️ | Écureuil (Scout) |
| `hedgehog` | 🦔 | Hérisson |
| `robot` | 🤖 | Robot (Pixel) |

### Nature & Fleurs (13)

| Clé | Emoji | Usage |
|-----|-------|-------|
| `flowerCherry` | 🌸 | Fleur de cerisier |
| `flowerSunflower` | 🌻 | Tournesol |
| `flowerTulip` | 🌷 | Tulipe |
| `flowerHibiscus` | 🌺 | Hibiscus |
| `flowerBlossom` | 🌼 | Fleur |
| `flowerRose` | 🌹 | Rose |
| `flowerHyacinth` | 🪻 | Jacinthe |
| `tree` | 🌳 | Arbre |
| `seedling` | 🌱 | Pousse |
| `mountain` | ⛰️ | Montagne |
| `comet` | ☄️ | Comète |
| `moon` | 🌙 | Lune |
| `galaxy` | 🌌 | Galaxie |

### Temps & Planification (5)

| Clé | Emoji | Usage |
|-----|-------|-------|
| `clock` | ⏰ | Horloge |
| `timer` | ⏱️ | Chronomètre |
| `calendar` | 📅 | Calendrier |
| `sun` | ☀️ | Soleil |
| `pause` | ⏸️ | Pause |

### Feedback & Status (7)

| Clé | Emoji | Usage |
|-----|-------|-------|
| `success` | ✅ | Succès |
| `checkmark` | ✓ | Validé |
| `error` | ❌ | Erreur |
| `warning` | ⚠️ | Attention |
| `info` | ℹ️ | Information |
| `lock` | 🔒 | Verrouillé |
| `unlock` | 🔓 | Déverrouillé |

### Objets & Divers (13)

| Clé | Emoji | Usage |
|-----|-------|-------|
| `clipboard` | 📋 | Presse-papiers |
| `chart` | 📊 | Graphique |
| `link` | 🔗 | Lien |
| `wrench` | 🔧 | Outil |
| `shield` | 🛡️ | Protection |
| `topHat` | 🎩 | Chapeau |
| `chess` | ♟️ | Échecs |
| `peace` | ☮️ | Paix |
| `calm` | 😌 | Calme |
| `music` | 🎵 | Musique |
| `apple` | 🍎 | Pomme |
| `plate` | 🍽️ | Assiette |
| `friends` | 🤝 | Amis |

---

## Règles d'utilisation

### ✅ À FAIRE

```tsx
// Import centralisé
import { Icons } from '@/constants/icons';

// Usage dans JSX
<Text>{Icons.star}</Text>

// Usage dans props
<GameCard emoji={Icons.puzzle} />

// Usage avec template literal
const message = `Bravo ! ${Icons.trophy}`;
```

### ❌ À ÉVITER

```tsx
// Emoji hardcodé
<Text>🌟</Text>  // ❌ Pas de hardcode

// String directe
<GameCard emoji="🧩" />  // ❌ Utiliser Icons.puzzle

// Emoji dans template
const message = `Bravo ! 🏆`;  // ❌ Utiliser ${Icons.trophy}
```

---

## Ajouter une nouvelle icône

1. **Ouvrir** `src/constants/icons.ts`
2. **Ajouter** dans la catégorie appropriée :
   ```typescript
   // Dans la section appropriée
   newIcon: '🆕',
   ```
3. **TypeScript** : Le type `IconName` sera mis à jour automatiquement

---

## Correspondance Mascottes

| Mascotte | Jeu | Icône |
|----------|-----|-------|
| Piou | Home, Hanoï | `Icons.owl` (🦉) |
| Pixel | Suites Logiques | `Icons.robot` (🤖) |
| Scout | Labyrinthe | `Icons.squirrel` (🐿️) |
| Dr. Hibou | Balance | `Icons.owl` (🦉) |
| Prof. Hoo | Sudoku | `Icons.owl` (🦉) |
| Plume | Conteur Curieux | — (🪶 non dans Icons) |
| Memo | Memory | — (🐘 non dans Icons) |
| Géo | Tangram | — (🦊 non dans Icons) |
| Ada | Logix Grid | — (🐜 non dans Icons) |
| Lexie | Mots Croisés | — (🦜 non dans Icons) |
| Calc | MathBlocks | — (🦫 non dans Icons) |
| Pixel Renard | Matrices | — (🦊 non dans Icons) |

> **Note** : Les icônes manquantes peuvent être ajoutées au fichier icons.ts si nécessaire.

---

*Document créé — 29 Décembre 2024*
