import api from '../lib/axios';
import { Customer } from '../types';

export const customerService = {
  getAll: (search?: string): Promise<Customer[]> => api.get('/customers', { params: { search } }),
  create: (data: Record<string, unknown>): Promise<Customer> => api.post('/customers', data),
  update: (id: number, data: Record<string, unknown>): Promise<Customer> => api.put(`/customers/${id}`, data),
  delete: (id: number): Promise<void> => api.delete(`/customers/${id}`),
};
