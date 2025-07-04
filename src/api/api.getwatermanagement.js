import axios from "axios";
import { baseUrl } from "./baseUrl";

export const apiGetWaterManagement =async (locationId, dataType, deviceNo) => {
  const url = baseUrl + "/common/postWaterFlowDetails";
  try {
    const token = localStorage.getItem("token");
    //console.log("loc id,datatype :",locationId,dataType)
    const body = {
      locationId: locationId,
      intervalCode: 'shift',
      deviceNo: 9,
    };
    //console.log(body)
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
