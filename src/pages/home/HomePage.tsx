import { Box, Card, Grid, Typography } from "@mui/joy";
import WorkoutCalendar from "./components/WorkoutCalendar";
import MuscleVisualizer from "./../../../components/MuscleVisualizer/index";

export default function HomePage() {
  return (
    <Grid container sx={{ width: "100%", height: "100%" }}>
      <Grid md={9} sx={{ width: "100%", height: "100%" }}>
        <Grid container spacing={3}>
          {/* Статистика всього тренувань за тиждень*/}
          <Grid xs={12} md={3}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <span>Всього тренувань на цьому тижні</span>
              <span>15 тренувань</span>
            </Card>
          </Grid>

          {/* Блок з м'язами які були задіяні протягм тижня */}
          <MuscleVisualizer muscleList={[]} />
        </Grid>
      </Grid>
      <Grid
        md={3}
        sx={{
          boxSizing: "border-box",
          p: "20px",
          width: "100%",
          height: "100%",
          // backgroundColor: "rgba(255, 255, 255, 0.15)",
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
