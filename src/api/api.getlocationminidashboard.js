import axios from "axios";
import { baseUrl } from "./baseUrl";

export const apiGetLocationMiniDashboard = async (locationId) => {
  const url = `${baseUrl}/common/getLocationsMiniDashboard/${locationId}`;
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
