'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { EXTENDED_5_LETTER_WORDS, EXTENDED_4_LETTER_WORDS } from '@/lib/wordLists';

interface DailyWords {
  date: string;
  fiveLetter: string;
  fourLetter: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dailyWords, setDailyWords] = useState<DailyWords[]>([]);
  const [newFiveLetter, setNewFiveLetter] = useState('');
  const [newFourLetter, setNewFourLetter] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load existing daily words from localStorage
    const stored = localStorage.getItem('hardword-hex-daily-words');
    if (stored) {
      try {
        setDailyWords(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load daily words:', e);
      }
    }

    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  const handleLogin = () => {
    // Simple password check - you can change this
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setMessage('');
    } else {
      setMessage('Invalid password');
    }
  };

  const hasAdjacentDouble = (w: string) => {
    for (let i = 1; i < w.length; i++) if (w[i] === w[i-1]) return true;
    return false;
  };

  const validateWord = (word: string, length: 4 | 5): boolean => {
    const upperWord = word.toUpperCase();
    if (upperWord.length !== length) return false;
    if (!/^[A-Z]+$/.test(upperWord)) return false;
    if (hasAdjacentDouble(upperWord)) return false; // no double letters like OO, LL
    
    const wordList = length === 5 ? EXTENDED_5_LETTER_WORDS : EXTENDED_4_LETTER_WORDS;
    return wordList.includes(upperWord);
  };

  const handleSetDailyWords = () => {
    const upper5 = newFiveLetter.toUpperCase().trim();
    const upper4 = newFourLetter.toUpperCase().trim();

    // Validate words
    if (!validateWord(upper5, 5)) {
      setMessage('Invalid 5-letter word! Must be valid and have no double letters.');
      return;
    }
    if (!validateWord(upper4, 4)) {
      setMessage('Invalid 4-letter word! Must be valid and have no double letters.');
      return;
    }

    // Add or update daily words
    const newEntry: DailyWords = {
      date: selectedDate,
      fiveLetter: upper5,
      fourLetter: upper4,
    };

    const updated = dailyWords.filter(d => d.date !== selectedDate);
    updated.push(newEntry);
    updated.sort((a, b) => a.date.localeCompare(b.date));

    setDailyWords(updated);
    localStorage.setItem('hardword-hex-daily-words', JSON.stringify(updated));

    setMessage(`✓ Daily words set for ${selectedDate}`);
    setNewFiveLetter('');
    setNewFourLetter('');
    
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDelete = (date: string) => {
    const updated = dailyWords.filter(d => d.date !== date);
    setDailyWords(updated);
    localStorage.setItem('hardword-hex-daily-words', JSON.stringify(updated));
    setMessage(`✓ Deleted words for ${date}`);
    setTimeout(() => setMessage(''), 3000);
  };

  const generateRandomWords = () => {
    const random5 = EXTENDED_5_LETTER_WORDS[Math.floor(Math.random() * EXTENDED_5_LETTER_WORDS.length)];
    const random4 = EXTENDED_4_LETTER_WORDS[Math.floor(Math.random() * EXTENDED_4_LETTER_WORDS.length)];
    setNewFiveLetter(random5);
    setNewFourLetter(random4);
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 max-w-md w-full">
          <h1 className="text-2xl font-bold text-white mb-4">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Enter password"
            className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition-colors"
          >
            Login
          </button>
          {message && (
            <p className="text-red-400 text-sm mt-3">{message}</p>
          )}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm">
              ← Back to Game
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            ← Back to Game
          </Link>
        </div>

        {/* Set Daily Words */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Set Daily Words</h2>
          
          <div className="mb-4">
            <label htmlFor="date-input" className="block text-gray-400 text-sm mb-2">Date</label>
            <input
              id="date-input"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="five-letter-input" className="block text-gray-400 text-sm mb-2">5-Letter Word</label>
              <input
                id="five-letter-input"
                type="text"
                value={newFiveLetter}
                onChange={(e) => setNewFiveLetter(e.target.value.toUpperCase())}
                maxLength={5}
                placeholder="WORD5"
                className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none uppercase"
              />
            </div>
            <div>
              <label htmlFor="four-letter-input" className="block text-gray-400 text-sm mb-2">4-Letter Word</label>
              <input
                id="four-letter-input"
                type="text"
                value={newFourLetter}
                onChange={(e) => setNewFourLetter(e.target.value.toUpperCase())}
                maxLength={4}
                placeholder="WORD"
                className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none uppercase"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSetDailyWords}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition-colors"
            >
              Set Words
            </button>
            <button
              onClick={generateRandomWords}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded transition-colors"
            >
              🎲 Random
            </button>
          </div>

          {message && (
            <p className={`mt-4 text-sm ${message.includes('✓') ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </p>
          )}
        </div>

        {/* Scheduled Words */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Scheduled Daily Words</h2>
          
          {dailyWords.length === 0 ? (
            <p className="text-gray-400">No words scheduled yet. Words will be randomly selected if not set.</p>
          ) : (
            <div className="space-y-3">
              {dailyWords.map((entry) => (
                <div
                  key={entry.date}
                  className="flex items-center justify-between p-4 bg-gray-800 rounded border border-gray-700"
                >
                  <div>
                    <div className="text-white font-semibold">{entry.date}</div>
                    <div className="text-gray-400 text-sm">
                      5-Letter: <span className="text-blue-400 font-mono">{entry.fiveLetter}</span>
                      {' • '}
                      4-Letter: <span className="text-purple-400 font-mono">{entry.fourLetter}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(entry.date)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
          <h3 className="text-white font-semibold mb-2">ℹ️ How it works:</h3>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• Set specific words for specific dates</li>
            <li>• If no word is set for a date, a random word will be automatically selected</li>
            <li>• Words are validated against the dictionary</li>
            <li>• Use &quot;Random&quot; button to generate suggestions</li>
            <li>• All players will get the same word for each date</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
