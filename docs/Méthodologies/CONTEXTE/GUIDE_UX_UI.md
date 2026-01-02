# GUIDE UX/UI — Hello Guys

> **Application Éducative iPad • Enfants 6-10 ans**
> Basé sur les meilleures pratiques de Khan Academy Kids, Duolingo, Toca Boca

---

## 1. COMPRENDRE L'UTILISATEUR ENFANT

### Caractéristiques cognitives par âge

| ÂGE | CAPACITÉS | IMPLICATIONS UX |
|-----|-----------|-----------------|
| **6-7 ans** | • Lecture débutante<br>• Attention : 8-10 min max<br>• Motricité fine en développement | • Icônes + audio obligatoires<br>• Sessions très courtes<br>• Zones tactiles extra-larges |
| **8-9 ans** | • Lecture acquise<br>• Attention : 10-15 min<br>• Recherche de défis | • Texte court accepté<br>• Niveaux de difficulté<br>• Systèmes de progression |
| **9-10 ans** | • Autonomie accrue<br>• Attention : 15-20 min<br>• Sensibilité au "bébé" | • Interface plus mature<br>• Défis complexes<br>• Éviter l'aspect "enfantin" |

> **Référence** : Khan Academy Kids adapte son contenu par tranche d'âge

---

## 2. ZONES TACTILES ET INTERACTIONS

### Tailles minimales

> **Valeurs exactes dans le code** → `DESIGN_SYSTEM.md`

| ÉLÉMENT | MINIMUM | RECOMMANDÉ ENFANT |
|---------|---------|-------------------|
| Boutons principaux | 48 × 48 dp | **64 × 64 dp** |
| Icônes interactives | 44 × 44 pt | **60 × 60 dp** |
| Éléments draggables | — | **80 × 80 dp** |
| Espacement entre éléments | 8 dp | **16-24 dp** |

### Gestes à privilégier / éviter

| ✅ RECOMMANDÉS | ❌ À ÉVITER |
|----------------|-------------|
| Tap simple (un doigt) | Double tap |
| Drag & drop basique | Gestes multi-doigts complexes |
| Swipe horizontal/vertical | Rotation à deux doigts |
| Long press (avec feedback visuel) | Swipe avec timing précis |
| Pinch to zoom (optionnel) | Gestes combinés simultanés |

> **Référence** : Duolingo Kids utilise des boutons extra-larges (+15% de taux de réussite)

---

## 3. NAVIGATION ET ARCHITECTURE

### Principes de navigation enfant

1. **Profondeur maximale : 3 niveaux**
   - L'enfant doit toujours pouvoir revenir à l'accueil en 2 taps maximum

2. **Navigation sans lecture**
   - 100% des actions compréhensibles via icônes + couleurs uniquement

3. **Pas de bouton "retour" texte**
   - Flèche gauche universelle, toujours au même endroit (coin supérieur gauche)

4. **Éviter les menus hamburger**
   - Les enfants ne comprennent pas cette convention
   - Préférer les onglets visibles

5. **Lancement immédiat**
   - Pour les 6-7 ans, démarrer directement dans l'activité

> **Référence** : Toca Boca utilise des menus visuels avec 3-5 choix maximum par écran

### Structure recommandée

```
Niveau 1 : Écran d'accueil avec catégories visuelles (icônes larges)
    ↓
Niveau 2 : Liste des activités dans la catégorie
    ↓
Niveau 3 : Activité/jeu (espace immersif sans distraction)
```

---

## 4. PALETTE DE COULEURS

> **Tokens exacts pour le code** → `DESIGN_SYSTEM.md`

### Palette principale

| COULEUR | CODE | USAGE | ÉMOTION |
|---------|------|-------|---------|
| **Bleu Primary** | `#5B8DEE` | Boutons principaux, navigation | Confiance, calme |
| **Orange Secondary** | `#FFB347` | Accents, highlights, CTA | Chaleur, énergie |
| **Vert Success** | `#7BC74D` | Validation, réussite | Accomplissement |
| **Violet Accent** | `#E056FD` | Éléments ludiques, surprises | Créativité, magie |
| **Crème Background** | `#FFF9F0` | Fond principal | Douceur, apaisement |
| **Jaune Attention** | `#F39C12` | Indices, aide | Curiosité |

### Règles d'accessibilité couleurs

- **Contraste WCAG AA minimum** : 4.5:1 pour le texte, 3:1 pour les graphiques
- **Éviter rouge/vert seuls** : 8% des garçons sont daltoniens
- **Toujours combiner** : couleur + forme/icône
- **Mode daltonien** : Icônes distinctives pour chaque état

> **Référence** : Duolingo utilise des couleurs vives sur fond blanc/neutre

---

## 5. TYPOGRAPHIE ET LISIBILITÉ

> **Tokens exacts pour le code** → `DESIGN_SYSTEM.md`

### Polices utilisées

