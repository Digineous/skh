import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiDailyReportM1 = async ({
  lineNo,
  machineId,
  fromDate,
  toDate,
}) => {
  const url = baseUrl + "/common/dayWiseData";
  try {
    const token = localStorage.getItem("token");

    const data = await axios.post(
      url,
      {
        lineNo: lineNo,
        machineNo: machineId,
        fromDate: fromDate,
        toDate: toDate,
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
