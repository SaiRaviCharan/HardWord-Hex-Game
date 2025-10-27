'use client';

interface GameBoardProps {
  readonly guesses: string[];
  readonly wordLength: 4 | 5;
  readonly maxAttempts: number;
  readonly targetWord: string;
  readonly currentInput?: string;
}

// Add animation styles
const animationStyles = `
  @keyframes cellPop {
    0% {
      transform: scale(0.5) rotateX(90deg);
      opacity: 0;
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1) rotateX(0deg);
      opacity: 1;
    }
  }

  @keyframes cellFlip {
    0% {
      transform: rotateY(0deg) scale(1);
    }
    50% {
      transform: rotateY(90deg) scale(1.05);
    }
    100% {
      transform: rotateY(0deg) scale(1);
    }
  }

  @keyframes cellBounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  @keyframes cellGlow {
    0%, 100% {
      box-shadow: 0 0 0 rgba(6, 182, 212, 0);
    }
    50% {
      box-shadow: 0 0 12px rgba(6, 182, 212, 0.6);
    }
  }

  @keyframes cellBlink {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }

  .cell-pop {
    animation: cellPop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  }

  .cell-flip {
    animation: cellFlip 0.6s ease-in-out;
  }

  .cell-bounce {
    animation: cellBounce 0.5s ease-in-out;
  }

  .cell-glow {
    animation: cellGlow 1s ease-in-out infinite;
  }

  .cell-blink {
    animation: cellBlink 0.8s ease-in-out infinite;
  }
`;

export default function GameBoard({ guesses, wordLength, maxAttempts, targetWord, currentInput = '' }: GameBoardProps) {
  // Calculate Bulls (correct position) and Cows (wrong position)
  const calculateBullsAndCows = (guess: string): { bulls: number; cows: number } => {
    if (!guess) return { bulls: 0, cows: 0 };
    
    let bulls = 0;
    let cows = 0;
    const targetLetters = targetWord.split('');
    const guessLetters = guess.split('');
    const usedTarget: boolean[] = new Array(targetWord.length).fill(false);
    const usedGuess: boolean[] = new Array(guess.length).fill(false);
    
    // First pass: count bulls (exact matches)
    for (let i = 0; i < guess.length; i++) {
      if (guessLetters[i] === targetLetters[i]) {
        bulls++;
        usedTarget[i] = true;
        usedGuess[i] = true;
      }
    }
    
    // Second pass: count cows (right letter, wrong position)
    for (let i = 0; i < guess.length; i++) {
      if (!usedGuess[i]) {
        for (let j = 0; j < targetWord.length; j++) {
          if (!usedTarget[j] && guessLetters[i] === targetLetters[j]) {
            cows++;
            usedTarget[j] = true;
            break;
          }
        }
      }
    }
    
    return { bulls, cows };
  };

  // Mobile optimized sizes - compact for mobile to avoid scrolling
  const cellSize = wordLength === 5 
    ? 'w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-13 lg:w-16 lg:h-16' 
    : 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16';
  const fontSize = wordLength === 5 
    ? 'text-sm sm:text-lg md:text-xl lg:text-3xl' 
    : 'text-base sm:text-xl md:text-2xl lg:text-3xl';

  const rows = Array.from({ length: maxAttempts });

  return (
    <>
      <style>{animationStyles}</style>
      <div className="flex flex-col gap-1 sm:gap-1.5 md:gap-2 lg:gap-3">
      {rows.map((_, wordIndex) => {
          const isCurrentRow = wordIndex === guesses.length;
          const guess = guesses[wordIndex] || (isCurrentRow ? currentInput : '');
        const { bulls, cows } = guess ? calculateBullsAndCows(guess) : { bulls: 0, cows: 0 };
        const hasGuess = wordIndex < guesses.length;
        
        return (
          <div key={`word-row-${wordIndex}-${guesses.length}`} className="flex gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 items-center justify-center">
            {/* Letter boxes */}
            <div className="flex gap-1 sm:gap-1.5 md:gap-2 lg:gap-3">
              {Array.from({ length: wordLength }).map((_, letterIndex) => {
                  let displayText = '';
                  if (hasGuess) {
                    displayText = guesses[wordIndex];
                  } else if (isCurrentRow) {
                    displayText = currentInput;
                  }
                  const letter = displayText?.[letterIndex] || '';
                  const isTyping = isCurrentRow && !hasGuess;
                
                  let cellClassName = `${cellSize} flex items-center justify-center border-2 sm:border-2 md:border-3 rounded-lg ${fontSize} font-bold transition-all duration-200 `;
                  if (hasGuess) {
                    cellClassName += 'bg-gray-700 border-gray-600 text-white shadow-md cell-flip';
                  } else if (isTyping && letter) {
                    cellClassName += 'bg-cyan-900/30 border-cyan-600 text-cyan-300 cell-pop cell-blink';
                  } else {
                    cellClassName += 'bg-gray-800 border-gray-700 text-gray-600';
                  }
                
                return (
                  <div
                    key={`letter-${wordIndex}-${letterIndex}-${letter}`}
                      className={cellClassName}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
            
            {/* Bulls and Cows indicator - numbers only */}
            {hasGuess && (
              <div className="flex gap-1 sm:gap-1.5 md:gap-2 ml-2 sm:ml-2.5 md:ml-3">
                {/* Bulls (correct position) */}
                <div
                  className={`w-9 sm:w-10 md:w-11 text-center px-2 sm:px-2.5 md:px-3 py-1.5 sm:py-2 md:py-2 rounded-lg border-2 text-xs sm:text-sm md:text-base font-bold transition-all ${
                    bulls > 0
                      ? 'bg-green-600/20 border-green-600 text-green-400 shadow-md'
                      : 'bg-gray-700/40 border-gray-600 text-gray-400'
                  }`}
                >
                  {bulls}
                </div>

                {/* Cows (right letter, wrong position) */}
                <div
                  className={`w-9 sm:w-10 md:w-11 text-center px-2 sm:px-2.5 md:px-3 py-1.5 sm:py-2 md:py-2 rounded-lg border-2 text-xs sm:text-sm md:text-base font-bold transition-all ${
                    cows > 0
                      ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400 shadow-md'
                      : 'bg-gray-700/40 border-gray-600 text-gray-400'
                  }`}
                >
                  {cows}
                </div>
              </div>
            )}
          </div>
        );
      })}
      </div>
    </>
  );
}
