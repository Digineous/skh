import axios from "axios";
import { baseUrl } from "./baseUrl";

export const apiGetHydraulicData = async () => {
  const url = `${baseUrl}/common/vibrationDetail/${11}`;

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found in localStorage");
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    //console.log(`hydraulic vibration sensor ${11}`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error getting hydraulic vibration sensor ${11}:`, error.message);
    throw error;
  }
};
