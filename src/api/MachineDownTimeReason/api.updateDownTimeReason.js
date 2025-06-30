import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiUpdateDownTimeReason = async (updatedDownTime) => {
    const url = baseUrl + `/stoppage/updateStoppage/${updatedDownTime.id}`;
    try {
        const token = localStorage.getItem("token")

        const data = await axios.put(url,
            {
                "reason": updatedDownTime.reason,
                "id": updatedDownTime.id,
            }
            , {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        return data;
    } catch (error) {
        console.error("Error during updating downtime reason:", error);
        throw error;
    }
};