import axios from "axios";

export function addWorkout(data: any) {
  return axios.post("/workout", data);
}

export function getWorkoutAll() {
  return axios.get("/workout");
}

export function getWorkoutSummary() {
  return axios.get("/workout/summary");
}
