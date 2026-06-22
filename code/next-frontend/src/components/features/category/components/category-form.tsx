'use client';

import React, { useState } from 'react';
import { FormField } from '@/components/base';
import { categoryService } from '@/services';
import { toast } from '@/components/base';
import { Category } from '@/types';

interface CategoryFormProps {
  item: Category | null;
  onSave: () => void;
  onClose: () => void;
}

export default function CategoryForm({ item, onSave, onClose }: CategoryFormProps) {
  const [form, setForm] = useState({
    name: item?.name || '',
    description: item?.description || '',
  });
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!form.name.trim()) return toast('Tên danh mục là bắt buộc', 'error');
    setSaving(true);
    try {
      if (item?.id) {
        await categoryService.update(item.id, form);
      } else {
        await categoryService.create(form);
      }
      toast(item?.id ? 'Đã cập nhật danh mục' : 'Đã thêm danh mục');
      onSave();
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Đã có lỗi xảy ra', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <FormField label="Tên danh mục" required>
        <input 
          className="input" 
          value={form.name} 
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
          placeholder="VD: Điện thoại" 
        />
      </FormField>
      <FormField label="Mô tả">
        <textarea 
          className="input resize-none h-20" 
          value={form.description} 
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
          placeholder="Mô tả danh mục..."
        />
      </FormField>
      <div className="flex gap-2 justify-end mt-2">
        <button className="btn btn-secondary text-sm" onClick={onClose}>Hủy</button>
        <button 
          className="btn btn-primary text-sm" 
          onClick={submit} 
          disabled={saving}
        >
          {saving ? 'Đang lưu...' : (item?.id ? 'Cập nhật' : 'Thêm')}
        </button>
      </div>
    </div>
  );
}
