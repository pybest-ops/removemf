'use client';

import Image from 'next/image';
import { useState } from 'react';
import matchaExample from '@/app/assets/matcha-example.avif';
import normalExample from '@/app/assets/normal-example.avif';

// BeforeAfterSlider 用本地示例图展示滤镜移除前后的可拖动对比。
export function BeforeAfterSlider() {
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <div className="relative aspect-[16/11] overflow-hidden bg-slate-100">
      <Image alt="Matcha filter example" className="absolute inset-0 h-full w-full object-cover" fill priority sizes="(min-width: 1024px) 520px, 100vw" src={matchaExample} />
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${sliderValue}%)` }}>
        <Image alt="Natural color example" className="h-full w-full object-cover" fill priority sizes="(min-width: 1024px) 520px, 100vw" src={normalExample} />
      </div>
      <div className="absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `${sliderValue}%` }} />
      <div className="absolute bottom-4 left-4 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold text-white">Matcha filter</div>
      <div className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">Restored</div>
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
      <div className="pointer-events-none absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-900 shadow" style={{ left: `${sliderValue}%` }}>
        ↔
      </div>
    </div>
  );
}
