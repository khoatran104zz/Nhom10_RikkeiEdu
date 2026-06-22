import React from 'react';
import { User as UserIcon } from 'lucide-react';

interface ProfileAvatarProps {
  name?: string;
  role?: string;
}

export function ProfileAvatar({ name, role }: ProfileAvatarProps) {
  const initials = name
    ? name
        .trim()
        .split(' ')
        .filter(Boolean)
        .slice(-2)
        .map(p => p.charAt(0))
        .join('')
        .toUpperCase()
    : '';

  return (
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center border border-primary-100 dark:border-primary-900/40 shrink-0">
        {initials ? (
          <span className="text-lg font-extrabold text-primary-600 dark:text-primary-400">{initials}</span>
        ) : (
          <UserIcon size={24} className="text-primary-600 dark:text-primary-400" />
        )}
      </div>
      <div>
        <h4 className="font-bold text-gray-900 dark:text-white text-base leading-tight">{name || 'Chưa cập nhật'}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md inline-block">
          {role || 'Vai trò'}
        </p>
      </div>
    </div>
  );
}
