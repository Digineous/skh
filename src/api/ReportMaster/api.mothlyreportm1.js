import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiMonthlyReportsM1 = async ({
  lineNo,
  machineId,
  startMonth, endMonth
}) => {
  const url = baseUrl + "/common/monthWiseData";
  try {
    const token = localStorage.getItem("token");

    const data = await axios.post(
      url,
      {
        lineNo: lineNo,
        machineNo: machineId,
        startMonth:startMonth,
        endMonth:endMonth
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
