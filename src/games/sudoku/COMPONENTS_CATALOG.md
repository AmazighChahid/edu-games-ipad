# 🎨 Sudoku Components Catalog

Visual reference for all Sudoku Montessori components.

---

## 🦉 ProfessorHooMascot

```
┌──────────────────────────────────────┐
│                                      │
│   ┌────┐    ╔════════════════╗     │
│   │ 🦉 │───▶║ Professeur Hoo:  ║     │
│   │/O O\│   ║ Choisis ta grille║     │
│   │ vvv │   ║ et lance-toi! 🎯 ║     │
│   │  ▼  │   ╚════════════════╝     │
│   └────┘                             │
│                                      │
└──────────────────────────────────────┘

Features:
✓ Wise owl with glasses
✓ Bobbing animation (2s cycle)
✓ Contextual speech bubble
✓ 4 message types: intro, hint, encourage, victory
✓ Smooth fade in/out

Dimensions:
- Owl: 70×80px
- Bubble: max-width 280px
- Gap: 12px
```

---

## 📊 StatsPanel

```
┌─────────────────────────────────────┐
│                                     │
│  Erreurs      │   Indices     ↻    │
│     0         │      3             │
│  (red)        │   (blue)     reset │
│                                     │
└─────────────────────────────────────┘

Features:
✓ White card with shadow
✓ Error count (red: #E57373)
✓ Hints used (blue: #5B8DEE)
✓ Vertical divider
✓ Reset button with animation

Dimensions:
- Height: auto
- Padding: 18px × 24px
- Border radius: 20px
- Gap between items: 24px
```

---

## ⏱️ GameTimer

```
┌──────────────┐
│   ⏱️  2:34   │
└──────────────┘

Features:
✓ Real-time MM:SS format
✓ Fredoka font
✓ Updates every 1 second
✓ White card with shadow

Dimensions:
- Padding: 10px × 20px
- Border radius: 16px
- Icon: 20px
- Time font: 24px
```

---

## 📈 ProgressBar

```
┌────────────────────────────────────────┐
│ ████████████░░░░░░░   12 / 16 cases   │
└────────────────────────────────────────┘

Features:
✓ Green gradient fill (#7BC74D)
✓ Smooth width animation
✓ Highlighted current count
✓ "X / Y cases" format

Dimensions:
- Bar width: 300px
- Bar height: 16px
- Border radius: 8px
- Gap: 16px
```

---

## 🎮 FloatingActionButtons

```
           ╔═══╗
           ║ 💡║ ← Hint (orange)
           ╚═══╝   Badge: 3
             ↓
           ╔═══╗
           ║ ✓ ║ ← Validate (green)
           ╚═══╝

Features:
✓ Hint button with badge counter
✓ Validate button
✓ Scale animation on press
✓ Haptic feedback
✓ Strong shadows

Dimensions:
- Button: 64×64px circle
- Gap: 12px
- Badge: 24×24px circle
- Position: right: 40px, bottom: 120px
```

---

## 🏛️ LibraryDecoration

```
       ☁️    ⭐      ☁️       ⭐
          ⭐              ☁️



          ⭐                  ⭐
    🌿                            🌿
   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
   ║║║║║║║║║║       ║║║║║║║║║║
   ╠╬╬╬╬╬╣           ╠╬╬╬╬╬╬╬╣
   ════════════════════════════════

Features:
✓ 3 animated clouds (float horizontally)
✓ 5 twinkling stars (opacity + scale pulse)
✓ Bookshelf with 10 colorful books
✓ 2 plant pots with leaves
✓ Non-interactive (pointerEvents: 'none')

Elements:
- Clouds: Various sizes (65-90px wide)
- Stars: 20×20px
- Bookshelf: 100px height
- Books: 22-30px wide, 55-75px tall
- Plants: 50px wide
```

---

## 🎯 SudokuCell (Enhanced)

```
Normal          Selected        Error           Success
┌─────┐        ┌─────┐         ┌─────┐         ┌─────┐
│     │        │ 🍎  │ blue    │ 🍌  │ shake   │ 🍇  │ pop
│     │        │     │ border  │     │ red     │     │ green
└─────┘        └─────┘         └─────┘         └─────┘

Fixed          Conflict
┌─────┐        ┌─────┐
│ 🍊  │        │ 🍎  │ orange
│     │ cream  │     │ border
└─────┘        └─────┘

Animations:
✓ Selection: scale 1 → 0.95 → 1
✓ Success: scale 1 → 1.2 → 1 (pop)
✓ Error: translateX -5→5→-5→5→0 (shake)

States:
- Normal: white background
- Fixed: cream (#FFF9F0)
- Selected: light blue (#BEE3F8)
- Conflict: light orange (#FFE5D9)
- Success: light green (temporary)

Size: Dynamic (64-80px based on grid)
```

---

## 🎨 SymbolSelector

