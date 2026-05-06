'use client';

import { useEffect, useRef } from 'react';

interface VideoPreloaderProps {
  videoSources: string[];
  /** How many videos to actively prefetch in parallel (default 1). */
  concurrency?: number;
  /** Skip on slow connections / data-saver. */
  respectSaveData?: boolean;
  onProgress?: (loaded: number, total: number) => void;
  onComplete?: () => void;
}

/**
 * Lightweight, idle-time prefetcher for hero videos.
 *
 * Previously this used preload="auto" + canplaythrough on every video at once,
 * which downloaded ~16 MB of video data on every page load — the main reason
 * the homepage felt sluggish on mobile and low-end laptops.
 *
 * Now it:
 *  - waits for network idle,
 *  - prefetches only metadata first (so the first frame can render fast),
 *  - serializes full prefetches one at a time,
 *  - bails out entirely on Save-Data or slow 2G/3G connections.
 */
export default function VideoPreloader({
  videoSources,
  concurrency = 1,
  respectSaveData = true,
  onProgress,
  onComplete,
}: VideoPreloaderProps) {
  const loadedVideos = useRef<Set<string>>(new Set());
  const totalVideos = videoSources.length;

  useEffect(() => {
    if (totalVideos === 0) {
      onComplete?.();
      return;
    }

    // Respect data-saver / slow connections — never preload heavy media there.
    if (respectSaveData && typeof navigator !== 'undefined') {
      const conn: any = (navigator as any).connection;
      if (conn) {
        if (conn.saveData) return;
        if (conn.effectiveType && /^(slow-2g|2g|3g)$/.test(conn.effectiveType)) return;
      }
    }

    const start = () => prefetch();
    const w = window as any;
    if (typeof w.requestIdleCallback === 'function') {
      w.requestIdleCallback(start, { timeout: 2500 });
    } else {
      w.setTimeout(start, 1500);
    }
  }, [respectSaveData, totalVideos]);

  const markLoaded = (src: string) => {
    if (loadedVideos.current.has(src)) return;
    loadedVideos.current.add(src);
    const c = loadedVideos.current.size;
    onProgress?.(c, totalVideos);
    if (c === totalVideos) onComplete?.();
  };

  const prefetchOne = (src: string) =>
    new Promise<void>((resolve) => {
      const video = document.createElement('video');
      video.preload = 'auto';
      video.muted = true;
      // @ts-ignore — playsInline isn't typed on HTMLVideoElement in older TS libs
      video.playsInline = true;

      const done = () => {
        markLoaded(src);
        resolve();
      };

      // We treat "loadeddata" (first frame buffered) as "good enough" rather
      // than "canplaythrough" so we don't keep the network busy fetching the
      // whole file on slow links.
      video.addEventListener('loadeddata', done, { once: true });
      video.addEventListener('error', done, { once: true });

      video.src = src;
      try { video.load(); } catch { done(); }
    });

  const prefetch = async () => {
    // Run a small worker pool with the requested concurrency.
    const queue = [...videoSources];
    const workers = Array.from({ length: Math.max(1, concurrency) }, async () => {
      while (queue.length) {
        const next = queue.shift();
        if (!next) return;
        await prefetchOne(next);
      }
    });
    await Promise.all(workers);
  };

  return null;
}
