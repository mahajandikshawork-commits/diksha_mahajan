'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface VideoItem {
  src: string;
  coverImage: string;
  title: string;
  subtitle: string;
}

const videos: VideoItem[] = [
  {
    src: '/videos/nazm.mp4',
    coverImage: '/nazm.jpeg',
    title: 'NAZM',
    subtitle: 'The Story of Her Becoming',
  },
  {
    src: '/videos/noor-e-fiza.MP4',
    coverImage: '/Noor-e-Fiza cover homepage.JPG',
    title: 'NOOR-E-FIZA',
    subtitle: 'Light of the Atmosphere',
  },
  {
    src: '/videos/aaina.mp4',
    coverImage: '/Aaina cover homepage.JPG',
    title: 'AAINA',
    subtitle: 'The Mirror Collection',
  },
];

export default function HeroSectionDesktop() {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

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

  return (
    <section className="relative w-full h-screen top-22">
      <div className="grid grid-cols-3 h-screen">
        {videos.map((video, index) => (
          <div
            key={index}
            className="relative overflow-hidden cursor-pointer group"
            onMouseEnter={() => handleVideoInteraction(index, true)}
            onMouseLeave={() => handleVideoInteraction(index, false)}
            onClick={() => {
              if (activeVideo === index) {
                handleVideoInteraction(index, false);
              } else {
                handleVideoInteraction(index, true);
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
                priority
              />
            </div>

            {/* Video */}
            <video
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              className="w-full h-full object-cover pointer-events-none"
              loop
              muted
              playsInline
              preload="auto"
            >
              <source src={video.src} type="video/mp4" />
            </video>
          </div>
        ))}
      </div>
    </section>
  );
}
