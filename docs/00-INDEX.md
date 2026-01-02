# INDEX DOCUMENTATION — Hello Guys

> **Version** : 5.2 — Janvier 2026

---

## Principe

**Docs = RÈGLES stables** | **Code = État actuel**

Ne jamais maintenir dans les docs des listes qui existent dans le code.

---

## État actuel → Consulter le code

| Information | Fichier source |
|-------------|----------------|
| Liste des jeux | `src/games/registry.ts` |
| Icônes disponibles | `src/constants/icons.ts` |
| Mascottes | `src/games/*/components/*Mascot.tsx` |
| Composants UI | `src/components/common/` |
| Slices store | `src/store/slices/` |

---

## Documentation (règles stables)

| Fichier | Contenu |
|---------|---------|
| `RÈGLES/CLAUDE_CODE_RULES.md` | Imports, interdictions, checklist |
| `RÈGLES/DESIGN_SYSTEM.md` | Tokens, composants UI |
| `RÈGLES/UI_COMPONENTS_CATALOG.md` | Props des composants |
| `RÈGLES/TESTING_STRATEGY.md` | Jest, tests |
| `ARCHITECTURE/GAME_ARCHITECTURE.md` | Pattern Hook+Template |
| `ARCHITECTURE/STORE_ARCHITECTURE.md` | Slices Zustand |

---

## Structure docs/

```
docs/
├── 00-INDEX.md                     # Ce fichier
└── Méthodologies/
    ├── RÈGLES/
    │   ├── CLAUDE_CODE_RULES.md    # Imports, interdictions
    │   ├── DESIGN_SYSTEM.md        # Tokens, composants
    │   ├── UI_COMPONENTS_CATALOG.md # Props composants
    │   └── TESTING_STRATEGY.md     # Jest, tests
    ├── ARCHITECTURE/
    │   ├── GAME_ARCHITECTURE.md    # Pattern Hook+Template
    │   └── STORE_ARCHITECTURE.md   # Zustand slices
    └── CONTEXTE/
        ├── INSTRUCTIONS_PROJET.md  # Vision pédagogique
        ├── GUIDE_UX_UI.md          # Principes UX enfant
        ├── PARENT_DASHBOARD_GUIDE.md # Dashboard parent
        └── MASCOTTES_GUIDELINES.md # Règles mascottes
```

## Agents Claude Code

Les agents spécialisés sont définis dans `.claude/agents/` :

```text
.claude/agents/
├── nouveau-jeu.md          # /nouveau-jeu — Créer un jeu complet
├── nouveau-composant.md    # /nouveau-composant — Créer composant UI
├── audit.md                # /audit — Vérifier conformité projet
├── corriger-bug.md         # /bug — Corriger un bug
├── refactoring.md          # /refactoring — Homogénéiser écran
├── mascotte.md             # /mascotte — Créer/modifier mascotte
└── fiche-educative.md      # /fiche-educative — Docs pédagogiques
```

---

## Protocole Claude Code (3 étapes)

> **OBLIGATOIRE avant toute implémentation.**

### Avant chaque tâche, suivre ces 3 étapes

#### 1. Confirmer la lecture

```
✅ J'ai lu [documents] — Points clés : [résumé]
✅ Règles critiques retenues : [liste]
✅ Composants à réutiliser : [liste]
```

#### 2. Poser 2-3 questions de clarification

```
❓ [Question sur cas particulier, priorité, contrainte...]
```

#### 3. Présenter le plan d'action

```
📋 PLAN :
1. Fichiers à examiner : [liste]
2. Modifications : [liste ordonnée]
3. Tests : [liste]
4. Livrables : [fichiers créés/modifiés]

→ ATTENDRE VALIDATION avant implémentation.
```

---

## Agents par type de tâche

| Tâche | Commande | Documents | Questions clés |
| ----- | -------- | --------- | -------------- |
| **Nouveau jeu** | `/nouveau-jeu` | GAME_ARCHITECTURE.md | Âge? Catégorie? Méthode? |
| **Nouveau composant** | `/nouveau-composant` | DESIGN_SYSTEM.md | Existe déjà? Props? |
| **Corriger bug** | `/bug` | CLAUDE_CODE_RULES.md | Reproductible? Impact? |
| **Refactoring écran** | `/refactoring` | DESIGN_SYSTEM.md | Objectif? Régressions? |
| **Mascotte** | `/mascotte` | MASCOTTES_GUIDELINES.md | Création/modif? Personnalité? |
| **Fiche éducative** | `/fiche-educative` | INSTRUCTIONS_PROJET.md | Méthode? Compétences? |
| **Audit** | `/audit` | CLAUDE_CODE_RULES.md | Périmètre? Score cible? |

---

## Règles critiques (mémo)

> **Source de vérité** → `RÈGLES/CLAUDE_CODE_RULES.md`

| Règle | Valeur |
|-------|--------|
| Import thème | `import { theme } from '@/theme'` |
| Import icônes | `import { Icons } from '@/constants/icons'` |
| Touch targets | ≥ 64dp |
| Texte courant | ≥ 18pt |
| Polices | Fredoka (titres) + Nunito (corps) |
| Animations | Reanimated 3 + spring |

---

v6.0 — Agents Claude Code — Janvier 2026
