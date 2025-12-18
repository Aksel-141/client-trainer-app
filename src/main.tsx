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
import CreateExercisePage from "./pages/exercise/create/CreateExercisePage";
import CreateRoutinePage from "./pages/routine/create/CreateRoutinePage";
import RoutineListPage from "./pages/routine/list/RoutineListPage";
import RoutineStartPage from "./pages/routine/workout-session/WorkoutSessionPage";
import HomePage from "./pages/home/HomePage";
import ViewOrEditSingleExercisePage from "./pages/exercise/ViewOrEditSingleExercisePage";
import ViewOrEditSingleRoutinePage from "./pages/routine/edit/ViewOrEditSingleRoutinePage";
import ExerciseListPage from "./pages/exercise/list/ExerciseListPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
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
        path: navRoutes.exerciseSingle.path,
        element: <ViewOrEditSingleExercisePage />,
      },
      {
        path: navRoutes.createRoutine.path,
        element: <CreateRoutinePage />,
      },
      {
        path: navRoutes.routineList.path,
        element: <RoutineListPage />,
      },
      {
        path: navRoutes.routineEdit.path,
        element: <ViewOrEditSingleRoutinePage />,
      },
    ],
  },
  // Workout session - повноекранний режим без sidebar
  {
    path: navRoutes.routineStart.path,
    element: <RoutineStartPage />,
  },
]);

axios.defaults.baseURL = "http://localhost:6189/api";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
