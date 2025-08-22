import { Grid } from "@mui/material";
import { Outlet } from "react-router";

export default function RootLayout() {
  return (
    <Grid container spacing={2}>
      {/* <SideBar /> */}
      <Grid size={1}>Тут буде сайдбар</Grid>
      <Grid size="grow">
        <Outlet />
      </Grid>
    </Grid>
  );
}
