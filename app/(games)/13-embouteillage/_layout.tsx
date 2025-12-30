import { Stack } from 'expo-router';

export default function EmbouteillageLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    />
  );
}
