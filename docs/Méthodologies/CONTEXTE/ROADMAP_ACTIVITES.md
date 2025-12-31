# 🎯 ROADMAP ACTIVITÉS — Hello Guys

> **18 Activités planifiées** pour l'App Éducative iPad (6-10 ans)
> Ce document décrit la vision et les descriptions pédagogiques des activités.
> **Source de vérité pour l'état actuel** → `src/games/registry.ts`

---

## 📊 État actuel vs Planifié

| Statut | Nombre | Description |
|--------|--------|-------------|
| ✅ Disponible | 12 | Implémentés et jouables |
| 🔜 Coming Soon | 3 | En cours de développement |
| 📋 Planifié | 3 | Spécifications prêtes |

---

## 🎮 Activités Disponibles (12)

### 01. Tour de Hanoï 🗼
**Catégorie** : Logic | **Mascotte** : Piou 🦉

**Méthode enseignée** : "Décompose un problème complexe en étapes simples. Pour déplacer N disques, il faut d'abord déplacer N-1."

---

### 02. Suites Logiques 🔢
**Catégorie** : Logic | **Mascotte** : Pixel 🤖

**Méthode enseignée** : "Observe ce qui change entre chaque élément pour trouver la règle."

---

### 03. Labyrinthe 🌳
**Catégorie** : Spatial | **Mascotte** : Scout 🐿️

**Méthode enseignée** : "Planifie ton chemin avant de partir. Reviens en arrière si tu es bloqué."

---

### 04. Balance Logique ⚖️
**Catégorie** : Math | **Mascotte** : Dr. Hibou 🦉

**Méthode enseignée** : "Ce qui est égal d'un côté doit être égal de l'autre. Trouve les équivalences."

---

### 05. Sudoku Montessori 🔲
**Catégorie** : Logic | **Mascotte** : Prof. Hoo 🦉

**Méthode enseignée** : "Élimine les impossibilités pour trouver la seule possibilité."

---

### 06. Le Conteur Curieux 📚
**Catégorie** : Language | **Mascotte** : Plume 🪶

**Méthode enseignée** : "Écoute attentivement. Retiens personnages, lieux, événements. Reformule avec TES mots."

**Structure session** :
1. Découverte (écoute/lecture)
2. Questions (factuelles, causales, inférentielles)
3. Reformulation

---

### 07. Memory 🧠
**Catégorie** : Memory | **Mascotte** : Memo 🐘

**Méthode enseignée** : "Crée des associations mentales pour mémoriser les positions."

---

### 08. Puzzle Formes (Tangram) 🔷
**Catégorie** : Spatial | **Mascotte** : Géo 🦊

**Méthode enseignée** : "Visualise comment les formes s'assemblent avant de les placer."

---

### 09. Logix Grid 🧩
**Catégorie** : Logic | **Mascotte** : Ada 🐜

**Méthode enseignée** : "Utilise les indices pour éliminer les impossibilités une par une."

---

### 10. Mots Croisés 📝
**Catégorie** : Language | **Mascotte** : Lexie 🦜

**Méthode enseignée** : "Les lettres croisées te donnent des indices. Commence par les mots dont tu es sûr."

---

### 11. MathBlocks 🧮
**Catégorie** : Math | **Mascotte** : Calc 🦫

**Méthode enseignée** : "Décompose les calculs en étapes simples."

---

### 12. Matrices Magiques 🔮
**Catégorie** : Logic | **Mascotte** : Pixel 🦊

**Méthode enseignée** : "Observe ligne par ligne, colonne par colonne. Trouve CE QUI CHANGE."

**Description** : Grille 2x2 ou 3x3 avec formes suivant une logique (rotation, ajout, couleur). Trouver la pièce manquante. Inspiré des Matrices de Raven.

---

## 🔜 Coming Soon (3)

### 13. Embouteillage 🚗
**Catégorie** : Logic | **Priorité** : ⭐⭐⭐⭐

**Finalité** : Développer la planification séquentielle et la pensée anticipative.

