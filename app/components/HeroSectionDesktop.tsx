'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import VideoPreloader from './VideoPreloader';
import { getPosterUrl } from './useResponsiveVideo';

interface VideoItem {
  src: string;
  coverImage: string;
  title: string;
  subtitle: string;
}

const videos: VideoItem[] = [
  {
    src: '/videos/heritage_edit.mp4',
    coverImage: '/the_heritage_edit.webp',
    title: 'THE HERITAGE EDIT',
    subtitle: 'Timeless Elegance',
  },
  {
    src: '/videos/noor-e-fiza.mp4',
    coverImage: '/noor-e-fiza-cover.webp',
    title: 'NOOR-E-FIZA',
    subtitle: 'Light of the Atmosphere',
  },
  {
    src: '/videos/aaina.mp4',
    coverImage: '/Aaina cover homepage.webp',
    title: 'AAINA',
    subtitle: 'The Mirror Collection',
  },
  {
    src: '/videos/nazm.mp4',
    coverImage: '/nazm.webp',
    title: 'NAZM',
    subtitle: 'The Story of Her Becoming',
  },
];

// Extract video sources for preloading
const videoSources = videos.map(v => v.src);

export default function HeroSectionDesktop() {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleVideoInteraction = async (index: number, play: boolean) => {
    const video = videoRefs.current[index];
    if (video) {
      if (play) {
        try {
          await video.play();
          setActiveVideo(index);
        } catch (error) {
          if ((error as Error).name !== 'AbortError') {
            console.error('Video play error:', error);
          }
        }
      } else {
        video.pause();
        video.currentTime = 0;
        setActiveVideo(null);
      }
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth / 3;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(containerRef.current.scrollWidth - containerRef.current.clientWidth, scrollPosition + scrollAmount);
      
      containerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollLeft);
    }
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = containerRef.current 
    ? scrollPosition < containerRef.current.scrollWidth - containerRef.current.clientWidth - 10
    : true;

  return (
    <section className="relative w-full h-screen top-22">
      <div 
        ref={containerRef}
        className="flex h-screen overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        onScroll={handleScroll}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {videos.map((video, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 w-1/3 overflow-hidden cursor-pointer group snap-start"
            onMouseEnter={() => video.src && handleVideoInteraction(index, true)}
            onMouseLeave={() => video.src && handleVideoInteraction(index, false)}
            onClick={() => {
              if (video.src) {
                if (activeVideo === index) {
                  handleVideoInteraction(index, false);
                } else {
                  handleVideoInteraction(index, true);
                }
              }
            }}
          >
            {/* Cover Image */}
            <div className={`absolute inset-0 transition-opacity duration-300 ${activeVideo === index ? 'opacity-0' : 'opacity-100'}`}>
              <Image
                src={video.coverImage}
                alt={video.title}
                fill
                className="object-cover"
                sizes="33vw"
                priority={index === 0}
              />
            </div>

            {/* Video */}
            {video.src && (
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                className="w-full h-full object-cover pointer-events-none"
                loop
                muted
                playsInline
                preload="metadata"
                poster={getPosterUrl(video.src) || video.coverImage}
              >
                <source src={video.src} type="video/mp4" />
              </video>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6 text-black" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 text-black" />
        </button>
      )}
      
      {/* Video Preloader */}
      <VideoPreloader 
        videoSources={videoSources}
        onProgress={(loaded, total) => {
          console.log(`Videos preloaded: ${loaded}/${total}`);
        }}
        onComplete={() => {
          console.log('All hero videos preloaded');
        }}
      />
    </section>
  );
}
