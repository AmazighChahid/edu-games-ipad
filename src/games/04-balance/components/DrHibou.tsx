/**
 * Dr. Hibou Mascot Component
 * The wise owl scientist that guides children through the balance game
 * Features: Animated expressions, contextual dialogues, age-appropriate messages
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  withRepeat,
  Easing,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  ZoomIn,
} from 'react-native-reanimated';
import { colors, spacing, borderRadius, shadows } from '../../../theme';
import type { DialogueContext, MascotMood, Phase } from '../types';

// ============================================
// TYPES
// ============================================

interface DrHibouProps {
  mood?: MascotMood;
  message?: string;
  context?: DialogueContext;
  phase?: Phase;
  ageGroup?: '6-7' | '7-8' | '8-9' | '9-10';
  onMessageDismiss?: () => void;
  showBubble?: boolean;
  autoHideDelay?: number;
  size?: 'small' | 'medium' | 'large';
  position?: 'left' | 'right' | 'center';
}

// ============================================
// DIALOGUE SCRIPTS
// ============================================

const DIALOGUES: Record<DialogueContext, string[]> = {
  intro: [
    'Bienvenue dans mon laboratoire !\n\nJe suis Dr. Hibou, et j\'adore les expériences !',
    'Voici ma balance magique !\n\nElle peut mesurer tout ce qu\'on met dessus.',
    'Ton défi : faire en sorte qu\'elle soit bien droite, parfaitement équilibrée !',
  ],
  level_start: [
    'Nouvelle expérience !\n\nVoyons ce que tu vas découvrir...',
    'Prêt pour le défi ?\n\nObserve bien la balance !',
    'Commençons cette expérience !',
  ],
  first_move: [
    'Intéressant...\n\nVoyons ce qui se passe !',
    'Hmm... 🧐',
    'Observe la balance...',
  ],
  wrong_move: [
    'Intéressant résultat !\n\nEssaie autre chose.',
    'On apprend en expérimentant.\n\nContinue !',
    'Hmm, pas tout à fait...\n\nMais tu apprends !',
  ],
  close_balance: [
    'Oh ! Elle oscille !\n\nTu es tout près ! 🎯',
    'Elle hésite...\n\nC\'est presque parfait !',
    'Regarde comme elle balance...\n\nL\'équilibre est proche !',
  ],
  balanced: [
    '🎉 Eurêka !\n\nParfait équilibre !',
    'Magnifique ! ⚖️✨\n\nLa balance est parfaitement droite.',
    'Tu es un vrai scientifique !',
    'Expérience réussie !\n\nBrillant !',
  ],
  discovery: [
    '🎓 GRANDE DÉCOUVERTE !\n\nTu as prouvé une nouvelle équivalence !',
    'Eurêka !\n\nCette découverte va dans ton journal !',
    'Fascinant !\n\nQuelle belle découverte !',
  ],
  hint_1: [
    'Un conseil de scientifique ? 💡\n\nObserve bien la balance.\nDe quel côté penche-t-elle ?',
  ],
  hint_2: [
    'Hmm, réfléchissons ensemble...\n\nQue pourrais-tu faire pour équilibrer ?',
  ],
  hint_3: [
    'Et si tu essayais avec d\'autres objets ?\n\nRegarde ce qui est disponible...',
  ],
  hint_4: [
    'Je te montre un bon choix...\n\nCet objet pourrait aider !',
  ],
  hint_5: [
    'D\'accord, je t\'aide un peu plus.\n\nVoici ce qu\'il te faut...',
  ],
  idle: [
    'Prends ton temps,\nobserve bien...',
    'Qu\'est-ce que tu penses faire ?',
    'Expérimente,\nc\'est comme ça qu\'on apprend !',
  ],
  sandbox_start: [
    'Mode libre ! 🎨\n\nIci, pas d\'objectif.\nExpérimente !',
    'Découvre ce qui pèse pareil !\n\nAmuse-toi bien.',
  ],
  sandbox_discovery: [
    'Oh ! Tu as trouvé une équivalence !\n\nBelle découverte ! 🔬',
  ],
  victory: [
    'Expérience terminée ! 📊\n\nExcellent travail !',
    'Tu as bien expérimenté !\n\nC\'est comme ça qu\'on apprend.',
  ],
  badge_earned: [
    'Tu as gagné un badge ! 🏅\n\nTu le mérites bien, scientifique !',
  ],
};

// Phase-specific messages
const PHASE_INTROS: Record<Phase, string[]> = {
  1: [
    'Commençons simplement.\n\nMets la même chose à droite qu\'à gauche !',
    'Compte bien les objets !\n\nCombien en faut-il ?',
  ],
  2: [
    'Hmm, cette pastèque est lourde... 🍉\n\nCombien de pommes pour l\'équilibrer ?',
    'Nouvelle expérience !\n\nTrouve l\'équivalence.',
  ],
  3: [
    'Cette fois, les poids ont des nombres !\n\nComment faire le même total des deux côtés ?',
    'Excellent !\n\nPlusieurs solutions sont possibles...',
  ],
  4: [
    'Oh ! Un mystère à résoudre ! 🔍\n\nTu vois ce [?] ? C\'est l\'inconnue.',
    'Trouve sa valeur pour équilibrer !\n\nQue vaut le [?] cette fois ?',
  ],
};

// Age-adapted short messages
const AGE_MESSAGES: Record<'6-7' | '7-8' | '8-9' | '9-10', Record<string, string[]>> = {
  '6-7': {
    encourage: ['Bien !', 'Continue !', 'Bravo !'],
    balance: ['C\'est droit !', 'Parfait !', 'Super !'],
    hint: ['Ajoute à droite.', 'Compte les pommes.'],
  },
  '7-8': {
    encourage: ['Tu avances bien !', 'Belle progression !'],
    balance: ['Parfait équilibre !', 'Tu as réussi !'],
    hint: ['Observe la balance.', 'Essaie autre chose.'],
  },
  '8-9': {
    encourage: ['Bien raisonné !', 'Tu progresses !'],
    balance: ['Tu as trouvé !', 'Excellent calcul !'],
    hint: ['Cherche la bonne combinaison.'],
  },
  '9-10': {
    encourage: ['Excellent raisonnement !', 'Tu maîtrises !'],
    balance: ['Tu as résolu l\'équation !', 'Brillant !'],
    hint: ['Isole l\'inconnue.', 'Réfléchis aux deux côtés.'],
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function getRandomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

// ============================================
// OWL SVG-LIKE COMPONENT
// ============================================

interface OwlFaceProps {
  mood: MascotMood;
  size: number;
}

function OwlFace({ mood, size }: OwlFaceProps) {
  // Eye animations based on mood
  const eyeScale = useSharedValue(1);
  const eyebrowAngle = useSharedValue(0);
  const mouthWidth = useSharedValue(20);

  useEffect(() => {
    switch (mood) {
      case 'excited':
      case 'celebratory':
        eyeScale.value = withSequence(
          withSpring(1.3),
          withSpring(1.1),
          withRepeat(withSequence(
            withTiming(1.15, { duration: 300 }),
            withTiming(1.1, { duration: 300 }),
          ), 3, true)
        );
        mouthWidth.value = withSpring(30);
        break;
      case 'curious':
        eyeScale.value = withSpring(1.2);
        eyebrowAngle.value = withSpring(-5);
        break;
      case 'encouraging':
        eyeScale.value = withSpring(1);
        mouthWidth.value = withSpring(25);
        break;
      default:
        eyeScale.value = withSpring(1);
        eyebrowAngle.value = withSpring(0);
        mouthWidth.value = withSpring(20);
    }
  }, [mood]);

  const eyeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: eyeScale.value }],
  }));

  const scale = size / 80; // Base size is 80

  return (
    <View style={[styles.owlContainer, { width: size, height: size }]}>
      {/* Owl body */}
      <View style={[styles.owlBody, {
        width: size * 0.9,
        height: size * 0.85,
        borderRadius: size * 0.45,
      }]}>
        {/* Ear tufts */}
        <View style={[styles.earTuft, styles.earTuftLeft, {
          width: size * 0.15,
          height: size * 0.2,
          left: size * 0.1,
          top: -size * 0.08,
        }]} />
        <View style={[styles.earTuft, styles.earTuftRight, {
          width: size * 0.15,
          height: size * 0.2,
          right: size * 0.1,
          top: -size * 0.08,
        }]} />

        {/* Face disk */}
        <View style={[styles.faceDisk, {
          width: size * 0.7,
          height: size * 0.6,
          borderRadius: size * 0.35,
          top: size * 0.1,
        }]}>
          {/* Eyes */}
          <View style={styles.eyesContainer}>
            <Animated.View style={[styles.eye, eyeStyle, {
              width: size * 0.22,
              height: size * 0.22,
              borderRadius: size * 0.11,
            }]}>
              <View style={[styles.pupil, {
                width: size * 0.1,
                height: size * 0.1,
                borderRadius: size * 0.05,
              }]}>
                <View style={[styles.eyeHighlight, {
                  width: size * 0.04,
                  height: size * 0.04,
                  borderRadius: size * 0.02,
                }]} />
              </View>
            </Animated.View>
            <Animated.View style={[styles.eye, eyeStyle, {
              width: size * 0.22,
              height: size * 0.22,
              borderRadius: size * 0.11,
            }]}>
              <View style={[styles.pupil, {
                width: size * 0.1,
                height: size * 0.1,
                borderRadius: size * 0.05,
              }]}>
                <View style={[styles.eyeHighlight, {
                  width: size * 0.04,
                  height: size * 0.04,
                  borderRadius: size * 0.02,
                }]} />
              </View>
            </Animated.View>
          </View>

          {/* Beak */}
          <View style={[styles.beak, {
            borderLeftWidth: size * 0.06,
            borderRightWidth: size * 0.06,
            borderTopWidth: size * 0.1,
            top: size * 0.35,
          }]} />
        </View>

        {/* Glasses */}
        <View style={[styles.glassesFrame, {
          width: size * 0.65,
          height: size * 0.18,
          top: size * 0.15,
        }]}>
          <View style={[styles.glassLens, {
            width: size * 0.2,
            height: size * 0.16,
            borderRadius: size * 0.08,
          }]} />
          <View style={[styles.glassesBridge, {
            width: size * 0.08,
            height: 2,
          }]} />
          <View style={[styles.glassLens, {
            width: size * 0.2,
            height: size * 0.16,
            borderRadius: size * 0.08,
          }]} />
        </View>
      </View>
    </View>
  );
}

