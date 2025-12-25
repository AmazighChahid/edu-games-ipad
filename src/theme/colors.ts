/**
 * Color palette for EduGames
 * Inspired by Montessori principles: calm, natural, non-overstimulating
 */

export const colors = {
  // Primary palette - warm and inviting
  primary: {
    main: '#5C8A6E',      // Sage green - calm, natural
    light: '#7BA98A',
    dark: '#456B54',
    contrast: '#FFFFFF',
  },

  // Secondary palette - playful accents
  secondary: {
    main: '#E8A849',      // Warm amber - encouraging
    light: '#F2C478',
    dark: '#C88A2D',
    contrast: '#2D2D2D',
  },

  // Background colors - soft and easy on eyes
  background: {
    primary: '#F5F0E8',   // Warm cream
    secondary: '#EDE6DB',
    card: '#FFFFFF',
    game: '#FAF7F2',
  },

  // Text colors
  text: {
    primary: '#2D2D2D',
    secondary: '#5A5A5A',
    muted: '#8A8A8A',
    inverse: '#FFFFFF',
  },

  // Feedback colors - softer versions for children
  feedback: {
    success: '#7CB87C',   // Soft green
    successLight: '#E8F5E8',
    warning: '#E8B84A',   // Warm yellow
    warningLight: '#FFF8E6',
    error: '#D98B8B',     // Soft coral (not harsh red)
    errorLight: '#FEF0F0',
    info: '#7AAED4',
    infoLight: '#E8F4FC',
  },

  // Game-specific colors (Tower of Hanoi disks)
  game: {
    disk1: '#E57373',     // Coral red
    disk2: '#64B5F6',     // Sky blue
    disk3: '#81C784',     // Leaf green
    disk4: '#FFD54F',     // Sunny yellow
    disk5: '#BA68C8',     // Lavender purple
    tower: '#8D6E63',     // Warm brown
    towerBase: '#6D4C41', // Dark brown
  },

  // UI elements
  ui: {
    border: '#E0D8CC',
    divider: '#EDE6DB',
    shadow: 'rgba(0, 0, 0, 0.08)',
    overlay: 'rgba(0, 0, 0, 0.4)',
    disabled: '#CCCCCC',
  },

  // Assistant character
  assistant: {
    bubble: '#FFFFFF',
    bubbleBorder: '#E0D8CC',
    character: '#5C8A6E',
  },
} as const;

export type Colors = typeof colors;
