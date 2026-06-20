// pages/Suppliers.jsx — eManage supplier management
import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Building2 } from 'lucide-react';
import { suppliersApi } from '../services/api';
import { PageHeader, SearchBar, Table, Modal, Loading, EmptyState, FormField, ConfirmDialog, toast } from '../components/shared';

function SupplierForm({ item, onSave, onClose }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', ...item });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = async () => {
    if (!form.name) return toast('Tên nhà cung cấp là bắt buộc', 'error');
    setSaving(true);
    try {
      if (item?.id) await suppliersApi.update(item.id, form);
      else await suppliersApi.create(form);
      toast(item?.id ? 'Đã cập nhật nhà cung cấp' : 'Đã thêm nhà cung cấp');
      onSave();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };
  return (
    <div>
      <FormField label="Tên nhà cung cấp" required>
        <input className="input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Công ty ABC" />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Số điện thoại">
          <input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="028 1234 5678" />
        </FormField>
        <FormField label="Email">
          <input type="email" className="input" value={form.email} onChange={e => set('email', e.target.value)} placeholder="contact@company.com" />
        </FormField>
      </div>
      <FormField label="Địa chỉ">
        <input className="input" value={form.address} onChange={e => set('address', e.target.value)} placeholder="Địa chỉ" />
      </FormField>
      <div className="flex gap-2 justify-end mt-2">
        <button className="btn btn-secondary text-sm" onClick={onClose}>Hủy</button>
        <button className="btn btn-primary text-sm" onClick={submit} disabled={saving}>{saving ? 'Đang lưu...' : (item?.id ? 'Cập nhật' : 'Thêm')}</button>
      </div>
    </div>
  );
}

export default function Suppliers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await suppliersApi.getAll(search)); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <PageHeader title="Nhà cung cấp" subtitle={`${items.length} nhà cung cấp`}
        actions={<>
          <SearchBar value={search} onChange={setSearch} />
          <button className="btn btn-primary text-sm" onClick={() => setModal('create')}><Plus size={16} />Thêm nhà cung cấp</button>
        </>}
      />
      <div className="card">
        {loading ? <Loading /> : (
          <Table headers={['Nhà cung cấp', 'Số điện thoại', 'Email', 'Địa chỉ', 'Thao tác']}>
            {items.length === 0 ? (
              <tr><td colSpan={5}><EmptyState message="Không có nhà cung cấp nào" icon={Building2} /></td></tr>
            ) : items.map(item => (
              <tr key={item.id} className="table-row">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center shrink-0">
                      <Building2 size={16} className="text-rose-500" />
                    </div>
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">{item.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-sm">{item.phone || '—'}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-500">{item.email || '—'}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-500">{item.address || '—'}</td>
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
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'create' ? 'Thêm nhà cung cấp' : 'Chỉnh sửa nhà cung cấp'}>
        <SupplierForm item={modal !== 'create' ? modal : null} onSave={() => { setModal(null); load(); }} onClose={() => setModal(null)} />
      </Modal>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { await suppliersApi.delete(deleteTarget.id); toast('Đã xóa nhà cung cấp'); load(); }}
        title="Xóa nhà cung cấp" message={`Xóa nhà cung cấp "${deleteTarget?.name}"?`} />
    </div>
  );
}
