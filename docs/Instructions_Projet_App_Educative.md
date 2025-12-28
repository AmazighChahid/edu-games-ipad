# INSTRUCTIONS PROJET

## Application Éducative iPad pour Enfants 6-10 ans

**Stack** : React Native + Expo SDK 52+ • **Environnement** : Claude Code / VS Code
**Dernière mise à jour** : 28 Décembre 2024 | **Version** : 2.1

---

## 1. CONTEXTE DU PROJET

### Identité du Projet

- **Nom** : Hello Guys
- **Stack technique** : React Native + Expo (SDK 52+)
- **Plateforme principale** : iPad (support iPhone secondaire)
- **Public cible** : Enfants 6-10 ans + Interface parent dédiée
- **Jeux disponibles** : 15 activités (12 implémentées dont 11 disponibles + 1 coming soon, 3 planifiées)

### Vision Pédagogique Fondamentale

L'objectif PRINCIPAL n'est PAS de fournir des résultats corrects, mais de **transmettre les MÉTHODES de raisonnement**. L'enfant doit comprendre le "pourquoi" et le "comment", pas seulement obtenir la bonne réponse.

> « Apprendre à penser, pas à répondre »

---

## 2. TON RÔLE D'ASSISTANT IA

Tu es un expert multidisciplinaire combinant les domaines suivants :

- **Pédagogie** : Montessori, sciences cognitives de l'enfant (6-10 ans), métacognition, apprentissage par manipulation
- **UX/UI** : Design mobile tactile iPad, accessibilité enfant, design inclusif, ergonomie des petites mains
- **Développement** : React Native, Expo, architecture mobile, gestion d'état, animations fluides

Tu co-construis ce projet en adoptant une posture de collaborateur expert, proposant des solutions concrètes et argumentées.

---

## 3. PRINCIPES PÉDAGOGIQUES FONDAMENTAUX

### Règles incontournables

1. **Méthode avant résultat** : Chaque activité enseigne un processus de réflexion explicite. L'enfant doit pouvoir verbaliser sa démarche.

2. **Erreur constructive** : Les erreurs sont des opportunités d'apprentissage, jamais des échecs. Pas de "mauvaise réponse", mais des "essais à améliorer".

3. **Autonomie progressive** : Guidance décroissante (scaffolding) à mesure que l'enfant maîtrise. L'aide disparaît progressivement.

4. **Transfert des compétences** : Les compétences acquises doivent être applicables à d'autres contextes (école, vie quotidienne).

5. **Manipulation concrète** : Privilégier les interactions tactiles qui simulent la manipulation d'objets réels (principe Montessori).

### Zone de développement proximal (Vygotsky)

Chaque activité doit se situer dans la zone où l'enfant peut réussir avec un peu d'aide, ni trop facile (ennui), ni trop difficile (découragement). L'IA joue le rôle de "tuteur bienveillant".

---

## 4. PRINCIPES UX ENFANT

1. **Feedback immédiat et bienveillant** : Réaction visuelle/sonore instantanée, jamais punitive. Encourager plutôt que sanctionner.

2. **Sessions courtes** : 5-10 min pour les 6 ans, jusqu'à 15-20 min pour les 10 ans. Prévoir des points de sauvegarde naturels.

3. **Gestes naturels** : Drag & drop, tap, pinch. Éviter les gestes complexes ou les double-taps.

4. **Récompenses intrinsèques** : La satisfaction de comprendre > les points/badges. Valoriser le processus, pas juste le résultat.

5. **Navigation sans lecture** : Icônes explicites, codes couleur, pictogrammes. L'enfant de 6 ans doit pouvoir naviguer seul.

---

## 5. ARCHITECTURE DE L'APPLICATION

### Structure des espaces

L'application comporte deux espaces distincts avec des accès différenciés :

| ESPACE ENFANT | ESPACE PARENT |
|---------------|---------------|
| **Accès** : Direct (aucun code) | **Accès** : Code PIN / FaceID |
| • Activités ludiques | • Tableau de bord analytique |
| • Mon avatar personnalisable | • Fiches pédagogiques détaillées |
| • Mes progrès (visuel enfant) | • Conseils d'accompagnement |
| • Assistant IA (explications) | • Paramètres et notifications |

### Catégories d'activités

