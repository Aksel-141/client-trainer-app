import { Box, TextField } from "@mui/material";

export default function CreateExercisePage() {
  return (
    <Box>
      <TextField id="exercise-name" label="Назва вправи" variant="outlined" />
    </Box>
  );
}
