


import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiQLossHourly = async ({ lineNo, machineNo, shiftNo }) => {
  const url = baseUrl + "/hourly/todayRejectionDetail";
  try {
    const token = localStorage.getItem("token");
    
    const data = await axios.post(
      url,
      {
        "lineNo":lineNo,
        "machineNo":machineNo,
        "shiftId":shiftNo,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Hourly  report data:", data.data);
    return data.data; 
  } catch (error) {
    console.error("Error during getting hourly report:", error);
    throw error;
  }
};
