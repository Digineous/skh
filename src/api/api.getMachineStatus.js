import axios from "axios";
import {baseUrl } from "./baseUrl";

export const apiMachineStatus = async ({ lineNo, fromDate,  }) => {
  const url = baseUrl + "/common/machineRunningStatus";
  try {
    const token = localStorage.getItem("token");

    const data = await axios.post(
      url,
      {
        lineNo: lineNo,
        enterDate: fromDate,
       
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data.data;
  } catch (error) {
    console.error("Error during getting machine running status data:", error);
    throw error;
  }
};
