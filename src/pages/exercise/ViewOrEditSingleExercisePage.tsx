import { useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import getExerciseById from "../../api/exerciseApi";
import MuscleVisualizer from "../../../components/MuscleVisualizer/index";
import {
  Box,
  Card,
  Typography,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  IconButton,
  Divider,
  AspectRatio,
  Chip,
  CircularProgress,
} from "@mui/joy";
import { EditOutlined } from "@mui/icons-material";

export default function ViewOrEditSingleExercisePage() {
  const [currExercise, setCurrExercise] = useState<any>(null);
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

  useEffect(() => {
    getExersice();
  }, []);

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
      <Typography level="h3" sx={{ mb: 1 }}>
        Вправа #{params.id}
      </Typography>
      <Typography level="body-sm" sx={{ mb: 2, color: "neutral.500" }}>
        Перегляд та редагування інформації про вправу
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Назва */}
      <FormControl sx={{ mb: 3 }}>
        <FormLabel>Назва вправи</FormLabel>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Input
            defaultValue={currExercise.title}
            slotProps={{
              input: { ref: newTitle },
            }}
            sx={{ flex: 1 }}
          />
          <IconButton
            variant="soft"
            color="neutral"
            onClick={() => console.log(newTitle.current?.value)}
          >
            <EditOutlined />
          </IconButton>
        </Box>
      </FormControl>

      {/* Опис */}
      <FormControl sx={{ mb: 3 }}>
        <FormLabel>Опис</FormLabel>
        <Box sx={{ display: "flex", gap: 1, alignItems: "start" }}>
          <Textarea
            minRows={3}
            defaultValue={currExercise.description || ""}
            sx={{ flex: 1 }}
          />
          <IconButton variant="soft" color="neutral">
            <EditOutlined />
          </IconButton>
        </Box>
      </FormControl>

      {/* М'язи */}

      <Box sx={{ mb: 4 }}>
        <FormLabel>Задіяні м'язи</FormLabel>
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
            {/* Ліва частина — теги м’язів */}
            <Box
              sx={{
                flex: 1,
                minWidth: "200px",
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {currExercise.musclesInfo?.map((m: any, i: number) => (
                <Chip key={i} variant="soft" color="primary">
                  {m.nameUa}
                </Chip>
              ))}
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

      {/* Фото */}
      <Box sx={{ mb: 4 }}>
        <FormLabel>Галерея</FormLabel>
        <Box
          sx={{
            mt: 1,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: 1.5,
          }}
        >
          {currExercise.images?.length ? (
            currExercise.images.map((item: string, index: number) => (
              <AspectRatio key={index} ratio="1" sx={{ borderRadius: "md" }}>
                <img
                  src={`http://localhost:6189${item}`}
                  alt=""
                  loading="lazy"
                />
                <IconButton
                  variant="soft"
                  color="neutral"
                  onClick={() => console.log(newTitle.current?.value)}
                >
                  <EditOutlined />
                </IconButton>
              </AspectRatio>
            ))
          ) : (
            <Typography level="body-sm" color="neutral">
              Немає зображень
            </Typography>
          )}
        </Box>
      </Box>

      {/* Відео */}
      <Box>
        <Box sx={{ display: "flex" }}>
          <FormLabel>Відео</FormLabel>{" "}
          <IconButton
            variant="soft"
            color="neutral"
            onClick={() => console.log(newTitle.current?.value)}
          >
            <EditOutlined />
          </IconButton>
        </Box>
        {currExercise.video ? (
          <AspectRatio ratio="16/9" sx={{ mt: 1, borderRadius: "lg" }}>
            <video
              src={`http://localhost:6189${currExercise.video}`}
              controls
            />
          </AspectRatio>
        ) : (
          <Typography level="body-sm" color="neutral" sx={{ mt: 1 }}>
            Відео відсутнє
          </Typography>
        )}
      </Box>
    </Box>
  );
}