```
┌────────────────────────────────────────┐
│ ┌───┐ ┌───┐ ┌───┐ ┌───┐      ┌───┐  │
│ │ 🍎│ │ 🍌│ │ 🍇│ │ 🍊│  ... │ ✗ │  │
│ └───┘ └───┘ └───┘ └───┘      └───┘  │
└────────────────────────────────────────┘

Features:
✓ Dynamic symbols based on theme
✓ Selection highlight (blue border)
✓ Clear button (orange)
✓ Scale animation on press
✓ Haptic feedback

Dimensions:
- Button: 64×64px
- Border radius: 12px
- Gap: 8px
- Symbol size: 32px (emoji) or 28px (numbers)
```

---

## 🎨 SudokuBackground

```
╔════════════════════════════════════╗
║  Sky Gradient (4 stops)            ║
║  #E8F4FD → #D4ECFB → #C9E4F7 → #B8D4E8
║                                    ║
║  [LibraryDecoration Overlaid]     ║
║                                    ║
║  [Children Content Here]           ║
║                                    ║
╚════════════════════════════════════╝

Features:
✓ Smooth sky gradient background
✓ Integrated LibraryDecoration
✓ Matches HTML mockup colors exactly

Gradient locations:
- 0%: Top (#E8F4FD)
- 40%: Mid-top (#D4ECFB)
- 70%: Mid-bottom (#C9E4F7)
- 100%: Bottom (#B8D4E8)
```

---

## 🎨 SudokuGrid

```
┌─────────────────────────┐
│  ┌──┬──┐│┌──┬──┐       │
│  │  │  │││  │  │        │
│  ├──┼──┤│├──┼──┤        │
│  │  │  │││  │  │        │
│  ├──┴──┤│├──┴──┤  4×4   │
│  ├──┬──┤│├──┬──┤        │
│  │  │  │││  │  │        │
│  ├──┼──┤│├──┼──┤        │
│  │  │  │││  │  │        │
│  └──┴──┘│└──┴──┘        │
└─────────────────────────┘

Features:
✓ Dynamic sizing (4×4, 6×6, 9×9)
✓ Box borders (thicker lines)
✓ Cell highlighting
✓ Conflict visualization
✓ Responsive cell sizing (64-80px)

Box dimensions:
- 4×4: 2×2 boxes
- 6×6: 2×3 boxes
- 9×9: 3×3 boxes
```

---

## 🎨 Color Palette Reference

### Primary Colors
```
Blue:    #5B8DEE ████
Green:   #7BC74D ████
Orange:  #FFB347 ████
Red:     #E57373 ████
```

### Background Colors
```
Sky Top:     #E8F4FD ████
Sky Mid-Top: #D4ECFB ████
Sky Mid-Bot: #C9E4F7 ████
Sky Bottom:  #B8D4E8 ████
Card White:  #FFFFFF ████
Cream:       #FFF9F0 ████
```

### Text Colors
```
Dark:    #4A4A4A ████
Medium:  #7A7A7A ████
Light:   #9A9A9A ████
```

### Library Theme
```
Bookshelf:  #8B7355 ████
Books:      Various bright colors
Plant:      #27AE60 ████
Pot:        #D35400 ████
Cloud:      #FFFFFF ████
Star:       #FFD700 ████
```

---

## 📏 Standard Dimensions

### Spacing
```
xs:  4px
sm:  8px
md:  16px
lg:  24px
xl:  32px
```

### Border Radius
```
sm:  8px
md:  12px
lg:  16px
xl:  20px
full: 9999px (circles)
```

### Touch Targets
```
minimum:     48px (iOS HIG)
recommended: 64px (for children)
large:       80px
```

---

## 🎬 Animation Timing Reference

```
Quick tap:       100ms
Smooth:          300ms
Medium:          500ms
Slow/Dramatic:   800ms

Easing functions:
- In/Out:  For most UI
- Spring:  For playful interactions
- Linear:  For shake effects
```

---

## 📦 Component Dependencies

```
All Components:
├── react-native (core)
├── react-native-reanimated (animations)
├── expo-haptics (feedback)
└── @/theme (colors, spacing, shadows)

SudokuBackground:
└── expo-linear-gradient

StatsPanel, GameTimer:
└── @/store/useStore (haptic settings)

Game Components:
└── ../types (SudokuValue, SudokuGrid, etc.)
```

---

## 🎯 Usage Patterns

### Simple Component
```tsx
<GameTimer
  startTime={new Date()}
  isActive={true}
/>
```

### Component with Callbacks
```tsx
<StatsPanel
  errorCount={5}
  hintsUsed={2}
  onReset={() => console.log('Reset!')}
/>
```

### Component with State
```tsx
<ProfessorHooMascot
  message={isComplete ? "Bravo!" : "Continue!"}
  type={isComplete ? "victory" : "hint"}
/>
```

### Animated Component
```tsx
<SudokuCell
  cell={cellData}
  isSelected={true}
  onPress={handlePress}
  cellSize={72}
  showConflict={true}
  triggerSuccess={justPlacedCorrect}
  triggerError={justPlacedWrong}
/>
```

---

*Visual Catalog | Sudoku Montessori Components*
*Version 1.0 | December 2025*
