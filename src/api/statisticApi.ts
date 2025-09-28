import axios from "axios";

export function addStatistics(data: any) {
  return axios.post("/statistics", data);
}
