import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiDeleteDownTimeReason = async (id) => {
    const url = baseUrl + `/stoppage/removeStoppage/${id}`;
    try {
        const token = localStorage.getItem("token")
        const data = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    } catch (error) {
        console.error("Error during delete downtime reason:", error);
        throw error;
    }
};