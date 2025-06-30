import client from "../../client";

export const functionMasterApi = {
    getFunction: async () => {
        const url = '/cvCandidate/getFunctions';
        try {
            const response = await client.get(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    editFunction: async (data) => {
        const url = '/cvCandidate/updateFunction';
        try {
            const response = await client.put(url, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteFunction: async (id) => {
        try {
            const response = await client.delete(`/cvCandidate/removeFunction/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    addFunction: async (data) => {
        try {
            const response = await client.post('/cvCandidate/addFunction', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
}
