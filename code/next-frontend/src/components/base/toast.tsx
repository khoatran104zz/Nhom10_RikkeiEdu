'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, LucideIcon } from 'lucide-react';

type ToastType = 'success' | 'error';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

type ToastCallback = (message: string, type?: ToastType) => void;

let _toastCb: ToastCallback | null = null;

export function setToastCallback(cb: ToastCallback) {
  _toastCb = cb;
}

export function toast(message: string, type: ToastType = 'success') {
  if (_toastCb) {
    _toastCb(message, type);
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    setToastCallback((message: string, type: ToastType = 'success') => {
      const id = Date.now();
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, 3500);
    });
  }, []);

  const icons: Record<ToastType, LucideIcon> = { 
    success: CheckCircle2, 
    error: AlertCircle 
  };

  return (
    <div className="fixed bottom-5 right-5 z-[100] space-y-2 pointer-events-none">
      {toasts.map((t) => {
        const TIcon = icons[t.type] || CheckCircle2;
        return (
          <div 
            key={t.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold animate-fadeIn pointer-events-auto
              ${t.type === 'success'
                ? 'bg-white dark:bg-gray-900 text-gray-800 dark:text-white border border-gray-100 dark:border-gray-800'
                : 'bg-red-500 text-white'}`}
          >
            <TIcon size={16} className={t.type === 'success' ? 'text-primary-500' : 'text-white'} />
            {t.message}
          </div>
        );
      })}
    </div>
  );
}
