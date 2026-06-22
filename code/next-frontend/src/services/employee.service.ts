import api from '../lib/axios';
import { Employee } from '../types';

export const employeeService = {
  getAll: (search?: string): Promise<Employee[]> => api.get('/employees', { params: { search } }),
  create: (data: Record<string, unknown>): Promise<Employee> => api.post('/employees', data),
  update: (id: number, data: Record<string, unknown>): Promise<Employee> => api.put(`/employees/${id}`, data),
  delete: (id: number): Promise<void> => api.delete(`/employees/${id}`),
};
