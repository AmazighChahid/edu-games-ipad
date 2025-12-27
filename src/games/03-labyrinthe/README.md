# 🌀 Labyrinthe Logique - Implémentation

## 📁 Structure du Projet

```
Labyrinthe/
├── LabyrintheGame.tsx          # Composant principal du jeu
├── index.ts                    # Point d'entrée (exports)
│
├── components/                 # Composants React
│   ├── MazeCell.tsx           # Cellule individuelle du labyrinthe
│   ├── MazeGrid.tsx           # Grille complète
│   ├── Avatar.tsx             # Personnage animé
│   ├── PathTrail.tsx          # Fil d'Ariane (SVG)
│   ├── InteractiveElement.tsx # Clés, portes, gemmes
│   ├── Inventory.tsx          # Inventaire des objets
│   ├── DirectionalControls.tsx# Boutons directionnels
│   ├── VictoryScreen.tsx      # Écran de fin
│   └── MascotBubble.tsx       # Mascotte Noisette
│
├── hooks/                      # Logique réutilisable
│   ├── useMazeGame.ts         # Logique principale du jeu
│   ├── useMazeGenerator.ts    # Génération procédurale
│   └── useAvatarMovement.ts   # Animations de mouvement
│
├── utils/                      # Utilitaires
│   └── helpers.ts             # Fonctions helper
│
├── data/                       # Données statiques
│   ├── themes.ts              # Thèmes visuels
│   └── levels.ts              # Configuration des niveaux
│
├── types/                      # Types TypeScript
│   └── index.ts               # Tous les types
│
└── constants/                  # Constantes (vide pour l'instant)
```

## 🎮 Comment Utiliser

### 1. Import Basique

```typescript
import { LabyrintheGame, LEVELS } from '@/components/activities/Labyrinthe';

// Dans votre composant
<LabyrintheGame
  level={LEVELS[0]}
  onComplete={(stats) => console.log('Niveau terminé !', stats)}
  onExit={() => navigation.goBack()}
/>
```

### 2. Page de Démo

Une page de démonstration complète est disponible dans :
```
app/labyrinthe-demo.tsx
```

Pour y accéder :
- Lancez l'app avec `npm start`
- Naviguez vers `/labyrinthe-demo`

## 🏗️ Architecture Technique

### Génération Procédurale

Le labyrinthe est généré avec l'algorithme **Recursive Backtracking** :

1. **Initialisation** : Grille remplie de murs
2. **Creusement** : Parcours récursif créant des chemins
3. **Validation** : Vérification qu'un chemin existe (BFS)
4. **Éléments interactifs** : Ajout de clés, portes, gemmes

### Gestion de l'État

Le hook `useMazeGame` gère tout l'état du jeu :

```typescript
const {
  mazeState,      // État complet du labyrinthe
  gameStatus,     // 'idle' | 'moving' | 'blocked' | 'victory'...
  moveAvatar,     // Fonction de déplacement
  requestHint,    // Demander un indice
  resetLevel,     // Recommencer le niveau
} = useMazeGame(level);
```

### Animations

Utilise **React Native Reanimated 3** :

- **Déplacement** : Spring animations fluides
- **Blocage** : Rebond subtil
- **Collecte** : Scale + fade out
- **Pulsation** : Pour les objets collectables

## 🎨 Design System

Conforme au design system défini dans `docs/DESIGN_SYSTEM.md` :

### Couleurs

```typescript
primary: '#5B8DEE'      // Bleu confiance
secondary: '#FFB347'    // Orange chaleureux
success: '#7BC74D'      // Vert validation
background: '#FFF9F0'   // Crème apaisant
```

### Typographie

- Titres : Fredoka (ludique)
- Corps : Nunito (lisible, dyslexie-friendly)
- Taille minimum : 18pt (enfants)

### Accessibilité

