import axios from "axios";
import { baseUrl } from "./baseUrl";

export const apiGetOpe2= async (lineId,machineId) => {
  const url = `${baseUrl}/common/getOpeM2Data/${lineId}/${machineId}`;
  
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