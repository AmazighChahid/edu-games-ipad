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
1. LIRE   → docs/00-INDEX_UPDATED.md (trouver le pré-prompt adapté)
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

| Besoin | Document | Priorité |
|--------|----------|----------|
| **Point d'entrée** | `docs/00-INDEX_UPDATED.md` | ⭐⭐⭐ |
| **Règles code** | `docs/CLAUDE_CODE_RULES.md` | ⭐⭐⭐ |
| **Design System** | `docs/DESIGN_SYSTEM.md` | ⭐⭐⭐ |
| **Composants UI** | `docs/UI_COMPONENTS_CATALOG.md` | ⭐⭐ |
| **Structure projet** | `docs/PROJECT_STRUCTURE.md` | ⭐⭐ |
| **Architecture jeux** | `docs/TRAME_REFERENTIEL.md` | ⭐⭐ |
| **Mascottes** | `docs/MASCOTTES_REGISTRY.md` | ⭐ |
| **Icônes** | `docs/ICONS_REGISTRY.md` | ⭐ |
| **Fiches pédagogiques** | `/Fiches Educatives/XX-NomJeu/` | Par jeu |

---

## ⛔ Règles critiques (Résumé)

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
| Règle | Valeur |
|-------|--------|
| Touch targets | ≥ **64dp** |
| Texte courant | ≥ **18pt** |
| Profondeur navigation | ≤ **3 niveaux** |
| Feedback erreur | **JAMAIS punitif** |

### Composants à NE PAS recréer
```
BackButton, ScreenHeader, PageContainer, GameModal,
VictoryCard, Button, IconButton, MascotBubble, HintButton
```

→ **Détails complets** : `docs/CLAUDE_CODE_RULES.md`

---

## 🎮 Jeux disponibles (15)

| # | Jeu | Status | Mascotte |
|---|-----|--------|----------|
| 01 | Tour de Hanoï | ✅ | Piou 🦉 |
| 02 | Suites Logiques | ✅ | Pixel 🤖 |
| 03 | Labyrinthe | ✅ | Scout 🐿️ |
| 04 | Balance Logique | ✅ | Dr. Hibou 🦉 |
| 05 | Sudoku Montessori | ✅ | Prof. Hoo 🦉 |
| 06 | Conteur Curieux | ✅ | Plume 🪶 |
| 07 | Memory | 📋 | — |
| 08 | Tangram | 📋 | — |
| 09 | Logix Grid | 📋 | — |
| 10 | Mots Croisés | 📋 | — |
| 11 | MathBlocks | ✅ | — |
| 12 | Matrices Magiques | 🔜 | Pixel 🦊 |
| 13 | Chasseur Papillons | 🔜 | — |
| 14 | Embouteillage | 🔜 | — |
| 15 | Code Secret | 🔜 | — |

---

## 🤖 Assistant IA — Principes

1. **JAMAIS la réponse** — Guider par questions
2. **Pas d'intervention non sollicitée** — Attendre l'action enfant
3. **Ton bienveillant** — Calme, simple, rassurant
4. **Erreur = opportunité** — Jamais d'échec, toujours "essaie encore"

### Exemple de guidance
```
❌ "La réponse est 3"
✅ "Regarde bien ce disque. Est-ce qu'il peut aller sur un plus petit ?"
```

---

## 📚 Références UX

- **Khan Academy Kids** : Sessions 3-5 min, +50% complétion avec feedback positif
- **Duolingo Kids** : Touch targets larges, +15% réussite
- **Toca Boca** : 3-5 choix max, environnement 100% sûr
- **Endless Alphabet** : Audio + animation pour expliquer sans texte

---

*Version 4.0 • Décembre 2024*
*⚠️ Ce fichier est un RÉSUMÉ — Consulter /docs/ pour les détails*
