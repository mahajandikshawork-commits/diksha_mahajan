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
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Two Testimonials Parallel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {featuredEntries.map((entry) => (
            <div key={entry.id} className="text-center px-4">
              <div className="text-3xl text-[#DCC898] mb-2">&ldquo;</div>
              <p className="text-sm md:text-base font-light italic leading-relaxed text-gray-700 mb-3">
                {entry.testimonial}
              </p>
              <p className="text-xs tracking-wider uppercase text-gray-500">
                &ndash; {entry.testimonial_author}
              </p>
            </div>
          ))}
        </div>

        {/* Explore Their Story CTA */}
        <div className="text-center mt-10 md:mt-14">
          <Link
            href="/client-diaries"
            className="inline-block relative md:px-12 px-8 py-3 border-1 border-black text-black font-medium tracking-wider text-xs md:text-base uppercase overflow-hidden group"
          >
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">
              Explore Their Story
            </span>
            <div className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
          </Link>
        </div>
      </div>
    </section>
  );
}
