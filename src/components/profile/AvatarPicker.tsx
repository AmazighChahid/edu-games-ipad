/**
 * AvatarPicker - Grid of emoji avatars for profile creation
 * Child-friendly design with large touch targets
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Avatars emoji enfants-friendly
export const AVATAR_OPTIONS = [
  '🦊', // Renard
  '🐻', // Ours
  '🦁', // Lion
  '🐰', // Lapin
  '🐶', // Chien
  '🐱', // Chat
  '🦉', // Hibou
  '🦄', // Licorne
  '🐲', // Dragon
  '🧙', // Magicien
  '🧚', // Fée
  '🐼', // Panda
] as const;

interface AvatarPickerProps {
  selectedAvatar: string | null;
  onSelect: (avatar: string) => void;
}

interface AvatarItemProps {
  emoji: string;
  isSelected: boolean;
  onPress: () => void;
}

const AvatarItem = memo(({ emoji, isSelected, onPress }: AvatarItemProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.avatarItem,
        isSelected && styles.avatarItemSelected,
        animatedStyle,
      ]}
    >
      <Text style={styles.avatarEmoji}>{emoji}</Text>
      {isSelected && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </AnimatedPressable>
  );
});

AvatarItem.displayName = 'AvatarItem';

export const AvatarPicker = memo(({ selectedAvatar, onSelect }: AvatarPickerProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choisis ton avatar</Text>
      <View style={styles.grid}>
        {AVATAR_OPTIONS.map((emoji) => (
          <AvatarItem
            key={emoji}
            emoji={emoji}
            isSelected={selectedAvatar === emoji}
            onPress={() => onSelect(emoji)}
          />
        ))}
      </View>
    </View>
  );
});

AvatarPicker.displayName = 'AvatarPicker';

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3436',
    textAlign: 'center',
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  avatarItem: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarItemSelected: {
    borderColor: '#5B8DEE',
    backgroundColor: '#EBF3FF',
  },
  avatarEmoji: {
    fontSize: 40,
  },
  checkmark: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#5B8DEE',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
