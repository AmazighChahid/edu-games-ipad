import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@/theme';

interface AnimatedTreeProps {
  position: 1 | 2 | 3 | 4;
}

export const AnimatedTree: React.FC<AnimatedTreeProps> = ({ position }) => {
  const getTreeStyle = () => {
    switch (position) {
      case 1:
        return {
          container: { bottom: 180, left: 30 },
          crown: { width: 70, height: 100, backgroundColor: theme.colors.home.trees.greenMid },
          trunk: { width: 16, height: 35 },
        };
      case 2:
        return {
          container: { bottom: 160, left: 90 },
          crown: { width: 50, height: 70, backgroundColor: theme.colors.home.trees.greenLight },
          trunk: { width: 12, height: 25 },
        };
      case 3:
        return {
          container: { bottom: 190, right: 50 },
          crown: { width: 60, height: 85, backgroundColor: theme.colors.home.trees.greenMid },
          trunk: { width: 14, height: 30 },
        };
      case 4:
        return {
          container: { bottom: 150, right: 100 },
          crown: { width: 45, height: 65, backgroundColor: theme.colors.home.trees.greenLight },
          trunk: { width: 10, height: 22 },
        };
    }
  };

  const treeStyle = getTreeStyle();

  return (
    <View style={[styles.tree, treeStyle.container]}>
      <View
        style={[
          styles.crown,
          {
            width: treeStyle.crown.width,
            height: treeStyle.crown.height,
            backgroundColor: treeStyle.crown.backgroundColor,
          },
        ]}
      />
      <View
        style={[
          styles.trunk,
          {
            width: treeStyle.trunk.width,
            height: treeStyle.trunk.height,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tree: {
    position: 'absolute',
    zIndex: 5,
    alignItems: 'center',
  },
  crown: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
  },
  trunk: {
    backgroundColor: theme.colors.home.trees.trunk,
    marginTop: -5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
});
