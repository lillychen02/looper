'use client';

import { useState, useEffect } from 'react';

interface TimerProps {
  isActive: boolean;
  estimatedDuration: string;
}

export function Timer({ isActive, estimatedDuration }: TimerProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isActive && elapsedTime !== 0) {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, elapsedTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-gray-600">
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
          <path d="M10 6v4l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span className="font-medium">{formatTime(elapsedTime)}</span>
      </div>
      <div className="text-xs text-gray-400">
        Estimated duration: {estimatedDuration}
      </div>
    </div>
  );
} 