'use client';

import { useEffect, useState } from 'react';

// CaptureCheckout 在 PayPal 回跳后捕获订单，并提示 credits 已到账。
export function CaptureCheckout({ paypalOrderId }: { paypalOrderId?: string }) {
  const [statusMessage, setStatusMessage] = useState<string | null>(paypalOrderId ? 'Confirming your PayPal payment...' : null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!paypalOrderId) return;

    let isMounted = true;

    async function captureOrder() {
      try {
        const response = await fetch('/api/checkout/capture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: paypalOrderId })
        });
        const result = await response.json();

        if (!response.ok) throw new Error(result.errorMessage ?? 'Payment capture failed.');

        if (isMounted) setStatusMessage(`${result.creditsAdded} credits added to your account.`);
      } catch (error) {
        if (isMounted) {
          setStatusMessage(null);
          setErrorMessage(error instanceof Error ? error.message : 'Payment capture failed.');
        }
      }
    }

    captureOrder();

    return () => {
      isMounted = false;
    };
  }, [paypalOrderId]);

  if (!statusMessage && !errorMessage) return null;

  return (
    <section className="mb-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      {statusMessage ? <p className="font-semibold text-matcha-800">{statusMessage}</p> : null}
      {errorMessage ? <p className="font-semibold text-red-600">{errorMessage}</p> : null}
    </section>
  );
}
