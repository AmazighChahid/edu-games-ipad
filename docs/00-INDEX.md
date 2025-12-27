# 📚 INDEX — Documentation du Projet

> **Application Éducative iPad** — Guide d'utilisation des documents
> **Dernière mise à jour** : Décembre 2024

---

## 🎯 Quel document utiliser ?

### 🆕 Pour créer un nouveau composant UI

| Document | Contenu |
|----------|---------|
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Couleurs, typo, spacing, touch targets |
| [UI_PATTERNS.md](./UI_PATTERNS.md) | Composants standardisés à réutiliser |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Où créer tes fichiers |

---

### 🎮 Pour créer/modifier un JEU

| Document | Contenu |
|----------|---------|
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Structure d'un jeu (`/src/games/{nom}/`) |
| [AUDIO_IMPROVEMENTS.md](./AUDIO_IMPROVEMENTS.md) | Ajouter des sons au jeu |
| [RAPPORT_VERIFICATION_MASCOTTES_COMPETENCES.md](./RAPPORT_VERIFICATION_MASCOTTES_COMPETENCES.md) | Quelle mascotte et compétences associer |
| `/Fiches Educatives/` | Spécifications pédagogiques du jeu |

---

### 🏠 Pour modifier l'écran d'ACCUEIL

| Document | Contenu |
|----------|---------|
| [UI_PATTERNS.md](./UI_PATTERNS.md) | Patterns V10 (ForestBackgroundV10, etc.) |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Couleurs V10, spacing |

---

### 🔧 Pour du REFACTORING / MAINTENANCE

| Document | Contenu |
|----------|---------|
| [GUIDELINES_AUDIT.md](./GUIDELINES_AUDIT.md) | Fichiers à corriger, conformité |
| [SYNTHESE_STANDARDISATION.md](./SYNTHESE_STANDARDISATION.md) | État de la migration |
| [UI_COMPONENTS_CATALOG.md](./UI_COMPONENTS_CATALOG.md) | Catalogue des composants existants |

---

### 🤖 Pour configurer CLAUDE

| Document | Contenu |
|----------|---------|
| [../claude.md](../claude.md) | Instructions principales pour Claude |
| [CLAUDE_CODE_RULES.md](./CLAUDE_CODE_RULES.md) | Règles spécifiques |
| [PROMPT_REFACTORING.md](./PROMPT_REFACTORING.md) | Prompts de refactoring |

---

### 📚 Pour comprendre le PROJET

| Document | Contenu |
|----------|---------|
| [../README.md](../README.md) | Vue d'ensemble rapide |
| [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) | État d'avancement global |
| [Guide_UX_UI_App_Educative.md](./Guide_UX_UI_App_Educative.md) | Philosophie UX/UI |
| [Instructions_Projet_App_Educative.md](./Instructions_Projet_App_Educative.md) | Vision globale du projet |

---

## 📋 Liste complète des documents

### Documents principaux (à la racine)

| Fichier | Description |
|---------|-------------|
| `README.md` | README principal du projet |
| `claude.md` | Instructions pour Claude AI |

### Documents dans `/docs/`

| Fichier | Description | Usage |
|---------|-------------|-------|
| `00-INDEX.md` | Ce fichier - Index de la documentation | Navigation |
| `DESIGN_SYSTEM.md` | Design system (couleurs, typo, spacing) | UI/UX |
| `PROJECT_STRUCTURE.md` | Architecture du projet | Structure |
| `UI_PATTERNS.md` | Patterns UI standardisés (V9, V10) | UI/UX |
| `UI_COMPONENTS_CATALOG.md` | Catalogue des composants | UI/UX |
| `GUIDELINES_AUDIT.md` | Audit de conformité UX | Maintenance |
| `AUDIO_IMPROVEMENTS.md` | Système audio | Audio |
| `IMPLEMENTATION_SUMMARY.md` | Résumé d'implémentation | État |
| `RAPPORT_VERIFICATION_MASCOTTES_COMPETENCES.md` | Mascottes/compétences | Pédagogie |
| `SYNTHESE_STANDARDISATION.md` | Synthèse standardisation | Maintenance |
| `Guide_UX_UI_App_Educative.md` | Guide UX/UI général | Vision |
| `Instructions_Projet_App_Educative.md` | Instructions générales | Vision |
| `CLAUDE_CODE_RULES.md` | Règles pour Claude Code | IA |
| `PROMPT_REFACTORING.md` | Prompts de refactoring | IA |

---

## 💡 Résumé rapide

```
🆕 Nouveau composant UI    → DESIGN_SYSTEM + UI_PATTERNS
🎮 Nouveau jeu             → PROJECT_STRUCTURE + Fiches Éducatives
🔊 Ajouter du son          → AUDIO_IMPROVEMENTS
🐛 Corriger un bug UX      → GUIDELINES_AUDIT
📍 Où mettre mon fichier?  → PROJECT_STRUCTURE
🎨 Quelle couleur/font?    → DESIGN_SYSTEM
🤖 Configurer Claude       → claude.md + CLAUDE_CODE_RULES
```

---

## 🔗 Liens rapides

### Design & UI
- [Couleurs](./DESIGN_SYSTEM.md#-couleurs)
- [Typographie](./DESIGN_SYSTEM.md#-typographie)
- [Espacements](./DESIGN_SYSTEM.md#-espacements)
- [Touch Targets](./DESIGN_SYSTEM.md#-accessibilité)
- [Patterns V10](./UI_PATTERNS.md#-patterns-v10---forêt-immersive)

### Structure
- [Structure d'un jeu](./PROJECT_STRUCTURE.md#srcgames---implémentation-des-jeux)
- [Composants communs](./PROJECT_STRUCTURE.md#srccomponents---composants-ui-réutilisables)
- [Theme system](./PROJECT_STRUCTURE.md#srctheme---design-system-nouveau---remplace-constants)

### État du projet
- [Jeux disponibles](./PROJECT_STRUCTURE.md#notes-importantes) (12 total, 11 disponibles)
- [Conformité UX](./GUIDELINES_AUDIT.md#-évolution-de-la-conformité) (92%)
- [Fichiers à corriger](./GUIDELINES_AUDIT.md#️-fichiers-à-corriger)

---

## ⚠️ Points importants à retenir

1. **Imports** : Utiliser `@/theme` et non `@/constants` (deprecated)
2. **Touch targets** : Minimum 64dp pour les enfants
3. **Texte** : Minimum 18pt pour le texte courant
4. **Polices** : Fredoka (titres) + Nunito (corps)
5. **Animations** : React Native Reanimated 3 avec spring physics
6. **Versions** : Préférer V10 pour les nouveaux développements

---

*Document créé - Décembre 2024*
