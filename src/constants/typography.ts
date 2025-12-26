export const TYPOGRAPHY = {
  // Font families
  fontPrimary: 'Nunito',
  fontSecondary: 'Fredoka',

  // Font weights
  weightRegular: '400' as const,
  weightMedium: '500' as const,
  weightSemiBold: '600' as const,
  weightBold: '700' as const,
  weightExtraBold: '800' as const,

  // Font sizes
  sizeXs: 11,
  sizeSm: 12,
  sizeMd: 14,
  sizeLg: 16,
  sizeXl: 18,
  size2Xl: 22,
  size3Xl: 24,
  size4Xl: 28,
  size5Xl: 32,
  sizeHuge: 40,
  sizeGiant: 50,

  // Line heights
  lineHeightTight: 1.2,
  lineHeightNormal: 1.4,
  lineHeightRelaxed: 1.6,
};

// Style presets
export const TEXT_STYLES = {
  h1: {
    fontFamily: 'Fredoka',
    fontSize: TYPOGRAPHY.size5Xl,
    fontWeight: TYPOGRAPHY.weightBold,
    lineHeight: TYPOGRAPHY.size5Xl * TYPOGRAPHY.lineHeightTight,
  },
  h2: {
    fontFamily: 'Fredoka',
    fontSize: TYPOGRAPHY.size3Xl,
    fontWeight: TYPOGRAPHY.weightSemiBold,
    lineHeight: TYPOGRAPHY.size3Xl * TYPOGRAPHY.lineHeightTight,
  },
  h3: {
    fontFamily: 'Fredoka',
    fontSize: TYPOGRAPHY.sizeXl,
    fontWeight: TYPOGRAPHY.weightSemiBold,
    lineHeight: TYPOGRAPHY.sizeXl * TYPOGRAPHY.lineHeightTight,
  },
  body: {
    fontFamily: 'Nunito',
    fontSize: TYPOGRAPHY.sizeLg,
    fontWeight: TYPOGRAPHY.weightRegular,
    lineHeight: TYPOGRAPHY.sizeLg * TYPOGRAPHY.lineHeightNormal,
  },
  bodySmall: {
    fontFamily: 'Nunito',
    fontSize: TYPOGRAPHY.sizeMd,
    fontWeight: TYPOGRAPHY.weightRegular,
    lineHeight: TYPOGRAPHY.sizeMd * TYPOGRAPHY.lineHeightNormal,
  },
  button: {
    fontFamily: 'Fredoka',
    fontSize: TYPOGRAPHY.sizeLg,
    fontWeight: TYPOGRAPHY.weightSemiBold,
  },
  badge: {
    fontFamily: 'Nunito',
    fontSize: TYPOGRAPHY.sizeMd,
    fontWeight: TYPOGRAPHY.weightBold,
  },
};
