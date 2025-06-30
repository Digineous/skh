import axios from "axios";
import { baseUrl } from "./baseUrl";

export const apiGetEnergyData = async (locationId, dataType, deviceNo) => {
  const url = `${baseUrl}/common/postEnergyDetails`;
  try {
    const token = localStorage.getItem("token");
    console.log("loc id,datatype :",locationId,dataType)
    const body = {
      locationId: locationId,
      intervalCode: dataType,
      deviceNo: deviceNo,
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
