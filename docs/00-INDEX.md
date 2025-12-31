# INDEX DOCUMENTATION — Hello Guys

> **Version** : 5.1 — Décembre 2024

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
    ├── PRÉPROMPTS/
    │   ├── nouveau-jeu.md          # Créer un jeu
    │   ├── nouveau-composant.md    # Créer composant
    │   └── audit.md                # Vérifier conformité
    └── CONTEXTE/
        ├── INSTRUCTIONS_PROJET.md  # Vision pédagogique
        ├── GUIDE_UX_UI.md          # Principes UX enfant
        ├── PARENT_DASHBOARD_GUIDE.md # Dashboard parent
        └── MASCOTTES_GUIDELINES.md # Règles mascottes
```

---

## Pré-prompts Claude Code

### Nouveau composant UI

```
LIRE : RÈGLES/CLAUDE_CODE_RULES.md, RÈGLES/DESIGN_SYSTEM.md
RÈGLES : theme uniquement, touch ≥64dp, texte ≥18pt
```

### Nouveau jeu

```
LIRE : ARCHITECTURE/GAME_ARCHITECTURE.md
RÉFÉRENCE : src/games/02-suites-logiques/ (implémentation complète)
```

### Audit

```
LIRE : RÈGLES/CLAUDE_CODE_RULES.md
VÉRIFIER : imports, touch targets, texte, composants standards
```

---

## Règles critiques (mémo)

| Règle | Valeur |
|-------|--------|
| Import thème | `import { theme } from '@/theme'` |
| Import icônes | `import { Icons } from '@/constants/icons'` |
| Touch targets | ≥ 64dp |
| Texte courant | ≥ 18pt |
| Polices | Fredoka (titres) + Nunito (corps) |
| Animations | Reanimated 3 + spring |

---

*v5.0 — Simplifié — Décembre 2024*
