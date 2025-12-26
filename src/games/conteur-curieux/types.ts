/**
 * Conteur Curieux Types
 *
 * Types pour le jeu de compréhension de lecture
 * Activité éducative pour enfants 6-10 ans
 */

// ============================================================================
// READING MODE & THEME
// ============================================================================

/**
 * Mode de lecture/écoute de l'histoire
 */
export type ReadingMode = 'listen' | 'read' | 'mixed';

/**
 * Thème de l'histoire pour le filtrage
 */
export type StoryTheme = 'nature' | 'adventure' | 'magic' | 'family' | 'friendship' | 'discovery';

/**
 * Configuration des thèmes avec métadonnées
 */
export interface ThemeConfig {
  id: StoryTheme;
  label: string;
  emoji: string;
  color: string;
}

// ============================================================================
// VOCABULARY
// ============================================================================

/**
 * Mot de vocabulaire avec définition
 */
export interface VocabularyWord {
  word: string;
  definition: string;
  example?: string;
  emoji?: string;
  audioUrl?: string;
}

/**
 * Position d'un mot dans le texte (pour highlighting)
 */
export interface WordPosition {
  paragraphIndex: number;
  startIndex: number;
  endIndex: number;
  word: string;
}

// ============================================================================
// QUESTION CATEGORIES
// ============================================================================

/**
 * Catégorie pédagogique de la question
 */
export type QuestionCategory =
  | 'factual'       // 🔍 Qui/Quoi/Où - rappel direct
  | 'sequential'    // 📋 Ordre des événements
  | 'causal'        // 🔗 Pourquoi/Comment - cause et effet
  | 'emotional'     // 💭 Sentiments des personnages
  | 'inferential'   // 🔮 Lire entre les lignes
  | 'opinion';      // 💡 Interprétation personnelle

/**
 * Configuration des catégories de questions
 */
export interface QuestionCategoryConfig {
  id: QuestionCategory;
  label: string;
  emoji: string;
  color: string;
  introPhrase: string;
}

// ============================================================================
// COLLECTIBLES & SKILLS
// ============================================================================

/**
 * Rareté d'une carte collectionnable
 */
export type CardRarity = 'common' | 'rare' | 'epic' | 'legendary';

/**
 * Carte collectionnable débloquée après une histoire
 */
export interface StoryCollectible {
  id: string;
  storyId: string;
  name: string;
  emoji: string;
  description: string;
  rarity: CardRarity;
  trait?: string;
  traitEmoji?: string;
}

/**
 * Compétence développée
 */
export type SkillType =
  | 'comprehension'     // 📚 Compréhension générale
  | 'vocabulary'        // 📖 Vocabulaire
  | 'inference'         // 🧠 Inférence
  | 'memory'            // 🔮 Mémoire
  | 'critical_thinking' // 💡 Pensée critique
  | 'listening';        // 👂 Écoute active

/**
 * Badge de compétence gagné
 */
export interface SkillBadge {
  skill: SkillType;
  label: string;
  emoji: string;
  isNew: boolean;
}

// ============================================================================
// AUDIO SYNC
// ============================================================================

/**
 * Timing pour synchronisation audio-texte
 */
export interface AudioTiming {
  paragraphIndex: number;
  startTime: number; // en secondes
  endTime: number;
  wordTimings?: WordTiming[];
}

/**
 * Timing d'un mot individuel
 */
export interface WordTiming {
  word: string;
  startTime: number;
  endTime: number;
}

// ============================================================================
// PLUME MASCOT
// ============================================================================

/**
 * Expression de la mascotte Plume
 */
export type PlumeExpression =
  | 'neutral'
  | 'happy'
  | 'thinking'
  | 'encouraging'
  | 'celebrating'
  | 'listening'
  | 'reading';

/**
 * Dialogue de Plume
 */
export interface PlumeDialogue {
  id: string;
  trigger: ConteurAssistantTrigger;
  expression: PlumeExpression;
  messages: string[];
  ageGroup?: '6-7' | '8-10' | 'all';
}

// ============================================================================
// BASIC TYPES
// ============================================================================

/**
 * Type de question
 */
export type QuestionType =
  | 'multiple_choice'     // QCM classique
  | 'true_false'          // Vrai/Faux
  | 'ordering'            // Remettre dans l'ordre
  | 'fill_blank';         // Compléter le texte

/**
 * Une option de réponse
 */
export interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback?: string;
}

/**
 * Une question sur l'histoire
 */
export interface StoryQuestion {
  id: string;
  text: string;
  type: QuestionType;
  category: QuestionCategory;
  options: AnswerOption[];
  hint?: string;
  emoji?: string;
  /** Passage lié dans l'histoire (pour relecture ciblée) */
  relatedParagraph?: number;
  /** Explication après réponse */
  explanation?: string;
}

/**
 * Une histoire
 */
