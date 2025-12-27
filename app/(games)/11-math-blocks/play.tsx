import { useLocalSearchParams } from 'expo-router';
import { MathPlayScreen } from '../../../src/games/11-math-blocks/screens';

export default function MathBlocksPlay() {
  const { levelId } = useLocalSearchParams<{ levelId?: string }>();
  return <MathPlayScreen levelId={levelId} />;
}
