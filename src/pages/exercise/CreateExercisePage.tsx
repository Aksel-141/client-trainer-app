import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
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
  const [muscleByGroup, setMuscleByGroup] = useState([]);
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
      <Card
        sx={{ width: "100%", maxWidth: 1000, borderRadius: 3, boxShadow: 1 }}
      >
        <CardContent>
          <Typography variant="h5" mb={2} sx={{ mb: 2 }}>
            Додати вправу
          </Typography>
          <TextField
            label="Назва вправи"
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

          <Box display={"flex"} gap={2} mb={2}>
            <Button
              variant="outlined"
              component="label"
              //   startIcon={<AddPhotoAlternate />}
            >
              Завантажити фото
              <input
                hidden
                multiple
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>
            <Button
              variant="outlined"
              component="label"
              //   startIcon={<VideoLibrary />}
            >
              Завантажити відео
              <input
                hidden
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
              />
            </Button>
          </Box>

          {images?.length > 0 && (
            <Box mb={2}>
              <Typography variant="subtitle1">Зображення:</Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
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
            <Box mb={2}>
              <Typography variant="subtitle1">Відео:</Typography>
              <video
                src={URL.createObjectURL(video)}
                width="100%"
                height="240"
                controls
                style={{ borderRadius: 8 }}
              />
            </Box>
          )}

          <div>
            {muscleByGroup.map((item, index) => (
              <div key={index}>
                <h3>{item.nameUa}</h3>
                {item.muscles.map((item) => (
                  <label key={item.id}>
                    <input
                      type="checkbox"
                      name="muscles"
                      value={item.nameEn}
                      onChange={onChangeMuscles}
                    />
                    {item.nameUa}
                  </label>
                ))}
              </div>
            ))}
          </div>

          <Button variant="contained" fullWidth onClick={handleSave}>
            Зберегти вправу
          </Button>
        </CardContent>
      </Card>

      {/* <Box component="section" sx={{ p: 2, border: "1px dashed grey" }}>
        Перетягніть сюди файли які ви хочете додати
      </Box> */}
    </Box>
  );
}
