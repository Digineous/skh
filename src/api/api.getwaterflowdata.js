import axios from "axios";
import { baseUrl } from "./baseUrl";

export const apiGetWaterFlowData = async () => {
  const url = baseUrl + "/common/getWaterFlowData/5/24";
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
