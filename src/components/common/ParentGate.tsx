/**
 * Parent Gate component
 * Math question protection for parent space
 */

import { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, textStyles, borderRadius, shadows, touchTargets } from '../../theme';

interface ParentGateProps {
  onUnlock: () => void;
}

export function ParentGate({ onUnlock }: ParentGateProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [answer, setAnswer] = useState('');
  const [showError, setShowError] = useState(false);

  const { a, b, correctAnswer } = useMemo(() => {
    const num1 = Math.floor(Math.random() * 20) + 10;
    const num2 = Math.floor(Math.random() * 15) + 5;
    return { a: num1, b: num2, correctAnswer: num1 + num2 };
  }, []);

  const handleSubmit = () => {
    if (parseInt(answer, 10) === correctAnswer) {
      setShowError(false);
      onUnlock();
    } else {
      setShowError(true);
      setAnswer('');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing[8],
          paddingBottom: insets.bottom + spacing[4],
          paddingLeft: insets.left + spacing[6],
          paddingRight: insets.right + spacing[6],
        },
      ]}
    >
      <View style={styles.card}>
        <Text style={styles.title}>{t('parent.title')}</Text>

        <Text style={styles.question}>
          {t('parent.gate.question', { a, b })}
        </Text>

        <TextInput
          style={styles.input}
          value={answer}
          onChangeText={setAnswer}
          keyboardType="number-pad"
          placeholder={t('parent.gate.placeholder')}
          placeholderTextColor={colors.text.muted}
          autoFocus
        />

        {showError && (
          <Text style={styles.error}>{t('parent.gate.incorrect')}</Text>
        )}

        <View style={styles.buttons}>
          <Pressable
            onPress={handleBack}
            style={[styles.button, styles.buttonSecondary]}
          >
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
              {t('common.back')}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleSubmit}
            style={[styles.button, styles.buttonPrimary]}
            disabled={!answer}
          >
            <Text style={styles.buttonText}>{t('parent.gate.submit')}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[8],
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    ...shadows.lg,
  },
  title: {
    ...textStyles.h2,
    color: colors.text.primary,
    marginBottom: spacing[6],
  },
  question: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing[4],
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: touchTargets.large,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing[4],
    fontSize: textStyles.h3.fontSize,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  error: {
    ...textStyles.body,
    color: colors.feedback.error,
    marginBottom: spacing[4],
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing[4],
    marginTop: spacing[4],
  },
  button: {
    minWidth: 120,
    height: touchTargets.medium,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[5],
  },
  buttonPrimary: {
    backgroundColor: colors.primary.main,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.ui.border,
  },
  buttonText: {
    ...textStyles.button,
    color: colors.primary.contrast,
  },
  buttonTextSecondary: {
    color: colors.text.secondary,
  },
});
