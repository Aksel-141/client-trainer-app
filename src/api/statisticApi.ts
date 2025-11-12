import axios from "axios";

export function addStatistics(data: any) {
  return axios.post("/statistics", data);
}

export function getStatisticsAll() {
  return axios.get("/statistics/all");
}

export function getStatisticsSummary() {
  return axios.get("/statistics/summary");
}
