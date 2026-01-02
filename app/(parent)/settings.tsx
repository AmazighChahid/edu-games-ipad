/**
 * Parent Settings Page
 * Enhanced settings with profile management, screen time limits, and more
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Switch,
  TextInput,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, spacing, borderRadius, shadows } from '../../src/theme';
import { useAppSettings, useActiveProfile, useStore } from '../../src/store';

const AVATAR_OPTIONS = ['👦', '👧', '🧒', '👶', '🦸', '🧙', '🐻', '🦊', '🐰', '🦁', '🐼', '🐨'];

export default function ParentSettings() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const settings = useAppSettings();

  // Profile state
  const activeProfile = useActiveProfile();
  const updateProfile = useStore((state) => state.updateProfile);
  const screenTimeSettings = useStore((state) => state.settings);
  const updateScreenTimeSettings = useStore((state) => state.updateSettings);

  // Modal states
  const [showNameModal, setShowNameModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [tempName, setTempName] = useState(activeProfile?.name || '');
  const [tempLimit, setTempLimit] = useState(
    screenTimeSettings.dailyLimitMinutes?.toString() || ''
  );

  const handleBack = () => {
    router.back();
  };

  const handleSaveName = () => {
    if (activeProfile && tempName.trim()) {
      updateProfile(activeProfile.id, { name: tempName.trim() });
    }
    setShowNameModal(false);
  };

  const handleSelectAvatar = (avatar: string) => {
    if (activeProfile) {
      updateProfile(activeProfile.id, { avatar });
    }
    setShowAvatarModal(false);
  };

  const handleSaveLimit = () => {
    const limit = parseInt(tempLimit, 10);
    updateScreenTimeSettings({
      dailyLimitMinutes: limit > 0 ? limit : undefined,
    });
    setShowLimitModal(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary.main, colors.primary.dark]}
        style={[styles.header, { paddingTop: insets.top + spacing[4] }]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>⚙️ Paramètres</Text>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + spacing[8] },
        ]}
      >
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profil Enfant</Text>
          <View style={styles.settingsCard}>
            <Pressable
              style={styles.actionRow}
              onPress={() => {
                setTempName(activeProfile?.name || '');
                setShowNameModal(true);
              }}
            >
              <View style={styles.actionInfo}>
                <Text style={styles.actionLabel}>Nom</Text>
                <Text style={styles.actionDescription}>
                  Comment appeler votre enfant
                </Text>
              </View>
              <View style={styles.actionValue}>
                <Text style={styles.actionValueText}>
                  {activeProfile?.name || 'Non défini'}
                </Text>
                <Text style={styles.chevron}>›</Text>
              </View>
            </Pressable>

            <View style={styles.divider} />

            <Pressable
              style={styles.actionRow}
              onPress={() => setShowAvatarModal(true)}
            >
              <View style={styles.actionInfo}>
                <Text style={styles.actionLabel}>Avatar</Text>
                <Text style={styles.actionDescription}>
                  Personnaliser l'icône du profil
                </Text>
              </View>
              <View style={styles.actionValue}>
                <Text style={styles.avatarPreview}>
                  {activeProfile?.avatar || '👦'}
                </Text>
                <Text style={styles.chevron}>›</Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Screen Time Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Temps d'écran</Text>
          <View style={styles.settingsCard}>
            <Pressable
              style={styles.actionRow}
              onPress={() => {
                setTempLimit(screenTimeSettings.dailyLimitMinutes?.toString() || '');
                setShowLimitModal(true);
              }}
            >
              <View style={styles.actionInfo}>
                <Text style={styles.actionLabel}>Limite quotidienne</Text>
                <Text style={styles.actionDescription}>
                  Temps de jeu maximum par jour
                </Text>
              </View>
              <View style={styles.actionValue}>
                <Text style={styles.actionValueText}>
                  {screenTimeSettings.dailyLimitMinutes
                    ? `${screenTimeSettings.dailyLimitMinutes} min`
                    : 'Aucune limite'}
                </Text>
                <Text style={styles.chevron}>›</Text>
              </View>
            </Pressable>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Rappel de pause</Text>
                <Text style={styles.settingDescription}>
                  Rappel après {screenTimeSettings.reminderAfterMinutes} min de jeu
                </Text>
              </View>
              <Switch
                value={screenTimeSettings.reminderEnabled}
                onValueChange={(value) =>
                  updateScreenTimeSettings({ reminderEnabled: value })
                }
                trackColor={{ false: colors.ui.disabled, true: colors.primary.light }}
                thumbColor={
                  screenTimeSettings.reminderEnabled
                    ? colors.primary.main
                    : colors.text.muted
                }
              />
            </View>
          </View>
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
                thumbColor={
                  settings.soundEnabled ? colors.primary.main : colors.text.muted
                }
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
                thumbColor={
                  settings.musicEnabled ? colors.primary.main : colors.text.muted
                }
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
                thumbColor={
                  settings.hapticEnabled ? colors.primary.main : colors.text.muted
                }
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
                <Text style={styles.settingLabel}>Assistant pédagogique</Text>
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
                  Proposer une aide après plusieurs erreurs
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

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Données</Text>
          <View style={styles.settingsCard}>
            <Pressable style={styles.actionRow}>
              <Text style={styles.actionLabel}>Exporter la progression</Text>
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>Bientôt</Text>
              </View>
            </Pressable>

            <View style={styles.divider} />

            <Pressable style={styles.actionRow}>
              <Text style={[styles.actionLabel, styles.dangerText]}>
                Réinitialiser la progression
              </Text>
              <Text style={[styles.chevron, styles.dangerText]}>›</Text>
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
              <Text style={styles.actionLabel}>Mentions légales</Text>
              <Text style={styles.chevron}>›</Text>
            </Pressable>

            <View style={styles.divider} />

            <Pressable style={styles.actionRow}>
              <Text style={styles.actionLabel}>Politique de confidentialité</Text>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Name Edit Modal */}
      <Modal visible={showNameModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nom de l'enfant</Text>
            <TextInput
              style={styles.textInput}
              value={tempName}
              onChangeText={setTempName}
              placeholder="Entrez le nom"
              placeholderTextColor={colors.text.muted}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setShowNameModal(false)}
              >
                <Text style={styles.modalButtonCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonConfirm}
                onPress={handleSaveName}
              >
                <Text style={styles.modalButtonConfirmText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Avatar Selection Modal */}
      <Modal visible={showAvatarModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choisir un avatar</Text>
            <View style={styles.avatarGrid}>
              {AVATAR_OPTIONS.map((avatar) => (
                <TouchableOpacity
                  key={avatar}
                  style={[
                    styles.avatarOption,
                    activeProfile?.avatar === avatar && styles.avatarOptionActive,
                  ]}
                  onPress={() => handleSelectAvatar(avatar)}
                >
                  <Text style={styles.avatarOptionText}>{avatar}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.modalButtonCancel}
              onPress={() => setShowAvatarModal(false)}
            >
              <Text style={styles.modalButtonCancelText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Screen Time Limit Modal */}
      <Modal visible={showLimitModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Limite quotidienne</Text>
            <Text style={styles.modalDescription}>
              Définir le temps de jeu maximum par jour (en minutes)
            </Text>
            <TextInput
              style={styles.textInput}
              value={tempLimit}
              onChangeText={setTempLimit}
              placeholder="Ex: 60"
              placeholderTextColor={colors.text.muted}
              keyboardType="number-pad"
              autoFocus
            />
            <Text style={styles.limitHint}>
              Laissez vide pour aucune limite
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setShowLimitModal(false)}
              >
                <Text style={styles.modalButtonCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonConfirm}
                onPress={handleSaveLimit}
              >
                <Text style={styles.modalButtonConfirmText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingBottom: spacing[4],
    paddingHorizontal: spacing[4],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonIcon: {
    fontSize: 20,
    color: colors.text.inverse,
  },
  headerTitle: {
    fontFamily: 'Fredoka',
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  headerSpacer: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing[6],
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.secondary,
    marginBottom: spacing[3],
    marginLeft: spacing[1],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  actionInfo: {
    flex: 1,
    marginRight: spacing[4],
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  actionDescription: {
    fontSize: 13,
    color: colors.text.muted,
    marginTop: 2,
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
  avatarPreview: {
    fontSize: 28,
  },
  chevron: {
    fontSize: 20,
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
  comingSoonBadge: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.sm,
  },
  comingSoonText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text.muted,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.ui.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[6],
  },
  modalContent: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    width: '100%',
    maxWidth: 400,
    ...shadows.lg,
  },
  modalTitle: {
    fontFamily: 'Fredoka',
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  modalDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  textInput: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing[4],
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.ui.border,
    marginBottom: spacing[4],
  },
  limitHint: {
    fontSize: 12,
    color: colors.text.muted,
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  modalButtonCancel: {
    flex: 1,
    padding: spacing[4],
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
  },
  modalButtonCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.secondary,
  },
  modalButtonConfirm: {
    flex: 1,
    padding: spacing[4],
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
  },
  modalButtonConfirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.inverse,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing[3],
    marginBottom: spacing[5],
  },
  avatarOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarOptionActive: {
    borderColor: colors.primary.main,
    backgroundColor: 'rgba(91, 141, 238, 0.1)',
  },
  avatarOptionText: {
    fontSize: 32,
  },
});
