'use client';

import { AppMessage } from '@/components/AppMessage';
import type { AppMessageNotice } from '@/components/AppMessage';
import { usePathname } from 'next/navigation';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

type FeedbackType = 'idea' | 'bug' | 'praise' | 'other';

type FeedbackResponse = {
  errorMessage?: string;
  ok?: boolean;
};

// feedbackTypes 定义弹窗中可选的反馈业务类型。
const feedbackTypes: Array<{ icon: string; label: string; value: FeedbackType }> = [
  { icon: '💡', label: 'Idea', value: 'idea' },
  { icon: '🐛', label: 'Bug', value: 'bug' },
  { icon: '💚', label: 'Praise', value: 'praise' },
  { icon: '💬', label: 'Other', value: 'other' }
];

// visiblePaths 控制反馈入口只出现在核心转化页面。
const visiblePaths = new Set(['/', '/matcha-filter-remover', '/pricing']);

// maxMessageLength 与服务端校验保持一致，避免用户提交后才发现超长。
const maxMessageLength = 2000;

// FeedbackWidget 提供全站核心页面的悬浮反馈入口和提交弹窗。
export function FeedbackWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('idea');
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  // notice 保存当前反馈提交触发的页面级轻提示。
  const [notice, setNotice] = useState<AppMessageNotice | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isVisible = useMemo(() => visiblePaths.has(pathname), [pathname]);
  const remainingCharacters = maxMessageLength - message.length;

  // handleMessageClose 关闭顶部轻提示，供自动关闭和手动关闭复用。
  const handleMessageClose = useCallback(() => setNotice(null), []);

  useEffect(() => {
    if (!isOpen) return;

    // handleKeyDown 让键盘用户可以通过 Escape 关闭反馈弹窗。
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isVisible) return null;

  // handleOpen 打开反馈弹窗，并清理上一次提交后的提示状态。
  function handleOpen() {
    setNotice(null);
    setIsOpen(true);
  }

  // handleClose 关闭反馈弹窗，保留用户已输入但未提交的内容。
  function handleClose() {
    if (isSubmitting) return;

    setIsOpen(false);
  }

  // handleSubmit 校验并提交用户反馈到后端接口。
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      setNotice({ type: 'error', text: 'Please write a message before sending feedback.' });
      return;
    }

    if (trimmedMessage.length > maxMessageLength) {
      setNotice({ type: 'error', text: `Feedback must be ${maxMessageLength} characters or less.` });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: feedbackType,
          message: trimmedMessage,
          contact: contact.trim() || undefined,
          pagePath: pathname
        })
      });
      const result = (await response.json()) as FeedbackResponse;

      if (!response.ok || !result.ok) throw new Error(result.errorMessage ?? 'Unable to send feedback right now.');

      setMessage('');
      setContact('');
      setFeedbackType('idea');
      setNotice({ type: 'success', text: 'Thanks — your feedback was sent.' });
    } catch (error) {
      setNotice({ type: 'error', text: error instanceof Error ? error.message : 'Unable to send feedback right now.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <AppMessage notice={notice} onClose={handleMessageClose} />

      <button
        aria-haspopup="dialog"
        className="fixed bottom-4 right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-violet-400 via-matcha-300 to-cyan-300 text-slate-950 shadow-[0_14px_36px_rgba(39,131,58,0.20)] ring-1 ring-white/70 transition duration-300 hover:-translate-y-0.5 hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-matcha-300/45 md:bottom-7 md:right-7 md:h-auto md:w-auto md:gap-2 md:px-4 md:py-2.5 md:text-xs md:font-extrabold md:uppercase md:tracking-[0.16em]"
        onClick={handleOpen}
        type="button"
      >
        <svg className="feedback-fab-icon h-7 w-7 md:h-4 md:w-4" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
        <span className="hidden md:inline">Feedback</span>
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-5 py-4 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
          <button className="absolute inset-0 cursor-default" onClick={handleClose} type="button" aria-label="Close feedback dialog" />
          <form className="relative w-full max-w-[30rem] overflow-hidden rounded-[1.5rem] border border-white/80 bg-[#f7faf7]/95 p-3 shadow-[0_24px_80px_rgba(15,23,42,0.24)] backdrop-blur-xl md:rounded-[1.75rem] md:p-5" onSubmit={handleSubmit}>
            <div className="pointer-events-none absolute -right-14 -top-16 h-44 w-44 rounded-full bg-matcha-200/70 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-14 h-44 w-44 rounded-full bg-cyan-100/70 blur-3xl" />
            <div className="relative">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="w-fit rounded-full border border-matcha-200 bg-white/70 px-3 py-1 text-[0.64rem] font-bold uppercase tracking-[0.18em] text-matcha-800 shadow-sm">Matcha feedback</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.045em] text-slate-950 md:text-3xl" id="feedback-title">Send feedback</h2>
                  <p className="mt-1.5 max-w-xl text-xs leading-5 text-slate-600 md:text-sm">Bugs, ideas, praise, or a quick note.</p>
                </div>
                <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-matcha-200 bg-white/80 text-xl leading-none text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-4 focus:ring-matcha-300/35" onClick={handleClose} type="button" aria-label="Close feedback dialog">
                  ×
                </button>
              </div>

              <fieldset className="mt-4">
                <legend className="text-xs font-bold uppercase tracking-[0.22em] text-slate-800">Feedback type</legend>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {feedbackTypes.map((item) => {
                    const isSelected = feedbackType === item.value;

                    return (
                      <button
                        className={`rounded-2xl border px-2 py-2 text-center shadow-sm transition duration-300 focus:outline-none focus:ring-4 focus:ring-matcha-300/30 ${isSelected ? 'border-matcha-300 bg-matcha-50 text-matcha-900 shadow-[0_18px_45px_rgba(31,82,44,0.12)]' : 'border-white/80 bg-white/70 text-slate-700 hover:-translate-y-0.5 hover:bg-white'}`}
                        key={item.value}
                        onClick={() => setFeedbackType(item.value)}
                        type="button"
                      >
                        <span className="block text-base md:text-lg" aria-hidden="true">{item.icon}</span>
                        <span className="mt-1 block text-[0.58rem] font-extrabold uppercase tracking-[0.12em] md:text-[0.64rem]">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <label className="mt-4 block" htmlFor="feedback-message">
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-slate-800">Your message</span>
                <textarea
                  className="mt-2 min-h-20 w-full resize-y rounded-[1.1rem] border border-matcha-200 bg-white/80 px-3.5 py-2.5 text-sm text-slate-950 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-matcha-400 focus:ring-4 focus:ring-matcha-300/25 md:min-h-24 md:text-base"
                  id="feedback-message"
                  maxLength={maxMessageLength}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="What worked, what did not, what you wish existed..."
                  value={message}
                />
              </label>
              <p className={`mt-1.5 text-right text-xs font-semibold ${remainingCharacters < 0 ? 'text-red-600' : 'text-slate-400'}`}>{message.length}/{maxMessageLength}</p>

              <label className="mt-3 block" htmlFor="feedback-contact">
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-slate-800">Email or handle <span className="normal-case tracking-normal text-slate-500">optional</span></span>
                <input
                  className="mt-2 w-full rounded-full border border-matcha-200 bg-white/80 px-3.5 py-2 text-sm text-slate-950 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-matcha-400 focus:ring-4 focus:ring-matcha-300/25 md:text-base"
                  id="feedback-contact"
                  onChange={(event) => setContact(event.target.value)}
                  placeholder="So we can reply if needed"
                  type="text"
                  value={contact}
                />
              </label>

              <button
                className="mt-4 inline-flex w-full justify-center rounded-full bg-gradient-to-r from-violet-400 via-matcha-300 to-cyan-300 px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-950 shadow-lg shadow-emerald-400/20 transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 md:text-sm"
                disabled={isSubmitting || !message.trim()}
                type="submit"
              >
                {isSubmitting ? 'Sending...' : 'Send feedback'}
              </button>
              <p className="mt-2.5 text-center text-[0.68rem] leading-4 text-slate-500 md:text-xs md:leading-5">Anonymous unless you add contact details. The current page is saved with your message.</p>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
