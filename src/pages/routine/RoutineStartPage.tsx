import axios from "axios";
import { useEffect, useRef, useState } from "react";
// import navRoutes from "./../../router/index";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { Box, Button, CardMedia, LinearProgress, Typography } from "@mui/material";
import { getRoutine } from "../../api/routineApi";
import { addStatistics } from "../../api/statisticApi";

export default function RoutineStartPage() {
  const navigate = useNavigate();
  const [routine, setRoutine] = useState(null);
  const params = useParams();

  // Стан для послідовного виконання
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);

  // Таймери
  const [setTimer, setSetTimer] = useState(0); // Таймер для сету (якщо duration)
  const [restTimer, setRestTimer] = useState(0);

  // Окремі refs для інтервалів
  const workoutIntervalRef = useRef<number | null>(null);
  const setIntervalRef = useRef<number | null>(null);
  const restIntervalRef = useRef<number | null>(null);

  // Refs для індексів, щоб уникнути stale closures
  const currentExerciseIndexRef = useRef<number>(currentExerciseIndex);
  const currentSetIndexRef = useRef<number>(currentSetIndex);

  useEffect(() => {
    currentExerciseIndexRef.current = currentExerciseIndex;
  }, [currentExerciseIndex]);
  useEffect(() => {
    currentSetIndexRef.current = currentSetIndex;
  }, [currentSetIndex]);

  async function getData() {
    try {
      const data = await getRoutine(params.id);
      setRoutine(data.data.data);

      // Відновлення прогресу з localStorage
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
    } catch (error) {
      toast.error("Сталася помилка, детльніше в консолі");
      console.log(error);
    }
  }

  function StartRoutine() {
    if (routine) {
      localStorage.setItem("savedRoutineId", String(routine?.id));
      // Якщо є duration у поточній вправі — стартувати її таймер відразу
      const ex = routine?.exercises?.[currentExerciseIndexRef.current];
      if (ex) {
        if (ex.duration && setTimer === 0 && !isResting) {
          startSetTimer(ex.duration);
        }
      }
      startWorkoutTimer();
    }
  }

  async function EndRoutine() {
    const endtime = new Date().toISOString();
    pauseWorkoutTimer();
    clearSetInterval();
    clearRestInterval();

    const musclesParse = () => {
      const m: string[] = [];
      routine?.exercises.forEach((item) => {
        // console.log("item", item);
        for (let index = 0; index < (item.exercise?.muscles || []).length; index++) {
          m.push(item.exercise.muscles[index].muscle.name);
        }
      });
      return [...new Set(m)];
    };

    const routineStatistics = {
      endTime: endtime.toString(),
      workoutTime: workoutSeconds,
      workoutTitle: routine?.title,
      muscles: musclesParse(),
    };

    try {
      await addStatistics(routineStatistics);
      localStorage.removeItem("savedRoutineId");
      localStorage.removeItem("savedRoutineTime");
      localStorage.removeItem("currentExerciseIndex");
      localStorage.removeItem("currentSetIndex");
      navigate("/");
    } catch (error) {
      toast.error("Сталася помилка, детльніше в консолі");
      console.log(error);
    }

    console.log(routineStatistics);
  }

  // Загальний таймер
  const [workoutSeconds, setWorkoutSeconds] = useState(0);
  const [isWorkoutRunning, setIsWorkoutRunning] = useState(false);

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

      // при відновленні — якщо є активний set/rest, відновити їх
      if (isResting && restTimer > 0) {
        startRestTimer(restTimer);
      } else if (!isResting && setTimer > 0) {
        startSetTimer(setTimer);
      } else {
        // стартувати таймер поточної вправи якщо вимагається
        const ex = routine?.exercises?.[currentExerciseIndexRef.current];
        if (ex?.duration && setTimer === 0 && !isResting) {
          startSetTimer(ex.duration);
        }
      }
    }
  };

  const pauseWorkoutTimer = () => {
    if (workoutIntervalRef.current) {
      clearInterval(workoutIntervalRef.current);
      workoutIntervalRef.current = null;
    }
    setIsWorkoutRunning(false);

    // при паузі зупинити таймери сету/відпочинку але зберегти залишок
    clearSetInterval();
    clearRestInterval();
  };

  // допоміжні clear
  const clearSetInterval = () => {
    if (setIntervalRef.current) {
      clearInterval(setIntervalRef.current);
      setIntervalRef.current = null;
    }
  };
  const clearRestInterval = () => {
    if (restIntervalRef.current) {
      clearInterval(restIntervalRef.current);
      restIntervalRef.current = null;
    }
  };

  // Функція для запуску таймера сету (якщо duration)
  const startSetTimer = (duration: number) => {
    clearSetInterval();
    setIsResting(false);
    const start = duration ?? setTimer;
    setSetTimer(start);
    if (start <= 0) return;

    setIntervalRef.current = window.setInterval(() => {
      setSetTimer((prev) => {
        // якщо workout не запущений — не зменшуємо (безпечно)
        if (!isWorkoutRunning) return prev;
        if (prev <= 1) {
          clearSetInterval();
          completeSet();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Функція для запуску таймера відпочинку
  const startRestTimer = (rest: number) => {
    clearRestInterval();
    setIsResting(true);
    const start = rest ?? restTimer;
    setRestTimer(start);
    if (start <= 0) {
      setIsResting(false);
      nextSet();
      return;
    }
    restIntervalRef.current = window.setInterval(() => {
      setRestTimer((prev) => {
        if (!isWorkoutRunning) return prev;
        if (prev <= 1) {
          clearRestInterval();
          setIsResting(false);
          nextSet();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Завершити сет вручну або автоматично
  const completeSet = () => {
    const ex = routine?.exercises?.[currentExerciseIndexRef.current];
    if (!ex) return;
    // після завершення сету запустити відпочинок (якщо є), інакше перейти
    if (ex.rest && ex.rest > 0) {
      startRestTimer(ex.rest);
    } else {
      nextSet();
    }
  };

  // Перейти до наступного сету
  const nextSet = () => {
    const exIndex = currentExerciseIndexRef.current;
    const setIndex = currentSetIndexRef.current;
    const currentEx = routine?.exercises?.[exIndex];
    if (!currentEx) return;

    // якщо є наступний сет
    const totalSets = currentEx.sets ?? 0;
    if (setIndex + 1 < totalSets) {
      const newSet = setIndex + 1;
      setCurrentSetIndex(newSet);
      currentSetIndexRef.current = newSet;
      localStorage.setItem("currentSetIndex", String(newSet));

      // стартувати timer для сету, якщо duration заданий
      if (currentEx.duration) {
        startSetTimer(currentEx.duration);
      }
    } else {
      // перейти до наступної вправи
      nextExercise();
    }
  };

  // Перейти до наступної вправи
  const nextExercise = () => {
    clearSetInterval();
    clearRestInterval();
    const exIndex = currentExerciseIndexRef.current;
    if (exIndex < (routine?.exercises?.length ?? 0) - 1) {
      const newEx = exIndex + 1;
      setCurrentExerciseIndex(newEx);
      currentExerciseIndexRef.current = newEx;
      setCurrentSetIndex(0);
      currentSetIndexRef.current = 0;
      localStorage.setItem("currentExerciseIndex", String(newEx));
      localStorage.setItem("currentSetIndex", "0");

      const nextEx = routine?.exercises?.[newEx];
      if (nextEx?.duration) {
        // почати таймер тільки якщо workout запущений
        if (isWorkoutRunning) startSetTimer(nextEx.duration);
        else setSetTimer(nextEx.duration); // підготувати залишок на відновлення
      }
    } else {
      EndRoutine(); // завершити тренування
    }
  };

  // очищення
  useEffect(() => {
    return () => {
      if (workoutIntervalRef.current) clearInterval(workoutIntervalRef.current);
      clearSetInterval();
      clearRestInterval();
    };
  }, []);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //Ініціація рутини
  useEffect(() => {
    if (routine) StartRoutine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routine]);

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  const currentExercise = routine?.exercises?.[currentExerciseIndex];
  const progress = currentExercise ? ((currentSetIndex + 1) / (currentExercise.sets || 1)) * 100 : 0;
  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography>{routine?.title}</Typography>
        <Box>
          <Typography>Time: {formatTime(workoutSeconds)}</Typography>
          <button onClick={isWorkoutRunning ? pauseWorkoutTimer : startWorkoutTimer}>
            {isWorkoutRunning ? "⏸" : "▶"}
          </button>
        </Box>
      </Box>

      {currentExercise && (
        <Box>
          <Typography variant="h5">
            {currentExercise.exercise.title} (Сет {currentSetIndex + 1})
          </Typography>
          <LinearProgress variant="determinate" value={progress} />
          <CardMedia
            component="img"
            sx={{ width: 100, height: 100 }}
            image={`http://localhost:6189${JSON.parse(currentExercise.exercise.images)[0]}`}
            alt="image"
          />
          {currentExercise.reps !== null && currentExercise.reps !== undefined && (
            <span>Повторів: {currentExercise.reps}</span>
          )}
          {currentExercise.duration && <span>Час: {setTimer} сек</span>}
          {isResting && <Typography>Відпочинок: {restTimer} сек</Typography>}
          <Button onClick={completeSet} variant="contained">
            Завершити сет
          </Button>
          <Button
            onClick={() => {
              // кнопка Пропустити вправу
              clearSetInterval();
              clearRestInterval();
              nextExercise();
            }}
            sx={{ ml: 1 }}
            variant="outlined"
          >
            Пропустити вправу
          </Button>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={EndRoutine} variant="contained">
          Завершити тренування
        </Button>
      </Box>
    </div>
  );
}
