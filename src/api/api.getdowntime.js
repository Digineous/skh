import axios from "axios";
import { baseUrl } from "./baseUrl";

export const apiGetDownTime = async () => {
  const url = baseUrl + "/downtime/getDownTimes";
  try {
    const token = localStorage.getItem("token");

    const data = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};