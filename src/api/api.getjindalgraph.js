import axios from "axios";
import { baseUrl } from "./baseUrl";

export const apiGetJindalGraph = async (sensorNumber) => {
  const url = `${baseUrl}/common/vibrationDetail/${sensorNumber}`;

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

    //console.log(`Jindal vibration sensor ${sensorNumber}`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error getting Jindal vibration sensor ${sensorNumber}:`, error.message);
    throw error;
  }
};