| POLICE | USAGE |
|--------|-------|
| **Nunito** | Texte principal (dyslexie-friendly, ronde, lisible) |
| **Fredoka** | Titres, boutons (ludique mais lisible) |

### Tailles de police

| ÉLÉMENT | TAILLE MINIMUM |
|---------|----------------|
| Titres principaux | 28-32 pt |
| Texte de bouton | 20-24 pt |
| Texte courant | **18 pt minimum** |
| Badges/labels | 12-14 pt (exception) |

### Règles de rédaction

- Phrases courtes : **5-10 mots maximum**
- Vocabulaire simple et concret
- Éviter les négations ("Ne pas..." → "Essaie plutôt...")
- Tutoiement bienveillant
- Toujours accompagner le texte d'une icône

> **Référence** : Endless Alphabet utilise animations + audio pour expliquer sans texte

---

## 6. FEEDBACK ET ANIMATIONS

### Feedback immédiat (< 100ms)

Chaque interaction doit produire un retour visuel :

| ACTION | FEEDBACK |
|--------|----------|
| Touch down | Scale 0.95 + légère ombre |
| Touch up | Retour scale 1.0 avec spring |
| Succès | Animation confetti + son positif |
| Erreur | Vibration légère + message encourageant |

### Règle fondamentale

> ❌ **JAMAIS de feedback punitif**
> ✅ Toujours encourageant : "Essaie encore !", "Tu y es presque !"

### Animations recommandées

> **Configurations exactes** → `DESIGN_SYSTEM.md`

- Utiliser **Reanimated 3** avec `withSpring` pour des animations naturelles
- Durée typique : 200-400ms
- Éviter les animations trop rapides ou saccadées

---

## 7. SYSTÈME DE PROGRESSION

### Récompenses intrinsèques > extrinsèques

| ✅ PRIVILÉGIER | ❌ ÉVITER |
|----------------|-----------|
| Satisfaction de comprendre | Points/scores compétitifs |
| Débloquer une nouvelle histoire | Classements |
| Voir son jardin grandir | Récompenses monétaires virtuelles |
| Célébrations visuelles | Pression temporelle |

### Progression visible

- Barre de progression simple
- Étoiles ou fleurs qui s'accumulent
- Personnalisation d'avatar débloquée
- Nouvelles mascottes à découvrir

---

## 8. ACCESSIBILITÉ

### Règles obligatoires

- **Contraste texte** : ≥ 4.5:1
- **Touch targets** : ≥ 64dp
- **Jamais couleur seule** : toujours + icône
- **Support VoiceOver/TalkBack** : accessibilityLabel sur tous les éléments interactifs

### Props d'accessibilité

```tsx
<Pressable
  accessible={true}
  accessibilityLabel="Jouer au jeu Tour de Hanoï"
  accessibilityRole="button"
  accessibilityHint="Ouvre le jeu"
>
```

---

## 9. PAGE D'ACCUEIL — FORÊT MAGIQUE

### Philosophie du design

La page d'accueil V10 adopte une approche immersive :
- Décor de forêt magique couvrant 100% de l'écran
- Contenu scrollable flottant au-dessus du paysage
- Expérience enchantée captant l'attention

### Éléments clés

1. **Header** : Avatar + nom enfant + bouton parent
2. **Widgets** : Mascotte, jardin, streak, collection
3. **Catégories** : Scroll horizontal par type de jeu
4. **Fond animé** : Nuages, animaux, soleil

---

## 10. CHECKLIST UX AVANT DÉVELOPPEMENT

### Accessibilité
- [ ] Zones tactiles ≥ 64dp
- [ ] Contraste texte ≥ 4.5:1
- [ ] Jamais couleur seule (toujours + icône)
- [ ] Police ≥ 18pt texte courant
- [ ] Support VoiceOver/TalkBack

### Navigation
- [ ] Profondeur ≤ 3 niveaux
- [ ] Retour accueil ≤ 2 taps
- [ ] Navigation 100% visuelle possible
- [ ] Pas de menu hamburger

### Feedback
- [ ] Feedback visuel immédiat sur chaque tap
- [ ] Jamais de feedback négatif punitif
- [ ] Animations fluides 60fps
- [ ] Sons optionnels et désactivables

### Sécurité
- [ ] Espace parent protégé (PIN/FaceID)
- [ ] Pas de liens externes accessibles enfant
- [ ] Mode hors-ligne fonctionnel

---

## 11. RESSOURCES LIÉES

| Document | Contenu |
|----------|---------|
| `DESIGN_SYSTEM.md` | Tokens exacts (couleurs, typo, spacing, animations) |
| `UI_COMPONENTS_CATALOG.md` | Composants prêts à l'emploi |
| `INSTRUCTIONS_PROJET_APP_EDUCATIVE.md` | Vision pédagogique |

---

*Guide UX/UI — Janvier 2026*
*Basé sur les guidelines UX enfant et principes Montessori*
