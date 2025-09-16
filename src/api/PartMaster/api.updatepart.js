import axios from "axios";
import { baseUrl } from "../baseUrl";
export const apiUpdatePart = async (part) => {
 //console.log(part,"check part id");
  const url = baseUrl + `/part/updatePart/${part.partId}`;
  try {
    const token = localStorage.getItem("token");
    const data = await axios.put(
      url,
      {
        partId: part.partId,
        partNo: part.partNo,
        plantNo: part.plantNo,
        lineNo: part.lineNo,
        machineNo: part.machineNo,
        partName: part.partName,
        cycleTime: part.cycleTime,
        multipleFactor: 1,
        ctReduction: 1,
        lowerBound: 1,
        upperBound: 1,
        plantProduction: part.plantProduction,
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