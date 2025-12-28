# 📚 INDEX DOCUMENTATION — Hello Guys

> **Version** : 3.3 — Décembre 2024 | **Conformité UI** : 89%

---

## 🤖 Protocole Claude Code (OBLIGATOIRE)

**Avant chaque tâche, suivre ces 3 étapes :**

### 1. Confirmer la lecture
```
✅ J'ai lu [documents] — Points clés : [résumé]
✅ Règles critiques retenues : [liste]
✅ Composants à réutiliser : [liste]
```

### 2. Poser 2-3 questions de clarification
```
❓ [Question sur cas particulier, priorité, contrainte...]
```

### 3. Présenter le plan d'action
```
📋 PLAN :
1. Fichiers à examiner : [liste]
2. Modifications : [liste ordonnée]
3. Tests : [liste]
4. Livrables : [fichiers créés/modifiés]

→ ATTENDRE VALIDATION avant implémentation.
```

---

## 🚀 Pré-prompts Claude Code

### 🆕 Nouveau composant UI
```
LIRE : CLAUDE_CODE_RULES.md, UI_COMPONENTS_CATALOG.md, DESIGN_SYSTEM.md

RÈGLES :
- Import : `import { theme } from '@/theme'`
- Touch targets : ≥ 64dp | Texte : ≥ 18pt
- Polices : Fredoka (titres) + Nunito (corps)
- NE PAS recréer : BackButton, ScreenHeader, PageContainer, GameModal, VictoryCard

→ Confirmer lecture, poser questions, planifier.
```

### 🎮 Nouveau jeu
```
LIRE : TRAME_REFERENTIEL.md (OBLIGATOIRE), PROJECT_STRUCTURE.md, MASCOTTES_REGISTRY.md, CLAUDE_CODE_RULES.md, GUIDE_UX_UI_APP_EDUCATIVE.md, Fiches Educatives/ (si existante)

STRUCTURE OBLIGATOIRE :
/src/games/{nom}/
├── index.ts, types.ts
├── components/, hooks/use{Nom}Game.ts
├── data/assistantScripts.ts
└── screens/{Nom}IntroScreen.tsx

APRÈS : Ajouter dans registry.ts + app/(games)/{XX-nom}/

FICHES À CRÉER dans /Fiches Educatives/{XX-nom}/ :
- FICHE_ACTIVITE.md, FICHE_PARENT.md, DIALOGUES_IA.md, SPECS_TECHNIQUES.md

→ Confirmer lecture, poser questions, planifier.
```

### 🔧 Refactoring écran
```
LIRE : PROMPT_REFACTORING.md, GUIDELINES_AUDIT.md

CHECKLIST :
- [ ] Imports /constants/ → /theme/
- [ ] Utiliser ScreenHeader, PageContainer
- [ ] Touch targets ≥ 64dp, fontSize ≥ 18pt

→ Confirmer lecture, poser questions, planifier.
```

### 🐛 Corriger un bug
```
LIRE : CLAUDE_CODE_RULES.md (conventions), fichiers concernés

ÉTAPES :
1. Reproduire et comprendre le bug
2. Identifier la cause racine
3. Proposer correction minimale (pas de refactoring non demandé)
4. Vérifier non-régression

→ Confirmer lecture, poser questions, planifier.
```

### 🐵 Ajouter/modifier une mascotte
```
LIRE : MASCOTTES_REGISTRY.md, GUIDE_UX_UI_APP_EDUCATIVE.md (section feedback)

ÉLÉMENTS À DÉFINIR :
- Nom, emoji, personnalité (3 traits)
- Scripts dialogue par âge (6-7, 8-9, 9-10)
- Ton : encourageant, jamais punitif

APRÈS : Mettre à jour MASCOTTES_REGISTRY.md

→ Confirmer lecture, poser questions, planifier.
```

