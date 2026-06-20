// layouts/MainLayout.jsx — eManage, MISA-style redesign
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard, Package, Tag, Award, Warehouse,
  ArrowDownToLine, ArrowUpFromLine, Users, Building2,
  ShoppingCart, Monitor, UserCog, BarChart3, Settings,
  ChevronDown, ChevronRight, Menu, X, Sun, Moon,
  Bell, Search, TrendingUp, Zap, ChevronLeft
} from 'lucide-react';

/* ── Nav tree ────────────────────────────────────────── */
const navItems = [
  { path: '/', label: 'Tổng quan', icon: LayoutDashboard, color: 'text-emerald-500' },
  {
    label: 'Sản phẩm', icon: Package, color: 'text-blue-500',
    children: [
      { path: '/products',   label: 'Danh sách sản phẩm', icon: Package },
      { path: '/categories', label: 'Danh mục',            icon: Tag },
      { path: '/brands',     label: 'Thương hiệu',         icon: Award },
    ]
  },
  {
    label: 'Kho hàng', icon: Warehouse, color: 'text-amber-500',
    children: [
      { path: '/stock',        label: 'Tồn kho',   icon: Warehouse },
      { path: '/stock/import', label: 'Nhập kho',  icon: ArrowDownToLine },
      { path: '/stock/export', label: 'Xuất kho',  icon: ArrowUpFromLine },
    ]
  },
  { path: '/customers', label: 'Khách hàng',     icon: Users,      color: 'text-purple-500' },
  { path: '/suppliers', label: 'Nhà cung cấp',   icon: Building2,  color: 'text-rose-500' },
  { path: '/orders',    label: 'Đơn bán hàng',   icon: ShoppingCart, color: 'text-indigo-500' },
  { path: '/pos',       label: 'POS Bán hàng',   icon: Monitor,    color: 'text-teal-500' },
  { path: '/employees', label: 'Nhân viên',       icon: UserCog,    color: 'text-orange-500' },
  { path: '/reports',   label: 'Báo cáo',         icon: BarChart3,  color: 'text-pink-500' },
  { path: '/settings',  label: 'Cài đặt',         icon: Settings,   color: 'text-gray-400' },
];

