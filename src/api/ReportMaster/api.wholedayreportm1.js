import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiWholeDayReportM1 = async ({
  lineNo,
  machineNo,
  fromDate
  
}) => {
  const url = baseUrl + "/common/wholeDayData";
  try {
    const token = localStorage.getItem("token");

    const data = await axios.post(
      url,
      {
        lineNo: lineNo,
        machineNo: machineNo,
        date:fromDate
       
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
