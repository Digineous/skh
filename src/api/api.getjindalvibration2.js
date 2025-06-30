import axios from "axios";
import { baseUrl } from "./baseUrl";

export const apiGetElectricalMeasurements = async () => {
  const url = baseUrl + "/common/electricalMeasurements";
  try {
    const token=localStorage.getItem("token")
   
    const data = await axios.get(url, {headers:{
        Authorization:`Bearer ${token}`
    }});
    console.log("Electrical measurements data (sensor 2):",data)
    return data;
  } catch (error) {
    console.error("Error during getting em data (sensor 2):", error);
    throw error;
}
};