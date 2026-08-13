// GoogleOAuthConfig 是 Google OAuth 服务端交换 code 所需的私密配置。
type GoogleOAuthConfig = {
  clientId: string;
  clientSecret: string;
  sessionSecret: string;
};

// GoogleTokenResponse 表示 Google token endpoint 返回的核心字段。
type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
  expires_in?: number;
  id_token?: string;
  scope?: string;
  token_type?: string;
};

// GoogleIdTokenClaims 是本项目需要校验和使用的 Google ID token claims。
type GoogleIdTokenClaims = {
  aud?: string | string[];
  email?: string;
  email_verified?: boolean | string;
  exp?: number;
  iss?: string;
  name?: string;
  nonce?: string;
  picture?: string;
  sub?: string;
};

type GoogleJwk = JsonWebKey & {
  kid?: string;
};

type GoogleJwkSet = {
  keys?: GoogleJwk[];
};

export type CurrentUser = {
  email: string;
  id: string;
  image?: string | null;
  name?: string | null;
};

type SignedSessionPayload = CurrentUser & {
  expiresAt: number;
};

// oauthStateCookieName 存储 Google OAuth 回跳时校验用的 state。
const oauthStateCookieName = 'mf_oauth_state';
// oauthNonceCookieName 绑定当前浏览器发起的 Google ID token。
const oauthNonceCookieName = 'mf_oauth_nonce';
// oauthReturnCookieName 存储登录成功后允许回跳的站内路径。
const oauthReturnCookieName = 'mf_oauth_return';
// sessionCookieName 存储本项目签名后的登录态。
const sessionCookieName = 'mf_session';
// sessionMaxAgeSeconds 定义站点登录态有效期。
const sessionMaxAgeSeconds = 60 * 60 * 24 * 30;
// oauthCookieMaxAgeSeconds 限制临时 OAuth cookie 的有效窗口。
const oauthCookieMaxAgeSeconds = 60 * 10;
// googleCertsUrl 是 Google ID token 签名公钥地址。
const googleCertsUrl = 'https://www.googleapis.com/oauth2/v3/certs';

// getGoogleOAuthConfig 校验 Google 登录所需的服务端配置是否齐全。
export function getGoogleOAuthConfig(): GoogleOAuthConfig | null {
  const clientId = process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET;
  const sessionSecret = process.env.AUTH_SECRET;

  if (!clientId || !clientSecret || !sessionSecret) return null;

  return { clientId, clientSecret, sessionSecret };
}

// getGoogleRedirectUri 生成 Google Console 中必须配置的完整回调地址。
export function getGoogleRedirectUri(request: Request) {
  return `${new URL(request.url).origin}/api/auth/google/callback`;
}

// sanitizeReturnTo 限制 OAuth 登录后只能回跳站内安全路径。
export function sanitizeReturnTo(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/';
  if (value.startsWith('/api/')) return '/';
  return value;
}

// parseCookies 解析请求 Cookie，避免引入额外 cookie 依赖。
export function parseCookies(request: Request) {
  const cookies = new Map<string, string>();
  const header = request.headers.get('cookie') ?? '';

  for (const part of header.split(';')) {
    const [name, ...rest] = part.trim().split('=');

    if (!name || !rest.length) continue;

    cookies.set(name, decodeURIComponent(rest.join('=')));
  }

  return cookies;
}

// createOAuthCookies 创建 Google OAuth state、nonce 和 returnTo 临时 cookie。
export async function createOAuthCookies(request: Request, returnTo: string) {
  const state = createRandomToken();
  const nonce = createRandomToken();
  const secure = isSecureRequest(request);

  return {
    cookies: [
      serializeCookie(oauthStateCookieName, state, { httpOnly: true, maxAge: oauthCookieMaxAgeSeconds, secure }),
      serializeCookie(oauthNonceCookieName, nonce, { httpOnly: true, maxAge: oauthCookieMaxAgeSeconds, secure }),
      serializeCookie(oauthReturnCookieName, encodeURIComponent(returnTo), { httpOnly: true, maxAge: oauthCookieMaxAgeSeconds, secure })
    ],
    nonce,
    state
  };
}

