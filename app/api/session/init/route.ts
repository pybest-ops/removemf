import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    sessionId: 'sess_demo',
    creditsBalance: 3,
    anonymous: true
  });
}
