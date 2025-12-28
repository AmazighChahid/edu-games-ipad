# 📚 INDEX DOCUMENTATION — Hello Guys

> **Application Éducative iPad** — Guide d'utilisation des documents
> **Version** : 2.2 — Décembre 2024
> **Conformité UI** : 89%

---

## 🤖 Protocole de travail Claude Code

**IMPORTANT : Avant chaque tâche, Claude Code DOIT suivre ce protocole en 3 étapes :**

### Étape 1 — Confirmation de lecture

```
APRÈS LECTURE des documents requis, CONFIRME explicitement :

✅ CONFIRMATION DE LECTURE :
- [ ] J'ai lu [nom du document] — Points clés retenus : ...
- [ ] J'ai lu [nom du document] — Points clés retenus : ...
- [ ] J'ai compris les règles critiques : [lister les 3-5 règles principales]
- [ ] J'ai identifié les composants existants à réutiliser : [lister]
- [ ] J'ai noté les contraintes spécifiques : [lister]

FORMAT ATTENDU : Liste à puces avec résumé de ce qui a été compris.
NE PAS commencer à coder avant cette confirmation.
```

### Étape 2 — Questions de clarification

```
AVANT DE PLANIFIER, POSE des questions pour améliorer ta compréhension :

❓ QUESTIONS DE CLARIFICATION :
Exemples de questions pertinentes :
- "Le composant doit-il gérer [cas particulier] ?"
- "Quelle est la priorité entre [option A] et [option B] ?"
- "Y a-t-il des contraintes de performance spécifiques ?"
- "Comment ce composant interagit-il avec [autre composant] ?"
- "Quel est le comportement attendu en cas de [situation edge case] ?"

RÈGLE : Poser au minimum 2-3 questions pertinentes.
OBJECTIF : Éviter les allers-retours et les corrections tardives.
Si tout est parfaitement clair, expliquer pourquoi aucune question n'est nécessaire.
```

### Étape 3 — Planification des actions

```
APRÈS CLARIFICATION, PRÉSENTE un plan d'action structuré :

📋 PLAN D'ACTION PROPOSÉ :

1. **Analyse préalable** (fichiers à examiner)
   - [ ] Fichier X — raison
   - [ ] Fichier Y — raison

2. **Modifications à effectuer** (par ordre)
   - [ ] Action 1 — description courte
   - [ ] Action 2 — description courte
   - [ ] Action 3 — description courte

3. **Tests et validation**
   - [ ] Vérification 1
   - [ ] Vérification 2

4. **Livrables attendus**
   - Fichiers créés/modifiés : [liste]
   - Documentation à mettre à jour : [liste]

ATTENDRE VALIDATION avant de commencer l'implémentation.
```

---

## 🚀 Quick Start — Pré-prompts Claude Code

### 🆕 Créer un nouveau composant UI

```
AVANT DE CODER, lis ces documents :
1. docs/CLAUDE_CODE_RULES.md (règles obligatoires)
2. docs/UI_COMPONENTS_CATALOG.md (composants à utiliser)
3. docs/DESIGN_SYSTEM.md (tokens couleurs, typo, spacing)

RÈGLES CRITIQUES :
- Import thème : `import { theme } from '@/theme'`
- Touch targets : ≥ 64dp minimum
- Texte courant : ≥ 18pt minimum
- Polices : Fredoka (titres) + Nunito (corps)
- NE JAMAIS recréer : BackButton, ScreenHeader, PageContainer, GameModal, VictoryCard

⚠️ PROTOCOLE OBLIGATOIRE (voir section "Protocole de travail Claude Code") :
1. CONFIRME ta lecture avec les points clés retenus
2. POSE 2-3 questions de clarification
3. PRÉSENTE ton plan d'action et ATTENDS validation
```

---

### 🎮 Créer une nouvelle activité/jeu

```
AVANT DE CODER, lis ces documents :
1. docs/PROJECT_STRUCTURE.md (structure /src/games/)
2. docs/MASCOTTES_REGISTRY.md (choisir/créer la mascotte)
3. docs/CLAUDE_CODE_RULES.md (règles UI)
4. Fiches Educatives/ (si disponible pour ce jeu)

STRUCTURE OBLIGATOIRE d'un jeu :
/src/games/{nom-du-jeu}/
├── index.ts
├── types.ts
├── components/
├── hooks/use{NomJeu}Game.ts
├── data/assistantScripts.ts
└── screens/{NomJeu}IntroScreen.tsx

APRÈS CRÉATION, ajouter dans :
- src/games/registry.ts
- app/(games)/{XX-nom-du-jeu}/

⚠️ PROTOCOLE OBLIGATOIRE (voir section "Protocole de travail Claude Code") :
1. CONFIRME ta lecture avec les points clés retenus
2. POSE 2-3 questions de clarification
3. PRÉSENTE ton plan d'action et ATTENDS validation
```

