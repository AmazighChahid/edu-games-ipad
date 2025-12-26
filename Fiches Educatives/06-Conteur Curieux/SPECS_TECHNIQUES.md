# 🔧 SPÉCIFICATIONS TECHNIQUES : Le Conteur Curieux

> **Stack** : React Native + Expo SDK 52+ • TypeScript • Reanimated 3  
> **Plateforme principale** : iPad (landscape)  
> **Plateforme secondaire** : iPhone

---

## 📁 Architecture des Fichiers

```
/src/games/conteur-curieux/
├── index.ts                          # Exports publics
├── types.ts                          # Types TypeScript (~150 lignes)
│
├── /screens/
│   ├── index.ts
│   ├── ConteurIntroScreen.tsx        # Sélection histoire + mode
│   ├── ConteurStoryScreen.tsx        # Lecture/écoute de l'histoire
│   ├── ConteurQuestionsScreen.tsx    # Questions de compréhension
│   ├── ConteurProductionScreen.tsx   # Reformulation (images/texte/audio)
│   └── ConteurVictoryScreen.tsx      # Célébration + carte débloquée
│
├── /components/
│   ├── index.ts
│   ├── PlumeMascot.tsx               # Mascotte animée Plume
│   ├── StoryCard.tsx                 # Carte de sélection d'histoire
│   ├── ModeSelector.tsx              # Choix audio/lecture/mixte
│   ├── StoryReader.tsx               # Affichage texte avec surlignage
│   ├── StoryIllustration.tsx         # Illustration animée
│   ├── VocabularyBubble.tsx          # Définition mot au tap
│   ├── QuestionCard.tsx              # Affichage question + choix
│   ├── AnswerButton.tsx              # Bouton de réponse QCM
│   ├── ProgressBar.tsx               # Barre de progression
│   ├── AudioPlayer.tsx               # Contrôles audio
│   ├── ImageReorder.tsx              # Drag & drop images (6-7 ans)
│   ├── SentenceCompletion.tsx        # Phrases à trous (7-8 ans)
│   ├── VoiceRecorder.tsx             # Enregistrement vocal (8-10 ans)
│   └── FeedbackOverlay.tsx           # Overlay feedback réponse
│
├── /hooks/
│   ├── useConteurGame.ts             # Hook principal du jeu
│   ├── useStoryAudio.ts              # Gestion audio narration
│   ├── useVocabulary.ts              # Gestion définitions mots
│   ├── useQuestionFlow.ts            # Logique questions
│   ├── useVoiceRecording.ts          # Enregistrement vocal
│   └── useStoryProgress.ts           # Sauvegarde progression
│
├── /logic/
│   ├── storyEngine.ts                # Moteur de gestion histoire
│   ├── questionGenerator.ts          # Génération/sélection questions
│   ├── scoreCalculator.ts            # Calcul scores et étoiles
│   └── progressionManager.ts         # Gestion niveaux et déblocages
│
└── /data/
    ├── stories/                       # Dossier histoires
    │   ├── index.ts                  # Export toutes histoires
    │   ├── level1/                   # Histoires niveau 1 (6 ans)
    │   │   ├── leo-et-la-foret.ts
    │   │   └── ...
    │   ├── level2/                   # Histoires niveau 2 (6-7 ans)
    │   ├── level3/                   # Histoires niveau 3 (7-8 ans)
    │   ├── level4/                   # Histoires niveau 4 (8-9 ans)
    │   └── level5/                   # Histoires niveau 5 (9-10 ans)
    ├── vocabulary.ts                 # Base de définitions simples
    ├── assistantScripts.ts           # Dialogues de Plume
    └── collectibleCards.ts           # Cartes à débloquer
```

---

## 📐 Types TypeScript

