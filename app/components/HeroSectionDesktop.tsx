'use client';

import { useState, useRef } from 'react';

interface VideoItem {
  src: string;
  title: string;
  subtitle: string;
}

const videos: VideoItem[] = [
  {
    src: '/videos/nazm.mp4',
    title: 'NAZM',
    subtitle: 'The Story of Her Becoming',
  },
  {
    src: '/videos/noor-e-fiza.MP4',
    title: 'NOOR-E-FIZA',
    subtitle: 'Light of the Atmosphere',
  },
  {
    src: '/videos/aaina.mp4',
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
    <section className="relative w-full h-screen">
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

            <div className="absolute bottom-0 left-0 right-0 p-8 text-white pointer-events-none">
              <h2 className="text-2xl font-light tracking-[0.2em] mb-2">
                {video.title}
              </h2>
              <p className="text-sm tracking-wider opacity-90">
                {video.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
