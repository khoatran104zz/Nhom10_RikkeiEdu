// pages/Dashboard.jsx — eManage, MISA-style overview
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, ShoppingCart, Users, Package, AlertTriangle, Clock, ArrowUpRight } from 'lucide-react';
import { dashboardApi } from '../services/api';
import { StatCard, Loading } from '../components/shared';
import { formatCurrency, formatDateTime, getStatusLabel, getStatusClass } from '../utils/format';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-3">
        <p className="text-xs text-gray-400 mb-1 font-medium">{label}</p>
        <p className="text-sm font-extrabold text-primary-600">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.get().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (!data) return null;

  const { stats, monthlyRevenue, topProducts, recentOrders, lowStock } = data;

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="header-gradient rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute right-12 -bottom-12 w-32 h-32 bg-white/10 rounded-full" />
        <div className="relative">
          <h1 className="text-xl font-extrabold">Chào mừng trở lại, Admin 👋</h1>
          <p className="text-sm text-white/80 mt-1">Đây là tóm tắt hoạt động kinh doanh của eManage hôm nay.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Tổng doanh thu" value={formatCurrency(stats.totalRevenue)} icon={TrendingUp} gradient="green" change={12} />
        <StatCard title="Tổng đơn hàng" value={stats.totalOrders.toLocaleString('vi-VN')} icon={ShoppingCart} gradient="blue" change={8} />
        <StatCard title="Tổng khách hàng" value={stats.totalCustomers.toLocaleString('vi-VN')} icon={Users} gradient="purple" change={5} />
        <StatCard title="Tổng sản phẩm" value={stats.totalProducts.toLocaleString('vi-VN')} icon={Package} gradient="orange" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white text-sm">Doanh thu theo tháng</h2>
              <p className="text-xs text-gray-400 mt-0.5">Biểu đồ tăng trưởng doanh thu</p>
            </div>
            <span className="text-[11px] font-semibold text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-2.5 py-1 rounded-full">
              6 tháng gần nhất
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00A84F" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00A84F" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f8" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={v => (v / 1000000).toFixed(0) + 'tr'} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#00A84F" strokeWidth={2.5} fill="url(#revenueGrad)" dot={{ r: 4, fill: '#00A84F', strokeWidth: 2, stroke: '#fff' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h2 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Top sản phẩm bán chạy</h2>
          <p className="text-xs text-gray-400 mb-4">Theo số lượng đã bán</p>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eef2f8" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#6b7280' }} width={80}
                tickFormatter={v => v.length > 10 ? v.substring(0, 10) + '...' : v} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [`${v} sản phẩm`, 'Đã bán']} cursor={{ fill: '#f7f9fc' }} />
              <Bar dataKey="quantity" fill="#00A84F" radius={[0, 6, 6, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Recent Orders */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                <Clock size={14} className="text-indigo-500" />
              </div>
              <h2 className="font-bold text-gray-900 dark:text-white text-sm">Đơn hàng gần đây</h2>
            </div>
            <Link to="/orders" className="text-xs font-semibold text-primary-600 hover:underline flex items-center gap-0.5">
              Xem tất cả <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between px-5 py-3 hover:bg-surface-50 dark:hover:bg-gray-800/40 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">{order.code}</span>
                    <span className={`badge ${getStatusClass(order.status)}`}>{getStatusLabel(order.status)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{order.customerName} • {formatDateTime(order.createdAt)}</p>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(order.total)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                <AlertTriangle size={14} className="text-amber-500" />
              </div>
              <h2 className="font-bold text-gray-900 dark:text-white text-sm">Sắp hết hàng</h2>
            </div>
            <Link to="/stock" className="text-xs font-semibold text-primary-600 hover:underline flex items-center gap-0.5">
              Xem kho <ArrowUpRight size={12} />
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">Tất cả sản phẩm còn hàng đầy đủ ✓</p>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {lowStock.map(p => (
                <div key={p.id} className="flex items-center justify-between px-5 py-3 hover:bg-surface-50 dark:hover:bg-gray-800/40 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.categoryName} • SKU: {p.sku}</p>
                  </div>
                  <span className={`badge ${p.stock === 0 ? 'badge-red' : 'badge-yellow'}`}>
                    {p.stock} còn lại
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
