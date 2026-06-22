'use client';

import React, { useState } from 'react';
import { FormField } from '@/components/base';
import { productService } from '@/services';
import { toast } from '@/components/base';
import { Product, Category, Brand } from '@/types';

interface ProductFormProps {
  product: Product | null;
  categories: Category[];
  brands: Brand[];
  onSave: () => void;
  onClose: () => void;
}

export default function ProductForm({ product, categories, brands, onSave, onClose }: ProductFormProps) {
  const [form, setForm] = useState({
    sku: product?.sku || '',
    name: product?.name || '',
    categoryId: product?.categoryId ? String(product.categoryId) : '',
    brandId: product?.brandId ? String(product.brandId) : '',
    costPrice: product?.costPrice ? String(product.costPrice) : '',
    salePrice: product?.salePrice ? String(product.salePrice) : '',
    stock: product?.stock ? String(product.stock) : '',
    image: product?.image || '',
    description: product?.description || '',
  });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name.trim() || !form.sku.trim()) {
      return toast('Vui lòng điền SKU và tên sản phẩm', 'error');
    }
    
    // Convert string inputs to proper types for API payload
    const payload = {
      ...form,
      categoryId: form.categoryId ? Number(form.categoryId) : null,
      brandId: form.brandId ? Number(form.brandId) : null,
      costPrice: form.costPrice ? Number(form.costPrice) : 0,
      salePrice: form.salePrice ? Number(form.salePrice) : 0,
      stock: form.stock ? Number(form.stock) : 0,
    };

    setSaving(true);
    try {
      if (product?.id) {
        await productService.update(product.id, payload);
      } else {
        await productService.create(payload);
      }
      toast(product?.id ? 'Đã cập nhật sản phẩm' : 'Đã thêm sản phẩm');
      onSave();
    } catch (e: unknown) {
      toast((e as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="SKU" required>
          <input 
            className="input" 
            value={form.sku} 
            onChange={e => set('sku', e.target.value)} 
            placeholder="VD: IP15-256GB" 
          />
        </FormField>
        <FormField label="Tên sản phẩm" required>
          <input 
            className="input" 
            value={form.name} 
            onChange={e => set('name', e.target.value)} 
            placeholder="Tên sản phẩm" 
          />
        </FormField>
        <FormField label="Danh mục">
          <select 
            className="input" 
            value={form.categoryId} 
            onChange={e => set('categoryId', e.target.value)}
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </FormField>
        <FormField label="Thương hiệu">
          <select 
            className="input" 
            value={form.brandId} 
            onChange={e => set('brandId', e.target.value)}
          >
            <option value="">-- Chọn thương hiệu --</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </FormField>
        <FormField label="Giá nhập (VND)">
          <input 
            type="number" 
            className="input" 
            value={form.costPrice} 
            onChange={e => set('costPrice', e.target.value)} 
            placeholder="0" 
          />
        </FormField>
        <FormField label="Giá bán (VND)">
          <input 
            type="number" 
            className="input" 
            value={form.salePrice} 
            onChange={e => set('salePrice', e.target.value)} 
            placeholder="0" 
          />
        </FormField>
        <FormField label="Tồn kho">
          <input 
            type="number" 
            className="input" 
            value={form.stock} 
            onChange={e => set('stock', e.target.value)} 
            placeholder="0" 
          />
        </FormField>
        <FormField label="URL Hình ảnh">
          <input 
            className="input" 
            value={form.image} 
            onChange={e => set('image', e.target.value)} 
            placeholder="https://..." 
          />
        </FormField>
      </div>
      <FormField label="Mô tả">
        <textarea 
          className="input resize-none h-20" 
          value={form.description} 
          onChange={e => set('description', e.target.value)} 
          placeholder="Mô tả sản phẩm..." 
        />
      </FormField>
      <div className="flex gap-2 justify-end mt-2">
        <button className="btn btn-secondary text-sm" onClick={onClose}>Hủy</button>
        <button 
          className="btn btn-primary text-sm" 
          onClick={submit} 
          disabled={saving}
        >
          {saving ? 'Đang lưu...' : (product?.id ? 'Cập nhật' : 'Thêm sản phẩm')}
        </button>
      </div>
    </div>
  );
}