// clearOAuthCookies 清理登录过程中使用的一次性 OAuth cookie。
export function clearOAuthCookies(request: Request) {
  const secure = isSecureRequest(request);
  return [oauthStateCookieName, oauthNonceCookieName, oauthReturnCookieName].map((name) => serializeCookie(name, '', { httpOnly: true, maxAge: 0, secure }));
}

// exchangeGoogleCode 用 Google 回调 code 在服务端换取 token。
export async function exchangeGoogleCode(config: GoogleOAuthConfig, redirectUri: string, code: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'POST'
  });
  const rawBody = await response.text();
  let body: GoogleTokenResponse = {};

  try {
    body = JSON.parse(rawBody) as GoogleTokenResponse;
  } catch {
    body = {};
  }

  if (!response.ok || !body.id_token) {
    const reason = body.error_description ?? body.error ?? rawBody.trim() ?? response.statusText;

    throw new Error(`Google token exchange failed: ${reason} (redirect_uri=${redirectUri})`);
  }

  return body;
}

// verifyGoogleIdToken 校验 Google ID token 签名和核心 claims。
export async function verifyGoogleIdToken(idToken: string, config: GoogleOAuthConfig, expectedNonce: string): Promise<CurrentUser> {
  const [encodedHeader, encodedPayload, encodedSignature] = idToken.split('.');

  if (!encodedHeader || !encodedPayload || !encodedSignature) throw new Error('Invalid Google ID token.');

  const header = JSON.parse(decodeBase64UrlToText(encodedHeader)) as { alg?: string; kid?: string };
  const claims = JSON.parse(decodeBase64UrlToText(encodedPayload)) as GoogleIdTokenClaims;

  if (header.alg !== 'RS256' || !header.kid) throw new Error('Unsupported Google ID token.');

  const keys = await loadGoogleJwks();
  const key = keys.find((candidate) => candidate.kid === header.kid);

  if (!key) throw new Error('Google signing key was not found.');

  const cryptoKey = await crypto.subtle.importKey('jwk', key, { hash: 'SHA-256', name: 'RSASSA-PKCS1-v1_5' }, false, ['verify']);
  const verified = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', cryptoKey, decodeBase64UrlToBytes(encodedSignature), new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`));

  if (!verified) throw new Error('Google ID token signature is invalid.');

  validateGoogleClaims(claims, config.clientId, expectedNonce);

  return {
    email: claims.email!,
    id: `google:${claims.email!.toLowerCase()}`,
    image: claims.picture ?? null,
    name: claims.name ?? null
  };
}

// createSessionCookie 将登录用户信息签名后写入 HttpOnly cookie。
export async function createSessionCookie(request: Request, config: GoogleOAuthConfig, user: CurrentUser) {
  const expiresAt = Date.now() + sessionMaxAgeSeconds * 1000;
  const payload = bytesToBase64Url(new TextEncoder().encode(JSON.stringify({ ...user, expiresAt } satisfies SignedSessionPayload)));
  const signature = await signValue(payload, config.sessionSecret);

  return serializeCookie(sessionCookieName, `${payload}.${signature}`, { httpOnly: true, maxAge: sessionMaxAgeSeconds, secure: isSecureRequest(request) });
}

// getCurrentUser 从签名 session cookie 中读取当前登录用户。
export async function getCurrentUser(request: Request): Promise<CurrentUser | null> {
  const config = getGoogleOAuthConfig();
  const sessionCookie = parseCookies(request).get(sessionCookieName);

  if (!config || !sessionCookie) return null;

  const [payload, signature] = sessionCookie.split('.');

  if (!payload || !signature) return null;

  const expectedSignature = await signValue(payload, config.sessionSecret);

  if (!timingSafeEqual(signature, expectedSignature)) return null;

  const session = JSON.parse(decodeBase64UrlToText(payload)) as SignedSessionPayload;

  if (session.expiresAt <= Date.now()) return null;

  return { email: session.email, id: session.id, image: session.image ?? null, name: session.name ?? null };
}

