import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    sessionId: 'sess_demo',
    creditsBalance: 3,
    recentJobs: [],
    orders: []
  });
}
