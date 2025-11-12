import { useEffect, useState } from "react";
import { Box, Button, Card, Typography, Stack, List, ListItem, ListItemContent } from "@mui/joy";
import { useNavigate } from "react-router";
import { deleteRoutine, getRoutineAll } from "../../api/routineApi";
import { toast } from "react-toastify";

export default function RoutineListPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [routines, setroutines] = useState<any[]>([]);

  async function getData() {
    try {
      const data = await getRoutineAll();
      console.log(data);

      setroutines(data.data.data);
    } catch (error) {
      console.log(error);
    }
  }
  async function delRoutine(id: number) {
    try {
      await deleteRoutine(id);
      getData();
      toast.success("Успішно видалено");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData();
  }, []);
  const navigate = useNavigate();
  return (
    <Box>
      <Typography level="h2" sx={{ mb: 3 }}>
        Список рутин
      </Typography>
      <Stack spacing={2}>
        {routines.map((routine) => (
          <Card key={routine.id} variant="outlined" sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box sx={{ flex: 1 }}>
                <Typography level="h3" sx={{ mb: 1 }}>
                  {routine.title}
                </Typography>
                {routine.description && (
                  <Typography level="body-md" sx={{ mb: 2, color: "text.secondary" }}>
                    {routine.description}
                  </Typography>
                )}
                <List size="sm">
                  {/* eslint-disable @typescript-eslint/no-explicit-any */}
                  {routine?.exercises
                    .sort((a: any, b: any) => a.order - b.order)
                    .map((re: any) => (
                      <ListItem key={re.id}>
                        <ListItemContent>
                          <Typography level="body-md" fontWeight="lg">
                            {re.exercise.title}
                          </Typography>
                          <Typography level="body-sm">
                            {re.reps ? `${re.reps} reps` : ""}
                            {re.sets ? ` x ${re.sets} sets` : ""}
                            {re.duration ? ` | ${re.duration}s` : ""}
                            {re.rest ? ` | rest ${re.rest}s` : ""}
                          </Typography>
                          <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
                            М'язи: {re.exercise.muscles.map((m: any) => m.muscle.name).join(", ")}
                          </Typography>
                        </ListItemContent>
                      </ListItem>
                    ))}
                  {/* eslint-enable @typescript-eslint/no-explicit-any */}
                </List>
              </Box>
              <Stack spacing={1} sx={{ ml: 2 }}>
                <Button
                  color="primary"
                  size="lg"
                  onClick={() => {
                    navigate(`/routine/${routine.id}/start`);
                  }}
                >
                  Почати
                </Button>
                <Button color="danger" variant="soft" size="sm" onClick={() => delRoutine(routine.id)}>
                  Видалити
                </Button>
              </Stack>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
