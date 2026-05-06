'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  getMobileVideoUrl,
  getPosterUrl,
  useIsMobileViewport,
} from './useResponsiveVideo';

interface ProductCardProps {
  name: string;
  price: string;
  tagline?: string;
  mediaType: 'image' | 'video';
  mediaSrc: string;
  mainImage?: string;
  slug: string;
  /** If false, always show image even for video products */
  showVideo?: boolean;
  /** If true, video plays automatically once it's in view */
  autoplay?: boolean;
}

export default function ProductCard({
  name,
  price,
  tagline,
  mediaType,
  mediaSrc,
  mainImage,
  slug,
  showVideo = false,
  autoplay = false,
}: ProductCardProps) {
  const [posterFaded, setPosterFaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const isMobile = useIsMobileViewport();

  const isVideo = mediaType === 'video' && showVideo;
  const sourceSrc = isMobile ? getMobileVideoUrl(mediaSrc) : mediaSrc;
  const posterSrc = mainImage || getPosterUrl(mediaSrc);

  // When sourceSrc changes (mobile<->desktop swap after hydration), force the
  // video element to reload + replay so it doesn't keep an old/empty source.
  useEffect(() => {
    if (!isVideo) return;
    const video = videoRef.current;
    if (!video) return;
    try { video.load(); } catch {}
    if (autoplay) {
      const tryPlay = () => {
        video.play().catch(() => {/* autoplay policy / abort — non-fatal */});
      };
      if (video.readyState >= 2) {
        tryPlay();
      } else {
        const onLoaded = () => tryPlay();
        video.addEventListener('loadeddata', onLoaded, { once: true });
        return () => video.removeEventListener('loadeddata', onLoaded);
      }
    }
  }, [isVideo, autoplay, sourceSrc]);

  const handleMouseEnter = () => {
    if (!isVideo || autoplay) return;
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    if (!isVideo || autoplay) return;
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
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
          {isVideo ? (
            <>
              {/* Poster image — visible until the first video frame paints. */}
              {posterSrc && (
                <Image
                  src={posterSrc}
                  alt={name}
                  fill
                  className={`object-cover transition-opacity duration-300 ${
                    posterFaded ? 'opacity-0' : 'opacity-100'
                  }`}
                  sizes="(max-width: 768px) 45vw, (max-width: 1200px) 33vw, 320px"
                />
              )}
              <video
                key={sourceSrc}
                ref={videoRef}
                src={sourceSrc}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  posterFaded ? 'opacity-100' : 'opacity-0'
                }`}
                loop
                muted
                playsInline
                autoPlay={autoplay}
                preload="auto"
                poster={posterSrc}
                onPlaying={() => setPosterFaded(true)}
                onPause={() => setPosterFaded(false)}
              />
            </>
          ) : (
            <Image
              src={mainImage || mediaSrc}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 45vw, (max-width: 1200px) 33vw, 320px"
            />
          )}
        </div>

        <div className="py-4 text-center space-y-1">
          <h3 className="md:text-lg text-xs font-medium tracking-wider uppercase line-clamp-2">
            {name}
          </h3>
          <p className="md:text-xs text-[10px] text-gray-500 line-clamp-2">
            {tagline || ' '}
          </p>
          <p className="md:text-sm text-xs text-gray-600">
            {price}
          </p>
        </div>
      </div>
    </Link>
  );
}
