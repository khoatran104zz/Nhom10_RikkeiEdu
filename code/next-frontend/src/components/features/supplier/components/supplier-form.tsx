'use client';

import React, { useState } from 'react';
import { FormField } from '@/components/base';
import { supplierService } from '@/services';
import { toast } from '@/components/base';
import { Supplier } from '@/types';

interface SupplierFormProps {
  item: Supplier | null;
  onSave: () => void;
  onClose: () => void;
}

export default function SupplierForm({ item, onSave, onClose }: SupplierFormProps) {
  const [form, setForm] = useState({
    name: item?.name || '',
    phone: item?.phone || '',
    email: item?.email || '',
    address: item?.address || '',
  });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name.trim()) return toast('Tên nhà cung cấp là bắt buộc', 'error');
    setSaving(true);
    try {
      if (item?.id) {
        await supplierService.update(item.id, form);
      } else {
        await supplierService.create(form);
      }
      toast(item?.id ? 'Đã cập nhật nhà cung cấp' : 'Đã thêm nhà cung cấp');
      onSave();
    } catch (e: unknown) {
      toast((e as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <FormField label="Tên nhà cung cấp" required>
        <input 
          className="input" 
          value={form.name} 
          onChange={e => set('name', e.target.value)} 
          placeholder="Công ty ABC" 
        />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Số điện thoại">
          <input 
            className="input" 
            value={form.phone} 
            onChange={e => set('phone', e.target.value)} 
            placeholder="028 1234 5678" 
          />
        </FormField>
        <FormField label="Email">
          <input 
            type="email" 
            className="input" 
            value={form.email} 
            onChange={e => set('email', e.target.value)} 
            placeholder="contact@company.com" 
          />
        </FormField>
      </div>
      <FormField label="Địa chỉ">
        <input 
          className="input" 
          value={form.address} 
          onChange={e => set('address', e.target.value)} 
          placeholder="Địa chỉ" 
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
