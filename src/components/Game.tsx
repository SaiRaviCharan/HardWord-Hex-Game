'use client';

import { useState, useEffect, useCallback } from 'react';
import { prefetchAndCacheExternalWordLists } from '@/lib/wordLists';
import { MAX_ATTEMPTS_5, MAX_ATTEMPTS_4 } from '@/lib/constants';
import { playSound } from '@/lib/sounds';
import {
  getStorageData,
  saveStorageData,
  checkDailyReset,
  isValidWord
} from '@/lib/utils';
import GameBoard from './GameBoard';
import Keyboard from './Keyboard';
import Stats from './Stats';
import NextResetTimer from './NextResetTimer';
import Modal from './Modal';

interface GameProps {
  readonly wordLength: 4 | 5;
}

export default function Game({ wordLength }: GameProps) {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [showStartModal, setShowStartModal] = useState(true);
  const [showEndModal, setShowEndModal] = useState(false);
  const [endResult, setEndResult] = useState<{ won: boolean; word: string } | null>(null);
  const [storage, setStorage] = useState(getStorageData());
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [absentLetters, setAbsentLetters] = useState<string[]>([]);

  const maxAttempts = wordLength === 5 ? MAX_ATTEMPTS_5 : MAX_ATTEMPTS_4;

  const calculateBullsAndCowsLocal = (guess: string, target: string) => {
    let bulls = 0;
    let cows = 0;
    const targetLetters = target.split('');
    const guessLetters = guess.split('');
    const usedTarget: boolean[] = new Array(target.length).fill(false);
    const usedGuess: boolean[] = new Array(guess.length).fill(false);

    for (let i = 0; i < guess.length; i++) {
      if (guessLetters[i] === targetLetters[i]) {
        bulls++;
        usedTarget[i] = true;
        usedGuess[i] = true;
      }
    }

    for (let i = 0; i < guess.length; i++) {
      if (!usedGuess[i]) {
        for (let j = 0; j < target.length; j++) {
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

  useEffect(() => {
    setMounted(true);
    // Prefetch external word lists and cache (non-blocking)
    prefetchAndCacheExternalWordLists().catch(() => {});
    let newStorage = getStorageData();
    newStorage = checkDailyReset(newStorage);
    setStorage(newStorage);
    
    const statKey = wordLength === 5 ? 'game5Stats' : 'game4Stats';
    setTargetWord(newStorage[statKey].targetWord);
    setGuesses(newStorage[statKey].currentGuesses);
    setGameOver(newStorage[statKey].gameOver);
  }, [wordLength]);

  // show start modal once on mount
  useEffect(() => {
    setShowStartModal(true);
  }, []);

  const handleGuess = useCallback((guess: string) => {
    if (gameOver || !mounted) return;

    const upperGuess = guess.toUpperCase();

    if (upperGuess.length !== wordLength) {
      setMessage('Wrong word length!');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    if (!isValidWord(upperGuess, wordLength)) {
      setMessage('Not a valid word!');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    if (guesses.includes(upperGuess)) {
      setMessage('Already guessed!');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    const newGuesses = [...guesses, upperGuess];
    setGuesses(newGuesses);

    if (upperGuess === targetWord) {
      setGameOver(true);
      setMessage('🎉 You won!');
      setEndResult({ won: true, word: targetWord });
      setShowEndModal(true);
      playSound('win', 0.3);
      
      const newStorage = { ...storage };
      const statKey = wordLength === 5 ? 'game5Stats' : 'game4Stats';
      newStorage[statKey].won = true;
      newStorage[statKey].gameOver = true;
      newStorage[statKey].currentGuesses = newGuesses;
      newStorage[statKey].wonCount += 1;
      
      saveStorageData(newStorage);
      setStorage(newStorage);
    } else if (newGuesses.length >= maxAttempts) {
      setGameOver(true);
      setMessage(`Game Over! Word was: ${targetWord}`);
      setEndResult({ won: false, word: targetWord });
      setShowEndModal(true);
      playSound('lose', 0.3);
      
      const newStorage = { ...storage };
      const statKey = wordLength === 5 ? 'game5Stats' : 'game4Stats';
      newStorage[statKey].gameOver = true;
      newStorage[statKey].currentGuesses = newGuesses;
      
      saveStorageData(newStorage);
      setStorage(newStorage);
    } else {
      const newStorage = { ...storage };
      const statKey = wordLength === 5 ? 'game5Stats' : 'game4Stats';
      newStorage[statKey].currentGuesses = newGuesses;
      saveStorageData(newStorage);
      setStorage(newStorage);
    }

    // Update absent letters set if this guess had no bulls or cows
    try {
      const { bulls, cows } = calculateBullsAndCowsLocal(upperGuess, targetWord);
      if (bulls + cows === 0) {
        setAbsentLetters(prev => {
          const set = new Set(prev.map(c => c.toUpperCase()));
          for (const ch of upperGuess) set.add(ch);
          return Array.from(set).sort((a, b) => a.localeCompare(b));
        });
      }
    } catch {
      // ignore if target not available yet
    }
  }, [gameOver, mounted, wordLength, targetWord, guesses, storage, maxAttempts]);

  // Handle laptop keyboard input
  useEffect(() => {
    if (!mounted) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;

      const key = e.key.toUpperCase();

      // Letter keys
      if (/^[A-Z]$/.test(key) && input.length < wordLength) {
        e.preventDefault();
        setInput(prev => prev + key);
      }
      // Backspace
        else if (e.key === 'Backspace' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setInput(prev => prev.slice(0, -1));
      }
        // Arrow right (placeholder for future cursor navigation)
        else if (e.key === 'ArrowRight') {
          e.preventDefault();
          // Future: move cursor right
        }
        // Arrow up/down (placeholder for future row navigation)
        else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          e.preventDefault();
          // Future: navigate between rows
        }
      // Enter
      else if (e.key === 'Enter' && input.length === wordLength) {
        e.preventDefault();
        handleGuess(input);
        setInput('');
      }
    };

    if (globalThis.window !== undefined) {
      globalThis.window.addEventListener('keydown', handleKeyPress);
      return () => globalThis.window.removeEventListener('keydown', handleKeyPress);
    }
  }, [gameOver, mounted, wordLength, input, handleGuess]);

  if (!mounted) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 lg:gap-6 w-full max-w-md mx-auto px-2 sm:px-3 md:px-0 py-2 sm:py-2 md:py-4 lg:py-0">
      <GameBoard 
        targetWord={targetWord}
        guesses={guesses}
        wordLength={wordLength}
        maxAttempts={maxAttempts}
          currentInput={input}
      />
      
      {message && (
        <div className="text-center text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-cyan-400 animate-pulse">
          {message}
        </div>
      )}
      
      <div className="text-center text-xs md:text-xs lg:text-sm text-gray-400">
        Attempt: {guesses.length} / {maxAttempts}
      </div>

      {!gameOver && (
        <Keyboard 
          onGuess={handleGuess}
          wordLength={wordLength}
          currentInput={input}
          onInputChange={setInput}
          absentLetters={absentLetters}
        />
      )}

      {gameOver && (
        <div className="text-center">
          <NextResetTimer />
        </div>
      )}

      {/* End game modal */}
      {showEndModal && endResult && (
        <Modal
          open={showEndModal}
          title={endResult.won ? 'You Won! 🎉' : 'Game Over'}
          onClose={() => setShowEndModal(false)}
          actions={
            <>
              <button
                onClick={() => globalThis.location.reload()}
                className="py-2 px-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded"
              >
                Play Next
              </button>
              <button
                onClick={() => setShowEndModal(false)}
                className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded"
              >
                Close
              </button>
            </>
          }
        >
          <div className="space-y-4">
            {/* Snake Logo in modal */}
            <div className="flex justify-center mb-4">
              <svg className="w-24 h-auto" viewBox="0 0 300 120" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="snakeGradientEndModal" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <path
                  d="M 20 40 Q 40 20 60 30 T 100 25 T 140 35 T 180 20 T 220 35 T 260 25 L 270 25"
                  stroke="url(#snakeGradientEndModal)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="270" cy="25" r="6" fill="#8b5cf6" />
                <path d="M 275 25 L 285 20 M 275 25 L 285 30" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            
            <div className="text-gray-300 text-center">{endResult.won ? 'Great job! Come back tomorrow for a new puzzle.' : `The word was: ${endResult.word}`}</div>
            <div className="mt-2">
              <NextResetTimer />
            </div>
          </div>
        </Modal>
      )}

      {/* Start modal */}
      {showStartModal && (
        <Modal
          open={showStartModal}
          title="How to play"
          onClose={() => setShowStartModal(false)}
          actions={
            <button
              onClick={() => setShowStartModal(false)}
              className="py-2 px-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded"
            >
              Start Playing
            </button>
          }
        >
          <div className="space-y-3">
            {/* Snake Logo in start modal */}
            <div className="flex justify-center mb-4">
              <svg className="w-24 h-auto" viewBox="0 0 300 120" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="snakeGradientStartModal" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <path
                  d="M 20 40 Q 40 20 60 30 T 100 25 T 140 35 T 180 20 T 220 35 T 260 25 L 270 25"
                  stroke="url(#snakeGradientStartModal)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="270" cy="25" r="6" fill="#8b5cf6" />
                <path d="M 275 25 L 285 20 M 275 25 L 285 30" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            
            <p className="text-gray-300">Guess the daily word. After each guess you will see two numbers: green = Bulls (correct position), yellow = Cows (correct letter wrong position). No repeated adjacent letters allowed.</p>
            <p className="text-gray-400 text-sm">Good luck — build your streak. This game updates daily.</p>
          </div>
        </Modal>
      )}

      <Stats storage={storage} wordLength={wordLength} />
    </div>
  );
}
