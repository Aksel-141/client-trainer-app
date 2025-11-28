import { Box, Button, Typography, LinearProgress, Stack, Card, Chip } from "@mui/joy";
import { useState, useEffect } from "react";

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
  isResting?: boolean;
  restSeconds?: number;
  restProgress?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nextExercise?: any;
  onCompleteSet: () => void;
  onSkipRest?: () => void;
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
  isResting = false,
  restSeconds = 0,
  restProgress = 0,
  nextExercise,
  onCompleteSet,
  onSkipRest,
  onSkipExercise,
}: ExerciseCardProps) {
  const [mediaTab, setMediaTab] = useState<string | number>(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Отримуємо всі зображення
  const images = exercise?.exercise?.images || [];
  const videos = exercise?.exercise?.videos || [];
  const hasImages = images.length > 0;
  const hasVideos = videos.length > 0;

  // Встановлюємо початкову вкладку
  useEffect(() => {
    if (!hasImages && hasVideos) {
      setMediaTab(1); // Якщо немає фото, але є відео - показуємо відео
    } else {
      setMediaTab(0); // Інакше - фото
    }
  }, [hasImages, hasVideos]);

  // Автоматичне перемикання слайдів кожні 3 секунди
  useEffect(() => {
    if (mediaTab === 0 && hasImages && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [hasImages, images.length, mediaTab]);

  // Keyboard Shortcut: Space = Complete Set or Skip Rest
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (isResting) {
          // Якщо відпочиваємо - пропускаємо відпочинок
          onSkipRest?.();
        } else if (!isCompletingState && !isPreparing && isRunning) {
          // Інакше - завершуємо сет
          onCompleteSet();
        }
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isCompletingState, isPreparing, isRunning, isResting, onCompleteSet, onSkipRest]);

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", maxWidth: "1400px", mx: "auto" }}>
      {/* Головне медіа - займає основний простір */}
      <Box sx={{ flex: 1, position: "relative", minHeight: 0, mb: 2 }}>
        {isResting ? (
          // Rest Screen
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-evenly",
              bgcolor: "info.softBg",
              borderRadius: "lg",
              border: "2px solid",
              borderColor: "info.outlinedBorder",
              p: { xs: 2, md: 3 },
              overflow: "auto",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography level="h1" sx={{ fontSize: { xs: "4rem", md: "6rem" }, fontWeight: 900, mb: 1 }}>
                😌 {restSeconds}
              </Typography>
              <Typography level="h3" sx={{ color: "info.plainColor", mb: 2 }}>
                Відпочиваємо...
              </Typography>
              <LinearProgress
                determinate
                value={restProgress}
                size="lg"
                sx={{
                  width: "min(350px, 80vw)",
                  mx: "auto",
                  mt: 2,
                  "--LinearProgress-thickness": "10px",
                  "--LinearProgress-progressRadius": "8px",
                }}
              />
            </Box>

            {/* Next Exercise Preview */}
            {nextExercise && (
              <Card variant="outlined" sx={{ maxWidth: 500, width: "90%", flexShrink: 0 }}>
                <Typography level="body-sm" sx={{ mb: 1, color: "text.secondary" }}>
                  👉 Наступна вправа:
                </Typography>
                <Typography level="title-lg" fontWeight="bold">
                  {nextExercise.exercise.title}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                  {nextExercise.sets > 0 && <Chip size="sm">{nextExercise.sets} сетів</Chip>}
                  {nextExercise.reps > 0 && <Chip size="sm">{nextExercise.reps} повторів</Chip>}
                  {nextExercise.duration > 0 && <Chip size="sm">{nextExercise.duration}s</Chip>}
                </Stack>
              </Card>
            )}

            <Button
              onClick={onSkipRest}
              variant="outlined"
              color="neutral"
              size="lg"
              sx={{ minWidth: 200, flexShrink: 0, position: "relative" }}
            >
              ⏩ Пропустити відпочинок
              <Typography
                level="body-xs"
                sx={{
                  position: "absolute",
                  bottom: 4,
                  right: 8,
                  opacity: 0.7,
                  fontSize: "0.65rem",
                }}
              >
                [SPACE]
              </Typography>
            </Button>
          </Box>
        ) : isPreparing ? (
          // Екран підготовки
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "warning.softBg",
              borderRadius: "lg",
              border: "2px solid",
              borderColor: "warning.outlinedBorder",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography level="h1" sx={{ fontSize: { xs: "4rem", md: "6rem" }, fontWeight: 900, mb: 1 }}>
                ⏱️ {prepTimer}
              </Typography>
              <Typography level="h3" sx={{ color: "warning.plainColor", mb: 2 }}>
                Підготовка...
              </Typography>
              <Typography level="title-lg">{exercise.exercise.title}</Typography>
            </Box>
          </Box>
        ) : hasImages || hasVideos ? (
          // Показуємо медіа
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              bgcolor: "background.level1",
              borderRadius: "lg",
              overflow: "hidden",
            }}
          >
            {/* Tabs для перемикання між фото/відео */}
            {hasImages && hasVideos && (
              <Box sx={{ p: 1, bgcolor: "background.surface", borderBottom: "1px solid", borderColor: "divider" }}>
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Button size="sm" variant={mediaTab === 0 ? "solid" : "outlined"} onClick={() => setMediaTab(0)}>
                    📷 Фото
                  </Button>
                  <Button size="sm" variant={mediaTab === 1 ? "solid" : "outlined"} onClick={() => setMediaTab(1)}>
                    🎬 Відео
                  </Button>
                </Stack>
              </Box>
            )}

            {/* Контент медіа */}
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: 2, minHeight: 0 }}>
              {mediaTab === 0 ? (
                hasImages ? (
                  // Слайдшоу зображень
                  <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
                    <Box
                      component="img"
                      src={`http://localhost:6189${images[currentImageIndex].path}`}
                      alt={exercise.exercise.title}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        borderRadius: "md",
                      }}
                    />
                    {/* Індикатор слайдів */}
                    {images.length > 1 && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 16,
                          left: "50%",
                          transform: "translateX(-50%)",
                          display: "flex",
                          gap: 1,
                          bgcolor: "rgba(0,0,0,0.5)",
                          px: 2,
                          py: 1,
                          borderRadius: "xl",
                        }}
                      >
                        {images.map((_: any, idx: number) => (
                          <Box
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            sx={{
                              width: idx === currentImageIndex ? 24 : 8,
                              height: 8,
                              bgcolor: idx === currentImageIndex ? "primary.500" : "neutral.300",
                              borderRadius: "xl",
                              cursor: "pointer",
                              transition: "all 0.3s",
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                ) : null
              ) : mediaTab === 1 && hasVideos ? (
                // Відео
                <video
                  controls
                  autoPlay
                  loop
                  key={videos[0].id}
                  style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "8px" }}
                  src={`http://localhost:6189${videos[0].path}`}
                >
                  Ваш браузер не підтримує відео.
                </video>
              ) : null}
            </Box>
          </Box>
        ) : (
          // Немає медіа - показуємо таймер або placeholder
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: exercise.duration > 0 ? "success.softBg" : "background.level1",
              borderRadius: "lg",
              border: "2px solid",
              borderColor: exercise.duration > 0 ? "success.outlinedBorder" : "divider",
            }}
          >
            {exercise.duration > 0 ? (
              <Box sx={{ textAlign: "center" }}>
                <Typography level="h1" sx={{ fontSize: { xs: "4rem", md: "6rem" }, fontWeight: 900, mb: 1 }}>
                  ⏱️ {setTimer}
                </Typography>
                <Typography level="h3" sx={{ color: "success.plainColor" }}>
                  Виконуємо...
                </Typography>
              </Box>
            ) : (
              <Box sx={{ textAlign: "center", p: 4 }}>
                <Typography level="h2" sx={{ mb: 2 }}>
                  {exercise.exercise.title}
                </Typography>
                {exercise.exercise.description && (
                  <Typography level="body-lg" sx={{ color: "text.secondary", maxWidth: 600 }}>
                    {exercise.exercise.description}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        )}

        {/* Overlay з інфо (поверх медіа) - не блокує взаємодію */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            right: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
            flexWrap: "wrap",
            pointerEvents: "none", // Дозволяє кліки проходити крізь overlay
          }}
        >
          <Card
            variant="soft"
            sx={{
              backdropFilter: "blur(10px)",
              bgcolor: "rgba(255,255,255,0.9)",
              pointerEvents: "auto", // Але сама картка кліками
            }}
          >
            <Typography level="title-lg" fontWeight="bold">
              {exercise.exercise.title}
            </Typography>
          </Card>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            sx={{ pointerEvents: "auto" }} // Чіпси також кліками
          >
            <Chip size="lg" color="primary" variant="solid">
              Сет {currentSetIndex + 1}/{exercise.sets || 0}
            </Chip>
            {exercise.reps > 0 && (
              <Chip size="lg" color="primary" variant="soft">
                💪 {exercise.reps}
              </Chip>
            )}
            {exercise.duration > 0 && !isPreparing && (
              <Chip size="lg" color="success" variant="soft">
                ⏱️ {setTimer}s
              </Chip>
            )}
          </Stack>
        </Box>
      </Box>

      {/* Компактна нижня панель з контролами */}
      <Stack spacing={1.5}>
        {/* Прогрес */}
        <LinearProgress
          determinate
          value={progress}
          size="lg"
          sx={{
            "--LinearProgress-thickness": "10px",
            "--LinearProgress-radius": "8px",
          }}
        />

        {/* Кнопки */}
        <Stack direction="row" spacing={2}>
          <Button
            onClick={onCompleteSet}
            color="success"
            size="lg"
            disabled={isCompletingState || isPreparing || !isRunning || isResting}
            sx={{
              flex: 1,
              py: 2,
              fontSize: "1.2rem",
              fontWeight: 700,
              position: "relative",
            }}
          >
            ✅ Завершити сет
            <Typography
              level="body-xs"
              sx={{
                position: "absolute",
                bottom: 4,
                right: 8,
                opacity: 0.7,
                fontSize: "0.65rem",
              }}
            >
              [SPACE]
            </Typography>
          </Button>
          <Button onClick={onSkipExercise} variant="outlined" color="neutral" size="lg" sx={{ minWidth: 120, py: 2 }}>
            ⏭️ Далі
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