- ✅ Zones tactiles : 64dp minimum
- ✅ Contraste texte : 4.5:1 (WCAG AA)
- ✅ Feedback haptique sur toutes les interactions
- ✅ Support VoiceOver/TalkBack
- ✅ Couleur + icônes (jamais couleur seule)

## 🐿️ Mascotte Noisette

La mascotte s'adapte au contexte :

```typescript
// Messages contextuels
gameStatus === 'blocked'
  → "Oups ! C'est bloqué ici..."

gameStatus === 'door_locked'
  → "Il nous faut une clé pour cette porte !"

gameStatus === 'victory'
  → "Hourra ! On est sortis ! 🎉"
```

## 📊 Métriques & Progression

Les statistiques suivantes sont trackées :

- **Temps** : Durée de complétion
- **Exploration** : % du labyrinthe visité
- **Retours en arrière** : Nombre de backtrack
- **Indices utilisés** : Compteur d'aide
- **Gemmes collectées** : Bonus optionnels
- **Étoiles** : 1-3 selon performance

## 🎯 Niveaux

### Progression

| Niveaux | Taille | Difficulté | Éléments |
|---------|--------|------------|----------|
| 1-5 | 5×5 | Facile | Chemins simples |
| 6-10 | 7×7 | Moyen | Gemmes bonus |
| 11-15 | 9×9 | Difficile | Clés + Portes |
| 16+ | 11×11+ | Expert | Multi-objectifs |

### Thèmes Disponibles

- 🌲 **Forêt Enchantée** (niveaux 1-10)
- 🏛️ **Temple Ancien** (niveaux 11-20)
- 🚀 **Station Spatiale** (futurs niveaux)
- ❄️ **Château de Glace** (futurs niveaux)
- 🌺 **Jardin Secret** (futurs niveaux)

## 🔧 Personnalisation

### Ajouter un Nouveau Niveau

```typescript
// data/levels.ts
{
  id: 20,
  name: 'Défi Ultime',
  width: 11,
  height: 11,
  difficulty: 5,
  theme: 'space',
  hasKeys: true,
  keyCount: 3,
  hasGems: true,
  gemCount: 5,
  // ...
}
```

### Ajouter un Nouveau Thème

```typescript
// data/themes.ts
newtheme: {
  id: 'newtheme',
  name: 'Nouveau Thème',
  wallColor: '#XXXXXX',
  pathColor: '#XXXXXX',
  startIcon: '🏁',
  endIcon: '🏆',
  backgroundColor: '#XXXXXX',
}
```

## 🧪 Tests

Pour tester :

1. Lancez l'app : `npm start`
2. Allez sur `/labyrinthe-demo`
3. Testez les différents niveaux

Vérifiez :
- ✅ Génération correcte du labyrinthe
- ✅ Déplacement fluide
- ✅ Détection des murs
- ✅ Collecte des objets
- ✅ Ouverture des portes
- ✅ Écran de victoire
- ✅ Sons et haptiques

## 📱 Optimisations

- **Memoization** : `React.memo` sur MazeCell
- **useCallback** : Fonctions de déplacement
- **useMemo** : Calcul du chemin SVG
- **Lazy rendering** : Uniquement les cellules visibles
- **SharedValues** : Animations sur le thread UI

## 🎓 Pédagogie

Conforme aux principes Montessori :

1. **Auto-correction** : L'enfant voit ses erreurs
2. **Autonomie** : Indices progressifs
3. **Exploration libre** : Pas de pénalité
4. **Feedback positif** : Encouragements constants
5. **Progression adaptée** : Difficulté croissante

## 📚 Ressources

- [Spécifications complètes](../../../Fiches Educatives/03-labyrinthe/README.md)
- [Dialogues IA](../../../Fiches Educatives/03-labyrinthe/DIALOGUES_IA.md)
- [Design System](../../../docs/DESIGN_SYSTEM.md)

---

**Développé avec ❤️ selon les principes Montessori**
*App Éducative iPad - Noisette l'Écureuil 🐿️*
