import axios from "axios";
import { baseUrl } from "./baseUrl";

export const apiGetThresholdParameters = async (plantId, lineId, machineId,deviceNo) => {
  const url = `${baseUrl}/threshold/thresholdParameters`;
  try {
    const token = localStorage.getItem("token");
    const body = {
      plantNo: plantId,
      lineNo: lineId,
      machineNo: machineId,
      deviceNo:deviceNo
    };
    console.log(body)
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
