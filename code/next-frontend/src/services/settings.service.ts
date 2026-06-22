import api from '../lib/axios';
import { StoreSettings } from '../types';

export const settingsService = {
  get: (): Promise<StoreSettings> => api.get('/settings'),
  update: (data: StoreSettings): Promise<StoreSettings> => api.put('/settings', data),
};