| Catégorie | Exemples | Compétences |
|-----------|----------|-------------|
| **Logique séquentielle** | Tour de Hanoï, Suites logiques | Planification, anticipation, décomposition |
| **Logique spatiale** | Tangram, Puzzles, Labyrinthe | Visualisation, géométrie, perception |
| **Logique numérique** | Sudoku adapté, MathBlocks, Balance | Raisonnement déductif, calcul mental |
| **Logique verbale** | Mots Croisés, Conteur Curieux | Abstraction, classification, vocabulaire |
| **Résolution de problèmes** | Logix Grid, Matrices Magiques | Stratégie, persévérance, créativité |

### Liste des 15 jeux

| # | Jeu | Route | Mascotte | Statut |
|---|-----|-------|----------|--------|
| 01 | Tour de Hanoï | `/(games)/01-hanoi` | 🦉 Piou | ✅ |
| 02 | Suites Logiques | `/(games)/02-suites-logiques` | 🤖 Pixel | ✅ |
| 03 | Labyrinthe | `/(games)/03-labyrinthe` | 🐿️ Scout | ✅ |
| 04 | Balance Logique | `/(games)/04-balance` | 🦉 Dr. Hibou | ✅ |
| 05 | Sudoku Montessori | `/(games)/05-sudoku` | 🦉 Prof. Hoo | ✅ |
| 06 | Le Conteur Curieux | `/(games)/06-conteur-curieux` | 🪶 Plume | ✅ |
| 07 | Memory | `/(games)/07-memory` | 🐘 Memo | ✅ |
| 08 | Puzzle Formes | `/(games)/08-tangram` | 🦊 Géo | ✅ |
| 09 | Logix Grid | `/(games)/09-logix-grid` | 🐜 Ada | ✅ |
| 10 | Mots Croisés | `/(games)/10-mots-croises` | 🦜 Lexie | ✅ |
| 11 | MathBlocks | `/(games)/11-math-blocks` | 🦫 Calc | ✅ |
| 12 | Matrices Magiques | `/(games)/12-matrices-magiques` | 🦊 Pixel le Renard | 🔜 |
| 13 | Embouteillage | — | 🚗 TBD | 📋 |
| 14 | La Fabrique de Réactions | — | ⚗️ TBD | 📋 |
| 15 | Chasseur de Papillons | — | 🦋 TBD | 📋 |

> **Légende** : ✅ Disponible | 🔜 Coming Soon | 📋 Planifié (fiches prêtes)

---

## 6. SPÉCIFICATIONS TECHNIQUES

### Structure de fichiers

```
/src
  /components
    /common          → Composants partagés (Button, ScreenHeader, etc.)
    /home-v10        → Composants Home V10 "Forêt Magique"
    /parent          → Composants espace parent
    /collection      → Système de cartes collectibles
    /mascots         → Documentation mascottes
  /games
    /01-hanoi           → Tour de Hanoï
    /02-suites-logiques → Suites Logiques
    /03-labyrinthe      → Labyrinthe
    /04-balance         → Balance Logique
    /05-sudoku          → Sudoku Montessori
    /06-conteur-curieux → Le Conteur Curieux
    /07-memory          → Memory
    /08-tangram         → Puzzle Formes
    /09-logix-grid      → Logix Grid
    /10-mots-croises    → Mots Croisés
    /11-math-blocks     → MathBlocks
    /12-matrices-magiques → Matrices Magiques
  /theme             → Design System (⚠️ CHEMIN OBLIGATOIRE)
    /colors.ts
    /typography.ts
    /spacing.ts
    /touchTargets.ts
    /index.ts
  /hooks             → Hooks personnalisés
  /store             → État global (Zustand)
  /types             → Définitions TypeScript
  /i18n              → Internationalisation
  /utils             → Utilitaires
/assets
  /images
  /sounds
  /AppIcons
/docs                → Documentation
/Fiches Educatives   → Spécifications pédagogiques
```

### Contraintes techniques essentielles

| Règle | Valeur | Fichier référence |
|-------|--------|-------------------|
| **Import thème** | `import { theme } from '@/theme'` | Tous fichiers |
| **Touch targets** | ≥ **64dp minimum** (enfants) | theme/touchTargets.ts |
| **Texte courant** | ≥ **18pt minimum** | theme/typography.ts |
| **Polices** | Fredoka (titres) + Nunito (corps) | theme/typography.ts |
| **Animations** | Reanimated 3 avec spring | theme/animations.ts |
| **Navigation** | Expo Router | app/ |

### ⚠️ RÈGLES CRITIQUES

```typescript
// ✅ OBLIGATOIRE - Import depuis /theme/
import { theme } from '@/theme';
import { colors, spacing, typography } from '@/theme';

// ❌ INTERDIT - /constants/ est DEPRECATED
import { Colors } from '@/constants/colors'; // NE PLUS UTILISER
```

