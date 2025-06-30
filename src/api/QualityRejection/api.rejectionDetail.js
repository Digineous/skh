


import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiRejectionDetail = async ({ lineNo, machineNo, date, shiftNo }) => {
  const url = baseUrl + "/hourly/rejectionDetail";
  try {
    const token = localStorage.getItem("token");
    
    const data = await axios.post(
      url,
      {
        "lineNo":lineNo,
        "machineNo":machineNo,
        "date":date,
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
