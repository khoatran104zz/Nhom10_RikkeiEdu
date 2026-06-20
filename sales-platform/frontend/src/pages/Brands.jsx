// pages/Brands.jsx — eManage brand management
import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Award } from 'lucide-react';
import { brandsApi } from '../services/api';
import { formatDate } from '../utils/format';
import { PageHeader, SearchBar, Table, Modal, Loading, EmptyState, FormField, ConfirmDialog, toast } from '../components/shared';

function BrandForm({ item, onSave, onClose }) {
  const [form, setForm] = useState({ name: '', description: '', ...item });
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    if (!form.name) return toast('Tên thương hiệu là bắt buộc', 'error');
    setSaving(true);
    try {
      if (item?.id) await brandsApi.update(item.id, form);
      else await brandsApi.create(form);
      toast(item?.id ? 'Đã cập nhật thương hiệu' : 'Đã thêm thương hiệu');
      onSave();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };
  return (
    <div>
      <FormField label="Tên thương hiệu" required>
        <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="VD: Apple" />
      </FormField>
      <FormField label="Mô tả">
        <textarea className="input resize-none h-20" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
      </FormField>
      <div className="flex gap-2 justify-end mt-2">
        <button className="btn btn-secondary text-sm" onClick={onClose}>Hủy</button>
        <button className="btn btn-primary text-sm" onClick={submit} disabled={saving}>{saving ? 'Đang lưu...' : (item?.id ? 'Cập nhật' : 'Thêm')}</button>
      </div>
    </div>
  );
}

export default function Brands() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await brandsApi.getAll(search)); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <PageHeader title="Thương hiệu" subtitle={`${items.length} thương hiệu`} breadcrumb={['Sản phẩm', 'Thương hiệu']}
        actions={<>
          <SearchBar value={search} onChange={setSearch} />
          <button className="btn btn-primary text-sm" onClick={() => setModal('create')}><Plus size={16} />Thêm thương hiệu</button>
        </>}
      />
      <div className="card">
        {loading ? <Loading /> : (
          <Table headers={['Thương hiệu', 'Mô tả', 'Ngày tạo', 'Thao tác']}>
            {items.length === 0 ? (
              <tr><td colSpan={4}><EmptyState message="Không có thương hiệu nào" icon={Award} /></td></tr>
            ) : items.map(item => (
              <tr key={item.id} className="table-row">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center shrink-0">
                      <Award size={14} className="text-purple-500" />
                    </div>
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">{item.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-500">{item.description || '—'}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-400">{formatDate(item.createdAt)}</td>
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
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'create' ? 'Thêm thương hiệu' : 'Chỉnh sửa thương hiệu'}>
        <BrandForm item={modal !== 'create' ? modal : null} onSave={() => { setModal(null); load(); }} onClose={() => setModal(null)} />
      </Modal>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { await brandsApi.delete(deleteTarget.id); toast('Đã xóa thương hiệu'); load(); }}
        title="Xóa thương hiệu" message={`Xóa thương hiệu "${deleteTarget?.name}"?`} />
    </div>
  );
}
