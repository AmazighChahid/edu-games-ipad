/**
 * ProfileSwitcherModal - Modal to switch between user profiles
 * Displays all profiles and allows switching or creating new ones
 */

import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ChildProfile } from '@/types';
import { ProfileCard } from './ProfileCard';

interface ProfileSwitcherModalProps {
  visible: boolean;
  onClose: () => void;
  profiles: ChildProfile[];
  activeProfileId: string | null;
  onSwitchProfile: (profileId: string) => void;
  onCreateProfile: () => void;
}

export const ProfileSwitcherModal = memo(({
  visible,
  onClose,
  profiles,
  activeProfileId,
  onSwitchProfile,
  onCreateProfile,
}: ProfileSwitcherModalProps) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <Animated.View
          entering={SlideInDown.duration(300)}
          exiting={SlideOutDown.duration(250)}
          style={[styles.container, { paddingBottom: insets.bottom + 20 }]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.handle} />
            <Text style={styles.title}>Qui joue ?</Text>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed,
              ]}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          {/* Profiles List */}
          <ScrollView
            style={styles.profilesList}
            contentContainerStyle={styles.profilesContent}
            showsVerticalScrollIndicator={false}
          >
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                isActive={profile.id === activeProfileId}
                onPress={() => onSwitchProfile(profile.id)}
              />
            ))}
          </ScrollView>

          {/* Add Profile Button */}
          <Pressable
            onPress={onCreateProfile}
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.addButtonPressed,
            ]}
          >
            <LinearGradient
              colors={['#7BC74D', '#5BA030']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.addButtonGradient}
            >
              <Text style={styles.addButtonIcon}>+</Text>
              <Text style={styles.addButtonText}>Ajouter un profil</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
});

ProfileSwitcherModal.displayName = 'ProfileSwitcherModal';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    backgroundColor: '#FFF9F0',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '80%',
    paddingTop: 12,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#D0D0D0',
    borderRadius: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2D3436',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonPressed: {
    backgroundColor: '#E0E0E0',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  profilesList: {
    flex: 1,
  },
  profilesContent: {
    padding: 20,
  },
  addButton: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#7BC74D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 12,
  },
  addButtonIcon: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '700',
  },
  addButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
});
