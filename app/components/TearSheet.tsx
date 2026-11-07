import { MediaFeature, formatMediaDate, isExternal } from '@/lib/media';
import FeatheredImage from './FeatheredImage';
import MediaLinks from './MediaLinks';

interface TearSheetProps {
  item: MediaFeature;
  sizes?: string;
}

// One press feature in the /media archive.
export default function TearSheet({ item, sizes = '(min-width: 1280px) 25vw, (min-width: 640px) 45vw, 100vw' }: TearSheetProps) {
  const image = (
    <div className="relative aspect-[4/5]">
      <FeatheredImage
        item={item}
        sizes={sizes}
        imgClassName="transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
      />
    </div>
  );

  return (
    <article id={item.slug} className="group scroll-mt-40">
      {item.url ? (
        <a
          href={item.url}
          {...(isExternal(item.url) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          tabIndex={-1}
          aria-hidden
        >
          {image}
        </a>
      ) : (
        image
      )}

      <div className="mt-6">
        <p className="font-display text-[1.7rem] leading-[1.1] text-[#1a1a1a]">{item.publication}</p>
        <p className="mt-2 flex items-center gap-3 text-[12px] tracking-wide text-[#6d6458]">
          <span>{item.category}</span>
          <span aria-hidden className="h-px w-5 bg-[#6d6458]/40" />
          <time dateTime={item.date}>{formatMediaDate(item.date)}</time>
        </p>
        <h3 className="mt-4 text-[15px] leading-6 text-[#1a1a1a]">{item.title}</h3>
        {item.excerpt && (
          <p className="mt-2 text-[14px] leading-6 text-[#6d6458] line-clamp-3">{item.excerpt}</p>
        )}
        <MediaLinks item={item} className="mt-6" />
      </div>
    </article>
  );
}
