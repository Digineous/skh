


import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiQLossData = async ({ lineNo, machineId, shiftId }) => {
  const url = baseUrl + "/hourly/todayUnknownLossDetail";
  try {
    const token = localStorage.getItem("token");
    
    const data = await axios.post(
      url,
      {
        "lineNo":lineNo,
        "machineNo":machineId,
        "shiftId":shiftId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    //console.log("API response data:", data.data);
    return data.data; 
  } catch (error) {
    console.error("Error during getting raw data:", error);
    throw error;
  }
};
