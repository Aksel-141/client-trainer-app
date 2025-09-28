import axios from "axios";

export function getRoutineAll() {
  return axios.get("/routine");
}
export function getRoutine(id: number) {
  return axios.get(`/routine/${id}`);
}