```typescript
// types.ts

// ============ HISTOIRE ============

export type StoryLevel = 1 | 2 | 3 | 4 | 5;

export type StoryTheme = 
  | 'nature' 
  | 'adventure' 
  | 'family' 
  | 'friendship' 
  | 'magic' 
  | 'discovery';

export type ListeningMode = 'audio' | 'read' | 'mixed';

export interface StoryMetadata {
  id: string;
  title: string;
  level: StoryLevel;
  theme: StoryTheme;
  wordCount: number;
  estimatedDuration: number; // en secondes
  thumbnailEmoji: string;
  coverImage?: string;
  isLocked: boolean;
  isNew?: boolean;
}

export interface StoryContent {
  id: string;
  paragraphs: StoryParagraph[];
  illustrations: StoryIllustration[];
  audioUrl?: string;
  questions: StoryQuestion[];
  productionTask: ProductionTask;
  collectibleCards: string[]; // IDs des cartes à débloquer
}

export interface StoryParagraph {
  id: string;
  text: string;
  audioStartTime: number; // ms
  audioEndTime: number; // ms
  highlightWords?: HighlightWord[];
  linkedIllustration?: string; // ID illustration
}

export interface HighlightWord {
  word: string;
  startIndex: number;
  endIndex: number;
  vocabularyId: string; // référence vers définition
}

export interface StoryIllustration {
  id: string;
  type: 'static' | 'animated';
  source: string; // chemin image ou composant
  displayAt: number; // ms dans l'audio
}

// ============ VOCABULAIRE ============

export interface VocabularyEntry {
  id: string;
  word: string;
  definition: string; // définition simple pour enfant
  example?: string; // exemple contextuel
  synonyms?: string[];
  audioUrl?: string;
}

// ============ QUESTIONS ============

export type QuestionType = 
  | 'factual'      // Qui, Quoi, Où
  | 'sequential'   // Ordre des événements
  | 'causal'       // Pourquoi
  | 'emotional'    // Sentiments
  | 'inferential'  // Déduction
  | 'opinion';     // Avis personnel

export interface StoryQuestion {
  id: string;
  type: QuestionType;
  text: string;
  relatedParagraphs: string[]; // IDs paragraphes concernés
  answers: QuestionAnswer[];
  correctAnswerId: string;
  hint?: string;
  explanation?: string;
  illustrationId?: string; // pour QCM visuels
}

export interface QuestionAnswer {
  id: string;
  text: string;
  emoji?: string; // pour 6-7 ans
  imageSource?: string; // pour QCM visuels
}

// ============ PRODUCTION ============

export type ProductionType = 
  | 'image_reorder'      // Remettre images dans l'ordre
  | 'sentence_completion' // Compléter des phrases
  | 'voice_recording'    // Enregistrement vocal
  | 'moral_question';    // Question ouverte sur la morale

export interface ProductionTask {
  type: ProductionType;
  ageRange: [number, number]; // ex: [6, 7]
  instructions: string;
  content: ImageReorderTask | SentenceCompletionTask | VoiceRecordingTask | MoralQuestionTask;
}

export interface ImageReorderTask {
  images: ProductionImage[];
  correctOrder: string[]; // IDs dans le bon ordre
}

export interface ProductionImage {
  id: string;
  source: string;
  label: string;
}

export interface SentenceCompletionTask {
  sentences: CompletionSentence[];
  wordBank: string[];
}

export interface CompletionSentence {
  id: string;
  template: string; // "Léo était un garçon très _____."
  correctWord: string;
  position: number; // index du trou
}

export interface VoiceRecordingTask {
  prompt: string;
  maxDuration: number; // secondes
  minDuration: number; // secondes
}

export interface MoralQuestionTask {
  question: string;
  answers: QuestionAnswer[];
  isOpenEnded: boolean; // si true, pas de "bonne" réponse
}

// ============ ÉTAT DU JEU ============

export type GamePhase = 
  | 'intro'
  | 'mode_selection'
  | 'story_discovery'
  | 'questions'
  | 'production'
  | 'victory';

export interface ConteurGameState {
  phase: GamePhase;
  selectedStory: StoryMetadata | null;
  listeningMode: ListeningMode;
  
  // Progression histoire
  currentParagraphIndex: number;
  isAudioPlaying: boolean;
  audioProgress: number; // 0-1
  
  // Questions
  currentQuestionIndex: number;
  answers: QuestionAttempt[];
  hintsUsed: number;
  replaysUsed: number;
  
  // Production
  productionComplete: boolean;
  voiceRecordingUri?: string;
  imageOrder?: string[];
  completedSentences?: Record<string, string>;
  
  // Score
  correctAnswers: number;
  totalQuestions: number;
  starsEarned: number; // 1-5
  
  // Timing
  startTime: number;
  endTime?: number;
}

export interface QuestionAttempt {
  questionId: string;
  selectedAnswerId: string;
  isCorrect: boolean;
  attempts: number;
  hintUsed: boolean;
  replayUsed: boolean;
  timeSpent: number; // ms
}

// ============ FEEDBACK ============

export type FeedbackType = 
  | 'correct'
  | 'incorrect'
  | 'hint'
  | 'replay'
  | 'encouragement';

export interface FeedbackConfig {
  type: FeedbackType;
  message: string;
  mascotAnimation: string;
  soundEffect?: string;
  duration: number; // ms
}

// ============ PROPS COMPOSANTS ============

export interface StoryCardProps {
  story: StoryMetadata;
  onPress: () => void;
  isSelected?: boolean;
  testID?: string;
}

export interface QuestionCardProps {
  question: StoryQuestion;
  selectedAnswerId?: string;
  onSelectAnswer: (answerId: string) => void;
  showFeedback: boolean;
  feedbackType?: FeedbackType;
  onReplay: () => void;
  onHint: () => void;
  disabled?: boolean;
}

export interface PlumeMascotProps {
  animation: string;
  message?: string;
  showSpeechBubble?: boolean;
  onAnimationComplete?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export interface AudioPlayerProps {
  audioUrl: string;
  isPlaying: boolean;
  progress: number;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (position: number) => void;
  onComplete: () => void;
}

export interface VoiceRecorderProps {
  isRecording: boolean;
  recordingDuration: number;
  maxDuration: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPlayback: () => void;
  recordingUri?: string;
}
```