export interface Story {
  id: string;
  title: string;
  emoji: string;
  /** Texte de l'histoire */
  content: string;
  /** Paragraphes (pour lecture progressive) */
  paragraphs: string[];
  /** Questions associées */
  questions: StoryQuestion[];
  /** Image de couverture (optionnel) */
  coverImage?: string;
  /** Temps de lecture estimé en minutes */
  readingTime: number;
  /** Thème de l'histoire */
  theme: StoryTheme;
  /** Vocabulaire à expliquer */
  vocabulary?: VocabularyWord[];
  /** URL audio de narration (placeholder) */
  audioUrl?: string;
  /** Timings audio par paragraphe */
  audioTimings?: AudioTiming[];
  /** Carte collectionnable associée */
  collectible?: StoryCollectible;
  /** Compétences développées */
  skills?: SkillType[];
  /** Résumé court pour le recap */
  summary?: string;
}

// ============================================================================
// LEVEL TYPES
// ============================================================================

/**
 * Difficulté du niveau
 */
export type ConteurDifficulty = 1 | 2 | 3;

/**
 * Configuration d'un niveau
 */
export interface ConteurLevel {
  id: string;
  name: string;
  description: string;
  difficulty: ConteurDifficulty;
  /** Thème */
  theme: string;
  /** Emoji du thème */
  themeEmoji: string;
  /** L'histoire du niveau */
  story: Story;
  /** Indices disponibles */
  hintsAvailable: number;
  /** Score minimum pour réussir (%) */
  passingScore: number;
}

// ============================================================================
// GAME STATE
// ============================================================================

/**
 * Phase du jeu
 */
export type ConteurPhase =
  | 'intro'         // Introduction
  | 'reading'       // Lecture de l'histoire
  | 'questions'     // Réponse aux questions
  | 'paused'        // En pause
  | 'results';      // Résultats

/**
 * Réponse du joueur
 */
export interface PlayerAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  hintsUsed: number;
  timeSpent: number;
}

/**
 * État du jeu Conteur Curieux
 */
export interface ConteurGameState {
  /** Phase actuelle */
  phase: ConteurPhase;
  /** Niveau actuel */
  level: ConteurLevel;
  /** Mode de lecture choisi */
  readingMode: ReadingMode;
  /** Index du paragraphe actuel (lecture) */
  currentParagraph: number;
  /** Index de la question actuelle */
  currentQuestion: number;
  /** Réponses du joueur */
  playerAnswers: PlayerAnswer[];
  /** Nombre d'indices utilisés */
  hintsUsed: number;
  /** Indices restants */
  hintsRemaining: number;
  /** Temps total de lecture */
  readingTime: number;
  /** Temps total sur les questions */
  questionsTime: number;
  /** Option sélectionnée (avant validation) */
  selectedOptionId: string | null;
  /** Indice affiché */
  showingHint: boolean;
  /** Mot de vocabulaire affiché */
  vocabularyPopup: VocabularyWord | null;
  /** Audio en cours de lecture */
  isAudioPlaying: boolean;
  /** Position audio actuelle (secondes) */
  audioPosition: number;
  /** Index du mot en cours (pour highlighting) */
  currentWordIndex: number;
  /** Tentatives sur la question actuelle */
  currentAttempts: number;
}

// ============================================================================
// RESULT
// ============================================================================

/**
 * Résultat d'une partie
 */
export interface ConteurResult {
  /** ID du niveau */
  levelId: string;
  /** Score en pourcentage */
  scorePercent: number;
  /** Bonnes réponses */
  correctAnswers: number;
  /** Total de questions */
  totalQuestions: number;
  /** Temps de lecture */
  readingTimeSeconds: number;
  /** Temps sur les questions */
  questionsTimeSeconds: number;
  /** Indices utilisés */
  hintsUsed: number;
  /** Étoiles obtenues (1-5) */
  stars: 1 | 2 | 3 | 4 | 5;
  /** A réussi (score >= passingScore) */
  passed: boolean;
  /** Carte débloquée */
  unlockedCard?: StoryCollectible;
  /** Compétences gagnées */
  skillsEarned: SkillBadge[];
  /** Message de Plume */
  plumeMessage: string;
  /** Premier essai parfait (100% sans indice) */
  isPerfect: boolean;
}

// ============================================================================
// CONFIG
// ============================================================================

/**
 * Configuration par défaut
 */
export const DEFAULT_CONTEUR_CONFIG = {
  /** Score pour 3 étoiles */
  threeStarsScore: 100,
  /** Score pour 2 étoiles */
  twoStarsScore: 70,
  /** Score pour 1 étoile */
  oneStarScore: 50,
};

// ============================================================================
// ASSISTANT
// ============================================================================

/**
 * Déclencheurs pour l'assistant
 */
export type ConteurAssistantTrigger =
  | 'game_start'
  | 'reading_start'
  | 'reading_end'
  | 'questions_start'
  | 'correct_answer'
  | 'wrong_answer'
  | 'hint_requested'
  | 'victory'
  | 'needs_improvement';
