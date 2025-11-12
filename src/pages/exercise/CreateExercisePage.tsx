import { Box, Button, Card, CardContent, Input, Textarea, Typography, Checkbox, Sheet, Stack } from "@mui/joy";
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
    <Box display="flex" p={2}>
      <Card sx={{ width: "100%", maxWidth: 1000, border: "none" }}>
        <CardContent>
          <Typography level="h2" sx={{ mb: 3 }}>
            Додати вправу
          </Typography>

          <Stack spacing={2}>
            <Input placeholder="Назва вправи" value={title} onChange={(e) => setTitle(e.target.value)} size="lg" />
            <Textarea
              placeholder="Опис (необов'язково)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              minRows={3}
              size="lg"
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                component="label"
                //   startIcon={<AddPhotoAlternate />}
              >
                Завантажити фото
                <input hidden multiple type="file" accept="image/*" onChange={handleImageUpload} />
              </Button>
              <Button
                variant="outlined"
                component="label"
                //   startIcon={<VideoLibrary />}
              >
                Завантажити відео
                <input hidden type="file" accept="video/*" onChange={handleVideoUpload} />
              </Button>
            </Box>

            {images?.length > 0 && (
              <Box>
                <Typography level="title-md" sx={{ mb: 1 }}>
                  Зображення:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {images.map((img, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(img)}
                      alt="exercise"
                      width={100}
                      style={{ borderRadius: 8 }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {video && (
              <Box>
                <Typography level="title-md" sx={{ mb: 1 }}>
                  Відео:
                </Typography>
                <video
                  src={URL.createObjectURL(video)}
                  width="100%"
                  height="240"
                  controls
                  style={{ borderRadius: 8 }}
                />
              </Box>
            )}

            <Sheet sx={{ p: 2, borderRadius: "sm", bgcolor: "background.level1" }}>
              {muscleByGroup.map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography level="title-lg" sx={{ mb: 1 }}>
                    {item.nameUa}
                  </Typography>
                  <Stack spacing={1}>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {item.muscles.map((muscle: any) => (
                      <Checkbox
                        key={muscle.id}
                        label={muscle.nameUa}
                        value={muscle.nameEn}
                        onChange={onChangeMuscles}
                      />
                    ))}
                  </Stack>
                </Box>
              ))}
            </Sheet>

            <Button variant="solid" fullWidth onClick={handleSave} size="lg">
              Зберегти вправу
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* <Box component="section" sx={{ p: 2, border: "1px dashed grey" }}>
        Перетягніть сюди файли які ви хочете додати
      </Box> */}
    </Box>
  );
}
