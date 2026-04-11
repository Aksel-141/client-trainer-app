import { Box, Button, Typography, Stack } from "@mui/joy";
import axios from "axios";
import { useEffect } from "react";
import navRoutes from "../../../router/index";
import { toast } from "react-toastify";
import { getMuscleByGroup } from "../../../api/baseDataApi";
import ExerciseForm from "./components/ExerciseForm";

import { useExerciseForm } from "./components/hooks/useExerciseForm";

export default function CreateExercisePage() {
  const {
    title,
    description,
    images,
    video,
    muscles,
    muscleByGroup,
    setTitle,
    setDescription,
    setMuscleByGroup,
    onImageChange,
    onVideoChange,
    onMusclesChange,
  } = useExerciseForm();

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    // JSON-рядок з масивом англійських назв м'язів (ідеально підходить для нового бекенду)
    formData.append("muscles", JSON.stringify(muscles));

    images.forEach((img) => formData.append("images", img));

    if (video) formData.append("video", video);
    try {
      await axios.post(`${navRoutes.createExercise.path}`, formData);
      toast.success("Вправу успішно створено");
    } catch (error) {
      toast.error("Сталася помилка, детальніше в консолі");
      console.error(error);
    }
  };

  // ------
  async function getBaseData() {
    try {
      const mbg = await getMuscleByGroup();
      // Використовуємо сирі дані з бекенду (translations масиви)
      setMuscleByGroup(mbg.data.result);
    } catch (error) {
      toast.error("Сталася помилка завантаження груп м'язів!");
      console.error(error);
    }
  }

  useEffect(() => {
    getBaseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography level="h3">Створити вправу</Typography>
        <Button onClick={handleSave} size="md" color="primary">
          Зберегти
        </Button>
      </Stack>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, flex: 1, overflow: "auto" }}>
        <ExerciseForm
          title={title}
          description={description}
          images={images}
          video={video}
          muscles={muscles}
          muscleByGroup={muscleByGroup}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onImageChange={onImageChange}
          onVideoChange={onVideoChange}
          onMusclesChange={onMusclesChange}
        />
      </Box>
    </Box>
  );
}
