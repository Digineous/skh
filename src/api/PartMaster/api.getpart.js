import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiGetPart = async () => {
  const url = baseUrl + "/part/getParts";
  try {
    const token=localStorage.getItem("token");
    //console.log("Get Part Token:", token);
    const data = await axios.get(url, {headers:{
        Authorization:`Bearer ${token}`
    }});
    return data;
  } catch (error) {
    console.error("Error during getting part:", error);
    throw error;
}
};