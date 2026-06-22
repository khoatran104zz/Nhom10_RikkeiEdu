'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowDownToLine, CheckCircle } from 'lucide-react';
import { stockService, productService, supplierService } from '@/services';
import { formatDate } from '@/utils/format';
import { PageHeader, Table, Loading, FormField, toast } from '@/components/base';
import { Product, Supplier, StockTransaction } from '@/types';

export default function StockImportForm() {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [history, setHistory] = useState<StockTransaction[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [form, setForm] = useState({ productId: '', quantity: '', supplierId: '', note: '' });
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [pRes, sRes, hRes] = await Promise.all([
        productService.getAll({ limit: 100, page: 1 }),
        supplierService.getAll(),
        stockService.getHistory('import'),
      ]);
      setProducts(pRes.data);
      setSuppliers(sRes);
      setHistory(hRes);
    } catch (e: unknown) {
      toast((e as Error).message || 'Lỗi tải dữ liệu', 'error');
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.productId || !form.quantity) {
      return toast('Vui lòng chọn sản phẩm và nhập số lượng', 'error');
    }
    if (Number(form.quantity) <= 0) {
      return toast('Số lượng phải lớn hơn 0', 'error');
    }
    setSaving(true);
    try {
      const res = await stockService.import({
        productId: Number(form.productId),
        quantity: Number(form.quantity),
        supplierId: form.supplierId ? Number(form.supplierId) : undefined,
        note: form.note || undefined,
      });
      toast(`Nhập kho thành công! Tồn kho mới: ${res.newStock}`);
      setForm({ productId: '', quantity: '', supplierId: '', note: '' });
      
      // Reload history and products
      const hRes = await stockService.getHistory('import');
      setHistory(hRes);
      const pRes = await productService.getAll({ limit: 100, page: 1 });
      setProducts(pRes.data);
    } catch (e: unknown) {
      toast((e as Error).message || 'Lỗi khi nhập kho', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Nhập kho" 
        subtitle="Ghi nhận hàng hóa nhập vào kho"
        breadcrumb={['Kho hàng', 'Nhập kho']}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ArrowDownToLine size={16} className="text-green-600" />
            Phiếu nhập kho
          </h2>
          <FormField label="Sản phẩm" required>
            <select 
              className="input" 
              value={form.productId} 
              onChange={e => set('productId', e.target.value)}
            >
              <option value="">-- Chọn sản phẩm --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} (Tồn: {p.stock})
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Số lượng nhập" required>
            <input 
              type="number" 
              min="1" 
              className="input" 
              value={form.quantity}
              onChange={e => set('quantity', e.target.value)} 
              placeholder="0" 
            />
          </FormField>
          <FormField label="Nhà cung cấp">
            <select 
              className="input" 
              value={form.supplierId} 
              onChange={e => set('supplierId', e.target.value)}
            >
              <option value="">-- Chọn nhà cung cấp --</option>
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Ghi chú">
            <textarea 
              className="input resize-none h-20" 
              value={form.note}
              onChange={e => set('note', e.target.value)} 
              placeholder="Ghi chú nhập kho..." 
            />
          </FormField>
          <button 
            className="btn btn-primary w-full justify-center text-sm font-medium py-2.5" 
            onClick={submit} 
            disabled={saving}
          >
            <CheckCircle size={16} className="mr-2" />
            {saving ? 'Đang lưu...' : 'Xác nhận nhập kho'}
          </button>
        </div>

        {/* History */}
        <div className="lg:col-span-2 card">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white">Lịch sử nhập kho</h2>
          </div>
          {loadingHistory ? (
            <Loading />
          ) : (
            <Table headers={['Sản phẩm', 'Số lượng', 'Nhà cung cấp', 'Ghi chú', 'Ngày nhập']}>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    Chưa có lịch sử nhập kho
                  </td>
                </tr>
              ) : (
                history.map(h => (
                  <tr key={h.id} className="table-row">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{h.productName}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="badge badge-green">+{h.quantity}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-500">{h.supplierName || '—'}</td>
                    <td className="px-4 py-3 text-right text-sm text-gray-500">{h.note || '—'}</td>
                    <td className="px-4 py-3 text-right text-sm text-gray-500">{formatDate(h.createdAt)}</td>
                  </tr>
                ))
              )}
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
