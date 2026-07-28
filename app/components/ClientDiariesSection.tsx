'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clientDiariesData from '@/data/client-diaries.json';

export default function ClientDiariesSection() {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const featuredEntries = clientDiariesData.filter(e => e.featuredOnHomepage);

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Title */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-light tracking-[0.2em] uppercase mb-3">
            Client Diaries
          </h2>
          <p className="text-sm md:text-base text-gray-500 font-light italic tracking-wide">
            Stories of women, occasions, and outfits crafted to be remembered
          </p>
        </div>

        {/* Two Testimonials Parallel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
          {featuredEntries.map((entry, index) => (
            <Link
              key={entry.id}
              href={`/client-diaries/${entry.id}`}
              className="group block"
            >
              {/* Image */}
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100 mb-6">
                {!loadedImages.has(index) && (
                  <div className="absolute inset-0 animate-pulse bg-gray-200" />
                )}
                <Image
                  src={entry.images[0]}
                  alt={entry.outfitName}
                  fill
                  className={`object-cover transition-all duration-700 group-hover:scale-105 ${
                    loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
                  }`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onLoad={() => handleImageLoad(index)}
                />
              </div>

              {/* Testimonial */}
              <div className="text-center px-4">
                <div className="text-3xl text-[#DCC898] mb-2">&ldquo;</div>
                <p className="text-sm md:text-base font-light italic leading-relaxed text-gray-700 mb-3">
                  {entry.testimonial}
                </p>
                <p className="text-xs tracking-wider uppercase text-gray-500">
                  &ndash; {entry.testimonialAuthor}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Explore Their Story CTA */}
        <div className="text-center mt-10 md:mt-14">
          <Link
            href="/client-diaries"
            className="inline-block border border-[#DCC898] px-8 py-3 text-xs md:text-sm tracking-wider uppercase text-[#DCC898] hover:bg-[#DCC898] hover:text-black transition-all duration-300"
          >
            Explore Their Story
          </Link>
        </div>
      </div>
    </section>
  );
}
