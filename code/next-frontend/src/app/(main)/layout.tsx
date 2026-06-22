'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/providers/providers';
import { useAuthStore } from '@/store/use-auth-store';
import { menuConfig } from '@/constants/menu-config';
import { ROLE_LABELS } from '@/constants/roles';
import {
  LayoutDashboard, Package, Tag, Award, Warehouse,
  ArrowDownToLine, ArrowUpFromLine, Users, Building2,
  ShoppingCart, Monitor, UserCog, BarChart3, Settings,
  ChevronDown, ChevronRight, Menu, X, Sun, Moon,
  Bell, Search, Zap, User, LogOut, HelpCircle, Percent
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  LayoutDashboard, Package, Tag, Award, Warehouse,
  ArrowDownToLine, ArrowUpFromLine, Users, Building2,
  ShoppingCart, Monitor, UserCog, BarChart3, Settings,
  ChevronDown, ChevronRight, Menu, X, Sun, Moon,
  Bell, Search, Zap, User, LogOut, HelpCircle, Percent
};

function getHomePath(role: string) {
  switch (role) {
    case 'ADMIN':
      return '/';
    case 'BRANCH_MANAGER':
      return '/branch-dashboard';
    case 'CASHIER':
      return '/pos';
    case 'INVENTORY_STAFF':
      return '/stock';
    case 'ACCOUNTANT':
      return '/finance';
    case 'CUSTOMER':
      return '/customer';
    default:
      return '/';
  }
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { dark, toggle } = useTheme();
  const { user, logout, loading } = useAuthStore();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  // Re-close dropdown/mobile menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Fallback defaults if no user logged in (failsafe)
  const activeUser = user || { name: 'Admin', role: 'ADMIN', branchId: null };
  const userRole = activeUser.role || 'ADMIN';
  const roleLabel = ROLE_LABELS[userRole] || userRole;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const isMenuGroupActive = (subpaths: string[]) => {
    return subpaths.some((p) => pathname === p);
  };

  const filteredMenu = menuConfig.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(userRole);
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-surface-50 dark:bg-gray-950 transition-colors duration-300">
      
      {/* ==================== ROW 1: HEADER TOP ==================== */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-5 h-14 flex items-center justify-between shrink-0 shadow-sm z-30 transition-colors duration-300">
        
        {/* Left Side: Hamburger & Logo */}
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-gray-800 text-gray-500"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={18} />
          </button>
          
          <Link href={userRole === 'ADMIN' ? '/' : getHomePath(userRole)} className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl header-gradient flex items-center justify-center shadow-md shadow-primary-500/30">
              <Zap size={17} className="text-white" fill="white" />
            </div>
            <div className="leading-tight">
              <span className="font-extrabold text-gray-900 dark:text-white text-base tracking-tight">
                e<span className="text-primary-500">Manage</span>
              </span>
              <p className="text-[9px] text-gray-400 font-medium mt-0.5">Quản lý bán hàng</p>
            </div>
          </Link>
        </div>

        {/* Right Side: Utilities, notifications, profile */}
        <div className="flex items-center gap-1.5">
          
          {/* Support */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 hover:bg-surface-55 dark:hover:bg-gray-800 rounded-xl cursor-pointer text-xs font-semibold text-gray-600 dark:text-gray-300 transition-colors">
            <HelpCircle size={14} className="text-gray-400" />
            <span>Hỗ trợ</span>
          </div>

          {/* Language dropdown */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 hover:bg-surface-55 dark:hover:bg-gray-800 rounded-xl cursor-pointer text-xs font-semibold text-gray-600 dark:text-gray-300 transition-colors">
            <span className="w-4 h-3 bg-red-600 relative overflow-hidden inline-block border border-gray-100 rounded-sm">
              <span className="absolute inset-0 flex items-center justify-center text-[7px] text-yellow-400">★</span>
            </span>
            <span>Tiếng Việt</span>
            <ChevronDown size={11} className="text-gray-400" />
          </div>

          {/* Branch dropdown */}
          {userRole !== 'CUSTOMER' && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 hover:bg-surface-55 dark:hover:bg-gray-800 rounded-xl cursor-pointer text-xs font-semibold text-gray-600 dark:text-gray-300 transition-colors">
              <Building2 size={14} className="text-gray-400" />
              <span>{activeUser.branchId ? 'Chi nhánh Trung tâm' : 'Hệ thống eManage'}</span>
              <ChevronDown size={11} className="text-gray-400" />
            </div>
          )}

          {/* Divider */}
          <div className="hidden sm:block w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

          {/* Bell Notifications */}
          <button className="relative p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-1 ring-white" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggle}
            className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* User profile dropdown */}
          <div className="relative pl-1">
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-surface-50 dark:hover:bg-gray-800 cursor-pointer group select-none transition-colors"
            >
              <div className="w-7 h-7 rounded-xl header-gradient flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-primary-500/30">
                {activeUser.name ? activeUser.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="hidden md:flex flex-col text-left leading-none">
                <span className="text-xs font-bold text-gray-800 dark:text-white leading-none">{activeUser.name || 'Admin'}</span>
                <span className="text-[9px] text-gray-400 font-semibold mt-1 leading-none">{roleLabel}</span>
              </div>
              <ChevronDown size={12} className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Click-away overlay */}
            {dropdownOpen && (
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
            )}

            {/* User drop menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl py-2 z-20 animate-fadeIn">
                <div className="px-4 py-2 border-b border-gray-50 dark:border-gray-800/80 mb-1">
                  <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">{activeUser.name || 'Admin'}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{roleLabel}</p>
                </div>

                {userRole === 'ADMIN' && (
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      router.push('/account');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                  >
                    <UserCog size={14} className="text-gray-400 dark:text-gray-500" />
                    Tạo tài khoản & Phân quyền
                  </button>
                )}

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    router.push('/profile');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                >
                  <User size={14} className="text-gray-400 dark:text-gray-500" />
                  Hồ sơ cá nhân
                </button>

                <div className="h-px bg-gray-100 dark:bg-gray-700 my-1.5" />

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left"
                >
                  <LogOut size={14} />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ==================== ROW 2: TOP HORIZONTAL NAV BAR ==================== */}
      <nav className="hidden lg:block bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800/80 shadow-sm z-20 shrink-0 select-none py-1.5 transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto px-5 flex items-center gap-1.5">
          
          {filteredMenu.map((item, idx) => {
            const Icon = iconMap[item.icon] || Package;
            if (item.children) {
              const activePaths = item.children.map(child => child.path);
              const isGroupActive = isMenuGroupActive(activePaths);
              return (
                <div
                  key={idx}
                  className="relative"
                  onMouseEnter={() => setHoveredMenu(item.title)}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  <button
                    className={`px-4 py-2 text-xs font-bold flex items-center gap-1.5 rounded-xl transition-all duration-150 ${
                      isGroupActive
                        ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/15'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-surface-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={15} />
                    {item.title}
                    <ChevronDown size={12} className="opacity-80" />
                  </button>
                  
                  {hoveredMenu === item.title && (
                    <div className="absolute left-0 top-full pt-1.5 w-48 z-30 animate-fadeIn text-gray-700 dark:text-gray-200">
                      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/80 rounded-xl shadow-xl py-1.5">
                        {item.children.map((child, cIdx) => (
                          <Link
                            key={cIdx}
                            href={child.path}
                            className="block px-4 py-2 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={idx}
                href={item.path || '/'}
                className={`px-4 py-2 text-xs font-bold flex items-center gap-1.5 rounded-xl transition-all duration-150 ${
                  isActive(item.path)
                    ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/15'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-surface-50 dark:hover:bg-gray-800'
                }`}
              >
                <Icon size={15} />
                {item.title}
              </Link>
            );
          })}
          
        </div>
      </nav>

      {/* ==================== MOBILE MENU DRAWER ==================== */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-r-gray-100 dark:border-r-gray-800 transform transition-transform duration-300 lg:hidden
          ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-b-gray-100 dark:border-b-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl header-gradient flex items-center justify-center">
              <Zap size={14} className="text-white" fill="white" />
            </div>
            <span className="font-extrabold text-gray-900 dark:text-white text-sm">eManage</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-gray-800 text-gray-400"
          >
            <X size={16} />
          </button>
        </div>

        {/* Mobile Navigation List */}
        <nav className="overflow-y-auto p-3 space-y-1">
          {filteredMenu.map((item, idx) => {
            const Icon = iconMap[item.icon] || Package;
            if (item.children) {
              return (
                <div key={idx} className="space-y-1 pt-2">
                  <div className="flex items-center gap-2 px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest select-none">
                    <Icon size={13} />
                    {item.title}
                  </div>
                  {item.children.map((child, cIdx) => (
                    <Link
                      key={cIdx}
                      href={child.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-6 py-1.5 rounded-xl text-xs font-semibold ${
                        isActive(child.path)
                          ? 'text-primary-600 dark:text-primary-400 font-bold'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-surface-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      • {child.title}
                    </Link>
                  ))}
                </div>
              );
            }

            return (
              <Link
                key={idx}
                href={item.path || '/'}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold ${
                  isActive(item.path)
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-bold'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-surface-50 dark:hover:bg-gray-800'
                }`}
              >
                <Icon size={16} />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ==================== CONTENT CONTAINER ==================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="p-5 lg:p-6 animate-fadeIn">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
