import { clearOAuthCookies, createSessionCookie, exchangeGoogleCode, getGoogleOAuthConfig, getGoogleRedirectUri, parseCookies, sanitizeReturnTo, verifyGoogleIdToken } from '@/lib/googleAuth';
import { upsertUser } from '@/lib/billingStore';
import { NextResponse } from 'next/server';

// GET 完成 Google OAuth 回调校验，并写入站点登录态 cookie。
export async function GET(request: Request) {
  const config = getGoogleOAuthConfig();

  if (!config) return NextResponse.json({ errorCode: 'GOOGLE_LOGIN_NOT_CONFIGURED' }, { status: 503 });

  const url = new URL(request.url);
  const code = url.searchParams.get('code') ?? '';
  const state = url.searchParams.get('state') ?? '';
  const cookies = parseCookies(request);
  const expectedState = cookies.get('mf_oauth_state') ?? '';
  const expectedNonce = cookies.get('mf_oauth_nonce') ?? '';
  const returnTo = sanitizeReturnTo(decodeURIComponent(cookies.get('mf_oauth_return') ?? ''));
  const failureUrl = new URL('/?auth=failed', url.origin);
  let stage = 'init';

  try {
    stage = 'state';
    if (!code || !state || state !== expectedState || !expectedNonce) throw new Error('Google login state is invalid.');

    stage = 'token_exchange';
    const tokens = await exchangeGoogleCode(config, getGoogleRedirectUri(request), code);

    stage = 'id_token_verify';
    const user = await verifyGoogleIdToken(tokens.id_token!, config, expectedNonce);

    stage = 'user_upsert';
    await upsertUser(user);

    stage = 'session_create';
    const response = NextResponse.redirect(new URL(returnTo, url.origin));

    for (const cookie of clearOAuthCookies(request)) response.headers.append('Set-Cookie', cookie);

    response.headers.append('Set-Cookie', await createSessionCookie(request, config, user));

    return response;
  } catch (error) {
    const reason = `${stage}: ${error instanceof Error ? error.message : 'Google login failed.'}`;

    console.error('Google OAuth callback failed:', reason);
    if (error instanceof Error && error.stack) console.error(error.stack);

    failureUrl.searchParams.set('reason', reason);

    const response = NextResponse.redirect(failureUrl);

    for (const cookie of clearOAuthCookies(request)) response.headers.append('Set-Cookie', cookie);

    return response;
  }
}
