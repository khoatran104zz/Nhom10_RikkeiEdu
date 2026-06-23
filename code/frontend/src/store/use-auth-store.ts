import { create } from 'zustand';
import Cookies from 'js-cookie';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (payload: { token: string; user: User }) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,

  login: ({ token, user }) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      if (user.shopId !== undefined && user.shopId !== null) {
        localStorage.setItem('shopId', String(user.shopId));
      } else {
        localStorage.removeItem('shopId');
      }
      if (user.branchId !== undefined && user.branchId !== null) {
        localStorage.setItem('branchId', String(user.branchId));
      } else {
        localStorage.removeItem('branchId');
      }
    }

    Cookies.set('token', token, { expires: 7, path: '/' });
    Cookies.set('user_role', user.role, { expires: 7, path: '/' });
    if (user.shopId !== undefined && user.shopId !== null) {
      Cookies.set('shop_id', String(user.shopId), { expires: 7, path: '/' });
    }
    if (user.branchId !== undefined && user.branchId !== null) {
      Cookies.set('branch_id', String(user.branchId), { expires: 7, path: '/' });
    }

    set({ user, token, isAuthenticated: true, loading: false });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('shopId');
      localStorage.removeItem('branchId');
    }

    Cookies.remove('token', { path: '/' });
    Cookies.remove('user_role', { path: '/' });
    Cookies.remove('shop_id', { path: '/' });
    Cookies.remove('branch_id', { path: '/' });

    set({ user: null, token: null, isAuthenticated: false, loading: false });
  },

  initialize: () => {
    if (typeof window === 'undefined') return;

    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      const storedIsAuth = localStorage.getItem('isAuthenticated');

      if (storedToken && storedUser && storedIsAuth === 'true') {
        const parsedUser = JSON.parse(storedUser) as User;
        
        // Ensure cookies match localStorage state
        Cookies.set('token', storedToken, { expires: 7, path: '/' });
        Cookies.set('user_role', parsedUser.role, { expires: 7, path: '/' });
        if (parsedUser.shopId !== undefined && parsedUser.shopId !== null) {
          Cookies.set('shop_id', String(parsedUser.shopId), { expires: 7, path: '/' });
          localStorage.setItem('shopId', String(parsedUser.shopId));
        }
        if (parsedUser.branchId !== undefined && parsedUser.branchId !== null) {
          Cookies.set('branch_id', String(parsedUser.branchId), { expires: 7, path: '/' });
          localStorage.setItem('branchId', String(parsedUser.branchId));
        }

        set({ user: parsedUser, token: storedToken, isAuthenticated: true, loading: false });
      } else {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('shopId');
        localStorage.removeItem('branchId');
        Cookies.remove('token', { path: '/' });
        Cookies.remove('user_role', { path: '/' });
        Cookies.remove('shop_id', { path: '/' });
        Cookies.remove('branch_id', { path: '/' });
        set({ user: null, token: null, isAuthenticated: false, loading: false });
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage', e);
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('token');
      localStorage.removeItem('shopId');
      localStorage.removeItem('branchId');
      Cookies.remove('token', { path: '/' });
      Cookies.remove('user_role', { path: '/' });
      Cookies.remove('shop_id', { path: '/' });
      Cookies.remove('branch_id', { path: '/' });
      set({ user: null, token: null, isAuthenticated: false, loading: false });
    }
  },
}));