---

### 🔧 Refactoriser un écran existant

```
AVANT DE MODIFIER, lis :
1. docs/PROMPT_REFACTORING.md (prompts prêts à l'emploi)
2. docs/GUIDELINES_AUDIT.md (violations connues)

CHECKLIST REFACTORING :
- [ ] Remplacer imports /constants/ → /theme/
- [ ] Utiliser ScreenHeader (pas de header custom)
- [ ] Utiliser PageContainer (wrapper obligatoire)
- [ ] Vérifier touch targets ≥ 64dp
- [ ] Vérifier fontSize ≥ 18pt

⚠️ PROTOCOLE OBLIGATOIRE (voir section "Protocole de travail Claude Code") :
1. CONFIRME ta lecture avec les points clés retenus
2. POSE 2-3 questions de clarification
3. PRÉSENTE ton plan d'action et ATTENDS validation
```

---

### 🔍 Audit complet du projet

```
OBJECTIF : Réaliser un audit global de la qualité du projet

ANALYSE À EFFECTUER :
1. Lis docs/CLAUDE_CODE_RULES.md et docs/DESIGN_SYSTEM.md
2. Parcours la structure /src/ complète
3. Identifie TOUS les problèmes dans ces catégories :

RAPPORT ATTENDU par catégorie :
- Violations des règles de codification (imports, conventions)
- Non-conformité UI/UX (touch targets, fonts, thème)
- Code dupliqué / Composants réinventés
- Fichiers morts / Exports non utilisés
- Dette technique à prioriser

FORMAT : Tableau avec [Fichier | Problème | Sévérité | Correction proposée]
```

---

### 🏗️ Audit de la structure du projet

```
OBJECTIF : Vérifier la cohérence structurelle du projet

VÉRIFICATIONS :
1. Lis docs/PROJECT_STRUCTURE.md (structure attendue)
2. Compare avec la structure réelle via ls -la /src/

POINTS À AUDITER :
- Chaque jeu suit-il la structure obligatoire ?
  /src/games/{nom}/ → index.ts, types.ts, components/, hooks/, data/
- Les routes correspondent-elles aux jeux ?
  /app/(games)/{XX-nom}/ ↔ /src/games/{nom}/
- Le registry est-il à jour ? (src/games/registry.ts)
- Y a-t-il des dossiers orphelins ou mal nommés ?

LIVRABLE : Liste des incohérences avec corrections à apporter
```

---

### 📏 Audit du respect des règles de codification

```
OBJECTIF : Vérifier le respect strict des conventions

RÈGLES À VÉRIFIER (docs/CLAUDE_CODE_RULES.md) :
1. Imports thème : `import { theme } from '@/theme'` (pas /constants/)
2. Composants obligatoires utilisés :
   - PageContainer, ScreenHeader, BackButton
   - GameModal, VictoryCard
3. Conventions nommage :
   - Hooks : use{NomJeu}Game.ts
   - Écrans : {NomJeu}Screen.tsx
   - Types : types.ts par module

RECHERCHE À EFFECTUER :
- grep -r "from.*constants" src/
- grep -r "StyleSheet.create" src/ (vérifier usage theme)
- Fichiers sans export default

RAPPORT : [Fichier | Règle violée | Ligne | Correction]
```

---

### ⚡ Audit de performance et optimisation

```
OBJECTIF : Identifier les opportunités d'optimisation

POINTS À ANALYSER :
1. Composants lourds sans mémoisation (React.memo, useMemo, useCallback)
2. Re-renders inutiles (props objets/fonctions inline)
3. Images non optimisées (taille, format, lazy loading)
4. Imports lourds non tree-shakés
5. useEffect avec dépendances manquantes/excessives
6. Animations non-native (Animated vs Reanimated)

MÉTRIQUES À RELEVER :
- Nombre de composants > 300 lignes (à splitter)
- Hooks avec > 5 useState (extraire en reducer)
- Fichiers > 500 lignes (à refactoriser)

LIVRABLE : Liste priorisée [Impact | Effort | Fichier | Optimisation]
```

---

### 🎨 Audit d'homogénéité visuelle

