import axios from "axios";
import { baseUrl } from "../baseUrl";
export const apiUpdateFrdc = async (updatedFRDCData) => {
  const url = baseUrl + `/frdc/updateFrdc/${updatedFRDCData.frdcNo}`;
  try {
    const token = localStorage.getItem("token");
    const data = await axios.put(
      url,
      {
        frdcNo:updatedFRDCData.frdcNo,
        plantNo: updatedFRDCData.plantNo,
        lineNo: updatedFRDCData.lineNo,
        machineNo: updatedFRDCData.machineNo,
        changeOverTime: updatedFRDCData.changeOverTime,
        modeFrequency: updatedFRDCData.modeFrequency,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error during adding line:", error);
    throw error;
  }
};
