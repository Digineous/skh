import client from "../../client";

export const statusMasterApi = {
    getStatus: async () => {
        const url = '/cvCandidate/getStatuses';
        try {
            const response = await client.get(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    editStatus: async (data) => {
        const url = '/cvCandidate/updateStatus';
        try {
            const response = await client.put(url, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteStatus: async (id) => {
        try {
            const response = await client.delete(`/cvCandidate/removeStatus/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    addStatus: async (data) => {
        try {
            const response = await client.post('/cvCandidate/addStatus', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
}