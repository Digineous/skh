import axios from "axios";
import { baseUrl } from "../baseUrl";
export const apiQualityRejection = async (qRejectionData) => {
  //console.log("add machine data:",qRejectionData)
  const url = baseUrl + "/quality/addQuality";
  try {
    //console.log("qr data:",qRejectionData)
    const token = localStorage.getItem("token");
    const data = await axios.post(
      url,  
      {
        machineNo: qRejectionData.machineNo,
        plantNo: qRejectionData.plantNo,
        lineNo: qRejectionData.lineNo,
        reason: "rejected",
        rejectionNo: qRejectionData.rejectionNo,
        processDate: qRejectionData.date,
        shiftId:qRejectionData.shiftNo,
        partNo:"part1",
        sct:0
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
