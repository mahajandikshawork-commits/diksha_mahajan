'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SpotlightCardProps {
  title: string;
  images: string[];
}

export default function SpotlightCard({ title, images }: SpotlightCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleClick = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="flex flex-col">
      <div 
        className="relative group cursor-pointer overflow-hidden"
        onClick={handleClick}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden">
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
                unoptimized
              />
            </div>
          ))}
        </div>

        {/* Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
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

      {/* Title below the card */}
      <h3 className="mt-3 text-center text-sm md:text-base font-light tracking-wider uppercase">
        {title}
      </h3>
    </div>
  );
}
