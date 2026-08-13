import { getAuthenticatedUser } from '@/lib/authUser';
import { getUserBillingSnapshotAsync, upsertUser } from '@/lib/billingStore';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json({
      user: null,
      creditsBalance: 0,
      anonymous: true
    });
  }

  await upsertUser(user);

  return NextResponse.json({
    user,
    creditsBalance: (await getUserBillingSnapshotAsync(user.id)).creditsBalance,
    anonymous: false
  });
}
