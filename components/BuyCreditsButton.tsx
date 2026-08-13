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
      setErrorMessage(message.includes('PayPal') ? `${message} This environment should fall back to mock checkout.` : message);
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-7">
      <button
        className="inline-flex rounded-full bg-matcha-700 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        disabled={isLoading || status === 'loading'}
        onClick={handleBuy}
        type="button"
      >
        {isLoading ? 'Opening PayPal...' : user ? 'Buy credits' : 'Sign in to buy'}
      </button>
      {errorMessage ? <p className="mt-3 text-sm text-red-600">{errorMessage}</p> : null}
    </div>
  );
}

// startGoogleLogin 跳转到服务端 Google OAuth 发起接口。
function startGoogleLogin(returnTo: string) {
  window.location.assign(`/api/auth/google/start?returnTo=${encodeURIComponent(returnTo)}`);
}
