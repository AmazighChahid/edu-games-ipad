/**
 * Matrices Magiques - Coming Soon Screen
 * Raven-style matrix reasoning game for children 7-10 years old
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, BounceIn } from 'react-native-reanimated';

export default function MatricesMagiquesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
        {/* Back button */}
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>{'<'} Retour</Text>
        </Pressable>

        {/* Main content */}
        <View style={styles.centerContent}>
          <Animated.Text
            style={styles.emoji}
            entering={BounceIn.delay(200)}
          >
            🔮
          </Animated.Text>

          <Animated.Text
            style={styles.title}
            entering={FadeIn.delay(400)}
          >
            Matrices Magiques
          </Animated.Text>

          <Animated.View
            style={styles.badge}
            entering={FadeIn.delay(600)}
          >
            <Text style={styles.badgeText}>BIENTÔT DISPONIBLE</Text>
          </Animated.View>

          <Animated.Text
            style={styles.description}
            entering={FadeIn.delay(800)}
          >
            Découvre les motifs cachés et complète les matrices magiques !
            Un jeu de raisonnement visuel pour les petits génies.
          </Animated.Text>

          <Animated.View
            style={styles.features}
            entering={FadeIn.delay(1000)}
          >
            <Text style={styles.featureItem}>✨ Puzzles progressifs</Text>
            <Text style={styles.featureItem}>🎨 5 mondes thématiques</Text>
            <Text style={styles.featureItem}>🏆 Badges à collectionner</Text>
            <Text style={styles.featureItem}>🦉 Guidé par Pixel le Hibou</Text>
          </Animated.View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#FFD93D',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  badgeText: {
    color: '#2D3748',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 320,
  },
  features: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  featureItem: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
