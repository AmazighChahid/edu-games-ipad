/**
 * ProfileCreationFlow - Multi-step flow for creating a new profile
 * Steps: Name -> Avatar -> Age Group
 */

import React, { memo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  SlideInLeft,
  SlideOutRight,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import type { AgeGroup } from '@/types';
import { AvatarPicker, AVATAR_OPTIONS } from './AvatarPicker';
import { AgeGroupSelector } from './AgeGroupSelector';

type Step = 'name' | 'avatar' | 'age';

interface ProfileCreationFlowProps {
  visible: boolean;
  onClose: () => void;
  onComplete: (data: { name: string; avatar: string; ageGroup: AgeGroup }) => void;
}

export const ProfileCreationFlow = memo(({
  visible,
  onClose,
  onComplete,
}: ProfileCreationFlowProps) => {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<string>(AVATAR_OPTIONS[0]);
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const resetForm = useCallback(() => {
    setStep('name');
    setName('');
    setAvatar(AVATAR_OPTIONS[0]);
    setAgeGroup(null);
    setDirection('forward');
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const goNext = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDirection('forward');
    if (step === 'name') setStep('avatar');
    else if (step === 'avatar') setStep('age');
  }, [step]);

  const goBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDirection('backward');
    if (step === 'avatar') setStep('name');
    else if (step === 'age') setStep('avatar');
  }, [step]);

  const handleComplete = useCallback(() => {
    if (name.trim() && avatar && ageGroup) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onComplete({ name: name.trim(), avatar, ageGroup });
      resetForm();
    }
  }, [name, avatar, ageGroup, onComplete, resetForm]);

  const canProceed = () => {
    if (step === 'name') return name.trim().length >= 2;
    if (step === 'avatar') return !!avatar;
    if (step === 'age') return !!ageGroup;
    return false;
  };

  const enteringAnimation = direction === 'forward' ? SlideInRight : SlideInLeft;
  const exitingAnimation = direction === 'forward' ? SlideOutLeft : SlideOutRight;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={[
              styles.container,
              { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              {step !== 'name' ? (
                <Pressable
                  onPress={goBack}
                  style={({ pressed }) => [
                    styles.backButton,
                    pressed && styles.backButtonPressed,
                  ]}
                >
                  <Text style={styles.backButtonText}>←</Text>
                </Pressable>
              ) : (
                <View style={styles.backButton} />
              )}

              <View style={styles.progress}>
                <View style={[styles.progressDot, step === 'name' && styles.progressDotActive]} />
                <View style={[styles.progressDot, step === 'avatar' && styles.progressDotActive]} />
                <View style={[styles.progressDot, step === 'age' && styles.progressDotActive]} />
              </View>

              <Pressable
                onPress={handleClose}
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.closeButtonPressed,
                ]}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>

            {/* Content */}
            <View style={styles.content}>
              {step === 'name' && (
                <Animated.View
                  key="name"
                  entering={enteringAnimation.duration(250)}
                  exiting={exitingAnimation.duration(200)}
                  style={styles.stepContainer}
                >
                  <Text style={styles.stepEmoji}>👋</Text>
                  <Text style={styles.stepTitle}>Comment tu t'appelles ?</Text>
                  <TextInput
                    style={styles.nameInput}
                    value={name}
                    onChangeText={setName}
                    placeholder="Ton prénom"
                    placeholderTextColor="#AAA"
                    autoFocus
                    maxLength={20}
                    returnKeyType="next"
                    onSubmitEditing={() => canProceed() && goNext()}
                  />
                </Animated.View>
              )}

              {step === 'avatar' && (
                <Animated.View
                  key="avatar"
                  entering={enteringAnimation.duration(250)}
                  exiting={exitingAnimation.duration(200)}
                  style={styles.stepContainer}
                >
                  <AvatarPicker
                    selectedAvatar={avatar}
                    onSelect={setAvatar}
                  />
                </Animated.View>
              )}

              {step === 'age' && (
                <Animated.View
                  key="age"
                  entering={enteringAnimation.duration(250)}
                  exiting={exitingAnimation.duration(200)}
                  style={styles.stepContainer}
                >
                  <AgeGroupSelector
                    selectedAgeGroup={ageGroup}
                    onSelect={setAgeGroup}
                  />
                </Animated.View>
              )}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Pressable
                onPress={step === 'age' ? handleComplete : goNext}
                disabled={!canProceed()}
                style={({ pressed }) => [
                  styles.nextButton,
                  !canProceed() && styles.nextButtonDisabled,
                  pressed && canProceed() && styles.nextButtonPressed,
                ]}
              >
                <LinearGradient
                  colors={canProceed() ? ['#5B8DEE', '#3A6DD8'] : ['#CCC', '#BBB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.nextButtonGradient}
                >
                  <Text style={styles.nextButtonText}>
                    {step === 'age' ? 'Créer mon profil' : 'Suivant'}
                  </Text>
                  {step !== 'age' && <Text style={styles.nextButtonArrow}>→</Text>}
                </LinearGradient>
              </Pressable>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
});

ProfileCreationFlow.displayName = 'ProfileCreationFlow';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
    marginHorizontal: 20,
    marginVertical: 40,
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    backgroundColor: '#E0E0E0',
  },
  backButtonText: {
    fontSize: 24,
    color: '#666',
  },
  progress: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#DDD',
  },
  progressDotActive: {
    backgroundColor: '#5B8DEE',
    width: 24,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonPressed: {
    backgroundColor: '#E0E0E0',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  stepContainer: {
    paddingHorizontal: 20,
  },
  stepEmoji: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D3436',
    textAlign: 'center',
    marginBottom: 32,
  },
  nameInput: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    fontSize: 24,
    fontWeight: '600',
    color: '#2D3436',
    textAlign: 'center',
    borderWidth: 3,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  nextButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#5B8DEE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonDisabled: {
    shadowOpacity: 0.1,
  },
  nextButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  nextButtonText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  nextButtonArrow: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '700',
  },
});
