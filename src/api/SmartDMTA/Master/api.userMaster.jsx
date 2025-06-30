import client from "../../client";

export const userMasterApi = {
    getUser: async () => {
        const url = '/user/getUsers';
        try {
            const response = await client.get(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    addUser: async (data) => {
        const url = '/user/addUser';
        try {
            const response = await client.post(url, data)
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    changePassword: async (data) => {
        const url = '/user/changePassword';
        try {
            const response = await client.post(url, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    resetPassword: async (data) => {
        const url = '/user/resetPassword';
        try {
            const response = await client.post(url, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    addUserPermission: async (data) => {
        const url = '/userPermission/addPlantPermissions';
        try{
            const response = await client.post(url, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getRole: async(data) => {
        const url = '/role/getRoles';
        try {
            const response = await client.get(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
