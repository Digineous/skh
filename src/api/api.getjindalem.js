import axios from "axios";
import { baseUrl } from "./baseUrl";

export const apiGetElectricalMeasurements = async (sensor) => {
  const endpoint = sensor === "sensor1" ? "5" : "6";
  const url = `${baseUrl}/common/energyMeasurements/${endpoint}`;
 
  try {
    const token=localStorage.getItem("token")
   
    const data = await axios.get(url, {headers:{
        Authorization:`Bearer ${token}`
    }});
    //console.log("Electrical measurements data :",data)
    return data;
  } catch (error) {
    console.error("Error during getting em data :", error);
    throw error;
}
};