---

## 🎣 Hook Principal : useConteurGame

```typescript
// hooks/useConteurGame.ts

import { useState, useCallback, useEffect } from 'react';
import { Audio } from 'expo-av';
import { 
  ConteurGameState, 
  StoryMetadata, 
  ListeningMode,
  StoryQuestion,
  QuestionAttempt,
  GamePhase
} from '../types';
import { getStoryContent } from '../data/stories';
import { calculateStars, shouldUnlockCard } from '../logic/scoreCalculator';

interface UseConteurGameProps {
  initialStoryId?: string;
  onVictory: (state: ConteurGameState) => void;
  onCardUnlock: (cardId: string) => void;
}

interface UseConteurGameReturn {
  // État
  state: ConteurGameState;
  story: StoryContent | null;
  currentQuestion: StoryQuestion | null;
  
  // Navigation phases
  selectStory: (story: StoryMetadata) => void;
  selectMode: (mode: ListeningMode) => void;
  startStory: () => void;
  finishStory: () => void;
  startQuestions: () => void;
  startProduction: () => void;
  completeGame: () => void;
  
  // Contrôles audio
  playAudio: () => Promise<void>;
  pauseAudio: () => Promise<void>;
  seekAudio: (position: number) => Promise<void>;
  replayCurrentParagraph: () => Promise<void>;
  
  // Questions
  selectAnswer: (answerId: string) => void;
  requestHint: () => string | null;
  replayPassage: () => void;
  nextQuestion: () => void;
  
  // Production
  submitImageOrder: (order: string[]) => boolean;
  submitCompletedSentences: (sentences: Record<string, string>) => boolean;
  submitVoiceRecording: (uri: string) => void;
  submitMoralAnswer: (answerId: string) => void;
  
  // Utilitaires
  reset: () => void;
  getProgress: () => number;
}

const initialState: ConteurGameState = {
  phase: 'intro',
  selectedStory: null,
  listeningMode: 'mixed',
  currentParagraphIndex: 0,
  isAudioPlaying: false,
  audioProgress: 0,
  currentQuestionIndex: 0,
  answers: [],
  hintsUsed: 0,
  replaysUsed: 0,
  productionComplete: false,
  correctAnswers: 0,
  totalQuestions: 0,
  starsEarned: 0,
  startTime: Date.now(),
};

export const useConteurGame = ({
  initialStoryId,
  onVictory,
  onCardUnlock,
}: UseConteurGameProps): UseConteurGameReturn => {
  const [state, setState] = useState<ConteurGameState>(initialState);
  const [story, setStory] = useState<StoryContent | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Charger l'histoire sélectionnée
  useEffect(() => {
    if (state.selectedStory) {
      const content = getStoryContent(state.selectedStory.id);
      setStory(content);
      setState(prev => ({
        ...prev,
        totalQuestions: content.questions.length,
      }));
    }
  }, [state.selectedStory]);

  // Cleanup audio
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // ============ NAVIGATION ============

  const selectStory = useCallback((story: StoryMetadata) => {
    setState(prev => ({
      ...prev,
      selectedStory: story,
      phase: 'mode_selection',
    }));
  }, []);

  const selectMode = useCallback((mode: ListeningMode) => {
    setState(prev => ({
      ...prev,
      listeningMode: mode,
    }));
  }, []);

  const startStory = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'story_discovery',
      startTime: Date.now(),
    }));
  }, []);

  const finishStory = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'questions',
      currentQuestionIndex: 0,
    }));
  }, []);

  const startProduction = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'production',
    }));
  }, []);

  const completeGame = useCallback(() => {
    const endTime = Date.now();
    const stars = calculateStars(state);
    
    setState(prev => ({
      ...prev,
      phase: 'victory',
      endTime,
      starsEarned: stars,
    }));

    // Vérifier déblocage de carte
    if (story && shouldUnlockCard(state, stars)) {
      const cardId = story.collectibleCards[0];
      if (cardId) {
        onCardUnlock(cardId);
      }
    }

    onVictory({ ...state, endTime, starsEarned: stars });
  }, [state, story, onVictory, onCardUnlock]);

  // ============ AUDIO ============

  const playAudio = useCallback(async () => {
    if (!story?.audioUrl) return;
    
    if (!sound) {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: story.audioUrl },
        { shouldPlay: true }
      );
      setSound(newSound);
    } else {
      await sound.playAsync();
    }
    
    setState(prev => ({ ...prev, isAudioPlaying: true }));
  }, [story, sound]);

  const pauseAudio = useCallback(async () => {
    if (sound) {
      await sound.pauseAsync();
    }
    setState(prev => ({ ...prev, isAudioPlaying: false }));
  }, [sound]);

  const seekAudio = useCallback(async (position: number) => {
    if (sound) {
      await sound.setPositionAsync(position);
    }
  }, [sound]);

  const replayCurrentParagraph = useCallback(async () => {
    if (!story || !sound) return;
    
    const paragraph = story.paragraphs[state.currentParagraphIndex];
    if (paragraph) {
      await sound.setPositionAsync(paragraph.audioStartTime);
      await sound.playAsync();
      setState(prev => ({ 
        ...prev, 
        isAudioPlaying: true,
        replaysUsed: prev.replaysUsed + 1,
      }));
    }
  }, [story, sound, state.currentParagraphIndex]);

  // ============ QUESTIONS ============

  const currentQuestion = story?.questions[state.currentQuestionIndex] ?? null;

  const selectAnswer = useCallback((answerId: string) => {
    if (!currentQuestion) return;

    const isCorrect = answerId === currentQuestion.correctAnswerId;
    const existingAttempt = state.answers.find(
      a => a.questionId === currentQuestion.id
    );

    const attempt: QuestionAttempt = {
      questionId: currentQuestion.id,
      selectedAnswerId: answerId,
      isCorrect,
      attempts: (existingAttempt?.attempts ?? 0) + 1,
      hintUsed: existingAttempt?.hintUsed ?? false,
      replayUsed: existingAttempt?.replayUsed ?? false,
      timeSpent: Date.now() - state.startTime,
    };

    setState(prev => ({
      ...prev,
      answers: [
        ...prev.answers.filter(a => a.questionId !== currentQuestion.id),
        attempt,
      ],
      correctAnswers: isCorrect 
        ? prev.correctAnswers + 1 
        : prev.correctAnswers,
    }));
  }, [currentQuestion, state.answers, state.startTime]);

  const requestHint = useCallback((): string | null => {
    if (!currentQuestion?.hint) return null;

    setState(prev => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
      answers: prev.answers.map(a =>
        a.questionId === currentQuestion.id
          ? { ...a, hintUsed: true }
          : a
      ),
    }));

    return currentQuestion.hint;
  }, [currentQuestion]);

  const replayPassage = useCallback(() => {
    // Rejouer les paragraphes liés à la question
    if (currentQuestion && story) {
      const paragraphIds = currentQuestion.relatedParagraphs;
      const firstParagraph = story.paragraphs.find(
        p => paragraphIds.includes(p.id)
      );
      
      if (firstParagraph && sound) {
        sound.setPositionAsync(firstParagraph.audioStartTime);
        sound.playAsync();
      }
    }
  }, [currentQuestion, story, sound]);

  const nextQuestion = useCallback(() => {
    if (state.currentQuestionIndex < (story?.questions.length ?? 0) - 1) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
    } else {
      startProduction();
    }
  }, [state.currentQuestionIndex, story, startProduction]);

  // ============ PRODUCTION ============

  const submitImageOrder = useCallback((order: string[]): boolean => {
    if (!story) return false;
    
    const task = story.productionTask.content as ImageReorderTask;
    const isCorrect = JSON.stringify(order) === JSON.stringify(task.correctOrder);
    
    setState(prev => ({
      ...prev,
      imageOrder: order,
      productionComplete: isCorrect,
    }));
    
    return isCorrect;
  }, [story]);

  const submitCompletedSentences = useCallback(
    (sentences: Record<string, string>): boolean => {
      if (!story) return false;
      
      const task = story.productionTask.content as SentenceCompletionTask;
      const allCorrect = task.sentences.every(
        s => sentences[s.id]?.toLowerCase() === s.correctWord.toLowerCase()
      );
      
      setState(prev => ({
        ...prev,
        completedSentences: sentences,
        productionComplete: allCorrect,
      }));
      
      return allCorrect;
    },
    [story]
  );

  const submitVoiceRecording = useCallback((uri: string) => {
    setState(prev => ({
      ...prev,
      voiceRecordingUri: uri,
      productionComplete: true,
    }));
  }, []);

  const submitMoralAnswer = useCallback((answerId: string) => {
    // Les questions morales sont toujours "correctes" (opinion)
    setState(prev => ({
      ...prev,
      productionComplete: true,
    }));
  }, []);

  // ============ UTILITAIRES ============

  const reset = useCallback(() => {
    setState(initialState);
    setStory(null);
    if (sound) {
      sound.unloadAsync();
      setSound(null);
    }
  }, [sound]);

  const getProgress = useCallback((): number => {
    const phases: GamePhase[] = [
      'intro',
      'mode_selection', 
      'story_discovery',
      'questions',
      'production',
      'victory'
    ];
    const currentIndex = phases.indexOf(state.phase);
    return (currentIndex + 1) / phases.length;
  }, [state.phase]);

  return {
    state,
    story,
    currentQuestion,
    selectStory,
    selectMode,
    startStory,
    finishStory,
    startQuestions: finishStory,
    startProduction,
    completeGame,
    playAudio,
    pauseAudio,
    seekAudio,
    replayCurrentParagraph,
    selectAnswer,
    requestHint,
    replayPassage,
    nextQuestion,
    submitImageOrder,
    submitCompletedSentences,
    submitVoiceRecording,
    submitMoralAnswer,
    reset,
    getProgress,
  };
};
```

