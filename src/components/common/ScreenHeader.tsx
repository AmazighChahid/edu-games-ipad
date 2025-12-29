/**
 * ScreenHeader - Composant header unifié pour toutes les pages
 *
 * Variants:
 * - 'home': Header avec avatar + nom + stats (page d'accueil enfant)
 * - 'game': Header avec titre + emoji + bouton retour (écrans de jeux)
 * - 'parent': Header sobre pour espace parents
 *
 * Respecte les guidelines UX enfant:
 * - Touch targets ≥ 64dp
 * - Animations spring au tap
 * - Feedback visuel immédiat
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { theme } from '../../theme';
import { BackButton } from './BackButton';
import { Icons } from '../../constants/icons';

// Types
export type ScreenHeaderVariant = 'home' | 'game' | 'parent';

interface BaseHeaderProps {
  variant: ScreenHeaderVariant;
  onBack?: () => void;
  showParentButton?: boolean;
  onParentPress?: () => void;
  showHelpButton?: boolean;
  onHelpPress?: () => void;
}

interface HomeHeaderProps extends BaseHeaderProps {
  variant: 'home';
  childName: string;
  avatarEmoji: string;
  level: number;
  totalStars: number;
  totalBadges: number;
  onAvatarPress?: () => void;
}

interface GameHeaderProps extends BaseHeaderProps {
  variant: 'game';
  title: string;
  emoji?: string;
}

interface ParentHeaderProps extends BaseHeaderProps {
  variant: 'parent';
  title: string;
}

export type ScreenHeaderProps = HomeHeaderProps | GameHeaderProps | ParentHeaderProps;

export const ScreenHeader: React.FC<ScreenHeaderProps> = (props) => {
  const {
    variant,
    onBack,
    showParentButton = false,
    onParentPress,
    showHelpButton = false,
    onHelpPress,
  } = props;

  // Animation values
  const backBtnScale = useSharedValue(1);
  const parentBtnScale = useSharedValue(1);
  const helpBtnScale = useSharedValue(1);
  const avatarScale = useSharedValue(1);

  // Animated styles
  const backBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backBtnScale.value }],
  }));

  const parentBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: parentBtnScale.value }],
  }));

  const helpBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: helpBtnScale.value }],
  }));

  const avatarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  // Animation handlers
  const handleBackPressIn = () => {
    backBtnScale.value = withSpring(0.95, { damping: 10, stiffness: 200 });
  };

  const handleBackPressOut = () => {
    backBtnScale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  const handleParentPressIn = () => {
    parentBtnScale.value = withSpring(0.95, { damping: 10, stiffness: 200 });
  };

  const handleParentPressOut = () => {
    parentBtnScale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  const handleHelpPressIn = () => {
    helpBtnScale.value = withSpring(0.95, { damping: 10, stiffness: 200 });
  };

  const handleHelpPressOut = () => {
    helpBtnScale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  const handleAvatarPressIn = () => {
    avatarScale.value = withSpring(0.95, { damping: 10, stiffness: 200 });
  };

  const handleAvatarPressOut = () => {
    avatarScale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  // HOME VARIANT
  if (variant === 'home') {
    const homeProps = props as HomeHeaderProps;
    return (
      <View style={styles.container}>
        {/* Profile section */}
        <View style={styles.profileSection}>
          <Pressable
            onPress={homeProps.onAvatarPress}
            onPressIn={handleAvatarPressIn}
            onPressOut={handleAvatarPressOut}
            accessible
            accessibilityLabel={`Avatar de ${homeProps.childName}, niveau ${homeProps.level}`}
            accessibilityRole="button"
          >
            <Animated.View style={[styles.avatarContainer, avatarAnimatedStyle]}>
              <View style={styles.avatar}>
                <Text style={styles.avatarEmoji}>{homeProps.avatarEmoji}</Text>
              </View>
              <View style={styles.avatarBadge}>
                <Text style={styles.avatarBadgeText}>Niv. {homeProps.level}</Text>
              </View>
            </Animated.View>
          </Pressable>

          <View style={styles.greeting}>
            <Text style={styles.greetingTitle}>
              Bonjour <Text style={styles.greetingName}>{homeProps.childName}</Text> ! 👋
            </Text>
            <Text style={styles.greetingSubtitle}>Prêt·e pour de nouvelles aventures ?</Text>

            <View style={styles.quickStats}>
              <View style={styles.statBadge}>
                <Text style={styles.statIcon}>⭐</Text>
                <Text style={styles.statText}>{homeProps.totalStars} étoiles</Text>
              </View>
              <View style={styles.statBadge}>
                <Text style={styles.statIcon}>🏆</Text>
                <Text style={styles.statText}>{homeProps.totalBadges} badges</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Parent button */}
        {showParentButton && onParentPress && (
          <Pressable
            onPress={onParentPress}
            onPressIn={handleParentPressIn}
            onPressOut={handleParentPressOut}
            accessible
            accessibilityLabel="Espace Parents"
            accessibilityRole="button"
          >
            <Animated.View style={[styles.parentBtn, parentBtnStyle]}>
              <Text style={styles.parentIcon}>👨‍👩‍👧</Text>
              <Text style={styles.parentText}>Espace Parents</Text>
            </Animated.View>
          </Pressable>
        )}
      </View>
    );
  }

  // GAME VARIANT
  if (variant === 'game') {
    const gameProps = props as GameHeaderProps;
    return (
      <View style={styles.container}>
        {/* Back button - utilise le composant BackButton standardisé */}
        {onBack && <BackButton onPress={onBack} />}

        {/* Title */}
        <View style={styles.gameTitleContainer}>
          {gameProps.emoji && <Text style={styles.gameEmoji}>{gameProps.emoji}</Text>}
          <Text style={styles.gameTitle}>{gameProps.title}</Text>
          {gameProps.emoji && <Text style={styles.gameEmoji}>✨</Text>}
        </View>

        {/* Right buttons */}
        <View style={styles.headerRightButtons}>
          {showParentButton && onParentPress && (
            <Pressable
              onPress={onParentPress}
              onPressIn={handleParentPressIn}
              onPressOut={handleParentPressOut}
              accessible
              accessibilityLabel="Fiche pédagogique de l'activité"
              accessibilityRole="button"
              accessibilityHint="Ouvre la fiche pédagogique pour les parents"
            >
              <Animated.View style={[styles.parentButtonGame, parentBtnStyle]}>
                <Text style={styles.parentButtonIcon}>{Icons.pedagogy}</Text>
                <Text style={styles.parentButtonText}>Conseil parents</Text>
              </Animated.View>
            </Pressable>
          )}

          {showHelpButton && onHelpPress && (
            <Pressable
              onPress={onHelpPress}
              onPressIn={handleHelpPressIn}
              onPressOut={handleHelpPressOut}
              accessible
              accessibilityLabel="Aide"
              accessibilityRole="button"
            >
              <Animated.View style={[styles.helpButton, helpBtnStyle]}>
                <Text style={styles.helpButtonText}>?</Text>
              </Animated.View>
            </Pressable>
          )}
        </View>
      </View>
    );
  }

  // PARENT VARIANT
  if (variant === 'parent') {
    const parentProps = props as ParentHeaderProps;
    return (
      <View style={styles.containerParent}>
        <Text style={styles.parentTitle}>{parentProps.title}</Text>
        {onBack && (
          <Pressable
            onPress={onBack}
            onPressIn={handleBackPressIn}
            onPressOut={handleBackPressOut}
            accessible
            accessibilityLabel="Retour"
            accessibilityRole="button"
          >
            <Animated.View style={[styles.backButtonParent, backBtnStyle]}>
              <Text style={styles.backButtonTextParent}>Retour</Text>
            </Animated.View>
          </Pressable>
        )}
      </View>
    );
  }

  return null;
};

