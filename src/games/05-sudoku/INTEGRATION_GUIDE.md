# 🚀 Sudoku Components - Integration Guide

## Quick Start

This guide shows you how to integrate the new Sudoku components into your screens.

---

## 📦 Import Components

```typescript
import {
  // Background & Decorations
  SudokuBackground,
  LibraryDecoration,

  // Mascot
  ProfessorHooMascot,

  // Game HUD
  StatsPanel,
  GameTimer,
  ProgressBar,
  FloatingActionButtons,

  // Grid Components
  SudokuGrid,
  SudokuCell,
  SymbolSelector,
} from '@/games/sudoku/components';
```

---

## 🎨 Example: Complete Game Screen

```typescript
import { View, StyleSheet } from 'react-native';
import { ProfessorHooMascot, SudokuBackground, StatsPanel, GameTimer, ProgressBar, SudokuGrid, SymbolSelector, FloatingActionButtons } from '../components';
import { useSudokuGame } from '../hooks/useSudokuGame';

export function SudokuGameScreen({ config }) {
  const {
    gameState,
    selectedSymbol,
    errorCount,
    handleCellPress,
    handleSymbolSelect,
    handleClearCell,
    handleHint,
    handleReset,
    handleVerify,
  } = useSudokuGame({ config });

  // Calculate progress
  const filledCells = gameState.grid.cells.flat().filter(c => c.value !== null).length;
  const totalCells = config.size * config.size;
  const progress = filledCells / totalCells;

  // Mascot message based on game state
  const getMascotMessage = () => {
    if (gameState.isComplete) {
      return { message: 'Bravo ! Tu as complété la grille ! 🎉', type: 'victory' as const };
    }
    if (errorCount > 5) {
      return { message: 'Prends ton temps, tu vas y arriver ! 💪', type: 'encourage' as const };
    }
    if (progress > 0.7) {
      return { message: 'Plus que quelques cases ! Tu y es presque ! ✨', type: 'encourage' as const };
    }
    return { message: 'Regarde bien les lignes et colonnes ! 🤔', type: 'hint' as const };
  };

  const mascotState = getMascotMessage();

  return (
    <SudokuBackground>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {/* Back button, title, etc. */}
        </View>

        {/* Professor Hoo Mascot */}
        <View style={styles.mascotContainer}>
          <ProfessorHooMascot
            message={mascotState.message}
            type={mascotState.type}
          />
        </View>

        {/* Game Timer (centered at top) */}
        <View style={styles.timerContainer}>
          <GameTimer
            startTime={gameState.startTime}
            isActive={!gameState.isComplete}
          />
        </View>

        {/* Stats Panel (top right) */}
        <View style={styles.statsContainer}>
          <StatsPanel
            errorCount={errorCount}
            hintsUsed={gameState.hintsUsed}
            onReset={handleReset}
          />
        </View>

        {/* Grid */}
        <View style={styles.gridContainer}>
          <SudokuGrid
            grid={gameState.grid}
            selectedCell={gameState.selectedCell}
            onCellPress={handleCellPress}
            showConflicts={config.showConflicts}
          />
        </View>

        {/* Progress Bar */}
        <ProgressBar
          current={filledCells}
          total={totalCells}
        />

        {/* Symbol Selector */}
        <SymbolSelector
          symbols={gameState.grid.symbols}
          onSymbolSelect={handleSymbolSelect}
          selectedSymbol={selectedSymbol}
          onClear={handleClearCell}
          theme={config.theme}
        />

        {/* Floating Action Buttons */}
        <FloatingActionButtons
          onHint={handleHint}
          onValidate={handleVerify}
          hintsRemaining={3 - gameState.hintsUsed}
        />
      </View>
    </SudokuBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  mascotContainer: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    zIndex: 15,
  },
  timerContainer: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  statsContainer: {
    position: 'absolute',
    top: 90,
    right: 40,
    zIndex: 10,
  },
  gridContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
});
```

---

## 🎭 Professor Hoo Message Types

```typescript
type OwlMessageType = 'intro' | 'hint' | 'encourage' | 'victory';

// Examples:
<ProfessorHooMascot
  message="Choisis ta grille et lance-toi ! 🎯"
  type="intro"
/>

<ProfessorHooMascot
  message="Regarde la 2ème ligne... 🤔"
  type="hint"
/>

<ProfessorHooMascot
  message="Tu vas y arriver ! 💪"
  type="encourage"
/>

<ProfessorHooMascot
  message="BRAVO ! 🎉"
  type="victory"
/>
```