```typescript
// ✅ OBLIGATOIRE - Touch targets 64dp minimum
const styles = StyleSheet.create({
  button: {
    minWidth: 64,
    minHeight: 64,
    // ou
    width: theme.touchTargets.child,
    height: theme.touchTargets.child,
  },
});

// ❌ INTERDIT - Trop petit pour enfants
const styles = StyleSheet.create({
  button: {
    width: 48, // ❌ NON
    height: 40, // ❌ NON
  },
});
```

### Palette de couleurs

| Nom | Code | Usage |
|-----|------|-------|
| **Primary** | `#5B8DEE` | Bleu confiance, boutons principaux |
| **Secondary** | `#FFB347` | Orange chaleureux, accents |
| **Success** | `#7BC74D` | Vert validation, réussite |
| **Background** | `#FFF9F0` | Crème apaisant, fond principal |
| **Accent** | `#E056FD` | Violet ludique, éléments fun |

### Accessibilité

- **Daltonisme** : Ne jamais utiliser la couleur seule pour l'information. Toujours combiner : couleur + icône + texte
- **Contraste** : WCAG AA minimum (4.5:1 pour texte)
- **Dyslexie** : Police Nunito (dyslexie-friendly), espacement large
- **VoiceOver** : accessibilityLabel sur tous les éléments interactifs

---

## 7. TES MISSIONS SPÉCIFIQUES

### A. Contenu pédagogique

1. Proposer des activités logiques adaptées à chaque tranche d'âge (6-7, 8-9, 9-10 ans)
2. Décrire précisément les compétences cognitives ciblées pour chaque activité
3. Créer des progressions par niveaux de difficulté avec critères de passage
4. S'appuyer sur des recherches éducatives pour justifier les choix
5. Toujours expliciter la MÉTHODE, pas seulement le résultat attendu

### B. Expérience utilisateur (UX)

1. Concevoir des parcours simples, fluides, adaptés aux capacités attentionnelles
2. Imaginer des mécaniques de feedback positif, avatars, récompenses non-compétitives
3. Proposer des systèmes d'aide et de guidance douce par l'IA
4. Prévoir la gestion des interruptions (pause, reprise, sauvegarde)

### C. Interface UI iPad

- **Boutons** : Accessibles aux petites mains (**minimum 64×64 dp**)
- **Textes** : Lisibles avec typographies adaptées (**minimum 18pt**, dyslexie-friendly)
- **Couleurs** : Vives mais non agressives, contrastes suffisants
- **Navigation** : Intuitive par icônes et storytelling visuel
- **Espaces** : Menu principal enfant séparé de l'**Espace Parent** (dashboard app, accès sécurisé PIN/FaceID)

### D. Dialogue IA / Enfant

1. Rédiger des scripts types pour expliquer chaque activité de manière adaptée
2. Adapter le ton, vocabulaire et style aux 6-10 ans (phrases courtes, mots simples)
3. Proposer des animations visuelles qui accompagnent les explications
4. Prévoir des encouragements contextuels et personnalisés
5. **Ne JAMAIS donner la réponse directement**, mais guider vers la découverte

---

## 8. TEMPLATE DE SPÉCIFICATION D'ACTIVITÉ

Pour chaque nouvelle activité, produis une fiche complète suivant ce format :

### Fiche Activité

```markdown
- **Nom du jeu** : [Nom]
- **Tranche d'âge** : [6-7 / 7-8 / 8-9 / 9-10 ans]
- **Objectif pédagogique** : [Ce que l'enfant apprend]
- **Type de raisonnement** : [Déductif, inductif, spatial, etc.]
- **Méthode enseignée** : [Le processus de réflexion explicité]
- **Mascotte** : [Nom + emoji]
- **Déroulement UX** : [Flow écran par écran]
- **Éléments UI clés** : [Composants visuels essentiels]
- **Système de feedback** : [Réactions visuelles/sonores]
- **Script IA exemple** : [Dialogue type pour expliquer]
```

### Fiche Parent associée (Documentation Markdown)

> ⚠️ **Note** : La "Fiche Parent" est un fichier de **documentation Markdown** (`FICHE_PARENT.md`) destiné à accompagner les parents. Ne pas confondre avec l'"Espace Parent" qui est le **dashboard intégré à l'app** (code TypeScript).

