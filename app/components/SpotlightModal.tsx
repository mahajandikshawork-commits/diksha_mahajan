'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface SpotlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  images: string[];
  slug: string;
}

export default function SpotlightModal({ isOpen, onClose, title, images, slug }: SpotlightModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageClick = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="relative bg-white rounded-lg overflow-hidden max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white rounded-full transition-colors shadow-md"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        <div className="px-4 py-3 border-b">
          <h2 className="text-lg md:text-xl font-light tracking-wider uppercase text-center">
            {title}
          </h2>
        </div>

        {/* Image Carousel - Clickable */}
        <div 
          className="relative aspect-[3/4] bg-gray-100 cursor-pointer"
          onClick={handleImageClick}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={image}
                alt={`${title} ${index + 1}`}
                fill
                className="object-cover"
                priority
              />
            </div>
          ))}

          {/* Dots Indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* More Info Button */}
        <div className="px-4 py-4 border-t">
          <Link href={`/product/${slug}`} prefetch={true}>
            <button
              className="w-full bg-black text-white py-2.5 uppercase tracking-wider text-sm hover:bg-gray-800 transition-colors"
            >
              More Info
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
