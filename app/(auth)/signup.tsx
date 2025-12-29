/**
 * Signup Screen
 * Écran d'inscription
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, Link, Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { AuthInput, AuthButton } from '@/components/auth';
import { colors } from '@/theme/colors';

export default function SignupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signUp, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = useCallback(() => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email invalide';
    }

    if (!password) {
      newErrors.password = 'Mot de passe requis';
    } else if (password.length < 6) {
      newErrors.password = 'Minimum 6 caractères';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmation requise';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password, confirmPassword]);

  const handleSignup = useCallback(async () => {
    if (!validate()) return;

    const result = await signUp(email.trim(), password);

    if (result.success) {
      if (result.needsEmailConfirmation) {
        Alert.alert(
          'Vérifie ta boîte mail ! 📧',
          'Clique sur le lien dans l\'email pour activer ton compte.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(auth)/login' as Href),
            },
          ]
        );
      } else {
        // Connexion automatique, aller créer le premier profil
        router.replace('/');
      }
    } else {
      Alert.alert('Erreur', result.error || 'Inscription échouée');
    }
  }, [email, password, signUp, validate, router]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.title}>Créer ton compte</Text>
          <Text style={styles.subtitle}>C'est rapide et gratuit !</Text>
        </View>

        <View style={styles.form}>
          <AuthInput
            label="Email"
            placeholder="ton@email.com"
            icon="📧"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoComplete="email"
            error={errors.email}
          />

          <AuthInput
            label="Mot de passe"
            placeholder="Minimum 6 caractères"
            icon="🔒"
            value={password}
            onChangeText={setPassword}
            isPassword
            autoComplete="new-password"
            error={errors.password}
          />

          <AuthInput
            label="Confirmer le mot de passe"
            placeholder="Répète ton mot de passe"
            icon="🔒"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isPassword
            autoComplete="new-password"
            error={errors.confirmPassword}
          />

          <AuthButton
            label="Créer mon compte"
            onPress={handleSignup}
            variant="primary"
            isLoading={isLoading}
            icon="🚀"
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Déjà un compte ?</Text>
          <Link href={'/(auth)/login' as Href} asChild>
            <AuthButton label="Se connecter" onPress={() => {}} variant="ghost" />
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Fredoka',
    fontSize: 28,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Nunito',
    fontSize: 18,
    color: colors.text.secondary,
    marginTop: 8,
  },
  form: {
    gap: 20,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingTop: 24,
  },
  footerText: {
    fontFamily: 'Nunito',
    fontSize: 16,
    color: colors.text.secondary,
  },
});
