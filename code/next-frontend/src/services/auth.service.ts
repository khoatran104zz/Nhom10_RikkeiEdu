import api from '../lib/axios';
import { AuthResponse } from '../types';

export const authService = {
  login: (data: Record<string, unknown>): Promise<AuthResponse> => api.post('/auth/login', data),
};
