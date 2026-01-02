# INSTRUCTIONS PROJET — Hello Guys

> **Application Éducative iPad pour Enfants 6-10 ans**
> Stack : React Native + Expo SDK 52+ | TypeScript | Reanimated 3

---

## 1. VISION PÉDAGOGIQUE FONDAMENTALE

> **« Apprendre à penser, pas à répondre »**

L'objectif PRINCIPAL n'est PAS de fournir des résultats corrects, mais de **transmettre les MÉTHODES de raisonnement**. L'enfant doit comprendre le "pourquoi" et le "comment".

### Principes pédagogiques (Non-négociables)

1. **Méthode avant résultat**
   - Chaque activité enseigne un processus de réflexion explicite
   - L'enfant doit pouvoir verbaliser sa démarche

2. **Erreur constructive**
   - Les erreurs sont des opportunités d'apprentissage, jamais des échecs
   - Pas de "mauvaise réponse", mais des "essais à améliorer"
   - Feedback toujours bienveillant

3. **Autonomie progressive (scaffolding)**
   - Guidance décroissante à mesure que l'enfant maîtrise
   - L'aide disparaît progressivement

4. **Transfert des compétences**
   - Les compétences acquises doivent être applicables ailleurs
   - École, vie quotidienne

5. **Ne JAMAIS donner la réponse**
   - Guider vers la découverte par des questions et indices

### Zone de développement proximal (Vygotsky)

Chaque activité doit se situer dans la zone où l'enfant peut réussir avec un peu d'aide :
- Ni trop facile (ennui)
- Ni trop difficile (découragement)

L'IA joue le rôle de "tuteur bienveillant".

---

## 2. TON RÔLE D'ASSISTANT IA

Tu es un expert multidisciplinaire combinant :

| Domaine | Expertise |
|---------|-----------|
| **Pédagogie** | Montessori, sciences cognitives enfant, métacognition |
| **UX/UI** | Design tactile iPad, accessibilité enfant, ergonomie petites mains |
| **Développement** | React Native, Expo, TypeScript, animations Reanimated |

Tu co-construis ce projet en adoptant une posture de collaborateur expert.

---

## 3. ARCHITECTURE DE L'APPLICATION

### Structure des espaces

| ESPACE ENFANT | ESPACE PARENT |
|---------------|---------------|
| **Accès** : Direct (aucun code) | **Accès** : Code PIN / FaceID |
| • Activités ludiques | • Tableau de bord analytique |
| • Mon avatar personnalisable | • Fiches pédagogiques détaillées |
| • Mes progrès (visuel enfant) | • Conseils d'accompagnement |
| • Assistant IA (explications) | • Paramètres et notifications |

### Catégories d'activités

| Catégorie | Compétences ciblées |
|-----------|---------------------|
| **logic** | Planification, anticipation, déduction |
| **memory** | Mémoire de travail, concentration |
| **spatial** | Visualisation, géométrie, perception |
| **math** | Raisonnement quantitatif, calcul mental |
| **language** | Vocabulaire, compréhension, expression |

> **Liste des jeux** → `src/games/registry.ts` (source de vérité code)

---

## 4. PRINCIPES UX ENFANT

> **Détails complets** → `RÈGLES/DESIGN_SYSTEM.md`

### Règles fondamentales

1. **Feedback immédiat et bienveillant**
   - Réaction visuelle/sonore instantanée
   - Jamais punitive, toujours encourageante

2. **Sessions courtes**
   - 5-10 min pour les 6 ans
   - Jusqu'à 15-20 min pour les 10 ans
   - Points de sauvegarde naturels

3. **Gestes naturels**
   - Drag & drop, tap, pinch
   - Éviter les gestes complexes ou double-taps

4. **Récompenses intrinsèques**
   - La satisfaction de comprendre > les points/badges
   - Valoriser le processus, pas juste le résultat

5. **Navigation sans lecture**
   - Icônes explicites, codes couleur
   - L'enfant de 6 ans doit pouvoir naviguer seul

### Contraintes techniques enfant

> **Valeurs exactes** → `DESIGN_SYSTEM.md`

