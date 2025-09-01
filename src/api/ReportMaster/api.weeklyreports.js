import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiWeeklyReportsM1 = async (body) => {
  const url = baseUrl + "/common/oeeWeeklyData";
  try {
    const token = localStorage.getItem("token");

    const data = await axios.post(
      url, body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data.data;
  } catch (error) {
    console.error("Error during getting raw data:", error);
    throw error;
  }
};
