


import axios from "axios";
import { baseUrl } from "./baseUrl";

export const apiHourlyBucket2 = async ({ lineNo, machineId, fromDate, shiftNo }) => {
  const url = baseUrl + "/common/getHourlyM2";
  try {
    const token = localStorage.getItem("token");
    
    const data = await axios.post(
      url,
      {
        "lineNo":lineNo,
        "machineNo":machineId,
        "date":fromDate,
        "shiftId":shiftNo
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return data.data; 
  } catch (error) {
    console.error("Error during getting raw data:", error);
    throw error;
  }
};
