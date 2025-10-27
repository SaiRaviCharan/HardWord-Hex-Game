import { FIVE_LETTER_WORDS, FOUR_LETTER_WORDS } from './constants';
import { EXTENDED_5_LETTER_WORDS, EXTENDED_4_LETTER_WORDS, INDIAN_ENGLISH_4, INDIAN_ENGLISH_5 } from './wordLists';

export type LetterStatus = 'correct' | 'present' | 'absent' | null;

export interface GameState {
  targetWord: string;
  guesses: string[];
  gameOver: boolean;
  won: boolean;
  maxAttempts: number;
  wordLength: 4 | 5;
}

export interface StorageData {
  lastPlayDate: string;
  currentStreak: number;
  maxStreak: number;
  game5Stats: {
    played: number;
    wonCount: number;
    currentGuesses: string[];
    targetWord: string;
    gameOver: boolean;
    won: boolean;
  };
  game4Stats: {
    played: number;
    wonCount: number;
    currentGuesses: string[];
    targetWord: string;
    gameOver: boolean;
    won: boolean;
  };
}

const hasAdjacentDouble = (w: string): boolean => {
  for (let i = 1; i < w.length; i++) if (w[i] === w[i - 1]) return true;
  return false;
};

const combineWordPools = (length: 4 | 5): string[] => {
  const base = length === 5 ? FIVE_LETTER_WORDS : FOUR_LETTER_WORDS;
  const ext = length === 5 ? EXTENDED_5_LETTER_WORDS : EXTENDED_4_LETTER_WORDS;
  let extra: string[] = [];
  if (globalThis.window !== undefined) {
    const key = length === 5 ? 'hardword-hex-extra-5' : 'hardword-hex-extra-4';
    try {
      const stored = localStorage.getItem(key);
      if (stored) extra = JSON.parse(stored);
    } catch {}
  }
  const set = new Set<string>([...base, ...ext, ...extra]);
  // filter to remove words with adjacent doubles
  return Array.from(set).filter(w => !hasAdjacentDouble(w));
};

const getIndianPool = (length: 4 | 5): string[] => {
  const base = length === 5 ? INDIAN_ENGLISH_5 : INDIAN_ENGLISH_4;
  // also try to include any cached extras that may be Indian but keep conservative approach
  let extras: string[] = [];
  if (globalThis.window !== undefined) {
    const key = length === 5 ? 'hardword-hex-extra-5' : 'hardword-hex-extra-4';
    try {
      const stored = localStorage.getItem(key);
      if (stored) extras = JSON.parse(stored);
    } catch {}
  }

  const set = new Set<string>([...base, ...extras]);
  return Array.from(set).map(s => s.toUpperCase()).filter(w => w.length === length && /^[A-Z]+$/.test(w) && !hasAdjacentDouble(w));
};

const getActivePool = (length: 4 | 5): string[] => {
  // Check if user explicitly enabled Indian-only mode.
  // By default, use the combined pool (English + Indian words) for better coverage.
  if (globalThis.window !== undefined) {
    try {
      const v = localStorage.getItem('hardword-hex-indian-only');
      if (v === 'true') return getIndianPool(length);
      // Default or 'false' -> use combined pool
      return combineWordPools(length);
    } catch {
      return combineWordPools(length);
    }
  }

  // Server-side or no window: default to combined pool
  return combineWordPools(length);
};

const getRandomWord = (length: 4 | 5): string => {
  // First, check if there's a daily word set for today
  const dailyWord = getDailyWord(length);
  if (dailyWord && !hasAdjacentDouble(dailyWord)) return dailyWord;

  // Use deterministic word based on date for consistency across users
  const deterministicWord = getDeterministicWord(length);
  if (deterministicWord && !hasAdjacentDouble(deterministicWord)) {
    return deterministicWord;
  }

  // Otherwise, pick from combined pool
  const words = getActivePool(length);
  return words[Math.floor(Math.random() * words.length)];
};

