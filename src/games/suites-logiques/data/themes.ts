import { Theme, ThemeType, SequenceElement } from '../types';

// ============================================
// CONFIGURATION DES THÈMES
// ============================================

export const THEMES: Record<ThemeType, Theme> = {
  // Thème par défaut - disponible dès le départ
  shapes: {
    id: 'shapes',
    name: 'Formes',
    icon: '🔷',
    ageRange: [6, 10],
    unlockCondition: { type: 'default' },
    elements: [
      {
        id: 'circle',
        type: 'shape',
        value: 'circle',
        displayAsset: '#5B8DEE',
        label: 'Cercle'
      },
      {
        id: 'square',
        type: 'shape',
        value: 'square',
        displayAsset: '#FFB347',
        label: 'Carré'
      },
      {
        id: 'triangle',
        type: 'shape',
        value: 'triangle',
        displayAsset: '#7BC74D',
        label: 'Triangle'
      },
      {
        id: 'diamond',
        type: 'shape',
        value: 'diamond',
        displayAsset: '#E056FD',
        label: 'Losange'
      },
    ],
  },

  // Couleurs - disponible dès le départ
  colors: {
    id: 'colors',
    name: 'Couleurs',
    icon: '🎨',
    ageRange: [6, 7],
    unlockCondition: { type: 'default' },
    elements: [
      {
        id: 'red',
        type: 'color',
        value: 'red',
        displayAsset: '#E74C3C',
        label: 'Rouge'
      },
      {
        id: 'blue',
        type: 'color',
        value: 'blue',
        displayAsset: '#3498DB',
        label: 'Bleu'
      },
      {
        id: 'green',
        type: 'color',
        value: 'green',
        displayAsset: '#27AE60',
        label: 'Vert'
      },
      {
        id: 'yellow',
        type: 'color',
        value: 'yellow',
        displayAsset: '#F1C40F',
        label: 'Jaune'
      },
      {
        id: 'purple',
        type: 'color',
        value: 'purple',
        displayAsset: '#9B59B6',
        label: 'Violet'
      },
    ],
  },

  // Ferme - disponible dès le départ
  farm: {
    id: 'farm',
    name: 'La Ferme',
    icon: '🐄',
    ageRange: [6, 8],
    unlockCondition: { type: 'default' },
    elements: [
      {
        id: 'cow',
        type: 'image',
        value: 'cow',
        displayAsset: 'cow',
        label: 'Vache'
      },
      {
        id: 'pig',
        type: 'image',
        value: 'pig',
        displayAsset: 'pig',
        label: 'Cochon'
      },
      {
        id: 'chicken',
        type: 'image',
        value: 'chicken',
        displayAsset: 'chicken',
        label: 'Poule'
      },
      {
        id: 'sheep',
        type: 'image',
        value: 'sheep',
        displayAsset: 'sheep',
        label: 'Mouton'
      },
      {
        id: 'horse',
        type: 'image',
        value: 'horse',
        displayAsset: 'horse',
        label: 'Cheval'
      },
    ],
  },

  // Espace - débloqué après 10 suites réussies
  space: {
    id: 'space',
    name: 'L\'Espace',
    icon: '🚀',
    ageRange: [7, 10],
    unlockCondition: { type: 'sequences', value: 10 },
    elements: [
      {
        id: 'rocket',
        type: 'image',
        value: 'rocket',
        displayAsset: 'rocket',
        label: 'Fusée'
      },
      {
        id: 'moon',
        type: 'image',
        value: 'moon',
        displayAsset: 'moon',
        label: 'Lune'
      },
      {
        id: 'star',
        type: 'image',
        value: 'star',
        displayAsset: 'star',
        label: 'Étoile'
      },
      {
        id: 'planet',
        type: 'image',
        value: 'planet',
        displayAsset: 'planet',
        label: 'Planète'
      },
      {
        id: 'alien',
        type: 'image',
        value: 'alien',
        displayAsset: 'alien',
        label: 'Alien'
      },
    ],
  },

  // Musique - débloqué au niveau 2
  music: {
    id: 'music',
    name: 'Musique',
    icon: '🎵',
    ageRange: [7, 9],
    unlockCondition: { type: 'level', value: 2 },
    elements: [
      {
        id: 'note1',
        type: 'image',
        value: 'note1',
        displayAsset: 'note',
        label: 'Note'
      },
      {
        id: 'note2',
        type: 'image',
        value: 'note2',
        displayAsset: 'doubleNote',
        label: 'Double croche'
      },
      {
        id: 'clef',
        type: 'image',
        value: 'clef',
        displayAsset: 'clef',
        label: 'Clé de sol'
      },
      {
        id: 'drum',
        type: 'image',
        value: 'drum',
        displayAsset: 'drum',
        label: 'Tambour'
      },
    ],
  },

  // Nombres - débloqué au niveau 3
  numbers: {
    id: 'numbers',
    name: 'Nombres',
    icon: '🔢',
    ageRange: [8, 10],
    unlockCondition: { type: 'level', value: 3 },
    elements: [
      // Générés dynamiquement selon le pattern numérique
      {
        id: 'num_1',
        type: 'number',
        value: 1,
        displayAsset: '1',
        label: 'Un'
      },
      {
        id: 'num_2',
        type: 'number',
        value: 2,
        displayAsset: '2',
        label: 'Deux'
      },
      {
        id: 'num_3',
        type: 'number',
        value: 3,
        displayAsset: '3',
        label: 'Trois'
      },
      {
        id: 'num_4',
        type: 'number',
        value: 4,
        displayAsset: '4',
        label: 'Quatre'
      },
      {
        id: 'num_5',
        type: 'number',
        value: 5,
        displayAsset: '5',
        label: 'Cinq'
      },
    ],
  },
};

// Thème par défaut
export const DEFAULT_THEME: ThemeType = 'shapes';

// Helper pour vérifier si un thème est débloqué
export function isThemeUnlocked(
  themeId: ThemeType,
  progress: {
    totalSequences: number;
    currentLevel: number;
    unlockedThemes: ThemeType[];
  }
): boolean {
  const theme = THEMES[themeId];

  // Si déjà débloqué explicitement
  if (progress.unlockedThemes.includes(themeId)) {
    return true;
  }

  // Vérifier les conditions de déblocage
  switch (theme.unlockCondition.type) {
    case 'default':
      return true;

    case 'sequences':
      return progress.totalSequences >= (theme.unlockCondition.value || 0);

    case 'level':
      return progress.currentLevel >= (theme.unlockCondition.value || 0);

    default:
      return false;
  }
}

// Helper pour obtenir la liste des thèmes débloqués
export function getUnlockedThemes(progress: {
  totalSequences: number;
  currentLevel: number;
  unlockedThemes: ThemeType[];
}): ThemeType[] {
  return (Object.keys(THEMES) as ThemeType[]).filter(themeId =>
    isThemeUnlocked(themeId, progress)
  );
}
