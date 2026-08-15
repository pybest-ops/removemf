'use client';

import Image from 'next/image';
import { useState } from 'react';
import matchaExample from '@/app/assets/matcha-example.png';
import normalExample from '@/app/assets/normal-example.png';

// BeforeAfterSlider 用本地示例图展示滤镜移除前后的可拖动对比。
export function BeforeAfterSlider() {
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <div className="relative aspect-[16/11] overflow-hidden rounded-[1.6rem] bg-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
      <Image alt="Matcha filter example" className="absolute inset-0 h-full w-full object-cover" fill priority sizes="(min-width: 1024px) 520px, 100vw" src={matchaExample} />
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${sliderValue}%)` }}>
        <Image alt="Natural color example" className="h-full w-full object-cover" fill priority sizes="(min-width: 1024px) 520px, 100vw" src={normalExample} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-white/10" />
      <div className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_24px_rgba(255,255,255,0.9)]" style={{ left: `${sliderValue}%` }} />
      <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-slate-950/70 px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg backdrop-blur sm:left-4 sm:top-4 sm:px-3 sm:text-xs">Matcha filter</div>
      <div className="absolute right-3 top-3 rounded-full border border-white/70 bg-white/85 px-2.5 py-1 text-[10px] font-semibold text-slate-900 shadow-lg backdrop-blur sm:right-4 sm:top-4 sm:px-3 sm:text-xs">Restored</div>
      <label className="sr-only" htmlFor="hero-before-after-slider">Compare matcha filter and restored photo</label>
      <input
        id="hero-before-after-slider"
        aria-label="Compare matcha filter and restored photo"
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        max="100"
        min="0"
        onChange={(event) => setSliderValue(Number(event.target.value))}
        type="range"
        value={sliderValue}
      />
      <div className="pointer-events-none absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/90 text-xs font-semibold text-slate-900 shadow-[0_18px_45px_rgba(15,23,42,0.25)] backdrop-blur sm:h-12 sm:w-12 sm:text-sm" style={{ left: `${sliderValue}%` }}>
        ↔
      </div>
      <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-center rounded-2xl border border-white/20 bg-slate-950/55 px-3 py-2 text-[10px] font-medium text-white shadow-lg backdrop-blur sm:bottom-4 sm:left-4 sm:right-4 sm:justify-between sm:px-4 sm:py-3 sm:text-xs">
        <span>Drag to compare</span>
        <span className="hidden text-matcha-100 sm:inline">Natural color recovery</span>
      </div>
    </div>
  );
}
