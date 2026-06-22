import { RoleType } from './roles';

export interface MenuItem {
  title: string;
  path?: string;
  icon: string;
  roles: RoleType[];
  children?: { title: string; path: string }[];
}

export const menuConfig: MenuItem[] = [
  {
    title: 'Tổng quan',
    path: '/',
    icon: 'LayoutDashboard',
    roles: ['ADMIN'],
  },
  {
    title: 'Tổng quan Chi nhánh',
    path: '/branch-dashboard',
    icon: 'LayoutDashboard',
    roles: ['BRANCH_MANAGER'],
  },
  {
    title: 'Sản phẩm',
    icon: 'Package',
    roles: ['ADMIN', 'BRANCH_MANAGER', 'INVENTORY_STAFF'],
    children: [
      { title: 'Danh sách sản phẩm', path: '/products' },
      { title: 'Danh mục sản phẩm', path: '/categories' },
      { title: 'Thương hiệu', path: '/brands' },
    ],
  },
  {
    title: 'Kho hàng',
    icon: 'Warehouse',
    roles: ['ADMIN', 'BRANCH_MANAGER', 'INVENTORY_STAFF'],
    children: [
      { title: 'Tồn kho', path: '/stock' },
      { title: 'Nhập kho', path: '/stock/import' },
      { title: 'Xuất kho', path: '/stock/export' },
    ],
  },
  {
    title: 'Khách hàng',
    path: '/customers',
    icon: 'Users',
    roles: ['ADMIN', 'BRANCH_MANAGER'],
  },
  {
    title: 'Nhà cung cấp',
    path: '/suppliers',
    icon: 'Building2',
    roles: ['ADMIN', 'BRANCH_MANAGER'],
  },
  {
    title: 'Đơn bán hàng',
    path: '/orders',
    icon: 'ShoppingCart',
    roles: ['ADMIN', 'BRANCH_MANAGER', 'CASHIER'],
  },
  {
    title: 'POS Bán hàng',
    path: '/pos',
    icon: 'Monitor',
    roles: ['ADMIN', 'CASHIER'],
  },
  {
    title: 'Nhân viên',
    path: '/employees',
    icon: 'UserCog',
    roles: ['ADMIN', 'BRANCH_MANAGER'],
  },
  {
    title: 'Báo cáo',
    path: '/reports',
    icon: 'BarChart3',
    roles: ['ADMIN', 'BRANCH_MANAGER'],
  },
  {
    title: 'Thuế & Kế toán',
    path: '/tax',
    icon: 'Percent',
    roles: ['ADMIN', 'ACCOUNTANT'],
  },
  {
    title: 'Hồ sơ của tôi',
    path: '/customer',
    icon: 'User',
    roles: ['CUSTOMER'],
  },
];
