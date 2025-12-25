/**
 * Parent Settings Page
 * Allows parents to configure app settings
 */

import { View, Text, StyleSheet, Pressable, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, borderRadius, shadows } from '@/theme';
import { useAppSettings } from '@/store/useStore';

export default function ParentSettings() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const settings = useAppSettings();

  const handleBack = () => {
    router.back();
  };

  return (
    <ScrollView
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing[4],
          paddingLeft: insets.left + spacing[6],
          paddingRight: insets.right + spacing[6],
        },
      ]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Parametres</Text>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>Retour</Text>
        </Pressable>
      </View>

      {/* Audio Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Audio</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Effets sonores</Text>
              <Text style={styles.settingDescription}>
                Sons lors des actions du jeu
              </Text>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={settings.setSoundEnabled}
              trackColor={{ false: colors.ui.disabled, true: colors.primary.light }}
              thumbColor={settings.soundEnabled ? colors.primary.main : colors.text.muted}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Musique</Text>
              <Text style={styles.settingDescription}>
                Musique de fond pendant le jeu
              </Text>
            </View>
            <Switch
              value={settings.musicEnabled}
              onValueChange={settings.setMusicEnabled}
              trackColor={{ false: colors.ui.disabled, true: colors.primary.light }}
              thumbColor={settings.musicEnabled ? colors.primary.main : colors.text.muted}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Vibrations</Text>
              <Text style={styles.settingDescription}>
                Retour haptique lors des interactions
              </Text>
            </View>
            <Switch
              value={settings.hapticEnabled}
              onValueChange={settings.setHapticEnabled}
              trackColor={{ false: colors.ui.disabled, true: colors.primary.light }}
              thumbColor={settings.hapticEnabled ? colors.primary.main : colors.text.muted}
            />
          </View>
        </View>
      </View>

      {/* Game Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Jeu</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Assistant pedagogique</Text>
              <Text style={styles.settingDescription}>
                Personnage qui guide l'enfant
              </Text>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: colors.ui.disabled, true: colors.primary.light }}
              thumbColor={colors.primary.main}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Indices automatiques</Text>
              <Text style={styles.settingDescription}>
                Proposer une aide apres plusieurs erreurs
              </Text>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: colors.ui.disabled, true: colors.primary.light }}
              thumbColor={colors.primary.main}
            />
          </View>
        </View>
      </View>

      {/* Profile Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profil enfant</Text>
        <View style={styles.settingsCard}>
          <Pressable style={styles.actionRow}>
            <Text style={styles.actionLabel}>Nom de l'enfant</Text>
            <View style={styles.actionValue}>
              <Text style={styles.actionValueText}>Non defini</Text>
              <Text style={styles.chevron}>{'>'}</Text>
            </View>
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.actionRow}>
            <Text style={styles.actionLabel}>Age</Text>
            <View style={styles.actionValue}>
              <Text style={styles.actionValueText}>Non defini</Text>
              <Text style={styles.chevron}>{'>'}</Text>
            </View>
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.actionRow}>
            <Text style={styles.actionLabel}>Avatar</Text>
            <View style={styles.actionValue}>
              <Text style={styles.actionValueText}>Choisir</Text>
              <Text style={styles.chevron}>{'>'}</Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Donnees</Text>
        <View style={styles.settingsCard}>
          <Pressable style={styles.actionRow}>
            <Text style={styles.actionLabel}>Exporter la progression</Text>
            <Text style={styles.chevron}>{'>'}</Text>
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.actionRow}>
            <Text style={[styles.actionLabel, styles.dangerText]}>
              Reinitialiser la progression
            </Text>
            <Text style={[styles.chevron, styles.dangerText]}>{'>'}</Text>
          </Pressable>
        </View>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Application</Text>
        <View style={styles.settingsCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>

          <View style={styles.divider} />

          <Pressable style={styles.actionRow}>
            <Text style={styles.actionLabel}>Mentions legales</Text>
            <Text style={styles.chevron}>{'>'}</Text>
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.actionRow}>
            <Text style={styles.actionLabel}>Politique de confidentialite</Text>
            <Text style={styles.chevron}>{'>'}</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    paddingBottom: spacing[8],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
  },
  backButton: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.lg,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary.contrast,
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: spacing[3],
    marginLeft: spacing[1],
  },
  settingsCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[4],
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing[4],
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  settingDescription: {
    fontSize: 13,
    color: colors.text.muted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.ui.divider,
    marginHorizontal: spacing[4],
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[4],
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  actionValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  actionValueText: {
    fontSize: 14,
    color: colors.text.muted,
  },
  chevron: {
    fontSize: 16,
    color: colors.text.muted,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[4],
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  infoValue: {
    fontSize: 14,
    color: colors.text.muted,
  },
  dangerText: {
    color: colors.feedback.error,
  },
});
