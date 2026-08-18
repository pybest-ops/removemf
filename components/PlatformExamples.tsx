'use client';

import Image from 'next/image';
import { useState } from 'react';

// ExampleItem 定义单个 Before/After 示例的数据结构。
interface ExampleItem {
  title: string;
  description: string;
  beforeUrl: string;
  afterUrl: string;
}

// PlatformExamples 展示平台专属的 Before/After 滑动对比示例。
export function PlatformExamples({ 
  platform, 
  examples 
}: { 
  platform: 'tiktok' | 'youtube';
  examples: ExampleItem[];
}) {
  const aspectRatio = platform === 'tiktok' ? 'aspect-[9/16] max-h-[420px]' : 'aspect-video';

  return (
    <section className="rounded-[2.5rem] border border-white/70 bg-white/65 p-6 shadow-[0_30px_100px_rgba(31,82,44,0.16)] backdrop-blur-xl md:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-matcha-700">
        {platform === 'tiktok' ? 'TikTok Examples' : 'YouTube Examples'}
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950 md:text-4xl">
        Before & After comparison
      </h2>
      <p className="mt-3 text-base leading-7 text-slate-600">
        Drag the slider to compare the Before (with matcha filter) and After (cleaned) versions.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {examples.map((example) => (
          <BeforeAfterCard 
            key={example.title}
            example={example}
            aspectRatio={aspectRatio}
          />
        ))}
      </div>
    </section>
  );
}

// BeforeAfterCard 单个示例的滑动对比卡片。
function BeforeAfterCard({ 
  example, 
  aspectRatio 
}: { 
  example: ExampleItem;
  aspectRatio: string;
}) {
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/80 bg-white/70 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(31,82,44,0.16)]">
      <div className={`relative w-full ${aspectRatio} overflow-hidden rounded-t-3xl bg-slate-100`}>
        {/* After 版本（底层，清理后） */}
        <Image
          alt={`${example.title} - After`}
          className="absolute inset-0 h-full w-full object-cover"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          src={example.afterUrl}
        />
        {/* Before 版本（上层，带滤镜，通过 clip-path 裁剪） */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }}
        >
          <Image
            alt={`${example.title} - Before`}
            className="h-full w-full object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            src={example.beforeUrl}
          />
        </div>
        {/* 分割线 */}
        <div 
          className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_24px_rgba(255,255,255,0.9)]"
          style={{ left: `${sliderValue}%` }}
        />
        {/* 拖动按钮 */}
        <div 
          className="pointer-events-none absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/90 text-xs font-semibold text-slate-900 shadow-[0_18px_45px_rgba(15,23,42,0.25)] backdrop-blur"
          style={{ left: `${sliderValue}%` }}
        >
          ↔
        </div>
        {/* 标签 */}
        <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-slate-950/70 px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg backdrop-blur sm:left-4 sm:top-4 sm:px-3 sm:text-xs">
          Before
        </div>
        <div className="absolute right-3 top-3 rounded-full border border-white/70 bg-white/85 px-2.5 py-1 text-[10px] font-semibold text-slate-900 shadow-lg backdrop-blur sm:right-4 sm:top-4 sm:px-3 sm:text-xs">
          After
        </div>
        {/* 滑块输入 */}
        <label className="sr-only" htmlFor={`slider-${example.title}`}>Compare before and after</label>
        <input
          id={`slider-${example.title}`}
          aria-label="Compare before and after"
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          max="100"
          min="0"
          onChange={(event) => setSliderValue(Number(event.target.value))}
          type="range"
          value={sliderValue}
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-slate-950">{example.title}</h3>
        <p className="mt-1 text-xs leading-5 text-slate-600">{example.description}</p>
      </div>
    </article>
  );
}

// TikTok 示例数据
export const tiktokExamples: ExampleItem[] = [
  {
    title: 'Selfie / Portrait',
    description: 'TikTok selfie with matcha-style green tint. Skin looks unnatural after saving.',
    beforeUrl: '/examples/apply-matcha-tiktok-selfie.jpg',
    afterUrl: '/examples/tiktok-selfie.jpg'
  },
  {
    title: 'Food / Coffee',
    description: 'Food photo with olive-green cast. White plates look yellow after the filter.',
    beforeUrl: '/examples/apply-matcha-tiktok-food.jpg',
    afterUrl: '/examples/tiktok-food.jpg'
  },
  {
    title: 'Beauty / Skincare',
    description: 'Beauty tutorial screenshot with green tint. Skin and product colors look off after saving.',
    beforeUrl: '/examples/apply-matcha-tiktok-beauty.jpg',
    afterUrl: '/examples/tiktok-beauty.jpg'
  }
];

// YouTube 示例数据
export const youtubeExamples: ExampleItem[] = [
  {
    title: 'Vlog Thumbnail',
    description: 'YouTube thumbnail with warm green tint. Face looks off-color for repurposing.',
    beforeUrl: '/examples/apply-matcha-youtube-vlog.jpg',
    afterUrl: '/examples/youtube-vlog.jpg'
  },
  {
    title: 'Tutorial Screenshot',
    description: 'Tutorial frame with yellow cast. White background and text areas look tinted.',
    beforeUrl: '/examples/apply-matcha-youtube-tutorial.jpg',
    afterUrl: '/examples/youtube-tutorial.jpg'
  },
  {
    title: 'Talking Head',
    description: 'Talking head clip with matcha filter. Skin tone looks unnatural when saved.',
    beforeUrl: '/examples/apply-matcha-youtube-talking.jpg',
    afterUrl: '/examples/youtube-talking.jpg'
  }
];
