import client from "../../client";

export const sourceMasterApi = {
    getSource: async () => {
        const url = '/cvCandidate/getSources';
        try {
            const response = await client.get(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    editSource: async (data) => {
        const url = '/cvCandidate/updateSource';
        try {
            const response = await client.put(url, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteSource: async (id) => {
        try {
            const response = await client.delete(`/cvCandidate/removeSource/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    addSource: async (data) => {
        try {
            const response = await client.post('/cvCandidate/addSource', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
}