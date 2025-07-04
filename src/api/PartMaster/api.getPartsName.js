import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiGetPartsName = async (data) => {
  //console.log(data);
  const url = baseUrl + "/common/partsByMachineAndPartId";
  try {
    const token = localStorage.getItem("token");

    const datas = await axios.post(
      url,
      {
        machineId: data.mid,
        partId: data.partId,
       
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return datas;
  } catch (error) {
    console.error("Error during getting parts name:", error);
    throw error;
  }
};
