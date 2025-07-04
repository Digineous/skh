import axios from "axios";
import { baseUrl } from "./baseUrl";

export const apiGetCBMDetail = async (id) => {
  const url = `${baseUrl}/common/cbmDetail/${id}`;
  try {
    const token=localStorage.getItem("token")
   
    const data = await axios.get(url, {headers:{
        Authorization:`Bearer ${token}`
    }});
    //console.log("cbm detail:",data)
    return data;
  } catch (error) {
    console.error("Error during getting cbm detail:", error);
    throw error;
}
};