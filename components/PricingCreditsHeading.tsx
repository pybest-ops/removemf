'use client';

import { useCurrentUser } from '@/lib/useCurrentUser';

// PricingCreditsHeading 根据登录用户的购买记录展示当前剩余积分或默认购买提示。
export function PricingCreditsHeading() {
  const { creditsBalance, recentOrders, status, user } = useCurrentUser();
  const hasPurchasedCredits = recentOrders.some((order) => order.status === 'paid');

  if (status === 'loading' || !user || !hasPurchasedCredits) {
    return <h1 className="mt-3 text-4xl font-semibold text-slate-950">Buy credits only when you need them.</h1>;
  }

  return <h1 className="mt-3 text-4xl font-semibold text-slate-950">You have {creditsBalance} credits remaining.</h1>;
}
