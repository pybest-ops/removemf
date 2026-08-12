import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

// shouldTrustHost 控制 Auth.js 是否信任当前请求 Host，开发和 Cloudflare 反代环境需要开启。
const shouldTrustHost = process.env.NODE_ENV === 'development' || process.env.AUTH_TRUST_HOST === 'true';

// authConfig 定义站点的第三方登录提供方和登录态签发规则。
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        url: 'https://accounts.google.com/o/oauth2/v2/auth',
        params: {
          prompt: 'select_account',
          scope: 'openid email profile'
        }
      },
      token: 'https://oauth2.googleapis.com/token',
      userinfo: 'https://openidconnect.googleapis.com/v1/userinfo'
    })
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt'
  },
  trustHost: shouldTrustHost
});
