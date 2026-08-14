'use client';

import { useCurrentUser } from '@/lib/useCurrentUser';
import { useState } from 'react';
import type { CreditPack } from '@/lib/pricing';

// BuyCreditsButton 负责登录校验、创建 PayPal 订单并跳转 approval 页面。
export function BuyCreditsButton({ packId }: { packId: CreditPack['id'] }) {
  const { status, user } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // handleBuy 根据登录态决定拉起 Google 登录或创建 PayPal Checkout。
  async function handleBuy() {
    setErrorMessage(null);

    if (status === 'loading') return;

    if (!user) {
      startGoogleLogin('/pricing');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId })
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.errorMessage ?? 'Unable to create checkout.');

      window.location.href = result.approvalUrl;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to start checkout.';
      setErrorMessage(message);
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-7">
      <button
        className="inline-flex w-full justify-center rounded-full bg-gradient-to-r from-matcha-300 via-emerald-300 to-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-400/20 transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        disabled={isLoading || status === 'loading'}
        onClick={handleBuy}
        type="button"
      >
        {isLoading ? 'Opening PayPal...' : user ? 'Buy credits' : 'Sign in to buy'}
      </button>
      {errorMessage ? <p className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{errorMessage}</p> : null}
    </div>
  );
}

// startGoogleLogin 跳转到服务端 Google OAuth 发起接口。
function startGoogleLogin(returnTo: string) {
  window.location.assign(`/api/auth/google/start?returnTo=${encodeURIComponent(returnTo)}`);
}
