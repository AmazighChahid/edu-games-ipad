/**
 * Assistant state slice
 * Manages the pedagogical guidance layer
 */

import { StateCreator } from 'zustand';
import type { AssistantMessage, AssistantMood } from '@/types';

export interface AssistantState {
  isVisible: boolean;
  currentMessage: AssistantMessage | null;
  mood: AssistantMood;
  messageQueue: AssistantMessage[];
}

export interface AssistantActions {
  showMessage: (message: AssistantMessage) => void;
  hideMessage: () => void;
  setMood: (mood: AssistantMood) => void;
  queueMessage: (message: AssistantMessage) => void;
  nextMessage: () => void;
  clearQueue: () => void;
}

export type AssistantSlice = AssistantState & AssistantActions;

export const initialAssistantState: AssistantState = {
  isVisible: false,
  currentMessage: null,
  mood: 'neutral',
  messageQueue: [],
};

export const createAssistantSlice: StateCreator<AssistantSlice, [], [], AssistantSlice> = (
  set,
  get
) => ({
  ...initialAssistantState,

  showMessage: (message) => {
    set({
      isVisible: true,
      currentMessage: message,
      mood: message.mood,
    });
  },

  hideMessage: () => {
    set({
      isVisible: false,
      currentMessage: null,
    });
    // Process next message in queue after hiding
    const queue = get().messageQueue;
    if (queue.length > 0) {
      setTimeout(() => {
        get().nextMessage();
      }, 300);
    }
  },

  setMood: (mood) => set({ mood }),

  queueMessage: (message) => {
    const { isVisible, messageQueue } = get();
    if (!isVisible && messageQueue.length === 0) {
      set({
        isVisible: true,
        currentMessage: message,
        mood: message.mood,
      });
    } else {
      set({
        messageQueue: [...messageQueue, message],
      });
    }
  },

  nextMessage: () => {
    const queue = get().messageQueue;
    if (queue.length > 0) {
      const [next, ...rest] = queue;
      set({
        isVisible: true,
        currentMessage: next,
        mood: next.mood,
        messageQueue: rest,
      });
    }
  },

  clearQueue: () => {
    set({
      isVisible: false,
      currentMessage: null,
      messageQueue: [],
      mood: 'neutral',
    });
  },
});
