import api from '../lib/axios';
import { DashboardData } from '../types';

export const dashboardService = {
  get: (): Promise<DashboardData> => api.get('/dashboard'),
};
