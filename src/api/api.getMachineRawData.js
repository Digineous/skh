import axios from "axios";
import { baseUrl } from "../api/baseUrl";

export const apiGetRawData = async ({
  machineNo,
  fromDate,
  endDate
  
}) => {
  const url = baseUrl + "/common/rawDataByMachine";
  try {
    const token = localStorage.getItem("token");
    // //console.log("req body in ui api   ", machineNo," fd  ",      fromDate,"  td  ",      endDate);      
    machineNo = ""+machineNo;
    const data = await axios.post(
      url,
      {
        machineId: machineNo,
        startDate: fromDate,
        endDate: endDate
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
