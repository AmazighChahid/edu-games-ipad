/**
 * Assistant system types
 * Defines the pedagogical guidance layer
 */

// ============================================
// ASSISTANT MOOD & STATE
// ============================================

export type AssistantMood =
  | 'neutral'
  | 'happy'
  | 'encouraging'
  | 'celebrating'
  | 'thinking';

export type AssistantTrigger =
  | 'game_start'
  | 'first_move'
  | 'invalid_move'
  | 'repeated_invalid'
  | 'stuck'
  | 'hint_requested'
  | 'good_progress'
  | 'near_victory'
  | 'victory';

// ============================================
// ASSISTANT MESSAGES
// ============================================

export interface AssistantMessage {
  id: string;
  text: string;
  textKey?: string;
  duration: number;
  voiceAsset?: string;
  mood: AssistantMood;
  triggerType: AssistantTrigger;
}

export interface AssistantScript {
  id: string;
  trigger: AssistantTrigger;
  gameId?: string;
  condition?: (context: AssistantContext) => boolean;
  messages: Omit<AssistantMessage, 'triggerType'>[];
  priority: number;
}

export interface AssistantContext {
  gameId: string;
  moveCount: number;
  invalidMoves: number;
  consecutiveInvalidMoves: number;
  idleTimeSeconds: number;
  hintsUsed: number;
  levelProgress: number;
}

// ============================================
// ASSISTANT STATE
// ============================================

export interface AssistantState {
  isVisible: boolean;
  currentMessage: AssistantMessage | null;
  mood: AssistantMood;
  messageQueue: AssistantMessage[];
}
