'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
}

export function ConfirmDialog({ open, onClose, onConfirm, title = 'Xác nhận', message }: ConfirmDialogProps) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fadeIn">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center shrink-0">
            <AlertCircle size={20} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">{title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">Hành động này không thể hoàn tác</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 bg-surface-50 dark:bg-gray-800 rounded-xl p-3">{message}</p>
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="btn btn-secondary text-sm">Hủy</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="btn btn-danger text-sm">
            Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  );
}
