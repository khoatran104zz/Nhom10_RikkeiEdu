import React from 'react';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-tr from-surface-50 to-primary-50 dark:from-gray-950 dark:to-gray-900/40 p-4 transition-colors duration-300">
      <div className="w-full max-w-[420px] animate-fadeIn">
        {children}
      </div>
    </div>
  );
}
