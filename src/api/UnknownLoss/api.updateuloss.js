


import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiUpdateULoss = async ({ id, machineId, dateTime, filledULoss,reason }) => {
    const url = baseUrl + `/hourly/updateUnKnownLoss/${id}`;

  try {
    const token = localStorage.getItem("token");
    
    const data = await axios.put(
      url,
      { 
        "id":id,
        "machineId":machineId,
        "dateTime":dateTime,
        "filledULoss":filledULoss,
        "reason":reason

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
    console.error("Error during updating unknown loss  data:", error);
    throw error;
  }
};
