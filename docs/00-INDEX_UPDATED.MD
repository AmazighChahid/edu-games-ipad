# 📚 INDEX DOCUMENTATION — Hello Guys

> **Version** : 3.1 — Décembre 2024 | **Conformité UI** : 89%

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

### 👨‍👩‍👧 Espace parent
```
LIRE : GUIDE_UX_UI_APP_EDUCATIVE.md (section Espace Parent), UI_PATTERNS.md

RÈGLES :
- Accès sécurisé (PIN/FaceID)
- Contenu : dashboard, fiches pédago, conseils, paramètres temps
- Pas de collecte données enfant

→ Confirmer lecture, poser questions, planifier.
```

### 📝 Créer fiche éducative
```
LIRE : Fiches Educatives/01-Tour de Hanoï/ (template), INSTRUCTIONS_PROJET_APP_EDUCATIVE.md

4 FICHIERS À CRÉER :
1. FICHE_ACTIVITE.md : objectif, tranche âge, déroulement, feedback
2. FICHE_PARENT.md : compétences, conseils, transfert quotidien
3. DIALOGUES_IA.md : scripts mascotte par âge
4. SPECS_TECHNIQUES.md : composants, animations, sons

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
| ✅ Complet | 01-Hanoï, 02-Suites, 03-Labyrinthe, 04-Balance, 05-Sudoku, 06-Conteur, 12-Matrices, 13-Embouteillage, 14-Fabrique Réactions, 15-Chasseur Papillons |
| ⚠️ Partiel | 07-Memory, 08-Tangram, 09-Logix, 10-MotsCroisés, 11-MathBlocks |

> **Note** : Les jeux 07-11 ont seulement FICHE_ACTIVITE.md et DIALOGUES_IA.md. Manquent : FICHE_PARENT.md, SPECS_TECHNIQUES.md

---

## 🎮 Jeux (15 : 12 disponibles + 3 coming soon)

| # | Jeu | Mascotte | Route | Statut |
|---|-----|----------|-------|--------|
| 01 | Tour de Hanoï | 🦉 Piou | 01-hanoi | ✅ |
| 02 | Suites Logiques | 🤖 Pixel | 02-suites-logiques | ✅ |
| 03 | Labyrinthe | 🐿️ Scout | 03-labyrinthe | ✅ |
| 04 | Balance Logique | 🦉 Dr. Hibou | 04-balance | ✅ |
| 05 | Sudoku Montessori | 🦉 Prof. Hoo / 🦊 Félix | 05-sudoku | ✅ |
| 06 | Le Conteur Curieux | 🪶 Plume | 06-conteur-curieux | ✅ |
| 07 | Memory | 🐘 Memo | 07-memory | ✅ |
| 08 | Puzzle Formes | 🦊 Géo | 08-tangram | ✅ |
| 09 | Logix Grid | 🐜 Ada | 09-logix-grid | ✅ |
| 10 | Mots Croisés | 🦜 Lexie | 10-mots-croises | ✅ |
| 11 | MathBlocks | 🦫 Calc | 11-math-blocks | ✅ |
| 12 | Matrices Magiques | 🦊 Pixel le Renard | 12-matrices-magiques | 🔜 |
| 13 | Embouteillage | 🚗 TBD | - | 🔜 |
| 14 | La Fabrique de Réactions | ⚗️ TBD | - | 🔜 |
| 15 | Chasseur de Papillons | 🦋 TBD | - | 🔜 |

> **Légende** : ✅ Disponible | 🔜 Coming Soon

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

*v3.1 — 28 Décembre 2024*
