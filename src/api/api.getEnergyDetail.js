import axios from "axios";
import { baseUrl } from "./baseUrl";

export const apiGetEnergyDetail = async () => {
  const url = baseUrl + "/common/energyDetail";
  try {
    const token=localStorage.getItem("token")
   
    const data = await axios.get(url, {headers:{
        Authorization:`Bearer ${token}`
    }});
    console.log("energy detail:",data)
    return data;
  } catch (error) {
    console.error("Error during getting energy detail:", error);
    throw error;
}
};