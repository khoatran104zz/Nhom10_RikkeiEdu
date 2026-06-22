'use client';

import React, { useState } from 'react';
import { FormField } from '@/components/base';
import { employeeService } from '@/services';
import { toast } from '@/components/base';
import { Employee } from '@/types';

const ROLES = ['Quản lý', 'Nhân viên bán hàng', 'Thủ kho', 'Kế toán', 'Nhân viên hỗ trợ'];

interface EmployeeFormProps {
  item: Employee | null;
  onSave: () => void;
  onClose: () => void;
}

export default function EmployeeForm({ item, onSave, onClose }: EmployeeFormProps) {
  const [form, setForm] = useState({
    name: item?.name || '',
    role: item?.role || 'Nhân viên bán hàng',
    phone: item?.phone || '',
    email: item?.email || '',
  });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name.trim()) return toast('Tên nhân viên là bắt buộc', 'error');
    setSaving(true);
    try {
      if (item?.id) {
        await employeeService.update(item.id, form);
      } else {
        await employeeService.create(form);
      }
      toast(item?.id ? 'Đã cập nhật nhân viên' : 'Đã thêm nhân viên');
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
        <FormField label="Chức vụ">
          <select 
            className="input" 
            value={form.role} 
            onChange={e => set('role', e.target.value)}
          >
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </FormField>
        <FormField label="Số điện thoại">
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
            placeholder="nhanvien@store.com" 
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
          {saving ? 'Đang lưu...' : (item?.id ? 'Cập nhật' : 'Thêm nhân viên')}
        </button>
      </div>
    </div>
  );
}
