import axios from "axios";
import { useEffect, useState } from "react";
import navRoutes from "../../router";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

type Exercise = {
  id: number;
  title: string;
  description: string;
  images: string[];
};

export default function ExerciseListPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  async function getData() {
    try {
      const data = await axios.get(`${navRoutes.exerciseList.path}`);
      console.log(data);

      setExercises(data.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteExercise(id: number) {
    try {
      await axios.delete(`/exercise/${id}`);
      getData();
      toast.success("Успішно видалено");
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      {exercises.length > 0 ? (
        exercises.map((e) => (
          <Card>
            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
              <CardMedia
                component="img"
                sx={{ width: 151, height: 151 }}
                image={`http://localhost:6189${e.images[0]}`}
                alt="image"
              />
              <CardContent
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography gutterBottom variant="h5">
                    {e?.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {e?.description}
                  </Typography>
                </Box>
                <Box sx={{ display: "grid" }}>
                  <Button>
                    <EditIcon />
                  </Button>
                  <Button onClick={() => deleteExercise(e?.id)}>
                    <DeleteIcon />
                  </Button>
                </Box>
              </CardContent>
            </Box>
          </Card>
        ))
      ) : (
        <Typography>Тут поки пусто</Typography>
      )}
    </div>
  );
}
