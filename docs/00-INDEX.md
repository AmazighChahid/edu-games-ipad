# INDEX DOCUMENTATION — Hello Guys

> **Quick Reference Card** — v7.0 — Janvier 2026

---

## Principe fondamental

**Docs = RÈGLES stables** | **Code = État actuel**

Ne jamais maintenir dans les docs des listes qui existent dans le code.

---

## Sources de vérité CODE

| Information | Fichier source |
| --- | --- |
| Liste des jeux | `src/games/registry.ts` |
| Icônes disponibles | `src/constants/icons.ts` |
| Mascottes | `src/games/*/components/*Mascot.tsx` |
| Composants UI | `src/components/common/` |
| Slices store | `src/store/slices/` |

---

## Documentation RÈGLES

| Fichier | Contenu |
| --- | --- |
| `RÈGLES/CLAUDE_CODE_RULES.md` | Imports, interdictions, checklist |
| `RÈGLES/DESIGN_SYSTEM.md` | Tokens, composants UI |
| `RÈGLES/UI_COMPONENTS_CATALOG.md` | Props des composants |
| `ARCHITECTURE/GAME_ARCHITECTURE.md` | Pattern Hook+Template |
| `ARCHITECTURE/STORE_ARCHITECTURE.md` | Slices Zustand |
| `CONTEXTE/INSTRUCTIONS_PROJET.md` | Vision pédagogique |
| `CONTEXTE/MASCOTTES_GUIDELINES.md` | Règles mascottes |

---

## Agents Claude Code

> Chaque agent inclut son propre **Protocole 3 étapes** (Confirmer → Questions → Plan).

| Commande | Usage |
| --- | --- |
| `/nouveau-jeu` | Créer un jeu éducatif complet |
| `/nouveau-composant` | Créer un composant UI réutilisable |
| `/audit` | Vérifier conformité projet (score /100) |
| `/bug` | Diagnostiquer et corriger un bug |
| `/refactoring` | Homogénéiser un écran/composant |
| `/mascotte` | Créer/modifier une mascotte |
| `/fiche-educative` | Créer les 4 docs pédagogiques |
| `/integration-html` | Convertir HTML → React Native |

---

## Règles critiques (mémo)

> **Détails** → `RÈGLES/CLAUDE_CODE_RULES.md`

| Règle | Valeur |
| --- | --- |
| Import thème | `import { theme } from '@/theme'` |
| Import icônes | `import { Icons } from '@/constants/icons'` |
| Touch targets | ≥ 64dp |
| Texte courant | ≥ 18pt |
| Polices | Fredoka (titres) + Nunito (corps) |
| Animations | Reanimated 3 + spring |
| Feedback erreur | JAMAIS punitif |
