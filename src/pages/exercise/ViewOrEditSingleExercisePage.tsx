import { useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { getExerciseById, updateExerciseById } from "../../api/exerciseApi";
import { getMuscleByGroup } from "../../api/baseDataApi";
import MuscleVisualizer from "../../../components/MuscleVisualizer/index";
import {
  Box,
  Card,
  Typography,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Divider,
  AspectRatio,
  Chip,
  CircularProgress,
  Button,
  Stack,
  Checkbox,
  Sheet,
} from "@mui/joy";

export default function ViewOrEditSingleExercisePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [currExercise, setCurrExercise] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newVideo, setNewVideo] = useState<File | null>(null);
  const [muscles, setMuscles] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [muscleByGroup, setMuscleByGroup] = useState<any[]>([]);
  const [isEditingMuscles, setIsEditingMuscles] = useState(false);
  const params = useParams();
  const newTitle = useRef<HTMLInputElement | null>(null);

  async function getExersice() {
    try {
      const res = await getExerciseById(Number(params.id));
      setCurrExercise(res.data.result);
    } catch (error) {
      console.log(error);
      toast.error("Сталася помилка при завантаженні вправи");
    }
  }

  async function loadMuscleGroups() {
    try {
      const res = await getMuscleByGroup();
      setMuscleByGroup(res.data.result);
    } catch (error) {
      console.log(error);
      toast.error("Сталася помилка при завантаженні груп м'язів");
    }
  }

  const onChangeMuscles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setMuscles((prev) => [...prev, value]);
    } else {
      setMuscles((prev) => prev.filter((m) => m !== value));
    }
  };

  async function handleUpdate() {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("muscles", JSON.stringify(muscles));
      newImages.forEach((file) => formData.append("images", file));
      if (newVideo) formData.append("video", newVideo);

      await updateExerciseById(Number(params.id), formData);
      setNewImages([]);
      setNewVideo(null);
      setIsEditingMuscles(false);
      await getExersice();
      toast.success("Вправу успішно оновлено");
    } catch (error) {
      console.log(error);
      toast.error("Сталася помилка при оновленні вправи");
    }
  }

  useEffect(() => {
    getExersice();
    loadMuscleGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currExercise) {
      setTitle(currExercise.title);
      setDescription(currExercise.description);
      setMuscles(currExercise.muscles);
    }
  }, [currExercise]);

  if (!currExercise) {
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
    <Box>
      {/* Заголовок */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box>
          <Typography level="h2" sx={{ mb: 0.5 }}>
            {currExercise.title}
          </Typography>
          <Typography level="body-sm" sx={{ color: "neutral.500" }}>
            ID: #{params.id} • Перегляд та редагування вправи
          </Typography>
        </Box>
        <Button variant="solid" color="primary" size="lg" onClick={handleUpdate} sx={{ minWidth: 200 }}>
          Зберегти всі зміни
        </Button>
      </Box>
      <Divider sx={{ mb: 3 }} />

      {/* Назва */}
      <FormControl sx={{ mb: 3 }}>
        <FormLabel>Назва вправи</FormLabel>
        <Input
          value={title}
          slotProps={{
            input: { ref: newTitle },
          }}
          onChange={(e) => setTitle(e.target.value)}
          size="lg"
          placeholder="Введіть назву вправи"
        />
      </FormControl>

      {/* Опис */}
      <FormControl sx={{ mb: 4 }}>
        <FormLabel>Опис</FormLabel>
        <Textarea
          minRows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Введіть опис вправи"
        />
      </FormControl>

      {/* М'язи */}

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <FormLabel>Задіяні м'язи</FormLabel>
          <Button
            variant={isEditingMuscles ? "solid" : "outlined"}
            color={isEditingMuscles ? "success" : "neutral"}
            size="sm"
            onClick={() => setIsEditingMuscles(!isEditingMuscles)}
          >
            {isEditingMuscles ? "Завершити редагування" : "Редагувати м'язи"}
          </Button>
        </Box>
        <Card variant="outlined" sx={{ mt: 1, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            {/* Ліва частина — теги м'язів */}
            <Box
              sx={{
                flex: 1,
                minWidth: "250px",
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {currExercise.musclesInfo?.length > 0 ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                currExercise.musclesInfo.map((m: any, i: number) => (
                  <Chip key={i} variant="soft" color="primary" size="lg">
                    {m.nameUa}
                  </Chip>
                ))
              ) : (
                <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                  М'язи не вибрано
                </Typography>
              )}
            </Box>

            {/* Права частина — MuscleVisualizer */}
            <Box
              sx={{
                flexShrink: 0,
                maxWidth: 700,
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <MuscleVisualizer muscleList={currExercise.muscles} />
            </Box>
          </Box>
        </Card>
      </Box>

      {/* Редагування м'язів */}
      {isEditingMuscles && (
        <Box sx={{ mb: 4 }}>
          <Sheet sx={{ p: 3, borderRadius: "sm", bgcolor: "background.level1" }}>
            <Typography level="body-sm" sx={{ mb: 2, color: "text.secondary" }}>
              Виберіть м'язи, які задіяні у цій вправі:
            </Typography>
            <Stack spacing={2}>
              {muscleByGroup.map((group, index) => (
                <Box key={index}>
                  <Typography level="title-lg" sx={{ mb: 1.5, color: "primary.plainColor" }}>
                    {group.nameUa}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {group.muscles.map((muscle: any) => (
                      <Checkbox
                        key={muscle.id}
                        label={muscle.nameUa}
                        value={muscle.nameEn}
                        checked={muscles.includes(muscle.nameEn)}
                        onChange={onChangeMuscles}
                        variant="soft"
                      />
                    ))}
                  </Box>
                </Box>
              ))}
            </Stack>
          </Sheet>
        </Box>
      )}

      {/* Фото */}
      <Box sx={{ mb: 4 }}>
        <FormLabel>Галерея зображень</FormLabel>

        <Button variant="outlined" component="label" sx={{ mt: 2, mb: 2 }} fullWidth>
          Додати нові фото
          <input
            hidden
            multiple
            type="file"
            accept="image/*"
            onChange={(e) => setNewImages(Array.from(e.target.files || []))}
          />
        </Button>

        {newImages.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography level="body-sm" sx={{ mb: 1, fontWeight: 600 }}>
              Нові фото ({newImages.length}):
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
              {newImages.map((file, idx) => (
                <Chip key={idx} variant="soft" color="success" size="sm">
                  {file.name}
                </Chip>
              ))}
            </Stack>
          </Box>
        )}

        <Typography level="body-sm" sx={{ mb: 1.5, color: "text.secondary" }}>
          Поточні зображення:
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 2,
          }}
        >
          {currExercise.images?.length ? (
            currExercise.images.map((item: string, index: number) => (
              <Box key={index} sx={{ position: "relative" }}>
                <AspectRatio ratio="1" sx={{ borderRadius: "md", overflow: "hidden" }}>
                  <img src={`http://localhost:6189${item}`} alt="" loading="lazy" />
                </AspectRatio>
              </Box>
            ))
          ) : (
            <Typography level="body-sm" color="neutral">
              Немає зображень
            </Typography>
          )}
        </Box>
      </Box>

      {/* Відео */}
      <Box sx={{ mb: 4 }}>
        <FormLabel>Відео</FormLabel>

        <Button variant="outlined" component="label" sx={{ mt: 2, mb: 2 }} fullWidth>
          {currExercise.video ? "Замінити відео" : "Додати відео"}
          <input hidden type="file" accept="video/*" onChange={(e) => setNewVideo(e.target.files?.[0] || null)} />
        </Button>

        {newVideo && (
          <Typography level="body-sm" sx={{ mb: 2, color: "success.500", fontWeight: 600 }}>
            ✓ Нове відео вибрано: {newVideo.name}
          </Typography>
        )}

        {currExercise.video ? (
          <Box>
            <Typography level="body-sm" sx={{ mb: 1.5, color: "text.secondary" }}>
              Поточне відео:
            </Typography>
            <AspectRatio ratio={"16/9"} sx={{ borderRadius: "lg" }} minHeight={240} maxHeight={600}>
              <video
                src={`http://localhost:6189${currExercise.video}`}
                controls
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </AspectRatio>
          </Box>
        ) : (
          <Typography level="body-sm" color="neutral" sx={{ textAlign: "center", py: 4 }}>
            Відео відсутнє
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button variant="solid" color="primary" size="lg" onClick={handleUpdate} sx={{ minWidth: 200 }}>
          Зберегти всі зміни
        </Button>
      </Box>
    </Box>
  );
}
