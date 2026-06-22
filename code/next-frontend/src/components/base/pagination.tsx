'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (newPage: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    const p = page <= 3 ? i + 1 : page - 2 + i;
    return p >= 1 && p <= totalPages ? p : null;
  }).filter((x): x is number => x !== null);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
      <span className="text-xs text-gray-500">Trang {page}/{totalPages}</span>
      <div className="flex gap-1">
        <button 
          onClick={() => onChange(page - 1)} 
          disabled={page <= 1}
          className="btn btn-secondary px-2 py-1.5 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={14} />
        </button>
        {pages.map(p => (
          <button 
            key={p} 
            onClick={() => onChange(p)}
            className={`btn px-3 py-1.5 text-xs font-bold ${p === page ? 'btn-primary' : 'btn-secondary'}`}
          >
            {p}
          </button>
        ))}
        <button 
          onClick={() => onChange(page + 1)} 
          disabled={page >= totalPages}
          className="btn btn-secondary px-2 py-1.5 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
