import axios from "axios";
import { baseUrl } from "./baseUrl";

export const apiGetLocation = async () => {
  const url = baseUrl + "/location/getLocations";
  try {
    const token = localStorage.getItem("token");

    const data = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