**Description** : Véhicules bloqués sur grille 6x6. Déplacer les voitures (horizontal/vertical uniquement) pour libérer la voiture rouge vers la sortie. Inspiré de Rush Hour.

**Méthode** : "Planifie plusieurs coups à l'avance. Parfois il faut reculer pour avancer."

**Niveaux** : 5-8 mouvements (débutant) → 20+ mouvements (expert).

---

### 14. La Fabrique de Réactions ⚙️
**Catégorie** : Logic/STEM | **Priorité** : ⭐⭐⭐⭐⭐

**Finalité** : Développer la pensée causale (cause → effet) et la compréhension des mécanismes.

**Description** : Construire des réactions en chaîne (Machine de Rube Goldberg). Chaque élément en active un autre.

**Exemple** :
```
🐹 Hamster → 🔄 Roue → 🔗 Courroie → ⚙️ Moteur → 🌬️ Ventilateur → ⚽ Balle → 🔘 Bouton → 🚀 Fusée
```

**Modes de jeu** :
1. Complète la machine (placer éléments manquants)
2. Remets dans l'ordre (éléments mélangés)
3. Construis ta machine (mode libre)
4. Trouve l'erreur (identifier l'élément mal placé)

**Méthode** : "Chaque élément en active un autre. Trouve les connexions pour que l'énergie se transmette."

---

### 15. Chasseur de Papillons 🦋
**Catégorie** : Memory/Attention | **Priorité** : ⭐⭐⭐

**Finalité** : Développer l'attention divisée et le tracking visuel multi-cibles.

**Description** : Plusieurs papillons se déplacent à l'écran. L'enfant les attrape dans un ordre précis (bleu → jaune → rouge). Nombre et vitesse augmentent progressivement.

**Méthode** : "Observe tout le tableau, repère ta cible, puis suis-la."

---

## 📋 Planifiées (Vision future)

### 16. Code Secret 🔐
**Catégorie** : Logic/Déduction | **Âge** : 8-10

**Finalité** : Développer le raisonnement déductif et le processus d'élimination.

**Description** : Deviner un code de 3-4 couleurs/symboles. Après chaque essai : indices (⚫ = bien placé, ⚪ = mal placé). Inspiré de Mastermind.

**Méthode** : "Utilise les indices pour éliminer les impossibilités."

---

### 17. L'Intrus Mystère 🔍
**Catégorie** : Logic/Catégorisation | **Âge** : 6-10

**Finalité** : Développer la capacité à catégoriser et justifier son raisonnement.

**Description** : 4-6 images affichées. Trouver celle qui n'appartient pas au groupe ET expliquer pourquoi.

**Méthode** : "Cherche le point commun entre tous sauf un."

---

### 18. Miroir Magique 🪞
**Catégorie** : Spatial/Symétrie | **Âge** : 6-9

**Finalité** : Développer la perception visuo-spatiale et la compréhension de la symétrie.

**Description** : Un dessin d'un côté du miroir, compléter l'autre côté en respectant la symétrie.

**Méthode** : "Ce qui est à gauche se retrouve à droite, mais inversé."

---

## 🎨 Principes communs à toutes les activités

### Feedback
- ✅ **Succès** : Célébration visuelle + message encourageant
- 💪 **Erreur** : Message bienveillant, jamais punitif ("Essaie encore !")
- 💡 **Indice** : Guidance progressive sans donner la réponse

### Méthode avant résultat
> « Apprendre à penser, pas à répondre »

Chaque activité enseigne un PROCESSUS de réflexion, pas juste un résultat.

### Sessions adaptées par âge
| Âge | Durée max | Complexité |
|-----|-----------|------------|
| 6-7 ans | 8-10 min | Guidage fort |
| 8-9 ans | 10-15 min | Guidage moyen |
| 9-10 ans | 15-20 min | Autonomie |

---

## 📚 Ressources liées

| Document | Contenu |
|----------|---------|
| `src/games/registry.ts` | État actuel des jeux (code) |
| `MASCOTTES_REGISTRY.md` | Détails des mascottes |
| `/Fiches Educatives/` | Spécifications pédagogiques par jeu |

---

*Document de vision — Décembre 2024*
