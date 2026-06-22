import api from '../lib/axios';
import { Brand } from '../types';

export const brandService = {
  getAll: (search?: string): Promise<Brand[]> => api.get('/brands', { params: { search } }),
  create: (data: Record<string, unknown>): Promise<Brand> => api.post('/brands', data),
  update: (id: number, data: Record<string, unknown>): Promise<Brand> => api.put(`/brands/${id}`, data),
  delete: (id: number): Promise<void> => api.delete(`/brands/${id}`),
};
