import axios from "axios";
import { baseUrl } from "./baseUrl";

export const apiGetCockPitView = async (formData) => {
  const url = `${baseUrl}/common/moduleDetail`;
  try {
    const token = localStorage.getItem("token");
    const body = {
      plantNo: formData.plantNo,
      lineNo: formData.lineNo,
      machineNo: formData.machineNo,
      deviceNo:formData.machineNo,
      module:formData.module
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
