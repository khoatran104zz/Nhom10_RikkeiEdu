// pages/Products.jsx — eManage product management
import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import { productsApi, categoriesApi, brandsApi } from '../services/api';
import { formatCurrency } from '../utils/format';
import { PageHeader, SearchBar, Table, Pagination, Modal, Loading, EmptyState, FormField, ConfirmDialog, toast } from '../components/shared';

function ProductForm({ product, categories, brands, onSave, onClose }) {
  const [form, setForm] = useState({
    sku: '', name: '', categoryId: '', brandId: '',
    costPrice: '', salePrice: '', stock: '', image: '', description: '',
    ...product
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name || !form.sku) return toast('Vui lòng điền SKU và tên sản phẩm', 'error');
    setSaving(true);
    try {
      if (product?.id) await productsApi.update(product.id, form);
      else await productsApi.create(form);
      toast(product?.id ? 'Đã cập nhật sản phẩm' : 'Đã thêm sản phẩm');
      onSave();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="SKU" required>
          <input className="input" value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="VD: IP15-256GB" />
        </FormField>
        <FormField label="Tên sản phẩm" required>
          <input className="input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Tên sản phẩm" />
        </FormField>
        <FormField label="Danh mục">
          <select className="input" value={form.categoryId} onChange={e => set('categoryId', e.target.value)}>
            <option value="">-- Chọn danh mục --</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </FormField>
        <FormField label="Thương hiệu">
          <select className="input" value={form.brandId} onChange={e => set('brandId', e.target.value)}>
            <option value="">-- Chọn thương hiệu --</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </FormField>
        <FormField label="Giá nhập (VND)">
          <input type="number" className="input" value={form.costPrice} onChange={e => set('costPrice', e.target.value)} placeholder="0" />
        </FormField>
        <FormField label="Giá bán (VND)">
          <input type="number" className="input" value={form.salePrice} onChange={e => set('salePrice', e.target.value)} placeholder="0" />
        </FormField>
        <FormField label="Tồn kho">
          <input type="number" className="input" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="0" />
        </FormField>
        <FormField label="URL Hình ảnh">
          <input className="input" value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." />
        </FormField>
      </div>
      <FormField label="Mô tả">
        <textarea className="input resize-none h-20" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả sản phẩm..." />
      </FormField>
      <div className="flex gap-2 justify-end mt-2">
        <button className="btn btn-secondary text-sm" onClick={onClose}>Hủy</button>
        <button className="btn btn-primary text-sm" onClick={submit} disabled={saving}>
          {saving ? 'Đang lưu...' : (product?.id ? 'Cập nhật' : 'Thêm sản phẩm')}
        </button>
      </div>
    </div>
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [res, cats, brs] = await Promise.all([
        productsApi.getAll({ search, page, limit: 10 }),
        categoriesApi.getAll(),
        brandsApi.getAll(),
      ]);
      setProducts(res.data);
      setTotalPages(res.totalPages);
      setTotal(res.total);
      setCategories(cats);
      setBrands(brs);
    } finally { setLoading(false); }
  }, [search, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search]);

  const handleDelete = async () => {
    try {
      await productsApi.delete(deleteTarget.id);
      toast('Đã xóa sản phẩm');
      load();
    } catch (e) { toast(e.message, 'error'); }
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
            <button className="btn btn-primary text-sm" onClick={() => setModal('create')}>
              <Plus size={16} /> Thêm sản phẩm
            </button>
          </>
        }
      />

      <div className="card">
        {loading ? <Loading /> : (
          <>
            <Table headers={['Sản phẩm', 'Danh mục', 'Thương hiệu', 'Giá bán', 'Tồn kho', 'Thao tác']}>
              {products.length === 0 ? (
                <tr><td colSpan={6}><EmptyState message="Không có sản phẩm nào" icon={Package} /></td></tr>
              ) : products.map(p => (
                <tr key={p.id} className="table-row">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-surface-100 dark:bg-gray-800 shrink-0 ring-1 ring-gray-100 dark:ring-gray-700">
                        {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" onError={e => e.target.style.display='none'} /> : <Package size={18} className="m-2.5 text-gray-300" />}
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
                      <button className="p-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-600" onClick={() => setModal(p)}>
                        <Edit2 size={14} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500" onClick={() => setDeleteTarget(p)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'create' ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'} size="lg">
        <ProductForm
          product={modal !== 'create' ? modal : null}
          categories={categories} brands={brands}
          onSave={() => { setModal(null); load(); }}
          onClose={() => setModal(null)}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Xóa sản phẩm"
        message={`Bạn có chắc muốn xóa sản phẩm "${deleteTarget?.name}"?`}
      />
    </div>
  );
}
