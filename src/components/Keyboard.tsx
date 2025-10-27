'use client';

import { useCallback } from 'react';
import { playSound, resumeAudioContext } from '@/lib/sounds';

interface KeyboardProps {
  readonly onGuess: (guess: string) => void;
  readonly wordLength: 4 | 5;
  readonly currentInput: string;
  readonly onInputChange: (input: string) => void;
  readonly absentLetters?: string[];
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

// Haptic feedback utility
const triggerHaptic = (intensity: 'light' | 'medium' | 'heavy' = 'light') => {
  if (typeof globalThis !== 'undefined' && 'vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30, 10, 20],
    };
    navigator.vibrate(patterns[intensity]);
  }
};

export default function Keyboard({ onGuess, wordLength, currentInput, onInputChange, absentLetters = [] }: KeyboardProps) {
  const handleKeyClick = useCallback((letter: string) => {
    if (currentInput.length < wordLength) {
      resumeAudioContext();
      playSound('click', 0.2);
      triggerHaptic('light');
      onInputChange(currentInput + letter);
    }
  }, [currentInput, wordLength, onInputChange]);

  const handleDelete = useCallback(() => {
    resumeAudioContext();
    playSound('delete', 0.2);
    triggerHaptic('medium');
    onInputChange(currentInput.slice(0, -1));
  }, [currentInput, onInputChange]);

  const handleEnter = useCallback(() => {
    if (currentInput.length === wordLength) {
      resumeAudioContext();
      playSound('submit', 0.2);
      triggerHaptic('heavy');
      onGuess(currentInput);
      onInputChange('');
    }
  }, [currentInput, wordLength, onGuess, onInputChange]);

  return (
    <div className="flex flex-col gap-1.5 px-1 sm:px-2 md:px-0 w-full">
      {/* Input Display */}
      <div className="bg-gray-800 rounded-lg p-2 sm:p-3 md:p-4 min-h-10 sm:min-h-12 md:min-h-14 flex items-center justify-center border border-gray-700 shadow-sm">
        <span className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-cyan-400 tracking-widest">{currentInput || '...'}</span>
      </div>

      {/* Keyboard Rows */}
      {KEYBOARD_ROWS.map((row) => (
        <div key={`row-${row.join('')}`} className="flex gap-0.5 sm:gap-1 md:gap-1.5 justify-center">
          {row.map((letter) => {
            const isAbsent = absentLetters.includes(letter.toUpperCase());
            const baseClass = `
                flex-1 min-h-10 sm:min-h-12 md:min-h-13 lg:min-h-14 px-0.5 sm:px-1 py-1.5 sm:py-2 md:py-2 lg:py-3 rounded font-semibold text-xs sm:text-xs md:text-sm lg:text-sm
                border border-gray-600 hover:shadow-sm active:shadow-none
                transition-all duration-100 transform hover:scale-105 active:scale-95
                touch-manipulation select-none
              `;
            const absentClass = isAbsent
              ? 'bg-red-800 text-red-300 border-red-700'
              : 'bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white';

            return (
              <button
                key={`key-${letter}`}
                onClick={() => handleKeyClick(letter)}
                onMouseDown={(e) => e.preventDefault()} /* prevent mouse from giving focus */
                onTouchStart={() => triggerHaptic('light')}
                className={`${baseClass} ${absentClass} focus:outline-none focus:ring-2 focus:ring-white/40`}
                title={isAbsent ? `${letter} — not in word` : letter}
              >
                {letter}
              </button>
            );
          })}
        </div>
      ))}

      {/* Action Buttons */}
      <div className="flex gap-1.5 sm:gap-2 justify-center mt-1 sm:mt-1.5">
        <button
          onClick={handleDelete}
          onTouchStart={() => triggerHaptic('medium')}
          className="
            flex-1 min-h-10 sm:min-h-11 md:min-h-12 lg:min-h-13 px-2 sm:px-3 py-1.5 sm:py-2 md:py-2 lg:py-3 
            bg-red-600 hover:bg-red-700 active:bg-red-500 text-white rounded font-bold 
            text-xs sm:text-xs md:text-sm lg:text-sm border border-red-700 hover:border-red-600 active:border-red-400
            transition-all duration-100 transform hover:shadow-sm active:shadow-none hover:scale-105 active:scale-95
            touch-manipulation select-none
          "
        >
          ⌫ Back
        </button>
        
        <button
          onClick={handleEnter}
          onTouchStart={() => currentInput.length === wordLength && triggerHaptic('heavy')}
          className="
            flex-1 min-h-10 sm:min-h-11 md:min-h-12 lg:min-h-13 px-2 sm:px-3 py-1.5 sm:py-2 md:py-2 lg:py-3 
            bg-green-600 hover:bg-green-700 active:bg-green-500 text-white rounded font-bold 
            text-xs sm:text-xs md:text-sm lg:text-sm border border-green-700 hover:border-green-600 active:border-green-400
            transition-all duration-100 transform hover:shadow-sm active:shadow-none hover:scale-105 active:scale-95
            touch-manipulation select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none
          "
          disabled={currentInput.length !== wordLength}
        >
          ✓ Enter
        </button>
      </div>
    </div>
  );
}
