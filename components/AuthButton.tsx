'use client';

import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

// AuthButton 展示当前 Google 登录状态，并提供登录或退出入口。
export function AuthButton() {
  const { data: session, status } = useSession();
  const userName = session?.user?.name ?? session?.user?.email;

  if (status === 'loading') {
    return <span className="text-sm font-medium text-slate-500">Checking login...</span>;
  }

  if (session?.user) {
    return (
      <button
        className="rounded-full border border-matcha-200 px-5 py-2.5 text-sm font-semibold text-matcha-800 transition hover:bg-matcha-50"
        onClick={() => signOut()}
        type="button"
      >
        {userName ? `Sign out · ${userName}` : 'Sign out'}
      </button>
    );
  }

  return (
    <button
      className="rounded-full border border-matcha-200 px-5 py-2.5 text-sm font-semibold text-matcha-800 transition hover:bg-matcha-50"
      onClick={showLoginWipMessage}
      type="button"
    >
      Sign in with Google
    </button>
  );
}

// showLoginWipMessage 提示用户当前登录功能仍在开发中。
function showLoginWipMessage() {
  window.alert('Feature under development. Stay tuned.');
}
