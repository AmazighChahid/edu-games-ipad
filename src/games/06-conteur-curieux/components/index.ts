/**
 * Conteur Curieux Components Index
 *
 * Note: SpeechBubble and ConfettiAnimation have been factorized to @/components/common
 * - Use SpeechBubble from '../../../components/common' with colorScheme="conteur"
 * - Use Confetti from '../../../components/common' with type="shapes"
 */

// Existing components
export { StoryReader } from './StoryReader';
export { QuestionCard } from './QuestionCard';

// Mascot & Dialogue
export { PlumeMascot } from './PlumeMascot';

// Intro Screen Components
export { StoryCard } from './StoryCard';
export { FilterTabs } from './FilterTabs';
export { ModeSelectionModal } from './ModeSelectionModal';

// Story Screen Components
export { AudioPlayer } from './AudioPlayer';
export { VocabularyBubble } from './VocabularyBubble';

// Questions Screen Components
export { AnswerButton } from './AnswerButton';
export { FeedbackOverlay } from './FeedbackOverlay';

// Victory Screen Components
export { CollectibleCard } from './CollectibleCard';
export { StarsRow } from './StarsRow';
export { SkillBadge } from './SkillBadge';
export { RaysEffect } from './RaysEffect';

// Parent Dashboard Components
export { RadarChart } from './RadarChart';
export { RecordingsList } from './RecordingsList';

// Background & Illustrations
export { LibraryBackground } from './LibraryBackground';
export { StoryIllustration } from './StoryIllustration';

// Re-export from common for backward compatibility
export { SpeechBubble, Confetti as ConfettiAnimation } from '../../../components/common';