```
OBJECTIF : Garantir une expérience utilisateur cohérente

VÉRIFICATIONS UI (docs/DESIGN_SYSTEM.md) :
1. Couleurs : Toutes issues de theme.colors.* ?
2. Typographie :
   - Fredoka pour titres uniquement
   - Nunito pour corps de texte
   - Tailles ≥ 18pt
3. Espacements : theme.spacing.* utilisés ?
4. Animations :
   - Reanimated 3 (pas Animated de RN)
   - spring configs cohérentes
5. Touch targets : minimum 64dp partout

ÉCRANS À COMPARER :
- Tous les IntroScreen ont-ils le même layout ?
- Les modales de victoire sont-elles identiques ?
- Les headers sont-ils uniformes ?

LIVRABLE : Score homogénéité par jeu + écarts à corriger
```

---

### ♻️ Audit de réutilisation des composants

```
OBJECTIF : Maximiser la réutilisation, éliminer la duplication

ANALYSE :
1. Lis docs/UI_COMPONENTS_CATALOG.md (composants existants)
2. Cherche les composants réinventés :

PATTERNS DE DUPLICATION COURANTS :
- Boutons custom au lieu de <Button> du catalogue
- Headers custom au lieu de <ScreenHeader>
- Modales custom au lieu de <GameModal>
- Animations dupliquées au lieu de hooks partagés

COMMANDES UTILES :
- Chercher "TouchableOpacity" hors /components/
- Chercher "Modal" custom hors /components/
- Chercher StyleSheet.create avec mêmes valeurs

LIVRABLE :
- Composants dupliqués → Remplacer par composant catalogue
- Patterns répétés → Créer nouveau composant partagé
```

---

### 🗑️ Audit fichiers morts et obsolètes

```
OBJECTIF : Nettoyer le projet des fichiers inutilisés

RECHERCHER :
1. Fichiers non importés nulle part
2. Exports non utilisés dans les fichiers
3. Composants créés mais jamais rendus
4. Hooks définis mais jamais appelés
5. Types/interfaces non référencés
6. Assets (images, sons) non utilisés

OUTILS :
- Analyser les imports avec IDE ou ts-prune
- Chercher fichiers .bak, .old, .backup
- Vérifier /assets/ vs imports réels

ACTIONS :
- Fichiers morts → Supprimer (avec backup git)
- Exports morts → Retirer l'export
- Assets morts → Déplacer dans /archive/ ou supprimer

LIVRABLE : Liste [Fichier | Raison obsolescence | Action recommandée]
```

---

### 🧩 Audit complexité et simplification

```
OBJECTIF : Réduire la complexité cognitive du code

INDICATEURS DE COMPLEXITÉ :
1. Fichiers > 400 lignes → À splitter
2. Fonctions > 50 lignes → À décomposer
3. Composants > 200 lignes JSX → Extraire sous-composants
4. Plus de 5 useState → Utiliser useReducer
5. Plus de 3 niveaux de ternaires → Extraire en fonction
6. Callbacks imbriqués > 2 niveaux → Aplatir/refactoriser

COMPLEXITÉ CYCLOMATIQUE :
- Compter if/else, switch, &&, ||, ternaires
- Objectif : < 10 par fonction

FICHIERS PRIORITAIRES À ANALYSER :
- Les hooks de jeu (use*Game.ts)
- Les écrans principaux (*Screen.tsx)
- Les composants avec beaucoup de props

LIVRABLE : Top 10 fichiers les plus complexes avec plan de simplification
```

---

### 🔄 Audit de cohérence globale

```
OBJECTIF : Vue d'ensemble de la santé du projet

EXÉCUTER TOUS LES AUDITS :
1. Structure ✓
2. Règles de codification ✓
3. Performance ✓
4. Homogénéité UI ✓
5. Réutilisation composants ✓
6. Fichiers morts ✓
7. Complexité ✓

SYNTHÈSE ATTENDUE :
┌─────────────────────┬───────┬──────────┐
│ Catégorie           │ Score │ Priorité │
├─────────────────────┼───────┼──────────┤
│ Structure           │  /100 │          │
│ Codification        │  /100 │          │
│ Performance         │  /100 │          │
│ Homogénéité UI      │  /100 │          │
│ Réutilisation       │  /100 │          │
│ Propreté (morts)    │  /100 │          │
│ Simplicité          │  /100 │          │
├─────────────────────┼───────┼──────────┤
│ SCORE GLOBAL        │  /100 │          │
└─────────────────────┴───────┴──────────┘

PLAN D'ACTION : Top 5 corrections à impact maximal
```

---

## 📋 Liste complète des documents

### 📁 À la racine du projet

