import { Box, Button, Typography, LinearProgress, Stack, Card, AspectRatio } from "@mui/joy";

interface ExerciseCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exercise: any;
  currentSetIndex: number;
  progress: number;
  isPreparing: boolean;
  prepTimer: number;
  setTimer: number;
  isCompletingState: boolean;
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
  onCompleteSet,
  onSkipExercise,
}: ExerciseCardProps) {
  return (
    <Card variant="outlined" sx={{ p: 3 }}>
      <Typography level="h3" sx={{ mb: 1 }}>
        {exercise.exercise.title} (Сет {currentSetIndex + 1})
      </Typography>
      <LinearProgress determinate value={progress} sx={{ mb: 2 }} />
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
        <AspectRatio ratio="1" sx={{ width: 120 }}>
          <img
            src={
              exercise?.exercise?.images && typeof exercise.exercise.images === "string"
                ? `http://localhost:6189${JSON.parse(exercise.exercise.images)[0]}`
                : exercise?.exercise?.images?.[0]?.path
                ? `http://localhost:6189${exercise.exercise.images[0].path}`
                : "/placeholder-exercise.jpg"
            }
            alt="exercise"
            style={{ objectFit: "cover" }}
          />
        </AspectRatio>
        <Box>
          {isPreparing ? (
            <Typography level="h3" color="primary">
              Підготовка: {prepTimer} сек
            </Typography>
          ) : (
            <Stack spacing={1}>
              {exercise.reps !== null && exercise.reps !== undefined && (
                <Typography level="body-lg">Повторів: {exercise.reps}</Typography>
              )}
              {exercise.duration && <Typography level="body-lg">Час: {setTimer} сек</Typography>}
            </Stack>
          )}
        </Box>
      </Box>

      <Stack direction="row" spacing={1}>
        <Button onClick={onCompleteSet} color="primary" size="lg" disabled={isCompletingState || isPreparing}>
          Завершити сет
        </Button>
        <Button onClick={onSkipExercise} variant="outlined" size="lg">
          Пропустити вправу
        </Button>
      </Stack>
    </Card>
  );
}
