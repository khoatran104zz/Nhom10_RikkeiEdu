'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User as UserIcon, Lock, Mail, Shield, Settings, LogOut, Sun, Moon, Save, Phone, UserPlus, Trash2 } from 'lucide-react';
import { PageHeader, FormField, AccountCard, PasswordInput, toast } from '@/components/base';
import { useTheme } from '@/providers/providers';
import { useAuthStore } from '@/store/use-auth-store';
import { ROLE_LABELS, RoleType } from '@/constants/roles';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  branchId: string | null;
  createdAt: string;
}

export default function AccountDashboard() {
  const router = useRouter();
  const { dark, toggle } = useTheme();
  const { user, logout } = useAuthStore();
  const userRole = user?.role || 'ADMIN';

  const [activeTab, setActiveTab] = useState(userRole === 'ADMIN' ? 'rbac' : 'profile');

  // Dynamic system users database from local storage
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);

  useEffect(() => {
    const defaultUsers: SystemUser[] = [
      { id: 'u-admin', name: 'Lê Văn Admin', email: 'admin@emanage.vn', role: 'ADMIN', branchId: null, createdAt: '2026-06-20' },
      { id: 'u-manager', name: 'Lê Văn Manager', email: 'manager@emanage.vn', role: 'BRANCH_MANAGER', branchId: 'b-trungtam', createdAt: '2026-06-20' },
      { id: 'u-cashier', name: 'Phạm Thị Cashier', email: 'cashier@emanage.vn', role: 'CASHIER', branchId: 'b-trungtam', createdAt: '2026-06-20' },
      { id: 'u-inventory', name: 'Trần Văn Kho', email: 'inventory@emanage.vn', role: 'INVENTORY_STAFF', branchId: 'b-trungtam', createdAt: '2026-06-20' },
      { id: 'u-accountant', name: 'Hoàng Thị Kế Toán', email: 'accountant@emanage.vn', role: 'ACCOUNTANT', branchId: null, createdAt: '2026-06-20' },
      { id: 'u-customer', name: 'Khách Hàng A', email: 'customer@gmail.com', role: 'CUSTOMER', branchId: null, createdAt: '2026-06-20' },
    ];
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('system_users');
        if (stored) {
          setSystemUsers(JSON.parse(stored));
        } else {
          localStorage.setItem('system_users', JSON.stringify(defaultUsers));
          setSystemUsers(defaultUsers);
        }
      } catch {
        setSystemUsers(defaultUsers);
      }
    }
  }, []);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CASHIER' as RoleType,
    branchId: '',
  });

  // Load profile from Zustand store or fallbacks
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'ADMIN' as RoleType,
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '0987654321',
        role: user.role,
      });
    }
  }, [user]);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleProfileChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password.trim()) {
      toast('Vui lòng nhập đầy đủ họ tên, email và mật khẩu', 'error');
      return;
    }
    if (newUser.password.length < 6) {
      toast('Mật khẩu phải từ 6 ký tự trở lên', 'error');
      return;
    }
    const emailLower = newUser.email.trim().toLowerCase();
    if (systemUsers.some(u => u.email.toLowerCase() === emailLower)) {
      toast('Email này đã tồn tại trong hệ thống', 'error');
      return;
    }

    const created: SystemUser = {
      id: 'u-' + newUser.role.toLowerCase() + '-' + Math.random().toString(36).substring(2, 7),
      name: newUser.name.trim(),
      email: newUser.email.trim(),
      role: newUser.role,
      branchId: newUser.branchId || null,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [...systemUsers, created];
    setSystemUsers(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('system_users', JSON.stringify(updated));
    }
    toast('Tạo tài khoản và cấp quyền thành công!');
    setNewUser({
      name: '',
      email: '',
      password: '',
      role: 'CASHIER',
      branchId: '',
    });
  };

  const handleDeleteUser = (id: string) => {
    if (id === 'u-admin' || id === user?.id) {
      toast('Không thể xóa tài khoản Admin đang hoạt động', 'error');
      return;
    }
    const updated = systemUsers.filter(u => u.id !== id);
    setSystemUsers(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('system_users', JSON.stringify(updated));
    }
    toast('Đã xóa tài khoản');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name.trim()) {
      toast('Vui lòng nhập họ tên của bạn', 'error');
      return;
    }

    setIsSavingProfile(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        const currentUserData = storedUser ? JSON.parse(storedUser) : {};
        const updatedUserData = {
          ...currentUserData,
          name: profile.name,
          phone: profile.phone,
        };
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        // We could sync to zustand state here if needed, but since it is just mock details, this is fine
      }
      toast('Đã cập nhật thông tin cá nhân thành công');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Không thể lưu thông tin', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword) {
      toast('Vui lòng điền đầy đủ thông tin mật khẩu', 'error');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast('Mật khẩu mới phải từ 6 ký tự trở lên', 'error');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      toast('Mật khẩu xác nhận không trùng khớp', 'error');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      toast('Đổi mật khẩu thành công');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Không thể cập nhật mật khẩu', 'error');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast('Đăng xuất tài khoản thành công');
    router.replace('/login');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader 
        title={userRole === 'ADMIN' ? 'Tạo tài khoản & Phân quyền' : 'Hồ sơ cá nhân'} 
        subtitle={userRole === 'ADMIN' ? 'Quản lý danh sách tài khoản, cấp quyền truy cập và vai trò trong hệ thống' : 'Quản lý hồ sơ cá nhân và thông tin tài khoản của bạn'} 
      />

      <div className="flex flex-col md:flex-row gap-6">
        
        {/* ==================== LEFT SIDEBAR: TAB LIST ==================== */}
        <div className="w-full md:w-64 shrink-0 space-y-4">
          
          {/* User overview brief card */}
          <div className="card p-5 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center border border-primary-100 dark:border-primary-900/40 mb-3 select-none">
              <span className="text-xl font-extrabold text-primary-600 dark:text-primary-400">
                {profile.name ? (profile.name.trim().split(' ').pop()?.charAt(0).toUpperCase() || 'A') : 'A'}
              </span>
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate max-w-full">{profile.name || 'User'}</h4>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase mt-0.5 tracking-wider">{ROLE_LABELS[userRole] || userRole}</p>
          </div>

          {/* Settings navigation list */}
          <div className="card p-2 space-y-0.5">
            {userRole === 'ADMIN' && (
              <>
                <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-3 py-2">Quản trị</p>
                <button
                  onClick={() => setActiveTab('rbac')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === 'rbac'
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-surface-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <UserPlus size={15} />
                  Tạo TK & Cấp vai trò
                </button>
              </>
            )}

            <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-3 py-2">Tài khoản</p>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-surface-50 dark:hover:bg-gray-800'
              }`}
            >
              <UserIcon size={15} />
              Thông tin cá nhân
            </button>
            
            {userRole === 'ADMIN' && (
              <button
                onClick={() => setActiveTab('password')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === 'password'
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-surface-50 dark:hover:bg-gray-800'
                }`}
              >
                <Shield size={15} />
                Đổi mật khẩu
              </button>
            )}

            {userRole === 'ADMIN' && (
              <>
                <div className="h-px bg-gray-100 dark:bg-gray-800 my-2 mx-2" />
                <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-3 py-2">Cấu hình</p>
                <button
                  onClick={() => setActiveTab('appearance')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === 'appearance'
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-surface-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Settings size={15} />
                  Giao diện hệ thống
                </button>
              </>
            )}

            <div className="h-px bg-gray-100 dark:bg-gray-800 my-2 mx-2" />
            <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-3 py-2">Khác</p>
            
            <button
              onClick={() => setActiveTab('danger')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'danger'
                  ? 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-surface-50 dark:hover:bg-gray-800'
              }`}
            >
              <LogOut size={15} />
              Đăng xuất
            </button>
          </div>

        </div>

        {/* ==================== RIGHT CONTENT: ACTIVE TAB FORM ==================== */}
        <div className="flex-1 min-w-0">
          
          {/* Tab: RBAC Create Account & Assign Role */}
          {activeTab === 'rbac' && userRole === 'ADMIN' && (
            <div className="space-y-6">
              <AccountCard title="Tạo tài khoản mới & Cấp vai trò" icon={UserPlus} className="animate-fadeIn">
                <form onSubmit={handleCreateUser} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Họ tên người dùng" required>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                          <UserIcon size={16} />
                        </span>
                        <input
                          type="text"
                          className="input pl-10 text-sm"
                          placeholder="Nguyễn Văn A"
                          value={newUser.name}
                          onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                    </FormField>

                    <FormField label="Email đăng nhập" required>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                          <Mail size={16} />
                        </span>
                        <input
                          type="email"
                          className="input pl-10 text-sm"
                          placeholder="nhanvien@emanage.vn"
                          value={newUser.email}
                          onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField label="Mật khẩu" required>
                      <PasswordInput
                        value={newUser.password}
                        onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Mật khẩu >= 6 ký tự"
                      />
                    </FormField>

                    <FormField label="Vai trò hệ thống (Role)" required>
                      <select
                        className="input font-bold text-sm"
                        value={newUser.role}
                        onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as RoleType }))}
                      >
                        {Object.keys(ROLE_LABELS).map(roleKey => (
                          <option key={roleKey} value={roleKey}>
                            {ROLE_LABELS[roleKey as RoleType]}
                          </option>
                        ))}
                      </select>
                    </FormField>

                    <FormField label="Chi nhánh làm việc">
                      <select
                        className="input text-sm"
                        value={newUser.branchId || ''}
                        onChange={(e) => setNewUser(prev => ({ ...prev, branchId: e.target.value }))}
                      >
                        <option value="">-- Toàn hệ thống --</option>
                        <option value="b-trungtam">Chi nhánh Trung tâm</option>
                      </select>
                    </FormField>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="btn btn-primary font-bold text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <UserPlus size={16} />
                      Tạo tài khoản & Cấp quyền
                    </button>
                  </div>
                </form>
              </AccountCard>

              {/* Accounts List Table */}
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield size={18} className="text-primary-500" />
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">Danh sách tài khoản hệ thống</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-gray-150 dark:border-gray-800 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <th className="pb-3 pl-2">Người dùng</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3 text-right">Vai trò</th>
                        <th className="pb-3 text-right">Chi nhánh</th>
                        <th className="pb-3 text-right pr-2">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                      {systemUsers.map((u) => (
                        <tr key={u.id} className="text-xs text-gray-700 dark:text-gray-300">
                          <td className="py-3 pl-2 font-bold text-gray-900 dark:text-white">{u.name}</td>
                          <td className="py-3">{u.email}</td>
                          <td className="py-3 text-right">
                            <span className={`badge ${
                              u.role === 'ADMIN' ? 'badge-red' :
                              u.role === 'BRANCH_MANAGER' ? 'badge-blue' :
                              u.role === 'CASHIER' ? 'badge-green' :
                              u.role === 'INVENTORY_STAFF' ? 'badge-yellow' :
                              u.role === 'ACCOUNTANT' ? 'badge-purple' : 'badge-teal'
                            }`}>
                              {ROLE_LABELS[u.role] || u.role}
                            </span>
                          </td>
                          <td className="py-3 text-right text-gray-500 dark:text-gray-400">
                            {u.branchId ? 'Chi nhánh Trung tâm' : 'Toàn hệ thống'}
                          </td>
                          <td className="py-3 text-right pr-2">
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              disabled={u.id === 'u-admin' || u.id === user?.id}
                              className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              title="Xóa tài khoản"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 1: Profile Info Form */}
          {activeTab === 'profile' && (
            <AccountCard title="Thông tin cá nhân" icon={UserIcon} className="animate-fadeIn">
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Họ tên" required>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                        <UserIcon size={16} />
                      </span>
                      <input
                        type="text"
                        className="input pl-10 text-sm"
                        value={profile.name}
                        onChange={(e) => handleProfileChange('name', e.target.value)}
                        disabled={isSavingProfile}
                      />
                    </div>
                  </FormField>

                  <FormField label="Email" required>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                        <Mail size={16} />
                      </span>
                      <input
                        type="email"
                        className="input pl-10 bg-gray-50 dark:bg-gray-800 cursor-not-allowed text-sm"
                        value={profile.email}
                        readOnly
                        title="Không thể thay đổi email đăng nhập"
                      />
                    </div>
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Số điện thoại">
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                        <Phone size={16} />
                      </span>
                      <input
                        type="tel"
                        className="input pl-10 text-sm"
                        value={profile.phone || ''}
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                        disabled={isSavingProfile}
                      />
                    </div>
                  </FormField>

                  <FormField label="Vai trò">
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                        <Shield size={16} />
                      </span>
                      <input
                        type="text"
                        className="input pl-10 bg-gray-50 dark:bg-gray-800 cursor-not-allowed text-sm"
                        value={ROLE_LABELS[userRole] || userRole}
                        readOnly
                      />
                    </div>
                  </FormField>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="btn btn-primary flex items-center gap-2 cursor-pointer"
                    disabled={isSavingProfile}
                  >
                    <Save size={16} />
                    {isSavingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>
              </form>
            </AccountCard>
          )}

          {/* Tab 2: Password Update Form */}
          {activeTab === 'password' && userRole === 'ADMIN' && (
            <AccountCard title="Đổi mật khẩu" icon={Shield} className="animate-fadeIn">
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <FormField label="Mật khẩu hiện tại" required>
                  <PasswordInput
                    value={passwordForm.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    placeholder="Nhập mật khẩu hiện tại"
                    disabled={isUpdatingPassword}
                  />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Mật khẩu mới" required>
                    <PasswordInput
                      value={passwordForm.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      placeholder="Nhập mật khẩu mới"
                      disabled={isUpdatingPassword}
                    />
                  </FormField>

                  <FormField label="Xác nhận mật khẩu mới" required>
                    <PasswordInput
                      value={passwordForm.confirmNewPassword}
                      onChange={(e) => handlePasswordChange('confirmNewPassword', e.target.value)}
                      placeholder="Nhập lại mật khẩu mới"
                      disabled={isUpdatingPassword}
                    />
                  </FormField>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="btn btn-primary flex items-center gap-2 cursor-pointer"
                    disabled={isUpdatingPassword}
                  >
                    <Lock size={16} />
                    {isUpdatingPassword ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                  </button>
                </div>
              </form>
            </AccountCard>
          )}

          {/* Tab 3: Appearance Selection */}
          {activeTab === 'appearance' && userRole === 'ADMIN' && (
            <AccountCard title="Giao diện hệ thống" icon={Settings} className="animate-fadeIn">
              <div className="space-y-6">
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 pb-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">Chế độ tối</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Giảm mỏi mắt khi làm việc trong môi trường tối</p>
                  </div>
                  <button
                    onClick={toggle}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 cursor-pointer ${
                      dark ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${
                        dark ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    >
                      {dark ? <Moon size={11} className="text-primary-600" /> : <Sun size={11} className="text-orange-500" />}
                    </span>
                  </button>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Tùy chọn chủ đề nhanh</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      onClick={() => dark && toggle()}
                      className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${
                        !dark
                          ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10'
                          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-full h-12 bg-white rounded-lg border border-gray-150 mb-2 flex items-center px-2 gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                        <div className="flex-1 h-2 bg-gray-100 rounded" />
                      </div>
                      <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300">Giao diện Sáng</p>
                    </div>

                    <div
                      onClick={() => !dark && toggle()}
                      className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${
                        dark
                          ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10'
                          : 'border-gray-200 dark:border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <div className="w-full h-12 bg-gray-900 rounded-lg border border-gray-800 mb-2 flex items-center px-2 gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-700" />
                        <div className="flex-1 h-2 bg-gray-800 rounded" />
                      </div>
                      <p className="text-xs font-bold text-center text-gray-700 dark:text-gray-300">Giao diện Tối</p>
                    </div>
                  </div>
                </div>
              </div>
            </AccountCard>
          )}

          {/* Tab 4: Danger Zone logout card */}
          {activeTab === 'danger' && (
            <div className="card p-6 border border-red-200 dark:border-red-950/40 bg-red-50/20 dark:bg-red-950/5 animate-fadeIn">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="font-bold text-red-600 dark:text-red-400 text-sm">Đăng xuất tài khoản</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Thoát khỏi phiên làm việc hiện tại của bạn trên thiết bị này.
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-danger hover:bg-red-600 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 select-none cursor-pointer"
                >
                  <LogOut size={14} />
                  Xác nhận Đăng xuất
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
