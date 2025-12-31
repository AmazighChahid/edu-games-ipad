# CLAUDE.md — Hello Guys
## App Éducative iPad • Enfants 6-10 ans • React Native + Expo SDK 52+

---

## 🎯 Philosophie (Non-négociable)

> **« Apprendre à penser, pas à répondre »**

L'objectif n'est PAS le résultat correct, mais la **transmission des MÉTHODES de raisonnement**. L'enfant comprend le "pourquoi" et le "comment".

### Priorités absolues
1. 🧒 **L'enfant** avant la technique
2. 📚 **La pédagogie** avant la gamification
3. 🎯 **L'expérience** avant la performance
4. ✨ **La clarté** avant la rapidité

---

## 🚀 Workflow Claude Code

### Avant TOUTE tâche

```
1. LIRE   → docs/00-INDEX.md (trouver le pré-prompt adapté)
2. LIRE   → Documents référencés dans le pré-prompt
3. SUIVRE → Protocole 3 étapes (Confirmer → Questions → Plan)
```

### Protocole 3 étapes (OBLIGATOIRE)

```
✅ J'ai lu [documents] — Points clés : [résumé]
✅ Règles critiques : [liste]
✅ Composants à réutiliser : [liste]

❓ Questions de clarification (2-3 max)

📋 PLAN :
1. Fichiers à examiner
2. Modifications
3. Tests
4. Livrables

→ ATTENDRE VALIDATION avant implémentation.
```

---

## 📁 Documentation — Sources de vérité

> **Chemins relatifs à la racine du projet**

| Besoin | Document | Chemin |
|--------|----------|--------|
| **Point d'entrée** | `00-INDEX.md` | `docs/` |
| **Règles code** | `CLAUDE_CODE_RULES.md` | `docs/Méthodologies/RÈGLES/` |
| **Design tokens** | `DESIGN_SYSTEM.md` | `docs/Méthodologies/RÈGLES/` |
| **Composants UI** | `UI_COMPONENTS_CATALOG.md` | `docs/Méthodologies/RÈGLES/` |
| **Patterns UI** | `UI_PATTERNS.md` | `docs/Méthodologies/RÈGLES/` |
| **Architecture jeux** | `GAME_ARCHITECTURE.md` | `docs/Méthodologies/ARCHITECTURE/` |
| **Structure projet** | `PROJECT_STRUCTURE.md` | `docs/Méthodologies/ARCHITECTURE/` |
| **Types universels** | `TRAME_REFERENTIEL.md` | `docs/Méthodologies/ARCHITECTURE/` |
| **Mascottes** | `MASCOTTES_REGISTRY.md` | `docs/Méthodologies/REGISTRES/` |
| **Icônes** | `ICONS_REGISTRY.md` | `docs/Méthodologies/REGISTRES/` |

---

## ⛔ Règles critiques (Résumé)

> **Détails complets** → `docs/Méthodologies/RÈGLES/CLAUDE_CODE_RULES.md`

### Imports obligatoires
```typescript
// ✅ TOUJOURS
import { theme } from '@/theme';
import { Icons } from '@/constants/icons';
import { Button, ScreenHeader, PageContainer } from '@/components/common';

// ❌ JAMAIS
import { Colors } from '@/constants/colors'; // DEPRECATED
```

### Contraintes enfant

> **Détails complets** → `docs/Méthodologies/RÈGLES/DESIGN_SYSTEM.md`

| Règle | Valeur |
|-------|--------|
| Touch targets | ≥ **64dp** |
| Texte courant | ≥ **18pt** |
| Profondeur navigation | ≤ **3 niveaux** |
| Feedback erreur | **JAMAIS punitif** |

### Composants à NE PAS recréer

> **Liste complète** → `docs/Méthodologies/RÈGLES/UI_COMPONENTS_CATALOG.md`

```
BackButton, ScreenHeader, PageContainer, GameModal,
VictoryCard, Button, IconButton, MascotBubble, HintButton,
GameIntroTemplate, Confetti, ProgressIndicator
```

---

## 🎮 Jeux disponibles (15)

> **Source de vérité** → `src/games/registry.ts`
> **Mascottes détaillées** → `docs/Méthodologies/REGISTRES/MASCOTTES_REGISTRY.md`

| # | Jeu | Status | Mascotte |
|---|-----|--------|----------|
| 01 | Tour de Hanoï | ✅ | Piou 🦉 |
| 02 | Suites Logiques | ✅ | Pixel 🤖 |
| 03 | Labyrinthe | ✅ | Scout 🐿️ |
| 04 | Balance Logique | ✅ | Dr. Hibou 🦉 |
| 05 | Sudoku Montessori | ✅ | Prof. Hoo 🦉 |
| 06 | Conteur Curieux | ✅ | Plume 🪶 |
| 07 | Memory | ✅ | Memo 🐘 |
| 08 | Tangram | ✅ | Géo 🦊 |
| 09 | Logix Grid | ✅ | Ada 🐜 |
| 10 | Mots Croisés | ✅ | Lexie 🦜 |
| 11 | MathBlocks | ✅ | Calc 🦫 |
| 12 | Matrices Magiques | ✅ | Pixel 🦊 |
| 13 | Embouteillage | 🔜 | — |
| 14 | Fabrique Réactions | 🔜 | — |
| 15 | Chasseur Papillons | 🔜 | — |

---

## 🤖 Assistant IA — Principes

> **Dialogues détaillés** → `/Fiches Educatives/{XX-nom}/DIALOGUES_IA.md`

1. **JAMAIS la réponse** — Guider par questions
2. **Pas d'intervention non sollicitée** — Attendre l'action enfant
3. **Ton bienveillant** — Calme, simple, rassurant
4. **Erreur = opportunité** — Jamais d'échec, toujours "essaie encore"

---

*Ce fichier est un résumé. Pour les détails, consulter les documents référencés.*
*v4.0 — Décembre 2024*
