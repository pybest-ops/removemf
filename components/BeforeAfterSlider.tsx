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
      <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-slate-950/70 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur">Matcha filter</div>
      <div className="absolute right-4 top-4 rounded-full border border-white/70 bg-white/85 px-3 py-1 text-xs font-semibold text-slate-900 shadow-lg backdrop-blur">Restored</div>
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
      <div className="pointer-events-none absolute top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/90 text-sm font-semibold text-slate-900 shadow-[0_18px_45px_rgba(15,23,42,0.25)] backdrop-blur" style={{ left: `${sliderValue}%` }}>
        ↔
      </div>
      <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/20 bg-slate-950/55 px-4 py-3 text-xs font-medium text-white shadow-lg backdrop-blur">
        <span>Drag to compare</span>
        <span className="text-matcha-100">Natural color recovery</span>
      </div>
    </div>
  );
}
