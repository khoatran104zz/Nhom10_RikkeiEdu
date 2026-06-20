// services/api.js - Axios API service layer
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Response interceptor for error handling
api.interceptors.response.use(
  res => res.data,
  err => {
    const msg = err.response?.data?.message || 'Có lỗi xảy ra';
    return Promise.reject(new Error(msg));
  }
);

// ── Categories ──────────────────────────────────────
export const categoriesApi = {
  getAll: (search) => api.get('/categories', { params: { search } }),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// ── Brands ──────────────────────────────────────────
export const brandsApi = {
  getAll: (search) => api.get('/brands', { params: { search } }),
  create: (data) => api.post('/brands', data),
  update: (id, data) => api.put(`/brands/${id}`, data),
  delete: (id) => api.delete(`/brands/${id}`),
};

// ── Products ─────────────────────────────────────────
export const productsApi = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// ── Customers ────────────────────────────────────────
export const customersApi = {
  getAll: (search) => api.get('/customers', { params: { search } }),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

// ── Suppliers ────────────────────────────────────────
export const suppliersApi = {
  getAll: (search) => api.get('/suppliers', { params: { search } }),
  create: (data) => api.post('/suppliers', data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  delete: (id) => api.delete(`/suppliers/${id}`),
};

// ── Employees ────────────────────────────────────────
export const employeesApi = {
  getAll: (search) => api.get('/employees', { params: { search } }),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
};

// ── Orders ───────────────────────────────────────────
export const ordersApi = {
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status) => api.put(`/orders/${id}`, { status }),
};

// ── Stock ────────────────────────────────────────────
export const stockApi = {
  getAll: () => api.get('/stock'),
  getHistory: (type) => api.get('/stock/history', { params: { type } }),
  import: (data) => api.post('/stock/import', data),
  export: (data) => api.post('/stock/export', data),
};

// ── Dashboard ────────────────────────────────────────
export const dashboardApi = {
  get: () => api.get('/dashboard'),
};

// ── Settings ─────────────────────────────────────────
export const settingsApi = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
};
