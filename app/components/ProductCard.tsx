'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  name: string;
  price: string;
  tagline?: string;
  mediaType: 'image' | 'video';
  mediaSrc: string;
  mainImage?: string;
  slug: string;
  showVideo?: boolean; // If false, always show image even for video products
  autoplay?: boolean; // If true, video plays automatically without hover
}

export default function ProductCard({ name, price, tagline, mediaType, mediaSrc, mainImage, slug, showVideo = false, autoplay = false }: ProductCardProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = () => {
    if (!autoplay && showVideo && mediaType === 'video' && videoRef.current) {
      videoRef.current.play().catch(error => {
        if (error.name !== 'AbortError') {
          console.error('Video play error:', error);
        }
      });
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    if (!autoplay && showVideo && mediaType === 'video' && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <Link href={`/product/${slug}`} prefetch={true}>
      <div 
        className="relative bg-white overflow-hidden cursor-pointer group"
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          {showVideo && mediaType === 'video' && isVisible ? (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                loop
                muted
                playsInline
                autoPlay={autoplay}
                preload="auto"
                poster={mainImage}
                src={mediaSrc}
              />
            </>
          ) : (
            <Image
              src={mainImage || mediaSrc}
              alt={name}
              fill
              className="object-cover"
            />
          )}
        </div>

        <div className="py-4 text-center space-y-1">
          <h3 className="md:text-lg text-xs font-medium tracking-wider uppercase line-clamp-2">
            {name}
          </h3>
          <p className="md:text-xs text-[10px] text-gray-500 line-clamp-2">
            {tagline || '\u00A0'}
          </p>
          <p className="md:text-sm text-xs text-gray-600">
            {price}
          </p>
        </div>
      </div>
    </Link>
  );
}
