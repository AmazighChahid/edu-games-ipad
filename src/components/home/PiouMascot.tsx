import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';

interface PiouMascotProps {
  message: string;
  highlightText?: string;
  buttonText: string;
  onButtonPress: () => void;
}

export const PiouMascot: React.FC<PiouMascotProps> = ({
  message,
  highlightText,
  buttonText,
  onButtonPress,
}) => {
  const bounceY = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    // Animation de rebond pour Piou
    bounceY.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const piouAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleButtonPressIn = () => {
    buttonScale.value = withSpring(0.95, { damping: 10, stiffness: 200 });
  };

  const handleButtonPressOut = () => {
    buttonScale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  // Parse message pour mettre en surbrillance le texte spécifié
  const renderMessage = () => {
    if (!highlightText) {
      return <Text style={styles.messageText}>{message}</Text>;
    }

    const parts = message.split(highlightText);
    return (
      <Text style={styles.messageText}>
        {parts[0]}
        <Text style={styles.messageHighlight}>{highlightText}</Text>
        {parts[1]}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      {/* Icône de fond */}
      <Text style={styles.bgIcon}>🐦</Text>

      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#5B8DEE', '#3F51B5']}
          style={styles.headerIcon}
        >
          <Text style={styles.headerIconText}>✨</Text>
        </LinearGradient>
        <Text style={styles.headerTitle}>Piou te conseille</Text>
      </View>

      {/* Contenu avec Piou */}
      <View style={styles.content}>
        {/* Avatar Piou animé */}
        <Animated.View style={[styles.piouAvatar, piouAnimatedStyle]}>
          <View style={styles.piouBody}>
            <View style={styles.piouBelly} />
            <View style={[styles.piouEye, styles.piouEyeLeft]}>
              <View style={styles.piouPupil} />
            </View>
            <View style={[styles.piouEye, styles.piouEyeRight]}>
              <View style={styles.piouPupil} />
            </View>
            <View style={styles.piouBeak} />
          </View>
        </Animated.View>

        {/* Message */}
        <View style={styles.messageContainer}>
          {renderMessage()}

          {/* Bouton CTA */}
          <Pressable
            onPress={onButtonPress}
            onPressIn={handleButtonPressIn}
            onPressOut={handleButtonPressOut}
            accessible
            accessibilityLabel={buttonText}
            accessibilityRole="button"
          >
            <Animated.View style={buttonAnimatedStyle}>
              <LinearGradient
                colors={['#5B8DEE', '#3F51B5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.button}
              >
                <Text style={styles.buttonIcon}>🚀</Text>
                <Text style={styles.buttonText}>{buttonText}</Text>
              </LinearGradient>
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 3,
    borderColor: '#5B8DEE',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
    // Fond dégradé bleu clair
    // Note: LinearGradient ne peut pas être utilisé comme background direct en RN
  },
  bgIcon: {
    position: 'absolute',
    right: -15,
    bottom: -15,
    fontSize: 100,
    opacity: 0.08,
    transform: [{ rotate: '-15deg' }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
    zIndex: 2,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconText: {
    fontSize: 18,
  },
  headerTitle: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: '#4A4A4A',
  },
  content: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
    zIndex: 2,
  },

  // Piou mascotte
  piouAvatar: {
    width: 60,
    height: 70,
    flexShrink: 0,
  },
  piouBody: {
    width: 60,
    height: 70,
    backgroundColor: '#8B6914',
    borderRadius: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    position: 'relative',
  },
  piouBelly: {
    position: 'absolute',
    bottom: 8,
    left: 11,
    width: 38,
    height: 32,
    backgroundColor: '#F5DEB3',
    borderRadius: 19,
  },
  piouEye: {
    position: 'absolute',
    top: 15,
    width: 18,
    height: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 9,
  },
  piouEyeLeft: {
    left: 8,
  },
  piouEyeRight: {
    right: 8,
  },
  piouPupil: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 10,
    height: 10,
    backgroundColor: '#2C1810',
    borderRadius: 5,
  },
  piouBeak: {
    position: 'absolute',
    top: 32,
    left: 23,
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 11,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFB347',
  },

  // Message
  messageContainer: {
    flex: 1,
  },
  messageText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#1565C0',
    lineHeight: 20,
    marginBottom: 10,
  },
  messageHighlight: {
    fontFamily: 'Nunito_700Bold',
    fontWeight: '700',
    color: '#5B8DEE',
  },

  // Bouton
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#5B8DEE',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 4,
  },
  buttonIcon: {
    fontSize: 14,
  },
  buttonText: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
