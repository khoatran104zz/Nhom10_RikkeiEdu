'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, UserCog } from 'lucide-react';
import { employeeService } from '@/services';
import { PageHeader, SearchBar, Table, Modal, Loading, EmptyState, ConfirmDialog, Permission, toast } from '@/components/base';
import EmployeeForm from './employee-form';
import { Employee } from '@/types';

const roleColors: Record<string, string> = {
  'Quản lý': 'badge-blue',
  'Nhân viên bán hàng': 'badge-green',
  'Thủ kho': 'badge-yellow',
  'Kế toán': 'badge-purple',
  'Nhân viên hỗ trợ': 'badge-teal',
};

export default function EmployeeTable() {
  const [items, setItems] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<Employee | 'create' | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { 
      const data = await employeeService.getAll(search);
      setItems(data); 
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Đã có lỗi xảy ra', 'error');
    } finally { 
      setLoading(false); 
    }
  }, [search]);

  useEffect(() => { 
    load(); 
  }, [load]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await employeeService.delete(deleteTarget.id);
      toast('Đã xóa nhân viên');
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Đã có lỗi xảy ra', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Nhân viên" 
        subtitle={`${items.length} nhân viên`}
        breadcrumb={['Nhân sự', 'Danh sách']}
        actions={
          <>
            <SearchBar value={search} onChange={setSearch} />
            <Permission roles={['ADMIN', 'BRANCH_MANAGER']}>
              <button className="btn btn-primary text-sm" onClick={() => setModal('create')}>
                <Plus size={16} />Thêm nhân viên
              </button>
            </Permission>
          </>
        }
      />
      <div className="card">
        {loading ? (
          <Loading />
        ) : (
          <Table headers={['Nhân viên', 'Chức vụ', 'Số điện thoại', 'Email', 'Thao tác']}>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <EmptyState message="Không có nhân viên nào" icon={UserCog} />
                </td>
              </tr>
            ) : (
              items.map(item => (
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
                  <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">{item.phone || '—'}</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-550">{item.email || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Permission roles={['ADMIN', 'BRANCH_MANAGER']}>
                        <button 
                          className="p-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-600" 
                          onClick={() => setModal(item)}
                        >
                          <Edit2 size={14} />
                        </button>
                      </Permission>
                      <Permission roles={['ADMIN', 'BRANCH_MANAGER']}>
                        <button 
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500" 
                          onClick={() => setDeleteTarget(item)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </Permission>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </Table>
        )}
      </div>

      <Modal 
        open={!!modal} 
        onClose={() => setModal(null)} 
        title={modal === 'create' ? 'Thêm nhân viên' : 'Chỉnh sửa nhân viên'} 
        size="lg"
      >
        <EmployeeForm 
          item={modal !== 'create' ? modal : null} 
          onSave={() => { setModal(null); load(); }} 
          onClose={() => setModal(null)} 
        />
      </Modal>

      <ConfirmDialog 
        open={!!deleteTarget} 
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Xóa nhân viên" 
        message={`Xóa nhân viên "${deleteTarget?.name}"?`} 
      />
    </div>
  );
}
