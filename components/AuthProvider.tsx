'use client';

import { SessionProvider } from 'next-auth/react';

// AuthProvider 将 Auth.js session 提供给需要展示登录态的客户端组件。
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
