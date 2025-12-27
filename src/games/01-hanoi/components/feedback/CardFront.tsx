/**
 * CardFront Component
 * Front side of the collectible card with character details
 */

import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { CollectibleCard } from '../../data/collectibleCards';
import { RARITY_CONFIG } from '../../data/collectibleCards';

interface CardFrontProps {
  card: CollectibleCard;
  isNew?: boolean;
}

export function CardFront({ card, isNew = false }: CardFrontProps) {
  const rarityConfig = RARITY_CONFIG[card.rarity];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFF9F0', '#FFE8D6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        {/* NEW Badge */}
        {isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NOUVEAU !</Text>
          </View>
        )}

        {/* Rarity Badge */}
        <View style={styles.rarityBadgeContainer}>
          <LinearGradient
            colors={rarityConfig.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.rarityBadge}
          >
            <Text style={styles.rarityText}>{rarityConfig.label}</Text>
          </LinearGradient>
        </View>

        {/* Character Emoji */}
        <Text style={styles.emoji}>{card.emoji}</Text>

        {/* Character Name */}
        <Text style={styles.name}>{card.name}</Text>

        {/* Trait */}
        <View style={styles.traitContainer}>
          <Text style={styles.traitEmoji}>{card.traitEmoji}</Text>
          <Text style={styles.traitText}>{card.trait}</Text>
        </View>

        {/* Decorative border */}
        <View style={[styles.border, { borderColor: rarityConfig.color }]} />
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
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  border: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
    borderWidth: 3,
    borderRadius: 16,
    pointerEvents: 'none',
  },
  newBadge: {
    position: 'absolute',
    top: -8,
    left: -8,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    transform: [{ rotate: '-15deg' }],
    boxShadow: '0px 4px 10px rgba(255, 107, 107, 0.4)',
    elevation: 8,
    zIndex: 10,
  },
  newBadgeText: {
    fontFamily: 'Nunito-ExtraBold',
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  rarityBadgeContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 5,
  },
  rarityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  rarityText: {
    fontFamily: 'Nunito-ExtraBold',
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  emoji: {
    fontSize: 90,
    marginVertical: 15,
  },
  name: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 20,
    fontWeight: '700',
    color: '#4A4A4A',
    textAlign: 'center',
    marginBottom: 12,
  },
  traitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(91, 141, 238, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 8,
  },
  traitEmoji: {
    fontSize: 18,
  },
  traitText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    fontWeight: '700',
    color: '#5B8DEE',
  },
});
