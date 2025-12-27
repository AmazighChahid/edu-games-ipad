import { Stack } from 'expo-router';

export default function ConteurCurieuxLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Le Conteur Curieux' }}
      />
      <Stack.Screen
        name="story"
        options={{
          title: 'Lecture',
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="questions"
        options={{
          title: 'Questions',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="victory"
        options={{
          title: 'Bravo !',
          animation: 'fade',
          gestureEnabled: false, // Empêcher le retour accidentel
        }}
      />
    </Stack>
  );
}
