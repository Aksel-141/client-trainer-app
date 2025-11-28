import { Card, Typography, List, ListItem, ListItemContent, Chip, Stack, Box, Divider } from "@mui/joy";

interface CompletedSet {
  exerciseId: number;
  title: string;
  setNumber: number;
  reps?: number | null;
  duration?: number | null;
  at: string;
}

interface CompletedSetsListProps {
  completed: CompletedSet[];
}

export default function CompletedSetsList({ completed }: CompletedSetsListProps) {
  // Групуємо по вправах
  const groupedByExercise = completed.reduce((acc, set) => {
    const key = set.exerciseId;
    if (!acc[key]) {
      acc[key] = {
        title: set.title,
        sets: [],
      };
    }
    acc[key].sets.push(set);
    return acc;
  }, {} as Record<number, { title: string; sets: CompletedSet[] }>);

  const exercises = Object.values(groupedByExercise);

  return (
    <Box sx={{ height: "100%" }}>
      <Typography level="h4" sx={{ mb: 2 }}>
        📝 Історія виконаних сетів
      </Typography>

      {completed.length === 0 ? (
        <Card variant="soft" sx={{ p: 4, textAlign: "center" }}>
          <Typography level="h3" sx={{ mb: 1, opacity: 0.5 }}>
            🏃‍♂️
          </Typography>
          <Typography level="body-md" sx={{ color: "text.tertiary" }}>
            Поки що нічого не виконано.
            <br />
            Починайте тренування!
          </Typography>
        </Card>
      ) : (
        <Stack spacing={2}>
          {/* Статистика */}
          <Card variant="soft" color="primary" sx={{ p: 2 }}>
            <Stack direction="row" spacing={3} justifyContent="center" flexWrap="wrap">
              <Box sx={{ textAlign: "center" }}>
                <Typography level="h2" fontWeight={900}>
                  {completed.length}
                </Typography>
                <Typography level="body-sm">Всього сетів</Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography level="h2" fontWeight={900}>
                  {exercises.length}
                </Typography>
                <Typography level="body-sm">Вправ</Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography level="h2" fontWeight={900}>
                  {completed.reduce((sum, s) => sum + (s.reps || 0), 0)}
                </Typography>
                <Typography level="body-sm">Повторів</Typography>
              </Box>
            </Stack>
          </Card>

          {/* Групований список */}
          {exercises.map((exercise, idx) => (
            <Card key={idx} variant="outlined">
              <Typography level="title-lg" sx={{ mb: 1.5, fontWeight: 700 }}>
                💪 {exercise.title}
              </Typography>
              <Divider sx={{ mb: 1.5 }} />
              <List size="sm" sx={{ "--List-gap": "8px" }}>
                {exercise.sets.map((set, i) => (
                  <ListItem
                    key={i}
                    sx={{
                      bgcolor: "success.softBg",
                      borderRadius: "sm",
                      p: 1.5,
                      border: "1px solid",
                      borderColor: "success.outlinedBorder",
                    }}
                  >
                    <ListItemContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography level="body-md" fontWeight="lg">
                            ✅ Сет {set.setNumber}
                          </Typography>
                          <Typography level="body-xs" sx={{ color: "text.secondary" }}>
                            {new Date(set.at).toLocaleTimeString("uk-UA", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Typography>
                        </Box>
                        <Chip size="lg" color="success" variant="solid">
                          {set.reps ? `${set.reps} повторів` : set.duration ? `${set.duration}s` : "—"}
                        </Chip>
                      </Stack>
                    </ListItemContent>
                  </ListItem>
                ))}
              </List>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