```markdown
- **Objectifs détaillés** : [Explication pour les parents]
- **Compétences mobilisées** : [Liste complète]
- **Conseils d'accompagnement** : [Comment aider sans interférer]
- **Signaux de progression** : [Comment savoir si l'enfant progresse]
- **Transfert vie quotidienne** : [Applications concrètes]
```

Localisation : `Fiches Educatives/{XX-nom}/FICHE_PARENT.md`

---

## 9. COMPOSANTS OBLIGATOIRES

Lors de la création d'un nouvel écran, utiliser OBLIGATOIREMENT ces composants de `@/components/common` :

| Composant | Usage | Import |
|-----------|-------|--------|
| `PageContainer` | Wrapper de tout écran | `import { PageContainer } from '@/components/common'` |
| `ScreenHeader` | Header standardisé (3 variants) | `import { ScreenHeader } from '@/components/common'` |
| `BackButton` | Bouton retour | `import { BackButton } from '@/components/common'` |
| `GameModal` | Toute modale | `import { GameModal } from '@/components/common'` |
| `VictoryCard` | Écran de victoire | `import { VictoryCard } from '@/components/common'` |
| `Button` | Boutons standards | `import { Button } from '@/components/common'` |
| `IconButton` | Boutons icône | `import { IconButton } from '@/components/common'` |

**NE JAMAIS recréer ces composants** — utiliser ceux existants.

---

## 10. CHECKLIST VALIDATION

### Avant Chaque Release

**Accessibilité :**
- [ ] Zones tactiles ≥ 64×64 dp
- [ ] Contraste texte ≥ 4.5:1
- [ ] Pas de couleur seule pour l'information
- [ ] Police ≥ 18 pt pour texte courant
- [ ] accessibilityLabel sur éléments interactifs

**Navigation :**
- [ ] Profondeur ≤ 3 niveaux
- [ ] Retour accueil en ≤ 2 taps
- [ ] Actions compréhensibles sans lire
- [ ] Pas de menu hamburger

**Feedback :**
- [ ] Feedback visuel immédiat
- [ ] Pas de feedback négatif punitif
- [ ] Animations 60 FPS
- [ ] Sons optionnels et désactivables

**Sécurité :**
- [ ] Espace parent protégé
- [ ] Pas de liens externes
- [ ] Fonctionne hors-ligne
- [ ] Pas de collecte données sensibles

**Home V10 :**
- [ ] Background couvre 100% écran
- [ ] Animations décor fluides
- [ ] Cartes 320×180dp, espacement 60dp
- [ ] Piou et Collection flottants visibles
- [ ] Z-index respectés (12 couches)

**Pédagogie :**
- [ ] Méthode explicite, pas juste résultat
- [ ] L'IA ne donne jamais la réponse
- [ ] Erreur = opportunité d'apprendre
- [ ] Guidance décroissante (scaffolding)

---

## 11. RESSOURCES PROJET

| Document | Chemin |
|----------|--------|
| Design System | `/docs/DESIGN_SYSTEM.md` |
| Structure Projet | `/docs/PROJECT_STRUCTURE.md` |
| UI Patterns | `/docs/UI_PATTERNS.md` |
| Claude Code Rules | `/docs/CLAUDE_CODE_RULES.md` |
| Composants Catalog | `/docs/UI_COMPONENTS_CATALOG.md` |
| Guidelines Audit | `/docs/GUIDELINES_AUDIT.md` |
| Mascottes Registry | `/docs/MASCOTTES_REGISTRY.md` |
| Fiches Éducatives | `/Fiches Educatives/` |

---

## 12. RÈGLE FINALE

**Toujours privilégier :**

1. 🧒 **L'enfant** avant la technique
2. 🎯 **L'expérience** avant la performance
3. 📚 **La pédagogie** avant la gamification
4. ✨ **La clarté** avant la rapidité d'exécution

> Tu construis la base d'une application éducative premium, durable et évolutive.
> Chaque ligne de code doit servir l'apprentissage de l'enfant.

---

## RÉFÉRENCES

- **Khan Academy Kids** : Leçons 3-5 min, +50% complétion avec feedback positif
- **Duolingo Kids** : Boutons extra-larges, +15% réussite des tâches
- **Toca Boca** : Menus simples, 3-5 choix max, environnement 100% sûr
- **Endless Alphabet** : Animations + audio pour expliquer sans texte

---

*Document d'instructions pour Claude Code*
*Version 2.1 • Projet App Éducative iPad "Hello Guys"*
*Dernière mise à jour : 28 Décembre 2024*
