# 🤖 Guide Visuel - Pixel le Robot

Une mascotte animée SVG avec 5 émotions pour l'activité Suites Logiques

---

## 🎨 Les 5 Émotions de Pixel

### 1. Neutral 😐 - État Initial
```
    ┌─────────┐
    │  ● ● ║  │  Yeux normaux (échelle 1.0)
    │   ─  ║  │  Bouche droite
    └─────────┘
```
**Quand ?** Début du niveau, attente de l'action
**Couleur nom :** Gris (#4A4A4A)

---

### 2. Happy 😊 - Sélection
```
    ┌─────────┐
    │  ● ●  ║  │  Yeux légèrement agrandis (1.2)
    │   ⌣  ║  │  Sourire modéré
    └─────────┘
```
**Quand ?** L'utilisateur sélectionne une réponse
**Couleur nom :** Vert (#7BC74D)

---

### 3. Thinking 🤔 - Réflexion
```
    ┌─────────┐
    │  • •  ║  │  Yeux rétrécis (0.8)
    │   ⌢  ║  │  Petite bouche
    └─────────┘
```
**Quand ?** Pendant un indice
**Couleur nom :** Bleu (#5B8DEE)

---

### 4. Excited 🤩 - Succès!
```
    ┌─────────┐
    │  ● ●  ║  │  Grands yeux PULSANTS (1.5)
    │   ⌣⌣ ║  │  GRAND sourire
    └─────────┘
```
**Quand ?** Réponse correcte validée
**Couleur nom :** Doré (#FFD700)
**Animation spéciale :** Yeux qui pulsent en continu

---

### 5. Encouraging 😌 - Encouragement
```
    ┌─────────┐
    │  ● ●  ║  │  Yeux légèrement grands (1.1)
    │   ⌣  ║  │  Sourire bienveillant
    └─────────┘
```
**Quand ?** Après une erreur, pour encourager
**Couleur nom :** Orange (#FFB347)

---

## 💬 Bulle de Dialogue Améliorée

### Design

```
╔═══════════════════════════════════════╗
║ 🤖 Pixel :                            ║  ← Nom en gras, couleur émotion
║                                       ║
║ Bip bip ! Trouve ce qui vient après  ║  ← Texte 17px, semi-bold
║ et clique sur Valider !               ║     Line height: 26px
║                                       ║
╚═══════════════════════════════════════╝
  ▼                                        ← Flèche pointer
```

### Améliorations

| Avant | Après |
|-------|-------|
| 220px max | 280px min, 90% max |
| Police 15px | Police 17px |
| Padding 16px | Padding 20px |
| Pas de bordure | Bordure 3px bleue |
| Nom inline | Nom séparé en header |
| Couleur fixe | Couleur change avec émotion |

---

## ✨ Animations

### 1. Floating (Lévitation)
```
   ↑
  [🤖]  ← Monte de 8px
   ↓
  [🤖]  ← Descend à position initiale
   ↑
(Cycle de 3 secondes)
```

### 2. Antenna Bobbing (Antenne)
```
  ●        ●        ●
   \       |       /
    \      |      /
   -15°    0°    +15°
(Cycle de 2 secondes)
```

### 3. Screen Glow (Écran)
```
█████  →  ▓▓▓▓▓  →  █████
100%       50%       100%
(Opacité pulse en 4 secondes)
```

### 4. Eyes Emotion (Yeux)
```
Neutral → Happy → Excited
  1.0      1.2      1.5 (pulsant)
```

### 5. Bubble Pop (Bulle)
```
●  →  ◐  →  ◯  →  ⬤
0%    25%    75%   100%
(Spring animation avec rebond)
```

---

## 🎬 Scénarios d'Interaction

### Scénario 1 : Succès au Premier Essai
```
1. Démarrage
   Émotion: Encouraging 😌
   Message: "Bip bip ! Trouve ce qui vient après..."

2. Utilisateur sélectionne
   Émotion: Happy 😊
   Message: "Clique sur 'Valider' pour confirmer..."

3. Validation → Succès
   Émotion: Excited 🤩 (yeux pulsent!)
   Message: "Bip bip ! Bien trouvé ! ✨"

4. Suite suivante
   Émotion: Neutral 😐
   Message: "Regarde bien cette suite..."
```

### Scénario 2 : Erreur puis Indice
```
1. Démarrage
   Émotion: Neutral 😐

2. Sélection + Validation → Erreur
   Émotion: Encouraging 😌
   Message: "Hmm, pas celui-là... Regarde encore !"

3. Demande d'indice
   Émotion: Thinking 🤔
   Message: "Regarde les premiers éléments..."

4. Nouvelle tentative réussie
   Émotion: Excited 🤩
   Message: "Bravo ! Tu as trouvé !"
```

---

## 🎨 Palette de Couleurs Complète

### Robot
```
Corps Principal:    ████ #5B8DEE (Bleu)
Corps Clair:        ████ #7BA3F5 (Bleu clair)
Corps Foncé:        ████ #4A6FC4 (Bleu foncé)
Écran:              ████ #2D4A7C (Bleu sombre)
Écran Lueur:        ████ #6B9FFF (Bleu brillant)
Antenne:            ████ #FFB347 (Orange)
Yeux:               ████ #00E5FF (Cyan)
Yeux Lueur:         ████ #00FFFF (Cyan brillant)
Bouche/Accent:      ████ #FFD700 (Doré)
```

### Bulle de Dialogue
```
Fond:               ████ #FFFFFF (Blanc)
Bordure:            ████ #E0E8F8 (Bleu très pâle)
Texte:              ████ #2C3E50 (Gris foncé)
Nom (varie):        Selon émotion
```

---

## 📏 Dimensions Techniques

### Composant Robot
- Largeur: 100px
- Hauteur: 120px
- ViewBox SVG: "0 0 100 120"

### Bulle de Dialogue
- Min width: 280px
- Max width: 90%
- Padding: 20px
- Border radius: 24px
- Border width: 3px

### Typography
- Nom Pixel: 16px, weight 800
- Message: 17px, weight 600
- Line height: 26px

---

## 🔧 Comment Tester

### Dans l'App

1. **Lancer Suites Logiques**
   - Observer : Pixel apparaît avec émotion "encouraging"

2. **Sélectionner une réponse**
   - Observer : Pixel sourit (happy)

3. **Valider une bonne réponse**
   - Observer : Pixel très content (excited) avec yeux qui pulsent

4. **Valider une mauvaise réponse**
   - Observer : Pixel encourageant (encouraging)

5. **Demander un indice**
   - Observer : Pixel en mode réflexion (thinking)

6. **Passer à la suite suivante**
   - Observer : Pixel neutre (neutral)

### Vérifications Visuelles

- [ ] Toutes les animations sont fluides (60 FPS)
- [ ] Les émotions changent correctement
- [ ] La bulle est bien lisible
- [ ] Le robot flotte doucement
- [ ] L'antenne balance
- [ ] L'écran pulse
- [ ] Les yeux s'animent selon l'émotion

---

## 💡 Astuces de Design

### Pourquoi ces choix ?

**Yeux Cyan** 🔵
→ Rappelle les LEDs, effet high-tech et futuriste

**Corps Bleu** 🔷
→ Couleur primaire de l'app, cohérence visuelle

**Bouche Dorée** ⭐
→ Contraste fort, attire l'attention sur l'expression

**Antenne Orange** 🟠
→ Point focal secondaire, ajoute de la vie

**Bulle Agrandie** 💬
→ Plus d'espace = messages pédagogiques plus riches

**Police Bold** 📝
→ Meilleure lisibilité pour les jeunes lecteurs (6-10 ans)

---

## 🎯 Objectifs Pédagogiques Atteints

✅ **Feedback émotionnel immédiat** : L'enfant voit la réaction
✅ **Renforcement positif** : Sourire au succès
✅ **Encouragement bienveillant** : Pas de punition visuelle
✅ **Guidage clair** : Messages bien lisibles
✅ **Engagement visuel** : Animations attractives
✅ **Connexion émotionnelle** : Le robot "ressent" avec l'enfant

---

**Guide Visuel - Pixel le Robot**
**Version 2.0.0 - 26 décembre 2025**
