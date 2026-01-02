/**
 * AuthInput
 * Input stylisé pour les formulaires d'authentification
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Pressable,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';

interface AuthInputProps extends TextInputProps {
  label: string;
  error?: string;
  icon?: string;
  isPassword?: boolean;
}

export function AuthInput({
  label,
  error,
  icon,
  isPassword,
  value,
  onFocus,
  onBlur,
  ...props
}: AuthInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: error
      ? colors.feedback.error
      : isFocused
        ? colors.primary.main
        : colors.ui.border,
  }));

  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true);
    scale.value = withSpring(1.02, { damping: 15 });
    onFocus?.(e);
  };

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);
    scale.value = withSpring(1, { damping: 15 });
    onBlur?.(e);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Animated.View style={[styles.inputContainer, animatedStyle]}>
        {icon && <Text style={styles.icon}>{icon}</Text>}

        <TextInput
          style={styles.input}
          placeholderTextColor={colors.text.muted}
          secureTextEntry={isPassword && !showPassword}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
        />

        {isPassword && (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
            hitSlop={12}
          >
            <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '🙈'}</Text>
          </Pressable>
        )}
      </Animated.View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontFamily: 'Nunito',
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 16,
    height: 56,
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'Nunito',
    fontSize: 18,
    color: colors.text.primary,
  },
  eyeButton: {
    padding: 4,
  },
  eyeIcon: {
    fontSize: 20,
  },
  error: {
    fontFamily: 'Nunito',
    fontSize: 14,
    color: colors.feedback.error,
    marginTop: 4,
  },
});

export default AuthInput;
