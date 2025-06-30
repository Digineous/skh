import client from "../client";

export const eBillInsightApi = {
    getEBill: async (data) => {
        try {
            for (let pair of data.entries()) {
                console.log(pair[0] + ': ', pair[1]);
            }

            const response = await client.post('/ebill', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response;
        } catch (error) {
            console.error('Detailed API Error:', {
                status: error.response?.status,
                data: error.response?.data,
                headers: error.response?.headers
            });
            throw error;
        }
    }
};