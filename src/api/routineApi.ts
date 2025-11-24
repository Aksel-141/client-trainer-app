import axios from "axios";
type RoutineExerciseInput = {
  exerciseId: number;
  reps?: number;
  sets?: number;
  duration?: number;
  rest?: number;
};
export function getRoutineAll() {
  return axios.get("/routine");
}
export function getRoutine(id: number) {
  return axios.get(`/routine/${id}`);
}
export function deleteRoutine(id: number) {
  return axios.delete(`/routine/${id}`);
}
export function createRoutine(
  title: string,
  description: string,
  categoryId: number | null,
  routineExercises: RoutineExerciseInput[]
) {
  return axios.post(`/routine/create`, {
    title,
    description,
    categoryId,
    routineExercises,
  });
}
