'use client';

import { useState, useEffect } from 'react';
import Game from '@/components/Game';

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<4 | 5 | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [indianOnly, setIndianOnly] = useState(true);

  useEffect(() => {
    try {
      const v = localStorage.getItem('hardword-hex-indian-only');
      if (v === 'false') setIndianOnly(false);
      else setIndianOnly(true);
    } catch {
      setIndianOnly(true);
    }
  }, []);

  const toggleIndianOnly = (val?: boolean) => {
    const newVal = typeof val === 'boolean' ? val : !indianOnly;
    setIndianOnly(newVal);
    try {
      localStorage.setItem('hardword-hex-indian-only', newVal ? 'true' : 'false');
    } catch {}
  };

  if (gameStarted && selectedDifficulty) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-start p-0 md:p-4">
        <button
          onClick={() => {
            setGameStarted(false);
            setSelectedDifficulty(null);
          }}
          className="w-full md:w-auto fixed top-0 left-0 right-0 md:relative md:top-auto md:left-auto md:right-auto px-4 py-3 md:py-2 text-sm text-gray-400 hover:text-white transition-colors bg-black/80 md:bg-transparent backdrop-blur md:backdrop-blur-none md:rounded-lg border-b md:border-b-0 border-gray-800 z-50"
        >
          ← Back to Menu
        </button>
        <div className="w-full flex-1 overflow-auto pt-14 md:pt-0 pb-4 md:pb-0">
          <Game wordLength={selectedDifficulty} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-2 sm:p-4 md:p-6">
      {/* Spacing for mobile */}
      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-md">
        {/* Logo - Snake wrapping around text */}
        <div className="mb-4 sm:mb-6 md:mb-8 relative">
          <svg className="w-32 sm:w-40 md:w-56 h-auto" viewBox="0 0 300 120" xmlns="http://www.w3.org/2000/svg">
            {/* Snake path - green to cyan to purple gradient */}
            <defs>
              <linearGradient id="snakeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            
            {/* Snake body - wavy line wrapping around */}
            <path
              d="M 20 40 Q 40 20 60 30 T 100 25 T 140 35 T 180 20 T 220 35 T 260 25 L 270 25"
              stroke="url(#snakeGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Snake head */}
            <circle cx="270" cy="25" r="6" fill="#8b5cf6" />
            
            {/* Snake tongue */}
            <path d="M 275 25 L 285 20 M 275 25 L 285 30" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
            
            {/* Text - HardWord Hex */}
            <text
              x="150"
              y="90"
              textAnchor="middle"
              fontSize="48"
              fontWeight="900"
              fill="white"
              fontFamily="sans-serif"
              letterSpacing="-1"
            >
              HardWord Hex
            </text>
          </svg>
        </div>

        {/* Subtitle */}
        <p className="text-gray-400 text-xs sm:text-sm md:text-lg mb-3 sm:mb-4 md:mb-6 text-center">
          Daily word puzzles.<br className="md:hidden" /> Build your streak.
        </p>

        {/* How to Play Button */}
        <button
          onClick={() => setShowInstructions(true)}
          className="mb-4 sm:mb-6 md:mb-8 text-blue-400 hover:text-blue-300 text-xs sm:text-sm md:text-base underline transition-colors touch-manipulation"
        >
          📖 How to Play
        </button>

        {/* Difficulty Selector - Mobile optimized */}
        <style>{`
          @keyframes slideUpFade {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideUpFade2 {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideUpFade3 {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .button-5letter {
            animation: slideUpFade 0.5s ease-out 0.1s both;
          }
          
          .button-4letter {
            animation: slideUpFade2 0.5s ease-out 0.2s both;
          }
          
          .button-random {
            animation: slideUpFade3 0.5s ease-out 0.3s both;
          }

          .btn-primary {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            border: 2px solid #1e40af;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
            transition: all 0.3s ease;
            position: relative;
          }

          .btn-primary::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: conic-gradient(
              from 0deg,
              rgba(255, 255, 255, 0.8) 0deg,
              rgba(200, 220, 255, 0.6) 45deg,
              rgba(59, 130, 246, 0.4) 90deg,
              rgba(30, 64, 175, 0.3) 180deg,
              rgba(59, 130, 246, 0.4) 270deg,
              rgba(255, 255, 255, 0.8) 360deg
            );
            border-radius: 8px;
            animation: borderShine 4s linear infinite;
            z-index: -1;
            pointer-events: none;
          }

          .btn-primary::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            border-radius: 8px;
            z-index: -1;
          }

          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6), 0 0 20px rgba(59, 130, 246, 0.4);
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          }

          .btn-primary:active {
            transform: translateY(0px);
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
          }

          .btn-secondary {
            background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
            border: 2px solid #7e22ce;
            box-shadow: 0 4px 15px rgba(168, 85, 247, 0.4);
            transition: all 0.3s ease;
            position: relative;
          }

          .btn-secondary::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: conic-gradient(
              from 0deg,
              rgba(255, 255, 255, 0.8) 0deg,
              rgba(230, 200, 255, 0.6) 45deg,
              rgba(168, 85, 247, 0.4) 90deg,
              rgba(126, 34, 206, 0.3) 180deg,
              rgba(168, 85, 247, 0.4) 270deg,
              rgba(255, 255, 255, 0.8) 360deg
            );
            border-radius: 8px;
            animation: borderShine 4s linear infinite 0.5s;
            z-index: -1;
            pointer-events: none;
          }

          .btn-secondary::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
            border-radius: 8px;
            z-index: -1;
          }

          .btn-secondary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(168, 85, 247, 0.6), 0 0 20px rgba(168, 85, 247, 0.4);
            background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%);
          }

          .btn-secondary:active {
            transform: translateY(0px);
            box-shadow: 0 2px 8px rgba(168, 85, 247, 0.4);
          }

          @keyframes borderShine {
            0% {
              filter: brightness(1);
              opacity: 1;
            }
            25% {
              filter: brightness(1.2);
              opacity: 1;
            }
            50% {
              filter: brightness(1);
              opacity: 0.9;
            }
            75% {
              filter: brightness(1.1);
              opacity: 1;
            }
            100% {
              filter: brightness(1);
              opacity: 1;
            }
          }
        `}</style>
        <div className="flex flex-col gap-2 sm:gap-3 w-full">
          {/* Indian-only toggle */}
          <div className="flex items-center justify-center mb-2">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={indianOnly}
                onChange={() => toggleIndianOnly()}
                className="w-5 h-5 accent-cyan-500"
              />
              <span>Indian words only</span>
            </label>
          </div>
          <button
            onClick={() => {
              setSelectedDifficulty(5);
              setGameStarted(true);
            }}
            className="button-5letter btn-primary w-full px-4 sm:px-6 py-3 sm:py-4 md:py-4 text-white font-bold rounded-lg text-sm sm:text-base md:text-lg touch-manipulation min-h-12 sm:min-h-13 flex items-center justify-center gap-2"
          >
            <span className="text-lg sm:text-xl">�</span>
            <span>5-Letter (8 Tries)</span>
          </button>

          <button
            onClick={() => {
              setSelectedDifficulty(4);
              setGameStarted(true);
            }}
            className="button-4letter btn-secondary w-full px-4 sm:px-6 py-3 sm:py-4 md:py-4 text-white font-bold rounded-lg text-sm sm:text-base md:text-lg touch-manipulation min-h-12 sm:min-h-13 flex items-center justify-center gap-2"
          >
            <span className="text-lg sm:text-xl">⚡</span>
            <span>4-Letter (7 Tries)</span>
          </button>

          <button
            onClick={() => {
              setSelectedDifficulty(Math.random() > 0.5 ? 4 : 5);
              setGameStarted(true);
            }}
            className="button-random w-full px-4 sm:px-6 py-3 sm:py-4 md:py-4 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-white font-bold rounded-lg transition-colors text-sm sm:text-base md:text-lg touch-manipulation active:scale-95 min-h-12 sm:min-h-13 flex items-center justify-center gap-2"
          >
            <span className="text-lg sm:text-xl">🎲</span>
            <span>Random</span>
          </button>
        </div>
      </div>

      {/* Footer - Mobile positioned */}
      <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 text-center w-full px-4">
        <p className="text-gray-600 text-xs md:text-xs">© 2025 HardWord Hex. All rights reserved.</p>
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">How to Play</h2>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-4 text-gray-300">
              <p className="text-base">
                Guess the hidden word in the limited number of tries. Each guess must be a valid word.
              </p>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Bulls & Cows System:</h3>
                
                <p className="text-sm">
                  After each guess, you&apos;ll see two colored numbers:
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-10 text-center bg-green-600/20 border border-green-600 text-green-400 rounded px-3 py-2 font-bold">3</div>
                  <p className="text-sm flex-1">
                    <strong className="text-green-400">Bulls</strong> - Number of letters in the correct position
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 text-center bg-yellow-500/20 border border-yellow-500 text-yellow-400 rounded px-3 py-2 font-bold">1</div>
                  <p className="text-sm flex-1">
                    <strong className="text-yellow-400">Cows</strong> - Number of correct letters in the wrong position
                  </p>
                </div>

                <div className="bg-gray-800 p-3 rounded-lg mt-3">
                  <p className="text-sm text-gray-300">
                    <strong className="text-white">Example:</strong> If the word is <span className="font-mono text-blue-400">HOUSE</span> and you guess <span className="font-mono text-purple-400">HORSE</span>:
                  </p>
                  <ul className="text-sm mt-2 space-y-1 text-gray-400">
                    <li>• Bulls: <span className="text-green-400 font-bold">4</span> (H, O, S, E in correct positions)</li>
                    <li>• Cows: <span className="text-yellow-400 font-bold">0</span> (R is not in the word)</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Game Modes:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong className="text-blue-400">5-Letter:</strong> 8 attempts to guess a 5-letter word</li>
                  <li><strong className="text-purple-400">4-Letter:</strong> 7 attempts to guess a 4-letter word</li>
                  <li><strong className="text-gray-400">Random:</strong> Randomly picks between 4 or 5 letters</li>
                </ul>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Tips:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Start with words that have common vowels</li>
                  <li>Pay attention to the Bulls & Cows counts</li>
                  <li>If you have 4 Bulls, you&apos;re very close!</li>
                  <li>A new puzzle is available daily at midnight</li>
                  <li>Build your streak by playing every day!</li>
                </ul>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 p-4">
              <button
                onClick={() => setShowInstructions(false)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
