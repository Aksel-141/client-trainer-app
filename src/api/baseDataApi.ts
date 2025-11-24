import axios from "axios";

export function getMuscleByGroup() {
  return axios.get("/baseData/muscleByGroup");
}

export function getRoutineCategories() {
  return axios.get("/baseData/routineCategories");
}

export function getAllMuscles() {
  return axios.get("/baseData/muscles");
}
