import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter } from "react-router";
import RootLayout from "./RootLayout";
import { RouterProvider } from "react-router/dom";
import navRoutes from "./router";
import CreateExercisePage from "./pages/exercise/CreateExercisePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <>Main home page</>,
      },
      {
        path: navRoutes.createExercise.path,
        element: <CreateExercisePage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
