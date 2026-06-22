import React from 'react';
import { Loader2 } from 'lucide-react';

export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-10 h-10 rounded-2xl header-gradient flex items-center justify-center animate-pulse">
        <Loader2 size={20} className="animate-spin text-white" />
      </div>
      <p className="text-xs text-gray-400 font-medium">Đang tải dữ liệu...</p>
    </div>
  );
}
