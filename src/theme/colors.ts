/**
 * Color palette for EduGames
 * Modern flat design with vibrant colors
 */

export const colors = {
  // Primary palette - Blue theme
  primary: {
    main: '#4A90D9',      // Main blue
    light: '#6BA5E7',
    dark: '#3A7BC8',
    contrast: '#FFFFFF',
  },

  // Secondary palette - Orange/Yellow accents
  secondary: {
    main: '#F5A623',      // Warm orange
    light: '#FFB94D',
    dark: '#E09000',
    contrast: '#FFFFFF',
  },

  // Background colors - Blue gradient theme
  background: {
    primary: '#E8F4FC',   // Light blue
    secondary: '#D0E8F8', // Slightly darker blue
    card: '#FFFFFF',
    game: '#E8F4FC',      // Game area background
    gradientStart: '#E8F4FC',
    gradientEnd: '#D0E8F8',
  },

  // Text colors
  text: {
    primary: '#2D3748',
    secondary: '#4A5568',
    muted: '#718096',
    inverse: '#FFFFFF',
  },

  // Feedback colors
  feedback: {
    success: '#48BB78',   // Green
    successLight: '#C6F6D5',
    warning: '#ECC94B',   // Yellow
    warningLight: '#FEFCBF',
    error: '#F56565',     // Red
    errorLight: '#FED7D7',
    info: '#4299E1',
    infoLight: '#BEE3F8',
  },

  // Game-specific colors (Tower of Hanoi)
  game: {
    // Disk colors - vibrant and distinct (smallest to largest)
    disk1: '#E74C3C',     // Red
    disk2: '#F39C12',     // Orange
    disk3: '#F1C40F',     // Yellow
    disk4: '#2ECC71',     // Green
    disk5: '#1ABC9C',     // Cyan/Teal
    disk6: '#9B59B6',     // Purple
    disk7: '#3498DB',     // Blue (for 7-disk levels)

    // Tower/wood colors
    tower: '#B8860B',     // Dark goldenrod (pole)
    towerHighlight: '#DAA520', // Goldenrod (highlight)
    towerBase: '#D4A574', // Light wood (base top)
    towerBaseSide: '#B8956E', // Medium wood (base side)
    towerBaseDark: '#8B7355', // Dark wood (base shadow)

    // Platform/board
    boardSurface: '#DEB887', // Burlywood (board top)
    boardEdge: '#CD853F',    // Peru (board edge)
  },

  // UI elements
  ui: {
    border: '#E2E8F0',
    divider: '#EDF2F7',
    shadow: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    disabled: '#CBD5E0',
    buttonBlue: '#5B9BD5',
    buttonBlueDark: '#4A8AC4',
    buttonOrange: '#F5A623',
    buttonOrangeDark: '#E09000',
    buttonGray: '#A0AEC0',
  },

  // Parent zone
  parent: {
    background: '#F7FAFC',
    border: '#E2E8F0',
    iconGreen: '#48BB78',
    iconYellow: '#ECC94B',
    iconRed: '#F56565',
  },

  // Assistant character
  assistant: {
    bubble: '#FFFFFF',
    bubbleBorder: '#E2E8F0',
    character: '#4A90D9',
  },
} as const;

export type Colors = typeof colors;
