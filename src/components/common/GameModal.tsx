/**
 * GameModal - Modale standardisée pour les jeux
 *
 * Variants:
 * - 'info': Modale d'information (règles, aide)
 * - 'choice': Modale avec choix multiples (stratégie, options)
 * - 'demo': Modale de démonstration (tutoriel)
 *
 * Caractéristiques:
 * - Design cohérent avec le Design System
 * - Animations fluides
 * - Touch targets ≥ 64dp
 * - Bouton fermeture standardisé
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { theme } from '../../theme';

export type GameModalVariant = 'info' | 'choice' | 'demo';

interface GameModalButton {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: string;
}

export interface GameModalProps {
  visible: boolean;
  onClose: () => void;
  variant?: GameModalVariant;
  title: string;
  emoji?: string;
  children?: React.ReactNode;
  buttons?: GameModalButton[];
  showCloseButton?: boolean;
}

export const GameModal: React.FC<GameModalProps> = ({
  visible,
  onClose,
  variant = 'info',
  title,
  emoji,
  children,
  buttons = [],
  showCloseButton = true,
}) => {
  const getButtonStyle = (btnVariant: 'primary' | 'secondary' | 'outline' = 'primary') => {
    switch (btnVariant) {
      case 'primary':
        return [styles.button, styles.buttonPrimary];
      case 'secondary':
        return [styles.button, styles.buttonSecondary];
      case 'outline':
        return [styles.button, styles.buttonOutline];
      default:
        return [styles.button, styles.buttonPrimary];
    }
  };

  const getButtonTextStyle = (btnVariant: 'primary' | 'secondary' | 'outline' = 'primary') => {
    switch (btnVariant) {
      case 'primary':
        return [styles.buttonText, styles.buttonTextPrimary];
      case 'secondary':
        return [styles.buttonText, styles.buttonTextSecondary];
      case 'outline':
        return [styles.buttonText, styles.buttonTextOutline];
      default:
        return [styles.buttonText, styles.buttonTextPrimary];
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(200)}
          style={[styles.modalCard, variant === 'demo' && styles.modalCardDemo]}
        >
          {/* Close button */}
          {showCloseButton && (
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          )}

          {/* Header */}
          <View style={styles.header}>
            {emoji && <Text style={styles.emoji}>{emoji}</Text>}
            <Text style={styles.title}>{title}</Text>
          </View>

          {/* Content */}
          <View style={styles.content}>{children}</View>

          {/* Buttons */}
          {buttons.length > 0 && (
            <View style={styles.buttonsContainer}>
              {buttons.map((button, index) => (
                <Pressable
                  key={index}
                  onPress={button.onPress}
                  style={getButtonStyle(button.variant)}
                >
                  {button.icon && <Text style={styles.buttonIcon}>{button.icon}</Text>}
                  <Text style={getButtonTextStyle(button.variant)}>{button.label}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[6],
  },
  modalCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing[6],
    width: '100%',
    maxWidth: 500,
    ...theme.shadows.lg,
  },
  modalCardDemo: {
    maxWidth: 600,
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing[3],
    right: theme.spacing[3],
    width: theme.touchTargets.large,
    height: theme.touchTargets.large,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: theme.colors.text.secondary,
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing[5],
  },
  emoji: {
    fontSize: 48,
    marginBottom: theme.spacing[2],
  },
  title: {
    ...theme.textStyles.h2,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  content: {
    marginBottom: theme.spacing[5],
  },
  buttonsContainer: {
    gap: theme.spacing[3],
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[5],
    borderRadius: theme.borderRadius.lg,
    minHeight: theme.touchTargets.large,
    gap: theme.spacing[2],
  },
  buttonPrimary: {
    backgroundColor: theme.colors.secondary.main,
  },
  buttonSecondary: {
    backgroundColor: theme.colors.primary.main,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.text.muted,
  },
  buttonIcon: {
    fontSize: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Nunito_600SemiBold',
  },
  buttonTextPrimary: {
    color: theme.colors.text.inverse,
  },
  buttonTextSecondary: {
    color: theme.colors.text.inverse,
  },
  buttonTextOutline: {
    color: theme.colors.text.primary,
  },
});
