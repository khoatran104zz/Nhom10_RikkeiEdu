import api from '../lib/axios';
import { Order } from '../types';

export const orderService = {
  getAll: (params?: Record<string, unknown>): Promise<{ data: Order[]; totalPages?: number; total?: number }> => api.get('/orders', { params }),
  getById: (id: number): Promise<Order> => api.get(`/orders/${id}`),
  create: (data: Record<string, unknown>): Promise<Order> => api.post('/orders', data),
  updateStatus: (id: number, status: string): Promise<Order> => api.put(`/orders/${id}`, { status }),
};
