'use client';

import { useState } from 'react';
import Image from 'next/image';
import SpotlightModal from './SpotlightModal';

interface SpotlightCardProps {
  title: string;
  images: string[];
  slug: string;
}

export default function SpotlightCard({ title, images, slug }: SpotlightCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col">
        <div 
          className="relative group cursor-pointer overflow-hidden hover:opacity-90 transition-opacity"
          onClick={handleClick}
        >
          {/* Image Container - Show only first image */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={images[0]}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Title below the card */}
        <h3 className="mt-3 text-center text-sm md:text-base font-light tracking-wider uppercase">
          {title}
        </h3>
      </div>

      {/* Modal */}
      <SpotlightModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        images={images}
        slug={slug}
      />
    </>
  );
}
