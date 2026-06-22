'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Building2 } from 'lucide-react';
import { supplierService } from '@/services';
import { PageHeader, SearchBar, Table, Modal, Loading, EmptyState, ConfirmDialog, toast } from '@/components/base';
import SupplierForm from './supplier-form';
import { Supplier } from '@/types';

export default function SupplierTable() {
  const [items, setItems] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<Supplier | 'create' | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { 
      const data = await supplierService.getAll(search);
      setItems(data); 
    } catch (e: unknown) {
      toast((e as Error).message, 'error');
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
      await supplierService.delete(deleteTarget.id);
      toast('Đã xóa nhà cung cấp');
      load();
    } catch (e: unknown) {
      toast((e as Error).message, 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Nhà cung cấp" 
        subtitle={`${items.length} nhà cung cấp`}
        breadcrumb={['Đối tác', 'Nhà cung cấp']}
        actions={
          <>
            <SearchBar value={search} onChange={setSearch} />
            <button className="btn btn-primary text-sm" onClick={() => setModal('create')}>
              <Plus size={16} />Thêm nhà cung cấp
            </button>
          </>
        }
      />
      <div className="card">
        {loading ? (
          <Loading />
        ) : (
          <Table headers={['Nhà cung cấp', 'Số điện thoại', 'Email', 'Địa chỉ', 'Thao tác']}>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <EmptyState message="Không có nhà cung cấp nào" icon={Building2} />
                </td>
              </tr>
            ) : (
              items.map(item => (
                <tr key={item.id} className="table-row">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center shrink-0">
                        <Building2 size={16} className="text-rose-500" />
                      </div>
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">{item.phone || '—'}</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-550">{item.email || '—'}</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-550">{item.address || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        className="p-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-600" 
                        onClick={() => setModal(item)}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500" 
                        onClick={() => setDeleteTarget(item)}
                      >
                        <Trash2 size={14} />
                      </button>
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
        title={modal === 'create' ? 'Thêm nhà cung cấp' : 'Chỉnh sửa nhà cung cấp'}
      >
        <SupplierForm 
          item={modal !== 'create' ? modal : null} 
          onSave={() => { setModal(null); load(); }} 
          onClose={() => setModal(null)} 
        />
      </Modal>

      <ConfirmDialog 
        open={!!deleteTarget} 
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Xóa nhà cung cấp" 
        message={`Xóa nhà cung cấp "${deleteTarget?.name}"?`} 
      />
    </div>
  );
}
