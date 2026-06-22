import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AccountCardProps {
  title?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export function AccountCard({ title, icon: Icon, children, className = '' }: AccountCardProps) {
  return (
    <div className={`card p-6 ${className}`}>
      {title && (
        <div className="flex items-center gap-3 mb-5 border-b border-gray-100 dark:border-gray-800/50 pb-4">
          {Icon && (
            <div className="w-8 h-8 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center shrink-0">
              <Icon size={16} className="text-primary-600 dark:text-primary-400" />
            </div>
          )}
          <h2 className="font-bold text-gray-900 dark:text-white text-base tracking-tight">{title}</h2>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
