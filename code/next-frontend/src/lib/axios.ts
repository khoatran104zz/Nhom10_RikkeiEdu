import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (!err.response) {
      return Promise.reject(new Error('Không kết nối được backend. Vui lòng kiểm tra server.'));
    }
    const msg = err.response?.data?.message || 'Có lỗi xảy ra';
    return Promise.reject(new Error(msg));
  }
);

export default api;
