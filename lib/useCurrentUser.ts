'use client';

import { useEffect, useState } from 'react';
import type { CurrentUser } from '@/lib/googleAuth';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type CurrentUserResponse = {
  activePacks?: unknown[];
  creditsBalance?: number;
  recentJobs?: unknown[];
  recentOrders?: unknown[];
  user?: CurrentUser | null;
};

// useCurrentUser 读取当前浏览器登录用户，供按钮和受保护操作共用。
export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [creditsBalance, setCreditsBalance] = useState(0);
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    let isActive = true;

    async function loadUser() {
      try {
        const response = await fetch('/api/auth/me', { credentials: 'include' });
        const result = (await response.json()) as CurrentUserResponse;

        if (!isActive) return;

        setUser(result.user ?? null);
        setCreditsBalance(result.creditsBalance ?? 0);
        setStatus(result.user ? 'authenticated' : 'unauthenticated');
      } catch {
        if (!isActive) return;

        setUser(null);
        setCreditsBalance(0);
        setStatus('unauthenticated');
      }
    }

    void loadUser();

    return () => {
      isActive = false;
    };
  }, []);

  return { creditsBalance, status, user };
}
