'use client';

import { StorageData } from '@/lib/utils';

interface StatsProps {
  storage: StorageData;
  wordLength: 4 | 5;
}

export default function Stats({ storage, wordLength }: StatsProps) {
  const statKey = wordLength === 5 ? 'game5Stats' : 'game4Stats';
  const stats = storage[statKey];

  const wordLengthText = wordLength === 5 ? '5-Letter' : '4-Letter';
  const attemptsText = wordLength === 5 ? '8' : '7';

  return (
    <div className="bg-gray-800 rounded p-1.5 sm:p-2 md:p-3 border border-gray-700 text-center w-full shadow">
      <h3 className="text-xs sm:text-xs md:text-sm lg:text-lg font-bold text-cyan-400 mb-1.5 md:mb-2">{wordLengthText} ({attemptsText})</h3>
      <div className="grid grid-cols-3 gap-1 sm:gap-1.5 md:gap-2">
        <div className="bg-gray-700 rounded p-1 sm:p-1.5 md:p-2 border border-gray-600">
          <div className="text-sm sm:text-base md:text-lg lg:text-2xl font-bold text-yellow-400">{stats.wonCount}</div>
          <div className="text-xs text-gray-400 mt-0.5">Won</div>
        </div>
        <div className="bg-gray-700 rounded p-1 sm:p-1.5 md:p-2 border border-gray-600">
          <div className="text-sm sm:text-base md:text-lg lg:text-2xl font-bold text-blue-400">{stats.played}</div>
          <div className="text-xs text-gray-400 mt-0.5">Played</div>
        </div>
        <div className="bg-gray-700 rounded p-1 sm:p-1.5 md:p-2 border border-gray-600">
          <div className="text-sm sm:text-base md:text-lg lg:text-2xl font-bold text-red-400">
            {stats.played > 0 ? Math.round((stats.wonCount / stats.played) * 100) : 0}%
          </div>
          <div className="text-xs text-gray-400 mt-0.5">Rate</div>
        </div>
      </div>
    </div>
  );
}
