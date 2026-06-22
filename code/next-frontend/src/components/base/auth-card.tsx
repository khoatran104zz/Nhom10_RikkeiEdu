import React from 'react';

export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="card p-8 md:p-10 shadow-card rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 transition-colors duration-300">
      {children}
    </div>
  );
}
