import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Vui lòng nhập username hoặc email'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z.string().min(1, 'Họ và tên là bắt buộc'),
  email: z.string().email('Email không đúng định dạng'),
  username: z.string().min(3, 'Username tối thiểu 3 ký tự'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
  branchName: z.string().min(1, 'Tên chi nhánh là bắt buộc'),
  storeName: z.string().min(1, 'Tên cửa hàng là bắt buộc'),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const categorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục là bắt buộc').max(100, 'Tên danh mục tối đa 100 ký tự'),
  description: z.string().max(255, 'Mô tả tối đa 255 ký tự').optional().or(z.literal('')),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export const brandSchema = z.object({
  name: z.string().min(1, 'Tên thương hiệu là bắt buộc').max(100, 'Tên thương hiệu tối đa 100 ký tự'),
  description: z.string().max(255, 'Mô tả tối đa 255 ký tự').optional().or(z.literal('')),
});

export type BrandInput = z.infer<typeof brandSchema>;

export const productSchema = z.object({
  sku: z.string().min(1, 'Mã SKU là bắt buộc').max(50, 'Mã SKU tối đa 50 ký tự'),
  name: z.string().min(1, 'Tên sản phẩm là bắt buộc').max(255, 'Tên sản phẩm tối đa 255 ký tự'),
  categoryId: z.number().nullable().optional(),
  brandId: z.number().nullable().optional(),
  costPrice: z.coerce.number().min(0, 'Giá nhập không được âm'),
  salePrice: z.coerce.number().min(0, 'Giá bán không được âm'),
  stock: z.coerce.number().min(0, 'Số lượng tồn không được âm'),
  image: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
});

export type ProductInput = z.infer<typeof productSchema>;

export const customerSchema = z.object({
  name: z.string().min(1, 'Tên khách hàng là bắt buộc'),
  phone: z.string().min(1, 'Số điện thoại là bắt buộc').regex(/^[0-9+ ]{9,15}$/, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không đúng định dạng').optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
});

export type CustomerInput = z.infer<typeof customerSchema>;

export const supplierSchema = z.object({
  name: z.string().min(1, 'Tên nhà cung cấp là bắt buộc'),
  phone: z.string().optional().or(z.literal('')),
  email: z.string().email('Email không đúng định dạng').optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
});

export type SupplierInput = z.infer<typeof supplierSchema>;

export const employeeSchema = z.object({
  name: z.string().min(1, 'Tên nhân viên là bắt buộc'),
  role: z.string().min(1, 'Vai trò nhân viên là bắt buộc'),
  phone: z.string().optional().or(z.literal('')),
  email: z.string().email('Email không đúng định dạng').optional().or(z.literal('')),
});

export type EmployeeInput = z.infer<typeof employeeSchema>;

export const stockImportSchema = z.object({
  productId: z.number({ message: 'Vui lòng chọn sản phẩm' }),
  quantity: z.coerce.number().min(1, 'Số lượng nhập phải lớn hơn 0'),
  supplierId: z.number().nullable().optional(),
  note: z.string().optional().or(z.literal('')),
});

export type StockImportInput = z.infer<typeof stockImportSchema>;

export const stockExportSchema = z.object({
  productId: z.number({ message: 'Vui lòng chọn sản phẩm' }),
  quantity: z.coerce.number().min(1, 'Số lượng xuất phải lớn hơn 0'),
  note: z.string().optional().or(z.literal('')),
});

export type StockExportInput = z.infer<typeof stockExportSchema>;

export const settingSchema = z.object({
  storeName: z.string().min(1, 'Tên cửa hàng là bắt buộc'),
  address: z.string().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  email: z.string().email('Email không đúng định dạng').optional().or(z.literal('')),
  taxCode: z.string().optional().or(z.literal('')),
});

export type SettingInput = z.infer<typeof settingSchema>;
