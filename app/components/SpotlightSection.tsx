 'use client';

 import { useEffect, useRef, useState } from 'react';
 import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import SpotlightCard from './SpotlightCard';
import { SpotlightEntry, fetchSpotlight } from '@/lib/spotlight';

export default function SpotlightSection() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [entries, setEntries] = useState<SpotlightEntry[]>([]);

  useEffect(() => {
    fetchSpotlight().then(setEntries);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.max(260, Math.floor(el.clientWidth * 0.8));
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (entries.length === 0) return null;

  return (
    <section className="py-16 md:pb-32 md:pt-16 bg-[#F5F1E8]">
      <div className="w-full mx-auto px-8">
        <h2 className="text-2xl md:text-4xl font-light tracking-[0.2em] text-center mb-4 uppercase">
          Celebrity Closet
        </h2>
        
        <p className="text-center text-gray-600 mb-12 text-base md:text-lg">
          where timelessness meets the women rewriting tradition
        </p>

        {/* Mobile & Tablet: Horizontal Scroll */}
        <div className="relative -mx-8 px-8">
          <div ref={scrollRef} className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
            {entries.map((entry) => (
              <div key={entry.id} className="w-64 md:w-80 flex-shrink-0">
                <SpotlightCard
                  title={entry.name}
                  images={entry.images}
                  href={entry.product_link}
                />
              </div>
            ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white border border-black/10 rounded-full w-9 h-9 flex items-center justify-center"
            aria-label="Scroll left"
          >
            <FiChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white border border-black/10 rounded-full w-9 h-9 flex items-center justify-center"
            aria-label="Scroll right"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
