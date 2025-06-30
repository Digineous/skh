import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiUpdateQualityRejection = async (qRejectionData) => {
    const url = baseUrl + `/quality/updateQuality/${qRejectionData.id}`;
    try {
      const token=localStorage.getItem("token")
      console.log(" plantName, segment,location,state,country")
      const data = await axios.put(url, {
        id:qRejectionData.id,
        machineNo: qRejectionData.machineNo,
        plantNo: qRejectionData.plantNo,
        lineNo: qRejectionData.lineNo,
        reason: "rejected",
        rejectionNo: qRejectionData.rejectionNo,
        processDate: qRejectionData.date,
        shiftId:qRejectionData.shiftNo,
        partNo:"part1",
        sct:0
      },{headers:{
          Authorization:`Bearer ${token}`
      }});
      return data;
    } catch (error) {
      console.error("Error during adding plant:", error);
      throw error;
    }
  };