import { Box, Grid, Typography } from "@mui/material";
import { NavLink, Outlet } from "react-router";
import navRoutes from "./router/index";
import { ToastContainer } from "react-toastify";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

const navItems = [
  { path: "/", label: "Головна", icon: "🏠" },
  {
    path: navRoutes.createExercise.path,
    label: navRoutes.createExercise.title,
    icon: "⚡",
  },
  {
    path: navRoutes.exerciseList.path,
    label: navRoutes.exerciseList.title,
    icon: "📜",
  },
  {
    path: navRoutes.createRoutine.path,
    label: navRoutes.createRoutine.title,
    icon: "⚔️",
  },
  {
    path: navRoutes.routineList.path,
    label: navRoutes.routineList.title,
    icon: "🧾",
  },
];

export default function RootLayout() {
  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* <SideBar /> */}
      <Grid size={2}>
        <Box sx={{ display: "grid", boxSizing: "border-box", p: "15px" }}>
          {navItems.map(({ path, label, icon }) => (
            <NavLink
              key={path}
              to={path}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 14px",
                borderRadius: "8px",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#60a5fa" : "#e5e7eb",
                backgroundColor: isActive
                  ? "rgba(96,165,250,0.2)"
                  : "transparent",
                textDecoration: "none",
                transition: "all 0.2s ease-in-out",
                boxShadow: isActive ? "0 0 8px rgba(96,165,250,0.5)" : "none",
              })}
            >
              <Typography variant="body1">{icon}</Typography>
              <Typography variant="body1">{label}</Typography>
            </NavLink>
          ))}
        </Box>
      </Grid>
      <Grid
        container
        size="grow"
        sx={{
          padding: "15px",
        }}
      >
        <Box
          sx={{
            // padding: "5px",
            height: "100%",
            width: "100%",
            overflow: "hidden",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            borderRadius: "15px",
            boxSizing: "border-box",
          }}
        >
          <Outlet />
        </Box>
      </Grid>
      <ToastContainer />
    </Grid>
  );
}
