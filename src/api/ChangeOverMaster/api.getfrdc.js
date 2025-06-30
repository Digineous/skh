import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiGetFRDC = async () => {
  const url = baseUrl + "/frdc/getFrdcs";
  try {
    const token=localStorage.getItem("token")
   
    const data = await axios.get(url, {headers:{
        Authorization:`Bearer ${token}`
    }});
    console.log("frdcs",data)
    return data;
  } catch (error) {
    console.error("Error during adding line:", error);
    throw error;
}
};