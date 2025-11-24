import { Box, FormControl, FormLabel, Input, Textarea } from "@mui/joy";

interface RoutineFormProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export default function RoutineForm({ title, description, onTitleChange, onDescriptionChange }: RoutineFormProps) {
  return (
    <Box>
      <FormControl sx={{ mb: 2 }}>
        <FormLabel>Назва рутини</FormLabel>
        <Input
          placeholder="Введіть назву рутини"
          size="lg"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Опис (необов'язково)</FormLabel>
        <Textarea
          placeholder="Введіть опис рутини"
          minRows={3}
          size="lg"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </FormControl>
    </Box>
  );
}
