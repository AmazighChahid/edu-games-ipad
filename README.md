<<<<<<< HEAD
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
=======
# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
>>>>>>> 135019e12a7a2fddb6c8824047e00ef021f1f91a
