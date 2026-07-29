'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ClientDiary, fetchAllDiaries } from '@/lib/clientDiaries';

export default function ClientDiariesPage() {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [clientDiariesData, setClientDiariesData] = useState<ClientDiary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllDiaries().then((data) => {
      setClientDiariesData(data);
      setLoading(false);
    });
  }, []);

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  };

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-28">
      {/* Header Section */}
      <section className="px-8 py-12 md:py-20 text-center max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-light tracking-[0.15em] uppercase mb-6">
          Client Diaries
        </h1>
        <p className="text-sm md:text-lg text-gray-600 font-light italic tracking-wide leading-relaxed">
          Stories of women, occasions, and outfits crafted to be remembered
        </p>
        <p className="text-sm md:text-base text-gray-500 mt-6 leading-relaxed max-w-4xl mx-auto">
          A curated collection of client moments, outfit details, and personal testimonials from Diksha Mahajan. Every month, we spotlight one look that captures the spirit of the brand, from the craftsmanship to the occasion to the woman who wore it.
        </p>
      </section>

      {/* Client Diary Cards Grid */}
      <section className="px-4 md:px-8 pb-16 md:pb-24">
        {loading ? (
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-full aspect-[3/4] animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : clientDiariesData.length === 0 ? (
          <p className="text-center text-gray-400 py-16">
            No client diaries yet. Check back soon.
          </p>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {clientDiariesData.map((entry, index) => (
              <Link
                key={entry.id}
                href={`/client-diaries/${entry.slug}`}
                className="group block"
              >
                {/* Image */}
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100">
                  {!loadedImages.has(index) && (
                    <div className="absolute inset-0 animate-pulse bg-gray-200" />
                  )}
                  <Image
                    src={entry.images[0]}
                    alt={entry.outfit_name}
                    fill
                    className={`object-cover transition-all duration-700 group-hover:scale-105 ${
                      loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
                    }`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    onLoad={() => handleImageLoad(index)}
                  />
                </div>

                {/* Text Content */}
                <div className="pt-5 text-center">
                  <h2 className="text-lg md:text-xl font-light tracking-wider uppercase mb-2">
                    {entry.outfit_name}
                  </h2>
                  <p className="text-sm font-semibold tracking-wide mb-4">
                    {entry.client_name} <span className="font-normal text-gray-400">|</span> {entry.city} <span className="font-normal text-gray-400">|</span> {entry.occasion}
                  </p>

                  {/* Explore Full Story - Gold Border Box */}
                  <div className="inline-block border border-[#DCC898] px-6 py-2.5 text-xs tracking-wider uppercase text-[#DCC898] group-hover:bg-[#DCC898] group-hover:text-black transition-all duration-300">
                    Explore Full Story
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Closing CTA Section */}
      <section className="px-8 py-16 md:py-24 text-center bg-[#F5F1E8]">
        <div className="max-w-3xl mx-auto">
          <p className="text-base md:text-lg font-light leading-relaxed text-gray-700 mb-8">
            If one of our client stories speaks to you, we&apos;d be delighted to help you create something similar for your occasion.
          </p>
          <Link
            href="/book-appointment"
            className="inline-block relative md:px-12 px-8 py-3 border-1 border-black text-black font-medium tracking-wider text-xs md:text-base uppercase overflow-hidden group"
          >
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">
              Book Your Appointment
            </span>
            <div className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
          </Link>
        </div>
      </section>
    </div>
  );
}
