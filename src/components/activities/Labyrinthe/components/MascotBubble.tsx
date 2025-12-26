import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  message: string;
  visible?: boolean;
  position?: 'top' | 'bottom';
  autoHide?: number;
  onDismiss?: () => void;
}

export const MascotBubble: React.FC<Props> = ({
  message,
  visible = true,
  position = 'top',
  autoHide,
  onDismiss,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible && message) {
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, {
        damping: 12,
        stiffness: 200,
      });

      if (autoHide && onDismiss) {
        const timer = setTimeout(onDismiss, autoHide);
        return () => clearTimeout(timer);
      }
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withSpring(0);
    }
  }, [visible, message]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const bubbleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!visible || !message) return null;

  return (
    <Animated.View
      style={[styles.container, position === 'bottom' && styles.containerBottom, containerAnimatedStyle]}
    >
      <View style={styles.mascotContainer}>
        <Text style={styles.mascot}>🐿️</Text>
        <View style={styles.nameTag}>
          <Text style={styles.nameText}>Noisette</Text>
        </View>
      </View>

      <Animated.View style={[styles.bubble, bubbleAnimatedStyle]}>
        <Text style={styles.message}>{message}</Text>
        <View style={[styles.arrow, position === 'bottom' && styles.arrowBottom]} />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 80,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    zIndex: 100,
  },
  containerBottom: {
    top: 'auto',
    bottom: 100,
  },
  mascotContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  mascot: {
    fontSize: 60,
    marginBottom: 4,
  },
  nameTag: {
    backgroundColor: '#FFB347',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  nameText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
  },
  bubble: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    minHeight: 60,
    justifyContent: 'center',
  },
  message: {
    fontSize: 18,
    color: '#2D3748',
    lineHeight: 25,
    fontWeight: '500',
  },
  arrow: {
    position: 'absolute',
    bottom: 20,
    left: -10,
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderRightWidth: 15,
    borderBottomWidth: 10,
    borderTopColor: 'transparent',
    borderRightColor: '#FFFFFF',
    borderBottomColor: 'transparent',
  },
  arrowBottom: {
    bottom: 'auto',
    top: 20,
  },
});
