import axios from "axios";
import { baseUrl } from "./baseUrl";

export const apiUpdateMachineInput = async (body) => {
//   //console.log(updatedDtimeData);
  const url = baseUrl + `/partproduction/updatePartProductionAndCycleTime/`;

  try {
    const token = localStorage.getItem("token");
    // //console.log("payload:",updatedMachineInput);
    const datas = await axios.put(
      url, body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return datas;
  } catch (error) {
    console.error("Error during adding machine downtime:", error);
    throw error;
  }
};
