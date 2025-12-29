/**
 * Parent Guide Data for Sudoku
 * Données pédagogiques pour le drawer parent
 */

import type { ParentDrawerProps } from '@/components/common';

export const sudokuParentGuideData: Omit<ParentDrawerProps, 'isVisible' | 'onClose'> = {
  gameTitle: 'Sudoku',

  educationalObjectives: [
    'Développer la logique déductive',
    'Améliorer la concentration et l\'attention',
    'Renforcer la mémoire de travail',
    'Apprendre à résoudre des problèmes par élimination',
    'Développer la patience et la persévérance',
  ],

  targetSkills: [
    {
      name: 'Raisonnement logique',
      description: 'Utiliser des déductions pour trouver la bonne réponse',
      icon: '🧠',
    },
    {
      name: 'Attention visuelle',
      description: 'Scanner lignes, colonnes et zones pour repérer les manquants',
      icon: '👁️',
    },
    {
      name: 'Mémoire de travail',
      description: 'Retenir plusieurs informations simultanément',
      icon: '💭',
    },
    {
      name: 'Résolution de problèmes',
      description: 'Appliquer des stratégies pour résoudre des puzzles',
      icon: '🔍',
    },
  ],

  ageRecommendation: {
    minAge: 6,
    maxAge: 10,
    details: [
      {
        ageRange: '6-7 ans',
        description: 'Grilles 4×4 avec symboles visuels (animaux, fruits)',
        gridSize: '4×4',
      },
      {
        ageRange: '7-8 ans',
        description: 'Grilles 4×4 puis 6×6 avec introduction des chiffres',
        gridSize: '4×4 à 6×6',
      },
      {
        ageRange: '9-10 ans',
        description: 'Grilles 6×6 et 9×9 classiques avec chiffres',
        gridSize: '6×6 à 9×9',
      },
    ],
  },

  howToPlay: [
    {
      step: 1,
      title: 'Comprendre la règle',
      description:
        'Chaque ligne, colonne et zone doit contenir tous les symboles une seule fois.',
    },
    {
      step: 2,
      title: 'Observer la grille',
      description:
        'Commencer par les lignes ou colonnes avec le plus de symboles déjà placés.',
    },
    {
      step: 3,
      title: 'Procéder par élimination',
      description:
        'Pour chaque case vide, déterminer quels symboles sont possibles en vérifiant la ligne, la colonne et la zone.',
    },
    {
      step: 4,
      title: 'Placer les symboles certains',
      description:
        'Quand un seul symbole est possible pour une case, le placer.',
    },
  ],

  tips: [
    {
      title: 'Commencer petit',
      content:
        'Les grilles 4×4 sont parfaites pour découvrir les règles sans frustration.',
      icon: '🎯',
    },
    {
      title: 'Utiliser les thèmes visuels',
      content:
        'Les fruits et animaux rendent le jeu plus accessible que les chiffres pour les plus jeunes.',
      icon: '🍎',
    },
    {
      title: 'Encourager la méthode',
      content:
        'Félicitez votre enfant pour sa démarche, pas seulement pour le résultat final.',
      icon: '⭐',
    },
    {
      title: 'Accepter les erreurs',
      content:
        'Les erreurs font partie de l\'apprentissage. Utilisez-les comme opportunité de discussion.',
      icon: '💡',
    },
    {
      title: 'Mode entraînement',
      content:
        'Utilisez le mode entraînement pour pratiquer sans pression de progression.',
      icon: '🏋️',
    },
  ],

  montessoriConnection: {
    principles: [
      'Auto-correction : l\'enfant peut vérifier ses erreurs lui-même',
      'Progression naturelle : de la manipulation concrète vers l\'abstraction',
      'Concentration : développe l\'attention soutenue',
      'Confiance en soi : résoudre un puzzle renforce l\'estime de soi',
    ],
    materials: [
      'Grilles papier pour manipulation physique',
      'Jetons ou pions pour représenter les symboles',
      'Grilles plastifiées réutilisables',
    ],
  },

  progressionPath: [
    {
      level: 'Découverte (Niveaux 1-2)',
      description: 'Grilles 4×4 très guidées avec peu de cases vides',
      skills: ['Comprendre les règles de base', 'Observer lignes et colonnes'],
    },
    {
      level: 'Initiation (Niveaux 3-4)',
      description: 'Grilles 4×4 avec plus de cases à remplir',
      skills: ['Élimination simple', 'Vérification systématique'],
    },
    {
      level: 'Progression (Niveaux 5-6)',
      description: 'Grilles 6×6 introduisant les zones rectangulaires',
      skills: ['Gérer une grille plus grande', 'Coordination ligne/colonne/zone'],
    },
    {
      level: 'Maîtrise (Niveaux 7-8)',
      description: 'Grilles 6×6 avec moins d\'indices',
      skills: ['Déduction avancée', 'Stratégies multiples'],
    },
    {
      level: 'Expert (Niveaux 9-10)',
      description: 'Grilles 9×9 classiques',
      skills: ['Raisonnement complexe', 'Patience et persévérance'],
    },
  ],

  frequentQuestions: [
    {
      question: 'Mon enfant bloque sur une grille, que faire ?',
      answer:
        'Proposez-lui d\'utiliser un indice ou de recommencer avec une grille plus simple. Le mode entraînement permet de choisir la difficulté.',
    },
    {
      question: 'À partir de quel âge peut-on commencer ?',
      answer:
        'Dès 6 ans avec les grilles 4×4 et les thèmes visuels. Les enfants plus jeunes peuvent observer et participer avec un parent.',
    },
    {
      question: 'Mon enfant fait beaucoup d\'erreurs, est-ce grave ?',
      answer:
        'Les erreurs sont normales et font partie de l\'apprentissage. Elles aident à comprendre les règles et à développer des stratégies.',
    },
    {
      question: 'Comment encourager sans donner la réponse ?',
      answer:
        'Posez des questions : "As-tu vérifié cette ligne ?", "Quel symbole manque dans cette zone ?" plutôt que de donner la solution.',
    },
  ],
};

export default sudokuParentGuideData;
