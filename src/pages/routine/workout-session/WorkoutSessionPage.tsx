import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { Box, Button, Typography, Stack } from "@mui/joy";
import { getRoutine } from "../../../api/routineApi";
import { addWorkout } from "../../../api/statisticApi";
import WorkoutTimer from "./components/WorkoutTimer";
import ExerciseCard from "./components/ExerciseCard";
import CompletedSetsList from "./components/CompletedSetsList";
import { useWorkoutTimer } from "./components/hooks/useWorkoutTimer";
import { useExerciseTimer } from "./components/hooks/useExerciseTimer";
import { useWorkoutProgress } from "./components/hooks/useWorkoutProgress";

export default function RoutineStartPage() {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [routine, setRoutine] = useState<any | null>(null);
  const params = useParams<{ id?: string }>();

  // Hooks для управління станом
  const { workoutSeconds, isWorkoutRunning, startWorkoutTimer, pauseWorkoutTimer } = useWorkoutTimer();

  const handleSetComplete = () => {
    exerciseTimer.clearSetInterval();
    workoutProgress.completeSet();
  };

  const handlePrepComplete = (duration?: number) => {
    if (duration) {
      exerciseTimer.startSetTimer(duration);
    }
  };

  const exerciseTimer = useExerciseTimer({
    onSetComplete: handleSetComplete,
    onPrepComplete: handlePrepComplete,
  });

  const workoutProgress = useWorkoutProgress({
    routine,
    onExerciseChange: (exerciseIndex) => {
      const ex = routine?.exercises?.[exerciseIndex];
      exerciseTimer.resetSetTimer();
      exerciseTimer.startPrepTimer(true, ex?.duration);
    },
    onWorkoutEnd: () => EndRoutine(),
  });

  // load routine when param id changes
  useEffect(() => {
    const load = async () => {
      try {
        if (!params.id) return;
        const data = await getRoutine(Number(params.id));
        setRoutine(data.data.data);
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
      localStorage.setItem("workoutStartTime", new Date().toISOString());
      startWorkoutTimer();
      exerciseTimer.startPrepTimer(true);
    }
  }

  async function EndRoutine() {
    const endtime = new Date().toISOString();
    const starttime = localStorage.getItem("workoutStartTime") || new Date().toISOString();
    pauseWorkoutTimer();
    exerciseTimer.clearSetInterval();

    // Збираємо унікальні ID м'язів з фактично виконаних вправ
    const getMuscleIds = () => {
      const muscleIds = new Set<number>();
      const completedExerciseIds = [...new Set(workoutProgress.completed.map((c) => c.exerciseId))];

      completedExerciseIds.forEach((exerciseId) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const exerciseData = routine?.exercises.find((ex: any) => ex.exercise.id === exerciseId);

        if (exerciseData?.exercise?.muscles) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          exerciseData.exercise.muscles.forEach((muscleItem: any) => {
            muscleIds.add(muscleItem.muscle.id);
          });
        }
      });

      return Array.from(muscleIds);
    };

    // Групуємо completed по вправах
    const exercisesMap = new Map();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    workoutProgress.completed.forEach((item: any) => {
      if (!exercisesMap.has(item.exerciseId)) {
        exercisesMap.set(item.exerciseId, []);
      }
      exercisesMap.get(item.exerciseId).push({
        setNumber: item.setNumber,
        reps: item.reps,
        duration: item.duration,
        completedAt: item.at,
      });
    });

    const exercises = Array.from(exercisesMap.entries()).map(([exerciseId, sets]) => ({
      exerciseId,
      sets,
    }));

    const workoutData = {
      routineId: routine?.id || null,
      title: routine?.title || "Тренування",
      startTime: starttime,
      endTime: endtime,
      totalTime: workoutSeconds,
      exercises,
      muscles: getMuscleIds(),
    };

    try {
      await addWorkout(workoutData);
      localStorage.removeItem("savedRoutineId");
      localStorage.removeItem("savedRoutineTime");
      localStorage.removeItem("workoutStartTime");
      localStorage.removeItem("currentExerciseIndex");
      localStorage.removeItem("currentSetIndex");
      navigate("/");
    } catch (error) {
      toast.error("Сталася помилка, детльніше в консолі");
      console.log(error);
    }
  }

  //Ініціація рутини
  useEffect(() => {
    if (routine) StartRoutine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routine]);

  const currentExercise = workoutProgress.getCurrentExercise();
  const progressPercent = workoutProgress.getProgress();

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2, py: 1, flexShrink: 0 }}>
        <Typography level="h3">{routine?.title}</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <WorkoutTimer
            seconds={workoutSeconds}
            isRunning={isWorkoutRunning}
            onStart={startWorkoutTimer}
            onPause={pauseWorkoutTimer}
          />
          <Button onClick={EndRoutine} color="primary" size="md" disabled={!isWorkoutRunning}>
            Завершити
          </Button>
        </Stack>
      </Stack>

      {currentExercise && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: 2,
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            px: 2,
            pb: 2,
          }}
        >
          <ExerciseCard
            exercise={currentExercise}
            currentSetIndex={workoutProgress.currentSetIndex}
            progress={progressPercent}
            isPreparing={exerciseTimer.isPreparing}
            prepTimer={exerciseTimer.prepTimer}
            setTimer={exerciseTimer.setTimer}
            isCompletingState={workoutProgress.isCompletingState}
            isRunning={isWorkoutRunning}
            onCompleteSet={handleSetComplete}
            onSkipExercise={() => {
              exerciseTimer.clearSetInterval();
              exerciseTimer.clearPrepInterval();
              workoutProgress.nextExercise();
            }}
          />

          <CompletedSetsList completed={workoutProgress.completed} />
        </Box>
      )}
    </Box>
  );
}
