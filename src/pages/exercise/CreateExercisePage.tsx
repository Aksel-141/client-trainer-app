import { Box, Button, Card, Input, Textarea, Typography, Checkbox, Stack } from "@mui/joy";
import axios from "axios";
import { useEffect, useState } from "react";
import navRoutes from "./../../router/index";
import { toast } from "react-toastify";
import { getMuscleByGroup } from "../../api/baseDataApi";

export default function CreateExercisePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [muscles, setMuscles] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideo(e.target.files[0]);
    }
  };

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
  const onChangeMuscles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setMuscles((prev) => [...prev, value]);
    } else {
      setMuscles((prev) => prev.filter((m) => m !== value));
    }
  };

  // ------
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [muscleByGroup, setMuscleByGroup] = useState<any[]>([]);
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
        {/* Ліва колонка - основна форма */}
        <Stack spacing={2}>
          <Input placeholder="Назва вправи" value={title} onChange={(e) => setTitle(e.target.value)} size="md" />
          <Textarea
            placeholder="Опис (необов'язково)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            minRows={3}
            size="sm"
          />

          <Stack direction="row" spacing={1}>
            <Button variant="outlined" component="label" size="sm" fullWidth>
              📷 Фото
              <input hidden multiple type="file" accept="image/*" onChange={handleImageUpload} />
            </Button>
            <Button variant="outlined" component="label" size="sm" fullWidth>
              🎥 Відео
              <input hidden type="file" accept="video/*" onChange={handleVideoUpload} />
            </Button>
          </Stack>

          {images?.length > 0 && (
            <Box>
              <Typography level="body-sm" sx={{ mb: 1 }}>
                Зображення ({images.length}):
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {images.map((img, idx) => (
                  <img key={idx} src={URL.createObjectURL(img)} alt="exercise" width={80} style={{ borderRadius: 4 }} />
                ))}
              </Box>
            </Box>
          )}

          {video && (
            <Box>
              <Typography level="body-sm" sx={{ mb: 1 }}>
                Відео:
              </Typography>
              <video src={URL.createObjectURL(video)} width="100%" height="180" controls style={{ borderRadius: 4 }} />
            </Box>
          )}
        </Stack>

        {/* Права колонка - м'язи */}
        <Box sx={{ overflow: "auto", pr: 1 }}>
          <Typography level="title-md" sx={{ mb: 1.5 }}>
            М'язи
          </Typography>
          <Stack spacing={2}>
            {muscleByGroup.map((item, index) => (
              <Card key={index} variant="outlined" sx={{ p: 1.5 }}>
                <Typography level="title-sm" sx={{ mb: 1 }}>
                  {item.nameUa}
                </Typography>
                <Stack spacing={0.5}>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {item.muscles.map((muscle: any) => (
                    <Checkbox
                      key={muscle.id}
                      label={muscle.nameUa}
                      value={muscle.nameEn}
                      onChange={onChangeMuscles}
                      size="sm"
                    />
                  ))}
                </Stack>
              </Card>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