| Fichier | Description | Priorité |
|---------|-------------|----------|
| `claude.md` | Instructions principales Claude Code | 🔴 Critique |
| `README.md` | README du projet | 🟡 Référence |

---

### 📁 Dans `/docs/`

#### 🔴 Documents critiques (lire en premier)

| Fichier | Catégorie | Description |
|---------|-----------|-------------|
| `CLAUDE_CODE_RULES.md` | IA/Dev | Règles obligatoires pour Claude Code |
| `DESIGN_SYSTEM.md` | UI/UX | Tokens couleurs, typo, spacing, animations |
| `PROJECT_STRUCTURE.md` | Architecture | Structure du projet, conventions |

#### 🟠 Documents essentiels

| Fichier | Catégorie | Description |
|---------|-----------|-------------|
| `UI_PATTERNS.md` | UI/UX | Patterns composants standardisés |
| `UI_COMPONENTS_CATALOG.md` | UI/UX | Catalogue composants prêts à l'emploi |
| `MASCOTTES_REGISTRY.md` | Pédagogie | Registre des mascottes par jeu |
| `GUIDELINES_AUDIT.md` | Qualité | Audit conformité UX (89%) |

#### 🟡 Documents de référence

| Fichier | Catégorie | Description |
|---------|-----------|-------------|
| `PROMPT_REFACTORING.md` | IA/Dev | Prompts pour homogénéisation |
| `SYNTHESE_STANDARDISATION.md` | Historique | Résumé des migrations effectuées |
| `IMPLEMENTATION_SUMMARY.md` | État | Avancement global du projet |
| `AUDIO_IMPROVEMENTS.md` | Audio | Système sonore, hook useSound |

#### 🟢 Documents spécialisés

| Fichier | Catégorie | Description |
|---------|-----------|-------------|
| `MASCOT_ROBOT_IMPLEMENTATION.md` | Technique | Implémentation mascotte Robot |
| `ROBOT_VISUAL_GUIDE.md` | Design | Guide visuel du robot Pixel |
| `PLAN_HOME_V9.md` | Planification | Plan Home "Forêt Magique" |
| `CHANGELOG_SUITES_LOGIQUES.md` | Changelog | Historique Suites Logiques |

---

### 📁 Dans `/Fiches Educatives/`

#### Fiches complètes ✅

| Dossier | Jeu | Contenu |
|---------|-----|---------|
| `01-Tour de Hanoï/` | Tour de Hanoï | FICHE_ACTIVITE, FICHE_PARENT, DIALOGUES_IA, SPECS_TECHNIQUES + UX/UI specs |
| `02-suites-logiques/` | Suites Logiques | Complet (5 fichiers) |
| `03-labyrinthe/` | Labyrinthe | Complet (6 fichiers) |
| `04-balance/` | Balance Logique | Complet (5 fichiers) |
| `05-sudoku/` | Sudoku Montessori | Complet + IMPLEMENTATION_SUMMARY (8 fichiers) |
| `06-Conteur Curieux/` | Le Conteur Curieux | Complet + HTML briefs (6 fichiers) |
| `12-Matrice Magique/` | Matrices Magiques | Complet + HTML briefs (10 fichiers) |

#### Fiches partielles ⚠️ (à compléter)

| Dossier | Jeu | Contenu actuel | Manque |
|---------|-----|----------------|--------|
| `07-memory/` | Memory | FICHE_ACTIVITE, DIALOGUES_IA | FICHE_PARENT, SPECS_TECHNIQUES |
| `08-tangram/` | Puzzle Formes | FICHE_ACTIVITE, DIALOGUES_IA | FICHE_PARENT, SPECS_TECHNIQUES |
| `09-logix-grid/` | Logix Grid | FICHE_ACTIVITE, DIALOGUES_IA | FICHE_PARENT, SPECS_TECHNIQUES |
| `10-mots-croises/` | Mots Croisés | FICHE_ACTIVITE, DIALOGUES_IA | FICHE_PARENT, SPECS_TECHNIQUES |
| `11-math-blocks/` | MathBlocks | FICHE_ACTIVITE, DIALOGUES_IA | FICHE_PARENT, SPECS_TECHNIQUES |
| `13-Embouteillage/` | Embouteillage | briefs/, docs/, html/ | À structurer |

---

## 🎮 Liste des jeux (13)

