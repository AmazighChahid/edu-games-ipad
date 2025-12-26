# 🗼 Tour de Hanoï - Documentation Complète

## Vue d'ensemble

La Tour de Hanoï est un casse-tête mathématique classique qui développe les capacités de planification et de raisonnement logique chez l'enfant.

## 📂 Fichiers de Documentation

| Fichier | Description |
|---------|-------------|
| [FICHE_ACTIVITE.md](./FICHE_ACTIVITE.md) | Objectifs pédagogiques, UX flow, UI, feedback |
| [FICHE_PARENT.md](./FICHE_PARENT.md) | Guide d'accompagnement parental |
| [DIALOGUES_IA.md](./DIALOGUES_IA.md) | Scripts de la mascotte Léo |
| [SPECS_TECHNIQUES.md](./SPECS_TECHNIQUES.md) | Architecture React Native, hooks, types |

---

## 🎯 Résumé Rapide

| Aspect | Détail |
|--------|--------|
| **Âge cible** | 6-10 ans |
| **Durée session** | 5-15 min |
| **Compétence principale** | Planification stratégique |
| **Difficulté** | 2 à 7 disques (progressif) |
| **Mascotte** | Léo le Singe 🐵 |

---

## 🧠 Méthode Enseignée

> **"Pour déplacer N disques, je dois d'abord libérer le plus grand"**

L'enfant apprend à :
1. **Observer** avant d'agir
2. **Planifier** plusieurs coups à l'avance
3. **Décomposer** un problème complexe
4. **Persévérer** face à la difficulté

---

## 🎮 Règles

1. On déplace **un seul disque** à la fois
2. Un disque ne peut se poser que sur un **plus grand** ou un piquet vide
3. Objectif : déplacer toute la pile vers le piquet de droite

---

## 📱 Implémentation Rapide

```bash
# Structure des fichiers
src/components/activities/TourHanoi/
├── TourHanoiGame.tsx      # Composant principal
├── components/
│   ├── Disk.tsx           # Disque animé
│   ├── Peg.tsx            # Piquet
│   └── GameBoard.tsx      # Plateau
└── hooks/
    └── useHanoiGame.ts    # Logique de jeu
```

---

*Tour de Hanoï | Application Éducative Montessori iPad*
