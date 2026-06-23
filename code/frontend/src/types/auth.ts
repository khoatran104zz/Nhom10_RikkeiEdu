import { RoleType } from '../constants/roles';

export interface User {
  id: number | string;
  name: string;
  username: string;
  email: string;
  role: RoleType;
  shopId?: number | null;
  shopName?: string | null;
  branchId?: number | null;
  branchName?: string | null;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number | string;
    username: string;
    email: string;
    fullName?: string;
    roleName: RoleType;
    shopId?: number | null;
    shopName?: string | null;
    branchId?: number | null;
    branchName?: string | null;
  };
}
