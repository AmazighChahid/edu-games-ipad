/**
 * Types de navigation
 */

import { NavigatorScreenParams } from '@react-navigation/native';

// Stack principal (enfant)
export type MainStackParamList = {
  Home: undefined;
  TowerOfHanoi: undefined;
  ParentZone: undefined;
};

// Stack parent (protégé)
export type ParentStackParamList = {
  ParentDashboard: undefined;
  Settings: undefined;
  Progress: undefined;
};

// Root stack
export type RootStackParamList = {
  Main: NavigatorScreenParams<MainStackParamList>;
  Parent: NavigatorScreenParams<ParentStackParamList>;
};

// Déclaration pour typage global de la navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
