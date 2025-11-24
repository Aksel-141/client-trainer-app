import { Box, Typography, Sheet, Stack, Divider } from "@mui/joy";
import { NavLink, Outlet } from "react-router";
import navRoutes from "./router/index";
import { ToastContainer } from "react-toastify";

const navItems = [
  {
    group: "Головна",
    items: [{ path: "/", label: "Дашборд", icon: "📊" }],
  },
  {
    group: "Вправи",
    items: [
      {
        path: navRoutes.createExercise.path,
        label: "Створити",
        icon: "➕",
      },
      {
        path: navRoutes.exerciseList.path,
        label: "Всі вправи",
        icon: "📋",
      },
    ],
  },
  {
    group: "Програми",
    items: [
      {
        path: navRoutes.createRoutine.path,
        label: "Створити",
        icon: "🎯",
      },
      {
        path: navRoutes.routineList.path,
        label: "Всі програми",
        icon: "📚",
      },
    ],
  },
];

export default function RootLayout() {
  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden" }}>
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
          gap: 1,
          overflowY: "auto",
          flexShrink: 0,
        }}
      >
        {/* App Title */}
        <Box sx={{ mb: 2, px: 1 }}>
          <Typography level="h4" sx={{ fontWeight: 700, color: "primary.500" }}>
            💪 TrainApp
          </Typography>
          <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
            Менеджер тренувань
          </Typography>
        </Box>

        {/* Navigation Groups */}
        {navItems.map(({ group, items }, groupIdx) => (
          <Box key={group}>
            {groupIdx > 0 && <Divider sx={{ my: 1.5 }} />}
            <Typography
              level="body-xs"
              sx={{
                px: 1.5,
                mb: 0.5,
                fontWeight: 600,
                textTransform: "uppercase",
                color: "text.tertiary",
                fontSize: "0.7rem",
                letterSpacing: "0.5px",
              }}
            >
              {group}
            </Typography>
            <Stack spacing={0.5}>
              {items.map(({ path, label, icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  style={({ isActive }) => ({
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "var(--joy-palette-primary-plainColor)" : "var(--joy-palette-text-primary)",
                    backgroundColor: isActive ? "var(--joy-palette-primary-softBg)" : "transparent",
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                    fontSize: "0.875rem",
                  })}
                >
                  <Typography level="body-sm" sx={{ fontSize: "1.1rem" }}>
                    {icon}
                  </Typography>
                  <Typography level="body-sm">{label}</Typography>
                </NavLink>
              ))}
            </Stack>
          </Box>
        ))}
      </Sheet>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          backgroundColor: "background.level1",
        }}
      >
        {/* Content Area with Scroll */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            p: 3,
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "neutral.300",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "neutral.400",
              },
            },
          }}
        >
          <Outlet />
        </Box>
      </Box>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Box>
  );
}