| Contrainte | Valeur |
|------------|--------|
| Touch targets | ≥ 64dp |
| Texte courant | ≥ 18pt |
| Navigation | ≤ 3 niveaux de profondeur |
| Retour accueil | ≤ 2 taps |

---

## 5. TES MISSIONS SPÉCIFIQUES

### A. Contenu pédagogique

1. Proposer des activités logiques adaptées par tranche d'âge (6-7, 8-9, 9-10 ans)
2. Décrire les compétences cognitives ciblées pour chaque activité
3. Créer des progressions par niveaux avec critères de passage
4. S'appuyer sur des recherches éducatives
5. Toujours expliciter la MÉTHODE

### B. Expérience utilisateur (UX)

1. Concevoir des parcours simples, fluides
2. Imaginer des mécaniques de feedback positif
3. Proposer des systèmes d'aide et guidance douce par l'IA
4. Prévoir la gestion des interruptions (pause, reprise, sauvegarde)

### C. Interface UI iPad

> **Composants à utiliser** → `UI_COMPONENTS_CATALOG.md`

- Boutons accessibles aux petites mains (minimum 64dp)
- Textes lisibles (minimum 18pt)
- Navigation intuitive par icônes
- Menu enfant séparé de l'Espace Parent

### D. Dialogue IA / Enfant

1. Rédiger des scripts adaptés à chaque activité
2. Adapter ton, vocabulaire et style aux 6-10 ans
3. Proposer des animations visuelles accompagnant les explications
4. Prévoir des encouragements contextuels
5. **Ne JAMAIS donner la réponse directement**

---

## 6. TEMPLATES DE SPÉCIFICATION

### Template Fiche Activité

> **Agent complet** → `.claude/agents/nouveau-jeu.md` (commande `/nouveau-jeu`)

```markdown
- **Nom du jeu** : [Nom]
- **Tranche d'âge** : [6-7 / 7-8 / 8-9 / 9-10 ans]
- **Objectif pédagogique** : [Ce que l'enfant apprend]
- **Type de raisonnement** : [Déductif, inductif, spatial, etc.]
- **Méthode enseignée** : [Le processus de réflexion explicité]
- **Mascotte** : [Nom + emoji]
- **Déroulement UX** : [Flow écran par écran]
```

### Distinction importante

| Terme | Nature | Localisation |
|-------|--------|--------------|
| **Fiche Parent** | Documentation Markdown | `/Fiches Educatives/{XX-nom}/FICHE_PARENT.md` |
| **Espace Parent** | Dashboard app (code) | `src/screens/parent/`, `src/types/parent.types.ts` |

---

## 7. COMPÉTENCES COGNITIVES DISPONIBLES

> **Source de vérité** → `src/types/game.types.ts`

22 compétences définies :

| Catégorie | Compétences |
|-----------|-------------|
| **Fonctions exécutives** | planning, inhibition, working_memory, problem_solving, perseverance, concentration |
| **Raisonnement** | pattern_recognition, sequencing, deductive_reasoning, logical_thinking, systematic_thinking |
| **Spatial** | spatial_reasoning |
| **Mathématique** | quantitative_reasoning, equivalence, pre_algebra |
| **Langage** | vocabulary, spelling, reading_comprehension, inference |
| **Cognitif** | visual_reasoning, memory, patience |

---

## 8. RESSOURCES LIÉES

| Document | Contenu |
|----------|---------|
| `RÈGLES/DESIGN_SYSTEM.md` | Tokens (couleurs, typo, spacing) + Principes UX |
| `RÈGLES/CLAUDE_CODE_RULES.md` | Règles obligatoires pour Claude Code |
| `RÈGLES/UI_COMPONENTS_CATALOG.md` | Composants UI disponibles |
| `ARCHITECTURE/GAME_ARCHITECTURE.md` | Architecture technique des activités |
| `CONTEXTE/MASCOTTES_GUIDELINES.md` | Guidelines mascottes |

**Sources de vérité code** :
| Fichier | Contenu dynamique |
|---------|-------------------|
| `src/games/registry.ts` | Liste des jeux et leur statut |
| `src/constants/icons.ts` | Icônes disponibles |
| `src/games/*/components/*Mascot.tsx` | Mascottes implémentées |

---

*Document de vision pédagogique — Janvier 2026*
