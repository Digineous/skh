import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiDeleteFrdc = async (fid) => {
    const url = baseUrl + `/frdc/removeFrdc/${fid}`;
    try {
      const token=localStorage.getItem("token")
      const data = await axios.delete(url, {headers:{
          Authorization:`Bearer ${token}`
      }});
      return data;
    } catch (error) {
      console.error("Error during delete plant:", error);
      throw error;
    }
  };