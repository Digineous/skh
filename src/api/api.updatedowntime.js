import axios from "axios";
import { baseUrl } from "./baseUrl";

export const apiUpdateDTime = async (updatedDtimeData) => {
  console.log(updatedDtimeData);
  const url = baseUrl + `/downtime/updateDownTime/${updatedDtimeData.id}`;

  try {
    const token = localStorage.getItem("token");

    const datas = await axios.put(
      url,
      {
        id:updatedDtimeData.id,
        plantNo: updatedDtimeData.plantNo,
        lineNo: updatedDtimeData.lineNo,
        machineNo: updatedDtimeData.machineNo,
        shiftId: '1',
        machineDownDate: updatedDtimeData.machineDownDate,
        totalDownTime: updatedDtimeData.totalDownTime,
        startTime: updatedDtimeData.startTime,
        endTime: updatedDtimeData.endTime,
        reason: updatedDtimeData.reason,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return datas;
  } catch (error) {
    console.error("Error during adding machine downtime:", error);
    throw error;
  }
};
