'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Users, Star } from 'lucide-react';
import { customerService } from '@/services';
import { PageHeader, SearchBar, Table, Modal, Loading, EmptyState, ConfirmDialog, Permission, toast } from '@/components/base';
import CustomerForm from './customer-form';
import { Customer } from '@/types';

export default function CustomerTable() {
  const [items, setItems] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<Customer | 'create' | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { 
      const data = await customerService.getAll(search);
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
      await customerService.delete(deleteTarget.id);
      toast('Đã xóa khách hàng');
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
        title="Khách hàng" 
        subtitle={`${items.length} khách hàng`}
        breadcrumb={['Khách hàng', 'Danh sách']}
        actions={
          <>
            <SearchBar value={search} onChange={setSearch} placeholder="Tìm theo tên, SĐT..." />
            <Permission roles={['ADMIN', 'BRANCH_MANAGER']}>
              <button className="btn btn-primary text-sm" onClick={() => setModal('create')}>
                <Plus size={16} />Thêm khách hàng
              </button>
            </Permission>
          </>
        }
      />
      <div className="card">
        {loading ? (
          <Loading />
        ) : (
          <Table headers={['Khách hàng', 'Số điện thoại', 'Email', 'Địa chỉ', 'Điểm tích lũy', 'Thao tác']}>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState message="Không có khách hàng nào" icon={Users} />
                </td>
              </tr>
            ) : (
              items.map(item => (
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
                  <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">{item.phone}</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-550">{item.email || '—'}</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-550 max-w-[150px] truncate">{item.address || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{item.points?.toLocaleString('vi-VN')}</span>
                    </div>
                  </td>
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
        title={modal === 'create' ? 'Thêm khách hàng' : 'Chỉnh sửa khách hàng'} 
        size="lg"
      >
        <CustomerForm 
          item={modal !== 'create' ? modal : null} 
          onSave={() => { setModal(null); load(); }} 
          onClose={() => setModal(null)} 
        />
      </Modal>

      <ConfirmDialog 
        open={!!deleteTarget} 
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Xóa khách hàng" 
        message={`Xóa khách hàng "${deleteTarget?.name}"?`} 
      />
    </div>
  );
}
