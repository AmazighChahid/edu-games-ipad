/**
 * PageContainer - Wrapper standardisé pour toutes les pages
 *
 * Caractéristiques:
 * - SafeAreaView automatique (gère l'encoche iPad/iPhone)
 * - Padding standardisé selon le type de page
 * - Background intégré via variant
 * - ScrollView optionnel
 *
 * Usage:
 * <PageContainer variant="playful" scrollable>
 *   <YourContent />
 * </PageContainer>
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { ScreenBackground, ScreenBackgroundVariant } from './ScreenBackground';
import { theme } from '@/theme';

export interface PageContainerProps {
  children: React.ReactNode;
  variant?: ScreenBackgroundVariant;
  scrollable?: boolean;
  safeAreaEdges?: Edge[];
  showDecorations?: boolean; // Pour variant playful
  contentContainerStyle?: any;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  variant = 'neutral',
  scrollable = false,
  safeAreaEdges = ['top', 'bottom'],
  showDecorations = true,
  contentContainerStyle,
}) => {
  const content = (
    <SafeAreaView style={styles.safeArea} edges={safeAreaEdges}>
      {scrollable ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={styles.contentWrapper}>{children}</View>
      )}
    </SafeAreaView>
  );

  return (
    <ScreenBackground variant={variant} showDecorations={showDecorations}>
      {content}
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    position: 'relative',
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing[8],
  },
  contentWrapper: {
    flex: 1,
  },
});
