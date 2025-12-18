import axios from "axios";

export function getExerciseList() {
  return axios.get(`/exercise/all`);
}

export function getExerciseById(id: number) {
  return axios.get(`/exercise/${id}`);
}

export function updateExerciseById(id: number, formData: FormData) {
  return axios.patch(`/exercise/${id}`, formData);
}

export function deleteExerciseImage(exerciseId: number, imageId: number) {
  return axios.delete(`/exercise/${exerciseId}/image/${imageId}`);
}

export function exportExercises() {
  return axios.get("/exercise/export");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function importExercises(exercises: any[]) {
  return axios.post("/exercise/import", { exercises });
}
