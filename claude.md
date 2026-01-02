# CLAUDE.md — Hello Guys
## App Éducative iPad • Enfants 6-10 ans • React Native + Expo SDK 52+

---

## Philosophie (Non-négociable)

> **« Apprendre à penser, pas à répondre »**

L'objectif n'est PAS le résultat correct, mais la **transmission des MÉTHODES de raisonnement**. L'enfant comprend le "pourquoi" et le "comment".

### Priorités absolues
1. **L'enfant** avant la technique
2. **La pédagogie** avant la gamification
3. **L'expérience** avant la performance
4. **La clarté** avant la rapidité

---

## Workflow Claude Code

### Avant TOUTE tâche

```
1. LIRE   → docs/00-INDEX.md (point d'entrée documentation)
2. LIRE   → Documents référencés selon la tâche
3. SUIVRE → Protocole 3 étapes (Confirmer → Questions → Plan)
```

> **Protocole détaillé** → [`docs/00-INDEX.md`](docs/00-INDEX.md#protocole-claude-code-3-étapes)

---

## Agents spécialisés

Les agents sont définis dans `.claude/agents/` :

| Commande | Usage | Modèle |
|----------|-------|--------|
| `/nouveau-jeu` | Créer un jeu éducatif complet (4 phases) | opus |
| `/nouveau-composant` | Créer un composant UI réutilisable | opus |
| `/audit` | Vérifier conformité projet (score /100) | opus |
| `/bug` | Diagnostiquer et corriger un bug | opus |
| `/refactoring` | Homogénéiser un écran/composant | opus |
| `/mascotte` | Créer/modifier une mascotte | opus |
| `/fiche-educative` | Créer les 4 docs pédagogiques | opus |

---

## Documentation — Sources de vérité

### Principe fondamental

**Docs = RÈGLES stables** | **Code = État actuel**

Ne jamais maintenir dans les docs des listes qui existent dans le code.

### Documents de référence

| Besoin | Document | Chemin |
|--------|----------|--------|
| **Point d'entrée** | `00-INDEX.md` | `docs/` |
| **Règles code** | `CLAUDE_CODE_RULES.md` | `docs/Méthodologies/RÈGLES/` |
| **Design tokens** | `DESIGN_SYSTEM.md` | `docs/Méthodologies/RÈGLES/` |
| **Composants UI** | `UI_COMPONENTS_CATALOG.md` | `docs/Méthodologies/RÈGLES/` |
| **Architecture jeux** | `GAME_ARCHITECTURE.md` | `docs/Méthodologies/ARCHITECTURE/` |
| **Store Zustand** | `STORE_ARCHITECTURE.md` | `docs/Méthodologies/ARCHITECTURE/` |
| **Vision pédagogique** | `INSTRUCTIONS_PROJET.md` | `docs/Méthodologies/CONTEXTE/` |
| **Mascottes** | `MASCOTTES_GUIDELINES.md` | `docs/Méthodologies/CONTEXTE/` |

### Sources de vérité CODE (toujours consulter le code)

| Information | Fichier |
|-------------|---------|
| Liste des jeux | `src/games/registry.ts` |
| Icônes disponibles | `src/constants/icons.ts` |
| Composants UI | `src/components/common/` |
| Mascottes | `src/games/*/components/*Mascot.tsx` |
| Slices store | `src/store/slices/` |

---

## Règles critiques (Résumé)

> **Détails complets** → `docs/Méthodologies/RÈGLES/CLAUDE_CODE_RULES.md`

### Imports obligatoires

```typescript
// TOUJOURS
import { theme } from '@/theme';
import { Icons } from '@/constants/icons';
import { Button, ScreenHeader, PageContainer } from '@/components/common';

// JAMAIS
import { Colors } from '@/constants/colors'; // DEPRECATED
```

### Contraintes enfant

> **Détails complets** → `docs/Méthodologies/RÈGLES/DESIGN_SYSTEM.md`

| Règle                  | Valeur             |
|------------------------|--------------------|
| Touch targets          | min 64dp           |
| Texte courant          | min 18pt           |
| Profondeur navigation  | max 3 niveaux      |
| Feedback erreur        | JAMAIS punitif     |
| Polices                | Fredoka + Nunito   |
| Animations             | Reanimated 3       |

### Composants existants (NE PAS recréer)

> **Liste complète** → `docs/Méthodologies/RÈGLES/UI_COMPONENTS_CATALOG.md`

```text
BackButton, ScreenHeader, PageContainer, GameModal,
VictoryCard, Button, IconButton, MascotBubble, HintButton,
GameIntroTemplate, Confetti, ProgressIndicator
```

---

## Assistant IA — Principes

> **Dialogues détaillés** → `Fiches Educatives/{XX-nom}/DIALOGUES_IA.md`

1. **JAMAIS la réponse** — Guider par questions
2. **Pas d'intervention non sollicitée** — Attendre l'action enfant
3. **Ton bienveillant** — Calme, simple, rassurant
4. **Erreur = opportunité** — Jamais d'échec, toujours "essaie encore"

---

## Jeu de référence

> **Implémentation complète** : `src/games/02-suites-logiques/`

Ce jeu sert de référence pour le pattern Hook+Template et la structure des fichiers.

---

*Ce fichier est un résumé. Pour les détails, consulter `docs/00-INDEX.md`.*

*v5.0 — Janvier 2026*
