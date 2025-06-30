import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiAddFrdc = async (data) => {
    const url = baseUrl + "/frdc/addFrdc";
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.post(url, { 
        plantNo: data.plantNo,
        lineNo: data.lineNo,
        machineNo: data.machineNo,
        changeOverTime: data.changeOverTime,
        modeFrequency: data.modeFrequency,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data; // Assuming you want to return the data property from the response
    } catch (error) {
      console.error("Error during adding FRDC:", error);
      throw error;
    }
};
