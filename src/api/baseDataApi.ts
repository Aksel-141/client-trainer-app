import axios from "axios";

export function getMuscleByGroup() {
  return axios.get("/baseData/muscleByGroup");
}