### 🏠 Espace Parent (Dashboard App)
```
LIRE : GUIDE_UX_UI_APP_EDUCATIVE.md (section Espace Parent), UI_PATTERNS.md, src/types/parent.types.ts

⚠️ DISTINCTION IMPORTANTE :
- "Espace Parent" = Dashboard DANS l'app (code TypeScript/React)
- "Fiche Parent" = Documentation MARKDOWN par activité (voir pré-prompt séparé)

TYPES À UTILISER (parent.types.ts) :
- ChildProfile : profil enfant (nom, avatar, âge)
- ParentGoal : objectifs définis par le parent
- ScreenTimeSettings : limites temps écran
- WeeklyStats, DailyStats : statistiques
- Badge, ActivityItem : récompenses et historique
- BehaviorInsights : analyses comportementales

ONGLETS DASHBOARD :
- overview : vue d'ensemble, stats rapides
- activities : historique des sessions
- skills : compétences par domaine
- goals : objectifs parentaux

RÈGLES :
- Accès sécurisé (PIN/FaceID)
- Pas de collecte données enfant externe
- UI adulte (peut différer du design enfant)
- Graphiques lisibles, données actionables

→ Confirmer lecture, poser questions, planifier.
```

### 📊 Modifier Espace Parent
```
LIRE : src/types/parent.types.ts, src/screens/parent/, GUIDE_UX_UI_APP_EDUCATIVE.md

FICHIERS CONCERNÉS :
- src/types/parent.types.ts : types TypeScript
- src/screens/parent/ : écrans du dashboard
- src/store/ : slices Zustand pour données parent

FONCTIONNALITÉS MODIFIABLES :
- Profils enfants (ChildProfile)
- Objectifs (ParentGoal, GoalTemplate)
- Temps d'écran (ScreenTimeSettings, DailyScreenTime)
- Badges (Badge, BadgeCategory)
- Insights (BehaviorInsights, StrengthItem)
- Recommandations IA (GameRecommendation)

RÈGLES :
- Respecter les types existants
- Pas de breaking changes sur les données persistées
- Tests sur les calculs de stats

→ Confirmer lecture, poser questions, planifier.
```

### 📝 Créer Fiche Parent (Documentation Activité)
```
LIRE : Fiches Educatives/01-Tour de Hanoï/FICHE_PARENT.md (template), INSTRUCTIONS_PROJET_APP_EDUCATIVE.md

⚠️ DISTINCTION IMPORTANTE :
- "Fiche Parent" = Documentation MARKDOWN pour accompagner l'enfant
- "Espace Parent" = Dashboard dans l'app (voir pré-prompt séparé)

STRUCTURE FICHE_PARENT.md :
1. Vue d'ensemble : description activité pour les parents
2. Compétences développées : cognitives + transversales
3. Lien apprentissages scolaires : maths, français, sciences
4. Progression par âge : 6-7 / 7-8 / 9-10 ans
5. Conseils d'accompagnement : ✅ À faire / ❌ À éviter
6. Questions à poser : compréhension, stratégie, métacognition
7. Transfert quotidien : activités complémentaires, jeux société
8. Indicateurs app : explication du tableau de bord
9. FAQ parents : réponses aux questions courantes
10. Résumé en 5 points

TON :
- Bienveillant, non culpabilisant
- Concret, actionnable
- Basé sur principes Montessori

→ Confirmer lecture, poser questions, planifier.
```

### ✏️ Modifier Fiche Parent existante
```
LIRE : Fiches Educatives/{XX-nom}/FICHE_PARENT.md, FICHE_ACTIVITE.md, SPECS_TECHNIQUES.md

VÉRIFICATIONS :
- Cohérence avec FICHE_ACTIVITE.md (règles, niveaux)
- Cohérence avec SPECS_TECHNIQUES.md (fonctionnalités réelles)
- Progression par âge alignée avec levels.ts du jeu

SECTIONS À METTRE À JOUR :
- Compétences si nouvelles fonctionnalités
- Progression si nouveaux niveaux
- FAQ si nouveaux retours utilisateurs
- Indicateurs si nouveau scoring

→ Confirmer lecture, poser questions, planifier.
```

