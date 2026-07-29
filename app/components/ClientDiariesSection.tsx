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
      <div className="max-w-8xl mx-auto px-4 md:px-8">
        {/* Two Testimonials Parallel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {featuredEntries.map((entry) => (
            <div key={entry.id} className="text-center px-4">
              <div className="text-3xl text-[#DCC898] mb-2">&ldquo;</div>
              <p className="text-sm md:text-base font-light italic leading-relaxed text-white mb-3">
                {entry.testimonial}
              </p>
              <p className="text-xs tracking-wider uppercase text-white">
                &ndash; {entry.testimonial_author}
              </p>
            </div>
          ))}
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
