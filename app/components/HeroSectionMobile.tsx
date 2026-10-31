'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AdaptiveVideo from './AdaptiveVideo';
import { getMobileVideoUrl, useIsMobileViewport, useShouldRespectSaveData } from './useResponsiveVideo';

interface VideoItem {
  src: string;
  coverImage: string;
  title: string;
  subtitle: string;
  /** Transparent title lockup drawn over the cover, positioned like the artwork. */
  lockup?: string;
  /** Tiny inline preview, so a photo is in the first paint before the cover arrives. */
  blur?: string;
  /** Adaptive stream, played instead of the MP4 wherever it can be. */
  hls?: string;
}

const videos: VideoItem[] = [
  {
    src: '/videos/qla.mp4',
    coverImage: '/qla-hero-portrait.webp',
    blur: 'data:image/webp;base64,UklGRmIBAABXRUJQVlA4IFYBAADQCACdASoYACsAPtFaqU4oJKQiKrgKAQAaCWIAnTLweEp/1LrqQHppLNbmLrj8/p3CFSqhMgvcjRBvyngrtcJ8A6SfPy76N6vrqhpEU/5QAP7l5I+cLBteyVrTe9PCDJQgyaJa6mAREeqpH4tFMcod+Qc3M6dHPkNRzh62C+itn+aqXK7yN9b/e+YbT3PTVKa5HADzGPATBGh1a7fEe6tLyfK643n91UZAqRp541bqeLHToVYx1iEoDxzM+NKjQm033Ub2/BswPG3y8e5QkRajBHAWHZsx/vO89cKNyvUxvwVKterelsQGh23TaDWYh9EAS4uFevphfEfJM7t5rtfzUs8OZl0ODJZ6rUwKrGpEifh5R3xcvV0dVTkur2TAuyfzw6DQSfKBN65YZ2joxHGzMEoqARoMxhyhv5nN5T5DxjIecKlp4wB7oB0O0gGn4Baaf+KoYAA=',
    title: 'QLA',
    subtitle: 'The Skill to Make it Look Effortless',
    lockup: '/qla-lockup.png',
    hls: '/videos/qla-hls/mobile/master.m3u8',
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

export default function HeroSectionMobile() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [videosReady, setVideosReady] = useState<Set<number>>(new Set());
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  // This component stays mounted behind `lg:hidden`, so without this gate every
  // desktop visit would also fetch and play the first slide's mobile video.
  const isHeroShown = useIsMobileViewport(1024);
  const saveData = useShouldRespectSaveData();

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
    if (!isHeroShown || saveData) return;
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
  }, [currentSlide, isHeroShown, saveData]);

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
                sizes="100vw"
                priority={index === 0}
                placeholder={video.blur ? 'blur' : 'empty'}
                blurDataURL={video.blur}
              />
            </div>

            {/*
              Video — preload="auto" only for the current slide, then its immediate
              neighbours once it is playing, so the swipe feels instant without
              competing with the video on screen.
            */}
            {video.hls ? (
              <AdaptiveVideo
                hlsSrc={video.hls}
                fallbackSrc={getMobileVideoUrl(video.src)}
                playing={isHeroShown && index === currentSlide && !saveData}
                className="w-full h-full object-cover"
                loop
                muted
                playsInline
                onPlaying={() => setVideosReady(prev => new Set(prev).add(index))}
              />
            ) : video.src && (
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                className="w-full h-full object-cover"
                loop
                muted
                playsInline
                preload={isHeroShown && (index === currentSlide || (Math.abs(index - currentSlide) === 1 && videosReady.has(currentSlide))) ? 'auto' : 'none'}
              >
                <source src={getMobileVideoUrl(video.src)} type="video/mp4" />
              </video>
            )}

            <div className="absolute inset-0 bg-black/30 pointer-events-none" />

            {/*
              Portrait crop of the same shoot plus the lockup as its own layer —
              the 16:9 artwork can't be cropped to a phone screen without losing
              the title, so it is placed over the photo instead. The scrim keeps
              the tagline legible where it falls across the lehenga.
            */}
            {video.lockup && (
              <>
                <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/65 via-black/25 to-transparent pointer-events-none" />
                <div className="absolute bottom-[14%] left-[8%] w-[78%] sm:w-[62%] md:w-[52%] pointer-events-none">
                  <Image
                    src={video.lockup}
                    alt=""
                    width={1023}
                    height={380}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </>
            )}
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