### 📝 Créer fiche éducative complète
```
LIRE : Fiches Educatives/01-Tour de Hanoï/ (template complet), INSTRUCTIONS_PROJET_APP_EDUCATIVE.md

4 FICHIERS À CRÉER dans /Fiches Educatives/{XX-nom}/ :

1. FICHE_ACTIVITE.md :
   - Objectif pédagogique, tranche âge
   - Règles du jeu, déroulement
   - Niveaux de difficulté, feedback

2. FICHE_PARENT.md :
   - Guide d'accompagnement parental
   - Compétences, conseils, transfert quotidien
   - (Voir pré-prompt "Créer Fiche Parent" pour détails)

3. DIALOGUES_IA.md :
   - Scripts mascotte par âge (6-7, 8-9, 9-10)
   - Encouragements, indices, félicitations

4. SPECS_TECHNIQUES.md :
   - Architecture fichiers, types TypeScript
   - Composants, hooks, animations
   - Configuration niveaux

→ Confirmer lecture, poser questions, planifier.
```

### 🔊 Système audio
```
LIRE : AUDIO_IMPROVEMENTS.md

RÈGLES :
- Sons courts (<2s), jamais stridents
- Désactivables, pas de son négatif/buzzer
- Utiliser hook useSound existant

→ Confirmer lecture, poser questions, planifier.
```

### 🔍 Audit projet
```
LIRE : AUDIT_DOCUMENTATION.md, CLAUDE_CODE_RULES.md, DESIGN_SYSTEM.md

CATÉGORIES À AUDITER :
- Structure, Codification, Performance, Homogénéité UI
- Réutilisation composants, Fichiers morts, Complexité

FORMAT RAPPORT : [Fichier | Problème | Sévérité | Correction]

SYNTHÈSE : Score /100 par catégorie + Top 5 actions prioritaires

→ Confirmer lecture, poser questions, planifier.
```

### 🔄 Synchroniser documentation
```
OBJECTIF : Mettre à jour TOUS les docs d'instructions après évolutions du projet

ÉTAPES :
1. Scanner /src/ : structure réelle, composants, jeux, routes
2. Scanner /docs/ : lister tous les .md existants
3. Scanner /Fiches Educatives/ : état des fiches par jeu

VÉRIFIER PAR DOCUMENT :
- Chemins/imports encore valides ?
- Composants référencés existent ?
- Liste des jeux à jour (15 : 12 disponibles + 3 coming soon) ?
- Mascottes correspondent au code ?
- Règles reflètent le code actuel ?

RAPPORT :
| Document | Écarts trouvés | Corrections à faire |
|----------|---------------|---------------------|

ACTIONS :
1. Corriger les références obsolètes
2. Ajouter les nouveautés non documentées
3. Supprimer les docs de fichiers supprimés
4. Mettre à jour 00-INDEX_UPDATED.md

→ Confirmer lecture, poser questions, planifier.
```

---

## 📁 Documents disponibles

### /docs/

| Fichier | Description |
|---------|-------------|
| **TRAME_REFERENTIEL.md** | Architecture des activités, types universels, core pédagogique |
| **CLAUDE_CODE_RULES.md** | Règles obligatoires Claude Code |
| **DESIGN_SYSTEM.md** | Tokens couleurs, typo, spacing, animations |
| **PROJECT_STRUCTURE.md** | Structure projet, conventions nommage |
| **UI_COMPONENTS_CATALOG.md** | Composants prêts à l'emploi |
| **UI_PATTERNS.md** | Patterns UI standardisés |
| **MASCOTTES_REGISTRY.md** | Registre mascottes par jeu |
| **GUIDELINES_AUDIT.md** | Audit conformité UX (89%) |
| **PROMPT_REFACTORING.md** | Prompts homogénéisation |
| **AUDIO_IMPROVEMENTS.md** | Système sonore, hook useSound |
| **GUIDE_UX_UI_APP_EDUCATIVE.md** | Principes UX enfant 6-10 ans |
| **INSTRUCTIONS_PROJET_APP_EDUCATIVE.md** | Vision pédagogique, missions |
| **AUDIT_DOCUMENTATION.md** | Méthodologie audit documentation |
| **00-INDEX_UPDATED.md** | Index documentation et pré-prompts Claude Code |

### /docs/Etat-Historique/

| Fichier | Description |
|---------|-------------|
| **IMPLEMENTATION_SUMMARY.md** | Avancement global projet |
| **SYNTHESE_STANDARDISATION.md** | Historique migrations effectuées |
| **RAPPORT_VERIFICATION_MASCOTTES_COMPETENCES.md** | Vérification mascottes/compétences |

