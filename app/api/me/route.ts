import { getAuthenticatedUser } from '@/lib/authUser';
import { getUserBillingSnapshotAsync, upsertUser } from '@/lib/billingStore';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({
      user: null,
      creditsBalance: 0,
      activePacks: [],
      recentOrders: [],
      recentJobs: []
    });
  }

  await upsertUser(user);

  const billingSnapshot = await getUserBillingSnapshotAsync(user.id);

  return NextResponse.json({
    user,
    creditsBalance: billingSnapshot.creditsBalance,
    activePacks: billingSnapshot.activePacks,
    recentOrders: billingSnapshot.recentOrders,
    recentJobs: []
  });
}
