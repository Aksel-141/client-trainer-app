import { useState, useEffect, useRef } from "react";

interface UseRestTimerProps {
  onRestComplete?: () => void;
}

export function useRestTimer({ onRestComplete }: UseRestTimerProps = {}) {
  const [isResting, setIsResting] = useState(false);
  const [restSeconds, setRestSeconds] = useState(0);
  const [totalRestTime, setTotalRestTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const startRestTimer = (seconds: number) => {
    if (seconds <= 0) return;

    setIsResting(true);
    setRestSeconds(seconds);
    setTotalRestTime(seconds);

    intervalRef.current = setInterval(() => {
      setRestSeconds((prev) => {
        if (prev <= 1) {
          stopRestTimer();
          onRestComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopRestTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsResting(false);
    setRestSeconds(0);
  };

  const pauseRestTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPaused(true);
  };

  const resumeRestTimer = () => {
    if (!isResting || !isPaused) return;

    setIsPaused(false);
    intervalRef.current = setInterval(() => {
      setRestSeconds((prev) => {
        if (prev <= 1) {
          stopRestTimer();
          onRestComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const skipRest = () => {
    stopRestTimer();
    onRestComplete?.();
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const restProgress = totalRestTime > 0 ? ((totalRestTime - restSeconds) / totalRestTime) * 100 : 0;

  return {
    isResting,
    restSeconds,
    restProgress,
    startRestTimer,
    stopRestTimer,
    pauseRestTimer,
    resumeRestTimer,
    skipRest,
  };
}
