import api from '../lib/axios';
import { Category } from '../types';

export const categoryService = {
  getAll: (search?: string): Promise<Category[]> => api.get('/categories', { params: { search } }),
  create: (data: Record<string, unknown>): Promise<Category> => api.post('/categories', data),
  update: (id: number, data: Record<string, unknown>): Promise<Category> => api.put(`/categories/${id}`, data),
  delete: (id: number): Promise<void> => api.delete(`/categories/${id}`),
};
