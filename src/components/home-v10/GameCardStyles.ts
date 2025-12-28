/**
 * GameCardStyles - Styles pour les cartes de jeu V10
 * Extrait de GameCardV10.tsx pour améliorer la maintenabilité
 */

import { StyleSheet } from 'react-native';
import { fontFamily } from '../../theme/typography';

// ========================================
// CONSTANTES DE DIMENSION (source unique de vérité)
// ========================================
export const CARD_WIDTH = 520;
export const CARD_HEIGHT = 300;
export const CARD_GAP = 24;
export const CARD_BORDER_RADIUS = 28;
export const PARALLAX_FACTOR = 0.075;

// Touch target minimum pour enfants (guidelines)
export const TOUCH_TARGET_CHILD = 64;

export const styles = StyleSheet.create({
  // ========================================
  // CONTAINER PRINCIPAL
  // ========================================
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: CARD_BORDER_RADIUS,
    overflow: 'hidden',
    boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
    elevation: 8,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },

  // ========================================
  // HEADER
  // ========================================
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 2,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontFamily: fontFamily.title,
    fontSize: 28,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  titleLight: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  titleDark: {
    color: '#333333',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // ========================================
  // PROGRESS BAR
  // ========================================
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  progressIndicator: {
    width: 20,
    height: 12,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  progressSegment: {
    width: 28,
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 5,
  },
  progressSegmentFilled: {
    backgroundColor: '#FFFFFF',
  },

  // ========================================
  // ACTION BUTTONS
  // ========================================
  actions: {
    flexDirection: 'column',
    gap: 10,
  },
  actionButtonPressable: {
    // Zone de touche étendue
    minWidth: TOUCH_TARGET_CHILD,
    minHeight: TOUCH_TARGET_CHILD,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    width: TOUCH_TARGET_CHILD,
    height: TOUCH_TARGET_CHILD,
    backgroundColor: '#FFFFFF',
    borderRadius: TOUCH_TARGET_CHILD / 2,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },

  // ========================================
  // ILLUSTRATION WRAPPER
  // ========================================
  illustrationWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  parallaxContainer: {
    left: -80,
    right: -80,
    top: -20,
    width: 680, // CARD_WIDTH (520) + 160
  },

  // ========================================
  // BADGES (Médaille & Catégorie)
  // ========================================
  badgesContainer: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 3,
  },
  medalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  iconWrapper: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medalIcon: {
    fontSize: 18,
  },
  medalLabel: {
    fontFamily: fontFamily.title,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryIcon: {
    fontSize: 16,
    lineHeight: 20,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  categoryLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // ========================================
  // COMING SOON OVERLAY
  // ========================================
  comingSoonOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  comingSoonBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 30,
    transform: [{ rotate: '-8deg' }],
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.25)',
    elevation: 6,
  },
  comingSoonText: {
    fontFamily: fontFamily.title,
    fontSize: 24,
    fontWeight: '800',
    color: '#666666',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
});

// ========================================
// STYLES POUR LES ILLUSTRATIONS
// ========================================
export const illustrationStyles = StyleSheet.create({
  // Container générique
  illustrationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Containers spécifiques par jeu
  fuseauxContainer: {
    position: 'absolute',
    top: -20,
    left: -30,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chiffresContainer: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plageContainer: {
    position: 'absolute',
    top: -30,
    left: -30,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberlandContainer: {
    position: 'absolute',
    top: -30,
    left: -30,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nouveauxContainer: {
    position: 'absolute',
    top: -30,
    left: -30,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hanoiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suitesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labyrintheContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sudokuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memoryContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tangramContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logixContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  motsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mathBlocksContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  matricesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conteurContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoBackground: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default styles;
