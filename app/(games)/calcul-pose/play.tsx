/**
 * Calcul Posé play route
 */

import { useLocalSearchParams } from 'expo-router';
import { CalculPosePlayScreen } from '@/games/calcul-pose/screens';

export default function CalculPosePlay() {
  const { levelId } = useLocalSearchParams<{ levelId?: string }>();
  return <CalculPosePlayScreen levelId={levelId} />;
}
