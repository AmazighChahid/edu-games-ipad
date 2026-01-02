# Créer une Fiche Éducative

> **Usage** : Rédiger les 4 fichiers de documentation pédagogique d'un jeu
> **Emplacement** : `/Fiches Educatives/{XX-NomJeu}/`

---

## Protocole 3 étapes

### Étape 1 : Confirmer la lecture

```text
✅ J'ai lu : INSTRUCTIONS_PROJET.md (vision pédagogique)
✅ Exemple existant consulté : /Fiches Educatives/01-Tour de Hanoï/
✅ Jeu concerné : [nom du jeu]
```

### Étape 2 : Questions de clarification

1. Tranche d'âge cible principale ?
2. Quelle méthode de raisonnement enseigner ?
3. Quelles compétences cognitives cibler ? (3-5 parmi les 22)
4. Mascotte déjà définie ?

### Étape 3 : Plan de rédaction

```text
📋 PLAN :
1. Créer FICHE_ACTIVITE.md (règles, objectifs, UX)
2. Créer FICHE_PARENT.md (guide d'accompagnement)
3. Créer DIALOGUES_IA.md (scripts mascotte)
4. Créer SPECS_TECHNIQUES.md (architecture code)

→ ATTENDRE VALIDATION avant de rédiger
```

---

## Documents de référence

| Document | Contenu |
|----------|---------|
| `CONTEXTE/INSTRUCTIONS_PROJET.md` | Philosophie pédagogique |
| `CONTEXTE/MASCOTTES_GUIDELINES.md` | Ton et personnalité mascotte |

**Exemple complet** : `/Fiches Educatives/01-Tour de Hanoï/`

---

## Structure du dossier

```
/Fiches Educatives/{XX-NomJeu}/
├── FICHE_ACTIVITE.md      # Objectifs, règles, déroulement
├── FICHE_PARENT.md        # Guide d'accompagnement parental
├── DIALOGUES_IA.md        # Scripts mascotte par contexte
└── SPECS_TECHNIQUES.md    # Architecture et composants
```

---

## Template : FICHE_ACTIVITE.md

```markdown
# Fiche Activité — {Nom du Jeu}

## Informations générales

| Champ | Valeur |
|-------|--------|
| **Nom** | {Nom} |
| **Tranche d'âge** | {6-7 / 7-8 / 8-9 / 9-10 ans} |
| **Durée session** | {5-15 minutes} |
| **Catégorie** | {logic / memory / spatial / math / language} |
| **Mascotte** | {Nom + Emoji} |

## Objectif pédagogique

{Ce que l'enfant apprend — 2-3 phrases claires}

> **Principe** : "Apprendre à penser, pas à répondre"

## Méthode enseignée

{Le processus de réflexion que l'enfant doit intérioriser}

Exemple : "Décomposer un problème complexe en sous-problèmes simples"

## Règles du jeu

1. {Règle 1}
2. {Règle 2}
3. {Règle 3}

## Compétences cognitives

| Compétence | Comment elle est mobilisée |
|------------|---------------------------|
| `{skill_1}` | {Description} |
| `{skill_2}` | {Description} |
| `{skill_3}` | {Description} |

## Déroulement UX

### Écran 1 : Introduction
{Ce que voit l'enfant, ce que dit la mascotte}

### Écran 2 : Jeu
{Interactions disponibles, feedback}

### Écran 3 : Victoire
{Célébration, récapitulatif}

## Niveaux de difficulté

| Niveau | Âge cible | Paramètres |
|--------|-----------|------------|
| Facile | 6-7 ans | {Paramètres} |
| Moyen | 7-8 ans | {Paramètres} |
| Difficile | 9-10 ans | {Paramètres} |
```

---

## Template : FICHE_PARENT.md

```markdown
# Fiche Parent — {Nom du Jeu}

## Ce que développe cette activité

### Compétences principales

1. **{Compétence 1}** : {Explication accessible pour les parents}
2. **{Compétence 2}** : {Explication accessible pour les parents}

### Compétences transversales

- {Compétence transversale 1}
- {Compétence transversale 2}

## Comment accompagner votre enfant

### À faire

- Laissez-le chercher seul avant d'intervenir
- Valorisez l'effort, pas seulement le résultat
- Posez des questions plutôt que de donner des réponses

### À éviter

- Ne donnez pas la solution
- Ne comparez pas avec d'autres enfants
- Ne montrez pas d'impatience

## Signaux de progression

### Niveau débutant
{Comportements observés quand l'enfant découvre}

### Niveau avancé
{Comportements observés quand l'enfant maîtrise}

## Transfert vie quotidienne

{Comment appliquer ces compétences au quotidien}

## Questions à poser à votre enfant

1. "Comment as-tu trouvé la solution ?"
2. "Qu'est-ce qui t'a aidé ?"
3. "Qu'est-ce que tu ferais différemment ?"
```

---

## Template : DIALOGUES_IA.md

```markdown
# Dialogues IA — {Nom du Jeu}

## Mascotte : {Nom} {Emoji}

### Personnalité
- {Trait 1}
- {Trait 2}
- {Trait 3}

---

## Introduction

### 6-7 ans
> "{Message simple et engageant}"

### 8-10 ans
> "{Message avec plus de contexte}"

---

## Après une réussite

- "{Félicitation 1}"
- "{Félicitation 2}"
- "{Félicitation 3}"

---

## Après une erreur (JAMAIS punitif)

- "{Encouragement 1}"
- "{Encouragement 2}"

---

## Indices progressifs

### Indice 1 (léger)
> "{Oriente sans donner la réponse}"

### Indice 2 (moyen)
> "{Plus directif}"

### Indice 3 (fort)
> "{Montre presque la solution}"

---

## Inactivité (> 30s)

> "{Message pour relancer l'attention}"

---

## Victoire

### Victoire normale
> "{Célébration}"

### Victoire parfaite (sans erreur)
> "{Célébration exceptionnelle}"
```

---

## Template : SPECS_TECHNIQUES.md

```markdown
# Specs Techniques — {Nom du Jeu}

## Architecture

| Fichier | Rôle |
|---------|------|
| `use{Nom}Game.ts` | Hook principal (logique de jeu) |
| `{nom}Engine.ts` | Logique pure (sans React) |
| `levels.ts` | Configuration des niveaux |
| `assistantScripts.ts` | Scripts IA |

## Types principaux

\`\`\`typescript
interface {Nom}State {
  // État du jeu
}

interface {Nom}Level extends LevelConfig {
  // Configuration spécifique
}

interface {Nom}Move {
  // Action du joueur
}
\`\`\`

## Composants UI

| Composant | Description |
|-----------|-------------|
| `{Composant1}.tsx` | {Description} |

## Animations

| Animation | Type | Déclencheur |
|-----------|------|-------------|
| {Animation 1} | spring | {Event} |

## Sons

| Son | Déclencheur |
|-----|-------------|
| Succès | Action valide |
| Erreur | Action invalide |
| Victoire | Niveau terminé |
```

---

## Checklist

- [ ] FICHE_ACTIVITE.md complète
- [ ] FICHE_PARENT.md complète
- [ ] DIALOGUES_IA.md avec scripts par âge
- [ ] SPECS_TECHNIQUES.md avec architecture
- [ ] Méthode enseignée clairement définie
- [ ] Compétences cognitives listées (3-5)
- [ ] Ton des dialogues conforme à MASCOTTES_GUIDELINES.md

---

*Préprompt fiche éducative — Décembre 2024*
