// pages/Employees.jsx — eManage employee management
import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, UserCog } from 'lucide-react';
import { employeesApi } from '../services/api';
import { PageHeader, SearchBar, Table, Modal, Loading, EmptyState, FormField, ConfirmDialog, toast } from '../components/shared';

const ROLES = ['Quản lý', 'Nhân viên bán hàng', 'Thủ kho', 'Kế toán', 'Nhân viên hỗ trợ'];

function EmployeeForm({ item, onSave, onClose }) {
  const [form, setForm] = useState({ name: '', role: 'Nhân viên bán hàng', phone: '', email: '', ...item });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = async () => {
    if (!form.name) return toast('Tên nhân viên là bắt buộc', 'error');
    setSaving(true);
    try {
      if (item?.id) await employeesApi.update(item.id, form);
      else await employeesApi.create(form);
      toast(item?.id ? 'Đã cập nhật nhân viên' : 'Đã thêm nhân viên');
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
        <FormField label="Chức vụ">
          <select className="input" value={form.role} onChange={e => set('role', e.target.value)}>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </FormField>
        <FormField label="Số điện thoại">
          <input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901234567" />
        </FormField>
        <FormField label="Email">
          <input type="email" className="input" value={form.email} onChange={e => set('email', e.target.value)} placeholder="nhanvien@store.com" />
        </FormField>
      </div>
      <div className="flex gap-2 justify-end mt-2">
        <button className="btn btn-secondary text-sm" onClick={onClose}>Hủy</button>
        <button className="btn btn-primary text-sm" onClick={submit} disabled={saving}>{saving ? 'Đang lưu...' : (item?.id ? 'Cập nhật' : 'Thêm nhân viên')}</button>
      </div>
    </div>
  );
}

const roleColors = {
  'Quản lý': 'badge-blue',
  'Nhân viên bán hàng': 'badge-green',
  'Thủ kho': 'badge-yellow',
  'Kế toán': 'badge-purple',
  'Nhân viên hỗ trợ': 'badge-teal',
};

export default function Employees() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await employeesApi.getAll(search)); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <PageHeader title="Nhân viên" subtitle={`${items.length} nhân viên`}
        actions={<>
          <SearchBar value={search} onChange={setSearch} />
          <button className="btn btn-primary text-sm" onClick={() => setModal('create')}><Plus size={16} />Thêm nhân viên</button>
        </>}
      />
      <div className="card">
        {loading ? <Loading /> : (
          <Table headers={['Nhân viên', 'Chức vụ', 'Số điện thoại', 'Email', 'Thao tác']}>
            {items.length === 0 ? (
              <tr><td colSpan={5}><EmptyState message="Không có nhân viên nào" icon={UserCog} /></td></tr>
            ) : items.map(item => (
              <tr key={item.id} className="table-row">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-primary-500 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
                      {item.name.charAt(0)}
                    </div>
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">{item.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={`badge ${roleColors[item.role] || 'badge-blue'}`}>{item.role}</span>
                </td>
                <td className="px-4 py-3 text-right text-sm">{item.phone || '—'}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-500">{item.email || '—'}</td>
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
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'create' ? 'Thêm nhân viên' : 'Chỉnh sửa nhân viên'} size="lg">
        <EmployeeForm item={modal !== 'create' ? modal : null} onSave={() => { setModal(null); load(); }} onClose={() => setModal(null)} />
      </Modal>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { await employeesApi.delete(deleteTarget.id); toast('Đã xóa nhân viên'); load(); }}
        title="Xóa nhân viên" message={`Xóa nhân viên "${deleteTarget?.name}"?`} />
    </div>
  );
}
