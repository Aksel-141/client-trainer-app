import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Stack,
  Card,
  AspectRatio,
  Chip,
  Tabs,
  TabList,
  Tab,
  TabPanel,
} from "@mui/joy";
import { useState } from "react";

interface ExerciseCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exercise: any;
  currentSetIndex: number;
  progress: number;
  isPreparing: boolean;
  prepTimer: number;
  setTimer: number;
  isCompletingState: boolean;
  isRunning: boolean;
  onCompleteSet: () => void;
  onSkipExercise: () => void;
}

export default function ExerciseCard({
  exercise,
  currentSetIndex,
  progress,
  isPreparing,
  prepTimer,
  setTimer,
  isCompletingState,
  isRunning,
  onCompleteSet,
  onSkipExercise,
}: ExerciseCardProps) {
  const [mediaTab, setMediaTab] = useState<string | number>(0);

  // Отримуємо всі зображення
  const images = exercise?.exercise?.images || [];
  const videos = exercise?.exercise?.videos || [];
  const hasImages = images.length > 0;
  const hasVideos = videos.length > 0;

  return (
    <Card
      variant="outlined"
      sx={{ p: 1.5, height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}
    >
      {/* Заголовок та прогрес */}
      <Box sx={{ mb: 1, flexShrink: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
          <Typography level="title-lg">{exercise.exercise.title}</Typography>
          <Chip color="primary" size="sm" variant="soft">
            Сет {currentSetIndex + 1}
          </Chip>
        </Stack>
        <LinearProgress determinate value={progress} />
      </Box>

      {/* Медіа контент (зображення та відео) */}
      <Box sx={{ flex: 1, minHeight: 0, mb: 1 }}>
        {(hasImages || hasVideos) && (
          <Tabs
            value={mediaTab}
            onChange={(_, value) => value !== null && setMediaTab(value)}
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <TabList size="sm" sx={{ flexShrink: 0 }}>
              {hasImages && <Tab value={0}>📷 Зображення ({images.length})</Tab>}
              {hasVideos && <Tab value={1}>🎬 Відео ({videos.length})</Tab>}
            </TabList>

            {hasImages && (
              <TabPanel
                value={0}
                sx={{ flex: 1, p: 0.5, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    overflowX: "auto",
                    overflowY: "hidden",
                    pb: 0.5,
                    minHeight: 0,
                    "&::-webkit-scrollbar": {
                      height: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "background.level2",
                      borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "primary.200",
                      borderRadius: "4px",
                      "&:hover": {
                        backgroundColor: "primary.300",
                      },
                    },
                  }}
                >
                  {images.map((image: { id: number; path: string; order: number }, index: number) => (
                    <Box
                      key={image.id}
                      sx={{ minWidth: "min(45vw, 480px)", maxWidth: "min(45vw, 480px)", flexShrink: 0 }}
                    >
                      <AspectRatio ratio="16/9">
                        <img
                          src={`http://localhost:6189${image.path}`}
                          alt={`${exercise.exercise.title} - ${index + 1}`}
                          style={{ objectFit: "contain" }}
                        />
                      </AspectRatio>
                      <Typography level="body-xs" sx={{ textAlign: "center", mt: 0.5, color: "text.tertiary" }}>
                        {index + 1} / {images.length}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </TabPanel>
            )}

            {hasVideos && (
              <TabPanel value={1} sx={{ p: 0.5, overflow: "auto", height: "100%", minHeight: 0 }}>
                <Stack spacing={1} sx={{ minHeight: 0 }}>
                  {videos.map((video: { id: number; path: string }, index: number) => (
                    <Box key={index}>
                      <video
                        controls
                        style={{ width: "100%", borderRadius: "8px", maxHeight: "50vh" }}
                        src={`http://localhost:6189${video.path}`}
                      >
                        Ваш браузер не підтримує відео.
                      </video>
                    </Box>
                  ))}
                </Stack>
              </TabPanel>
            )}
          </Tabs>
        )}

        {!hasImages && !hasVideos && (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "background.level1",
              borderRadius: "sm",
            }}
          >
            <Typography level="body-sm" sx={{ color: "text.tertiary" }}>
              Немає медіа
            </Typography>
          </Box>
        )}
      </Box>

      {/* Компактна інформація */}
      <Stack spacing={0.5} sx={{ mb: 1, flexShrink: 0 }}>
        {exercise.exercise.description && (
          <Typography level="body-sm" sx={{ color: "text.secondary", lineHeight: 1.3, fontSize: "0.875rem" }}>
            {exercise.exercise.description}
          </Typography>
        )}

        <Box>
          {isPreparing ? (
            <Typography level="title-lg" color="primary" sx={{ textAlign: "center" }}>
              ⏱️ Підготовка: {prepTimer} сек
            </Typography>
          ) : (
            <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
              {exercise.reps > 0 && (
                <Chip size="md" color="primary" variant="soft">
                  💪 {exercise.reps} повторів
                </Chip>
              )}
              {exercise.duration > 0 && (
                <Chip size="md" color="success" variant="soft">
                  ⏱️ {setTimer} сек
                </Chip>
              )}
              {exercise.rest > 0 && (
                <Chip size="sm" color="neutral" variant="outlined">
                  😌 {exercise.rest}с
                </Chip>
              )}
            </Stack>
          )}
        </Box>
      </Stack>

      {/* Кнопки дій */}
      <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
        <Button
          onClick={onCompleteSet}
          color="primary"
          size="md"
          disabled={isCompletingState || isPreparing || !isRunning}
          sx={{ flex: 1 }}
        >
          ✓ Завершити сет
        </Button>
        <Button onClick={onSkipExercise} variant="outlined" size="md">
          ⏭️ Пропустити
        </Button>
      </Stack>
    </Card>
  );
}
