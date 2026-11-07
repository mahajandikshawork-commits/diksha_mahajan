'use client';

import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  PublicationGroup,
  formatMediaDate,
  isExternal,
  mediaLinkLabel,
} from '@/lib/media';
import MediaLinks from './MediaLinks';

interface MediaShowcaseProps {
  groups: PublicationGroup[];
}

const SLIDE_MS = 8000;

// Homepage "In the press": a cinematic slide per publication. The masthead
// rises in, the cover slowly settles, and the index bar at the bottom shows
// the timer for the current slide.
export default function MediaShowcase({ groups }: MediaShowcaseProps) {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(groups.length > 1);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const elapsed = useRef(0);
  const group = groups[active];
  const lead = group.items[0];
  const more = group.items.slice(1);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setAutoplay(false);
  }, []);

  // Reset the progress bars whenever the slide changes (the timer writes to
  // them directly, outside React).
  useEffect(() => {
    barRefs.current.forEach((bar, index) => {
      if (bar) bar.style.transform = `scaleX(${index === active && !autoplay ? 1 : 0})`;
    });
  }, [active, autoplay]);

  // Timer: advances every frame while the tab is visible.
  useEffect(() => {
    if (!autoplay) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (document.visibilityState === 'visible') {
        elapsed.current += dt;
      }
      const bar = barRefs.current[active];
      if (bar) bar.style.transform = `scaleX(${Math.min(elapsed.current / SLIDE_MS, 1)})`;
      if (elapsed.current >= SLIDE_MS) {
        elapsed.current = 0;
        setActive((i) => (i + 1) % groups.length);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, autoplay, groups.length]);

  const choose = useCallback((index: number) => {
    elapsed.current = 0;
    setActive(index);
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next: number | null = null;
    if (event.key in keys) next = (active + keys[event.key] + groups.length) % groups.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = groups.length - 1;
    if (next === null) return;
    event.preventDefault();
    choose(next);
    tabRefs.current[next]?.focus();
  };

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section
      aria-labelledby="press-heading"
      aria-roledescription="carousel"
      className="relative isolate min-h-[calc(100svh-6rem)] overflow-hidden bg-black text-white"
    >
      {/* Covers */}
      <div className="absolute inset-0 -z-10">
        {groups.map((g, index) => {
          const isActive = index === active;
          return (
            <div
              key={g.publication}
              aria-hidden={!isActive}
              className={`press-fade-right absolute inset-y-0 left-0 w-full lg:w-[62%] transition-opacity duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={g.items[0].image}
                alt={isActive ? `${g.publication}: ${g.items[0].title}` : ''}
                fill
                quality={90}
                priority={index === 0}
                sizes="(min-width: 1024px) 62vw, 100vw"
                className={`${g.items[0].imageFit === 'contain' ? 'object-contain' : 'object-cover object-[50%_18%]'} motion-safe:transition-transform motion-safe:ease-out ${
                  isActive ? 'scale-100 duration-[9000ms]' : 'scale-[1.05] duration-0'
                }`}
              />
            </div>
          );
        })}
        {/* Shading: keep type legible, melt the image into the page */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/25 lg:hidden" />
        <div className="absolute inset-0 hidden lg:block bg-[linear-gradient(90deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0)_28%,rgba(0,0,0,0.9)_50%,#000_60%)] xl:bg-[linear-gradient(90deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0)_30%,rgba(0,0,0,0.9)_56%,#000_64%)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="mx-auto flex min-h-[inherit] max-w-[1320px] flex-col px-6 md:px-12 pt-24 md:pt-28 pb-7 md:pb-9">
        {/* Story */}
        <div className="mt-auto pt-[30svh] lg:pt-6 lg:my-auto lg:ml-auto lg:w-[48%] xl:w-[44%] lg:pb-6">
          <div className="mb-6 flex items-center justify-between gap-6">
            <h2 id="press-heading" className="text-[11px] uppercase tracking-[0.35em] text-white/60">
              In the press
            </h2>
            <Link
              href="/media"
              className="border-b border-white/30 pb-1 text-[11px] uppercase tracking-[0.25em] text-white/80 hover:text-white hover:border-white transition-colors"
            >
              View all press
            </Link>
          </div>
          <div
            key={group.publication}
            id="press-panel"
            role="tabpanel"
            aria-labelledby={`press-tab-${active}`}
          >
            <p
              className="press-fade flex items-center gap-5 text-[11px] uppercase tracking-[0.3em] text-[#DCC898]"
              style={{ animationDelay: '150ms' }}
            >
              <span>{group.items.length > 1 ? `${group.items.length} features` : lead.category}</span>
              <time dateTime={lead.date} className="text-white/55">
                {formatMediaDate(lead.date, 'short')}
              </time>
            </p>

            <h3 className="mt-4 pb-[0.12em]">
              <span className="press-rise block font-display text-[clamp(2.75rem,5.2vw,5.25rem)] leading-[0.94] tracking-[-0.02em]">
                {group.publication}
              </span>
            </h3>

            <p
              className="press-fade mt-5 max-w-[32rem] font-display italic text-[1.25rem] md:text-[1.45rem] leading-[1.3] text-white/90"
              style={{ animationDelay: '350ms' }}
            >
              {lead.title}
            </p>

            <div className="press-fade mt-4 max-w-[32rem]" style={{ animationDelay: '450ms' }}>
              {lead.excerpt && more.length === 0 && (
                <p className="hidden md:block text-[13px] leading-6 text-white/55 line-clamp-3">{lead.excerpt}</p>
              )}
              <MediaLinks item={lead} tone="dark" className="mt-6" />

              {more.map((item) => (
                <div
                  key={item.slug}
                  className="mt-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-t border-white/15 pt-4"
                >
                  <p className="text-[13px] leading-6 text-white/70">
                    <span className="block text-[10px] uppercase tracking-[0.3em] text-white/40">
                      Also: {item.category}, {formatMediaDate(item.date, 'short')}
                    </span>
                    {item.title}
                  </p>
                  {item.url && (
                    <a
                      href={item.url}
                      {...(isExternal(item.url) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="shrink-0 border-b border-white/30 pb-1 text-[11px] uppercase tracking-[0.22em] text-white/80 hover:text-white hover:border-white transition-colors"
                    >
                      {mediaLinkLabel(item)}
                      {isExternal(item.url) && <span className="sr-only"> (opens in a new tab)</span>}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Index bar with the slide timer */}
        <div
          role="tablist"
          aria-label="Publications"
          onKeyDown={onKeyDown}
          className="mt-10 lg:mt-8 grid gap-4 md:gap-8"
          style={{ gridTemplateColumns: `repeat(${groups.length}, minmax(0, 1fr))` }}
        >
          {groups.map((g, index) => {
            const isActive = index === active;
            return (
              <button
                key={g.publication}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`press-tab-${index}`}
                aria-selected={isActive}
                aria-controls="press-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => choose(index)}
                className="group py-2 text-left focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#DCC898]"
              >
                <span className="relative block h-px w-full overflow-hidden bg-white/20">
                  <span
                    ref={(el) => {
                      barRefs.current[index] = el;
                    }}
                    className="absolute inset-y-0 left-0 w-full origin-left bg-[#DCC898]"
                    style={{ transform: `scaleX(${isActive && !autoplay ? 1 : 0})` }}
                  />
                </span>
                <span className="mt-3 flex items-baseline gap-3">
                  <span
                    className={`text-[11px] tabular-nums tracking-[0.2em] transition-colors ${
                      isActive ? 'text-[#DCC898]' : 'text-white/40'
                    }`}
                  >
                    {pad(index + 1)}
                  </span>
                  <span
                    className={`hidden sm:block truncate text-[11px] uppercase tracking-[0.22em] transition-colors duration-500 ${
                      isActive ? 'text-white' : 'text-white/45 group-hover:text-white/80'
                    }`}
                  >
                    {g.publication}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
