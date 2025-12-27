# GUIDE UX/UI
## Application Éducative iPad • Enfants 6-10 ans

*Basé sur les meilleures pratiques de Khan Academy Kids, Duolingo, Toca Boca*

---

## 1. COMPRENDRE L'UTILISATEUR ENFANT

### Caractéristiques cognitives par âge

| ÂGE | CAPACITÉS | IMPLICATIONS UX |
|-----|-----------|-----------------|
| **6-7 ans** | • Lecture débutante<br>• Attention : 8-10 min max<br>• Motricité fine en développement | • Icônes + audio obligatoires<br>• Sessions très courtes<br>• Zones tactiles extra-larges |
| **8-9 ans** | • Lecture acquise<br>• Attention : 10-15 min<br>• Recherche de défis | • Texte court accepté<br>• Niveaux de difficulté<br>• Systèmes de progression |
| **9-10 ans** | • Autonomie accrue<br>• Attention : 15-20 min<br>• Sensibilité au "bébé" | • Interface plus mature<br>• Défis complexes<br>• Éviter l'aspect "enfantin" |

> **Référence** : Khan Academy Kids adapte son contenu par tranche d'âge avec des parcours personnalisés

---

## 2. ZONES TACTILES ET INTERACTIONS

### Tailles minimales obligatoires

| ÉLÉMENT | TAILLE MINIMUM | RECOMMANDÉ ENFANT |
|---------|----------------|-------------------|
| Boutons principaux | 48 × 48 dp | 64 × 64 dp minimum |
| Icônes interactives | 44 × 44 pt (Apple) | 60 × 60 dp |
| Éléments draggables | — | 80 × 80 dp |
| Espacement entre éléments | 8 dp | 16-24 dp |

### Gestes à privilégier / éviter

| ✓ GESTES RECOMMANDÉS | ✗ GESTES À ÉVITER |
|----------------------|-------------------|
| • Tap simple (un doigt) | • Double tap |
| • Drag & drop basique | • Gestes multi-doigts complexes |
| • Swipe horizontal/vertical | • Rotation à deux doigts |
| • Long press (avec feedback visuel) | • Swipe avec timing précis |
| • Pinch to zoom (optionnel) | • Gestes combinés simultanés |

> **Référence** : Duolingo Kids utilise des boutons extra-larges (+15% de taux de réussite sur les tâches)

---

## 3. NAVIGATION ET ARCHITECTURE

### Principes de navigation enfant

1. **Profondeur maximale : 3 niveaux.** L'enfant doit toujours pouvoir revenir à l'accueil en 2 taps maximum.

2. **Navigation sans lecture.** 100% des actions doivent être compréhensibles via icônes + couleurs uniquement.

3. **Pas de bouton "retour" texte.** Utiliser une flèche gauche universelle, toujours au même endroit (coin supérieur gauche).

4. **Éviter les menus hamburger.** Les enfants ne comprennent pas cette convention. Préférer les onglets visibles.

5. **Lancement immédiat.** Pour les 6-7 ans, l'app doit démarrer directement dans l'activité, sans écran d'accueil complexe.

> **Référence** : Toca Boca utilise des menus visuels avec 3-5 choix maximum par écran

### Structure recommandée

Architecture à 3 niveaux maximum :

- **Niveau 1** : Écran d'accueil avec catégories visuelles (icônes larges)
- **Niveau 2** : Liste des activités dans la catégorie
- **Niveau 3** : Activité/jeu (espace immersif sans distraction)

---

## 4. PALETTE DE COULEURS

### Palette principale

| COULEUR | CODE | USAGE | ÉMOTION |
|---------|------|-------|---------|
| **Bleu Primary** | `#5B8DEE` | Boutons principaux, navigation | Confiance, calme, concentration |
| **Orange Secondary** | `#FFB347` | Accents, highlights, CTA secondaires | Chaleur, enthousiasme, énergie |
| **Vert Success** | `#7BC74D` | Validation, réussite, progression | Accomplissement, fierté |
| **Violet Accent** | `#E056FD` | Éléments ludiques, surprises, bonus | Créativité, magie, fun |
| **Crème Background** | `#FFF9F0` | Fond principal, espaces | Douceur, apaisement |
| **Jaune Attention** | `#F39C12` | Indices, aide, zones d'attention | Curiosité, exploration |

### Règles d'accessibilité couleurs

- **Contraste WCAG AA minimum** : 4.5:1 pour le texte, 3:1 pour les éléments graphiques
- **Éviter rouge/vert seuls** : 8% des garçons sont daltoniens. Toujours combiner couleur + forme/icône
- **Mode daltonien** : Prévoir des icônes distinctives pour chaque état (succès = check, erreur = X)
- **Éviter les couleurs vives sur fond vif** : Préférer des fonds neutres (crème, blanc cassé)

> **Référence** : Duolingo utilise des couleurs vives mais toujours sur fond blanc/neutre pour le confort visuel

---

## 5. TYPOGRAPHIE ET LISIBILITÉ

### Polices recommandées

| POLICE | USAGE | AVANTAGE |
|--------|-------|----------|
| **OpenDyslexic** | Texte principal (option) | Conçue pour la dyslexie |
| **Lexie Readable** | Alternative dyslexie | Plus discrète qu'OpenDyslexic |
| **Nunito / Nunito Sans** | Texte principal recommandé | Ronde, amicale, très lisible |
| **Fredoka One** | Titres, boutons | Ludique mais lisible |

### Tailles de police

- **Titres principaux** : 28-32 pt minimum
- **Texte de bouton** : 20-24 pt minimum
- **Texte courant** : 18-22 pt minimum (jamais moins de 16 pt)
- **Interligne** : 1.4 à 1.6 pour une lecture confortable
- **Longueur de ligne** : 45-75 caractères maximum par ligne

