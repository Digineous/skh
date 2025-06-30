import client from "../../client";

export const roundMasterApi = {
    getRound: async () => {
        const url = '/cvCandidate/getRounds';
        try {
            const response = await client.get(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    postRound: async (data) => {
        const url = '/common/cvInterviews';
        try {
            const response = await client.post(url, data)
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    editRound: async (data) => {
        const url = '/cvCandidate/updateRound';
        try {
            const response = await client.put(url, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteRound: async (id) => {
        try {
            const response = await client.delete(`/cvCandidate/removeRound/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    addRound: async (data) => {
        try {
            const response = await client.post('/cvCandidate/addRound', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getFunction: async () => {
        const url = '/cvCandidate/getFunctions';
        try {
            const response = await client.get(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getPlant: async () => {
        const url = 'common/plantByUser';
        try {
            const response = await client.get(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
}