import { async } from "regenerator-runtime";
import client from "./client";

export const standardDashboardApi = {
    getStandardOEE: async (oeeData) => {
        return await client.post('/common/oeeDashboard', oeeData)
    },
    getMachineChartStatus: async (machineChartData) => {
        return await client.post('/common/machineRunningStatus', machineChartData)
    },
    getStandardCBM: async (cbmData) => {
        return await client.post('/common/cbmDashboardDetail', cbmData)
    },
    getStandardEMS: async (emsData) => {
        return await client.post('/common/emsDashboard', emsData)
    },
    getStandardEMSEnergyLoss: async () => {
        return await client.get('/common/estimatedEnergyLoss')
    },
    getStandardEMSConsumptionPerDay: async () => {
        return await client.get('/common/getConsumptionPerDay/35')
    },
    getMonthlyEnergyData: async (id) => {
        return await client.get(`common/monthlyEnergyData/${id}`)
    },
    getOeeReport: async (data) => {
        return await client.post('/common/oeeProcessData', data);
    },
}