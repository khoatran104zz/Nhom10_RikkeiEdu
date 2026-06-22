'use client';

import React, { useState } from 'react';
import { FormField } from '@/components/base';
import { customerService } from '@/services';
import { toast } from '@/components/base';
import { Customer } from '@/types';

interface CustomerFormProps {
  item: Customer | null;
  onSave: () => void;
  onClose: () => void;
}

export default function CustomerForm({ item, onSave, onClose }: CustomerFormProps) {
  const [form, setForm] = useState({
    name: item?.name || '',
    phone: item?.phone || '',
    email: item?.email || '',
    address: item?.address || '',
  });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      return toast('Tên và số điện thoại là bắt buộc', 'error');
    }
    setSaving(true);
    try {
      if (item?.id) {
        await customerService.update(item.id, form);
      } else {
        await customerService.create(form);
      }
      toast(item?.id ? 'Đã cập nhật khách hàng' : 'Đã thêm khách hàng');
      onSave();
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Đã có lỗi xảy ra', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Họ tên" required>
          <input 
            className="input" 
            value={form.name} 
            onChange={e => set('name', e.target.value)} 
            placeholder="Nguyễn Văn A" 
          />
        </FormField>
        <FormField label="Số điện thoại" required>
          <input 
            className="input" 
            value={form.phone} 
            onChange={e => set('phone', e.target.value)} 
            placeholder="0901234567" 
          />
        </FormField>
        <FormField label="Email">
          <input 
            type="email" 
            className="input" 
            value={form.email} 
            onChange={e => set('email', e.target.value)} 
            placeholder="email@example.com" 
          />
        </FormField>
        <FormField label="Địa chỉ">
          <input 
            className="input" 
            value={form.address} 
            onChange={e => set('address', e.target.value)} 
            placeholder="Địa chỉ" 
          />
        </FormField>
      </div>
      <div className="flex gap-2 justify-end mt-2">
        <button className="btn btn-secondary text-sm" onClick={onClose}>Hủy</button>
        <button 
          className="btn btn-primary text-sm" 
          onClick={submit} 
          disabled={saving}
        >
          {saving ? 'Đang lưu...' : (item?.id ? 'Cập nhật' : 'Thêm khách hàng')}
        </button>
      </div>
    </div>
  );
}
