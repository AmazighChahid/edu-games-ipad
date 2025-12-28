# BRIEF REACT NATIVE : Écran Introduction
## Chasseur de Papillons - ChasseurIntroScreen

---

## 📋 Informations Générales

| Propriété | Valeur |
|-----------|--------|
| **Fichier** | `src/games/chasseur-papillons/screens/ChasseurIntroScreen.tsx` |
| **Prototype HTML** | `chasseur-intro.html` |
| **Thème** | Nature / Jardin enchanté |

---

## 🏗️ Hiérarchie des Composants

```
ChasseurIntroScreen
├── NatureBackground
│   ├── Sky (gradient)
│   ├── Sun (avec glow animé)
│   ├── Clouds (×3, défilement)
│   ├── Hills (×3, superposées)
│   ├── Flowers (×6, balancement)
│   └── DecorativeButterflies (×4)
│
├── Header
│   ├── BackButton
│   ├── TitleSection
│   │   └── GameTitle + Subtitle
│   └── StatsBar
│
├── MainArea
│   ├── MascotSection
│   │   ├── FloraFull (ailes, cheveux, robe, baguette)
│   │   └── SpeechBubble
│   │
│   └── WorldsSection
│       ├── WorldsGrid (5 cartes)
│       └── LevelsSection (12 niveaux)
│
└── Footer
    ├── DifficultyInfo
    └── PlayButton
```

---

## 🎨 Design Tokens

```typescript
const CHASSEUR_COLORS = {
  sky: ['#87CEEB', '#B8E6FF', '#A8E6CF', '#7AC77A'],
  flora: { dress: '#FFB7C5', hair: '#90EE90', skin: '#FFE4C4' },
  text: { primary: '#2D5A27', secondary: '#5A8F5A' },
  levels: { completed: '#27AE60', current: '#FFB7C5' },
};
```

---

## 🎬 Animations Clés

| Animation | Durée | Type |
|-----------|-------|------|
| Cloud drift | 45s | Linear infinite |
| Sun glow | 3s | Pulse |
| Flower sway | 3s | Alternate |
| Flora float | 3s | Ease-in-out |
| Wing flutter | 0.5s | Infinite |
| Baguette sparkle | 1s | Pulse |
| Level pulse | 2s | Glow |

---

## 📦 Composants Principaux

- **FloraFull** : Fée complète avec ailes animées
- **WorldCard** : Carte monde avec progression
- **LevelButton** : Bouton niveau avec états

---

*Brief v1.0 — ChasseurIntroScreen*