---

## 🎨 Styles et Constantes

```typescript
// constants/conteurStyles.ts

import { StyleSheet } from 'react-native';
import { Colors, Spacing, FontFamily, FontSize } from '@/theme';

export const ConteurColors = {
  // Thème bibliothèque/lecture
  primary: '#5B8DEE',        // Bleu confiance
  secondary: '#9B59B6',      // Violet sagesse (Plume)
  background: '#FFF9F0',     // Crème papier
  paper: '#FFFBF5',          // Blanc cassé
  wood: '#8B5A2B',           // Bois bibliothèque
  gold: '#F5A623',           // Or (étoiles, récompenses)
  
  // Feedback
  correct: '#7BC74D',
  incorrect: '#FFB347',      // Orange doux (jamais rouge)
  hint: '#F39C12',
  
  // Texte
  text: '#2D3436',
  textLight: '#636E72',
  textOnDark: '#FFFFFF',
};

export const ConteurSizes = {
  // Cartes histoire
  storyCardWidth: 200,
  storyCardHeight: 280,
  
  // Boutons réponse
  answerButtonMinHeight: 100,
  answerButtonMinWidth: 150,
  
  // Mascotte
  mascotSmall: 80,
  mascotMedium: 120,
  mascotLarge: 180,
  
  // Zones tactiles
  touchTarget: 64,
  touchTargetLarge: 80,
};

export const styles = StyleSheet.create({
  // Container principal
  container: {
    flex: 1,
    backgroundColor: ConteurColors.background,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    backgroundColor: 'transparent',
  },
  
  // Zone de lecture
  storyContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
  },
  
  illustrationArea: {
    flex: 0.55,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  
  textArea: {
    flex: 0.45,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  
  // Texte histoire
  storyText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyLarge,
    lineHeight: FontSize.bodyLarge * 1.6,
    color: ConteurColors.text,
    letterSpacing: 0.5,
  },
  
  highlightedWord: {
    backgroundColor: 'rgba(91, 141, 238, 0.2)',
    borderRadius: 4,
  },
  
  // Carte histoire
  storyCard: {
    width: ConteurSizes.storyCardWidth,
    height: ConteurSizes.storyCardHeight,
    backgroundColor: ConteurColors.paper,
    borderRadius: 20,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  
  storyCardSelected: {
    borderWidth: 3,
    borderColor: ConteurColors.primary,
    shadowColor: ConteurColors.primary,
    shadowOpacity: 0.3,
  },
  
  // Questions
  questionContainer: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  
  questionText: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h3,
    color: ConteurColors.text,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  
  answersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  
  answerButton: {
    minWidth: ConteurSizes.answerButtonMinWidth,
    minHeight: ConteurSizes.answerButtonMinHeight,
    backgroundColor: ConteurColors.paper,
    borderRadius: 16,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  
  answerButtonSelected: {
    borderColor: ConteurColors.primary,
    backgroundColor: 'rgba(91, 141, 238, 0.1)',
  },
  
  answerButtonCorrect: {
    borderColor: ConteurColors.correct,
    backgroundColor: 'rgba(123, 199, 77, 0.15)',
  },
  
  answerButtonIncorrect: {
    borderColor: ConteurColors.incorrect,
    backgroundColor: 'rgba(255, 179, 71, 0.15)',
  },
  
  // Mascotte
  mascotContainer: {
    position: 'absolute',
    bottom: Spacing.xl,
    left: Spacing.xl,
    zIndex: 100,
  },
  
  speechBubble: {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: [{ translateX: -100 }],
    backgroundColor: ConteurColors.paper,
    borderRadius: 16,
    padding: Spacing.md,
    maxWidth: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  
  speechBubbleText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: ConteurColors.text,
    textAlign: 'center',
  },
  
  // Audio player
  audioPlayerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    backgroundColor: ConteurColors.paper,
    borderRadius: 24,
    marginHorizontal: Spacing.xl,
  },
  
  audioButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: ConteurColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  audioProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(91, 141, 238, 0.2)',
    borderRadius: 4,
  },
  
  audioProgressFill: {
    height: '100%',
    backgroundColor: ConteurColors.primary,
    borderRadius: 4,
  },
  
  // Progress bar
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  
  progressBar: {
    flex: 1,
    height: 12,
    backgroundColor: 'rgba(91, 141, 238, 0.2)',
    borderRadius: 6,
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: ConteurColors.primary,
    borderRadius: 6,
  },
  
  // Boutons action
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: ConteurColors.paper,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: ConteurColors.primary,
  },
  
  actionButtonText: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.button,
    color: ConteurColors.primary,
  },
  
  // Production - Images reorder
  imageReorderContainer: {
    flex: 1,
    padding: Spacing.xl,
  },
  
  dropZones: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  
  dropZone: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(91, 141, 238, 0.1)',
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: ConteurColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  draggableImage: {
    width: 110,
    height: 110,
    backgroundColor: ConteurColors.paper,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Voice recorder
  recorderContainer: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  
  recordButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: ConteurColors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ConteurColors.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  
  recordButtonActive: {
    backgroundColor: '#E74C3C',
    transform: [{ scale: 1.1 }],
  },
  
  recordingTimer: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h2,
    color: ConteurColors.text,
    marginTop: Spacing.lg,
  },
});
```

