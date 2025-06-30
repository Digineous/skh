import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiDeleteQualityRejection= async (id) => {
    const url = baseUrl + `/quality/removeQuality/${id}`;
    try {
      const token=localStorage.getItem("token")
      const data = await axios.delete(url, {headers:{
          Authorization:`Bearer ${token}`
      }});
      return data;
    } catch (error) {
      console.error("Error during delete plant:", error);
      throw error;
    }
  };