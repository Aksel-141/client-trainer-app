import { Box, Button, Typography, Stack } from "@mui/joy";
import axios from "axios";
import { useEffect } from "react";
import navRoutes from "../../../router/index";
import { toast } from "react-toastify";
import { getMuscleByGroup } from "../../../api/baseDataApi";
import ExerciseForm from "./components/ExerciseForm";
import { useRoutineForm } from "./components/hooks/useExerciseForm";

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
    // setMuscles,
    setMuscleByGroup,
    onImageChange,
    onVideoChange,
    onMusclesChange,
  } = useRoutineForm();

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("muscles", JSON.stringify(muscles));
    // muscles.forEach((m) => formData.append("mucles", m));
    images.forEach((img) => formData.append("images", img));

    if (video) formData.append("video", video);
    try {
      await axios.post(`${navRoutes.createExercise.path}`, formData);
      toast.success("Успішно створено");
    } catch (error) {
      toast.error("Сталася помилка, детльніше в консолі");
      console.log(error);
    }
  };

  // ------
  async function getBaseData() {
    try {
      const mbg = await getMuscleByGroup();
      setMuscleByGroup(mbg.data.result);
    } catch (error) {
      toast.error("Сталася помилка завантаження груп м'язів!");
      console.log(error);
    }
  }
  console.log(muscleByGroup);

  useEffect(() => {
    getBaseData();
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
