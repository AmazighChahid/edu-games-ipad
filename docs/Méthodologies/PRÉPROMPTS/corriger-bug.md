# Corriger un Bug

> **Usage** : Fix ciblé et minimal
> **Principe** : Comprendre avant de corriger

---

## Protocole 3 étapes

### Étape 1 : Confirmer la lecture

```text
✅ J'ai lu : CLAUDE_CODE_RULES.md (règles à respecter)
✅ Bug identifié : [description du comportement observé vs attendu]
✅ Fichier(s) concerné(s) : [liste]
```

### Étape 2 : Questions de clarification

1. Le bug est-il reproductible ? (toujours / parfois / conditions spécifiques)
2. Depuis quand ? (commit récent / toujours présent)
3. Impact utilisateur ? (bloquant / gênant / mineur)
4. Y a-t-il des logs d'erreur ?

### Étape 3 : Plan de correction

```text
📋 PLAN :
1. Reproduire le bug localement
2. Identifier la cause racine (pas juste le symptôme)
3. Proposer le fix minimal
4. Vérifier les effets de bord
5. Tester la correction

→ ATTENDRE VALIDATION avant d'implémenter le fix
```

---

## Documents de référence

| Document | Quand le consulter |
|----------|-------------------|
| `CLAUDE_CODE_RULES.md` | Toujours — vérifier que le fix respecte les règles |
| `DESIGN_SYSTEM.md` | Si bug UI (couleurs, spacing, touch targets) |
| `GAME_ARCHITECTURE.md` | Si bug dans un jeu (hooks, engine) |

---

## Méthodologie de debug

### 1. Reproduire

```bash
# Lancer l'app en mode développement
npx expo start

# Observer la console pour les erreurs
```

### 2. Isoler la cause

- **Bug UI** → Vérifier les styles, props, state
- **Bug logique** → Vérifier le hook/engine du jeu
- **Bug navigation** → Vérifier les routes Expo Router
- **Bug state** → Vérifier le store Zustand

### 3. Appliquer le fix minimal

```typescript
// ❌ ÉVITER : Refactorer tout le fichier
// ❌ ÉVITER : Ajouter des features "tant qu'on y est"
// ❌ ÉVITER : Changer du code non lié au bug

// ✅ FAIRE : Corriger uniquement la ligne/fonction concernée
// ✅ FAIRE : Ajouter un commentaire si le fix n'est pas évident
// ✅ FAIRE : Vérifier les autres usages de la fonction modifiée
```

---

## Checklist avant commit

- [ ] Le bug est corrigé (testé manuellement)
- [ ] Aucune régression introduite
- [ ] Le fix respecte `CLAUDE_CODE_RULES.md`
- [ ] Pas de code mort ajouté
- [ ] Pas de `console.log` oublié
- [ ] Message de commit clair : `fix: [description courte]`

---

## Cas particuliers

### Bug bloquant (crash)

1. Priorité maximale
2. Fix temporaire acceptable si nécessaire
3. Documenter la dette technique créée

### Bug intermittent

1. Ajouter des logs temporaires pour comprendre
2. Chercher les race conditions
3. Vérifier les dépendances des `useEffect`

### Bug signalé mais non reproductible

1. Demander plus de contexte (device, version, actions)
2. Vérifier les différences iOS/Android si applicable
3. Ne pas "corriger" sans comprendre

---

*Préprompt correction bug — Décembre 2024*
