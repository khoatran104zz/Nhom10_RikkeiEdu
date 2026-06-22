'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
import { categoryService } from '@/services';
import { formatDate } from '@/utils/format';
import { PageHeader, SearchBar, Table, Modal, Loading, EmptyState, ConfirmDialog, toast } from '@/components/base';
import CategoryForm from './category-form';
import { Category } from '@/types';

export default function CategoryTable() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<Category | 'create' | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { 
      const data = await categoryService.getAll(search);
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
      await categoryService.delete(deleteTarget.id);
      toast('Đã xóa danh mục');
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
        title="Danh mục sản phẩm" 
        subtitle={`${items.length} danh mục`} 
        breadcrumb={['Sản phẩm', 'Danh mục']}
        actions={
          <>
            <SearchBar value={search} onChange={setSearch} />
            <button className="btn btn-primary text-sm" onClick={() => setModal('create')}>
              <Plus size={16} />Thêm danh mục
            </button>
          </>
        }
      />
      
      <div className="card">
        {loading ? (
          <Loading />
        ) : (
          <Table headers={['Tên danh mục', 'Mô tả', 'Ngày tạo', 'Thao tác']}>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <EmptyState message="Không có danh mục nào" icon={Tag} />
                </td>
              </tr>
            ) : (
              items.map(item => (
                <tr key={item.id} className="table-row">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center shrink-0">
                        <Tag size={14} className="text-primary-600" />
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
        title={modal === 'create' ? 'Thêm danh mục' : 'Chỉnh sửa danh mục'}
      >
        <CategoryForm 
          item={modal !== 'create' ? modal : null} 
          onSave={() => { setModal(null); load(); }} 
          onClose={() => setModal(null)} 
        />
      </Modal>
      
      <ConfirmDialog 
        open={!!deleteTarget} 
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Xóa danh mục" 
        message={`Xóa danh mục "${deleteTarget?.name}"?`} 
      />
    </div>
  );
}
