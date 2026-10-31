'use client';

import { useEffect, useRef, useState, type VideoHTMLAttributes } from 'react';

interface AdaptiveVideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  /** HLS master playlist. Its top level is the plain MP4; the rest are for slow connections. */
  hlsSrc: string;
  /** Plain MP4 used if the stream can't play. */
  fallbackSrc: string;
  /** Nothing is fetched until this first turns true. */
  playing: boolean;
}

/**
 * Plays a stream that starts at whatever quality the connection can carry and
 * climbs from there, where a single MP4 would stall on anything slower than its
 * own bitrate. hls.js is only loaded for browsers that need it.
 */
export default function AdaptiveVideo({ hlsSrc, fallbackSrc, playing, ...videoProps }: AdaptiveVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playingRef = useRef(playing);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    playingRef.current = playing;
    if (playing) setStarted(true);
    const video = videoRef.current;
    if (!video || !video.currentSrc) return;
    if (playing) video.play().catch(() => {});
    else video.pause();
  }, [playing]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !started) return;

    let cancelled = false;
    let hls: { destroy(): void } | undefined;
    const useFallback = () => {
      hls?.destroy();
      hls = undefined;
      if (!cancelled) video.src = fallbackSrc;
    };

    // Attaching a source aborts any pending play(), so start once it's ready.
    const playWhenReady = () => {
      if (playingRef.current) video.play().catch(() => {});
    };
    video.addEventListener('loadedmetadata', playWhenReady);

    // iPhones have no MediaSource, so hls.js can't run there, but Safari plays HLS itself.
    if (!window.MediaSource) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.addEventListener('error', useFallback, { once: true });
        video.src = hlsSrc;
      } else {
        useFallback();
      }
    } else {
      import('hls.js/light')
        .then(({ default: Hls }) => {
          if (cancelled) return;
          if (!Hls.isSupported()) return useFallback();

          // Start from the reported speed where the browser has one, not hls.js's 0.5 Mbps guess.
          const downlink: number | undefined = (navigator as any).connection?.downlink;
          const instance = new Hls(downlink ? { abrEwmaDefaultEstimate: downlink * 1_000_000 } : {});
          hls = instance;
          instance.on(Hls.Events.ERROR, (_, data) => {
            if (data.fatal) useFallback();
          });
          instance.loadSource(hlsSrc);
          instance.attachMedia(video);
        })
        .catch(useFallback);
    }

    return () => {
      cancelled = true;
      hls?.destroy();
      video.removeEventListener('loadedmetadata', playWhenReady);
      video.removeEventListener('error', useFallback);
    };
  }, [hlsSrc, fallbackSrc, started]);

  return <video ref={videoRef} {...videoProps} />;
}
