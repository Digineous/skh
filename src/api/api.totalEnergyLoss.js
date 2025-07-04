import axios from "axios";
import { baseUrl } from "./baseUrl";

export const apiGetTotalThresHold = async (startDate, endDate) => {
  const url = `${baseUrl}/common/totalEnergyLoss`;
  try {
    const token = localStorage.getItem("token");
    const body = {
      startDate: startDate,
      endDate: endDate,
     
    };
    //console.log(body)
    const data = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
