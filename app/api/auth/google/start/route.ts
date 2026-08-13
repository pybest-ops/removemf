import { createOAuthCookies, getGoogleOAuthConfig, getGoogleRedirectUri, sanitizeReturnTo } from '@/lib/googleAuth';
import { NextResponse } from 'next/server';

// GET 发起服务端 Google OAuth 登录流程。
export async function GET(request: Request) {
  const config = getGoogleOAuthConfig();

  if (!config) return NextResponse.json({ errorCode: 'GOOGLE_LOGIN_NOT_CONFIGURED' }, { status: 503 });

  const url = new URL(request.url);
  const returnTo = sanitizeReturnTo(url.searchParams.get('returnTo'));
  const redirectUri = getGoogleRedirectUri(request);
  const oauth = await createOAuthCookies(request, returnTo);
  const googleUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');

  googleUrl.searchParams.set('client_id', config.clientId);
  googleUrl.searchParams.set('nonce', oauth.nonce);
  googleUrl.searchParams.set('prompt', 'select_account');
  googleUrl.searchParams.set('redirect_uri', redirectUri);
  googleUrl.searchParams.set('response_type', 'code');
  googleUrl.searchParams.set('scope', 'openid email profile');
  googleUrl.searchParams.set('state', oauth.state);

  const response = NextResponse.redirect(googleUrl);

  for (const cookie of oauth.cookies) response.headers.append('Set-Cookie', cookie);

  return response;
}
