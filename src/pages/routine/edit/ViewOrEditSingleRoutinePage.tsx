import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getRoutine, updateRoutine } from "../../../api/routineApi";
import { Box, Card, Typography, Divider, CircularProgress, Button, Stack, Input } from "@mui/joy";
import RoutineForm from "../create/components/RoutineForm";
import RoutineExerciseCard from "../create/components/RoutineExerciseCard";
import axios from "axios";
import type { RoutineExerciseInput, Exercise } from "../../../../types/index";

export default function ViewOrEditSingleRoutinePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [currRoutine, setCurrRoutine] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [routineExercises, setRoutineExercises] = useState<RoutineExerciseInput[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [exercisesList, setExercisesList] = useState<Exercise[]>([]);
  const params = useParams();

  async function getRoutineData() {
    try {
      const res = await getRoutine(Number(params.id));
      const routine = res.data.data;
      setCurrRoutine(routine);
      setTitle(routine.title);
      setDescription(routine.description || "");
      setCategoryIds(routine.categories?.map((rc: any) => rc.categoryId) || []);

      // Перетворюємо вправи з бази в формат для редагування
      const exercises =
        routine.exercises?.map((re: any) => ({
          exerciseId: re.exerciseId,
          reps: re.reps || 0,
          sets: re.sets || 0,
          duration: re.duration || 0,
          rest: re.rest || 0,
        })) || [];
      setRoutineExercises(exercises);
    } catch (error) {
      console.log(error);
      toast.error("Сталася помилка при завантаженні рутини");
    }
  }

  async function getDataExercises() {
    try {
      const data = await axios.get(`/exercise/all`);
      setExercisesList(data.data.result);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUpdate() {
    if (!title.trim()) {
      toast.warning("Введіть назву рутини!");
      return;
    }

    if (routineExercises.length === 0) {
      toast.warning("Додайте хоча б одну вправу!");
      return;
    }

    setIsSaving(true);

    try {
      await updateRoutine(Number(params.id), title, description, categoryIds, routineExercises);
      toast.success("Рутину успішно оновлено");
      await getRoutineData();
    } catch (error) {
      console.log(error);
      toast.error("Сталася помилка при оновленні рутини");
    } finally {
      setIsSaving(false);
    }
  }

  // Функції роботи з вправами
  const addExercise = (exerciseId: number) => {
    setRoutineExercises((prev) => [
      ...prev,
      {
        exerciseId,
        reps: 0,
        sets: 0,
        rest: 0,
        duration: 0,
      },
    ]);
    setSelectedExercise("");
  };

  const removeExercise = (index: number) => {
    setRoutineExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const moveExerciseUp = (index: number) => {
    if (index === 0) return;
    setRoutineExercises((prev) => {
      const newArr = [...prev];
      [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
      return newArr;
    });
  };

  const moveExerciseDown = (index: number) => {
    if (index === routineExercises.length - 1) return;
    setRoutineExercises((prev) => {
      const newArr = [...prev];
      [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
      return newArr;
    });
  };

  const updateExerciseParam = (index: number, field: string, value: number) => {
    setRoutineExercises((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: +value } : item)));
  };

  useEffect(() => {
    getRoutineData();
    getDataExercises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currRoutine) {
    return (
      <Box
        sx={{
          height: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size="lg" />
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Заголовок */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box>
          <Typography level="h2" sx={{ mb: 0.5 }}>
            {currRoutine.title}
          </Typography>
          <Typography level="body-sm" sx={{ color: "neutral.500" }}>
            ID: #{params.id} • Перегляд та редагування рутини
          </Typography>
        </Box>
        <Button
          variant="solid"
          color="primary"
          size="lg"
          onClick={handleUpdate}
          loading={isSaving}
          sx={{ minWidth: 200 }}
        >
          Зберегти всі зміни
        </Button>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: 2, flex: 1, overflow: "hidden" }}>
        {/* Ліва частина - форма */}
        <Box>
          <RoutineForm
            title={title}
            description={description}
            categoryIds={categoryIds}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onCategoryChange={setCategoryIds}
          />
        </Box>

        {/* Права частина - список вправ */}
        <Box sx={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <Typography level="title-lg" sx={{ mb: 1.5 }}>
            Вправи ({routineExercises.length})
          </Typography>
          <Stack spacing={1.5} sx={{ flex: 1, overflow: "auto", pr: 1 }}>
            {routineExercises.map((ex, index) => {
              const exercise = exercisesList.find((item) => item.id === ex.exerciseId);
              // Якщо вправу не знайдено, не рендеримо картку
              if (!exercise) return null;

              return (
                <RoutineExerciseCard
                  key={index}
                  exercise={exercise}
                  params={ex}
                  index={index}
                  isFirst={index === 0}
                  isLast={index === routineExercises.length - 1}
                  onUpdate={(field, value) => updateExerciseParam(index, field, value)}
                  onMoveUp={() => moveExerciseUp(index)}
                  onMoveDown={() => moveExerciseDown(index)}
                  onRemove={() => removeExercise(index)}
                />
              );
            })}
          </Stack>

          <Card variant="soft" sx={{ p: 2, mt: 2 }}>
            <Typography level="title-sm" sx={{ mb: 1 }}>
              Додати вправу
            </Typography>
            <Stack direction="row" spacing={1}>
              <Input
                sx={{ flex: 1 }}
                placeholder="Виберіть вправу"
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
                slotProps={{
                  input: {
                    list: "exercise-list",
                  },
                }}
              />
              <datalist id="exercise-list">
                {exercisesList?.map((item) => (
                  <option key={item.id} value={item.title} />
                ))}
              </datalist>
              <Button
                onClick={() => {
                  const found = exercisesList.find((ex) => ex.title === selectedExercise);
                  if (found) {
                    addExercise(found.id);
                  }
                }}
              >
                Додати
              </Button>
            </Stack>
          </Card>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button
          variant="solid"
          color="primary"
          size="lg"
          onClick={handleUpdate}
          loading={isSaving}
          sx={{ minWidth: 200 }}
        >
          Зберегти всі зміни
        </Button>
      </Box>
    </Box>
  );
}
