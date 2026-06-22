import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient?: 'green' | 'blue' | 'purple' | 'orange' | 'teal' | 'rose';
  change?: number;
  suffix?: string;
}

export function StatCard({ title, value, icon: Icon, gradient = 'green', change, suffix = '' }: StatCardProps) {
  const gradients = {
    green:  'from-emerald-500 to-emerald-400',
    blue:   'from-blue-500 to-blue-400',
    purple: 'from-purple-500 to-purple-400',
    orange: 'from-orange-500 to-orange-400',
    teal:   'from-teal-500 to-teal-400',
    rose:   'from-rose-500 to-rose-400',
  };
  const g = gradients[gradient] || gradients.green;

  return (
    <div className="card card-hover p-5 relative overflow-hidden">
      {/* Top gradient bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${g}`} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1.5 tracking-tight">
            {value}{suffix}
          </p>
          {change !== undefined && (
            <p className={`text-xs font-medium mt-1.5 flex items-center gap-1 ${change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              <span>{change >= 0 ? '▲' : '▼'}</span>
              <span>{Math.abs(change)}% so với tháng trước</span>
            </p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${g} flex items-center justify-center shadow-lg`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </div>
  );
}
