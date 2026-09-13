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
  /** Full-bleed panel (100vw) instead of the default third-width panel. */
  fullWidth?: boolean;
  /** Transparent title lockup drawn over the cover, positioned like the artwork. */
  lockup?: string;
}

const videos: VideoItem[] = [
  {
    src: '',
    coverImage: '/qla-hero.webp',
    title: 'QLA',
    subtitle: 'The Skill to Make it Look Effortless',
    fullWidth: true,
    lockup: '/qla-lockup.png',
  },
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
const videoSources = videos.filter(v => v.src).map(v => v.src);

export default function HeroSectionDesktop() {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
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

  /*
   * Panels are no longer a uniform third of the viewport — the QLA cover is
   * full-bleed — so step to the next panel's own offset. A fixed third-viewport
   * step would land short of the 100vw panel and snap-mandatory would pull it
   * straight back.
   */
  const scroll = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (!container) return;

    const offsets = panelRefs.current
      .filter((el): el is HTMLDivElement => el !== null)
      .map((el) => el.offsetLeft);
    const maxScroll = container.scrollWidth - container.clientWidth;
    const current = container.scrollLeft;

    const target = direction === 'right'
      ? offsets.find((offset) => offset > current + 10) ?? maxScroll
      : [...offsets].reverse().find((offset) => offset < current - 10) ?? 0;

    container.scrollTo({ left: Math.min(target, maxScroll), behavior: 'smooth' });
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
            ref={(el) => {
              panelRefs.current[index] = el;
            }}
            className={`relative flex-shrink-0 overflow-hidden cursor-pointer group snap-start ${
              video.fullWidth ? 'w-full' : 'w-1/3'
            }`}
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
                sizes={video.fullWidth ? '100vw' : '33vw'}
                priority={index === 0}
              />
            </div>

            {/*
              Title lockup kept as a separate layer rather than baked into the
              cover, so it stays on screen when a non-16:9 window crops the
              photo. Percentages mirror its placement in the source artwork.
            */}
            {video.lockup && (
              <div className="absolute bottom-[17.4%] left-[5.5%] w-[40%] max-w-[640px] pointer-events-none">
                <Image
                  src={video.lockup}
                  alt=""
                  width={1023}
                  height={380}
                  className="w-full h-auto"
                  priority
                />
              </div>
            )}

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
