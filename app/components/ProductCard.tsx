'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface ProductCardProps {
  name: string;
  price: string;
  mediaType: 'image' | 'video';
  mediaSrc: string;
}

export default function ProductCard({ name, price, mediaType, mediaSrc }: ProductCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleMouseEnter = () => {
    if (mediaType === 'video' && videoRef.current) {
      videoRef.current.play().catch(error => {
        if (error.name !== 'AbortError') {
          console.error('Video play error:', error);
        }
      });
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    if (mediaType === 'video' && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <div 
      className="relative bg-white overflow-hidden cursor-pointer group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        {mediaType === 'video' ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            loop
            muted
            playsInline
            preload="metadata"
          >
            <source src={mediaSrc} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={mediaSrc}
            alt={name}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="p-4 text-center">
        <h3 className="text-lg font-medium tracking-wider uppercase mb-1">
          {name}
        </h3>
        <p className="text-sm text-gray-600">
          {price}
        </p>
      </div>
    </div>
  );
}
