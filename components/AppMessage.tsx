'use client';

import { useEffect } from 'react';

export type AppMessageNotice = {
  text: string;
  type: 'success' | 'error';
};

type AppMessageProps = {
  notice: AppMessageNotice | null;
  onClose: () => void;
};

// messageStyles 定义不同业务提示类型对应的视觉样式。
const messageStyles: Record<AppMessageNotice['type'], { icon: string; className: string; iconClassName: string }> = {
  success: {
    icon: '✓',
    className: 'border-matcha-200 bg-white text-matcha-900 shadow-[0_18px_55px_rgba(31,82,44,0.16)]',
    iconClassName: 'bg-matcha-500'
  },
  error: {
    icon: '!',
    className: 'border-red-200 bg-white text-red-700 shadow-[0_18px_55px_rgba(185,28,28,0.14)]',
    iconClassName: 'bg-red-500'
  }
};

// AppMessage 提供类似 Element UI Message 的页面级轻提示。
export function AppMessage({ notice, onClose }: AppMessageProps) {
  useEffect(() => {
    if (!notice) return;

    // timer 控制轻提示自动消失，避免用户提交后需要手动关闭。
    const timer = window.setTimeout(onClose, 3000);

    return () => window.clearTimeout(timer);
  }, [notice, onClose]);

  if (!notice) return null;

  const style = messageStyles[notice.type];

  return (
    <div className="fixed left-1/2 top-5 z-[70] w-[calc(100%-2rem)] max-w-md -translate-x-1/2" role="alert">
      <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold backdrop-blur ${style.className}`}>
        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-black text-white ${style.iconClassName}`} aria-hidden="true">{style.icon}</span>
        <p className="flex-1 leading-5">{notice.text}</p>
        <button className="-mr-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-lg leading-none opacity-60 transition hover:bg-slate-100 hover:opacity-100" onClick={onClose} type="button" aria-label="Close message">
          ×
        </button>
      </div>
    </div>
  );
}
