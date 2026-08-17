'use client';

import { useCurrentUser } from '@/lib/useCurrentUser';
import { localizePath } from '@/lib/i18n/config';
import { useI18n } from './i18n/I18nProvider';
import { useState } from 'react';
import type { CreditPack } from '@/lib/pricing';

// BuyCreditsButton 负责登录校验、创建 PayPal 订单并跳转 approval 页面。
export function BuyCreditsButton({ packId }: { packId: CreditPack['id'] }) {
  const { dictionary, locale } = useI18n();
  const { status, user } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // handleBuy 根据登录态决定拉起 Google 登录或创建 PayPal Checkout。
  async function handleBuy() {
    setErrorMessage(null);

    if (status === 'loading') return;

    if (!user) {
      startGoogleLogin(localizePath('/pricing', locale));
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

      if (!response.ok) throw new Error(result.errorMessage ?? dictionary.pricing.buyButton.checkoutError);

      window.location.href = result.approvalUrl;
    } catch (error) {
      const message = error instanceof Error ? error.message : dictionary.pricing.buyButton.startError;
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
        {isLoading ? dictionary.pricing.buyButton.loading : user ? dictionary.pricing.buyButton.buy : dictionary.pricing.buyButton.signIn}
      </button>
      {errorMessage ? <p className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{errorMessage}</p> : null}
    </div>
  );
}

// startGoogleLogin 跳转到服务端 Google OAuth 发起接口。
function startGoogleLogin(returnTo: string) {
  window.location.assign(`/api/auth/google/start?returnTo=${encodeURIComponent(returnTo)}`);
}
