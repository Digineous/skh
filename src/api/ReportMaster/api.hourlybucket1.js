


import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiHourlyBucket1 = async ({ lineNo, machineId, fromDate, shiftNo }) => {
  const url = baseUrl + "/common/getHourlyM1";
  try {
    const token = localStorage.getItem("token");

    const data = await axios.post(
      url,
      {
        "lineNo": lineNo,
        "machineNo": machineId,
        "date": fromDate,
        "shiftId": shiftNo
      },
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

export const apiHourlyBucketOEE = async (body) => {
  const url = baseUrl + "/common/oeeHourlyProcessData";
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
