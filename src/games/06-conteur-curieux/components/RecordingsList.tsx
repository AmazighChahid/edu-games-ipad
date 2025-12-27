/**
 * RecordingsList Component
 *
 * Liste des enregistrements audio de l'enfant
 * Permet d'écouter les productions orales
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  ListRenderItemInfo,
} from 'react-native';
import { Audio } from 'expo-av';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { colors, spacing, borderRadius, shadows, fontFamily } from '@/theme';
import type { ChildRecording } from '../types';

interface RecordingsListProps {
  recordings: ChildRecording[];
  onDelete?: (recordingId: string) => void;
  emptyMessage?: string;
}

export function RecordingsList({
  recordings,
  onDelete,
  emptyMessage = 'Aucun enregistrement pour le moment',
}: RecordingsListProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Cleanup sound on unmount
  React.useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // Play/Stop recording
  const handlePlayStop = useCallback(
    async (recording: ChildRecording) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      try {
        // If already playing this recording, stop it
        if (playingId === recording.id && sound) {
          await sound.stopAsync();
          await sound.unloadAsync();
          setSound(null);
          setPlayingId(null);
          return;
        }

        // Stop any currently playing sound
        if (sound) {
          await sound.stopAsync();
          await sound.unloadAsync();
        }

        // Load and play the new recording
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: recording.uri },
          { shouldPlay: true }
        );

        setSound(newSound);
        setPlayingId(recording.id);

        // When playback finishes
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setPlayingId(null);
            newSound.unloadAsync();
            setSound(null);
          }
        });
      } catch (error) {
        console.error('Error playing recording:', error);
        Alert.alert('Erreur', 'Impossible de lire l\'enregistrement');
        setPlayingId(null);
      }
    },
    [playingId, sound]
  );

  // Delete recording
  const handleDelete = useCallback(
    (recording: ChildRecording) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      Alert.alert(
        'Supprimer l\'enregistrement ?',
        `Enregistrement pour "${recording.storyTitle}"`,
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Supprimer',
            style: 'destructive',
            onPress: () => onDelete?.(recording.id),
          },
        ]
      );
    },
    [onDelete]
  );

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render item
  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<ChildRecording>) => {
      const isPlaying = playingId === item.id;

      return (
        <Animated.View entering={FadeInUp.delay(index * 50).duration(300)}>
          <View style={styles.recordingCard}>
            <View style={styles.recordingInfo}>
              <Text style={styles.recordingEmoji}>{item.storyEmoji}</Text>
              <View style={styles.recordingDetails}>
                <Text style={styles.recordingTitle} numberOfLines={1}>
                  {item.storyTitle}
                </Text>
                <Text style={styles.recordingMeta}>
                  {formatDate(item.date)} • {formatDuration(item.duration)}
                </Text>
              </View>
            </View>

            <View style={styles.recordingActions}>
              <Pressable
                style={[styles.playButton, isPlaying && styles.playButtonActive]}
                onPress={() => handlePlayStop(item)}
              >
                <Text style={styles.playButtonText}>
                  {isPlaying ? '⏹️' : '▶️'}
                </Text>
              </Pressable>

              {onDelete && (
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item)}
                >
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </Pressable>
              )}
            </View>
          </View>
        </Animated.View>
      );
    },
    [playingId, handlePlayStop, handleDelete, onDelete]
  );

  // Empty component
  const ListEmptyComponent = (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🎙️</Text>
      <Text style={styles.emptyText}>{emptyMessage}</Text>
      <Text style={styles.emptySubtext}>
        Les enregistrements apparaîtront ici après avoir terminé une histoire
      </Text>
    </View>
  );

  return (
    <FlatList
      data={recordings}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={ListEmptyComponent}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: spacing[2],
    flexGrow: 1,
  },
  separator: {
    height: spacing[2],
  },
  recordingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.sm,
  },
  recordingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recordingEmoji: {
    fontSize: 32,
    marginRight: spacing[3],
  },
  recordingDetails: {
    flex: 1,
  },
  recordingTitle: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
    color: '#2D3748',
    marginBottom: spacing[1],
  },
  recordingMeta: {
    fontSize: 12,
    color: '#718096',
    fontFamily: fontFamily.regular,
  },
  recordingActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#9B59B6',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  playButtonActive: {
    backgroundColor: '#E74C3C',
  },
  playButtonText: {
    fontSize: 18,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[8],
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing[3],
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fontFamily.medium,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  emptySubtext: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    paddingHorizontal: spacing[4],
  },
});

export default RecordingsList;
