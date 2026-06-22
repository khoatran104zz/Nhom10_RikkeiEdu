'use client';

import React, { useState, useEffect } from 'react';
import { settingsService } from '@/services';
import { useTheme } from '@/providers/providers';
import { PageHeader, FormField, Loading, toast } from '@/components/base';
import { Sun, Moon, Store, Save } from 'lucide-react';
import { StoreSettings } from '@/types';

export default function SettingsDashboard() {
  const [form, setForm] = useState<StoreSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const { dark, toggle } = useTheme();

  useEffect(() => {
    settingsService.get()
      .then(setForm)
      .catch((err) => {
        console.error('Error loading settings:', err);
      });
  }, []);

  const set = (k: string, v: string) => setForm(f => (f ? { ...f, [k]: v } : null));

  const save = async () => {
    if (!form) return;
    setSaving(true);
    try {
      await settingsService.update(form);
      toast('Đã lưu cài đặt');
    } catch (e: unknown) {
      toast((e as Error).message || 'Lỗi khi lưu cài đặt', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <Loading />;

  return (
    <div className="max-w-2xl">
      <PageHeader 
        title="Cài đặt" 
        subtitle="Thông tin cửa hàng và tùy chỉnh hệ thống"
        breadcrumb={['Hệ thống', 'Cài đặt']} 
      />

      {/* Store info */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center">
            <Store size={16} className="text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="font-semibold text-gray-900 dark:text-white">Thông tin cửa hàng</h2>
        </div>

        <FormField label="Tên cửa hàng">
          <input className="input" value={form.storeName || ''} onChange={e => set('storeName', e.target.value)} />
        </FormField>
        <FormField label="Địa chỉ">
          <input className="input" value={form.address || ''} onChange={e => set('address', e.target.value)} />
        </FormField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Số điện thoại">
            <input className="input" value={form.phone || ''} onChange={e => set('phone', e.target.value)} />
          </FormField>
          <FormField label="Email">
            <input type="email" className="input" value={form.email || ''} onChange={e => set('email', e.target.value)} />
          </FormField>
        </div>
        <FormField label="Mã số thuế">
          <input className="input" value={form.taxCode || ''} onChange={e => set('taxCode', e.target.value)} />
        </FormField>

        <button className="btn btn-primary mt-2 flex items-center gap-2 cursor-pointer" onClick={save} disabled={saving}>
          <Save size={15} />
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>

      {/* Appearance */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-5">Giao diện</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Chế độ tối</p>
            <p className="text-xs text-gray-500 mt-0.5">Giảm mỏi mắt khi làm việc ban đêm</p>
          </div>
          <button
            onClick={toggle}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 cursor-pointer ${
              dark ? 'bg-primary-500' : 'bg-gray-300'
            }`}
          >
            <span className={`inline-flex items-center justify-center w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${
              dark ? 'translate-x-6' : 'translate-x-1'
            }`}>
              {dark ? <Moon size={11} className="text-primary-600" /> : <Sun size={11} className="text-orange-500" />}
            </span>
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div
            onClick={() => dark && toggle()}
            className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
              !dark 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="w-full h-12 bg-white rounded-lg border border-gray-200 mb-2 flex items-center px-2 gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-200" />
              <div className="flex-1 h-1.5 bg-gray-100 rounded" />
            </div>
            <p className="text-xs font-medium text-center text-gray-700 dark:text-gray-300">Sáng</p>
          </div>
          <div
            onClick={() => !dark && toggle()}
            className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
              dark 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="w-full h-12 bg-gray-950 rounded-lg border border-gray-700 mb-2 flex items-center px-2 gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-700" />
              <div className="flex-1 h-1.5 bg-gray-800 rounded" />
            </div>
            <p className="text-xs font-medium text-center text-gray-700 dark:text-gray-300">Tối</p>
          </div>
        </div>
      </div>
    </div>
  );
}
