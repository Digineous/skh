


import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiAddAvailabilityLoss = async ({ reportId, machineId, dateTime, aLoss,aLossReason }) => {
    const url = baseUrl + '/hourly/addAvailabilityLoss';

  try {
    const token = localStorage.getItem("token");
    
    const data = await axios.post(
      url,
      { 
        "reportId":reportId,
        "machineId":machineId,
        "dateTime":dateTime,
        "aLoss":aLoss,
        "aLossReason":aLossReason

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
    console.error("Error during adding availability loss  data:", error);
    throw error;
  }
};
