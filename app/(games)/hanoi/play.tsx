import { useLocalSearchParams } from 'expo-router';
import { HanoiPlayScreen } from '@/games/hanoi/screens';

export default function HanoiPlay() {
  const { levelId } = useLocalSearchParams<{ levelId?: string }>();
  return <HanoiPlayScreen levelId={levelId} />;
}
