import { Box, Typography, Sheet } from "@mui/joy";
import { NavLink, Outlet } from "react-router";
import navRoutes from "./router/index";
import { ToastContainer } from "react-toastify";

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
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Sheet
        variant="soft"
        sx={{
          width: 240,
          p: 2,
          borderRight: "1px solid",
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        {navItems.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            to={path}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 16px",
              borderRadius: "8px",
              fontWeight: isActive ? 600 : 400,
              color: isActive ? "var(--joy-palette-primary-500)" : "var(--joy-palette-text-primary)",
              backgroundColor: isActive ? "rgba(96,165,250,0.2)" : "transparent",
              textDecoration: "none",
              transition: "all 0.2s ease-in-out",
              boxShadow: isActive ? "0 0 0 2px var(--joy-palette-primary-200)" : "none",
            })}
          >
            <Typography level="body-md">{icon}</Typography>
            <Typography level="body-md">{label}</Typography>
          </NavLink>
        ))}
      </Sheet>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          p: 3,
          overflow: "hidden",
          backgroundColor: "background.body",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Sheet
          variant="outlined"
          sx={{
            p: 3,
            flex: 1,
            border: "none",
            // borderRadius: "lg",
            // backgroundColor: "background.surface",
            backgroundColor: "transparent",
            overflow: "auto",
          }}
        >
          <Outlet />
        </Sheet>
      </Box>
      <ToastContainer />
    </Box>
  );
}
