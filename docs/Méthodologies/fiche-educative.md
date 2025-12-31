---
description: Créer les 4 fiches éducatives pour un jeu
argument-hint: <XX-NomJeu>
---

# Création des Fiches Éducatives : $ARGUMENTS

## Documents de référence

CHARGER ces documents :

1. `@Fiches Educatives/01-Tour de Hanoï/` — Template de référence
2. `@docs/INSTRUCTIONS_PROJET_APP_EDUCATIVE.md` — Vision pédagogique
3. `@docs/MASCOTTES_REGISTRY.md` — Registre mascottes

## Structure à créer

Créer le dossier `/Fiches Educatives/$ARGUMENTS/` avec 4 fichiers :

### 1. FICHE_ACTIVITE.md

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

## Méthode enseignée

{Le processus de réflexion explicité — la méthode que l'enfant doit intérioriser}

> Principe : "Apprendre à penser, pas à répondre"

## Règles du jeu

1. {Règle 1}
2. {Règle 2}
3. {Règle 3}

## Compétences cognitives

| Compétence | Description |
|------------|-------------|
| `{skill_1}` | {Comment elle est mobilisée} |
| `{skill_2}` | {Comment elle est mobilisée} |
| `{skill_3}` | {Comment elle est mobilisée} |

## Déroulement UX

### Écran 1 : Introduction
{Description de l'écran d'intro}

### Écran 2 : Jeu
{Description de l'écran principal}

### Écran 3 : Victoire
{Description de l'écran de victoire}

## Système de feedback

| Situation | Feedback |
|-----------|----------|
| Succès | {Réaction visuelle/sonore} |
| Erreur | {Message encourageant, jamais punitif} |
| Indice | {Comment l'aide est présentée} |
| Victoire | {Célébration} |

## Niveaux de difficulté

| Niveau | Âge cible | Paramètres |
|--------|-----------|------------|
| Facile | 6-7 ans | {Paramètres} |
| Moyen | 7-8 ans | {Paramètres} |
| Difficile | 9-10 ans | {Paramètres} |
```

### 2. FICHE_PARENT.md

```markdown
# Fiche Parent — {Nom du Jeu}

## Ce que développe cette activité

### Compétences principales

1. **{Compétence 1}** : {Explication accessible pour les parents}
2. **{Compétence 2}** : {Explication accessible pour les parents}
3. **{Compétence 3}** : {Explication accessible pour les parents}

### Compétences transversales

- {Compétence transversale 1}
- {Compétence transversale 2}

## Comment accompagner votre enfant

### À faire

- {Conseil positif 1}
- {Conseil positif 2}
- {Conseil positif 3}

### À éviter

- {Ce qu'il ne faut pas faire 1}
- {Ce qu'il ne faut pas faire 2}

## Signaux de progression

### Niveau débutant
{Comportements observés quand l'enfant découvre}

### Niveau intermédiaire
{Comportements observés quand l'enfant progresse}

### Niveau avancé
{Comportements observés quand l'enfant maîtrise}

## Transfert vie quotidienne

{Comment appliquer ces compétences au quotidien — exemples concrets}

## Questions à poser à votre enfant

1. "{Question pour faire verbaliser la méthode}"
2. "{Question pour faire réfléchir}"
3. "{Question pour valoriser l'effort}"
```

### 3. DIALOGUES_IA.md

```markdown
# Dialogues IA — {Nom du Jeu}

## Mascotte : {Nom} {Emoji}

### Personnalité
- {Trait 1}
- {Trait 2}
- {Trait 3}

---

## Avant de commencer

### 6-7 ans
> "{Message simple et court}"

### 8-9 ans
> "{Message avec plus de détails}"

### 9-10 ans
> "{Message avec vocabulaire enrichi}"

---

## Après une réussite

### Messages variés
- "{Message 1}"
- "{Message 2}"
- "{Message 3}"

---

## Après une erreur (JAMAIS punitif)

### Messages encourageants
- "{Message encourageant 1}"
- "{Message encourageant 2}"
- "{Message encourageant 3}"

---

## Indices progressifs

### Indice 1 (léger)
> "{Indice qui oriente sans donner la réponse}"

### Indice 2 (moyen)
> "{Indice plus explicite}"

### Indice 3 (fort)
> "{Indice qui montre presque la solution}"

---

## Enfant bloqué (inactivité > 30s)

> "{Message pour relancer l'attention}"

---

## Victoire

### Victoire normale
> "{Célébration}"

### Victoire sans erreur
> "{Célébration exceptionnelle}"

### Victoire après difficulté
> "{Valorisation de la persévérance}"
```

### 4. SPECS_TECHNIQUES.md

```markdown
# Specs Techniques — {Nom du Jeu}

## Architecture

### Fichiers principaux

| Fichier | Rôle |
|---------|------|
| `use{Nom}Game.ts` | Hook principal |
| `{nom}Engine.ts` | Logique pure |
| `levels.ts` | Configuration niveaux |
| `assistantScripts.ts` | Scripts IA |

### Types spécifiques

```typescript
// types.ts
interface {Nom}State {
  // État du jeu
}

interface {Nom}Level extends LevelConfig {
  // Configuration spécifique
}
```

## Composants UI

| Composant | Description |
|-----------|-------------|
| `{Composant1}.tsx` | {Description} |
| `{Composant2}.tsx` | {Description} |

## Animations (Reanimated 3)

| Animation | Type | Durée | Easing |
|-----------|------|-------|--------|
| {Animation 1} | spring | ~300ms | default |
| {Animation 2} | timing | 200ms | easeOut |

## Sons

| Son | Fichier | Durée | Déclencheur |
|-----|---------|-------|-------------|
| Succès | `success.mp3` | <1s | Coup valide |
| Erreur | `error.mp3` | <0.5s | Coup invalide |
| Victoire | `victory.mp3` | ~2s | Niveau terminé |

## Performance

- Pas de re-render inutile (useMemo, useCallback)
- Animations 60 FPS
- Bundle impact : ~XX KB
```

## Checklist

- [ ] FICHE_ACTIVITE.md créée
- [ ] FICHE_PARENT.md créée
- [ ] DIALOGUES_IA.md créée
- [ ] SPECS_TECHNIQUES.md créée
- [ ] Mascotte définie
- [ ] Compétences listées (3-5)
- [ ] Dialogues par tranche d'âge
