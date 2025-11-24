import { Box, Button, Input, Typography, Card, Stack } from "@mui/joy";
import { useEffect, useState } from "react";
import navRoutes from "../../../router";
import axios from "axios";
import { UseRoutineForm } from "./components/hooks/useRoutineForm";
import RoutineForm from "./components/RoutineForm";
import RoutineExerciseCard from "./components/RoutineExerciseCard";

type Exercise = {
  id: number;
  title: string;
  description: string;
  images: string[];
  video: string;
};

export default function CreateRoutinePage() {
  const {
    // Стан
    title,
    description,
    categoryId,
    routineExercises,
    isSaving,

    // Функції форми
    setTitle,
    setDescription,
    setCategoryId,

    // Функції роботи з вправами
    addExercise,
    removeExercise,
    moveExerciseUp,
    moveExerciseDown,
    updateExerciseParam,

    // Збереження
    handleSave,
  } = UseRoutineForm();

  const [selectedExercise, setSelectedExercise] = useState<string>(""); //Вибрана вправа для додавання
  const [exercisesList, setExercisesList] = useState<Exercise[]>([]); //Список всіх вправ

  async function getDataExercises() {
    try {
      const data = await axios.get(`${navRoutes.exerciseList.path}`);
      console.log(data);

      setExercisesList(data.data.result);
    } catch (error) {
      console.log(error);
    }
  }

  console.log(routineExercises);
  useEffect(() => {
    getDataExercises();
  }, []);
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography level="h3">Створити програму</Typography>
        <Button onClick={handleSave} size="md" color="primary" loading={isSaving}>
          Зберегти
        </Button>
      </Stack>
      <Box sx={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: 2, flex: 1, overflow: "hidden" }}>
        {/* Ліва частина - форма */}
        <Box>
          <RoutineForm
            title={title}
            description={description}
            categoryId={categoryId}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onCategoryChange={setCategoryId}
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

          <Card variant="soft" sx={{ p: 2 }}>
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
                    list: "brow",
                  },
                }}
              />
              <datalist id="brow">
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
    </Box>
  );
}
