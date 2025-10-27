'use client';

import { StorageData } from '@/lib/utils';

interface StreakProps {
  storage: StorageData;
}

export default function Streak({ storage }: StreakProps) {
  return (
    <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl p-3 sm:p-4 md:p-6 border-2 border-yellow-700/50 backdrop-blur w-full shadow-lg">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        <div className="text-center">
          <div className="text-2xl sm:text-3xl md:text-5xl font-black text-yellow-400 mb-1">🔥</div>
          <div className="text-lg sm:text-xl md:text-3xl font-bold text-yellow-300">{storage.currentStreak}</div>
          <div className="text-xs md:text-sm text-gray-400 mt-1">Streak</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl sm:text-3xl md:text-5xl font-black text-orange-400 mb-1">👑</div>
          <div className="text-lg sm:text-xl md:text-3xl font-bold text-orange-300">{storage.maxStreak}</div>
          <div className="text-xs md:text-sm text-gray-400 mt-1">Best</div>
        </div>

        <div className="text-center">
          <div className="text-2xl sm:text-3xl md:text-5xl font-black text-green-400 mb-1">✅</div>
          <div className="text-lg sm:text-xl md:text-3xl font-bold text-green-300">
            {storage.game5Stats.wonCount + storage.game4Stats.wonCount}
          </div>
          <div className="text-xs md:text-sm text-gray-400 mt-1">Won</div>
        </div>

        <div className="text-center">
          <div className="text-2xl sm:text-3xl md:text-5xl font-black text-blue-400 mb-1">🎮</div>
          <div className="text-lg sm:text-xl md:text-3xl font-bold text-blue-300">
            {storage.game5Stats.played + storage.game4Stats.played}
          </div>
          <div className="text-xs md:text-sm text-gray-400 mt-1">Played</div>
        </div>
      </div>
    </div>
  );
}
