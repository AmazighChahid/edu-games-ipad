# Sons & Effets Sonores

## Structure

```
sounds/
├── effects/          # Effets sonores courts
│   ├── tap.mp3      # Son de tap
│   ├── success.mp3  # Son de succès
│   ├── error.mp3    # Son d'erreur (doux)
│   ├── victory.mp3  # Son de victoire
│   ├── hint.mp3     # Son d'indice
│   ├── disk_place.mp3   # Disque posé (Hanoi)
│   ├── disk_select.mp3  # Disque sélectionné (Hanoi)
│   └── balance_equilibrium.mp3  # Balance équilibrée
└── music/           # Musique d'ambiance
    ├── home_theme.mp3
    └── game_theme.mp3
```

## Spécifications Audio

### Format
- **Format**: MP3 (compatibilité maximale)
- **Bitrate**: 128 kbps (équilibre qualité/taille)
- **Fréquence**: 44.1 kHz

### Caractéristiques

#### Effets Sonores (< 1 seconde)
- **tap.mp3**: Clic doux, neutre
- **success.mp3**: Tintement positif, encourageant (pas trop intense)
- **error.mp3**: Son DOUX (pas agressif), type "oups"
- **victory.mp3**: Célébration joyeuse mais pas agressive
- **hint.mp3**: Son cristallin, type "ding" lumineux

#### Effets Spécifiques aux Jeux
- **disk_place.mp3**: Son de bois léger
- **disk_select.mp3**: Son de pickup subtil
- **balance_equilibrium.mp3**: Accord harmonieux

### Principes UX Enfant
✅ Sons doux et apaisants
✅ Jamais agressifs ou stressants
✅ Volume modéré par défaut
✅ Désactivables facilement

❌ Pas de sons forts ou stridents
❌ Pas de musique en boucle forcée
❌ Pas de sons punitifs

## Sources Recommandées

### Bibliothèques Libres de Droits
- **Freesound.org**: Sons sous Creative Commons
- **Zapsplat.com**: Effets sonores gratuits
- **Incompetech.com**: Musiques libres
- **Bensound.com**: Musiques d'ambiance

### Générateurs de Sons
- **SFXR**: Générateur de sons 8-bit
- **Audacity**: Édition audio gratuite
- **GarageBand** (Mac): Création sonore simple

## Intégration Code

Les sons sont gérés par le hook `useSound` dans `/src/hooks/useSound.ts`

```typescript
import { useSound } from '@/hooks/useSound';

const { playSound } = useSound();

// Utilisation
playSound('success'); // Joue success.mp3
playSound('tap');     // Joue tap.mp3
```

## TODO
- [ ] Créer ou télécharger les fichiers MP3
- [ ] Tester volumes relatifs
- [ ] Valider avec des enfants (pas trop fort ?)
- [ ] Ajouter paramètre de désactivation dans Settings