/* ── Single nav item ─────────────────────────────────── */
function NavItem({ item, collapsed, location }) {
  const [open, setOpen] = useState(
    () => item.children?.some(c => c.path === location.pathname) ?? false
  );
  const Icon  = item.icon;
  const color = item.color || 'text-gray-500';

  if (item.children) {
    const anyActive = item.children.some(c => c.path === location.pathname);
    return (
      <div>
        <button
          onClick={() => setOpen(o => !o)}
          title={collapsed ? item.label : undefined}
          className={`sidebar-link w-full ${anyActive ? 'sidebar-group-active' : 'sidebar-link-inactive'}`}
        >
          <span className={`shrink-0 ${anyActive ? 'text-primary-600 dark:text-primary-400' : color}`}>
            <Icon size={18} />
          </span>
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              <span className="text-gray-400">
                {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              </span>
            </>
          )}
        </button>

        {open && !collapsed && (
          <div className="mt-0.5 ml-3 pl-4 border-l-2 border-gray-100 dark:border-gray-800 space-y-0.5">
            {item.children.map(child => {
              const active = child.path === location.pathname;
              const CIcon  = child.icon;
              return (
                <Link
                  key={child.path} to={child.path}
                  className={`sidebar-link text-xs ${active ? 'sidebar-link-active' : 'sidebar-link-inactive'}`}
                >
                  <CIcon size={14} className="shrink-0" />
                  {child.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const active = item.path === location.pathname;
  return (
    <Link
      to={item.path}
      title={collapsed ? item.label : undefined}
      className={`sidebar-link ${active ? 'sidebar-link-active' : 'sidebar-link-inactive'}`}
    >
      <span className={`shrink-0 ${active ? 'text-white' : color}`}>
        <Icon size={18} />
      </span>
      {!collapsed && <span className="flex-1">{item.label}</span>}
    </Link>
  );
}

/* ── Logo mark ───────────────────────────────────────── */
function LogoMark({ collapsed }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-5 border-b border-gray-100 dark:border-gray-800 ${collapsed ? 'justify-center px-2' : ''}`}>
      {/* Icon */}
      <div className="w-9 h-9 rounded-xl header-gradient flex items-center justify-center shadow-md shadow-primary-500/30 shrink-0">
        <Zap size={18} className="text-white" fill="white" />
      </div>
      {!collapsed && (
        <div className="leading-tight">
          <span className="font-extrabold text-gray-900 dark:text-white text-base tracking-tight">
            e<span className="text-primary-500">Manage</span>
          </span>
          <p className="text-[10px] text-gray-400 font-medium mt-0.5">Quản lý bán hàng</p>
        </div>
      )}
    </div>
  );
}

/* ── Sidebar ─────────────────────────────────────────── */
function Sidebar({ collapsed, onToggle, location }) {
  return (
    <div className="flex flex-col h-full">
      <LogoMark collapsed={collapsed} />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-0.5">
        {!collapsed && (
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 pb-2">
            Menu chính
          </p>
        )}
        {navItems.map((item, i) => (
          <NavItem key={i} item={item} collapsed={collapsed} location={location} />
        ))}
      </nav>

      {/* Upgrade banner — show only when expanded */}
      {!collapsed && (
        <div className="mx-3 mb-3 rounded-2xl header-gradient p-4 text-white">
          <TrendingUp size={20} className="mb-2 opacity-90" />
          <p className="text-xs font-bold">Nâng cấp Pro</p>
          <p className="text-[11px] opacity-80 mt-0.5 mb-2">Mở khoá toàn bộ tính năng</p>
          <div className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold py-1.5 rounded-lg text-center cursor-pointer transition-colors">
            Dùng thử miễn phí
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <div className="p-2.5 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={onToggle}
          className="sidebar-link sidebar-link-inactive w-full justify-center"
          title={collapsed ? 'Mở rộng' : 'Thu gọn'}
        >
          {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          {!collapsed && <span className="text-xs">Thu gọn</span>}
        </button>
      </div>
    </div>
  );
}

/* ── Header ──────────────────────────────────────────── */
function Header({ onMenuOpen, dark, toggleDark }) {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-5 h-14 flex items-center gap-3 shrink-0 shadow-sm">
      {/* Mobile menu */}
      <button
        className="lg:hidden p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-gray-800 text-gray-500"
        onClick={onMenuOpen}
      >
        <Menu size={18} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-xs relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="input py-2 pl-9 bg-surface-50 dark:bg-gray-800 border-gray-200 text-sm"
          placeholder="Tìm kiếm..."
        />
      </div>

      <div className="flex items-center gap-1 ml-auto">
        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-gray-800 text-gray-500">
          <Bell size={17} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full ring-1 ring-white" />
        </button>

        {/* Dark mode */}
        <button
          onClick={toggleDark}
          className="p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-gray-800 text-gray-500"
        >
          {dark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* User */}
        <div className="flex items-center gap-2.5 pl-1 cursor-pointer group">
          <div className="w-8 h-8 rounded-xl header-gradient flex items-center justify-center text-white text-xs font-extrabold shadow-sm shadow-primary-500/30">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">Admin</p>
            <p className="text-[11px] text-gray-400">Quản trị viên</p>
          </div>
          <ChevronDown size={13} className="text-gray-400 hidden sm:block" />
        </div>
      </div>
    </header>
  );
}

/* ── Main layout ─────────────────────────────────────── */
export default function MainLayout({ children }) {
  const location       = useLocation();
  const { dark, toggle } = useTheme();
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50 dark:bg-gray-950">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 shadow-sidebar shrink-0 transition-all duration-300
          ${collapsed ? 'w-[64px]' : 'w-[220px]'}`}
      >
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} location={location} />
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transform transition-transform duration-300 lg:hidden
          ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-gray-800 text-gray-500"
        >
          <X size={16} />
        </button>
        <Sidebar collapsed={false} onToggle={() => setMobileOpen(false)} location={location} />
      </aside>

      {/* Content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuOpen={() => setMobileOpen(true)} dark={dark} toggleDark={toggle} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-5 lg:p-6 animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
