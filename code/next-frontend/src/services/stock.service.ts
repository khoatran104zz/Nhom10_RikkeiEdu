import api from '../lib/axios';
import { StockTransaction, Product } from '../types';

export const stockService = {
  getAll: (): Promise<Product[]> => api.get('/stock'),
  getHistory: (type?: string): Promise<StockTransaction[]> => api.get('/stock/history', { params: { type } }),
  import: (data: Record<string, unknown>): Promise<{ newStock: number }> => api.post('/stock/import', data),
  export: (data: Record<string, unknown>): Promise<{ newStock: number }> => api.post('/stock/export', data),
};
