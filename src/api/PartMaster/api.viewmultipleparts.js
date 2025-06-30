


import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiViewMultipleParts = async ({ lineNo, machineNo, partName }) => {
  const url = baseUrl + "/common/multipleParts";
  try {
    const token = localStorage.getItem("token");
    
    const data = await axios.post(
      url,
      {
        "lineNo":lineNo,
        "machineNo":machineNo,
        "partName":partName
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
