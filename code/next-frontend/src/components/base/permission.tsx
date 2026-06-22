'use client';

import React from 'react';
import { useAuthStore } from '../../store/use-auth-store';

interface PermissionProps {
  roles: string[];
  children: React.ReactNode;
}

export function Permission({ roles, children }: PermissionProps) {
  const user = useAuthStore((state) => state.user);
  
  if (!user || !roles) return null;
  
  const hasPermission = roles.includes(user.role);
  
  if (!hasPermission) return null;
  
  return <>{children}</>;
}
