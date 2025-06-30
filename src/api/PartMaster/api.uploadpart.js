import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiUploadPart = async (body) => {
  const url = baseUrl + "/part/uploadPartFile";
  try {
    const token = localStorage.getItem("token");

    const datas = await axios.post(
      url, body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return datas;
  } catch (error) {
    console.error("Error during adding part:", error);
    throw error;
  }
};
