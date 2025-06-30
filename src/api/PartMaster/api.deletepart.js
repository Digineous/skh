import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiDeletePart = async (mid) => {
  
    const url = baseUrl + `/part/removePart/${mid}`;
    try {
      const token=localStorage.getItem("token")
      const data = await axios.delete(url, {headers:{
          Authorization:`Bearer ${token}`
      }});
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error during delete plant:", error);
      throw error;
    }
  };