---

## 📍 Routes Expo Router

```typescript
// app/(games)/conteur-curieux/_layout.tsx

import { Stack } from 'expo-router';

export default function ConteurLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="story" />
      <Stack.Screen name="questions" />
      <Stack.Screen name="production" />
      <Stack.Screen 
        name="victory" 
        options={{
          animation: 'fade_from_bottom',
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}
```

```typescript
// app/(games)/conteur-curieux/index.tsx

import { ConteurIntroScreen } from '@/games/conteur-curieux/screens';

export default function ConteurIndex() {
  return <ConteurIntroScreen />;
}
```

---

## 🎬 Animations Reanimated

```typescript
// animations/conteurAnimations.ts

import { 
  withTiming, 
  withSpring, 
  withSequence,
  withDelay,
  Easing 
} from 'react-native-reanimated';

// Config Spring
export const springConfig = {
  gentle: { damping: 15, stiffness: 150 },
  bouncy: { damping: 10, stiffness: 200 },
  stiff: { damping: 20, stiffness: 300 },
};

// Animations Plume
export const plumeAnimations = {
  // Entrée mascotte
  enter: {
    opacity: withTiming(1, { duration: 400 }),
    translateY: withSpring(0, springConfig.bouncy),
    scale: withSpring(1, springConfig.bouncy),
  },
  
  // Battement d'ailes (joyeux)
  wingFlap: {
    rotate: withSequence(
      withTiming(-15, { duration: 100 }),
      withTiming(15, { duration: 100 }),
      withTiming(-15, { duration: 100 }),
      withTiming(0, { duration: 100 }),
    ),
  },
  
  // Tête penchée (curieux)
  headTilt: {
    rotate: withSpring(10, springConfig.gentle),
  },
  
  // Célébration
  celebrate: {
    scale: withSequence(
      withSpring(1.2, springConfig.bouncy),
      withSpring(1, springConfig.bouncy),
    ),
    translateY: withSequence(
      withSpring(-20, springConfig.bouncy),
      withSpring(0, springConfig.bouncy),
    ),
  },
};

// Animation bonne réponse
export const correctAnswerAnimation = {
  scale: withSequence(
    withSpring(1.05, springConfig.bouncy),
    withSpring(1, springConfig.gentle),
  ),
  backgroundColor: withTiming('rgba(123, 199, 77, 0.15)', { duration: 300 }),
  borderColor: withTiming('#7BC74D', { duration: 300 }),
};

// Animation mauvaise réponse (shake doux)
export const incorrectAnswerAnimation = {
  translateX: withSequence(
    withTiming(-8, { duration: 80 }),
    withTiming(8, { duration: 80 }),
    withTiming(-8, { duration: 80 }),
    withTiming(0, { duration: 80 }),
  ),
  backgroundColor: withTiming('rgba(255, 179, 71, 0.15)', { duration: 300 }),
};

// Animation highlight mot
export const wordHighlightAnimation = {
  backgroundColor: withSequence(
    withTiming('rgba(91, 141, 238, 0.4)', { duration: 200 }),
    withTiming('rgba(91, 141, 238, 0.2)', { duration: 200 }),
  ),
  scale: withSequence(
    withSpring(1.05, springConfig.gentle),
    withSpring(1, springConfig.gentle),
  ),
};

// Animation apparition bulle
export const speechBubbleAnimation = {
  opacity: withTiming(1, { duration: 200 }),
  scale: withSpring(1, springConfig.bouncy),
  translateY: withSpring(0, springConfig.gentle),
};

// Animation carte débloquée
export const cardUnlockAnimation = {
  rotateY: withSequence(
    withTiming(180, { duration: 600, easing: Easing.inOut(Easing.ease) }),
    withDelay(200, withTiming(0, { duration: 600, easing: Easing.inOut(Easing.ease) })),
  ),
  scale: withSequence(
    withTiming(0.8, { duration: 300 }),
    withSpring(1.1, springConfig.bouncy),
    withSpring(1, springConfig.gentle),
  ),
};
```