// clearSessionCookie 删除浏览器中的登录态 cookie。
export function clearSessionCookie(request: Request) {
  return serializeCookie(sessionCookieName, '', { httpOnly: true, maxAge: 0, secure: isSecureRequest(request) });
}

// createRandomToken 生成 OAuth state、nonce 和 session 所需的随机值。
function createRandomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

// loadGoogleJwks 获取 Google 当前用于校验 ID token 的公钥集合。
async function loadGoogleJwks() {
  const response = await fetch(googleCertsUrl);

  if (!response.ok) throw new Error('Google signing keys could not be loaded.');

  const body = (await response.json()) as GoogleJwkSet;
  return body.keys ?? [];
}

// validateGoogleClaims 校验本项目依赖的 Google ID token claims。
function validateGoogleClaims(claims: GoogleIdTokenClaims, clientId: string, expectedNonce: string) {
  const audience = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  const emailVerified = claims.email_verified === true || claims.email_verified === 'true';

  if (!claims.sub || !claims.email || !emailVerified) throw new Error('Google account email is not verified.');
  if (!audience.includes(clientId)) throw new Error('Google ID token audience is invalid.');
  if (claims.iss !== 'https://accounts.google.com' && claims.iss !== 'accounts.google.com') throw new Error('Google ID token issuer is invalid.');
  if (!claims.exp || claims.exp * 1000 <= Date.now()) throw new Error('Google ID token is expired.');
  if (claims.nonce !== expectedNonce) throw new Error('Google ID token nonce is invalid.');
}

// signValue 使用 AUTH_SECRET 对 session payload 做 HMAC 签名。
async function signValue(value: string, secret: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { hash: 'SHA-256', name: 'HMAC' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return bytesToBase64Url(new Uint8Array(signature));
}

// timingSafeEqual 尽量避免签名比较时出现明显时序差异。
function timingSafeEqual(first: string, second: string) {
  if (first.length !== second.length) return false;

  let diff = 0;

  for (let index = 0; index < first.length; index += 1) {
    diff |= first.charCodeAt(index) ^ second.charCodeAt(index);
  }

  return diff === 0;
}

// isSecureRequest 判断当前请求是否应使用 Secure cookie。
function isSecureRequest(request: Request) {
  const url = new URL(request.url);
  return url.protocol === 'https:' || request.headers.get('x-forwarded-proto') === 'https';
}

// serializeCookie 格式化认证相关 cookie，使用 Lax 兼容 OAuth 回跳。
function serializeCookie(name: string, value: string, options: { httpOnly: boolean; maxAge: number; secure: boolean }) {
  const parts = [`${name}=${encodeURIComponent(value)}`, 'Path=/', `Max-Age=${options.maxAge}`, 'SameSite=Lax'];

  if (options.httpOnly) parts.push('HttpOnly');
  if (options.secure) parts.push('Secure');

  return parts.join('; ');
}

// bytesToBase64Url 将字节数组转换为 URL 和 cookie 安全字符串。
function bytesToBase64Url(bytes: Uint8Array) {
  let binary = '';

  for (const byte of bytes) binary += String.fromCharCode(byte);

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

// decodeBase64UrlToBytes 将 JWT/base64url 字段还原为字节数组。
function decodeBase64UrlToBytes(value: string) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4)) % 4);
  const binary = atob(base64);

  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

// decodeBase64UrlToText 将 JWT/base64url 字段还原为 UTF-8 文本。
function decodeBase64UrlToText(value: string) {
  return new TextDecoder().decode(decodeBase64UrlToBytes(value));
}
