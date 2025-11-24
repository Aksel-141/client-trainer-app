import { useState, useRef, useEffect } from "react";

interface UseExerciseTimerProps {
  onSetComplete: () => void;
  onPrepComplete: (duration?: number) => void;
}

export function useExerciseTimer({ onSetComplete, onPrepComplete }: UseExerciseTimerProps) {
  const [setTimer, setSetTimer] = useState(0);
  const [prepTimer, setPrepTimer] = useState(0);
  const [isPreparing, setIsPreparing] = useState(false);

  const setIntervalRef = useRef<number | null>(null);
  const prepIntervalRef = useRef<number | null>(null);
  const completingRef = useRef<boolean>(false);

  const clearSetInterval = () => {
    if (setIntervalRef.current) {
      clearInterval(setIntervalRef.current);
      setIntervalRef.current = null;
    }
  };

  const clearPrepInterval = () => {
    if (prepIntervalRef.current) {
      clearInterval(prepIntervalRef.current);
      prepIntervalRef.current = null;
    }
  };

  const startPrepTimer = (resetTimer = false, duration?: number) => {
    clearPrepInterval();
    setIsPreparing(true);
    const start = resetTimer || prepTimer === 0 ? 5 : prepTimer;
    setPrepTimer(start);

    prepIntervalRef.current = window.setInterval(() => {
      setPrepTimer((prev) => {
        if (prev <= 1) {
          clearPrepInterval();
          setIsPreparing(false);
          onPrepComplete(duration);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startSetTimer = (duration: number) => {
    clearSetInterval();
    const start = duration ?? setTimer;
    setSetTimer(start);
    if (start <= 0) return;

    setIntervalRef.current = window.setInterval(() => {
      setSetTimer((prev) => {
        if (completingRef.current) return prev;
        if (prev <= 1) {
          clearSetInterval();
          onSetComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetSetTimer = () => {
    setSetTimer(0);
  };

  const pauseTimers = () => {
    clearSetInterval();
    clearPrepInterval();
  };

  const getCompletingRef = () => completingRef;

  useEffect(() => {
    return () => {
      clearSetInterval();
      clearPrepInterval();
    };
  }, []);

  return {
    setTimer,
    prepTimer,
    isPreparing,
    startPrepTimer,
    startSetTimer,
    resetSetTimer,
    pauseTimers,
    clearSetInterval,
    clearPrepInterval,
    getCompletingRef,
  };
}
