import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CardCollectionProps {
  collectedCards: number;
  totalCards: number;
  previewCards: { emoji: string; isUnlocked: boolean }[];
}

export const CardCollection: React.FC<CardCollectionProps> = ({
  collectedCards,
  totalCards,
  previewCards,
}) => {
  const progressPercent = (collectedCards / totalCards) * 100;

  return (
    <LinearGradient
      colors={['#F3E5F5', '#E1BEE7']}
      style={styles.container}
    >
      {/* Icône de fond */}
      <Text style={styles.bgIcon}>🏆</Text>

      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#E056FD', '#9B59B6']}
          style={styles.headerIcon}
        >
          <Text style={styles.headerIconText}>🏆</Text>
        </LinearGradient>
        <Text style={styles.headerTitle}>Ma Collection</Text>
      </View>

      {/* Aperçu des cartes */}
      <View style={styles.cardsPreview}>
        {previewCards.map((card, index) => (
          <View
            key={index}
            style={[
              styles.card,
              card.isUnlocked ? styles.cardUnlocked : styles.cardLocked,
            ]}
          >
            <Text style={styles.cardEmoji}>
              {card.isUnlocked ? card.emoji : '❓'}
            </Text>
          </View>
        ))}
      </View>

      {/* Barre de progression */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={['#E056FD', '#9B59B6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${progressPercent}%` }]}
          />
        </View>
        <Text style={styles.progressText}>
          {collectedCards} / {totalCards} cartes débloquées
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
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
  cardsPreview: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    zIndex: 2,
  },
  card: {
    width: 50,
    height: 65,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardUnlocked: {
    backgroundColor: '#FFF9F0',
    borderWidth: 2,
    borderColor: '#FFD93D',
  },
  cardLocked: {
    backgroundColor: '#E0E0E0',
    borderWidth: 2,
    borderColor: '#BDBDBD',
  },
  cardEmoji: {
    fontSize: 28,
  },
  progressContainer: {
    zIndex: 2,
  },
  progressBar: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: '#7B1FA2',
    textAlign: 'center',
  },
});
