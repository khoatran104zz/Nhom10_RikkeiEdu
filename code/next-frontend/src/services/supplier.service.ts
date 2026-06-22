import api from '../lib/axios';
import { Supplier } from '../types';

export const supplierService = {
  getAll: (search?: string): Promise<Supplier[]> => api.get('/suppliers', { params: { search } }),
  create: (data: Record<string, unknown>): Promise<Supplier> => api.post('/suppliers', data),
  update: (id: number, data: Record<string, unknown>): Promise<Supplier> => api.put(`/suppliers/${id}`, data),
  delete: (id: number): Promise<void> => api.delete(`/suppliers/${id}`),
};
