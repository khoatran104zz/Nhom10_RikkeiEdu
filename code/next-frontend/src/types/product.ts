export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface Brand {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  categoryId?: number;
  categoryName?: string;
  brandId?: number;
  brandName?: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  image?: string;
  description?: string;
  createdAt?: string;
  active?: boolean;
}
