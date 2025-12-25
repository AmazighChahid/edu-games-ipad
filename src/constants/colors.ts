/**
 * Palette de couleurs pour le jeu Tour de Hanoi
 * Design moderne 6-10 ans - Style vectoriel/plat
 */

export const Colors = {
  // Palette primaire - Bleu moderne
  primary: {
    soft: '#E8F4FC',      // Bleu très clair (fond)
    medium: '#4A90D9',    // Bleu principal
    dark: '#2D5F8B',      // Bleu foncé
    gradient: ['#5BA3E8', '#4A90D9'], // Dégradé header
  },

  // Palette secondaire - Orange/doré pour accents
  secondary: {
    soft: '#FFF3E0',      // Orange très clair
    medium: '#F5A623',    // Orange doré (boutons primaires)
    dark: '#E09000',      // Orange foncé
  },

  // Neutres - tons chauds naturels
  neutral: {
    background: '#E8F4FC', // Fond bleu clair
    surface: '#FFFFFF',    // Blanc pur (cartes, modales)
    text: '#2D3748',       // Texte principal (bleu-gris foncé)
    textLight: '#718096',  // Texte secondaire
    border: '#E2E8F0',     // Bordures subtiles
  },

  // Couleurs des disques - palette harmonieuse (du plus petit au plus grand)
  discs: [
    '#FF6B6B',  // Rouge corail - disque 1 (plus petit)
    '#FF8E53',  // Orange - disque 2
    '#FFD93D',  // Jaune doré - disque 3
    '#6BCB77',  // Vert menthe - disque 4
    '#4D96FF',  // Bleu - disque 5
    '#9B59B6',  // Violet - disque 6
    '#E056FD',  // Magenta - disque 7
  ],

  // Couleurs du bois (tours et plateau)
  wood: {
    light: '#D4A574',     // Bois clair
    medium: '#C4956A',    // Bois moyen
    dark: '#8B6914',      // Bois foncé
    pole: '#A67C52',      // Piquets
    poleHighlight: '#C9A66B', // Reflet piquet
    base: '#B8956C',      // Base plateau
    baseHighlight: '#D4B896', // Reflet base
  },

  // Feedback (retours visuels)
  feedback: {
    success: '#48BB78',   // Vert doux (victoire)
    warning: '#F6AD55',   // Orange doux (attention)
    error: '#FC8181',     // Rouge doux (rarement utilisé)
    info: '#63B3ED',      // Bleu info
  },

  // Boutons spécifiques
  button: {
    help: '#F5A623',      // Bouton Aide (orange)
    helpText: '#FFFFFF',
    reset: '#4A90D9',     // Bouton Reset (bleu)
    resetText: '#FFFFFF',
    menu: '#4A90D9',      // Bouton Menu
    menuText: '#FFFFFF',
    hint: '#F5A623',      // Bouton Indice
    hintText: '#FFFFFF',
  },

  // Panneau parent
  parent: {
    background: '#FFF8DC', // Fond crème/jaune pâle
    border: '#F5D78E',
    accent: '#F5A623',
    text: '#5D4E37',
    textLight: '#8B7355',
  },

  // Mode contraste élevé (accessibilité)
  highContrast: {
    background: '#FFFFFF',
    text: '#000000',
    primary: '#0066CC',
    secondary: '#CC6600',
  },

  // Ombres
  shadow: {
    light: 'rgba(0, 0, 0, 0.08)',
    medium: 'rgba(0, 0, 0, 0.12)',
    dark: 'rgba(0, 0, 0, 0.20)',
  },
} as const;

export type ColorKey = keyof typeof Colors;
