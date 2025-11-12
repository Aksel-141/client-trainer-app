import { Box, Button, Input, Textarea, Typography, Card, Stack, FormLabel, FormControl } from "@mui/joy";
import { useEffect, useState } from "react";
import navRoutes from "../../router";
import axios from "axios";
import { toast } from "react-toastify";

type Exercise = {
  id: number;
  title: string;
  description: string;
  images: string[];
  video: string;
};
type RoutineExerciseInput = {
  exerciseId: number;
  reps?: number;
  sets?: number;
  duration?: number;
  rest?: number;
};

export default function CreateRoutinePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [routineExercises, setRoutineExercises] = useState<RoutineExerciseInput[]>([]); //Вправи в рутині
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
  async function handleSave() {
    try {
      await axios.post(`${navRoutes.createRoutine.path}`, {
        title,
        description,
        routineExercises,
      });
      toast.success("Успішно створено");
    } catch (error) {
      toast.error("Сталася помилка, детльніше в консолі");
      console.log(error);
    }
  }

  console.log(routineExercises);
  useEffect(() => {
    getDataExercises();
  }, []);
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography level="h2">Додати рутину</Typography>
        <Button onClick={handleSave} size="lg" color="primary">
          Створити рутину
        </Button>
      </Stack>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
        {/* Ліва частина */}
        <Box>
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Назва рутини</FormLabel>
            <Input
              placeholder="Введіть назву рутини"
              size="lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Опис (необов'язково)</FormLabel>
            <Textarea
              placeholder="Введіть опис рутини"
              minRows={3}
              size="lg"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
        </Box>
        {/*Права частина  */}
        <Box>
          <Typography level="h3" sx={{ mb: 2 }}>
            Вправи в рутині
          </Typography>
          <Stack spacing={2} sx={{ mb: 2 }}>
            {routineExercises.map((ex, idx) => {
              const exercise = exercisesList.find((item) => item.id === ex.exerciseId);
              return (
                <Card key={idx} variant="outlined" sx={{ p: 2 }}>
                  <Typography level="title-md" sx={{ mb: 1 }}>
                    {exercise?.title}
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, mb: 2 }}>
                    <FormControl size="sm">
                      <FormLabel>Повторів</FormLabel>
                      <Input
                        type="number"
                        value={ex.reps || ""}
                        onChange={(e) =>
                          setRoutineExercises((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, reps: +e.target.value } : item))
                          )
                        }
                      />
                    </FormControl>
                    <FormControl size="sm">
                      <FormLabel>Тривалість (с)</FormLabel>
                      <Input
                        type="number"
                        value={ex.duration || ""}
                        onChange={(e) =>
                          setRoutineExercises((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, duration: +e.target.value } : item))
                          )
                        }
                      />
                    </FormControl>
                    <FormControl size="sm">
                      <FormLabel>Сетів</FormLabel>
                      <Input
                        type="number"
                        value={ex.sets || ""}
                        onChange={(e) =>
                          setRoutineExercises((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, sets: +e.target.value } : item))
                          )
                        }
                      />
                    </FormControl>
                    <FormControl size="sm">
                      <FormLabel>Відпочинок (с)</FormLabel>
                      <Input
                        type="number"
                        value={ex.rest || ""}
                        onChange={(e) =>
                          setRoutineExercises((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, rest: +e.target.value } : item))
                          )
                        }
                      />
                    </FormControl>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="sm"
                      variant="outlined"
                      disabled={idx === 0}
                      onClick={() => {
                        if (idx === 0) return;
                        setRoutineExercises((prev) => {
                          const newArr = [...prev];
                          [newArr[idx - 1], newArr[idx]] = [newArr[idx], newArr[idx - 1]];
                          return newArr;
                        });
                      }}
                    >
                      ⬆ Вгору
                    </Button>

                    <Button
                      size="sm"
                      variant="outlined"
                      disabled={idx === routineExercises.length - 1}
                      onClick={() => {
                        if (idx === routineExercises.length - 1) return;
                        setRoutineExercises((prev) => {
                          const newArr = [...prev];
                          [newArr[idx + 1], newArr[idx]] = [newArr[idx], newArr[idx + 1]];
                          return newArr;
                        });
                      }}
                    >
                      ⬇ Вниз
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      variant="soft"
                      onClick={() => setRoutineExercises((prev) => prev.filter((_, i) => i !== idx))}
                    >
                      Видалити
                    </Button>
                  </Stack>
                </Card>
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
                    setRoutineExercises((prev) => [
                      ...prev,
                      {
                        exerciseId: found.id,
                        reps: 0,
                        sets: 0,
                        rest: 0,
                        duration: 0,
                      },
                    ]);
                    setSelectedExercise("");
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
