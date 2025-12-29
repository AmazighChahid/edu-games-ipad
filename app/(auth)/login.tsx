/**
 * Login Screen
 * Écran de connexion (email/password + magic link)
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

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signIn, sendMagicLink, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const validate = useCallback(() => {
    const newErrors: { email?: string; password?: string } = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password]);

  const handleLogin = useCallback(async () => {
    if (!validate()) return;

    const result = await signIn(email.trim(), password);

    if (result.success) {
      router.replace('/');
    } else {
      Alert.alert('Erreur', result.error || 'Connexion échouée');
    }
  }, [email, password, signIn, validate, router]);

  const handleMagicLink = useCallback(async () => {
    if (!email.trim()) {
      setErrors({ email: 'Email requis pour le magic link' });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Email invalide' });
      return;
    }

    const result = await sendMagicLink(email.trim());

    if (result.success) {
      setMagicLinkSent(true);
      Alert.alert(
        'Email envoyé ! 📧',
        'Vérifie ta boîte mail et clique sur le lien pour te connecter.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('Erreur', result.error || 'Envoi échoué');
    }
  }, [email, sendMagicLink]);

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
          <Text style={styles.emoji}>🦉</Text>
          <Text style={styles.title}>Content de te revoir !</Text>
          <Text style={styles.subtitle}>Connecte-toi pour continuer</Text>
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
            placeholder="••••••"
            icon="🔒"
            value={password}
            onChangeText={setPassword}
            isPassword
            autoComplete="password"
            error={errors.password}
          />

          <AuthButton
            label="Se connecter"
            onPress={handleLogin}
            variant="primary"
            isLoading={isLoading}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <AuthButton
            label={magicLinkSent ? 'Email envoyé !' : 'Connexion par email magique'}
            onPress={handleMagicLink}
            variant="secondary"
            icon="✨"
            disabled={magicLinkSent}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Pas encore de compte ?</Text>
          <Link href={'/(auth)/signup' as Href} asChild>
            <AuthButton label="Créer un compte" onPress={() => {}} variant="ghost" />
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.ui.border,
  },
  dividerText: {
    fontFamily: 'Nunito',
    fontSize: 14,
    color: colors.text.muted,
    paddingHorizontal: 16,
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
