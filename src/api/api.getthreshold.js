import axios from "axios";
import { baseUrl } from "./baseUrl";

export const apiGetThreshold = async () => {
  const url = baseUrl + "/threshold/thresholdDetail/1";
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