// ============================================
// STYLES
// ============================================

// Couleurs spécifiques au composant
const COLORS = {
  // GAME VARIANT - Bouton Pédagogie
  pedagogyButtonBackground: '#90c695',
  pedagogyIconColor: '#26A69A',
  // GAME VARIANT - Bouton Aide
  helpButtonBackground: '#eb9532',
  helpButtonText: '#FFFFFF',
};

const styles = StyleSheet.create({
  // ============================================
  // CONTAINERS (communs à tous les variants)
  // ============================================
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: theme.spacing[8],
    paddingTop: theme.spacing[4],
    zIndex: 20,
  },
  containerParent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[4],
    marginBottom: theme.spacing[8],
  },

  // ============================================
  // HOME VARIANT - Profil & Avatar
  // ============================================
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[5],
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: theme.colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: theme.colors.background.card,
    boxShadow: '0px 6px 20px rgba(91, 141, 238, 0.3)',
    elevation: 8,
  },
  avatarEmoji: {
    fontSize: 50,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: theme.colors.feedback.success,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: theme.colors.background.card,
  },
  avatarBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.text.inverse,
    fontFamily: 'Nunito_800ExtraBold',
  },

  // ============================================
  // HOME VARIANT - Greeting & Stats
  // ============================================
  greeting: {
    gap: 4,
  },
  greetingTitle: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38.4,
    color: theme.colors.text.primary,
  },
  greetingName: {
    color: theme.colors.primary.main,
    fontFamily: 'Fredoka_700Bold',
    fontWeight: '700',
  },
  greetingSubtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 18,
    color: theme.colors.text.secondary,
  },
  quickStats: {
    flexDirection: 'row',
    gap: theme.spacing[4],
    marginTop: theme.spacing[3],
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.background.card,
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[3],
    borderRadius: theme.borderRadius.round,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  statIcon: {
    fontSize: 20,
  },
  statText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text.primary,
    fontFamily: 'Nunito_700Bold',
  },

  // ============================================
  // HOME VARIANT - Bouton Espace Parents
  // ============================================
  parentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.background.card,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.08)',
    elevation: 4,
  },
  parentIcon: {
    fontSize: 28,
  },
  parentText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text.secondary,
    fontFamily: 'Nunito_700Bold',
  },

  // ============================================
  // GAME VARIANT - Back Button
  // ============================================
  backButton: {
    width: theme.touchTargets.child,
    height: theme.touchTargets.child,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  backButtonText: {
    fontSize: 28,
    color: theme.colors.text.primary,
  },

  // ============================================
  // GAME VARIANT - Title
  // ============================================
  gameTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[5],
    borderRadius: 20,
    ...theme.shadows.md,
  },
  gameTitle: {
    ...theme.textStyles.h2,
    color: theme.colors.text.primary,
  },
  gameEmoji: {
    fontSize: 24,
  },

  // ============================================
  // GAME VARIANT - Right Buttons Container
  // ============================================
  headerRightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },

  // ============================================
  // GAME VARIANT - Bouton Pédagogie (Conseil Parents)
  // ============================================
  parentButtonGame: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    backgroundColor: COLORS.pedagogyButtonBackground,
    paddingHorizontal: theme.spacing[4],
    borderRadius: 20,
    height: 50,
    ...theme.shadows.md,
  },
  parentButtonIcon: {
    fontSize: 22,
    color: COLORS.pedagogyIconColor,
  },
  parentButtonText: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 18,
    color: theme.colors.text.secondary,
  },

  // ============================================
  // GAME VARIANT - Help Button (Aide)
  // ============================================
  helpButton: {
    width: 64,
    height: 50,
    borderRadius: 20,
    backgroundColor: COLORS.helpButtonBackground,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  helpButtonText: {
    fontSize: 28,
    color: COLORS.helpButtonText,
    fontWeight: 'bold',
  },

  // ============================================
  // PARENT VARIANT - Header sobre
  // ============================================
  parentTitle: {
    ...theme.textStyles.h1,
    color: theme.colors.text.primary,
  },
  backButtonParent: {
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.md,
    minHeight: 48,
  },
  backButtonTextParent: {
    ...theme.textStyles.button,
    color: theme.colors.primary.contrast,
  },
});
