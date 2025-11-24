import { useState } from "react";
import { toast } from "react-toastify";
// import { createRoutine } from "../../../../api/routineApi";
import type { RoutineExerciseInput } from "../../../../../../types/index";
import { createRoutine } from "../../../../../api/routineApi";

export function UseRoutineForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [routineExercises, setRoutineExercises] = useState<RoutineExerciseInput[]>([]); //Вправи в рутині
  const [isSaving, setIsSaving] = useState(false);

  // Функція додавання вправи
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
  };

  // Функція видалення
  const removeExercise = (index: number) => {
    setRoutineExercises((prev) => prev.filter((_, i) => i !== index));
  };

  // Функція преміщення вправи в гору
  const moveExerciseUp = (index: number) => {
    if (index === 0) return;
    setRoutineExercises((prev) => {
      const newArr = [...prev];
      [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
      return newArr;
    });
  };

  // Функція преміщення вправи в низ
  const moveExerciseDown = (index: number) => {
    if (index === routineExercises.length - 1) return;
    setRoutineExercises((prev) => {
      const newArr = [...prev];
      [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
      return newArr;
    });
  };

  //Оновлення значень в полі вправи
  const updateExerciseParam = (index: number, field: string, value: number) => {
    setRoutineExercises((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: +value } : item)));
  };

  //Збереження та відправка форми
  const handleSave = async () => {
    if (!title.trim()) {
      toast.warning("Друже ,введи назву тренування!");
      return;
    }

    if (routineExercises.length === 0) {
      toast.warning("Друже, ти забув додати вправу!");
      return;
    }

    setIsSaving(true);

    try {
      await createRoutine(title, description, categoryId, routineExercises);
      toast.success("Успішно створено");
      // незабуаємо очистити формочку після успішного збереження
      setTitle("");
      setDescription("");
      setCategoryId(null);
      setRoutineExercises([]);
    } catch (error) {
      toast.error("Сталася помилка, детальніше в консолі");
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  return {
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
  };
}
