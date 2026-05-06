'use client';

/**
 * Helpers for picking the right video variant per-device.
 *
 * Naming convention used across /public/videos and /public/products:
 *   - "foo.mp4"          -> desktop / hi-DPI variant
 *   - "foo-mobile.mp4"   -> 720p mobile variant (smaller file)
 *   - "foo-poster.webp"  -> first-frame poster image
 *
 * The mobile variant exists for every video the build pipeline produced.
 * If a caller passes a URL we don't have a -mobile sibling for, the helper
 * falls back to the desktop URL, so it's safe to call unconditionally.
 */

export function getMobileVideoUrl(src: string): string {
  // Only transform mp4/webm/mov urls; leave anything else (images) alone.
  const m = src.match(/^(.*?)(\.(mp4|webm|mov))$/i);
  if (!m) return src;
  const [, stem, ext] = m;
  if (stem.endsWith('-mobile')) return src;
  return `${stem}-mobile${ext}`;
}

export function getPosterUrl(src: string): string | undefined {
  const m = src.match(/^(.*?)(\.(mp4|webm|mov))$/i);
  if (!m) return undefined;
  const [, stem] = m;
  if (stem.endsWith('-mobile')) {
    return `${stem.slice(0, -'-mobile'.length)}-poster.webp`;
  }
  return `${stem}-poster.webp`;
}

import { useEffect, useState } from 'react';

/**
 * Returns true when the viewport is narrow enough that we should prefer the
 * smaller mobile encode. Hydration-safe: defaults to `false` on the server
 * so the first client render picks the desktop URL (matching SSR), then
 * upgrades after mount.
 */
export function useIsMobileViewport(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    if (mq.addEventListener) mq.addEventListener('change', update);
    else mq.addListener(update);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', update);
      else mq.removeListener(update);
    };
  }, [breakpoint]);

  return isMobile;
}

/**
 * True when the device reports a slow connection or has Save-Data enabled.
 * Components can use this to skip auto-loading hero/product videos entirely.
 */
export function useShouldRespectSaveData(): boolean {
  const [respect, setRespect] = useState(false);
  useEffect(() => {
    const conn: any = (navigator as any).connection;
    if (!conn) return;
    const update = () => {
      const slow = conn.saveData === true ||
        (conn.effectiveType && /^(slow-2g|2g|3g)$/.test(conn.effectiveType));
      setRespect(!!slow);
    };
    update();
    conn.addEventListener?.('change', update);
    return () => conn.removeEventListener?.('change', update);
  }, []);
  return respect;
}
