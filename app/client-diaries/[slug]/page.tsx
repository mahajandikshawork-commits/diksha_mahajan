'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BsWhatsapp } from 'react-icons/bs';
import clientDiariesData from '@/data/client-diaries.json';

export default function ClientDiaryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [resolvedSlug, setResolvedSlug] = useState<string | null>(null);

  // Resolve params promise
  useMemo(() => {
    params.then(p => setResolvedSlug(p.slug));
  }, [params]);

  const entry = useMemo(() => {
    if (!resolvedSlug) return null;
    return clientDiariesData.find(e => e.id === resolvedSlug);
  }, [resolvedSlug]);

  if (!resolvedSlug) {
    return (
      <div className="min-h-screen bg-white pt-28 flex items-center justify-center">
        <div className="animate-pulse text-gray-400 tracking-wider">Loading...</div>
      </div>
    );
  }

  if (!entry) {
    notFound();
  }

  const whatsappMessage = encodeURIComponent(`Hi Diksha Mahajan, I'd like to enquire about the "${entry.outfitName}" outfit from the Client Diaries.`);
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
        <span className="text-black">{entry.outfitName}</span>
      </div>

      {/* Title Section */}
      <section className="px-8 py-8 md:py-12 text-center max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-light tracking-[0.15em] uppercase mb-4">
          {entry.outfitName}
        </h1>
        <p className="text-sm md:text-base font-bold tracking-wide">
          {entry.clientName} <span className="font-normal text-gray-400">|</span> {entry.city} <span className="font-normal text-gray-400">|</span> {entry.occasion}
        </p>
      </section>

      {/* Description */}
      <section className="px-8 pb-8 md:pb-12 max-w-3xl mx-auto text-center">
        <p className="text-sm md:text-base text-gray-600 leading-relaxed font-light">
          {entry.description}
        </p>
      </section>

      {/* Gallery */}
      <section className="px-4 md:px-8 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto">
          {entry.images.length === 1 ? (
            <div className="relative w-full aspect-[3/4] max-w-2xl mx-auto overflow-hidden bg-gray-100">
              <Image
                src={entry.images[0]}
                alt={entry.outfitName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                onLoad={() => handleImageLoad(0)}
              />
            </div>
          ) : (
            <div className={`grid gap-4 md:gap-6 ${
              entry.images.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl' :
              entry.images.length === 3 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl' :
              entry.images.length === 4 ? 'grid-cols-2 md:grid-cols-2 max-w-4xl' :
              'grid-cols-2 md:grid-cols-3'
            } mx-auto`}>
              {entry.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative overflow-hidden bg-gray-100 cursor-pointer group ${
                    entry.images.length === 3 && index === 0 ? 'md:col-span-2 aspect-[16/9]' :
                    entry.images.length === 5 && index === 0 ? 'md:col-span-2 aspect-[3/2]' :
                    'aspect-[3/4]'
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  {!loadedImages.has(index) && (
                    <div className="absolute inset-0 animate-pulse bg-gray-200" />
                  )}
                  <Image
                    src={image}
                    alt={`${entry.outfitName} - Image ${index + 1}`}
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
      <section className="px-8 py-12 md:py-20 bg-[#F5F1E8]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-4xl text-[#DCC898] mb-4">&ldquo;</div>
          <p className="text-base md:text-xl font-light italic leading-relaxed text-gray-700 mb-6">
            {entry.testimonial}
          </p>
          <p className="text-sm tracking-wider uppercase text-gray-500">
            &ndash; {entry.testimonialAuthor}
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
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white text-2xl hover:opacity-70 transition-opacity"
            onClick={() => setSelectedImage(null)}
            aria-label="Close"
          >
            ✕
          </button>
          <div className="relative w-full h-full max-w-5xl max-h-[90vh]">
            <Image
              src={selectedImage}
              alt={entry.outfitName}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </div>
  );
}
