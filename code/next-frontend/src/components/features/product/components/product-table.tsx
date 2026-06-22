'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import { productService, categoryService, brandService } from '@/services';
import { formatCurrency } from '@/utils/format';
import { PageHeader, SearchBar, Table, Pagination, Modal, Loading, EmptyState, ConfirmDialog, Permission, toast } from '@/components/base';
import ProductForm from './product-form';
import { Product, Category, Brand } from '@/types';

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [modal, setModal] = useState<Product | 'create' | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [res, cats, brs] = await Promise.all([
        productService.getAll({ search, page, limit: 10 }),
        categoryService.getAll(),
        brandService.getAll(),
      ]);
      setProducts(res.data);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);
      setCategories(cats);
      setBrands(brs);
    } catch (e: unknown) {
      toast((e as Error).message, 'error');
    } finally { 
      setLoading(false); 
    }
  }, [search, page]);

  useEffect(() => { 
    load(); 
  }, [load]);

  useEffect(() => { 
    setPage(1); 
  }, [search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await productService.delete(deleteTarget.id);
      toast('Đã xóa sản phẩm');
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
        title="Danh sách sản phẩm"
        subtitle={`${total} sản phẩm trong hệ thống`}
        breadcrumb={['Sản phẩm', 'Danh sách']}
        actions={
          <>
            <SearchBar value={search} onChange={setSearch} placeholder="Tìm theo tên, SKU..." />
            <Permission roles={['ADMIN', 'BRANCH_MANAGER']}>
              <button className="btn btn-primary text-sm" onClick={() => setModal('create')}>
                <Plus size={16} /> Thêm sản phẩm
              </button>
            </Permission>
          </>
        }
      />

      <div className="card">
        {loading ? (
          <Loading />
        ) : (
          <>
            <Table headers={['Sản phẩm', 'Danh mục', 'Thương hiệu', 'Giá bán', 'Tồn kho', 'Thao tác']}>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState message="Không có sản phẩm nào" icon={Package} />
                  </td>
                </tr>
              ) : (
                products.map(p => (
                  <tr key={p.id} className="table-row">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-surface-100 dark:bg-gray-800 shrink-0 ring-1 ring-gray-100 dark:ring-gray-700">
                          {p.image ? (
                            <img 
                              src={p.image} 
                              alt={p.name} 
                              className="w-full h-full object-cover" 
                              onError={e => { (e.target as HTMLElement).style.display = 'none'; }} 
                            />
                          ) : (
                            <Package size={18} className="m-2.5 text-gray-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{p.name}</p>
                          <p className="text-xs text-gray-400 font-mono">SKU: {p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-500 dark:text-gray-400">{p.categoryName || '—'}</td>
                    <td className="px-4 py-3 text-right text-sm text-gray-500 dark:text-gray-400">{p.brandName || '—'}</td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(p.salePrice)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`badge ${p.stock === 0 ? 'badge-red' : p.stock < 10 ? 'badge-yellow' : 'badge-green'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Permission roles={['ADMIN', 'BRANCH_MANAGER']}>
                          <button 
                            className="p-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-600" 
                            onClick={() => setModal(p)}
                          >
                            <Edit2 size={14} />
                          </button>
                        </Permission>
                        <Permission roles={['ADMIN', 'BRANCH_MANAGER']}>
                          <button 
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500" 
                            onClick={() => setDeleteTarget(p)}
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
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>

      <Modal 
        open={!!modal} 
        onClose={() => setModal(null)} 
        title={modal === 'create' ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'} 
        size="lg"
      >
        <ProductForm
          product={modal !== 'create' ? modal : null}
          categories={categories} 
          brands={brands}
          onSave={() => { setModal(null); load(); }}
          onClose={() => setModal(null)}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget} 
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Xóa sản phẩm"
        message={`Bạn có chắc muốn xóa sản phẩm "${deleteTarget?.name}"?`}
      />
    </div>
  );
}
