import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Box, Card, CardContent, AspectRatio, Typography, IconButton, Chip, Stack, Divider, Button } from "@mui/joy";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { toast } from "react-toastify";
import { Link } from "react-router";
import { exportExercises, getExerciseList, importExercises } from "../../../api/exerciseApi";

type Exercise = {
  id: number;
  title: string;
  description: string;
  images: string[];
  muscles: string[];
};

export default function ExerciseListPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function getData() {
    try {
      const data = await getExerciseList();
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

  async function handleExport() {
    try {
      const response = await exportExercises();
      const dataStr = JSON.stringify(response.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `exercises-export-${new Date().toISOString().split("T")[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`Експортовано ${response.data.count} вправ`);
    } catch (error) {
      console.error(error);
      toast.error("Помилка при експорті вправ");
    }
  }

  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileContent = await file.text();
      const data = JSON.parse(fileContent);

      if (!data.exercises || !Array.isArray(data.exercises)) {
        toast.error("Невірний формат файлу");
        return;
      }

      const response = await importExercises(data.exercises);

      if (response.data.ok) {
        const { success, skipped, errors } = response.data.results;
        toast.success(`Імпорт завершено: ${success} успішно, ${skipped} пропущено, ${errors} помилок`);

        // Показати деталі якщо є пропущені або помилки
        if (skipped > 0 || errors > 0) {
          console.log("Деталі імпорту:", response.data.results.details);
        }

        getData(); // Оновити список
      }
    } catch (error) {
      console.error(error);
      toast.error("Помилка при імпорті вправ");
    } finally {
      // Очистити input для можливості повторного імпорту того ж файлу
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography level="h3">Всі вправи ({exercises.length})</Typography>

        <Stack direction="row" spacing={1}>
          <Button
            startDecorator={<FileDownloadIcon />}
            onClick={handleExport}
            variant="outlined"
            color="primary"
            disabled={exercises.length === 0}
          >
            Експорт
          </Button>
          <Button
            startDecorator={<FileUploadIcon />}
            onClick={() => fileInputRef.current?.click()}
            variant="outlined"
            color="primary"
          >
            Імпорт
          </Button>
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} style={{ display: "none" }} />
        </Stack>
      </Stack>

      {exercises.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(450px, 1fr))",
            gap: 2,
            overflow: "auto",
            pr: 1,
          }}
        >
          {exercises.map((e, index) => (
            <Card
              key={index}
              variant="outlined"
              sx={{
                p: 2,
                transition: "all 0.2s",
                "&:hover": {
                  boxShadow: "sm",
                  borderColor: "primary.200",
                },
              }}
            >
              <Box sx={{ display: "flex", gap: 1.5 }}>
                {/* Зображення вправи */}
                {e.images && e.images.length > 0 ? (
                  <AspectRatio ratio="1" sx={{ width: 100, minWidth: 100 }}>
                    <img
                      src={`http://localhost:6189${e.images[0]}`}
                      alt={e.title}
                      loading="lazy"
                      style={{ objectFit: "cover" }}
                    />
                  </AspectRatio>
                ) : (
                  <Box
                    sx={{
                      width: 100,
                      minWidth: 100,
                      aspectRatio: "1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "background.level1",
                      borderRadius: "sm",
                    }}
                  >
                    <Typography level="h4">📷</Typography>
                  </Box>
                )}

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
        </Box>
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
