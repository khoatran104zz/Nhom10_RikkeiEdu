'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Award } from 'lucide-react';
import { brandService } from '@/services';
import { formatDate } from '@/utils/format';
import { PageHeader, SearchBar, Table, Modal, Loading, EmptyState, ConfirmDialog, toast } from '@/components/base';
import BrandForm from './brand-form';
import { Brand } from '@/types';

export default function BrandTable() {
  const [items, setItems] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<Brand | 'create' | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { 
      const data = await brandService.getAll(search);
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
      await brandService.delete(deleteTarget.id);
      toast('Đã xóa thương hiệu');
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
        title="Thương hiệu" 
        subtitle={`${items.length} thương hiệu`} 
        breadcrumb={['Sản phẩm', 'Thương hiệu']}
        actions={
          <>
            <SearchBar value={search} onChange={setSearch} />
            <button className="btn btn-primary text-sm" onClick={() => setModal('create')}>
              <Plus size={16} />Thêm thương hiệu
            </button>
          </>
        }
      />
      
      <div className="card">
        {loading ? (
          <Loading />
        ) : (
          <Table headers={['Thương hiệu', 'Mô tả', 'Ngày tạo', 'Thao tác']}>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <EmptyState message="Không có thương hiệu nào" icon={Award} />
                </td>
              </tr>
            ) : (
              items.map(item => (
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
        title={modal === 'create' ? 'Thêm thương hiệu' : 'Chỉnh sửa thương hiệu'}
      >
        <BrandForm 
          item={modal !== 'create' ? modal : null} 
          onSave={() => { setModal(null); load(); }} 
          onClose={() => setModal(null)} 
        />
      </Modal>
      
      <ConfirmDialog 
        open={!!deleteTarget} 
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Xóa thương hiệu" 
        message={`Xóa thương hiệu "${deleteTarget?.name}"?`} 
      />
    </div>
  );
}
