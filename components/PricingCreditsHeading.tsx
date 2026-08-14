'use client';

import { useCurrentUser } from '@/lib/useCurrentUser';

// PricingCreditsHeading 根据登录用户的购买记录展示当前剩余积分或默认购买提示。
export function PricingCreditsHeading() {
  const { creditsBalance, recentOrders, status, user } = useCurrentUser();
  const hasPurchasedCredits = recentOrders.some((order) => order.status === 'paid');

  if (status === 'loading' || !user || !hasPurchasedCredits) {
    return <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.04] tracking-[-0.05em] text-slate-950 md:text-6xl">Buy credits only when you need AI Restore.</h1>;
  }

  return <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.04] tracking-[-0.05em] text-slate-950 md:text-6xl">You have {creditsBalance} credits remaining.</h1>;
}
