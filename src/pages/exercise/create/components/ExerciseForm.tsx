import { Box, Button, Card, Checkbox, Input, Stack, Textarea, Typography } from "@mui/joy";
import type { MuscleByGroup } from "../../../../../types";

interface ExerciseFormProps {
  title: string;
  description: string;
  images: File[];
  video: File | null;
  muscles: string[];
  muscleByGroup: MuscleByGroup[];

  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onMusclesChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ExerciseForm({
  title,
  description,
  images,
  video,
  // muscles,
  muscleByGroup,
  onTitleChange,
  onDescriptionChange,
  onImageChange,
  onVideoChange,
  onMusclesChange,
}: ExerciseFormProps) {
  return (
    <>
      {/* Ліва колонка - основна форма */}
      <Stack spacing={2}>
        <Input placeholder="Назва вправи" value={title} onChange={(e) => onTitleChange(e.target.value)} size="md" />
        <Textarea
          placeholder="Опис (необов'язково)"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          minRows={3}
          size="sm"
        />

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" component="label" size="sm" fullWidth>
            📷 Фото
            <input hidden multiple type="file" accept="image/*" onChange={onImageChange} />
          </Button>
          <Button variant="outlined" component="label" size="sm" fullWidth>
            🎥 Відео
            <input hidden type="file" accept="video/*" onChange={onVideoChange} />
          </Button>
        </Stack>

        {images?.length > 0 && (
          <Box>
            <Typography level="body-sm" sx={{ mb: 1 }}>
              Зображення ({images.length}):
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {images.map((img, idx) => (
                <img key={idx} src={URL.createObjectURL(img)} alt="exercise" width={80} style={{ borderRadius: 4 }} />
              ))}
            </Box>
          </Box>
        )}

        {video && (
          <Box>
            <Typography level="body-sm" sx={{ mb: 1 }}>
              Відео:
            </Typography>
            <video src={URL.createObjectURL(video)} width="100%" height="180" controls style={{ borderRadius: 4 }} />
          </Box>
        )}
      </Stack>

      {/* Права колонка - м'язи */}
      <Box sx={{ overflow: "auto", pr: 1 }}>
        <Typography level="title-md" sx={{ mb: 1.5 }}>
          М'язи
        </Typography>
        <Stack spacing={2}>
          {muscleByGroup.map((item, index) => (
            <Card key={index} variant="outlined" sx={{ p: 1.5 }}>
              <Typography level="title-sm" sx={{ mb: 1 }}>
                {item.nameUa}
              </Typography>
              <Stack spacing={0.5}>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {item.muscles.map((muscle: any) => (
                  <Checkbox
                    key={muscle.id}
                    label={muscle.nameUa}
                    value={muscle.nameEn}
                    onChange={onMusclesChange}
                    size="sm"
                  />
                ))}
              </Stack>
            </Card>
          ))}
        </Stack>
      </Box>
    </>
  );
}
