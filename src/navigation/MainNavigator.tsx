/**
 * Navigateur principal (enfant)
 */

import React, { Suspense, lazy } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, ParentZoneScreen } from '../screens';
import { MainStackParamList } from './types';
import { Colors } from '../constants';

// Lazy loading du jeu pour optimiser le chargement initial
const TowerOfHanoiScreen = lazy(() =>
  import('../games/tower-of-hanoi/TowerOfHanoiScreen').then((module) => ({
    default: module.TowerOfHanoiScreen,
  }))
);

const Stack = createNativeStackNavigator<MainStackParamList>();

// Composant de chargement
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.neutral.background }}>
    <ActivityIndicator size="large" color={Colors.primary.medium} />
  </View>
);

// Wrapper pour le lazy loading
const TowerOfHanoiWrapper = () => (
  <Suspense fallback={<LoadingScreen />}>
    <TowerOfHanoiScreen />
  </Suspense>
);

export const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: Colors.neutral.background },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="TowerOfHanoi"
        component={TowerOfHanoiWrapper}
      />
      <Stack.Screen
        name="ParentZone"
        component={ParentZoneScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
};
