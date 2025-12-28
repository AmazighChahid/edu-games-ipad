---
description: Synchroniser la documentation avec l'état actuel du code
---

# Synchronisation Documentation

## Objectif

Mettre à jour TOUS les documents d'instructions après évolutions du projet.

## Processus

### 1. Scanner le code source

```bash
# Structure actuelle des jeux
ls -la src/games/

# Composants existants
ls -la src/components/common/

# Routes actuelles
ls -la app/\(games\)/
```

### 2. Scanner la documentation

```bash
# Documents existants
ls -la docs/

# Fiches éducatives
ls -la "Fiches Educatives/"
```

### 3. Vérifications croisées

#### Registry vs Code

Vérifier que chaque jeu dans `registry.ts` a :
- [ ] Un dossier dans `/src/games/{id}/`
- [ ] Une route dans `/app/(games)/{XX-id}/`
- [ ] Un dossier dans `/Fiches Educatives/{XX-Nom}/`

#### Documentation vs Code

| Document | Vérifier |
|----------|----------|
| `PROJECT_STRUCTURE.md` | Arborescence à jour |
| `TRAME_REFERENTIEL.md` | Types et compétences à jour |
| `MASCOTTES_REGISTRY.md` | Mascottes assignées correctement |
| `UI_COMPONENTS_CATALOG.md` | Composants listés existent |
| `00-INDEX_UPDATED.md` | Liste des jeux correcte |

### 4. Rapport d'écarts

```markdown
| Document | Écarts trouvés | Corrections à faire |
|----------|---------------|---------------------|
| ... | ... | ... |
```

### 5. Actions de correction

1. Corriger les références obsolètes
2. Ajouter les nouveautés non documentées
3. Supprimer les docs de fichiers supprimés
4. Mettre à jour `00-INDEX_UPDATED.md`

## Éléments à vérifier

### Nombre de jeux

Actuellement dans le registry :
- **Disponibles** : 11
- **Coming soon** : 4
- **Total** : 15

### Compétences cognitives

22 compétences définies dans `game.types.ts` :
- planning, inhibition, working_memory, problem_solving
- perseverance, concentration, pattern_recognition, sequencing
- deductive_reasoning, patience, systematic_thinking, spatial_reasoning
- vocabulary, spelling, quantitative_reasoning, equivalence
- pre_algebra, reading_comprehension, memory, inference
- visual_reasoning, logical_thinking

### Catégories

5 catégories : `logic`, `memory`, `spatial`, `math`, `language`

## Commandes utiles

```bash
# Compter les jeux dans le registry
grep -c "status:" src/games/registry.ts

# Lister les jeux disponibles
grep -B5 "status: 'available'" src/games/registry.ts | grep "id:"

# Vérifier les imports obsolètes
grep -r "from '@/constants" src/ --include="*.tsx" --include="*.ts"

# Fiches complètes vs partielles
for d in "Fiches Educatives"/*/; do
  count=$(ls "$d"/*.md 2>/dev/null | wc -l)
  echo "$d: $count fichiers"
done
```
