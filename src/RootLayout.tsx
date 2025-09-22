import { Box, Grid } from "@mui/material";
import { NavLink, Outlet } from "react-router";
import navRoutes from "./router/index";
import { ToastContainer } from "react-toastify";

export default function RootLayout() {
  return (
    <Grid container spacing={2}>
      {/* <SideBar /> */}
      <Grid size={1}>
        <Box sx={{ display: "grid" }}>
          <NavLink to="/" className="text-white">
            Головна
          </NavLink>

          <NavLink to={navRoutes.createExercise.path} className="text-white">
            {navRoutes.createExercise.title}
          </NavLink>
          <NavLink to={navRoutes.exerciseList.path} className="text-white">
            {navRoutes.exerciseList.title}
          </NavLink>
          <NavLink to={navRoutes.createRoutine.path} className="text-white">
            {navRoutes.createRoutine.title}
          </NavLink>
        </Box>
      </Grid>
      <Grid size="grow">
        <Outlet />
      </Grid>
      <ToastContainer />
    </Grid>
  );
}
