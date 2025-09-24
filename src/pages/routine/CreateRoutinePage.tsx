import { Box, Button, TextField, Typography } from "@mui/material";
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
  title: string;
  reps?: number;
  sets?: number;
  duration?: number;
  rest?: number;
};

export default function CreateRoutinePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [routineExercises, setRoutineExercises] = useState<
    RoutineExerciseInput[]
  >([]); //Вправи в рутині
  const [selectedExercise, setSelectedExercise] = useState<string>(""); //Вибрана вправа для додавання

  const [exercisesList, setExercisesList] = useState<Exercise[]>([]); //Список всіх вправ

  async function getDataExercises() {
    try {
      const data = await axios.get(`${navRoutes.exerciseList.path}`);
      console.log(data);

      setExercisesList(data.data.data);
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
      <Typography variant="h5" mb={2} sx={{ mb: 2 }}>
        Додати рутину
      </Typography>
      <Button onClick={handleSave}>Створити рутину</Button>
      <Box sx={{}}>
        {/* Ліва частина */}
        <Box>
          <TextField
            label="Назва рутини"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Опис (необов’язково)"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            sx={{ mb: 2 }}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>
        {/*Права частина  */}
        <Box>
          <Typography variant="h5" mb={2} sx={{ mb: 2 }}>
            Вправи в рутині
          </Typography>
          <Box>
            {routineExercises.map((ex, idx) => {
              const exercise = exercisesList.find(
                (item) => item.id === ex.exerciseId
              );
              return (
                <Box key={idx} sx={{ border: "1px solid", mb: 2, p: 2 }}>
                  <Typography>{exercise?.title}</Typography>
                  <label>
                    Reps:
                    <input
                      type="number"
                      value={ex.reps || ""}
                      onChange={(e) =>
                        setRoutineExercises((prev) =>
                          prev.map((item, i) =>
                            i === idx
                              ? { ...item, reps: +e.target.value }
                              : item
                          )
                        )
                      }
                    />
                  </label>
                  <label>
                    Duration:
                    <input
                      type="number"
                      value={ex.duration || ""}
                      onChange={(e) =>
                        setRoutineExercises((prev) =>
                          prev.map((item, i) =>
                            i === idx
                              ? { ...item, duration: +e.target.value }
                              : item
                          )
                        )
                      }
                    />
                  </label>
                  <label>
                    Sets:
                    <input
                      type="number"
                      value={ex.sets || ""}
                      onChange={(e) =>
                        setRoutineExercises((prev) =>
                          prev.map((item, i) =>
                            i === idx
                              ? { ...item, sets: +e.target.value }
                              : item
                          )
                        )
                      }
                    />
                  </label>
                  <label>
                    Rest:
                    <input
                      type="number"
                      value={ex.rest || ""}
                      onChange={(e) =>
                        setRoutineExercises((prev) =>
                          prev.map((item, i) =>
                            i === idx
                              ? { ...item, rest: +e.target.value }
                              : item
                          )
                        )
                      }
                    />
                  </label>
                  <Button
                    onClick={() => {
                      if (idx === 0) return; // перший не можна підняти вище
                      setRoutineExercises((prev) => {
                        const newArr = [...prev];
                        [newArr[idx - 1], newArr[idx]] = [
                          newArr[idx],
                          newArr[idx - 1],
                        ];
                        return newArr;
                      });
                    }}
                  >
                    ⬆ Вгору
                  </Button>

                  <Button
                    onClick={() => {
                      if (idx === routineExercises.length - 1) return; // останній не можна опустити нижче
                      setRoutineExercises((prev) => {
                        const newArr = [...prev];
                        [newArr[idx + 1], newArr[idx]] = [
                          newArr[idx],
                          newArr[idx + 1],
                        ];
                        return newArr;
                      });
                    }}
                  >
                    ⬇ Вниз
                  </Button>
                  <Button
                    color="error"
                    onClick={() =>
                      setRoutineExercises(
                        (prev) => prev.filter((_, i) => i !== idx) // видаляємо по індексу
                      )
                    }
                  >
                    Видалити
                  </Button>
                </Box>
              );
            })}
          </Box>

          <Box>
            <input
              list="brow"
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
            />
            <datalist id="brow">
              {exercisesList.map((item) => (
                <option key={item.id} value={item.title} />
              ))}
            </datalist>
            <Button
              onClick={() => {
                const found = exercisesList.find(
                  (ex) => ex.title === selectedExercise
                );
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
                  setSelectedExercise(""); // очистити інпут
                }
              }}
            >
              Додати вправу
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
