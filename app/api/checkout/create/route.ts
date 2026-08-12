import { getAuthenticatedUser } from '@/lib/authUser';
import { createPendingOrderAsync, upsertUser } from '@/lib/billingStore';
import { createPayPalOrder } from '@/lib/paypal';
import { getCreditPack } from '@/lib/pricing';
import { NextResponse } from 'next/server';

// POST 创建 PayPal 积分包订单；购买前必须 Google 登录。
export async function POST(request: Request) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ errorCode: 'UNAUTHORIZED', errorMessage: 'Please sign in with Google before buying credits.' }, { status: 401 });
  }

  const body = await request.json();
  const pack = getCreditPack(String(body.packId ?? ''));

  if (!pack) {
    return NextResponse.json({ errorCode: 'INVALID_PACK_ID', errorMessage: 'Unknown credit pack.' }, { status: 400 });
  }

  await upsertUser(user);

  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_PUBLIC_BASE_URL ?? new URL(request.url).origin;
  const returnUrl = `${appBaseUrl}/pricing?checkout=return&packId=${pack.id}`;
  const cancelUrl = `${appBaseUrl}/pricing?checkout=cancelled`;
  const paypalOrder = await createPayPalOrder({ pack, userId: user.id, returnUrl, cancelUrl });
  const order = await createPendingOrderAsync({ userId: user.id, paypalOrderId: paypalOrder.orderId, pack });

  return NextResponse.json({
    orderId: order?.id,
    paypalOrderId: paypalOrder.orderId,
    approvalUrl: paypalOrder.approvalUrl,
    mock: paypalOrder.mock
  });
}
