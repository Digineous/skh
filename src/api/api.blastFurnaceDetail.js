import axios from "axios";
import { baseUrl } from "./baseUrl";

export const apiGetBlastFurnaceDetail = async () => {
  const url = baseUrl + "/common/blastFurnaceDetail/18";
  try {
    const token=localStorage.getItem("token")
   
    const data = await axios.get(url, {headers:{
        Authorization:`Bearer ${token}`
    }});
    //console.log("blast furnace detail:",data)
    return data;
  } catch (error) {
    console.error("Error during getting blast furnace detail:", error);
    throw error;
}
};