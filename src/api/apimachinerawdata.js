


import axios from "axios";
import { baseUrl } from "./baseUrl";

export const apigetmachinerawdata = async ({ plantNo, lineNo, machineNo, }) => {
  const url = baseUrl + "/common/mahindraRawData";
  try {
    const token = localStorage.getItem("token");
    
    const data = await axios.post(
      url,
      {
        plantNo,
        lineNo,
        machineNo
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
