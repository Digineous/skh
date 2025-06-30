


import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiViewALoss = async ({  dateTime, machineNo }) => {
  const url = baseUrl + "/hourly/hourlyUnknownLoss";

  try {
    const token = localStorage.getItem("token");

    const data = await axios.post(
      url,
      {
      
        dateTime: dateTime,
        machineNo: machineNo,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("API response data:", data.data);
    return data.data;
  } catch (error) {
    console.error("Error during getting a loss report data:", error);
    throw error;
  }
};
