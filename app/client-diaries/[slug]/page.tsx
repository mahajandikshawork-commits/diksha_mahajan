'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BsWhatsapp } from 'react-icons/bs';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { ClientDiary, fetchDiaryBySlug } from '@/lib/clientDiaries';

export default function ClientDiaryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [entry, setEntry] = useState<ClientDiary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiaryBySlug(slug).then((diary) => {
      setEntry(diary);
      setLoading(false);
    });
  }, [slug]);

  useEffect(() => {
    if (lightboxIndex === null || !entry) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft')
        setLightboxIndex(prev => prev === null ? 0 : (prev - 1 + entry.images.length) % entry.images.length);
      if (e.key === 'ArrowRight')
        setLightboxIndex(prev => prev === null ? 0 : (prev + 1) % entry.images.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, entry]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-28 flex items-center justify-center">
        <div className="animate-pulse text-gray-400 tracking-wider">Loading...</div>
      </div>
    );
  }

  if (!entry) {
    notFound();
  }

  const whatsappMessage = encodeURIComponent(`Hi Diksha Mahajan, I'd like to enquire about the "${entry.outfit_name}" outfit from the Client Diaries.`);
  const whatsappUrl = `https://wa.me/919871907315?text=${whatsappMessage}`;

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  };

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-28">
      {/* Breadcrumb */}
      <div className="px-8 py-4 text-xs tracking-wider uppercase text-gray-500">
        <Link href="/client-diaries" className="hover:text-black transition-colors">
          Client Diaries
        </Link>
        <span className="mx-2">/</span>
        <span className="text-black">{entry.outfit_name}</span>
      </div>

      {/* Title Section */}
      <section className="px-8 py-8 md:py-12 text-center max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-light tracking-[0.15em] uppercase mb-4">
          {entry.outfit_name}
        </h1>
        <p className="text-sm md:text-base font-light tracking-wide">
          {entry.client_name} <span className="font-normal text-gray-400">|</span> {entry.city} <span className="font-normal text-gray-400">|</span> {entry.occasion}
        </p>
      </section>

      {/* Description */}
      <section className="px-8 pb-8 md:pb-12 max-w-3xl mx-auto text-center">
        <p className="text-sm md:text-base text-gray-600 leading-relaxed font-light">
          {entry.description}
        </p>
      </section>

      {/* Gallery */}
      <section className="px-4 md:px-8 pb-0">
        <div className="max-w-7xl mx-auto">
          {entry.images.length === 1 ? (
            <div className="relative w-full aspect-[3/4] max-w-2xl mx-auto overflow-hidden bg-gray-100">
              <Image
                src={entry.images[0]}
                alt={entry.outfit_name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                onLoad={() => handleImageLoad(0)}
              />
            </div>
          ) : (
            <div className={`grid grid-cols-2 gap-3 md:gap-6 mx-auto ${
              entry.images.length === 2 || entry.images.length === 4
                ? 'md:grid-cols-2 max-w-4xl'
                : 'md:grid-cols-3'
            }`}>
              {entry.images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-[3/4] overflow-hidden bg-gray-100 cursor-pointer group"
                  onClick={() => setLightboxIndex(index)}
                >
                  {!loadedImages.has(index) && (
                    <div className="absolute inset-0 animate-pulse bg-gray-200" />
                  )}
                  <Image
                    src={image}
                    alt={`${entry.outfit_name} - Image ${index + 1}`}
                    fill
                    className={`object-cover transition-all duration-500 group-hover:scale-105 ${
                      loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
                    }`}
                    sizes="(max-width: 768px) 50vw, 33vw"
                    onLoad={() => handleImageLoad(index)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTAs */}
      <section className="px-8 py-8 md:py-12 text-center">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 relative md:px-10 px-8 py-3 border-1 border-[#25D366] text-[#25D366] font-medium tracking-wider text-xs md:text-sm uppercase overflow-hidden group"
          >
            <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center gap-2">
              <BsWhatsapp size={16} />
              Enquire About This Look
            </span>
            <div className="absolute inset-0 bg-[#25D366] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
          </a>
          <Link
            href="/book-appointment"
            className="inline-block relative md:px-10 px-8 py-3 border-1 border-black text-black font-medium tracking-wider text-xs md:text-sm uppercase overflow-hidden group"
          >
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">
              Book an Appointment
            </span>
            <div className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
          </Link>
        </div>
      </section>

      {/* Client Testimonial */}
      <section className="px-8 py-8 bg-[#F5F1E8]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-4xl text-[#DCC898] mb-4">&ldquo;</div>
          <p className="text-base md:text-xl font-light italic leading-relaxed text-gray-700 mb-6">
            {entry.testimonial}
          </p>
          <p className="text-sm tracking-wider uppercase text-gray-500">
            &ndash; {entry.testimonial_author}
          </p>
        </div>
      </section>

      {/* Back to Client Diaries */}
      <section className="px-8 py-12 text-center">
        <Link
          href="/client-diaries"
          className="text-xs md:text-sm tracking-wider uppercase text-gray-500 hover:text-black transition-colors border-b border-gray-300 hover:border-black pb-1"
        >
          Back to Client Diaries
        </Link>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && entry && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute top-6 right-6 text-white text-2xl hover:opacity-70 transition-opacity z-10"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close"
          >
            ✕
          </button>

          {entry.images.length > 1 && (
            <>
              <button
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) =>
                    prev === null ? 0 : (prev - 1 + entry.images.length) % entry.images.length
                  );
                }}
                aria-label="Previous image"
              >
                <FiChevronLeft size={24} />
              </button>
              <button
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) =>
                    prev === null ? 0 : (prev + 1) % entry.images.length
                  );
                }}
                aria-label="Next image"
              >
                <FiChevronRight size={24} />
              </button>
            </>
          )}

          <div className="relative w-full h-full max-w-5xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={entry.images[lightboxIndex]}
              alt={`${entry.outfit_name} - Image ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {entry.images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm tracking-wider">
              {lightboxIndex + 1} / {entry.images.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
