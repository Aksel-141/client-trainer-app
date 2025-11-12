import axios from "axios";
import { useEffect, useState } from "react";
import navRoutes from "../../router";
import { Box, Card, CardContent, AspectRatio, Typography, IconButton, Chip, Stack, Divider } from "@mui/joy";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { Link } from "react-router";

type Exercise = {
  id: number;
  title: string;
  description: string;
  images: string[];
  muscles: string[];
};

export default function ExerciseListPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  async function getData() {
    try {
      const data = await axios.get(`${navRoutes.exerciseList.path}`);
      console.log(data.data.result);

      setExercises(data.data.result);
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
    <Box sx={{ width: "100%", height: "100%" }}>
      <Typography level="h2" sx={{ mb: 3 }}>
        Список вправ
      </Typography>

      {exercises.length > 0 ? (
        <Stack spacing={2}>
          {exercises.map((e, index) => (
            <Card
              key={index}
              variant="outlined"
              sx={{
                overflow: "hidden",
                transition: "all 0.2s",
                "&:hover": {
                  boxShadow: "md",
                  borderColor: "primary.200",
                },
              }}
            >
              <Box sx={{ display: "flex", gap: 2 }}>
                {/* Зображення вправи */}
                <AspectRatio ratio="1" sx={{ width: 200, minWidth: 200 }}>
                  <img
                    src={`http://localhost:6189${e.images[0]}`}
                    alt={e.title}
                    loading="lazy"
                    style={{ objectFit: "cover" }}
                  />
                </AspectRatio>

                {/* Контент */}
                <CardContent sx={{ flex: 1, p: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", height: "100%" }}>
                    {/* Інформація про вправу */}
                    <Stack spacing={1.5} sx={{ flex: 1 }}>
                      <Link to={`/exercise/${e?.id}`} style={{ textDecoration: "none" }}>
                        <Typography
                          level="h4"
                          sx={{
                            color: "primary.plainColor",
                            "&:hover": {
                              color: "primary.solidBg",
                            },
                          }}
                        >
                          {e?.title}
                        </Typography>
                      </Link>

                      {e?.description && (
                        <Typography
                          level="body-md"
                          sx={{
                            color: "text.secondary",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {e?.description}
                        </Typography>
                      )}

                      <Box>
                        <Typography level="body-sm" sx={{ mb: 1, fontWeight: 600 }}>
                          М'язи які задіяні:
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                          {e?.muscles.map((m: string, idx: number) => (
                            <Chip key={idx} variant="soft" color="primary" size="sm">
                              {m}
                            </Chip>
                          ))}
                        </Box>
                      </Box>
                    </Stack>

                    {/* Кнопки дій */}
                    <Stack spacing={1} sx={{ ml: 2 }}>
                      <IconButton variant="soft" color="neutral" component={Link} to={`/exercise/${e?.id}`} size="lg">
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        variant="soft"
                        color="danger"
                        onClick={() => {
                          if (window.confirm(`Ви впевнені, що хочете видалити вправу "${e?.title}"?`)) {
                            deleteExercise(e?.id);
                          }
                        }}
                        size="lg"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </Box>
                </CardContent>
              </Box>

              <Divider />
            </Card>
          ))}
        </Stack>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography level="h3" sx={{ color: "text.secondary" }}>
            Тут поки пусто
          </Typography>
          <Typography level="body-md" sx={{ color: "text.tertiary" }}>
            Додайте свою першу вправу, щоб почати тренування
          </Typography>
        </Box>
      )}
    </Box>
  );
}