| # | Jeu | Route | Mascotte | Statut |
|---|-----|-------|----------|--------|
| 01 | Tour de Hanoï | `/(games)/01-hanoi` | 🐵 Léo | ✅ |
| 02 | Suites Logiques | `/(games)/02-suites-logiques` | 🤖 Pixel | ✅ |
| 03 | Labyrinthe | `/(games)/03-labyrinthe` | 🐿️ Scout | ✅ |
| 04 | Balance Logique | `/(games)/04-balance` | 🦉 Libra | ✅ |
| 05 | Sudoku Montessori | `/(games)/05-sudoku` | 🦉 Prof. Hoo | ✅ |
| 06 | Le Conteur Curieux | `/(games)/06-conteur-curieux` | 🪶 Plume | ✅ |
| 07 | Memory | `/(games)/07-memory` | 🐘 Memo | ✅ |
| 08 | Puzzle Formes | `/(games)/08-tangram` | 🦊 Géo | ✅ |
| 09 | Logix Grid | `/(games)/09-logix-grid` | 🐜 Ada | ✅ |
| 10 | Mots Croisés | `/(games)/10-mots-croises` | 🦜 Lexie | ✅ |
| 11 | MathBlocks | `/(games)/11-math-blocks` | 🦫 Calc | ✅ |
| 12 | Matrices Magiques | `/(games)/12-matrices-magiques` | ✨ Mystic | ✅ |
| 13 | Embouteillage | `/(games)/13-embouteillage` | 🚗 ? | 🔜 |

---

## ⚠️ Règles essentielles (mémo)

| Règle | Valeur | Fichier référence |
|-------|--------|-------------------|
| Import thème | `import { theme } from '@/theme'` | CLAUDE_CODE_RULES.md |
| Touch targets | ≥ 64dp minimum | DESIGN_SYSTEM.md |
| Texte courant | ≥ 18pt minimum | DESIGN_SYSTEM.md |
| Polices | Fredoka (titres) + Nunito (corps) | DESIGN_SYSTEM.md |
| Animations | Reanimated 3 avec spring | DESIGN_SYSTEM.md |
| Imports obsolètes | ❌ `/constants/` → ✅ `/theme/` | CLAUDE_CODE_RULES.md |

---

## 💡 Mémo navigation rapide

```
🆕 Nouveau composant    → CLAUDE_CODE_RULES + UI_COMPONENTS_CATALOG
🎮 Nouveau jeu          → PROJECT_STRUCTURE + MASCOTTES_REGISTRY
🔊 Ajouter son          → AUDIO_IMPROVEMENTS
🏠 Modifier Home        → UI_PATTERNS (section V10)
🎨 Changer style        → DESIGN_SYSTEM + theme/
🔧 Refactoring          → PROMPT_REFACTORING + GUIDELINES_AUDIT
🐵 Ajouter mascotte     → MASCOTTES_REGISTRY
🤖 Config Claude        → claude.md + CLAUDE_CODE_RULES

--- AUDITS & MAINTENANCE ---
🔍 Audit complet        → Copier prompt "Audit complet du projet"
🏗️ Audit structure      → Copier prompt "Audit structure du projet"
📏 Audit codification   → Copier prompt "Audit règles de codification"
⚡ Audit performance    → Copier prompt "Audit performance et optimisation"
🎨 Audit homogénéité    → Copier prompt "Audit homogénéité visuelle"
♻️ Audit réutilisation  → Copier prompt "Audit réutilisation composants"
🗑️ Fichiers morts       → Copier prompt "Audit fichiers morts"
🧩 Audit complexité     → Copier prompt "Audit complexité et simplification"
🔄 Audit global         → Copier prompt "Audit de cohérence globale"
```

---

## 📊 État de la documentation

| Métrique | Valeur | Objectif |
|----------|--------|----------|
| Documents à jour | 90% | 95% |
| Fiches éducatives complètes | 7/13 | 13/13 |
| Fiches éducatives partielles | 6/13 | 0/13 |
| Conformité UI | 89% | 95% |
| Mascottes documentées | 12/13 | 13/13 |

---

## 🔄 Historique des mises à jour

| Date | Version | Changements |
|------|---------|-------------|
| Déc 2024 | 2.2 | Ajout "Protocole de travail Claude Code" : confirmation lecture, questions clarification, planification actions |
| Déc 2024 | 2.1 | Ajout 9 prompts d'audit (structure, codification, performance, homogénéité, réutilisation, fichiers morts, complexité, cohérence globale) |
| Déc 2024 | 2.0 | Ajout MASCOTTES_REGISTRY, correction références, audit complet |
| Déc 2024 | 1.5 | Ajout CLAUDE_CODE_RULES, UI_COMPONENTS_CATALOG |
| Déc 2024 | 1.0 | Création initiale |

---

*Index mis à jour le 28 Décembre 2024*
*Prochaine revue : Après complétion des Fiches Éducatives manquantes*
