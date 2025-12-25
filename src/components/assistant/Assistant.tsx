/**
 * Composant Assistant complet
 * Combine le personnage et la bulle de dialogue
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { AssistantCharacter } from './AssistantCharacter';
import { SpeechBubble } from './SpeechBubble';
import { Layout } from '../../constants';

interface AssistantProps {
  initialMessage?: string;
  showIntro?: boolean;
  onIntroComplete?: () => void;
}

// Messages prédéfinis
export const ASSISTANT_MESSAGES = {
  welcome: 'Bienvenue ! On va jouer à déplacer des disques.',
  rules: 'Le but est de tout mettre sur la tour de droite. Mais attention, un gros disque ne peut jamais être posé sur un plus petit !',
  ready: 'Tu es prêt ? À toi de jouer !',
  hint: 'Essaie de déplacer le plus petit disque en premier.',
  encouragement: 'Continue, tu y es presque !',
  victory: 'Bravo ! Tu as réussi ! Tu es un champion !',
  tryAgain: 'Ce n\'est pas grave, essaie encore !',
  invalidMove: 'Oups ! Ce disque est trop gros pour aller ici.',
};

export const Assistant: React.FC<AssistantProps> = ({
  initialMessage,
  showIntro = false,
  onIntroComplete,
}) => {
  const [message, setMessage] = useState<string | null>(initialMessage || null);
  const [mood, setMood] = useState<'idle' | 'happy' | 'thinking' | 'encouraging'>('idle');
  const [introStep, setIntroStep] = useState(0);

  // Séquence d'introduction
  useEffect(() => {
    if (showIntro) {
      const introMessages = [
        ASSISTANT_MESSAGES.welcome,
        ASSISTANT_MESSAGES.rules,
        ASSISTANT_MESSAGES.ready,
      ];

      if (introStep < introMessages.length) {
        setMessage(introMessages[introStep]);
        setMood('encouraging');

        const timer = setTimeout(() => {
          setIntroStep((prev) => prev + 1);
        }, 4000);

        return () => clearTimeout(timer);
      } else {
        setMessage(null);
        setMood('idle');
        onIntroComplete?.();
      }
    }
  }, [showIntro, introStep, onIntroComplete]);

  const handleDismiss = useCallback(() => {
    setMessage(null);
  }, []);

  // Fonction pour afficher un message externe
  const showMessage = useCallback((text: string, newMood?: typeof mood) => {
    setMessage(text);
    if (newMood) setMood(newMood);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.characterWrapper}>
        <SpeechBubble
          message={message || ''}
          visible={!!message}
          onDismiss={handleDismiss}
          position="top"
          autoHide={true}
          autoHideDelay={5000}
        />
        <AssistantCharacter mood={mood} size="medium" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Layout.spacing.lg,
    right: Layout.spacing.lg,
    zIndex: 50,
  },
  characterWrapper: {
    alignItems: 'center',
  },
});
