import { useState, useRef, useEffect } from "react";

export function useWorkoutTimer() {
  const [workoutSeconds, setWorkoutSeconds] = useState(0);
  const [isWorkoutRunning, setIsWorkoutRunning] = useState(false);
  const workoutIntervalRef = useRef<number | null>(null);

  const startWorkoutTimer = () => {
    if (!isWorkoutRunning) {
      setIsWorkoutRunning(true);
      const savedTime = localStorage.getItem("savedRoutineTime");
      if (savedTime) setWorkoutSeconds(Number(savedTime));

      workoutIntervalRef.current = window.setInterval(() => {
        setWorkoutSeconds((prev) => {
          const newTime = prev + 1;
          localStorage.setItem("savedRoutineTime", newTime.toString());
          return newTime;
        });
      }, 1000);
    }
  };

  const pauseWorkoutTimer = () => {
    if (workoutIntervalRef.current) {
      clearInterval(workoutIntervalRef.current);
      workoutIntervalRef.current = null;
    }
    setIsWorkoutRunning(false);
  };

  const clearWorkoutTimer = () => {
    if (workoutIntervalRef.current) {
      clearInterval(workoutIntervalRef.current);
      workoutIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearWorkoutTimer();
    };
  }, []);

  return {
    workoutSeconds,
    isWorkoutRunning,
    startWorkoutTimer,
    pauseWorkoutTimer,
    clearWorkoutTimer,
  };
}
