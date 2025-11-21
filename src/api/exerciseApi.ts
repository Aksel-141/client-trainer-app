import axios from "axios";

export function getExerciseById(id: number) {
  return axios.get(`/exercise/${id}`);
}

export function updateExerciseById(id: number, formData: FormData) {
  return axios.patch(`/exercise/${id}`, formData);
}

export function deleteExerciseImage(exerciseId: number, imageId: number) {
  return axios.delete(`/exercise/${exerciseId}/image/${imageId}`);
}
