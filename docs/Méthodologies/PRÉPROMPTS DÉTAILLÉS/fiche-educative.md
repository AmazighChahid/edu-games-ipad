# 📝 Création des Fiches Éducatives

> **Usage** : `fiche-educative.md <XX-NomJeu>`
> **Exemple** : `fiche-educative.md 16-Code-Secret`

---

## Documents à lire AVANT de commencer

1. `/Fiches Educatives/01-Tour de Hanoï/` — Template de référence complet
2. `INSTRUCTIONS_PROJET_APP_EDUCATIVE.md` — Vision pédagogique
3. `MASCOTTES_REGISTRY.md` — Registre des mascottes

---

## Structure à créer

Créer le dossier `/Fiches Educatives/{XX-NomJeu}/` avec **4 fichiers** :

```
Fiches Educatives/{XX-NomJeu}/
├── FICHE_ACTIVITE.md      # Objectif, règles, UX
├── FICHE_PARENT.md        # Guide d'accompagnement
├── DIALOGUES_IA.md        # Scripts mascotte
└── SPECS_TECHNIQUES.md    # Architecture, composants
```

---

## 1. FICHE_ACTIVITE.md

```markdown
# Fiche Activité — {Nom du Jeu}

## Informations générales

| Champ | Valeur |
|-------|--------|
| **Nom** | {Nom} |
| **ID** | {xx-nom-jeu} |
| **Tranche d'âge** | {6-7 / 7-8 / 8-9 / 9-10 ans} |
| **Durée session** | {5-15 minutes} |
| **Catégorie** | {logic / memory / spatial / math / language} |
| **Mascotte** | {Nom + Emoji} |

---

## Objectif pédagogique

{Ce que l'enfant apprend — 2-3 phrases claires}

---

## Méthode enseignée

{Le processus de réflexion explicité — la méthode que l'enfant doit intérioriser}

> **Principe fondateur** : « Apprendre à penser, pas à répondre »

---

## Règles du jeu

1. {Règle 1}
2. {Règle 2}
3. {Règle 3}

---

## Compétences cognitives

| Compétence | Comment elle est mobilisée |
|------------|---------------------------|
| `{skill_1}` | {Description} |
| `{skill_2}` | {Description} |
| `{skill_3}` | {Description} |

> **Compétences disponibles** : planning, inhibition, working_memory, problem_solving, perseverance, concentration, pattern_recognition, sequencing, deductive_reasoning, logical_thinking, systematic_thinking, spatial_reasoning, quantitative_reasoning, equivalence, pre_algebra, vocabulary, spelling, reading_comprehension, inference, visual_reasoning, memory, patience

---

## Déroulement UX

### Écran 1 : Introduction
- Mascotte accueille l'enfant
- Explication des règles (animée)
- Sélection du niveau

### Écran 2 : Jeu
- Zone de jeu principale
- Indicateur de progression
- Bouton indice
- Feedback en temps réel

### Écran 3 : Victoire
- Célébration (confettis)
- Stats : coups, temps, indices
- Boutons : Rejouer / Niveau suivant / Accueil

---

## Système de feedback

| Situation | Feedback |
|-----------|----------|
| **Succès** | {Animation + son + message} |
| **Erreur** | {Message encourageant, JAMAIS punitif} |
| **Indice** | {Comment l'aide est présentée} |
| **Victoire** | {Célébration complète} |

---

## Niveaux de difficulté

| Niveau | Âge cible | Paramètres | Coups optimaux |
|--------|-----------|------------|----------------|
| 1 - Facile | 6-7 ans | {Paramètres} | {N} |
| 2 - Moyen | 7-8 ans | {Paramètres} | {N} |
| 3 - Difficile | 9-10 ans | {Paramètres} | {N} |
```

---

## 2. FICHE_PARENT.md

```markdown
# Fiche Parent — {Nom du Jeu}

> Guide d'accompagnement pour les parents

---

## Ce que développe cette activité

### Compétences principales

1. **{Compétence 1}** : {Explication accessible pour les parents}
2. **{Compétence 2}** : {Explication accessible pour les parents}
3. **{Compétence 3}** : {Explication accessible pour les parents}

### Compétences transversales

- {Compétence transversale 1}
- {Compétence transversale 2}

---

## Liens avec les apprentissages scolaires

| Matière | Compétences liées |
|---------|-------------------|
| **Mathématiques** | {Liens} |
| **Français** | {Liens} |
| **Sciences** | {Liens} |

---

## Comment accompagner votre enfant

### ✅ À faire

- {Conseil positif 1}
- {Conseil positif 2}
- {Conseil positif 3}
- Valoriser l'effort, pas seulement le résultat
- Laisser l'enfant explorer à son rythme

### ❌ À éviter

- {Ce qu'il ne faut pas faire 1}
- {Ce qu'il ne faut pas faire 2}
- Donner la réponse directement
- Créer de la pression temporelle

---

## Signaux de progression

### 🌱 Niveau débutant
{Comportements observés quand l'enfant découvre}

### 🌿 Niveau intermédiaire
{Comportements observés quand l'enfant progresse}

### 🌳 Niveau avancé
{Comportements observés quand l'enfant maîtrise}

---

## Transfert vie quotidienne

{Comment appliquer ces compétences au quotidien — exemples concrets}

**Exemples d'activités complémentaires** :
- {Activité 1}
- {Activité 2}
- {Jeu de société similaire}

---

## Questions à poser à votre enfant

### Compréhension
1. « {Question pour vérifier la compréhension} »

### Stratégie
2. « {Question pour faire verbaliser la méthode} »

### Métacognition
3. « {Question pour faire réfléchir sur sa propre pensée} »

---

## FAQ Parents

**Q : Mon enfant est frustré, que faire ?**
R : {Réponse bienveillante}

**Q : Il demande toujours des indices, est-ce normal ?**
R : {Réponse pédagogique}

**Q : À quelle fréquence peut-il jouer ?**
R : {Recommandation}

---

## Résumé en 5 points

1. {Point clé 1}
2. {Point clé 2}
3. {Point clé 3}
4. {Point clé 4}
5. {Point clé 5}
```

