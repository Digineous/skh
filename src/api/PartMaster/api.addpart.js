import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiAddPart = async (data) => {
  //console.log(data);
  const url = baseUrl + "/part/addPart";
  try {
    const token = localStorage.getItem("token");

    const datas = await axios.post(
      url,
      {
        plantNo: data.plantNo,
        partNo: data.partNo,
        lineNo: data.lineNo,
        machineNo: data.machineNo,
        partName: data.partName,
        cycleTime: data.cycleTime.toString(),
        multipleFactor: 0,
        ctReduction: 0,
        lowerBound: 0,
        upperBound: 0,
        plantProduction: data.plantProduction,
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
