import { getAuthenticatedUser } from '@/lib/authUser';
import { getOrderByPayPalOrderIdAsync, markOrderPaidAsync } from '@/lib/billingStore';
import { capturePayPalOrder } from '@/lib/paypal';
import { NextResponse } from 'next/server';

// POST 捕获 PayPal 订单并幂等发放 credits。
export async function POST(request: Request) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json({ errorCode: 'UNAUTHORIZED', errorMessage: 'Please sign in with Google before capturing payment.' }, { status: 401 });
  }

  const body = await request.json();
  const paypalOrderId = String(body.orderId ?? body.paypalOrderId ?? '');

  if (!paypalOrderId) {
    return NextResponse.json({ errorCode: 'ORDER_ID_REQUIRED', errorMessage: 'PayPal order id is required.' }, { status: 400 });
  }

  const order = await getOrderByPayPalOrderIdAsync(paypalOrderId);

  if (!order || order.userId !== user.id) {
    return NextResponse.json({ errorCode: 'ORDER_NOT_FOUND', errorMessage: 'Order not found for this account.' }, { status: 404 });
  }

  const capture = await capturePayPalOrder(paypalOrderId);

  if (capture.status !== 'COMPLETED') {
    return NextResponse.json({ errorCode: 'PAYMENT_NOT_COMPLETED', errorMessage: 'PayPal payment was not completed.' }, { status: 400 });
  }

  const paidOrder = await markOrderPaidAsync({ paypalOrderId, paypalCaptureId: capture.captureId });

  return NextResponse.json({ order: paidOrder, creditsAdded: paidOrder?.creditsGranted ?? 0, mock: capture.mock });
}
