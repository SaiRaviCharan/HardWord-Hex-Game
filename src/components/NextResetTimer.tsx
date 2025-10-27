'use client';

import { useEffect, useMemo, useState } from 'react';

function formatHMS(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function getSecondsUntilNextLocalMidnight(): number {
  const now = new Date();
  const next = new Date(now);
  // set time to next midnight local time
  next.setHours(24, 0, 0, 0);
  const diffMs = next.getTime() - now.getTime();
  return Math.max(0, Math.floor(diffMs / 1000));
}

export default function NextResetTimer() {
  const [seconds, setSeconds] = useState<number>(() => getSecondsUntilNextLocalMidnight());

  // cache next reset date for display
  const nextResetDate = useMemo(() => {
    const now = new Date();
    const next = new Date(now);
    next.setHours(24, 0, 0, 0);
    return next;
  }, []);

  useEffect(() => {
    const tick = () => setSeconds(getSecondsUntilNextLocalMidnight());
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-gray-300 text-sm md:text-base">Come back tomorrow</div>
      <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
        <span className="text-gray-400 text-xs md:text-sm">Resets in</span>
        <span className="font-mono text-lg md:text-2xl font-bold text-green-400">
          {formatHMS(seconds)}
        </span>
      </div>
      <div className="text-[10px] md:text-xs text-gray-500">
        Next reset: {nextResetDate.toLocaleDateString()} 00:00
      </div>
    </div>
  );
}
