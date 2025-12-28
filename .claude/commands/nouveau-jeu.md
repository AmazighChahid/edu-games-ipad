---
description: Créer un nouveau jeu éducatif complet (structure + fiches + registry)
argument-hint: <nom-du-jeu>
---

# Création d'un Nouveau Jeu : $ARGUMENTS

## Contexte obligatoire à charger

LIRE OBLIGATOIREMENT ces documents AVANT de commencer :

1. `@docs/TRAME_REFERENTIEL.md` — Architecture des activités
2. `@docs/PROJECT_STRUCTURE.md` — Structure des fichiers
3. `@docs/MASCOTTES_REGISTRY.md` — Registre des mascottes
4. `@docs/DESIGN_SYSTEM.md` — Tokens UI
5. `@Fiches Educatives/` — Exemples de fiches existantes

## Processus en 4 phases

### Phase 1 : Préparation (Fiches Éducatives)

Créer le dossier `/Fiches Educatives/{XX-NomJeu}/` avec :

1. **FICHE_ACTIVITE.md** — Objectif pédagogique, méthode enseignée, déroulement UX
2. **FICHE_PARENT.md** — Compétences mobilisées, conseils accompagnement
3. **DIALOGUES_IA.md** — Scripts mascotte par âge (6-7, 8-9, 9-10)
4. **SPECS_TECHNIQUES.md** — Composants, animations, sons

### Phase 2 : Implémentation

Créer le dossier `/src/games/{XX-nomJeu}/` avec :

```
{nomJeu}/
├── index.ts                    # Exports publics
├── types.ts                    # Types spécifiques
├── components/
│   ├── index.ts
│   └── {Element}.tsx
├── hooks/
│   └── use{NomJeu}Game.ts      # Hook principal (~400 lignes)
├── logic/
│   ├── {nomJeu}Engine.ts       # Logique pure
│   └── validator.ts
├── data/
│   ├── levels.ts               # Configuration niveaux
│   └── assistantScripts.ts     # Scripts IA
└── screens/
    ├── {NomJeu}IntroScreen.tsx
    └── {NomJeu}VictoryScreen.tsx
```

### Phase 3 : Intégration

1. Ajouter dans `/src/games/registry.ts`
2. Créer la route `/app/(games)/{XX-nomJeu}/`
   - `_layout.tsx` (Stack navigator)
   - `index.tsx` (point d'entrée)
   - `victory.tsx` (si écran séparé)

### Phase 4 : Validation

- [ ] Tester tous les niveaux
- [ ] Feedback jamais punitif
- [ ] Touch targets ≥ 64dp
- [ ] Texte ≥ 18pt
- [ ] Assistant IA fonctionne

## Règles critiques

```typescript
// ✅ Import obligatoire
import { theme } from '@/theme';
import { PageContainer, ScreenHeader, VictoryCard } from '@/components/common';

// ✅ Touch targets enfant
minWidth: 64, minHeight: 64

// ✅ Compétences du registry
skills: CognitiveSkill[] // 3-5 compétences parmi les 22 disponibles
```

## Questions à poser avant de commencer

1. Quelle tranche d'âge cible ? (6-7, 7-8, 8-9, 9-10)
2. Quelle catégorie ? (logic, memory, spatial, math, language)
3. Quelles compétences cognitives ciblées ?
4. Quelle mascotte assigner ?
5. Combien de niveaux de difficulté ?
