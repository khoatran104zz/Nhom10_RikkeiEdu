export interface Customer {
  id: number;
  code: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  points: number;
  createdAt?: string;
}

export interface Supplier {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt?: string;
}

export interface Employee {
  id: number;
  name: string;
  role: string;
  phone?: string;
  email?: string;
  createdAt?: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  maxStock?: number;
}

export interface Order {
  id: number;
  code: string;
  customerName?: string;
  employeeName?: string;
  createdAt: string;
  total: number;
  discount: number;
  paymentMethod: 'cash' | 'transfer' | string;
  status: 'completed' | 'pending' | 'cancelled' | 'processing' | string;
  note?: string;
  items: OrderItem[];
}

export interface StockTransaction {
  id: number;
  productName: string;
  sku: string;
  type: 'import' | 'export' | string;
  quantity: number;
  supplierName?: string;
  note?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface TopProduct {
  name: string;
  quantity: number;
}

export interface RecentOrder {
  id: number;
  code: string;
  status: string;
  customerName: string;
  createdAt: string;
  total: number;
}

export interface LowStockProduct {
  id: number;
  name: string;
  categoryName: string;
  sku: string;
  stock: number;
}

export interface DashboardData {
  stats: DashboardStats;
  monthlyRevenue: MonthlyRevenue[];
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
  lowStock: LowStockProduct[];
}

export interface StoreSettings {
  id: number;
  storeName: string;
  address?: string;
  phone?: string;
  email?: string;
  taxCode?: string;
}
export * from './product';
export * from './auth';
