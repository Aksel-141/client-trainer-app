import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router";
import { deleteRoutine, getRoutineAll } from "../../api/routineApi";
import { toast } from "react-toastify";

export default function RoutineListPage() {
  const [routines, setroutines] = useState<[]>([]);

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
    <div>
      <div>
        {routines.map((routine) => (
          <Box
            key={routine.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              margin: "5px",
              border: "solid 2px",
            }}
          >
            <Box sx={{ widows: "100%" }}>
              <h2>{routine.title}</h2>
              {routine.description && <p>{routine.description}</p>}
              <ul>
                {routine.exercises
                  .sort((a, b) => a.order - b.order) // щоб порядок був правильний
                  .map((re) => (
                    <li key={re.id} style={{ marginBottom: "1rem" }}>
                      <strong>{re.exercise.title}</strong> -{" "}
                      {re.reps ? `${re.reps} reps` : ""}
                      {re.sets ? ` x ${re.sets} sets` : ""}
                      {re.duration ? ` | ${re.duration}s` : ""}
                      {re.rest ? ` | rest ${re.rest}s` : ""}
                      <br />
                      <em>
                        М’язи:{" "}
                        {re.exercise.muscles
                          .map((m) => m.muscle.name)
                          .join(", ")}
                      </em>
                    </li>
                  ))}
              </ul>
            </Box>
            <Box>
              <Button
                onClick={() => {
                  navigate(`/routine/${routine.id}/start`);
                }}
              >
                Start
              </Button>
              <Button onClick={() => delRoutine(routine.id)}>Видалити</Button>
            </Box>
          </Box>
        ))}
      </div>
    </div>
  );
}
