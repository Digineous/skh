


import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiQLossReport = async ({ lineNo, machineId, cdate, shiftId }) => {
  const url = baseUrl + "/hourly/availabilityLossDetail";
  try {
    const token = localStorage.getItem("token");
    
    const data = await axios.post(
      url,
      {
        "lineNo":lineNo,
        "machineNo":machineId,
        "date":cdate,
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
