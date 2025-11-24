import { useState, useRef, useEffect } from "react";

interface CompletedSet {
  exerciseId: number;
  title: string;
  setNumber: number;
  reps?: number | null;
  duration?: number | null;
  at: string;
}

interface UseWorkoutProgressProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  routine: any;
  onExerciseChange?: (exerciseIndex: number, setIndex: number) => void;
  onWorkoutEnd?: () => void;
}

export function useWorkoutProgress({ routine, onExerciseChange, onWorkoutEnd }: UseWorkoutProgressProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [completed, setCompleted] = useState<CompletedSet[]>([]);
  const [isCompletingState, setIsCompletingState] = useState(false);

  const currentExerciseIndexRef = useRef<number>(currentExerciseIndex);
  const currentSetIndexRef = useRef<number>(currentSetIndex);
  const completingRef = useRef<boolean>(false);

  useEffect(() => {
    currentExerciseIndexRef.current = currentExerciseIndex;
  }, [currentExerciseIndex]);

  useEffect(() => {
    currentSetIndexRef.current = currentSetIndex;
  }, [currentSetIndex]);

  // Відновлення прогресу з localStorage
  useEffect(() => {
    const savedExercise = localStorage.getItem("currentExerciseIndex");
    const savedSet = localStorage.getItem("currentSetIndex");
    if (savedExercise) {
      setCurrentExerciseIndex(Number(savedExercise));
      currentExerciseIndexRef.current = Number(savedExercise);
    }
    if (savedSet) {
      setCurrentSetIndex(Number(savedSet));
      currentSetIndexRef.current = Number(savedSet);
    }
  }, []);

  const completeSet = () => {
    if (completingRef.current) return;
    completingRef.current = true;
    setIsCompletingState(true);

    const ex = routine?.exercises?.[currentExerciseIndexRef.current];
    if (!ex) return;

    try {
      const item = {
        exerciseId: ex.exercise.id,
        title: ex.exercise.title,
        setNumber: currentSetIndexRef.current + 1,
        reps: ex.reps ?? null,
        duration: ex.duration ?? null,
        at: new Date().toISOString(),
      };

      setCompleted((prev) => {
        const exists = prev.some((p) => p.exerciseId === item.exerciseId && p.setNumber === item.setNumber);
        if (exists) return prev;
        return [item, ...prev];
      });
    } catch (err) {
      console.log(err);
    }

    nextSet();

    setTimeout(() => {
      completingRef.current = false;
      setIsCompletingState(false);
    }, 300);
  };

  const nextSet = () => {
    const exIndex = currentExerciseIndexRef.current;
    const setIndex = currentSetIndexRef.current;
    const currentEx = routine?.exercises?.[exIndex];
    if (!currentEx) return;

    const totalSets = currentEx.sets ?? 0;
    if (setIndex + 1 < totalSets) {
      const newSet = setIndex + 1;
      setCurrentSetIndex(newSet);
      currentSetIndexRef.current = newSet;
      localStorage.setItem("currentSetIndex", String(newSet));
      onExerciseChange?.(exIndex, newSet);
    } else {
      nextExercise();
    }
  };

  const nextExercise = () => {
    const exIndex = currentExerciseIndexRef.current;
    if (exIndex < (routine?.exercises?.length ?? 0) - 1) {
      const newEx = exIndex + 1;
      setCurrentExerciseIndex(newEx);
      currentExerciseIndexRef.current = newEx;
      setCurrentSetIndex(0);
      currentSetIndexRef.current = 0;
      localStorage.setItem("currentExerciseIndex", String(newEx));
      localStorage.setItem("currentSetIndex", "0");
      onExerciseChange?.(newEx, 0);
    } else {
      onWorkoutEnd?.();
    }
  };

  const getCurrentExercise = () => routine?.exercises?.[currentExerciseIndex];

  const getProgress = () => {
    const currentEx = getCurrentExercise();
    return currentEx ? ((currentSetIndex + 1) / (currentEx.sets || 1)) * 100 : 0;
  };

  return {
    currentExerciseIndex,
    currentSetIndex,
    completed,
    isCompletingState,
    completeSet,
    nextSet,
    nextExercise,
    getCurrentExercise,
    getProgress,
    completingRef,
  };
}
