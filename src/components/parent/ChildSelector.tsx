/**
 * Child Selector Component
 * Dropdown for selecting child profile (prepared for multi-profile)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../theme';
import { useStore, useActiveProfile, useProfiles } from '../../store';
import type { ChildProfile } from '../../types';

interface ChildSelectorProps {
  variant?: 'light' | 'dark';
}

export function ChildSelector({ variant = 'dark' }: ChildSelectorProps) {
  const [showModal, setShowModal] = useState(false);
  const activeProfile = useActiveProfile();
  const profiles = useProfiles();
  const setActiveProfile = useStore((state) => state.setActiveProfile);

  const handleSelectProfile = (profile: ChildProfile) => {
    setActiveProfile(profile.id);
    setShowModal(false);
  };

  const isLight = variant === 'light';

  return (
    <>
      <TouchableOpacity
        style={[
          styles.selector,
          isLight ? styles.selectorLight : styles.selectorDark,
        ]}
        onPress={() => setShowModal(true)}
        activeOpacity={0.7}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{activeProfile?.avatar || '👦'}</Text>
        </View>
        <Text style={[styles.name, isLight && styles.nameLight]}>
          {activeProfile?.name || 'Mon Enfant'}
        </Text>
        <Text style={[styles.arrow, isLight && styles.arrowLight]}>▼</Text>
      </TouchableOpacity>

      {/* Selection Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sélectionner un profil</Text>

            <FlatList
              data={profiles}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.profileItem,
                    item.id === activeProfile?.id && styles.profileItemActive,
                  ]}
                  onPress={() => handleSelectProfile(item)}
                >
                  <Text style={styles.profileAvatar}>{item.avatar}</Text>
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{item.name}</Text>
                    {item.id === activeProfile?.id && (
                      <Text style={styles.profileActive}>Actif</Text>
                    )}
                  </View>
                  {item.id === activeProfile?.id && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />

            {/* Add profile button (for future) */}
            <TouchableOpacity style={styles.addButton} disabled>
              <Text style={styles.addButtonText}>+ Ajouter un profil</Text>
              <Text style={styles.comingSoon}>Bientôt</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: 30,
  },
  selectorDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  selectorLight: {
    backgroundColor: colors.background.secondary,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.inverse,
  },
  nameLight: {
    color: colors.text.primary,
  },
  arrow: {
    fontSize: 10,
    color: colors.text.inverse,
    opacity: 0.8,
  },
  arrowLight: {
    color: colors.text.muted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[6],
  },
  modalContent: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[5],
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
    marginBottom: spacing[5],
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    padding: spacing[4],
    borderRadius: borderRadius.md,
  },
  profileItemActive: {
    backgroundColor: 'rgba(91, 141, 238, 0.1)',
  },
  profileAvatar: {
    fontSize: 32,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  profileActive: {
    fontSize: 12,
    color: colors.primary.main,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 20,
    color: colors.primary.main,
    fontWeight: '700',
  },
  separator: {
    height: 1,
    backgroundColor: colors.ui.border,
    marginHorizontal: spacing[4],
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    marginTop: spacing[5],
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
    opacity: 0.5,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary.main,
  },
  comingSoon: {
    fontSize: 10,
    color: colors.text.muted,
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
});
