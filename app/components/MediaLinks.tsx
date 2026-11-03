import Link from 'next/link';
import { MediaFeature, isExternal, mediaLinkLabel } from '@/lib/media';

interface MediaLinksProps {
  item: MediaFeature;
  tone?: 'dark' | 'light';
  className?: string;
}

// "Read on Vogue India" + "Shop Adaa" pair used by every press item.
export default function MediaLinks({ item, tone = 'light', className = '' }: MediaLinksProps) {
  const primary =
    tone === 'dark'
      ? 'text-[#DCC898] border-[#DCC898]/50 hover:text-white hover:border-white'
      : 'text-[#1a1a1a] border-[#1a1a1a]/40 hover:border-[#1a1a1a]';
  const secondary =
    tone === 'dark'
      ? 'text-white/70 border-white/20 hover:text-white hover:border-white'
      : 'text-[#6d6458] border-[#6d6458]/30 hover:text-[#1a1a1a] hover:border-[#1a1a1a]';
  const base =
    'inline-block border-b pb-1 text-[11px] uppercase tracking-[0.22em] transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4';

  if (!item.url && !item.look?.slug && !item.diary) return null;

  return (
    <div className={`flex flex-wrap items-center gap-x-8 gap-y-3 ${className}`}>
      {item.url && (
        <a
          href={item.url}
          {...(isExternal(item.url) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className={`${base} ${primary}`}
        >
          {mediaLinkLabel(item)}
          {isExternal(item.url) && <span className="sr-only"> (opens in a new tab)</span>}
        </a>
      )}
      {item.look?.slug && (
        <Link href={`/product/${item.look.slug}`} className={`${base} ${secondary}`}>
          Shop {item.look.name}
        </Link>
      )}
      {item.diary && (
        <Link href={`/client-diaries/${item.diary}`} className={`${base} ${secondary}`}>
          Read the client diary
        </Link>
      )}
    </div>
  );
}
