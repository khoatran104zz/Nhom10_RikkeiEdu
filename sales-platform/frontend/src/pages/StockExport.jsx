// pages/StockExport.jsx - Xuất kho
import { useState, useEffect } from 'react';
import { ArrowUpFromLine, CheckCircle } from 'lucide-react';
import { stockApi, productsApi } from '../services/api';
import { formatDate } from '../utils/format';
import { PageHeader, Table, Loading, FormField, toast } from '../components/shared';

export default function StockExport() {
  const [products, setProducts] = useState([]);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [form, setForm] = useState({ productId: '', quantity: '', note: '' });
  const [saving, setSaving] = useState(false);

  const loadAll = async () => {
    const [p, h] = await Promise.all([
      productsApi.getAll({ limit: 100, page: 1 }),
      stockApi.getHistory('export'),
    ]);
    setProducts(p.data);
    setHistory(h);
    setLoadingHistory(false);
  };

  useEffect(() => { loadAll(); }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.productId || !form.quantity) return toast('Vui lòng chọn sản phẩm và nhập số lượng', 'error');
    if (Number(form.quantity) <= 0) return toast('Số lượng phải lớn hơn 0', 'error');
    setSaving(true);
    try {
      const res = await stockApi.export(form);
      toast(`Xuất kho thành công! Tồn kho còn lại: ${res.newStock}`);
      setForm({ productId: '', quantity: '', note: '' });
      loadAll();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <PageHeader title="Xuất kho" subtitle="Ghi nhận hàng hóa xuất khỏi kho" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ArrowUpFromLine size={16} className="text-orange-600" />
            Phiếu xuất kho
          </h2>
          <FormField label="Sản phẩm" required>
            <select className="input" value={form.productId} onChange={e => set('productId', e.target.value)}>
              <option value="">-- Chọn sản phẩm --</option>
              {products.map(p => (
                <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                  {p.name} (Tồn: {p.stock})
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Số lượng xuất" required>
            <input type="number" min="1" className="input" value={form.quantity}
              onChange={e => set('quantity', e.target.value)} placeholder="0" />
          </FormField>
          <FormField label="Lý do xuất kho">
            <textarea className="input resize-none h-20" value={form.note}
              onChange={e => set('note', e.target.value)} placeholder="VD: Xuất trả hàng, hàng lỗi..." />
          </FormField>
          <button className="btn w-full justify-center py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg" onClick={submit} disabled={saving}>
            <CheckCircle size={16} className="mr-2" />
            {saving ? 'Đang lưu...' : 'Xác nhận xuất kho'}
          </button>
        </div>

        <div className="lg:col-span-2 card">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white">Lịch sử xuất kho</h2>
          </div>
          {loadingHistory ? <Loading /> : (
            <Table headers={['Sản phẩm', 'Số lượng', 'Ghi chú', 'Ngày xuất']}>
              {history.map(h => (
                <tr key={h.id} className="table-row">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{h.productName}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="badge badge-red">-{h.quantity}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-500">{h.note || '—'}</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-500">{formatDate(h.createdAt)}</td>
                </tr>
              ))}
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
