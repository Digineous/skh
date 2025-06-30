import client from "../client";

export const resumeExtractorApi = {
    getResumeDetails: async (data) => {
        const url = "/common/uploadCVFile";
        try {
            const response = await client.post(url, data, {
                headers: {
                    "Content-Type": "multipart/form-data"
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
    },

    postRemarkStatus: async (data) => {
        const url = '/cvCandidate/updateRoundReamrks';
        try {
            const response = await client.post(url, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    cvCandidateData: async (data) => {
        try {
            const response = await client.post('common/cvCandidateData', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateCvCandidate: async (id, data) => {
        try {
            const response = await client.put(`/common/updateCvCandidate/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getPlantNo: async () => {
        try {
            const response = await client.get('/common/plantByUser');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getUserRole: async () => {
        try {
            const response = await client.get('/common/usersByRole');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deleteCvCandidate: async (id) => {
        try {
            const response = await client.delete(`/common/removeCvCandidate/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getSource: async () => {
        try {
            const response = await client.get('/common/cvSources');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getFunction: async () => {
        try {
            const response = await client.get('/common/cvFunctions');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    postInterview: async (data) => {
        try {
            const response = await client.post('/common/cvInterviews', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getStatuses: async () => {
        try {
            const response = await client.get('/common/cvStatuses');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    cvInterviewerData: async (body) => {
        try {
            const response = await client.post('/common/cvCandidateByInterviewer', body);
            return response.data
        } catch (error) {
            throw error;
        }
    }
}