### Règles de rédaction

- Phrases courtes : 5-10 mots maximum
- Vocabulaire simple et concret
- Éviter les négations ("Ne pas..." → "Essaie plutôt...")
- Tutoiement bienveillant
- Toujours accompagner le texte d'une icône ou illustration

> **Référence** : Endless Alphabet utilise animations + audio pour expliquer sans texte

---

## 6. SYSTÈME DE FEEDBACK

### Feedback positif (réussite)

- **Visuel immédiat** : Animation de célébration (confettis, étoiles, personnage qui danse)
- **Son joyeux** : Court (< 2 sec), mélodique, non strident
- **Message encourageant** : "Super !", "Bravo !", "Tu as compris !"
- **Progression visible** : Jauge qui se remplit, étoiles qui s'allument

### Feedback sur erreur (JAMAIS punitif)

- **Pas de son négatif ou buzzer.** Utiliser un son neutre/doux
- **Pas de rouge agressif.** Préférer orange doux ou animation subtile
- **Message constructif** : "Essaie encore !", "Presque !", "Tu y es presque !"
- **Indice progressif** : Après 2 erreurs, proposer un indice visuel
- **L'élément retourne à sa place** : Animation douce de retour, pas de disparition brutale

> **Référence** : Khan Academy Kids utilise des sons positifs et animations pour +50% de taux de complétion

### Système de récompenses (non compétitif)

Éviter les classements et comparaisons entre enfants. Privilégier :

- **Badges d'effort** : "Persévérant", "Curieux", "10 essais aujourd'hui"
- **Collection personnelle** : Objets à débloquer pour son avatar
- **Jardin/monde qui grandit** : Visualisation de la progression globale
- **Séries quotidiennes** : "5 jours d'affilée !" (sans pression)

---

## 7. ANIMATIONS ET MICRO-INTERACTIONS

### Principes d'animation

- **Fluidité 60 FPS** : Utiliser React Native Reanimated 3 pour des animations natives
- **Durée courte** : 200-400ms pour les transitions, 500-1000ms pour les célébrations
- **Easing naturel** : ease-out pour les apparitions, ease-in-out pour les mouvements
- **Feedback tactile** : Légère vibration ou scale sur tap (1.05x puis retour)
- **Option de réduction** : Respecter les préférences système "Réduire les animations"

### Animations essentielles

| CONTEXTE | ANIMATION RECOMMANDÉE |
|----------|----------------------|
| Tap sur bouton | Scale 0.95 → 1.0 avec bounce léger |
| Bonne réponse | Confettis + scale up de l'élément + son joyeux |
| Mauvaise réponse | Shake horizontal léger (3x) + retour doux à la position |
| Drag & drop | Élément suit le doigt + ombre portée + zone cible s'illumine |
| Niveau complété | Animation de mascotte + étoiles + fanfare |
| Indice disponible | Pulsation douce de l'icône ampoule (glow) |

---

## 8. ESPACE PARENT

### Accès sécurisé

- **Gate parentale** : Problème mathématique simple (ex: "15 + 27 = ?") ou PIN 4 chiffres
- **FaceID/TouchID** : Option pour accès rapide
- **Icône discrète** : Petit cadenas en haut à droite, pas proéminent

> **Référence** : Toca Boca utilise un "parent gate" pour protéger les paramètres

### Contenu de l'espace parent

| FONCTIONNALITÉ | DESCRIPTION |
|----------------|-------------|
| **Tableau de bord** | Temps de jeu, activités complétées, progression par compétence |
| **Fiches pédagogiques** | Explication des objectifs de chaque activité, compétences visées |
| **Conseils d'accompagnement** | Comment aider sans interférer, questions à poser |
| **Paramètres de temps** | Limite quotidienne, rappels de pause, horaires autorisés |
| **Transfert vie quotidienne** | Suggestions d'activités réelles liées aux apprentissages |

---

## 9. SÉCURITÉ ET CONFIDENTIALITÉ

### Règles obligatoires

- **Pas de publicité** : Aucune pub, aucun lien externe sans validation parentale
- **Pas de collecte de données personnelles enfant** : Conformité COPPA/RGPD
- **Pas de chat ou communication** : Aucune fonctionnalité sociale
- **Pas d'achats in-app accessibles à l'enfant** : Tout achat derrière gate parentale
- **Mode hors-ligne** : L'app doit fonctionner sans connexion internet

> **Référence** : Toca Boca est reconnu pour son environnement 100% sûr sans pub ni achats cachés

---

## 10. CHECKLIST DE VALIDATION UX/UI

Avant chaque release, vérifier :

### ACCESSIBILITÉ
- [ ] Zones tactiles ≥ 64×64 dp
- [ ] Contraste texte ≥ 4.5:1
- [ ] Pas de couleur seule pour l'information (toujours icône + couleur)
- [ ] Police ≥ 18 pt pour le texte courant

### NAVIGATION
- [ ] Profondeur ≤ 3 niveaux
- [ ] Retour à l'accueil en ≤ 2 taps
- [ ] Toutes les actions compréhensibles sans lire
- [ ] Pas de menu hamburger

### FEEDBACK
- [ ] Feedback visuel immédiat sur chaque interaction
- [ ] Pas de feedback négatif punitif
- [ ] Animations fluides 60 FPS
- [ ] Sons optionnels et désactivables

### SÉCURITÉ
- [ ] Espace parent protégé
- [ ] Pas de liens externes accessibles à l'enfant
- [ ] Fonctionne hors-ligne
- [ ] Pas de collecte de données personnelles

---

*Guide UX/UI • Application Éducative iPad*
*Basé sur les recherches et meilleures pratiques du marché (2024-2025)*
