// pages/Reports.jsx - Báo cáo thống kê
import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { dashboardApi, stockApi } from '../services/api';
import { formatCurrency, formatNumber } from '../utils/format';
import { PageHeader, Loading } from '../components/shared';
import { TrendingUp, Package, ShoppingCart, Users } from 'lucide-react';

const COLORS = ['#00A84F', '#0BC5A4', '#f59e0b', '#8b5cf6', '#f43f5e'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 text-sm">
        <p className="text-gray-500 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-semibold">
            {p.name}: {p.name === 'Doanh thu' ? formatCurrency(p.value) : formatNumber(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Reports() {
  const [data, setData] = useState(null);
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dashboardApi.get(), stockApi.getAll()]).then(([d, s]) => {
      setData(d);
      setStock(s);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (!data) return null;

  const { stats, monthlyRevenue, topProducts } = data;

  // Category distribution from stock
  const categoryMap = {};
  stock.forEach(p => {
    const cat = p.categoryName || 'Khác';
    if (!categoryMap[cat]) categoryMap[cat] = 0;
    categoryMap[cat] += p.stock * p.costPrice;
  });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <PageHeader title="Báo cáo" subtitle="Phân tích dữ liệu kinh doanh" />

      {/* Summary stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Tổng doanh thu', value: formatCurrency(stats.totalRevenue), icon: TrendingUp, color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20' },
          { label: 'Tổng đơn hàng', value: stats.totalOrders, icon: ShoppingCart, color: 'text-accent-600', bg: 'bg-accent-50 dark:bg-accent-900/20' },
          { label: 'Khách hàng', value: stats.totalCustomers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Sản phẩm', value: stats.totalProducts, icon: Package, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
        ].map((s, i) => (
          <div key={i} className="card p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
              <s.icon size={20} className={s.color} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-5">Doanh thu theo tháng</h2>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={monthlyRevenue}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00A84F" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#00A84F" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={v => (v / 1000000).toFixed(0) + 'tr'} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#00A84F" strokeWidth={2.5} fill="url(#rev)" dot={{ r: 5, fill: '#00A84F', strokeWidth: 2, stroke: '#fff' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top products */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-5">Top sản phẩm bán chạy</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} tickFormatter={v => v.length > 12 ? v.substring(0, 12) + '...' : v} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="quantity" name="Số lượng bán" fill="#00A84F" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category distribution */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-5">Giá trị tồn kho theo danh mục</h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={220}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                  dataKey="value" paddingAngle={3}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={v => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {categoryData.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 dark:text-gray-300 truncate">{c.name}</p>
                    <p className="text-xs text-gray-500">{formatCurrency(c.value)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top products revenue table */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Chi tiết doanh thu sản phẩm</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">#</th>
                <th className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Sản phẩm</th>
                <th className="pb-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Đã bán</th>
                <th className="pb-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <td className="py-3 pr-4 text-gray-400 font-mono text-xs">{String(i + 1).padStart(2, '0')}</td>
                  <td className="py-3 font-medium text-gray-900 dark:text-white">{p.name}</td>
                  <td className="py-3 text-right text-gray-600 dark:text-gray-400">{p.quantity} sp</td>
                  <td className="py-3 text-right font-semibold text-primary-600">{formatCurrency(p.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
