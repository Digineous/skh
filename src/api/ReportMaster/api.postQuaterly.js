import axios from "axios";
import { baseUrl } from "../baseUrl";

export const postQuaterly = async ({
    deviceNo,
    year,
    quarter,
}) => {
    const url = baseUrl + "/common/oeeQuarterYear";
    try {
        const token = localStorage.getItem("token");

        const data = await axios.post(
            url,
            {
                deviceNo: deviceNo,
                year: year,
                quarter: quarter,

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
