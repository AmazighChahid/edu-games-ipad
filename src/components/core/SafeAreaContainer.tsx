import React, { ReactNode } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Layout } from '../../constants';

interface SafeAreaContainerProps {
  children: ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export const SafeAreaContainer: React.FC<SafeAreaContainerProps> = ({
  children,
  style,
  backgroundColor = Colors.neutral.background,
  edges = ['top', 'bottom', 'left', 'right'],
}) => {
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }, style]}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
  },
});
