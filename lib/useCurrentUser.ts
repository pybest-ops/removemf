'use client';

import { useEffect, useState } from 'react';
import type { CurrentUser } from '@/lib/googleAuth';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

// RecentOrder 表示当前用户最近订单中判断是否已购买 credits 所需的最小字段。
type RecentOrder = {
  status?: string;
};

type CurrentUserResponse = {
  activePacks?: unknown[];
  creditsBalance?: number;
  recentJobs?: unknown[];
  recentOrders?: RecentOrder[];
  user?: CurrentUser | null;
};

// useCurrentUser 读取当前浏览器登录用户，供按钮和受保护操作共用。
export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [creditsBalance, setCreditsBalance] = useState(0);
  // recentOrders 用于区分已购买用户和未购买用户，避免 0 余额时误判为未登录。
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    let isActive = true;

    async function loadUser() {
      try {
        const response = await fetch('/api/me', { credentials: 'include' });
        const result = (await response.json()) as CurrentUserResponse;

        if (!isActive) return;

        setUser(result.user ?? null);
        setCreditsBalance(result.creditsBalance ?? 0);
        setRecentOrders(result.recentOrders ?? []);
        setStatus(result.user ? 'authenticated' : 'unauthenticated');
      } catch {
        if (!isActive) return;

        setUser(null);
        setCreditsBalance(0);
        setRecentOrders([]);
        setStatus('unauthenticated');
      }
    }

    void loadUser();

    return () => {
      isActive = false;
    };
  }, []);

  return { creditsBalance, recentOrders, status, user };
}