> **Règle** : Tout document d'état, rapport ou historique doit être créé dans ce dossier.

### /Fiches Educatives/

| Statut | Jeux |
|--------|------|
| ✅ Complet (4 fiches) | 01-Hanoï, 02-Suites, 03-Labyrinthe, 04-Balance, 05-Sudoku, 06-Conteur |
| ⚠️ Partiel (2-3 fiches) | 07-Memory, 08-Tangram, 09-Logix, 10-MotsCroisés, 11-MathBlocks |
| ✅ Complet (briefs inclus) | 12-Matrices, 13-Embouteillage, 14-Fabrique Réactions, 15-Chasseur Papillons |

> **Structure standard** : FICHE_ACTIVITE.md, FICHE_PARENT.md, DIALOGUES_IA.md, SPECS_TECHNIQUES.md

---

## 🎮 Jeux (15 : 12 disponibles + 3 coming soon)

| # | Jeu | Mascotte | Route | Statut |
|---|-----|----------|-------|--------|
| 01 | Tour de Hanoï | 🦉 Piou (MascotOwl) | 01-hanoi | ✅ |
| 02 | Suites Logiques | 🤖 Pixel (MascotRobot) | 02-suites-logiques | ✅ |
| 03 | Labyrinthe | 🐿️ Scout (MascotBubble) | 03-labyrinthe | ✅ |
| 04 | Balance Logique | 🦉 Dr. Hibou | 04-balance | ✅ |
| 05 | Sudoku Montessori | 🦉 Prof. Hoo / 🦊 Félix | 05-sudoku | ✅ |
| 06 | Le Conteur Curieux | 🪶 Plume | 06-conteur-curieux | ✅ |
| 07 | Memory | 🐘 Memo (TBD) | 07-memory | ✅ |
| 08 | Puzzle Formes | 🦊 Géo (TBD) | 08-tangram | ✅ |
| 09 | Logix Grid | 🐜 Ada (TBD) | 09-logix-grid | ✅ |
| 10 | Mots Croisés | 🦜 Lexie (TBD) | 10-mots-croises | ✅ |
| 11 | MathBlocks | 🦫 Calc (TBD) | 11-math-blocks | ✅ |
| 12 | Matrices Magiques | 🦊 Pixel (PixelMascot) | 12-matrices-magiques | ✅ |
| 13 | Embouteillage | 🚗 TBD | - | 🔜 |
| 14 | La Fabrique de Réactions | ⚗️ TBD | - | 🔜 |
| 15 | Chasseur de Papillons | 🦋 TBD | - | 🔜 |

> **Légende** : ✅ Disponible | 🔜 Coming Soon | (TBD) = Mascotte non encore implémentée

---

## ⚠️ Règles critiques (mémo)

| Règle | Valeur |
|-------|--------|
| Import thème | `import { theme } from '@/theme'` |
| Touch targets | ≥ 64dp |
| Texte courant | ≥ 18pt |
| Polices | Fredoka (titres) + Nunito (corps) |
| Animations | Reanimated 3 + spring |
| Imports obsolètes | ❌ `/constants/` → ✅ `/theme/` |

---

*v3.3 — 28 Décembre 2024*

---

## 📖 Glossaire Sémantique

| Terme | Définition | Localisation |
|-------|------------|--------------|
| **Espace Parent** | Dashboard intégré à l'app pour le suivi parental (stats, objectifs, temps écran) | `src/types/parent.types.ts`, `src/screens/parent/` |
| **Fiche Parent** | Documentation Markdown d'accompagnement pédagogique par activité | `Fiches Educatives/{XX-nom}/FICHE_PARENT.md` |
| **Fiche Activité** | Documentation Markdown décrivant les règles et objectifs d'un jeu | `Fiches Educatives/{XX-nom}/FICHE_ACTIVITE.md` |
| **Fiche Éducative** | Ensemble des 4 fichiers de documentation par jeu | `Fiches Educatives/{XX-nom}/` |

> ⚠️ **Ne pas confondre** : L'Espace Parent est du **code** (TypeScript/React), les Fiches Parent sont de la **documentation** (Markdown).
