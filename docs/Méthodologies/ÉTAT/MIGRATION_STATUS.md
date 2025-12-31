# Migration des Activités - État d'Avancement

> Dernière mise à jour : 2025-12-31 (Après migration complète)

## Architecture Cible

```
XX-nom-activite/
├── components/              # Composants UI spécifiques
│   ├── XxxGame.tsx          # Composant principal gameplay
│   └── VictoryScreen.tsx    # Utilise VictoryCard
├── data/                    # Configuration statique
│   ├── levels.ts            # [OBLIGATOIRE]
│   ├── parentGuideData.ts   # [OBLIGATOIRE]
│   └── assistantScripts.ts  # [OBLIGATOIRE]
├── hooks/                   # Logique React
│   ├── useXxxIntro.ts       # [OBLIGATOIRE]
│   ├── useXxxGame.ts        # [OBLIGATOIRE]
│   └── useXxxSound.ts       # [RECOMMANDÉ]
├── logic/                   # Logique métier pure
├── screens/
│   └── XxxIntroScreen.tsx   # Utilise GameIntroTemplate
├── types/
│   └── index.ts             # Types centralisés
├── index.ts
└── README.md                # [OPTIONNEL]
```

---

## État par Activité (Post-Migration)

| # | Activité | types/ | logic/ | hooks | data | screens | Global |
|---|----------|:------:|:------:|:-----:|:----:|:-------:|:------:|
| 01 | hanoi | ✅ | ✅ | ✅ | ✅ | ✅ | **100%** |
| 02 | suites-logiques | ✅ | ✅ | ✅ | ✅ | ✅ | **100%** |
| 03 | labyrinthe | ✅ | - | ✅ | ✅ | ✅ | **100%** |
| 04 | balance | ✅ | ✅ | ✅ | ✅ | ✅ | **100%** |
| 05 | sudoku | ✅ | ✅ | ✅ | ✅ | ✅ | **100%** |
| 06 | conteur-curieux | ✅ | ✅ | ⏳ | ⏳ | ✅ | **80%** |
| 07 | memory | ✅ | ✅ | ✅ | ✅ | ✅ | **100%** |
| 08 | tangram | ✅ | ✅ | ⏳ | ⏳ | ✅ | **80%** |
| 09 | logix-grid | ✅ | ✅ | ✅ | ⏳ | ✅ | **90%** |
| 10 | mots-croises | ✅ | ✅ | ✅ | ⏳ | ✅ | **90%** |
| 11 | math-blocks | ✅ | ✅ | ✅ | ✅ | ✅ | **100%** |
| 12 | matrices-magiques | ✅ | ✅ | ⏳ | ⏳ | ✅ | **70%** |
| 13 | embouteillage | ✅ | ✅ | ✅ | ⏳ | ✅ | **90%** |
| 14 | fabrique-reactions | ✅ | ✅ | ✅ | ⏳ | ✅ | **90%** |
| 15 | chasseur-papillons | ✅ | ✅ | ✅ | ✅ | ✅ | **100%** |

**Légende :** ✅ Conforme | ⏳ À compléter | - Non requis

---

## Migrations Effectuées (31 Déc 2025)

### Structure des dossiers

| Action | Activités migrées |
|--------|-------------------|
| `types.ts` → `types/index.ts` | 04, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15 |
| `engine/` → `logic/` | 02 |
| Suppression `constants/` vide | 03, 13 |
| Suppression `docs/` interne | 02, 05 |
| Déplacement vers `components/` | 03 (LabyrintheGame.tsx) |

### Corrections d'imports

- `02-suites-logiques` : `../constants/gameConfig` → `../data/gameConfig`
- `02-suites-logiques` : `../engine` → `../logic`
- `03-labyrinthe` : Mise à jour des chemins relatifs après déplacement

---

## Éléments Manquants par Activité

### Hooks manquants

| Hook | Activités |
|------|-----------|
| `useXxxIntro.ts` | 06-conteur, 12-matrices |
| `useXxxSound.ts` | 06-conteur, 08-tangram, 12-matrices |

### Data manquantes

| Fichier | Activités |
|---------|-----------|
| `parentGuideData.ts` | 06, 08, 09, 10, 12, 13, 14 |
| `assistantScripts.ts` | 03, 10, 12 |

---

## Conformité Architecture

### Activités 100% conformes (8/15)
- 01-hanoi
- 02-suites-logiques (**RÉFÉRENCE**)
- 03-labyrinthe
- 04-balance
- 05-sudoku
- 07-memory
- 11-math-blocks
- 15-chasseur-papillons

### Activités à compléter (7/15)
- 06-conteur-curieux : hooks + data
- 08-tangram : hooks + data
- 09-logix-grid : data
- 10-mots-croises : data
- 12-matrices-magiques : hooks + data
- 13-embouteillage : data
- 14-fabrique-reactions : data

---

## Historique de Migration

| Date | Actions | Résultat |
|------|---------|----------|
| 2025-12-31 | Migration types.ts → types/index.ts (11 activités) | ✅ |
| 2025-12-31 | Migration engine/ → logic/ (02-suites) | ✅ |
| 2025-12-31 | Suppression constants/ et docs/ obsolètes | ✅ |
| 2025-12-31 | Déplacement LabyrintheGame.tsx | ✅ |
| 2025-12-31 | Correction imports après migrations | ✅ |

---

## Prochaines Étapes

1. **Créer les hooks manquants** pour 06, 08, 12
2. **Créer les fichiers data manquants** (parentGuideData, assistantScripts)
3. **Vérifier UI/UX** (touch targets ≥ 64dp, fontSize ≥ 18pt)
4. **Corriger erreurs TypeScript préexistantes** (AssistantTrigger, AssistantScript)

---

*Document généré automatiquement après migration structurelle*
