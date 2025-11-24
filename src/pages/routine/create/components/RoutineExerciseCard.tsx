import { Box, Button, Card, FormControl, FormLabel, Input, Stack, Typography } from "@mui/joy";
import type { Exercise, RoutineExerciseInput } from "../../../../../types/index";

interface RoutineExerciseCardProps {
  exercise: Exercise; // дані вправи (title, description)
  params: RoutineExerciseInput; // параметри (reps, sets, duration, rest)
  index: number; // позиція в списку
  isFirst: boolean; // чи це перша вправа
  isLast: boolean; // чи це остання вправа
  onUpdate: (field: string, value: number) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

export default function RoutineExerciseCard({
  exercise,
  params,
  index,
  isFirst,
  isLast,
  onUpdate,
  onMoveUp,
  onMoveDown,
  onRemove,
}: RoutineExerciseCardProps) {
  return (
    <Card key={index} variant="outlined" sx={{ p: 2 }}>
      <Typography level="title-md" sx={{ mb: 1 }}>
        {exercise?.title}
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, mb: 2 }}>
        <FormControl size="sm">
          <FormLabel>Повторів</FormLabel>
          <Input type="number" value={params.reps || ""} onChange={(e) => onUpdate("reps", +e.target.value)} />
        </FormControl>
        <FormControl size="sm">
          <FormLabel>Тривалість (с)</FormLabel>
          <Input type="number" value={params.duration || ""} onChange={(e) => onUpdate("duration", +e.target.value)} />
        </FormControl>
        <FormControl size="sm">
          <FormLabel>Сетів</FormLabel>
          <Input type="number" value={params.sets || ""} onChange={(e) => onUpdate("sets", +e.target.value)} />
        </FormControl>
        <FormControl size="sm">
          <FormLabel>Відпочинок (с)</FormLabel>
          <Input type="number" value={params.rest || ""} onChange={(e) => onUpdate("rest", +e.target.value)} />
        </FormControl>
      </Box>
      <Stack direction="row" spacing={1}>
        <Button size="sm" variant="outlined" disabled={isFirst} onClick={onMoveUp}>
          ⬆ Вгору
        </Button>

        <Button size="sm" variant="outlined" disabled={isLast} onClick={onMoveDown}>
          ⬇ Вниз
        </Button>
        <Button size="sm" color="danger" variant="soft" onClick={onRemove}>
          Видалити
        </Button>
      </Stack>
    </Card>
  );
}
