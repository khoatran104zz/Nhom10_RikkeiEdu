export const ROLES = {
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
  ADMIN: 'ADMIN',
  BRANCH_MANAGER: 'BRANCH_MANAGER',
  CASHIER: 'CASHIER',
  INVENTORY_STAFF: 'INVENTORY_STAFF',
  ACCOUNTANT: 'ACCOUNTANT',
  CUSTOMER: 'CUSTOMER',
} as const;

export type RoleType = typeof ROLES[keyof typeof ROLES];

export const ROLE_LABELS: Record<RoleType, string> = {
  [ROLES.SYSTEM_ADMIN]: 'Quản trị viên hệ thống',
  [ROLES.ADMIN]: 'Chủ doanh nghiệp / Admin',
  [ROLES.BRANCH_MANAGER]: 'Quản lý chi nhánh',
  [ROLES.CASHIER]: 'Nhân viên bán hàng / Thu ngân',
  [ROLES.INVENTORY_STAFF]: 'Nhân viên kho',
  [ROLES.ACCOUNTANT]: 'Kế toán',
  [ROLES.CUSTOMER]: 'Khách hàng',
};

export const ROLE_DESCRIPTIONS: Record<RoleType, string> = {
  [ROLES.SYSTEM_ADMIN]: 'Quản trị toàn hệ thống và danh sách shop.',
  [ROLES.ADMIN]: 'Chủ doanh nghiệp, có toàn quyền quản lý hệ thống.',
  [ROLES.BRANCH_MANAGER]: 'Quản lý một chi nhánh.',
  [ROLES.CASHIER]: 'Nhân viên bán hàng, thu ngân.',
  [ROLES.INVENTORY_STAFF]: 'Nhân viên quản lý kho.',
  [ROLES.ACCOUNTANT]: 'Kế toán quản lý thu chi, công nợ.',
  [ROLES.CUSTOMER]: 'Khách hàng thân thiết.',
};
