import axios from "axios";

export default function getExerciseById(id: number) {
  return axios.get(`/exercise/${id}`);
}
