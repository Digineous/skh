import axios from "axios";
import { baseUrl } from "../baseUrl";

export const getDefectivePartReason = async () => {
    const url = baseUrl + "/stoppage/getStoppages/Defect";
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
