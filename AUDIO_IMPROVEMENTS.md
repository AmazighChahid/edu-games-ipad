# Améliorations Audio - Tour de Hanoï

## Modifications effectuées

### 1. Hook useSound créé
- **Fichier**: `src/hooks/useSound.ts`
- Gère les effets sonores via expo-av
- Respecte les préférences utilisateur (soundEnabled)
- Prend en charge 5 types de sons :
  - `disk_move` : Déplacement de disque
  - `disk_error` : Mouvement invalide
  - `disk_place` : Placement réussi
  - `victory` : Victoire
  - `hint` : Indice

### 2. Fichiers audio créés
- **Répertoire**: `assets/sounds/`
- Fichiers MP3 générés avec ffmpeg (sons temporaires)
- À remplacer par de vrais sons si souhaité

### 3. Intégration dans le jeu Hanoi
- **Fichier**: `src/games/hanoi/hooks/useHanoiGame.ts`
- Sons ajoutés pour :
  - ✅ Placement de disque valide (`disk_place`)
  - ❌ Tentative de mouvement invalide (`disk_error`)
  - 🎉 Victoire (`victory`)

## Message d'erreur

Le message "Grand sur petit : interdit" est déjà affiché comme un message de chat via le composant `AssistantBubble`. Il apparaît en bas de l'écran avec :
- Un avatar emoji (🤔 pour "thinking")
- Une bulle de dialogue avec le message
- Animation d'apparition fluide
- Disparition automatique après 2,5 secondes

Ce style de message est beaucoup plus convivial qu'un popup d'alerte standard !

## Sons utilisés

| Événement | Son | Volume | Durée |
|-----------|-----|--------|-------|
| Placement valide | Bip aigu (1000Hz) | 60% | 0.08s |
| Mouvement invalide | Bip grave (400Hz) | 50% | 0.15s |
| Victoire | Ton continu (600Hz) | 70% | 0.5s |

## Contrôle utilisateur

Les sons peuvent être désactivés via :
- Paramètres du jeu (modal Settings)
- Paramètres parent (app/(parent)/settings.tsx)
- Toggle "Effets sonores"