---

## 📱 Adaptations Responsive

```typescript
// utils/conteurResponsive.ts

import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const isTablet = width >= 768;
export const isLandscape = width > height;

export const responsiveValues = {
  // Tailles texte
  storyFontSize: isTablet ? 20 : 18,
  questionFontSize: isTablet ? 24 : 20,
  
  // Grille réponses
  answersPerRow: isTablet ? 4 : 2,
  answerCardWidth: isTablet ? 150 : 140,
  
  // Mascotte
  mascotSize: isTablet ? 120 : 80,
  
  // Illustration
  illustrationFlex: isTablet ? 0.55 : 0.4,
  textFlex: isTablet ? 0.45 : 0.6,
  
  // Marges
  screenPadding: isTablet ? 32 : 16,
  
  // Audio player
  audioPlayerHeight: isTablet ? 80 : 64,
};

// Adaptation par âge
export const getAgeAdaptations = (age: number) => ({
  touchTargetSize: age <= 7 ? 80 : 64,
  fontSize: age <= 7 ? 20 : 18,
  showEmojisInAnswers: age <= 8,
  requireAudioMode: age <= 7,
  maxQuestions: age <= 7 ? 4 : 6,
});
```

---

## 📋 Checklist Technique

### Avant implémentation
- [ ] Types TypeScript définis
- [ ] Structure fichiers créée
- [ ] Dépendances installées (`expo-av`, `expo-file-system`)

### Composants core
- [ ] PlumeMascot avec animations Lottie
- [ ] StoryReader avec surlignage synchronisé
- [ ] AudioPlayer avec contrôles accessibles
- [ ] QuestionCard avec feedback visuel
- [ ] VoiceRecorder avec permissions

### Logique métier
- [ ] useConteurGame hook complet
- [ ] Score calculator
- [ ] Progression manager

### Data
- [ ] 3+ histoires niveau 1
- [ ] Vocabulaire de base
- [ ] Scripts assistant complets
- [ ] Cartes à collectionner

### Tests
- [ ] Navigation entre phases
- [ ] Audio play/pause/seek
- [ ] Enregistrement vocal
- [ ] Calcul score correct
- [ ] Responsive iPad/iPhone

---

*Spécifications Techniques — Le Conteur Curieux*  
*Version 1.0 — Décembre 2024*
