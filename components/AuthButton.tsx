'use client';

import { useCurrentUser } from '@/lib/useCurrentUser';
import { useI18n } from './i18n/I18nProvider';

// AuthButton 展示当前 Google 登录状态，并提供登录或退出入口。
export function AuthButton() {
  const { dictionary } = useI18n();
  const { status, user } = useCurrentUser();
  const userName = user?.name ?? user?.email;

  if (status === 'loading') {
    return <span className="text-sm font-medium text-slate-500">{dictionary.common.auth.checking}</span>;
  }

  if (user) {
    return (
      <button
        className="h-11 rounded-full border border-matcha-200 px-3 text-sm font-semibold text-matcha-800 transition hover:bg-matcha-50 sm:px-5"
        onClick={handleLogout}
        type="button"
      >
        <span className="sm:hidden">{dictionary.common.auth.signOut}</span>
        <span className="hidden sm:inline">{userName ? dictionary.common.auth.signOutWithName.replace('{name}', userName) : dictionary.common.auth.signOut}</span>
      </button>
    );
  }

  return (
    <button
      aria-label={dictionary.common.auth.signIn}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-matcha-200 text-sm font-semibold text-matcha-800 transition hover:bg-matcha-50 sm:w-auto sm:gap-2 sm:px-5"
      onClick={() => startGoogleLogin(`${window.location.pathname}${window.location.search}` || '/')}
      type="button"
    >
      <svg className="h-4 w-4" viewBox="0 0 1024 1024" aria-hidden="true">
        <path d="M214.101333 512c0-32.512 5.546667-63.701333 15.36-92.928L57.173333 290.218667A491.861333 491.861333 0 0 0 4.693333 512c0 79.701333 18.858667 154.88 52.394667 221.610667l172.202667-129.066667A290.56 290.56 0 0 1 214.101333 512" fill="#FBBC05"></path>
        <path d="M516.693333 216.192c72.106667 0 137.258667 25.002667 188.458667 65.962667L854.101333 136.533333C763.349333 59.178667 646.997333 11.392 516.693333 11.392c-202.325333 0-376.234667 113.28-459.52 278.826667l172.373334 128.853333c39.68-118.016 152.832-202.88 287.146666-202.88" fill="#EA4335"></path>
        <path d="M516.693333 807.808c-134.357333 0-247.509333-84.864-287.232-202.88l-172.288 128.853333c83.242667 165.546667 257.152 278.826667 459.52 278.826667 124.842667 0 244.053333-43.392 333.568-124.757333l-163.584-123.818667c-46.122667 28.458667-104.234667 43.776-170.026666 43.776" fill="#34A853"></path>
        <path d="M1005.397333 512c0-29.568-4.693333-61.44-11.648-91.008H516.650667V614.4h274.602666c-13.696 65.962667-51.072 116.650667-104.533333 149.632l163.541333 123.818667c93.994667-85.418667 155.136-212.650667 155.136-375.850667" fill="#4285F4"></path>
      </svg>
      <span className="hidden sm:inline">{dictionary.common.auth.signIn}</span>
    </button>
  );
}

// startGoogleLogin 跳转到服务端 Google OAuth 发起接口。
function startGoogleLogin(returnTo: string) {
  window.location.assign(`/api/auth/google/start?returnTo=${encodeURIComponent(returnTo)}`);
}

// handleLogout 清理服务端登录 cookie 并刷新当前页面状态。
async function handleLogout() {
  await fetch('/api/auth/logout', { credentials: 'include', method: 'POST' });
  window.location.reload();
}
