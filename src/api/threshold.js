
import client from './client';

export const thresholdApi = {
  getThresholds: async () => {
    return await client.get('/threshold/thresholdDetail');
  },
  addThreshold: async (thresholdData) => {
    return await client.post('/threshold/addThreshold', thresholdData);
  },
  updateThreshold: async (id, thresholdData) => {
    return await client.put(`/threshold/updateThreshold/${id}`, thresholdData);
  },
  deleteThreshold: async (id) => {
    return await client.delete(`/threshold/removeThreshold/${id}`);
  }
};