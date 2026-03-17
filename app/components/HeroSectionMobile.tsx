'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface VideoItem {
  src: string;
  coverImage: string;
  title: string;
  subtitle: string;
}

const videos: VideoItem[] = [
  {
    src: '',
    coverImage: '/the_heritage_edit.png',
    title: 'THE HERITAGE EDIT',
    subtitle: 'Timeless Elegance',
  },
  {
    src: '/videos/noor-e-fiza.MP4',
    coverImage: '/noor-e-fiza-cover.JPG',
    title: 'NOOR-E-FIZA',
    subtitle: 'Light of the Atmosphere',
  },
  {
    src: '/videos/aaina.mp4',
    coverImage: '/Aaina cover homepage.JPG',
    title: 'AAINA',
    subtitle: 'The Mirror Collection',
  },
  {
    src: '/videos/nazm.mp4',
    coverImage: '/nazm.jpeg',
    title: 'NAZM',
    subtitle: 'The Story of Her Becoming',
  },
];

export default function HeroSectionMobile() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [videosReady, setVideosReady] = useState<Set<number>>(new Set());
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % videos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Swiped left - go to next slide
      nextSlide();
    }

    if (touchEndX.current - touchStartX.current > 50) {
      // Swiped right - go to previous slide
      prevSlide();
    }
  };

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video && videos[index].src) {
        if (index === currentSlide) {
          video.play().then(() => {
            setVideosReady(prev => new Set(prev).add(index));
          }).catch(error => {
            if (error.name !== 'AbortError') {
              console.error('Video play error:', error);
            }
          });
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [currentSlide]);

  return (
    <section className="relative w-full h-screen">
      <div 
        className="relative w-full h-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {videos.map((video, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentSlide
                ? 'translate-x-0'
                : index < currentSlide
                ? '-translate-x-full'
                : 'translate-x-full'
            }`}
          >
            {/* Cover Image - shown until video is ready */}
            <div className={`absolute inset-0 transition-opacity duration-300 ${index === currentSlide && videosReady.has(index) ? 'opacity-0' : 'opacity-100'}`}>
              <Image
                src={video.coverImage}
                alt={video.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>

            {/* Video */}
            {video.src && (
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                className="w-full h-full object-cover"
                loop
                muted
                playsInline
                preload="auto"
                poster={video.coverImage}
              >
                <source src={video.src} type="video/mp4" />
              </video>
            )}

            <div className="absolute inset-0 bg-black/30 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
