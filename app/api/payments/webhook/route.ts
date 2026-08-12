import { markOrderPaidAsync, markWebhookEventProcessedAsync } from '@/lib/billingStore';
import { verifyPayPalWebhook } from '@/lib/paypal';
import { NextResponse } from 'next/server';

type PayPalWebhookEvent = {
  id?: string;
  event_type?: string;
  resource?: {
    id?: string;
    status?: string;
    supplementary_data?: {
      related_ids?: {
        order_id?: string;
      };
    };
  };
};

// POST 处理 PayPal webhook，并通过事件 ID 保证幂等。
export async function POST(request: Request) {
  const event = (await request.json()) as PayPalWebhookEvent;
  const isVerified = await verifyPayPalWebhook(request, event);

  if (!isVerified) {
    return NextResponse.json({ errorCode: 'WEBHOOK_INVALID' }, { status: 401 });
  }

  const eventId = event.id;

  if (!eventId) {
    return NextResponse.json({ errorCode: 'WEBHOOK_EVENT_ID_REQUIRED' }, { status: 400 });
  }

  if (!(await markWebhookEventProcessedAsync(eventId, event.event_type))) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
    const paypalOrderId = event.resource?.supplementary_data?.related_ids?.order_id;

    if (paypalOrderId) {
      await markOrderPaidAsync({ paypalOrderId, paypalCaptureId: event.resource?.id });
    }
  }

  return NextResponse.json({ ok: true });
}