// ============================================
// SPEECH BUBBLE
// ============================================

interface SpeechBubbleProps {
  message: string;
  position: 'left' | 'right' | 'center';
  onDismiss?: () => void;
}

function SpeechBubble({ message, position, onDismiss }: SpeechBubbleProps) {
  return (
    <Animated.View
      entering={ZoomIn.springify().damping(12)}
      exiting={FadeOut.duration(200)}
      style={[
        styles.bubble,
        position === 'left' && styles.bubbleLeft,
        position === 'right' && styles.bubbleRight,
      ]}
    >
      <TouchableOpacity
        onPress={onDismiss}
        activeOpacity={0.9}
        style={styles.bubbleContent}
      >
        <Text style={styles.bubbleText}>{message}</Text>
        <Text style={styles.tapToContinue}>Touche pour continuer</Text>
      </TouchableOpacity>

      {/* Bubble tail */}
      <View style={[
        styles.bubbleTail,
        position === 'right' && styles.bubbleTailRight,
      ]} />
    </Animated.View>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function DrHibou({
  mood = 'neutral',
  message,
  context,
  phase,
  ageGroup = '6-7',
  onMessageDismiss,
  showBubble = true,
  autoHideDelay = 0,
  size = 'medium',
  position = 'left',
}: DrHibouProps) {
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const autoHideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Size mapping
  const sizeMap = {
    small: 60,
    medium: 80,
    large: 100,
  };
  const owlSize = sizeMap[size];

  // Get message from context or use provided message
  useEffect(() => {
    let newMessage = message;

    if (!newMessage && context) {
      const contextMessages = DIALOGUES[context];
      if (contextMessages) {
        newMessage = getRandomMessage(contextMessages);
      }
    }

    // Add phase-specific intro if applicable
    if (!newMessage && phase && context === 'level_start') {
      const phaseMessages = PHASE_INTROS[phase];
      if (phaseMessages) {
        newMessage = getRandomMessage(phaseMessages);
      }
    }

    setCurrentMessage(newMessage || null);
  }, [message, context, phase]);

  // Auto-hide functionality
  useEffect(() => {
    if (autoHideDelay > 0 && currentMessage) {
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current);
      }
      autoHideTimeoutRef.current = setTimeout(() => {
        handleDismiss();
      }, autoHideDelay);
    }

    return () => {
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current);
      }
    };
  }, [currentMessage, autoHideDelay]);

  const handleDismiss = useCallback(() => {
    setCurrentMessage(null);
    onMessageDismiss?.();
  }, [onMessageDismiss]);

  // Entrance animation
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 12 });
    opacity.value = withTiming(1, { duration: 300 });
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        position === 'left' && styles.containerLeft,
        position === 'right' && styles.containerRight,
        position === 'center' && styles.containerCenter,
        containerStyle,
      ]}
    >
      {/* Speech bubble */}
      {showBubble && currentMessage && (
        <SpeechBubble
          message={currentMessage}
          position={position}
          onDismiss={handleDismiss}
        />
      )}

      {/* Owl character */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          if (!currentMessage) {
            // Show idle message when tapped without active message
            const idleMessages = DIALOGUES.idle;
            setCurrentMessage(getRandomMessage(idleMessages));
          }
        }}
      >
        <View style={[styles.characterContainer, {
          width: owlSize + 20,
          height: owlSize + 20,
        }]}>
          {/* Lab coat hint */}
          <View style={[styles.labCoat, {
            width: owlSize * 0.6,
            height: owlSize * 0.3,
            bottom: 0,
            borderRadius: owlSize * 0.1,
          }]} />

          <OwlFace mood={mood} size={owlSize} />
        </View>
      </TouchableOpacity>

      {/* Name tag */}
      <View style={styles.nameTag}>
        <Text style={styles.nameText}>Dr. Hibou</Text>
      </View>
    </Animated.View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing[2],
  },
  containerLeft: {
    alignItems: 'flex-start',
  },
  containerRight: {
    alignItems: 'flex-end',
  },
  containerCenter: {
    alignItems: 'center',
  },

  // Character
  characterContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  labCoat: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  // Owl
  owlContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  owlBody: {
    backgroundColor: colors.home.owl.brown,
    alignItems: 'center',
    position: 'relative',
  },
  earTuft: {
    position: 'absolute',
    backgroundColor: colors.home.owl.brownDark,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  earTuftLeft: {
    transform: [{ rotate: '-20deg' }],
  },
  earTuftRight: {
    transform: [{ rotate: '20deg' }],
  },
  faceDisk: {
    backgroundColor: '#FFF5E6',
    alignItems: 'center',
    position: 'absolute',
  },
  eyesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  eye: {
    backgroundColor: colors.home.owl.eye,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  pupil: {
    backgroundColor: colors.home.owl.pupil,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingLeft: 3,
    paddingTop: 3,
  },
  eyeHighlight: {
    backgroundColor: '#FFFFFF',
  },
  beak: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.home.owl.beak,
  },
  glassesFrame: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassLens: {
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  glassesBridge: {
    backgroundColor: '#333',
  },

  // Name tag
  nameTag: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.small,
    marginTop: -spacing[1],
  },
  nameText: {
    color: colors.text.inverse,
    fontSize: 10,
    fontWeight: '600',
  },

  // Speech bubble
  bubble: {
    maxWidth: 280,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.large,
    padding: spacing[4],
    ...shadows.medium,
    borderWidth: 2,
    borderColor: colors.primary.light,
    marginBottom: spacing[2],
  },
  bubbleLeft: {
    marginLeft: 30,
  },
  bubbleRight: {
    marginRight: 30,
  },
  bubbleContent: {
    gap: spacing[2],
  },
  bubbleText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.primary,
    textAlign: 'center',
  },
  tapToContinue: {
    fontSize: 11,
    color: colors.text.muted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -10,
    left: 30,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.background.card,
  },
  bubbleTailRight: {
    left: undefined,
    right: 30,
  },
});

export default DrHibou;
