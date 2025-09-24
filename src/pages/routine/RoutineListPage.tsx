import axios from "axios";
import { useEffect, useState } from "react";
import navRoutes from "../../router";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router";
interface Muscle {
  id: number;
  muscle: { id: number; name: string };
}

interface Exercise {
  id: number;
  title: string;
  description: string;
  images: string;
  video: string | null;
  muscles: Muscle[];
}

interface RoutineExercise {
  id: number;
  order: number;
  reps?: number | null;
  sets?: number | null;
  duration?: number | null;
  rest?: number | null;
  exercise: Exercise;
}

interface Routine {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  exercises: RoutineExercise[];
}

interface RoutinesResponse {
  ok: boolean;
  data: Routine[];
}

export default function RoutineListPage() {
  const [routines, setroutines] = useState<[]>([]);

  async function getData() {
    try {
      const data = await axios.get(`${navRoutes.routineList.path}`);
      console.log(data);

      setroutines(data.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData();
  }, []);
  let navigate = useNavigate();
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
            </Box>
          </Box>
        ))}
      </div>
    </div>
  );
}
