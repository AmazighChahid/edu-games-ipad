# 📚 Activités Éducatives Montessori - iPad App (6-10 ans)

## Vue d'ensemble

Cette documentation contient les spécifications complètes pour 5 activités éducatives basées sur les principes Montessori, destinées aux enfants de 6 à 10 ans.

## 🎯 Principe Fondamental

> **"Apprendre à penser, pas à répondre"**

L'objectif n'est PAS de fournir des résultats corrects, mais de **transmettre les MÉTHODES de raisonnement**. L'enfant doit comprendre le "pourquoi" et le "comment".

## 📂 Structure des Activités

| # | Activité | Compétences Principales | Âge Cible |
|---|----------|------------------------|-----------|
| 1 | [Tour de Hanoï](./01-tour-hanoi/README.md) | Planification, anticipation, décomposition | 6-10 ans |
| 2 | [Suites Logiques](./02-suites-logiques/README.md) | Logique séquentielle, classification, induction | 6-10 ans |
| 3 | [Labyrinthe Logique](./03-labyrinthe/README.md) | Orientation spatiale, flexibilité, mémoire | 6-10 ans |
| 4 | [Balance Logique](./04-balance/README.md) | Égalité, équivalence, pré-algèbre | 6-10 ans |
| 5 | [Sudoku Montessori](./05-sudoku/README.md) | Logique déductive, patience, concentration | 6-10 ans |

## 🏗️ Architecture Technique

```
/src
├── components/
│   ├── ui/                    # Boutons, cartes, inputs enfants
│   ├── activities/            # Composants spécifiques aux jeux
│   │   ├── TourHanoi/
│   │   ├── SuitesLogiques/
│   │   ├── Labyrinthe/
│   │   ├── Balance/
│   │   └── Sudoku/
│   ├── feedback/              # Animations, récompenses
│   └── ai/                    # Interface assistant IA
├── screens/
│   ├── child/                 # Écrans espace enfant
│   └── parent/                # Écrans espace parent
├── hooks/                     # Logique réutilisable
├── context/                   # État global (progression, profil)
├── services/                  # API, stockage, IA
├── constants/                 # Couleurs, dimensions, textes
└── assets/                    # Images, sons, polices
```

## 🎨 Palette de Couleurs

| Nom | Code | Usage |
|-----|------|-------|
| **Primary** | `#5B8DEE` | Bleu confiance, boutons principaux |
| **Secondary** | `#FFB347` | Orange chaleureux, accents |
| **Success** | `#7BC74D` | Vert validation, réussite |
| **Background** | `#FFF9F0` | Crème apaisant, fond principal |
| **Accent** | `#E056FD` | Violet ludique, éléments fun |
| **Attention** | `#F39C12` | Jaune indices, aide |

## 📏 Règles UX Enfant

### Zones Tactiles
- Boutons principaux : **64 × 64 dp minimum**
- Éléments draggables : **80 × 80 dp**
- Espacement : **16-24 dp**

### Typographie
- Titres : **28-32 pt**
- Boutons : **20-24 pt**
- Texte courant : **18-22 pt** (jamais < 16 pt)
- Police recommandée : **Nunito Sans** (alternative dyslexie : OpenDyslexic)

### Principes Clés
1. ✅ Feedback immédiat et bienveillant
2. ✅ Sessions courtes (5-15 min selon âge)
3. ✅ Gestes naturels (tap, drag & drop, swipe)
4. ✅ Navigation sans lecture (icônes explicites)
5. ✅ Récompenses intrinsèques (satisfaction > points)
6. ❌ Jamais de feedback punitif
7. ❌ Pas de timer stressant
8. ❌ Pas de classements/compétition

## 🔄 Principes Pédagogiques Montessori

1. **Méthode avant résultat** - Chaque activité enseigne un processus de réflexion explicite
2. **Erreur constructive** - Les erreurs sont des opportunités d'apprentissage
3. **Autonomie progressive** - Guidance décroissante (scaffolding)
4. **Transfert des compétences** - Applicables à d'autres contextes
5. **Manipulation concrète** - Interactions tactiles simulant le réel
6. **Auto-correction intégrée** - L'enfant voit lui-même ses erreurs

## 📊 Métriques Globales

Pour chaque activité, mesurer :
- Engagement (temps de session, fréquence)
- Persévérance (tentatives, reprises après échec)
- Autonomie (utilisation des aides)
- Progression (niveaux atteints, amélioration)

---

*Stack : React Native + Expo SDK 52+ | Plateforme : iPad principal*
