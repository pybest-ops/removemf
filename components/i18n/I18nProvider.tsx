'use client';

import { createContext, useContext } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';

// I18nContextValue 定义客户端组件读取当前语言和文案的上下文结构。
type I18nContextValue = {
  dictionary: Dictionary;
  locale: Locale;
};

// I18nContext 为上传、图库、支付等客户端组件提供当前语言包。
const I18nContext = createContext<I18nContextValue | null>(null);

// I18nProvider 将服务端识别出的语言包下发给客户端交互组件。
export function I18nProvider({ children, dictionary, locale }: I18nContextValue & { children: React.ReactNode }) {
  return <I18nContext.Provider value={{ dictionary, locale }}>{children}</I18nContext.Provider>;
}

// useI18n 供客户端组件读取当前语言和对应文案。
export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) throw new Error('useI18n must be used inside I18nProvider.');

  return context;
}
