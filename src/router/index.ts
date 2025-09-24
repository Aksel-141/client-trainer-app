const navRoutes = {
  home: {
    title: "Home",
    path: "/",
  },
  createExercise: {
    title: "Створити вправу",
    path: "/exercise/create",
  },
  exerciseList: {
    title: "Список вправ",
    path: "/exercise/all",
  },
  createRoutine: {
    title: "Створити рутину",
    path: "/routine/create",
  },
  routineList: {
    title: "Список рутин",
    path: "/routine/all",
  },
  routineStart: {
    title: "Початок тренування",
    path: "/routine/:id/start",
  },
};
export default navRoutes;
