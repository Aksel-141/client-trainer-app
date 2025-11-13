import { Box, Card, CardContent, Typography, Button, Stack, Chip, CircularProgress, Divider } from "@mui/joy";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import WorkoutCalendar from "./components/WorkoutCalendar";
import MuscleVisualizer from "./../../../components/MuscleVisualizer/index";
import { getStatisticsSummary, getStatisticsAll } from "../../api/statisticApi";
import { getRoutineAll } from "../../api/routineApi";
import navRoutes from "../../router";

type StatisticsSummary = {
  totalWorkouts: number;
  totalTime: number;
  weekWorkouts: number;
  weekMuscles: string[];
  lastWorkout: {
    workoutTitle: string;
    endTime: string;
    workoutTime: number;
  } | null;
};

type WorkoutHistory = {
  id: number;
  workoutTitle: string;
  workoutTime: number;
  endTime: string;
  muscles: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Routine = any;

export default function HomePage() {
  const [summary, setSummary] = useState<StatisticsSummary | null>(null);
  const [history, setHistory] = useState<WorkoutHistory[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function loadData() {
    try {
      setLoading(true);

      const [summaryRes, historyRes, routinesRes] = await Promise.all([
        getStatisticsSummary(),
        getStatisticsAll(),
        getRoutineAll(),
      ]);

      setSummary(summaryRes.data.data);
      setHistory(historyRes.data.data);
      setRoutines(routinesRes.data.data.slice(0, 3));
    } catch (error) {
      console.error(error);
      toast.error("Помилка завантаження даних");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}год ${mins}хв`;
    return `${mins}хв`;
  };

  function formatSecondsToMinutes(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log(date, now, diffDays, diffTime);

    if (diffDays === 0) return "Сьогодні";
    if (diffDays === 1) return "Вчора";
    if (diffDays < 7) return `${diffDays} днів тому`;
    return date.toLocaleDateString("uk-UA", { day: "numeric", month: "long" });
  };

  // Для календаря - дати тренувань
  const workoutDates = history?.map((w) => {
    const date = new Date(w.endTime);
    return date.toISOString().split("T")[0];
  });

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size="lg" />
        <Typography level="body-lg">Завантаження...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <Typography level="h3" sx={{ mb: 2 }}>
        Вітаннячка! Потренуймося!
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Ліва частина - основний контент */}
        <Box sx={{ width: "100%", paddingRight: "15px" }}>
          {/* ---- ВЕРХНІЙ РЯДОК */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              boxSizing: "border-box",
              gap: 1.5,
              paddingBottom: 2,
            }}
          >
            {/* Статистика за тиждень */}
            <Box sx={{ flex: 1 }}>
              <Card variant="outlined" sx={{ height: "100%", boxSizing: "border-box" }}>
                <CardContent>
                  <Typography level="body-sm" sx={{ color: "text.secondary", mb: 1 }}>
                    Тренувань цього тижня
                  </Typography>
                  <Typography level="h1" sx={{ color: "primary.500" }}>
                    {summary?.weekWorkouts || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Загальна статистика */}
            <Box sx={{ flex: 1 }}>
              <Card variant="outlined" sx={{ height: "100%", boxSizing: "border-box" }}>
                <CardContent>
                  <Typography level="body-sm" sx={{ color: "text.secondary", mb: 1 }}>
                    Всього тренувань
                  </Typography>
                  <Typography level="h1" sx={{ color: "success.500" }}>
                    {summary?.totalWorkouts || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Загальний час */}
            <Box sx={{ flex: 1 }}>
              <Card variant="outlined" sx={{ height: "100%", boxSizing: "border-box" }}>
                <CardContent>
                  <Typography level="body-sm" sx={{ color: "text.secondary", mb: 1 }}>
                    Загальний час
                  </Typography>
                  <Typography level="h1" sx={{ color: "warning.500" }}>
                    {summary?.totalTime ? formatTime(summary.totalTime) : "0хв"}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
          {/* Кінець блоку статистики верхнього ряду */}

          {/* ---- ДРУГИЙ РЯДОК */}
          <Box
            sx={{
              display: "flex",
              height: "400px",
              gap: 1.5,
              justifyContent: "space-between",
              boxSizing: "border-box",
              paddingBottom: 2,
            }}
          >
            {/* М'язи цього тижня */}
            {summary?.weekMuscles && summary.weekMuscles.length > 0 && (
              <Box>
                <Card variant="outlined" sx={{ boxSizing: "border-box", height: "100%" }}>
                  <CardContent>
                    <Typography level="title-md" sx={{ mb: 2 }}>
                      💪 М'язи які тренувалися цього тижня
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                      <MuscleVisualizer muscleList={summary.weekMuscles} />
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            )}
            {/* Швидкий старт */}
            <Box sx={{ flex: 1 }}>
              <Card variant="outlined" sx={{ boxSizing: "border-box", height: "100%" }}>
                <CardContent>
                  <Typography level="title-lg" sx={{ mb: 2 }}>
                    ⚡ Швидкий старт
                  </Typography>
                  {routines.length > 0 ? (
                    <Stack spacing={1.5}>
                      {routines.map((routine) => (
                        <Card key={routine.id} variant="soft">
                          <CardContent>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Box>
                                <Typography level="title-md">{routine.title}</Typography>
                                <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                                  {routine.exercises.length} вправ
                                </Typography>
                              </Box>
                              <Button size="sm" onClick={() => navigate(`/routine/${routine.id}/start`)}>
                                Почати
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                      <Button variant="outlined" fullWidth onClick={() => navigate(navRoutes.routineList.path)}>
                        Переглянути всі рутини
                      </Button>
                    </Stack>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Typography level="body-md" sx={{ color: "text.secondary", mb: 2 }}>
                        Ще немає створених рутин
                      </Typography>
                      <Button onClick={() => navigate(navRoutes.createRoutine.path)}>Створити першу рутину</Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
            {/* Останні тренування */}
            <Box>
              <Card variant="outlined" sx={{ boxSizing: "border-box", height: "100%", overflow: "auto" }}>
                <CardContent>
                  <Typography level="title-lg" sx={{ mb: 2 }}>
                    📅 Останні тренування
                  </Typography>
                  {history.length > 0 ? (
                    <Stack spacing={1.5}>
                      {history.slice(0, 5).map((workout) => {
                        let muscles: string[] = [];
                        try {
                          muscles = JSON.parse(workout.muscles);
                        } catch (e) {
                          console.error("Error parsing muscles:", e);
                        }

                        return (
                          <Card key={workout.id} variant="soft">
                            <CardContent>
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <Box sx={{ flex: 1 }}>
                                  <Typography level="title-md">{workout.workoutTitle}</Typography>
                                  <Typography level="body-sm" sx={{ color: "text.secondary", mb: 1 }}>
                                    {formatDate(workout.endTime)} • {formatSecondsToMinutes(workout.workoutTime)} хв
                                  </Typography>
                                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                                    {muscles.map((muscle: string, idx: number) => (
                                      <Chip key={idx} variant="outlined" size="sm">
                                        {muscle}
                                      </Chip>
                                    ))}
                                  </Box>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </Stack>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 6 }}>
                      <Typography level="h3" sx={{ color: "text.secondary", mb: 2 }}>
                        Тут поки пусто 🏋️
                      </Typography>
                      <Typography level="body-md" sx={{ color: "text.tertiary", mb: 3 }}>
                        Почніть своє перше тренування, щоб побачити статистику
                      </Typography>
                      <Button size="lg" onClick={() => navigate(navRoutes.routineList.path)}>
                        Обрати тренування
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* ---- Третій РЯДОК */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              boxSizing: "border-box",
              gap: 1.5,
              paddingBottom: 2,
            }}
          >
            {/* Статистика за тиждень */}
            <Box sx={{ flex: 1 }}>
              <Card variant="outlined" sx={{ height: "100%", boxSizing: "border-box" }}>
                <CardContent>
                  <Typography level="body-sm" sx={{ color: "text.secondary", mb: 1 }}>
                    Тренувань цього тижня
                  </Typography>
                  <Typography level="h1" sx={{ color: "primary.500" }}>
                    {summary?.weekWorkouts || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Загальна статистика */}
            <Box sx={{ flex: 1 }}>
              <Card variant="outlined" sx={{ height: "100%", boxSizing: "border-box" }}>
                <CardContent>
                  <Typography level="body-sm" sx={{ color: "text.secondary", mb: 1 }}>
                    Всього тренувань
                  </Typography>
                  <Typography level="h1" sx={{ color: "success.500" }}>
                    {summary?.totalWorkouts || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Загальний час */}
            <Box sx={{ flex: 1 }}>
              <Card variant="outlined" sx={{ height: "100%", boxSizing: "border-box" }}>
                <CardContent>
                  <Typography level="body-sm" sx={{ color: "text.secondary", mb: 1 }}>
                    Загальний час
                  </Typography>
                  <Typography level="h1" sx={{ color: "warning.500" }}>
                    {summary?.totalTime ? formatTime(summary.totalTime) : "0хв"}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>

        {/* Права частина - календар */}
        <Box sx={{ width: "300px" }}>
          <Card variant="outlined" sx={{ position: "sticky", top: 20 }}>
            <CardContent>
              <Typography level="title-lg" sx={{ mb: 2 }}>
                📆 Мій розклад
              </Typography>
              <WorkoutCalendar workouts={workoutDates} />

              {summary?.lastWorkout && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    <Typography level="body-sm" sx={{ color: "text.secondary", mb: 1 }}>
                      Останнє тренування
                    </Typography>
                    <Typography level="title-md" sx={{ mb: 0.5 }}>
                      {summary.lastWorkout.workoutTitle}
                    </Typography>
                    <Typography level="body-sm" sx={{ color: "text.tertiary" }}>
                      {formatDate(summary.lastWorkout.endTime)}
                    </Typography>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
