import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import { Box, Button, Typography, Stack, Tabs, TabList, Tab, TabPanel, LinearProgress, Chip } from "@mui/joy";
import { getRoutine } from "../../../api/routineApi";
import { addWorkout } from "../../../api/statisticApi";
import WorkoutTimer from "./components/WorkoutTimer";
import ExerciseCard from "./components/ExerciseCard";
import CompletedSetsList from "./components/CompletedSetsList";
import { useWorkoutTimer } from "./components/hooks/useWorkoutTimer";
import { useExerciseTimer } from "./components/hooks/useExerciseTimer";
import { useWorkoutProgress } from "./components/hooks/useWorkoutProgress";
import { useRestTimer } from "./components/hooks/useRestTimer";

export default function RoutineStartPage() {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [routine, setRoutine] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const params = useParams<{ id?: string }>();

  // Hooks для управління станом
  const { workoutSeconds, isWorkoutRunning, startWorkoutTimer, pauseWorkoutTimer } = useWorkoutTimer();

  const restTimer = useRestTimer({
    onRestComplete: () => {
      // Після відпочинку автоматично продовжуємо
      console.log("Rest complete!");
    },
  });

  const handleSetComplete = () => {
    exerciseTimer.clearSetInterval();
    workoutProgress.completeSet();

    // Автоматично запускаємо Rest Timer якщо є rest параметр
    const currentEx = workoutProgress.getCurrentExercise();
    if (currentEx?.rest && currentEx.rest > 0) {
      restTimer.startRestTimer(currentEx.rest);
    }
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

  function PauseWorkout() {
    pauseWorkoutTimer();
    if (restTimer.isResting) {
      restTimer.pauseRestTimer();
    }
  }

  function ResumeWorkout() {
    startWorkoutTimer();
    if (restTimer.isResting) {
      restTimer.resumeRestTimer();
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

  function CancelWorkout() {
    const confirmed = window.confirm("Ви впевнені, що хочете відмінити тренування? Усі дані будуть втрачені!");
    if (confirmed) {
      pauseWorkoutTimer();
      exerciseTimer.clearSetInterval();
      restTimer.stopRestTimer();
      localStorage.removeItem("savedRoutineId");
      localStorage.removeItem("savedRoutineTime");
      localStorage.removeItem("workoutStartTime");
      localStorage.removeItem("currentExerciseIndex");
      localStorage.removeItem("currentSetIndex");
      toast.info("Тренування відмінено");
      navigate("/");
    }
  }

  //Ініціація рутини
  useEffect(() => {
    if (routine) StartRoutine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routine]);

  const currentExercise = workoutProgress.getCurrentExercise();
  const progressPercent = workoutProgress.getProgress();
  const totalSets = routine?.exercises?.reduce((sum: number, ex: any) => sum + (ex.sets || 0), 0) || 0;
  const completedSetsCount = workoutProgress.completed.length;
  const overallProgress = totalSets > 0 ? (completedSetsCount / totalSets) * 100 : 0;

  return (
    <Box
      sx={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", bgcolor: "background.body" }}
    >
      {/* Sticky Header */}
      <Box
        sx={{
          flexShrink: 0,
          bgcolor: "background.surface",
          borderBottom: "1px solid",
          borderColor: "divider",
          boxShadow: "sm",
        }}
      >
        <Stack spacing={1} sx={{ px: 2, py: 1.5 }}>
          {/* Top Row: Title + Timer + Actions */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
            <Box sx={{ minWidth: 0 }}>
              <Typography level="h4" sx={{ mb: 0.5 }}>
                {routine?.title}
              </Typography>
              <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
                {workoutProgress.currentExerciseIndex + 1} / {routine?.exercises?.length || 0} вправ
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
              <WorkoutTimer
                seconds={workoutSeconds}
                isRunning={isWorkoutRunning}
                onStart={ResumeWorkout}
                onPause={PauseWorkout}
              />
              <Button onClick={EndRoutine} color="success" variant="solid" size="md" disabled={!isWorkoutRunning}>
                🏁 Завершити
              </Button>
              <Button onClick={CancelWorkout} color="danger" variant="outlined" size="md">
                ❌ Відмінити
              </Button>
            </Stack>
          </Stack>

          {/* Overall Progress */}
          <Box>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Typography level="body-xs" fontWeight="lg">
                Загальний прогрес
              </Typography>
              <Typography level="body-xs" sx={{ color: "text.secondary" }}>
                {completedSetsCount} / {totalSets} сетів
              </Typography>
            </Stack>
            <LinearProgress
              determinate
              value={overallProgress}
              size="lg"
              color="success"
              sx={{
                "--LinearProgress-thickness": "8px",
                "--LinearProgress-radius": "8px",
              }}
            />
          </Box>
        </Stack>
      </Box>

      {/* Main Content with Tabs */}
      {currentExercise && (
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value as number)}
          sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}
        >
          <TabList
            size="md"
            sx={{
              flexShrink: 0,
              bgcolor: "background.surface",
              px: 2,
              py: 1,
              borderBottom: "1px solid",
              borderColor: "divider",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Tab value={0} variant="soft">
              💪 Вправа
            </Tab>
            <Tab value={1} variant="soft">
              📊 Прогрес
            </Tab>
            <Tab value={2} variant="soft">
              ✅ Історія ({completedSetsCount})
            </Tab>
          </TabList>

          {/* Tab 0: Current Exercise */}
          <TabPanel value={0} sx={{ flex: 1, overflow: "auto", p: 2, minHeight: 0 }}>
            <ExerciseCard
              exercise={currentExercise}
              currentSetIndex={workoutProgress.currentSetIndex}
              progress={progressPercent}
              isPreparing={exerciseTimer.isPreparing}
              prepTimer={exerciseTimer.prepTimer}
              setTimer={exerciseTimer.setTimer}
              isCompletingState={workoutProgress.isCompletingState}
              isRunning={isWorkoutRunning}
              isResting={restTimer.isResting}
              restSeconds={restTimer.restSeconds}
              restProgress={restTimer.restProgress}
              nextExercise={routine?.exercises?.[workoutProgress.currentExerciseIndex + 1]}
              onCompleteSet={handleSetComplete}
              onSkipRest={restTimer.skipRest}
              onSkipExercise={() => {
                exerciseTimer.clearSetInterval();
                exerciseTimer.clearPrepInterval();
                restTimer.stopRestTimer();
                workoutProgress.nextExercise();
              }}
            />
          </TabPanel>

          {/* Tab 1: Progress Overview */}
          <TabPanel value={1} sx={{ flex: 1, overflow: "auto", p: 2, minHeight: 0 }}>
            <Stack spacing={2} sx={{ maxWidth: "800px", mx: "auto" }}>
              <Typography level="h4" sx={{ mb: 1 }}>
                📊 Огляд тренування
              </Typography>

              {routine?.exercises?.map((ex: any, idx: number) => {
                const exerciseCompleted = workoutProgress.completed.filter((c: any) => c.exerciseId === ex.exercise.id);
                const isActive = idx === workoutProgress.currentExerciseIndex;
                const isDone = exerciseCompleted.length >= (ex.sets || 0);

                return (
                  <Box
                    key={idx}
                    sx={{
                      p: 2,
                      borderRadius: "md",
                      bgcolor: isActive ? "primary.softBg" : isDone ? "success.softBg" : "background.level1",
                      border: "1px solid",
                      borderColor: isActive ? "primary.outlinedBorder" : isDone ? "success.outlinedBorder" : "divider",
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography level="title-md" fontWeight="lg">
                        {isActive && "▶️ "}
                        {isDone && "✅ "}
                        {ex.exercise.title}
                      </Typography>
                      <Chip size="sm" color={isDone ? "success" : isActive ? "primary" : "neutral"}>
                        {exerciseCompleted.length} / {ex.sets || 0}
                      </Chip>
                    </Stack>
                    <LinearProgress
                      determinate
                      value={(exerciseCompleted.length / (ex.sets || 1)) * 100}
                      size="sm"
                      color={isDone ? "success" : isActive ? "primary" : "neutral"}
                    />
                  </Box>
                );
              })}
            </Stack>
          </TabPanel>

          {/* Tab 2: Completed Sets */}
          <TabPanel value={2} sx={{ flex: 1, overflow: "auto", p: 2, minHeight: 0 }}>
            <Box sx={{ maxWidth: "800px", mx: "auto" }}>
              <CompletedSetsList completed={workoutProgress.completed} />
            </Box>
          </TabPanel>
        </Tabs>
      )}

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Box>
  );
}
