import { Stack, Typography, IconButton } from "@mui/joy";

interface WorkoutTimerProps {
  seconds: number;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
}

export default function WorkoutTimer({ seconds, isRunning, onStart, onPause }: WorkoutTimerProps) {
  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Typography level="h4">{formatTime(seconds)}</Typography>
      <IconButton
        variant="soft"
        color={isRunning ? "warning" : "success"}
        onClick={isRunning ? onPause : onStart}
        size="lg"
      >
        {isRunning ? "⏸" : "▶"}
      </IconButton>
    </Stack>
  );
}
