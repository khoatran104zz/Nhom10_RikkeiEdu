// pages/Stock.jsx - Quản lý tồn kho
import { useState, useEffect, useCallback } from 'react';
import { Warehouse, Package } from 'lucide-react';
import { stockApi } from '../services/api';
import { formatCurrency } from '../utils/format';
import { PageHeader, SearchBar, Table, Loading, EmptyState } from '../components/shared';

export default function Stock() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { setProducts(await stockApi.getAll()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = filtered.reduce((s, p) => s + p.stock * p.costPrice, 0);

  return (
    <div>
      <PageHeader title="Tồn kho" subtitle="Theo dõi số lượng tồn kho hiện tại"
        actions={<SearchBar value={search} onChange={setSearch} placeholder="Tìm sản phẩm..." />}
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-xs text-gray-500">Tổng sản phẩm</p>
          <p className="text-2xl font-bold mt-1">{filtered.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500">Hết hàng</p>
          <p className="text-2xl font-bold mt-1 text-red-600">{filtered.filter(p => p.stock === 0).length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500">Tổng giá trị tồn kho</p>
          <p className="text-2xl font-bold mt-1 text-primary-600">{formatCurrency(totalValue)}</p>
        </div>
      </div>

      <div className="card">
        {loading ? <Loading /> : (
          <Table headers={['Sản phẩm', 'SKU', 'Danh mục', 'Giá nhập', 'Giá bán', 'Tồn kho', 'Giá trị']}>
            {filtered.length === 0 ? (
              <tr><td colSpan={7}><EmptyState message="Không có sản phẩm" icon={Warehouse} /></td></tr>
            ) : filtered.map(p => (
              <tr key={p.id} className="table-row">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                      {p.image
                        ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                        : <Package size={14} className="m-1.5 text-gray-400" />
                      }
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-xs text-gray-500 font-mono">{p.sku}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-500">{p.categoryName}</td>
                <td className="px-4 py-3 text-right text-sm">{formatCurrency(p.costPrice)}</td>
                <td className="px-4 py-3 text-right text-sm">{formatCurrency(p.salePrice)}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`badge ${p.stock === 0 ? 'badge-red' : p.stock < 10 ? 'badge-yellow' : 'badge-green'}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-sm font-medium">{formatCurrency(p.stock * p.costPrice)}</td>
              </tr>
            ))}
          </Table>
        )}
      </div>
    </div>
  );
}