---

## 🎬 Cell Animations

To trigger success/error animations on cells, you need to track state changes:

```typescript
// In your game hook or component
const [recentAction, setRecentAction] = useState<{
  row: number;
  col: number;
  success: boolean;
} | null>(null);

const handleSymbolSelect = (symbol: SudokuValue) => {
  const { row, col } = gameState.selectedCell;
  const isValid = validatePlacement(gameState.grid, row, col, symbol);

  // Track the action
  setRecentAction({ row, col, success: isValid.valid });

  // Clear after animation
  setTimeout(() => setRecentAction(null), 500);

  // ... rest of logic
};

// In render:
<SudokuCell
  cell={cell}
  // ... other props
  triggerSuccess={recentAction?.row === row && recentAction?.col === col && recentAction?.success}
  triggerError={recentAction?.row === row && recentAction?.col === col && !recentAction?.success}
/>
```

---

## 🎨 Customization Examples

### Change Mascot Position
```tsx
<View style={{ position: 'absolute', top: 100, left: 50 }}>
  <ProfessorHooMascot message="..." type="intro" />
</View>
```

### Style Stats Panel
The StatsPanel uses internal styling, but you can wrap it:
```tsx
<View style={{ opacity: 0.9, transform: [{ scale: 0.95 }] }}>
  <StatsPanel ... />
</View>
```

### Custom Progress Bar Width
Edit [ProgressBar.tsx](components/ProgressBar.tsx) line 43:
```typescript
width: 400, // Change from 300 to your desired width
```

---

## 🔊 Adding Sound Effects

1. Add sound files to `assets/sounds/sudoku/`:
   - `success.mp3`
   - `error.mp3`
   - `hint.mp3`
   - `victory.mp3`

2. Use the useSound hook (already in codebase):

```typescript
import { useSound } from '@/hooks/useSound';

export function SudokuGameScreen() {
  const { playSound } = useSound();

  const handleSymbolSelect = (symbol) => {
    const isValid = validate(...);

    if (isValid) {
      playSound('success');
    } else {
      playSound('error');
    }

    // ... rest of logic
  };

  const handleHint = () => {
    playSound('hint');
    // ... rest of logic
  };
}
```

---

## 📱 Layout Positions (Matching HTML Mockup)

Based on 1194×834 iPad frame:

```typescript
const LAYOUT = {
  mascot: { top: 90, left: 40 },
  timer: { top: 90, centerX: true },
  statsPanel: { top: 90, right: 40 },
  floatingButtons: { right: 40, bottom: 100 },
  symbolSelector: { bottom: 0 }, // Fixed at bottom
  bookshelf: { bottom: 0, height: 100 },
};
```

---

## ⚡ Performance Tips

1. **Memoize Grid Cells**
```typescript
const gridCells = useMemo(() =>
  gameState.grid.cells,
  [gameState.grid]
);
```

2. **Throttle Timer Updates**
The GameTimer already updates only once per second.

3. **Lazy Load Animations**
Animations are only active when needed (e.g., clouds only float when visible).

---

## 🐛 Common Issues

### Issue: Animations not working
**Solution:** Ensure `react-native-reanimated` is properly configured in `babel.config.js`:
```javascript
plugins: ['react-native-reanimated/plugin'],
```

### Issue: Fonts not loading (Fredoka)
**Solution:** Check if fonts are loaded in app entry:
```typescript
import { useFonts, Fredoka_400Regular, Fredoka_700Bold } from '@expo-google-fonts/fredoka';
```

### Issue: Haptics not working
**Solution:** Haptics only work on physical devices, not simulators.

### Issue: LibraryDecoration overlaps content
**Solution:** LibraryDecoration has `pointerEvents: 'none'` and is positioned absolutely. Ensure content has proper z-index.

---

## 📸 Screenshots of Components

(You can add screenshots here when testing on device)

---

## 🎯 Next Steps

1. Integrate components into `SudokuIntroScreen.tsx`
2. Test on iPad simulator
3. Test on physical iPad device
4. Add sound effects
5. Fine-tune animations
6. Test with different grid sizes (4×4, 6×6, 9×9)
7. Test with different themes (fruits, animals, shapes, colors, numbers)

---

*Happy Coding! 🚀*
