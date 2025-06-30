import axios from "axios";
import { baseUrl } from "./baseUrl";

export const apiAddDownTime = async (data) => {
  console.log("Data", data);
  const url = baseUrl + "/downtime/addDownTime";
  try {
    const token = localStorage.getItem("token");

    const datas = await axios.post(
      url,
      {
        plantNo: data.plantNo,
        lineNo: Number(data.lineNo),
        machineNo: data.machineNo,
        shiftId: '1',
        machineDownDate: data.startDownDate,
        totalDownTime: data.totalDownTime,
        reason: data.reason,
        startTime: data.startDownDate,
        endTime: data.endDownDate,
        reason: data.reason,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return datas;
  } catch (error) {
    console.error("Error during adding part:", error);
    throw error;
  }
};
