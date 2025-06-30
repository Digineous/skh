import axios from "axios";
import { baseUrl } from "./baseUrl";

export const apiGetOpe1 = async (lineId,machineId) => {
  const url = `${baseUrl}/common/getOpeM1Data/${lineId}/${machineId}`;
  
  try {
    const token=localStorage.getItem("token")
   
    const data = await axios.get(url, {headers:{
        Authorization:`Bearer ${token}`
    }});
    return data;
  } catch (error) {
    console.error("Error during getting part:", error);
    throw error;
}
};