---

## 3. DIALOGUES_IA.md

```markdown
# Dialogues IA — {Nom du Jeu}

## Mascotte : {Nom} {Emoji}

### Personnalité
- {Trait 1}
- {Trait 2}
- {Trait 3}

---

## 🎬 Avant de commencer

### 6-7 ans
> « {Message simple, phrases courtes, mots simples} »

### 8-9 ans
> « {Message avec plus de détails} »

### 9-10 ans
> « {Message avec vocabulaire enrichi} »

---

## ✅ Après une réussite

### Messages variés (rotation aléatoire)
- « {Message 1} »
- « {Message 2} »
- « {Message 3} »
- « {Message 4} »

### Série de réussites (streak)
- 3 de suite : « {Message streak 3} »
- 5 de suite : « {Message streak 5} »

---

## 💪 Après une erreur (JAMAIS punitif)

### Messages encourageants
- « {Message encourageant 1} »
- « {Message encourageant 2} »
- « {Message encourageant 3} »

### Après plusieurs erreurs sur le même problème
> « {Message de réorientation douce} »

---

## 💡 Indices progressifs

### Indice 1 (léger) — Orientation
> « {Indice qui oriente sans donner la réponse} »

### Indice 2 (moyen) — Direction
> « {Indice plus explicite} »

### Indice 3 (fort) — Presque la solution
> « {Indice qui montre presque la solution} »

---

## ⏰ Enfant bloqué (inactivité > 30s)

### Premier rappel (30s)
> « {Message doux pour relancer l'attention} »

### Deuxième rappel (60s)
> « {Proposition d'aide} »

---

## 🏆 Victoire

### Victoire normale
> « {Célébration standard} »

### Victoire parfaite (sans erreur, sans indice)
> « {Célébration exceptionnelle} »

### Victoire après difficulté (beaucoup d'erreurs)
> « {Valorisation de la persévérance} »

---

## 🔄 Retour après pause

> « {Message de bienvenue au retour} »
```

---

## 4. SPECS_TECHNIQUES.md

```markdown
# Specs Techniques — {Nom du Jeu}

## Architecture fichiers

```
src/games/{XX-nomjeu}/
├── index.ts
├── types.ts
├── components/
│   ├── index.ts
│   └── {Composant}.tsx
├── hooks/
│   ├── use{NomJeu}Game.ts
│   ├── use{NomJeu}Sound.ts
│   └── use{NomJeu}Intro.ts
├── logic/
│   └── {nomjeu}Engine.ts
├── data/
│   ├── levels.ts
│   └── assistantScripts.ts
└── screens/
    └── {NomJeu}IntroScreen.tsx
```

---

## Types spécifiques

```typescript
// types.ts

interface {NomJeu}State {
  // État du jeu
}

interface {NomJeu}Level extends LevelConfig {
  // Configuration spécifique
}

interface {NomJeu}Move {
  // Action du joueur
}
```

---

## Composants UI

| Composant | Description | Props clés |
|-----------|-------------|------------|
| `{Composant1}.tsx` | {Description} | {Props} |
| `{Composant2}.tsx` | {Description} | {Props} |

---

## Animations (Reanimated 3)

| Animation | Type | Durée | Easing |
|-----------|------|-------|--------|
| Press feedback | spring | ~300ms | default |
| Succès | timing | 500ms | easeOut |
| Erreur | sequence | 300ms | — |
| Victoire | spring | 800ms | bouncy |

---

## Sons

| Son | Fichier | Durée | Déclencheur |
|-----|---------|-------|-------------|
| Succès | `success.mp3` | <1s | Coup valide |
| Erreur | `gentle-error.mp3` | <0.5s | Coup invalide |
| Victoire | `victory.mp3` | ~2s | Niveau terminé |
| Hint | `hint.mp3` | <0.5s | Indice demandé |

---

## Configuration niveaux

```typescript
// data/levels.ts

export const levels: {NomJeu}Level[] = [
  {
    id: '{nomjeu}-level-1',
    gameId: '{nomjeu}',
    difficulty: 'easy',
    displayOrder: 1,
    targetAge: 6,
    estimatedMinutes: 3,
    optimalMoves: {N},
    // Params spécifiques
  },
  // ...
];
```

---

## Performance

- [ ] Pas de re-render inutile (`useMemo`, `useCallback`)
- [ ] Animations 60 FPS
- [ ] Bundle impact estimé : ~{XX} KB
- [ ] Chargement < 500ms

---

## Tests

- [ ] Tous les niveaux jouables
- [ ] Victoire détectée correctement
- [ ] Indices fonctionnent
- [ ] Sons jouent correctement
- [ ] Responsive iPad (landscape)
```

---

## Checklist finale

- [ ] `FICHE_ACTIVITE.md` créée et complète
- [ ] `FICHE_PARENT.md` créée et complète
- [ ] `DIALOGUES_IA.md` créée avec tous les contextes
- [ ] `SPECS_TECHNIQUES.md` créée avec architecture
- [ ] Mascotte définie et cohérente
- [ ] 3-5 compétences cognitives listées
- [ ] Dialogues adaptés par tranche d'âge
- [ ] Feedback JAMAIS punitif

---

*Préprompt fiches éducatives — Décembre 2024*
