


import axios from "axios";
import { baseUrl } from "./baseUrl";

export const apigetRawData = async ({ lineNo, machineId, fromDate, toDate }) => {
  const url = baseUrl + "/common/getCycleTimeData";
  try {
    const token = localStorage.getItem("token");
    
    const data = await axios.post(
      url,
      {
        "lineNo":lineNo,
        "machineId":machineId,
        "fromDate":fromDate,
        "toDate":toDate
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
