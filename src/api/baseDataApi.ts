import axios from "axios";

export function getMuscleByGroup() {
  return axios.get("/baseData/muscleByGroup");
}

export function getAllMuscles() {
  return axios.get("/baseData/muscles");
}
