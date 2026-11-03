'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { MediaFeature, formatMediaDate } from '@/lib/media';
import MediaLinks from '../components/MediaLinks';

// Filters appear only once the archive is big enough to need them.
const FILTER_THRESHOLD = 6;

// The press archive: every feature, newest first, as full-width panels that
// alternate image and story from side to side and melt into black.
export default function MediaArchive({ items }: { items: MediaFeature[] }) {
  const [filter, setFilter] = useState('All');

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    items.forEach((item) => counts.set(item.category, (counts.get(item.category) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name);
  }, [items]);

  const showFilters = items.length >= FILTER_THRESHOLD && categories.length > 1;
  const visible = filter === 'All' ? items : items.filter((item) => item.category === filter);

  return (
    <section aria-labelledby="archive-heading" className="bg-black text-white">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 pt-24 md:pt-32 pb-10 md:pb-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#DCC898]">The archive</p>
            <h2
              id="archive-heading"
              className="mt-4 font-display text-[clamp(2.5rem,4.6vw,4.5rem)] leading-[0.95] tracking-[-0.02em]"
            >
              Every feature, newest first
            </h2>
          </div>
          {showFilters && (
            <div role="group" aria-label="Filter by type" className="flex flex-wrap gap-2">
              {['All', ...categories].map((name) => {
                const selected = filter === name;
                return (
                  <button
                    key={name}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setFilter(name)}
                    className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition-colors ${
                      selected
                        ? 'border-[#DCC898] bg-[#DCC898] text-black'
                        : 'border-white/25 text-white/65 hover:border-white/60 hover:text-white'
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ol>
        {visible.map((item, index) => (
          <PressPanel key={item.slug} item={item} flip={index % 2 === 1} />
        ))}
      </ol>
    </section>
  );
}

function PressPanel({ item, flip }: { item: MediaFeature; flip: boolean }) {
  return (
    <li id={item.slug} className="relative isolate scroll-mt-28 overflow-hidden lg:flex lg:min-h-[38rem] lg:items-center">
      {/* Image: full bleed on its side, dissolving towards the story */}
      <div
        className={`relative h-[64svh] min-h-[24rem] lg:absolute lg:inset-y-0 lg:h-auto lg:min-h-0 lg:w-[62%] ${
          flip ? 'lg:right-0 press-fade-left' : 'lg:left-0 press-fade-right'
        }`}
      >
        <Image
          src={item.image}
          alt={`${item.publication}: ${item.title}`}
          fill
          quality={90}
          sizes="(min-width: 1024px) 62vw, 100vw"
          className="object-cover object-[50%_20%]"
        />
        <div
          className={`absolute inset-0 hidden lg:block ${
            flip
              ? 'bg-[linear-gradient(270deg,rgba(0,0,0,0)_45%,rgba(0,0,0,0.6)_80%,#000_100%)]'
              : 'bg-[linear-gradient(90deg,rgba(0,0,0,0)_45%,rgba(0,0,0,0.6)_80%,#000_100%)]'
          }`}
        />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black via-black/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      {/* Story */}
      <div className="relative mx-auto w-full max-w-[1320px] px-6 md:px-12 -mt-24 pb-16 lg:mt-0 lg:py-20">
        <div className={`lg:w-[42%] ${flip ? 'lg:mr-auto' : 'lg:ml-auto'}`}>
          <p className="flex items-center gap-5 text-[11px] uppercase tracking-[0.3em] text-[#DCC898]">
            <span>{item.category}</span>
            <time dateTime={item.date} className="text-white/55">{formatMediaDate(item.date)}</time>
          </p>

          <h3 className="mt-5 font-display text-[clamp(2.6rem,4.6vw,4.75rem)] leading-[0.94] tracking-[-0.02em]">
            {item.publication}
          </h3>

          {item.quote && (
            <blockquote className="mt-7 font-display italic text-[1.25rem] md:text-[1.45rem] leading-[1.3] text-white/90">
              &ldquo;{item.quote}&rdquo;
            </blockquote>
          )}

          <p className="mt-5 text-[15px] leading-7 text-white/80">{item.title}</p>
          {item.excerpt && <p className="mt-2 text-[14px] leading-7 text-white/50">{item.excerpt}</p>}

          <MediaLinks item={item} tone="dark" className="mt-8" />
        </div>
      </div>
    </li>
  );
}
