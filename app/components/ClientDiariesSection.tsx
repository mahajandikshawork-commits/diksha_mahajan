'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClientDiary, fetchFeaturedDiaries } from '@/lib/clientDiaries';

export default function ClientDiariesSection() {
  const [featuredEntries, setFeaturedEntries] = useState<ClientDiary[]>([]);

  useEffect(() => {
    fetchFeaturedDiaries().then(setFeaturedEntries);
  }, []);

  if (featuredEntries.length === 0) return null;

  return (
    <section className="py-8 bg-black">
      <div className="max-w-8xl mx-auto px-3 md:px-8">
        {/* Two Testimonials Parallel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative">
          {featuredEntries.map((entry, index) => (
            <div key={entry.id} className="text-center px-4">
              <div className="text-3xl text-[#DCC898] mb-2">&ldquo;</div>
              <p className="text-sm md:text-base font-light italic leading-relaxed text-white mb-3">
                {entry.testimonial}
              </p>
              <p className="text-xs tracking-wider uppercase text-white">
                &ndash; {entry.testimonial_author}
              </p>
              {index === 0 && featuredEntries.length === 2 && (
                <div className="md:hidden h-px bg-[#DCC898] w-full mt-8" />
              )}
            </div>
          ))}
          {featuredEntries.length === 2 && (
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-[#DCC898]" />
          )}
        </div>

        {/* Explore Their Story CTA */}
        <div className="text-center mt-10 md:mt-14">
          <Link
            href="/client-diaries"
            className="text-xs md:text-sm tracking-wider uppercase text-[#DCC898] hover:text-white transition-colors border-b border-[#DCC898] hover:border-white pb-1"
          >
            Shop from Their Story
          </Link>
        </div>
      </div>
    </section>
  );
}
