/**
 * CardBack Component
 * Back side of the collectible card (shown before flip)
 */

import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function CardBack() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#5B8DEE', '#E056FD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.pattern}>
          {/* Central mystery icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <View style={styles.questionMark} />
            </View>
          </View>

          {/* Corner sparkles */}
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={[
                styles.sparkle,
                i === 0 && styles.sparkleTopLeft,
                i === 1 && styles.sparkleTopRight,
                i === 2 && styles.sparkleBottomLeft,
                i === 3 && styles.sparkleBottomRight,
              ]}
            />
          ))}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pattern: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionMark: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  sparkle: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ rotate: '45deg' }],
  },
  sparkleTopLeft: {
    top: 20,
    left: 20,
  },
  sparkleTopRight: {
    top: 20,
    right: 20,
  },
  sparkleBottomLeft: {
    bottom: 20,
    left: 20,
  },
  sparkleBottomRight: {
    bottom: 20,
    right: 20,
  },
});
