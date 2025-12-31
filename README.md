# 📦 MISE À JOUR DOCUMENTATION — Hello Guys

> **Date** : Décembre 2024
> **Objectif** : Éliminer les doublons et établir des sources de vérité uniques

---

## Principe appliqué

**Chaque information a UN SEUL propriétaire. Les autres documents pointent vers la source.**

### Sources de vérité établies

| Type d'info | Source unique | Modifier ICI uniquement |
|-------------|---------------|-------------------------|
| Règles code | `CLAUDE_CODE_RULES.md` | Imports, interdictions, checklist |
| Tokens design | `DESIGN_SYSTEM.md` | Couleurs, typo, spacing |
| Props composants | `UI_COMPONENTS_CATALOG.md` | Détails de chaque composant |
| Architecture jeux | `GAME_ARCHITECTURE.md` | Pattern Hook+Template |
| Types universels | `TRAME_REFERENTIEL.md` | GameMetadata, CognitiveSkill |
| Mascottes | `MASCOTTES_REGISTRY.md` | Liste et dialogues |
| Icônes | `ICONS_REGISTRY.md` | 78 icônes centralisées |
| Vision pédagogique | `INSTRUCTIONS_PROJET_APP_EDUCATIVE.md` | Principes Montessori |
| Principes UX | `GUIDE_UX_UI_APP_EDUCATIVE.md` | Guidelines enfant |
| Préprompts | Fichiers séparés (`.md`) | Templates complets |

---

## Fichiers modifiés

### 🔄 Documents restructurés (contenu dupliqué → références)

| Fichier | Modification |
|---------|--------------|
| `00-INDEX.md` | Résumés + liens vers préprompts détaillés |
| `claude.md` | Réduit de ~200 à ~80 lignes, avec références |
| `CLAUDE_CODE_RULES.md` | Consolidé comme source unique des règles |
| `PROMPT_REFACTORING.md` | Sections dupliquées remplacées par références |
| `INSTRUCTIONS_PROJET_APP_EDUCATIVE.md` | Sections techniques → références |
| `GUIDE_UX_UI_APP_EDUCATIVE.md` | Valeurs exactes → références vers DESIGN_SYSTEM |

### 📝 Documents renommés

| Ancien nom | Nouveau nom | Raison |
|------------|-------------|--------|
| `ACTIVITES_APP_EDUCATIVE.md` | `ROADMAP_ACTIVITES.md` | Clarifier le rôle (vision, pas état actuel) |

### ✅ Préprompts conservés (contenu unique)

Ces fichiers contiennent des templates complets non présents ailleurs :

- `nouveau-jeu.md` — Template création jeu complet
- `nouveau-composant.md` — Template création composant
- `fiche-educative.md` — Templates des 4 fiches
- `audit.md` — Scoring et commandes bash
- `sync-docs.md` — Process de synchronisation

### 🗑️ Fichiers à supprimer (recommandation)

| Fichier | Raison |
|---------|--------|
| `Informations/DESIGN_SYSTEM_V2.md` | Encodage corrompu + doublon |

### 📦 Fichiers à archiver (recommandation)

| Fichier | Raison |
|---------|--------|
| `Informations/*.docx` | Sources Word originales |
| `Informations/*.html` | Maquettes HTML (référence visuelle) |

---

## Comment utiliser cette mise à jour

### Option 1 : Remplacement complet

1. Sauvegarder l'ancien dossier `docs/`
2. Extraire le contenu du ZIP
3. Remplacer les fichiers correspondants

### Option 2 : Mise à jour sélective

1. Remplacer uniquement les fichiers `.md` modifiés
2. Conserver les fichiers non modifiés (DESIGN_SYSTEM, UI_COMPONENTS_CATALOG, etc.)

---

## Structure après mise à jour

```
docs/
├── 00-INDEX.md                              ← Hub + résumés préprompts
│
├── Méthodologies/
│   │
│   ├── [RÈGLES - Sources de vérité]
│   │   ├── CLAUDE_CODE_RULES.md             ← Règles code
│   │   ├── DESIGN_SYSTEM.md                 ← (inchangé)
│   │   ├── UI_COMPONENTS_CATALOG.md         ← (inchangé)
│   │   └── UI_PATTERNS.md                   ← (inchangé)
│   │
│   ├── [ARCHITECTURE]
│   │   ├── TRAME_REFERENTIEL.md             ← (inchangé)
│   │   ├── GAME_ARCHITECTURE.md             ← (inchangé)
│   │   └── PROJECT_STRUCTURE.md             ← (inchangé)
│   │
│   ├── [REGISTRES]
│   │   ├── MASCOTTES_REGISTRY.md            ← (inchangé)
│   │   └── ICONS_REGISTRY.md                ← (inchangé)
│   │
│   ├── [PRÉPROMPTS]
│   │   ├── nouveau-jeu.md                   ← Mis à jour
│   │   ├── nouveau-composant.md             ← Mis à jour
│   │   ├── fiche-educative.md               ← Mis à jour
│   │   ├── audit.md                         ← Mis à jour
│   │   └── sync-docs.md                     ← Mis à jour
│   │
│   ├── [CONTEXTE]
│   │   ├── INSTRUCTIONS_PROJET_APP_EDUCATIVE.md  ← Mis à jour
│   │   ├── GUIDE_UX_UI_APP_EDUCATIVE.md          ← Mis à jour
│   │   └── ROADMAP_ACTIVITES.md                  ← Nouveau (renommé)
│   │
│   ├── [ÉTAT]
│   │   ├── GUIDELINES_AUDIT.md              ← (inchangé)
│   │   ├── MIGRATION_STATUS.md              ← (inchangé)
│   │   └── PROMPT_REFACTORING.md            ← Mis à jour
│   │
│   └── ... autres fichiers inchangés
│
├── Informations/                            ← À archiver/nettoyer
│   └── ...
│
└── claude.md (racine)                       ← Mis à jour (simplifié)
```

---

## Bénéfices attendus

| Avant | Après |
|-------|-------|
| 40-50% de redondance | <10% de redondance |
| 2-3 endroits à modifier par règle | 1 source unique |
| Risque de divergence | Cohérence garantie |
| Documentation longue à parcourir | Navigation claire avec références |

---

## Maintenance future

### Quand modifier une règle

1. Identifier la **source de vérité** (voir tableau ci-dessus)
2. Modifier **uniquement** ce fichier
3. Les autres docs pointent déjà vers lui

### Quand ajouter un nouveau jeu

1. Utiliser `nouveau-jeu.md` (préprompt complet)
2. Mettre à jour `registry.ts` (source de vérité code)
3. Le reste se synchronise via `sync-docs.md`

---

*Mise à jour documentée — Décembre 2024*
