import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiAddDownTimeReason = async (data) => {
    console.log("Data", data);
    const url = baseUrl + "/stoppage/addStoppage";
    try {
        const token = localStorage.getItem("token");

        const datas = await axios.post(
            url,
            {
                reason: data.reason,
                master: data.master
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return datas;
    } catch (error) {
        console.error("Error during adding reason:", error);
        throw error;
    }
};
