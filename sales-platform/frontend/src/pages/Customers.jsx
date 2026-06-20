// pages/Customers.jsx — eManage customer management
import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Users, Star } from 'lucide-react';
import { customersApi } from '../services/api';
import { PageHeader, SearchBar, Table, Modal, Loading, EmptyState, FormField, ConfirmDialog, toast } from '../components/shared';

function CustomerForm({ item, onSave, onClose }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', ...item });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = async () => {
    if (!form.name || !form.phone) return toast('Tên và số điện thoại là bắt buộc', 'error');
    setSaving(true);
    try {
      if (item?.id) await customersApi.update(item.id, form);
      else await customersApi.create(form);
      toast(item?.id ? 'Đã cập nhật khách hàng' : 'Đã thêm khách hàng');
      onSave();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Họ tên" required>
          <input className="input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Văn A" />
        </FormField>
        <FormField label="Số điện thoại" required>
          <input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901234567" />
        </FormField>
        <FormField label="Email">
          <input type="email" className="input" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
        </FormField>
        <FormField label="Địa chỉ">
          <input className="input" value={form.address} onChange={e => set('address', e.target.value)} placeholder="Địa chỉ" />
        </FormField>
      </div>
      <div className="flex gap-2 justify-end mt-2">
        <button className="btn btn-secondary text-sm" onClick={onClose}>Hủy</button>
        <button className="btn btn-primary text-sm" onClick={submit} disabled={saving}>{saving ? 'Đang lưu...' : (item?.id ? 'Cập nhật' : 'Thêm khách hàng')}</button>
      </div>
    </div>
  );
}

export default function Customers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await customersApi.getAll(search)); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <PageHeader title="Khách hàng" subtitle={`${items.length} khách hàng`}
        actions={<>
          <SearchBar value={search} onChange={setSearch} placeholder="Tìm theo tên, SĐT..." />
          <button className="btn btn-primary text-sm" onClick={() => setModal('create')}><Plus size={16} />Thêm khách hàng</button>
        </>}
      />
      <div className="card">
        {loading ? <Loading /> : (
          <Table headers={['Khách hàng', 'Số điện thoại', 'Email', 'Địa chỉ', 'Điểm tích lũy', 'Thao tác']}>
            {items.length === 0 ? (
              <tr><td colSpan={6}><EmptyState message="Không có khách hàng nào" icon={Users} /></td></tr>
            ) : items.map(item => (
              <tr key={item.id} className="table-row">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">{item.name}</p>
                      <p className="text-xs text-gray-400 font-mono">{item.code}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-sm">{item.phone}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-500">{item.email || '—'}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-500 max-w-[150px] truncate">{item.address || '—'}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold">{item.points?.toLocaleString('vi-VN')}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-600" onClick={() => setModal(item)}><Edit2 size={14} /></button>
                    <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500" onClick={() => setDeleteTarget(item)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </div>
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'create' ? 'Thêm khách hàng' : 'Chỉnh sửa khách hàng'} size="lg">
        <CustomerForm item={modal !== 'create' ? modal : null} onSave={() => { setModal(null); load(); }} onClose={() => setModal(null)} />
      </Modal>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { await customersApi.delete(deleteTarget.id); toast('Đã xóa khách hàng'); load(); }}
        title="Xóa khách hàng" message={`Xóa khách hàng "${deleteTarget?.name}"?`} />
    </div>
  );
}
