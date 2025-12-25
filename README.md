# Bonjour - Application Éducative iPad

Application éducative pour enfants de 6 à 10 ans, développée en React Native (Expo), inspirée des principes Montessori.

## Fonctionnalités

- **Tour de Hanoï** : Puzzle classique avec 3 disques, glisser-déposer intuitif
- **Mascotte animée** : Personnage qui guide l'enfant
- **Zone Parent** : Protégée par calcul mathématique, suivi de progression
- **Accessibilité** : Support VoiceOver, police dyslexie optionnelle

## Installation

```bash
# Installer les dépendances
npm install

# Lancer l'application
npx expo start

# Lancer sur simulateur iPad
npx expo start --ios
```

## Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── core/           # Boutons, conteneurs
│   ├── assistant/      # Mascotte et bulles de dialogue
│   ├── feedback/       # Confettis, animations
│   └── parental/       # Porte parentale
├── screens/            # Écrans principaux
├── games/              # Modules de jeux
│   └── tower-of-hanoi/ # Tour de Hanoï
│       ├── components/ # Composants du jeu
│       └── logic/      # Règles et moteur de jeu
├── navigation/         # Configuration navigation
├── store/              # État global (Zustand)
├── constants/          # Design system (couleurs, typo)
└── hooks/              # Hooks personnalisés
```

## Ajouter une Nouvelle Activité

1. Créer un dossier dans `src/games/` (ex: `tangram/`)
2. Implémenter l'écran principal et la logique du jeu
3. Ajouter une entrée dans `src/navigation/MainNavigator.tsx`
4. Ajouter une icône sur `HomeScreen.tsx`

## Technologies

- **Expo SDK 54** : Framework React Native
- **TypeScript** : Typage statique
- **Zustand** : Gestion d'état
- **React Navigation** : Navigation
- **Reanimated** : Animations 60fps
- **Gesture Handler** : Gestes tactiles

## Design

Palette Montessori avec tons doux et naturels :
- Fond : `#FBF9F7` (blanc chaud)
- Primaire : `#7EB5A6` (vert sauge)
- Accent : `#F5C89A` (pêche)

## Licence

Projet éducatif privé.
