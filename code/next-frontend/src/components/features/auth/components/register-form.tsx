'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Mail, User, Store, Phone, Loader2 } from 'lucide-react';
import { AuthLayout, AuthCard, PasswordInput, FormField, toast } from '@/components/base';

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    storeName: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên của bạn';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Vui lòng nhập địa chỉ email';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email không hợp lệ (ví dụ: ten@email.com)';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{9,11}$/.test(form.phone.replace(/[\s.-]/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ (phải từ 9-11 số)';
    }

    if (!form.storeName.trim()) {
      newErrors.storeName = 'Vui lòng nhập tên cửa hàng của bạn';
    }

    if (!form.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (form.password.length < 6) {
      newErrors.password = 'Mật khẩu phải chứa ít nhất 6 ký tự';
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không trùng khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulation of network request
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast('Đăng ký chưa kết nối backend. Vui lòng dùng tài khoản đã có trong database để đăng nhập.', 'error');
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
      
      router.push('/login');
    } catch (err: unknown) {
      toast((err as Error).message || 'Có lỗi xảy ra trong quá trình đăng ký', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center mb-6">
        {/* Logo */}
        <div className="w-12 h-12 rounded-2xl header-gradient flex items-center justify-center shadow-lg shadow-primary-500/20 mb-3">
          <Zap size={24} className="text-white" fill="white" />
        </div>
        <div className="leading-tight text-center">
          <span className="font-extrabold text-gray-900 dark:text-white text-2xl tracking-tight">
            e<span className="text-primary-500">Manage</span>
          </span>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1">Hệ thống quản lý bán hàng chuyên nghiệp</p>
        </div>
      </div>

      <AuthCard>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Đăng ký tài khoản Admin</h2>
          <p className="text-xs text-primary-600 dark:text-primary-400 font-bold mt-1">Đăng ký tài khoản Chủ cửa hàng (Admin/Owner) để quản trị hệ thống</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-1">
          {/* Họ tên */}
          <FormField label="Họ tên" required error={errors.name}>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                <User size={16} />
              </span>
              <input
                type="text"
                className={`input pl-10 focus:ring-primary-500/40 focus:border-primary-500 text-sm ${
                  errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                }`}
                placeholder="Nguyễn Văn A"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={isLoading}
              />
            </div>
          </FormField>

          {/* Email */}
          <FormField label="Email" required error={errors.email}>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                <Mail size={16} />
              </span>
              <input
                type="email"
                className={`input pl-10 focus:ring-primary-500/40 focus:border-primary-500 text-sm ${
                  errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                }`}
                placeholder="ten@email.com"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={isLoading}
              />
            </div>
          </FormField>

          {/* Số điện thoại */}
          <FormField label="Số điện thoại" required error={errors.phone}>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                <Phone size={16} />
              </span>
              <input
                type="tel"
                className={`input pl-10 focus:ring-primary-500/40 focus:border-primary-500 text-sm ${
                  errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                }`}
                placeholder="0901234567"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={isLoading}
              />
            </div>
          </FormField>

          {/* Tên cửa hàng */}
          <FormField label="Tên cửa hàng" required error={errors.storeName}>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                <Store size={16} />
              </span>
              <input
                type="text"
                className={`input pl-10 focus:ring-primary-500/40 focus:border-primary-500 text-sm ${
                  errors.storeName ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                }`}
                placeholder="Cửa hàng tạp hóa eManage"
                value={form.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                disabled={isLoading}
              />
            </div>
          </FormField>

          {/* Mật khẩu */}
          <FormField label="Mật khẩu" required error={errors.password}>
            <PasswordInput
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Tối thiểu 6 ký tự"
              disabled={isLoading}
              error={!!errors.password}
            />
          </FormField>

          {/* Xác nhận mật khẩu */}
          <FormField label="Xác nhận mật khẩu" required error={errors.confirmPassword}>
            <PasswordInput
              value={form.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              placeholder="Nhập lại mật khẩu"
              disabled={isLoading}
              error={!!errors.confirmPassword}
            />
          </FormField>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full btn btn-primary py-3 rounded-xl justify-center font-bold text-sm select-none cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Đang khởi tạo tài khoản...
                </>
              ) : (
                'Đăng ký'
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
            Đã có tài khoản?{' '}
            <Link
              href="/login"
              className="text-primary-500 hover:text-primary-600 transition-colors font-bold"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
