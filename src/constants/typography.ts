/**
 * Configuration typographique pour enfants
 * Polices sans-serif claires et lisibles
 */

export const Typography = {
  // Familles de polices
  fonts: {
    regular: 'Nunito-Regular',
    bold: 'Nunito-Bold',
    // Polices pour dyslexie (optionnelles)
    dyslexia: 'OpenDyslexic-Regular',
    dyslexiaBold: 'OpenDyslexic-Bold',
    // Fallback système
    system: 'System',
  },

  // Tailles de police (généreuses pour les enfants)
  sizes: {
    xs: 14,
    sm: 18,
    md: 24,      // Taille par défaut pour texte enfant
    lg: 32,      // Titres
    xl: 48,      // Gros titres
    xxl: 64,     // Très gros (écran victoire)
  },

  // Hauteurs de ligne (aérées pour meilleure lisibilité)
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,  // Recommandé pour les enfants
  },

  // Poids
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // Espacement des lettres
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
} as const;

// Styles prédéfinis pour usage rapide
export const TextStyles = {
  // Titre principal
  heading: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    lineHeight: Typography.sizes.lg * Typography.lineHeights.normal,
  },

  // Sous-titre
  subheading: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    lineHeight: Typography.sizes.md * Typography.lineHeights.normal,
  },

  // Corps de texte
  body: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.regular,
    lineHeight: Typography.sizes.md * Typography.lineHeights.relaxed,
  },

  // Petit texte
  caption: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.regular,
    lineHeight: Typography.sizes.sm * Typography.lineHeights.normal,
  },

  // Texte de bouton
  button: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    lineHeight: Typography.sizes.md * Typography.lineHeights.tight,
  },
} as const;
