import axios from "axios";
import { baseUrl } from "./baseUrl";

export const apiGetCBMRawData =async (deviceNo, startDate, endDate) => {
    const url = `${baseUrl}/common/cbmReport`;
    try {
      const token = localStorage.getItem("token");
  
      const body = {
        deviceNo: deviceNo,
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