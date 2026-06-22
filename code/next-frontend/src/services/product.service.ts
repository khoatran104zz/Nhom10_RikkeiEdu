import api from '../lib/axios';
import { Product } from '../types';

export const productService = {
  getAll: (params?: Record<string, unknown>): Promise<{ data: Product[]; totalPages?: number; total?: number }> => api.get('/products', { params }),
  getById: (id: number): Promise<Product> => api.get(`/products/${id}`),
  create: (data: Record<string, unknown>): Promise<Product> => api.post('/products', data),
  update: (id: number, data: Record<string, unknown>): Promise<Product> => api.put(`/products/${id}`, data),
  delete: (id: number): Promise<void> => api.delete(`/products/${id}`),
};
