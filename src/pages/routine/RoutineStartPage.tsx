import { useEffect, useRef, useState } from "react";
// import navRoutes from "./../../router/index";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { Box, Button, CardMedia, LinearProgress, Typography } from "@mui/material";
import { List, ListItem, ListItemContent, Chip } from "@mui/joy";
import { getRoutine } from "../../api/routineApi";
import { addStatistics } from "../../api/statisticApi";

export default function RoutineStartPage() {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [routine, setRoutine] = useState<any | null>(null);
  const params = useParams<{ id?: string }>();

  // Стан для послідовного виконання
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);

  // Таймери
  const [setTimer, setSetTimer] = useState(0); // Таймер для сету (якщо duration)
  const [prepTimer, setPrepTimer] = useState(0); // Таймер підготовки перед вправою
  const [isPreparing, setIsPreparing] = useState(false); // Чи зараз йде підготовка

  // Окремі refs для інтервалів
  const workoutIntervalRef = useRef<number | null>(null);
  const setIntervalRef = useRef<number | null>(null);
  const prepIntervalRef = useRef<number | null>(null);

  // Список виконаних сетів/вправ
  const [completed, setCompleted] = useState<
    {
      exerciseId: number;
      title: string;
      setNumber: number;
      reps?: number | null;
      duration?: number | null;
      at: string;
    }[]
  >([]);
  const [isCompletingState, setIsCompletingState] = useState(false);

  // Refs для індексів, щоб уникнути stale closures
  const currentExerciseIndexRef = useRef<number>(currentExerciseIndex);
  const currentSetIndexRef = useRef<number>(currentSetIndex);
  // guard to avoid re-entrant completeSet calls
  const completingRef = useRef<boolean>(false);

  useEffect(() => {
    currentExerciseIndexRef.current = currentExerciseIndex;
  }, [currentExerciseIndex]);
  useEffect(() => {
    currentSetIndexRef.current = currentSetIndex;
  }, [currentSetIndex]);

  // load routine when param id changes
  useEffect(() => {
    const load = async () => {
      try {
        if (!params.id) return;
        const data = await getRoutine(Number(params.id));
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
    };
    load();
  }, [params.id]);

  function StartRoutine() {
    if (routine) {
      localStorage.setItem("savedRoutineId", String(routine?.id));
      // Спочатку запустити загальний таймер
      startWorkoutTimer();

      // Запустити таймер підготовки перед першою вправою (новий таймер = 5 сек)
      startPrepTimer(true);
    }
  }

  async function EndRoutine() {
    const endtime = new Date().toISOString();
    pauseWorkoutTimer();
    clearSetInterval();

    const musclesParse = () => {
      const m: string[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      routine?.exercises.forEach((item: any) => {
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

      // При відновленні — перевірити що саме було активне і відновити
      if (isPreparing && prepTimer > 0) {
        // Якщо була підготовка — відновити таймер підготовки
        startPrepTimer();
      } else if (!isPreparing && setTimer > 0) {
        // Якщо був таймер сету — відновити його
        startSetTimer(setTimer);
      }
    }
  };

  const pauseWorkoutTimer = () => {
    if (workoutIntervalRef.current) {
      clearInterval(workoutIntervalRef.current);
      workoutIntervalRef.current = null;
    }
    setIsWorkoutRunning(false);

    // при паузі зупинити таймери сету та підготовки але зберегти залишок
    clearSetInterval();
    clearPrepInterval();
  };

  // допоміжні clear
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

  // Функція для запуску таймера підготовки (5 секунд)
  const startPrepTimer = (resetTimer = false) => {
    clearPrepInterval();
    setIsPreparing(true);
    // Якщо resetTimer=true або prepTimer=0, встановити 5; інакше продовжити з поточного значення
    const start = resetTimer || prepTimer === 0 ? 5 : prepTimer;
    setPrepTimer(start);

    prepIntervalRef.current = window.setInterval(() => {
      setPrepTimer((prev) => {
        if (prev <= 1) {
          clearPrepInterval();
          setIsPreparing(false);
          // Після підготовки стартувати вправу
          const ex = routine?.exercises?.[currentExerciseIndexRef.current];
          if (ex?.duration) {
            startSetTimer(ex.duration);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Функція для запуску таймера сету (якщо duration)
  const startSetTimer = (duration: number) => {
    clearSetInterval();
    const start = duration ?? setTimer;
    setSetTimer(start);
    if (start <= 0) return;

    setIntervalRef.current = window.setInterval(() => {
      setSetTimer((prev) => {
        // don't trigger completion while a completion is already in progress
        if (completingRef.current) return prev;
        if (prev <= 1) {
          clearSetInterval();
          completeSet();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Завершити сет вручну або автоматично
  const completeSet = () => {
    // prevent re-entrance (multiple clicks or overlapping timers)
    if (completingRef.current) return;
    completingRef.current = true;
    setIsCompletingState(true);

    // clear any running set interval first to avoid duplicate completions
    clearSetInterval();
    const ex = routine?.exercises?.[currentExerciseIndexRef.current];
    if (!ex) return;
    // записуємо, що сет виконано
    try {
      // reset visible set timer immediately
      setSetTimer(0);

      const item = {
        exerciseId: ex.exercise.id,
        title: ex.exercise.title,
        setNumber: currentSetIndexRef.current + 1,
        reps: ex.reps ?? null,
        duration: ex.duration ?? null,
        at: new Date().toISOString(),
      };

      setCompleted((prev) => {
        // dedupe: if same exercise+set already present, skip adding
        const exists = prev.some((p) => p.exerciseId === item.exerciseId && p.setNumber === item.setNumber);
        if (exists) return prev;
        return [item, ...prev];
      });
    } catch (err) {
      console.log(err);
    }

    // після завершення сету — одразу перейти до наступного сету (без відпочинку)
    nextSet();

    // allow next completeSet calls (small delay to avoid immediate re-entrance)
    setTimeout(() => {
      completingRef.current = false;
      setIsCompletingState(false);
    }, 300);
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

      // reset set timer and запустити таймер підготовки перед наступним сетом (новий = 5 сек)
      setSetTimer(0);
      startPrepTimer(true);
    } else {
      // перейти до наступної вправи
      nextExercise();
    }
  };

  // Перейти до наступної вправи
  const nextExercise = () => {
    clearSetInterval();
    clearPrepInterval();
    const exIndex = currentExerciseIndexRef.current;
    if (exIndex < (routine?.exercises?.length ?? 0) - 1) {
      const newEx = exIndex + 1;
      setCurrentExerciseIndex(newEx);
      currentExerciseIndexRef.current = newEx;
      setCurrentSetIndex(0);
      currentSetIndexRef.current = 0;
      localStorage.setItem("currentExerciseIndex", String(newEx));
      localStorage.setItem("currentSetIndex", "0");

      // Запустити таймер підготовки перед наступною вправою (новий = 5 сек)
      startPrepTimer(true);
    } else {
      EndRoutine(); // завершити тренування
    }
  };

  // очищення
  useEffect(() => {
    return () => {
      if (workoutIntervalRef.current) clearInterval(workoutIntervalRef.current);
      clearSetInterval();
      clearPrepInterval();
    };
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
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 2, mt: 2 }}>
          <Box>
            <Typography variant="h5">
              {currentExercise.exercise.title} (Сет {currentSetIndex + 1})
            </Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ my: 1 }} />
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
              <CardMedia
                component="img"
                sx={{ width: 100, height: 100 }}
                image={`http://localhost:6189${JSON.parse(currentExercise.exercise.images)[0]}`}
                alt="image"
              />
              <Box>
                {isPreparing ? (
                  <Typography variant="h4" color="primary">
                    Підготовка: {prepTimer} сек
                  </Typography>
                ) : (
                  <>
                    {currentExercise.reps !== null && currentExercise.reps !== undefined && (
                      <Typography>Повторів: {currentExercise.reps}</Typography>
                    )}
                    {currentExercise.duration && <Typography>Час: {setTimer} сек</Typography>}
                  </>
                )}
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button onClick={completeSet} variant="contained" disabled={isCompletingState || isPreparing}>
                Завершити сет
              </Button>
              <Button
                onClick={() => {
                  // кнопка Пропустити вправу
                  clearSetInterval();
                  clearPrepInterval();
                  nextExercise();
                }}
                sx={{ ml: 1 }}
                variant="outlined"
              >
                Пропустити вправу
              </Button>
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Виконані вправи
            </Typography>
            {completed.length === 0 ? (
              <Typography variant="body2">Поки що нічого не виконано</Typography>
            ) : (
              <List size="sm">
                {completed.map((c, i) => (
                  <ListItem key={`${c.exerciseId}-${i}`}>
                    <ListItemContent>
                      <Typography>{c.title}</Typography>
                      <Typography variant="body2">
                        Сет {c.setNumber} • {new Date(c.at).toLocaleTimeString()}
                      </Typography>
                    </ListItemContent>
                    <Chip size="sm" color="primary" variant="soft">
                      {c.reps ? `${c.reps} reps` : c.duration ? `${c.duration}s` : "—"}
                    </Chip>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button onClick={EndRoutine} variant="contained">
          Завершити тренування
        </Button>
      </Box>
    </div>
  );
}
