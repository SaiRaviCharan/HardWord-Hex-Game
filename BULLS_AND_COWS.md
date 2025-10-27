# Bulls & Cows Implementation

## Overview
HardWord Hex now uses the classic "Bulls and Cows" feedback system instead of showing individual letter colors. This makes the game more challenging and strategic.

## What Changed

### Previous System (Wordle-style)
- ✅ Green tiles: Correct letter in correct position
- 🟨 Yellow tiles: Correct letter in wrong position  
- ⬜ Gray tiles: Letter not in word
- Keyboard keys also changed colors

### New System (Bulls & Cows)
- 🎯 **Bulls**: Number of letters in the correct position
- 🐄 **Cows**: Number of correct letters in the wrong position
- All letter tiles remain neutral gray
- Keyboard remains uniform gray

## How It Works

### Example 1
**Target Word:** `HOUSE`  
**Your Guess:** `HORSE`

Result:
- 🎯 Bulls: **4** (H, O, S, E are in correct positions)
- 🐄 Cows: **0** (R is not in the word)

### Example 2
**Target Word:** `BREAD`  
**Your Guess:** `BEARD`

Result:
- 🎯 Bulls: **3** (E, A, D are in correct positions)
- 🐄 Cows: **2** (B and R are in the word but wrong positions)

### Example 3
**Target Word:** `CRANE`  
**Your Guess:** `BEACH`

Result:
- 🎯 Bulls: **1** (A is in correct position)
- 🐄 Cows: **2** (C and E are in the word but wrong positions)

## Visual Design

After each guess, you'll see two indicators next to the word:

```
R O A D      🎯 2  🐄 1
R E S T      🎯 1  🐄 2
```

- Green badge with 🎯 emoji and number = Bulls
- Yellow badge with 🐄 emoji and number = Cows

## Algorithm

The Bulls and Cows calculation follows these steps:

1. **First Pass - Count Bulls**
   - Compare each letter position
   - Mark exact matches as "used"
   - Count increases for each exact match

2. **Second Pass - Count Cows**
   - For remaining letters (not bulls)
   - Find if they exist elsewhere in the target
   - Only count each letter once
   - Mark matched letters as "used"

3. **Display**
   - Show counts in styled badges
   - Green for bulls (🎯)
   - Yellow for cows (🐄)

## Code Changes

### Files Modified:
1. **`src/components/GameBoard.tsx`**
   - Removed color-coding logic
   - Added `calculateBullsAndCows()` function
   - Added visual badges for Bulls & Cows display
   - All tiles now show as neutral gray

2. **`src/components/Keyboard.tsx`**
   - Removed color feedback on keys
   - Simplified to uniform gray buttons
   - Removed unused props (guesses, targetWord)

3. **`src/components/Game.tsx`**
   - Updated Keyboard component props
   - Removed unnecessary prop passing

4. **`src/app/page.tsx`**
   - Updated "How to Play" instructions
   - Added Bulls & Cows explanation
   - Removed color-coding documentation
   - Added example scenarios

## Benefits of Bulls & Cows

### Increased Challenge
- Players must use logical deduction
- Can't rely on visual color patterns
- Requires tracking information mentally or on paper

### Classic Gaming
- Based on the original "Mastermind" board game
- Bulls and Cows dates back to the 1970s
- More strategic than color feedback

### Cleaner UI
- Simpler visual design
- Less color distraction
- Focus on the puzzle itself

## Strategy Tips

1. **Track Your Guesses**
   - Write down previous guesses
   - Note the Bulls & Cows counts
   - Eliminate impossible letters

2. **Use Process of Elimination**
   - If Bulls = 0, no letters are in correct positions
   - If Cows = 0, no letters from guess are in word
   - If Bulls + Cows = word length, you have all letters

3. **Strategic Guessing**
   - Start with common vowels (A, E, I, O, U)
   - Use different letters in early guesses
   - Once you have high Bulls count, test positions

4. **Winning Condition**
   - When Bulls = word length (4 or 5)
   - All letters are in correct positions
   - You win! 🎉

## Technical Details

### Bulls & Cows Calculation
```typescript
const calculateBullsAndCows = (guess: string): { bulls: number; cows: number } => {
  let bulls = 0;
  let cows = 0;
  const usedTarget: boolean[] = [];
  const usedGuess: boolean[] = [];
  
  // Count bulls (exact matches)
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === targetWord[i]) {
      bulls++;
      usedTarget[i] = true;
      usedGuess[i] = true;
    }
  }
  
  // Count cows (right letter, wrong position)
  for (let i = 0; i < guess.length; i++) {
    if (!usedGuess[i]) {
      for (let j = 0; j < targetWord.length; j++) {
        if (!usedTarget[j] && guess[i] === targetWord[j]) {
          cows++;
          usedTarget[j] = true;
          break;
        }
      }
    }
  }
  
  return { bulls, cows };
};
```

### Display Component
```tsx
{hasGuess && (
  <div className="flex gap-2 ml-2">
    {/* Bulls */}
    <div className="flex items-center gap-1 bg-green-600/20 border border-green-600 rounded px-2 py-1">
      <span className="text-green-400 font-bold">🎯</span>
      <span className="text-green-400 font-bold">{bulls}</span>
    </div>
    
    {/* Cows */}
    <div className="flex items-center gap-1 bg-yellow-500/20 border border-yellow-500 rounded px-2 py-1">
      <span className="text-yellow-400 font-bold">🐄</span>
      <span className="text-yellow-400 font-bold">{cows}</span>
    </div>
  </div>
)}
```

## Accessibility

- Clear emoji indicators (🎯 🐄)
- High contrast colors (green/yellow)
- Numbers displayed prominently
- Border outlines for visibility

## Mobile Responsive

- Smaller badges on mobile
- Touch-friendly spacing
- Readable font sizes
- Responsive grid layout

---

**Enjoy the enhanced challenge of Bulls & Cows!** 🎯🐄
