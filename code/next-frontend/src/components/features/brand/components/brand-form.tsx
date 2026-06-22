'use client';

import React, { useState } from 'react';
import { FormField } from '@/components/base';
import { brandService } from '@/services';
import { toast } from '@/components/base';
import { Brand } from '@/types';

interface BrandFormProps {
  item: Brand | null;
  onSave: () => void;
  onClose: () => void;
}

export default function BrandForm({ item, onSave, onClose }: BrandFormProps) {
  const [form, setForm] = useState({
    name: item?.name || '',
    description: item?.description || '',
  });
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!form.name.trim()) return toast('Tên thương hiệu là bắt buộc', 'error');
    setSaving(true);
    try {
      if (item?.id) {
        await brandService.update(item.id, form);
      } else {
        await brandService.create(form);
      }
      toast(item?.id ? 'Đã cập nhật thương hiệu' : 'Đã thêm thương hiệu');
      onSave();
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Đã có lỗi xảy ra', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <FormField label="Tên thương hiệu" required>
        <input 
          className="input" 
          value={form.name} 
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
          placeholder="VD: Apple" 
        />
      </FormField>
      <FormField label="Mô tả">
        <textarea 
          className="input resize-none h-20" 
          value={form.description} 
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
          placeholder="Mô tả thương hiệu..."
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
