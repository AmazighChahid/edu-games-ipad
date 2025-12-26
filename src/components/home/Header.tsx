import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { theme } from '@/theme';

interface HeaderProps {
  childName: string;
  avatarEmoji: string;
  level: number;
  totalStars: number;
  totalBadges: number;
  onAvatarPress: () => void;
  onParentPress: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  childName,
  avatarEmoji,
  level,
  totalStars,
  totalBadges,
  onAvatarPress,
  onParentPress,
}) => {
  const avatarScale = useSharedValue(1);
  const parentBtnScale = useSharedValue(1);

  const avatarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  const parentBtnAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: parentBtnScale.value }],
  }));

  const handleAvatarPressIn = () => {
    avatarScale.value = withSpring(0.95, { damping: 10, stiffness: 200 });
  };

  const handleAvatarPressOut = () => {
    avatarScale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  const handleParentPressIn = () => {
    parentBtnScale.value = withSpring(0.95, { damping: 10, stiffness: 200 });
  };

  const handleParentPressOut = () => {
    parentBtnScale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  return (
    <View style={styles.container}>
      {/* Bouton Parent - À gauche (comme dans le HTML V2) */}
      <Pressable
        onPress={onParentPress}
        onPressIn={handleParentPressIn}
        onPressOut={handleParentPressOut}
        accessible
        accessibilityLabel="Espace Parents"
        accessibilityRole="button"
      >
        <Animated.View style={[styles.parentBtn, parentBtnAnimatedStyle]}>
          <LinearGradient
            colors={['#E056FD', '#9B59B6']}
            style={styles.parentIconContainer}
          >
            <Text style={styles.parentIcon}>👨‍👩‍👧</Text>
          </LinearGradient>
          <Text style={styles.parentText}>Espace Parent</Text>
        </Animated.View>
      </Pressable>

      {/* Profil enfant - Au centre */}
      <View style={styles.profileSection}>
        <Pressable
          onPress={onAvatarPress}
          onPressIn={handleAvatarPressIn}
          onPressOut={handleAvatarPressOut}
          accessible
          accessibilityLabel={`Avatar de ${childName}, niveau ${level}`}
          accessibilityRole="button"
        >
          <Animated.View style={[styles.avatarContainer, avatarAnimatedStyle]}>
            <LinearGradient
              colors={['#5B8DEE', '#E056FD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarEmoji}>{avatarEmoji}</Text>
            </LinearGradient>
            <LinearGradient
              colors={['#FFD93D', '#F5A623']}
              style={styles.avatarLevel}
            >
              <Text style={styles.avatarLevelText}>{level}</Text>
            </LinearGradient>
          </Animated.View>
        </Pressable>

        <View style={styles.greeting}>
          <Text style={styles.greetingTitle}>
            Bonjour <Text style={styles.greetingName}>{childName}</Text> ! 👋
          </Text>
          <Text style={styles.greetingSubtitle}>Prête pour une nouvelle aventure ?</Text>
        </View>
      </View>

      {/* Stats - À droite */}
      <View style={styles.headerStats}>
        <View style={styles.headerStat}>
          <Text style={styles.headerStatIcon}>⭐</Text>
          <Text style={styles.headerStatValue}>{totalStars}</Text>
        </View>
        <View style={styles.headerStat}>
          <Text style={styles.headerStatIcon}>🏆</Text>
          <Text style={styles.headerStatValue}>{totalBadges}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 20,
    zIndex: 20,
  },

  // Bouton Parent (gauche)
  parentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 4,
  },
  parentIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  parentIcon: {
    fontSize: 18,
  },
  parentText: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 14,
    fontWeight: '600',
    color: '#7A7A7A',
  },

  // Profil (centre)
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#5B8DEE',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  avatarEmoji: {
    fontSize: 44,
  },
  avatarLevel: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#F5A623',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarLevelText: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  greeting: {
    gap: 2,
  },
  greetingTitle: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 28,
    fontWeight: '700',
    color: '#4A4A4A',
  },
  greetingName: {
    color: '#5B8DEE',
    fontFamily: 'Fredoka_700Bold',
    fontWeight: '700',
  },
  greetingSubtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#7A7A7A',
  },

  // Stats (droite)
  headerStats: {
    flexDirection: 'row',
    gap: 12,
  },
  headerStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  headerStatIcon: {
    fontSize: 18,
  },
  headerStatValue: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 16,
    fontWeight: '700',
    color: '#4A4A4A',
  },
});
