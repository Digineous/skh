import axios from "axios";
import { baseUrl } from "./baseUrl";
import dayjs from "dayjs";

export const apiUpdateQualityRejection = async (qRejectionData) => {
  const url = baseUrl + `/quality/updateQuality/${qRejectionData.id}`;
  try {
    const token = localStorage.getItem("token");

    // Convert processDate to YYYY-MM-DD if provided, otherwise null
    const processDate =
      qRejectionData.processDate && dayjs(qRejectionData.processDate).isValid()
        ? dayjs(qRejectionData.processDate).format("YYYY-MM-DD")
        : null;

    const body = {
      id: qRejectionData.id,
      machineNo: qRejectionData.machineNo ?? null,
      plantNo: qRejectionData.plantNo ?? null,
      lineNo: qRejectionData.lineNo ?? null,
      reason: qRejectionData.reason ?? "rejected",
      rejectionNo: qRejectionData.rejectionNo ?? "",
      processDate: processDate,
      shiftId: qRejectionData.shiftId ?? null,
      partNo: qRejectionData.partNo ?? "part1",
      sct: qRejectionData.sct ?? 0,
    };

    const data = await axios.put(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error) {
    console.error("Error during update quality rejection:", error);
    throw error;
  }
};
