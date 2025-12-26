import { useState } from 'react';
import { Game, AISuggestion } from '../types/games';

// Mock data - À remplacer par une vraie source de données
const MOCK_GAMES: Game[] = [
  {
    id: 'tower-hanoi',
    name: 'Tour Magique',
    icon: '🏰',
    category: 'logic',
    progress: 65,
    stars: 2,
  },
  {
    id: 'tangram',
    name: 'Puzzle Formes',
    icon: '🧩',
    category: 'spatial',
    progress: 20,
    stars: 1,
    isNew: true,
  },
  {
    id: 'numbers',
    name: 'Chiffres Rigolos',
    icon: '🔢',
    category: 'numbers',
    progress: 80,
    stars: 3,
  },
  {
    id: 'memory',
    name: 'Super Mémoire',
    icon: '🧠',
    category: 'memory',
    progress: 45,
    stars: 2,
  },
  {
    id: 'sequences',
    name: 'Suite Magique',
    icon: '🔮',
    category: 'logic',
    progress: 30,
    stars: 1,
  },
  {
    id: 'sudoku',
    name: 'Sudoku Junior',
    icon: '🎯',
    category: 'numbers',
    progress: 55,
    stars: 2,
  },
  {
    id: 'maze',
    name: 'Labyrinthe',
    icon: '🗺️',
    category: 'spatial',
    progress: 40,
    stars: 1,
  },
  {
    id: 'crosswords',
    name: 'Mots Croisés',
    icon: '🪁',
    category: 'memory',
    progress: 0,
    stars: 0,
    isComingSoon: true,
  },
];

const MOCK_SUGGESTION: AISuggestion = {
  suggestedGame: {
    id: 'tangram',
    name: 'Puzzle Formes',
    icon: '🧩',
    reason: 'Tu es super fort en logique ! Essaie le',
  },
};

export const useGamesProgress = () => {
  const [games, setGames] = useState<Game[]>(MOCK_GAMES);
  const [suggestion] = useState<AISuggestion>(MOCK_SUGGESTION);

  const updateGameProgress = (gameId: string, updates: Partial<Game>) => {
    setGames((prev) =>
      prev.map((game) => (game.id === gameId ? { ...game, ...updates } : game))
    );
  };

  return {
    games,
    suggestion,
    updateGameProgress,
  };
};
