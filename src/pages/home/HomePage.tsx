import { Box, Grid, Typography } from "@mui/material";
import WorkoutCalendar from "./components/WorkoutCalendar";

export default function HomePage() {
  return (
    <Grid container sx={{ width: "100%", height: "100%" }}>
      <Grid size={{ md: 9 }} sx={{ width: "100%", height: "100%" }}>
        1
      </Grid>
      <Grid
        size={{ md: 3 }}
        sx={{
          boxSizing: "border-box",
          p: "20px",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: "10px",
          }}
        >
          <Typography fontWeight="bold">Мій розклад</Typography>
        </Box>
        <Box>
          <WorkoutCalendar workouts={[]} />
        </Box>
      </Grid>
    </Grid>
  );
}
