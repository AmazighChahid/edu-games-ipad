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

  // Sudoku game colors (following UX guide)
  sudoku: {
    cellBackground: '#FFFFFF',
    cellBorder: '#DFE6E9',        // Lighter, softer border
    cellFixed: '#FFF9F0',         // Cream background for fixed cells
    cellSelected: '#BEE3F8',      // Light blue (from primary)
    cellConflict: '#FFE5D9',      // Orange doux (not aggressive red)
    gridBorder: '#2D3748',
    symbolPrimary: '#5B8DEE',     // Primary blue from palette
    symbolFixed: '#2D3436',       // Dark gray for readability
    symbolConflict: '#F39C12',    // Warning yellow/orange (not red)
    symbolSuccess: '#7BC74D',     // Green for validation
  },

  // Home screen colors (from home-redesign.html)
  home: {
    // Background gradient colors
    gradients: {
      skyTop: '#FFE8D6',          // Peach cream
      skyMid1: '#FFEAA7',         // Yellow cream
      skyMid2: '#B8E6C1',         // Light mint green
      grassBottom: '#98D9A8',     // Grass green
    },

    // Sun animation colors
    sun: {
      core: '#FFD93D',            // Bright yellow
      outer: '#F5C800',           // Golden yellow
      glow: 'rgba(255, 217, 61, 0.3)', // Transparent yellow glow
    },

    // Cloud colors
    clouds: {
      white: '#FFFFFF',
      shadow: 'rgba(0, 0, 0, 0.05)',
    },

    // Tree colors
    trees: {
      trunk: '#8B5A2B',           // Brown trunk
      greenDark: '#3D8B4D',       // Dark green leaves
      greenLight: '#6BC77D',      // Light green leaves
      greenMid: '#5BAE6B',        // Medium green
    },

    // Hills background
    hills: {
      front: '#7BC74D',           // Front hill green
      frontDark: '#5BAE6B',       // Front hill dark
      back: '#6BC77D',            // Back hill green
      backDark: '#4AA85C',        // Back hill dark
    },

    // Flower colors
    flowers: {
      pink: '#FFB5C5',            // Pink flower
      yellow: '#FFD93D',          // Yellow flower
      purple: '#E056FD',          // Purple flower
    },

    // Owl mascot colors
    owl: {
      brown: '#D4A574',           // Owl body
      brownDark: '#C49A6C',       // Owl body shadow
      eye: '#FFFFFF',             // Eye white
      pupil: '#4A4A4A',           // Eye pupil
      beak: '#FFB347',            // Orange beak
    },

    // Progress garden colors
    garden: {
      sky: '#E8F6FF',             // Garden sky top
      skyMid: '#D4EDFC',          // Garden sky mid
      grass: '#B8E6C1',           // Garden grass
      soil: '#8B5A2B',            // Garden soil
      soilDark: '#6B4423',        // Garden soil dark
      plantStem: '#5BAE6B',       // Plant stems
    },

    // Daily streak colors
    streak: {
      orange: '#FFB347',          // Streak background
      orangeDark: '#FF9500',      // Streak gradient dark
      white: '#FFFFFF',           // Completed day
      transparent: 'rgba(255, 255, 255, 0.3)', // Today highlight
      future: 'rgba(255, 255, 255, 0.15)',     // Future days
    },

    // Game category colors
    categories: {
      logic: '#5B8DEE',           // Blue
      logicLight: '#7BA3F0',
      spatial: '#E056FD',         // Purple
      spatialLight: '#EA80FF',
      numbers: '#7BC74D',         // Green
      numbersLight: '#95D46A',
      memory: '#FFB347',          // Orange
      memoryLight: '#FFC56A',
      language: '#FF6B9D',        // Pink (NEW for mots-croises)
      languageLight: '#FF8FB8',
    },

    // Category background colors (for game card icons)
    categoryBackgrounds: {
      logic: '#E8F2FF',           // Light blue
      logicDark: '#D4E6FF',
      spatial: '#FCE8FF',         // Light purple
      spatialDark: '#F5D0FF',
      numbers: '#E8FFE8',         // Light green
      numbersDark: '#D0F5D0',
      memory: '#FFF5E8',          // Light orange
      memoryDark: '#FFE8CC',
      language: '#FFE8F0',        // Light pink (NEW)
      languageDark: '#FFD0E0',
    },

    // UI colors
    cardBackground: '#FFFFFF',
    cardShadow: 'rgba(0, 0, 0, 0.08)',
    cardShadowHover: 'rgba(0, 0, 0, 0.15)',
    badge: {
      new: '#7BC74D',             // Green badge
      soon: '#FFB347',            // Orange badge
      text: '#FFFFFF',
    },
  },
} as const;

export type Colors = typeof colors;
