import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter } from "react-router";
import RootLayout from "./RootLayout";
import { RouterProvider } from "react-router/dom";

import axios from "axios";
//Роутер
import navRoutes from "./router";
//Сторінки
import CreateExercisePage from "./pages/exercise/CreateExercisePage";
import ExerciseListPage from "./pages/exercise/ExerciseListPage";
import CreateRoutinePage from "./pages/routine/CreateRoutinePage";

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
      {
        path: navRoutes.exerciseList.path,
        element: <ExerciseListPage />,
      },
      {
        path: navRoutes.createRoutine.path,
        element: <CreateRoutinePage />,
      },
    ],
  },
]);

axios.defaults.baseURL = "http://localhost:6189/api";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
