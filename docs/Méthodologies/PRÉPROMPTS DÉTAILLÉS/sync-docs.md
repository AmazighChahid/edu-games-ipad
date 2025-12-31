# 🔄 Synchronisation Documentation

> **Usage** : Mettre à jour la documentation après évolutions du projet
> **Objectif** : Garantir la cohérence entre code et documentation

---

## Principe fondamental

> **Une source de vérité par type d'info**

| Type d'info | Source de vérité | Les autres docs pointent vers |
|-------------|------------------|-------------------------------|
| Liste des jeux | `src/games/registry.ts` | Référence |
| Composants | `src/components/common/index.ts` | Référence |
| Types | `src/types/game.types.ts` | Référence |
| Tokens design | `DESIGN_SYSTEM.md` | — |
| Règles code | `CLAUDE_CODE_RULES.md` | — |
| Mascottes | `MASCOTTES_REGISTRY.md` | — |

---

## Processus de synchronisation

### Étape 1 : Scanner le code source

```bash
# Structure actuelle des jeux
ls -la src/games/

# Nombre de jeux dans registry
grep -c "id:" src/games/registry.ts

# Jeux disponibles vs coming_soon
grep "status:" src/games/registry.ts | sort | uniq -c

# Composants existants
ls -la src/components/common/

# Routes actuelles
ls -la app/\(games\)/
```

### Étape 2 : Scanner la documentation

```bash
# Documents existants
ls -la docs/Méthodologies/

# Fiches éducatives
ls -la "Fiches Educatives/"

# Compter les fiches par jeu
for d in "Fiches Educatives"/*/; do
  count=$(ls "$d"/*.md 2>/dev/null | wc -l)
  echo "$d: $count fichiers"
done
```

### Étape 3 : Vérifications croisées

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
| `MASCOTTES_REGISTRY.md` | Mascottes correspondent au code |
| `UI_COMPONENTS_CATALOG.md` | Composants listés existent |
| `00-INDEX.md` | Liste des jeux correcte |
| `ROADMAP_ACTIVITES.md` | Statuts des jeux à jour |

---

### Étape 4 : Rapport d'écarts

```markdown
| Document | Écarts trouvés | Corrections à faire |
|----------|---------------|---------------------|
| `00-INDEX.md` | Liste 15 jeux, registry en a 16 | Ajouter nouveau jeu |
| `MASCOTTES_REGISTRY.md` | Mascotte X non assignée | Assigner mascotte |
| `UI_COMPONENTS_CATALOG.md` | Composant Y non documenté | Ajouter documentation |
```

---

### Étape 5 : Actions de correction

1. **Corriger les références obsolètes**
   - Chemins de fichiers
   - Noms de composants
   - Imports

2. **Ajouter les nouveautés non documentées**
   - Nouveaux jeux
   - Nouveaux composants
   - Nouvelles fonctionnalités

3. **Supprimer les références à des fichiers supprimés**
   - Composants retirés
   - Jeux abandonnés

4. **Mettre à jour les compteurs**
   - Nombre de jeux
   - Nombre de composants
   - Nombre d'icônes

---

## Éléments à vérifier systématiquement

### Nombre de jeux

```bash
# Dans le registry
grep -c "id:" src/games/registry.ts

# Jeux disponibles
grep -c "status: 'available'" src/games/registry.ts

# Jeux coming_soon
grep -c "status: 'coming_soon'" src/games/registry.ts
```

**Mettre à jour dans** :
- `00-INDEX.md` (section jeux)
- `ROADMAP_ACTIVITES.md` (si statut change)
- `claude.md` (tableau récapitulatif)

### Compétences cognitives

Source : `src/types/game.types.ts`

```typescript
type CognitiveSkill =
  | 'planning' | 'inhibition' | 'working_memory' | 'problem_solving'
  | 'perseverance' | 'concentration' | 'pattern_recognition' | 'sequencing'
  | 'deductive_reasoning' | 'patience' | 'systematic_thinking' | 'spatial_reasoning'
  | 'vocabulary' | 'spelling' | 'quantitative_reasoning' | 'equivalence'
  | 'pre_algebra' | 'reading_comprehension' | 'memory' | 'inference'
  | 'visual_reasoning' | 'logical_thinking';
```

**Total** : 22 compétences

### Catégories

```typescript
type GameCategory = 'logic' | 'memory' | 'spatial' | 'math' | 'language';
```

**Total** : 5 catégories

### Composants common/

```bash
# Lister les exports
grep "export" src/components/common/index.ts | wc -l
```

**Mettre à jour dans** :
- `UI_COMPONENTS_CATALOG.md`
- `CLAUDE_CODE_RULES.md` (liste des composants interdits à recréer)

---

## Commandes utiles complètes

```bash
# === JEUX ===

# Compter les jeux dans le registry
grep -c "id:" src/games/registry.ts

# Lister les IDs des jeux
grep "id:" src/games/registry.ts

# Lister les jeux disponibles
grep -B5 "status: 'available'" src/games/registry.ts | grep "id:"

# Vérifier les routes existantes
ls -la app/\(games\)/

# === COMPOSANTS ===

# Lister les composants common
ls src/components/common/*.tsx | wc -l

# Vérifier les exports
grep "export {" src/components/common/index.ts

# === FICHES ===

# Fiches complètes vs partielles
for d in "Fiches Educatives"/*/; do
  count=$(ls "$d"/*.md 2>/dev/null | wc -l)
  status="⚠️ Partiel"
  if [ "$count" -ge 4 ]; then
    status="✅ Complet"
  fi
  echo "$status $d: $count fichiers"
done

# === IMPORTS ===

# Vérifier les imports obsolètes
grep -r "from '@/constants" src/ --include="*.tsx" --include="*.ts"

# === MASCOTTES ===

# Vérifier les mascottes dans le code
grep -r "MascotOwl\|MascotRobot\|MascotBubble" src/games/ --include="*.tsx" | head -20
```

---

## Template de rapport de synchronisation

```markdown
# Rapport Sync Documentation — {Date}

## Résumé

| Métrique | Docs | Code | Écart |
|----------|------|------|-------|
| Jeux total | {N} | {N} | {+/-N} |
| Jeux disponibles | {N} | {N} | {+/-N} |
| Composants | {N} | {N} | {+/-N} |
| Fiches complètes | {N} | — | — |

## Écarts détectés

| Document | Problème | Action |
|----------|----------|--------|
| {Doc} | {Problème} | {Action} |

## Corrections effectuées

1. ✅ {Correction 1}
2. ✅ {Correction 2}

## À faire (non urgent)

- [ ] {Tâche 1}
- [ ] {Tâche 2}
```

---

## Fréquence recommandée

| Déclencheur | Action |
|-------------|--------|
| Ajout d'un nouveau jeu | Sync complète |
| Ajout d'un composant | Sync `UI_COMPONENTS_CATALOG.md` |
| Fin de sprint | Sync complète |
| Avant release | Sync complète + audit |

---

*Préprompt synchronisation — Décembre 2024*
