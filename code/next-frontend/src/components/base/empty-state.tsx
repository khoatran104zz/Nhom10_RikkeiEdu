import React from 'react';
import { AlertCircle, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  icon?: LucideIcon;
}

export function EmptyState({ message = 'Không có dữ liệu', icon: Icon = AlertCircle }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
        <Icon size={24} className="opacity-50" />
      </div>
      <p className="text-sm font-medium">{message}</p>
      <p className="text-xs mt-1 opacity-60">Thêm dữ liệu để bắt đầu</p>
    </div>
  );
}