const getDailyWord = (length: 4 | 5): string | null => {
  if (globalThis.window === undefined) return null;
  
  try {
    const stored = localStorage.getItem('hardword-hex-daily-words');
    if (!stored) return null;
    
    const dailyWords = JSON.parse(stored);
    const today = getDayKey();
    const entry = dailyWords.find((d: { date: string }) => d.date === today);
    
    if (entry) {
      return length === 5 ? entry.fiveLetter : entry.fourLetter;
    }
  } catch (e) {
    console.error('Failed to load daily word:', e);
  }
  
  return null;
};

const getDayKey = (): string => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

// Seeded random number generator - same seed produces same number
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Get deterministic word for the day based on date
const getDeterministicWord = (length: 4 | 5): string => {
  const words = getActivePool(length);
  if (words.length === 0) {
    // Fallback if no words available
    return length === 5 ? 'ABOUT' : 'TEST';
  }
  
  // Create seed from today's date
  const today = getDayKey();
  const dateValues = today.split('-').map(Number);
  const seed = dateValues[0] * 10000 + dateValues[1] * 100 + dateValues[2];
  
  // Get random index using seeded random
  const randomValue = seededRandom(seed);
  const index = Math.floor(randomValue * words.length);
  
  return words[Math.max(0, Math.min(index, words.length - 1))];
};

export const getStorageData = (): StorageData => {
  if (globalThis.window === undefined) return getDefaultStorage();
  
  const stored = localStorage.getItem('hardword-hex-data');
  if (!stored) return getDefaultStorage();
  
  try {
    return JSON.parse(stored);
  } catch {
    return getDefaultStorage();
  }
};

export const getDefaultStorage = (): StorageData => ({
  lastPlayDate: '',
  currentStreak: 0,
  maxStreak: 0,
  game5Stats: {
    played: 0,
    wonCount: 0,
    currentGuesses: [],
    targetWord: getRandomWord(5),
    gameOver: false,
    won: false,
  },
  game4Stats: {
    played: 0,
    wonCount: 0,
    currentGuesses: [],
    targetWord: getRandomWord(4),
    gameOver: false,
    won: false,
  },
});

export const saveStorageData = (data: StorageData): void => {
  if (globalThis.window === undefined) return;
  localStorage.setItem('hardword-hex-data', JSON.stringify(data));
};

export const checkDailyReset = (storage: StorageData): StorageData => {
  const today = getDayKey();
  
  if (storage.lastPlayDate !== today) {
    storage.lastPlayDate = today;
    storage.game5Stats = {
      played: 0,
      wonCount: 0,
      currentGuesses: [],
      targetWord: getRandomWord(5),
      gameOver: false,
      won: false,
    };
    storage.game4Stats = {
      played: 0,
      wonCount: 0,
      currentGuesses: [],
      targetWord: getRandomWord(4),
      gameOver: false,
      won: false,
    };
  }
  
  return storage;
};

export const updateStreak = (storage: StorageData, game5Won: boolean, game4Won: boolean): StorageData => {
  const today = getDayKey();
  
  if (game5Won && game4Won) {
    if (storage.lastPlayDate === today) {
      storage.currentStreak++;
      storage.maxStreak = Math.max(storage.currentStreak, storage.maxStreak);
    } else {
      storage.currentStreak = 1;
      storage.maxStreak = Math.max(1, storage.maxStreak);
    }
  }
  
  return storage;
};

export const checkLetterStatus = (letter: string, word: string, guessIndex: number): LetterStatus => {
  if (letter === word[guessIndex]) return 'correct';
  if (word.includes(letter)) return 'present';
  return 'absent';
};

export const isValidWord = (guess: string, length: 4 | 5): boolean => {
  const upperGuess = guess.toUpperCase();
  if (upperGuess.length !== length) return false;
  if (!/^[A-Z]+$/.test(upperGuess)) return false;
  if (hasAdjacentDouble(upperGuess)) return false; // disallow double letters like OO, LL
  const pool = getActivePool(length);
  return pool.includes(upperGuess);
};
