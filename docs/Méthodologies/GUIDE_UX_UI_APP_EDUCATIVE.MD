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

## 8. ESPACES PARENTS

L'application propose **deux espaces parents distincts** avec des objectifs complémentaires :

| Espace | Objectif | Accès |
|--------|----------|-------|
| **Global (Dashboard)** | Vue d'ensemble, stats, paramètres | Icône cadenas sur Home |
| **Par Activité (In-Game)** | Guide pédagogique contextuel | Bouton "?" dans chaque jeu |

---

### 8.1 Espace Parent Global (Dashboard)

#### Accès sécurisé

- **Gate parentale** : Calcul mathématique simple (ex: "15 + 27 = ?")
- **PIN 4 chiffres** : Alternative au calcul (à implémenter)
- **FaceID/TouchID** : Option pour accès rapide (à implémenter)
- **Icône discrète** : Petit cadenas en haut à droite du Home, pas proéminent

> **Référence** : Toca Boca utilise un "parent gate" pour protéger les paramètres

#### Contenu du Dashboard

| ONGLET | FONCTIONNALITÉS |
|--------|-----------------|
| **Overview** | Stats globales, temps de jeu aujourd'hui, activités récentes |
| **Activities** | Timeline détaillée, historique des sessions par jeu |
| **Skills** | Radar des compétences (4 axes), niveaux de maîtrise |
| **Goals** | Objectifs parentaux personnalisés, suivi progression |

#### Composants principaux

| COMPOSANT | RÔLE |
|-----------|------|
| `SkillsRadarV2` | Visualisation 4 compétences (Logique, Résolution, Concentration, Persévérance) |
| `ActivityTimeline` | Historique chronologique des sessions |
| `ScreenTimeCard` | Monitoring du temps d'écran quotidien/hebdomadaire |
| `GoalsSection` | Définition et suivi des objectifs parentaux |
| `BadgesGallery` | Collection des récompenses non-compétitives |
| `BehaviorInsights` | Analyse IA du style d'apprentissage |

---

### 8.2 Espace Parent par Activité (In-Game)

#### Principe

Zone intégrée dans chaque jeu permettant aux parents de :
- Comprendre l'objectif pédagogique de l'activité
- Savoir comment accompagner sans interférer
- Suivre la progression en temps réel
- Poser les bonnes questions après l'activité

#### Bouton d'accès

| SPEC | VALEUR |
|------|--------|
| Position | Coin supérieur droit de l'écran de jeu |
| Design | Icône "?" ou "👨‍👩‍👧" discret |
| Taille | 44×44 dp minimum |
| Comportement | Ouvre ParentZone ou ParentDrawer |

#### Option A : ParentZone (panneau collapsible)

Panneau compact pour consultations rapides.

| SPEC | VALEUR |
|------|--------|
| Hauteur | 380 px |
| Position | Bas de l'écran |
| Animation | spring (damping: 20, stiffness: 150) |
| Couleur header | `#4A9FE8` |

**3 onglets :**

| ONGLET | CONTENU |
|--------|---------|
| 📖 **Méthode** | Objectif du jeu, règles d'or, stratégie, formule mathématique |
| 💡 **Conseils** | Comment accompagner (À faire ✓ / À éviter ✗) |
| 🎮 **Modes** | Découverte, Défi, Expert + bouton indice + stats en cours |

#### Option B : ParentDrawer (bottom-sheet complet)

Drawer exhaustif pour accompagnement approfondi.

| SPEC | VALEUR |
|------|--------|
| Hauteur | 90% de l'écran |
| Backdrop | `rgba(0, 0, 0, 0.3)` |
| Animation ouverture | spring (damping: 20, stiffness: 150) |
| Animation fermeture | timing (300ms) |
| Fermeture | Tap backdrop OU swipe down (seuil: 100px ou vélocité > 0.5) |
| Haptic feedback | Sur changement d'onglet |

**5 onglets (scroll horizontal) :**

| ONGLET | CONTENU |
|--------|---------|
| 🎯 **Objectif & Règles** | But du jeu, 3 règles d'or, stratégie, solution optimale |
| 🧠 **Compétences** | Skills développés avec étoiles, base scientifique |
| 💬 **Questions à poser** | Pendant le jeu + après l'activité (métacognition) |
| 🏠 **Vie quotidienne** | Transfert des apprentissages, phrases types |
| 📈 **Progression** | Stats temps réel, modes de jeu, bouton indice |

#### Source du contenu pédagogique

Le contenu des espaces parent provient des fiches `FICHE_PARENT.md` situées dans :
```
/Fiches Educatives/{XX-NomJeu}/FICHE_PARENT.md
```

Ces fiches contiennent :
- Objectifs détaillés avec base scientifique
- Compétences mobilisées (tableau détaillé)
- Conseils d'accompagnement (À faire / À éviter)
- Questions métacognitives à poser
- Signaux de progression et d'alerte
- Activités de transfert vie quotidienne

---

### 8.3 Checklist Validation Espaces Parents

#### Espace Global
- [ ] Gate parentale avec calcul mathématique fonctionnelle
- [ ] PIN 4 chiffres comme alternative
- [ ] FaceID/TouchID option (iOS)
- [ ] Icône cadenas visible sur écran Home enfant
- [ ] Dashboard 4 onglets fonctionnel
- [ ] Données persistées (AsyncStorage)

#### Espace par Activité
- [ ] Bouton "?" visible dans chaque jeu
- [ ] ParentZone OU ParentDrawer intégré
- [ ] Contenu pédagogique alimenté par FICHE_PARENT.md
- [ ] 3 modes de jeu (Découverte, Défi, Expert)
- [ ] Haptic feedback sur interactions
- [ ] Responsive iPad/iPhone

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
