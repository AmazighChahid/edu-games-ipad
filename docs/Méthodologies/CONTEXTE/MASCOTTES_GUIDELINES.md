# Mascottes Guidelines

> Règles de création et comportement des mascottes pour Claude Code

---

## Principes fondamentaux

### Personnalité

Chaque mascotte doit avoir :
- **Nom** et **espèce** cohérents avec le jeu
- **Catchphrase** mémorable (ex: "Détecte le pattern !")
- **Personnalité** en 3 mots (ex: logique, méthodique, précis)
- **Emoji** représentatif

### Ton de communication

| Contexte | Ton | Exemple |
|----------|-----|---------|
| Introduction | Accueillant, enthousiaste | "Bonjour ! Je suis [Nom] !" |
| Règle | Clair, simple | "On ne peut bouger qu'un disque à la fois !" |
| Erreur | **Jamais punitif**, encourageant | "Oups ! Essaie encore !" |
| Indice | Guidant sans donner la réponse | "Observe bien cette ligne..." |
| Victoire | Célébratoire | "Bravo ! Tu es super malin !" |

### Adaptation par âge

| Tranche | Vocabulaire | Longueur |
|---------|-------------|----------|
| 6-7 ans | Simple, concret | Phrases courtes |
| 8-10 ans | Plus élaboré | Peut inclure concepts |

---

## Guidelines visuelles

### Tailles standard

```typescript
const MascotSizes = {
  bubble: { width: 60, height: 60 },      // Bulle de dialogue
  floating: { width: 80, height: 85 },    // Widget Home
  fullscreen: { width: 200, height: 220 } // Écran intro
};
```

### Émotions requises

Chaque mascotte doit supporter :

| Émotion | Expression | Usage |
|---------|------------|-------|
| `neutral` | Repos | État par défaut |
| `happy` | Sourire | Succès, bon coup |
| `thinking` | Yeux réduits | Indice, réflexion |
| `excited` | Grand sourire | Victoire |
| `encouraging` | Doux | Après erreur |

### Animations standard (Reanimated)

```typescript
const MascotAnimations = {
  idle: {
    translateY: [-5, 5],
    duration: 3000,
    loop: true
  },
  speak: {
    scale: [1, 1.05, 1],
    duration: 300
  },
  celebrate: {
    translateY: [0, -20, 0],
    rotate: [-5, 5, 0],
    duration: 1000
  }
};
```

---

## Structure d'une mascotte

### Fichiers requis

```
src/games/XX-nom-jeu/
├── components/
│   └── XxxMascot.tsx          # Composant visuel (SVG)
└── data/
    └── assistantScripts.ts    # Dialogues par trigger
```

### Scripts assistant (`assistantScripts.ts`)

```typescript
export const SCRIPTS: AssistantScript[] = [
  {
    id: 'welcome',
    trigger: 'game_start',
    messages: [
      { text: "Bienvenue !", mood: 'happy', duration: 3000 }
    ]
  },
  {
    id: 'error',
    trigger: 'invalid_move',
    messages: [
      { text: "Essaie encore !", mood: 'encouraging', duration: 2000 }
    ]
  },
  {
    id: 'hint',
    trigger: 'hint_requested',
    messages: [
      { text: "Regarde bien ici...", mood: 'thinking', duration: 3000 }
    ]
  },
  {
    id: 'victory',
    trigger: 'victory',
    messages: [
      { text: "Bravo !", mood: 'excited', duration: 4000 }
    ]
  }
];
```

---

## Mascotte principale : Piou

La mascotte globale de l'app.

| Attribut | Valeur |
|----------|--------|
| Nom | Piou |
| Espèce | Hibou |
| Emoji | 🦉 |
| Personnalité | Sage, encourageant, bienveillant |
| Présent sur | Home, transitions |

### Palette Piou

```typescript
const PiouColors = {
  body: '#C9A86C',      // Beige principal
  belly: '#F5E6D3',     // Ventre crème
  beak: '#FFB347',      // Bec orange
  eyes: '#2C1810'       // Pupilles marron foncé
};
```

---

## Checklist nouvelle mascotte

- [ ] Nom et personnalité définis
- [ ] Emoji choisi
- [ ] Catchphrase créée
- [ ] Palette de couleurs (4-6 couleurs max)
- [ ] 5 émotions implémentées
- [ ] Animation idle
- [ ] Scripts pour : welcome, error, hint, victory
- [ ] Messages adaptés 6-7 ans ET 8-10 ans

---

*Source : voir composants existants dans `src/games/*/components/`*
