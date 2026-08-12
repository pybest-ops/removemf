import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    checkoutUrl: 'https://example.com/checkout',
    orderId: 'order_demo'
  });
}
