import Image from 'next/image';
import { MediaFeature } from '@/lib/media';

interface FeatheredImageProps {
  item: MediaFeature;
  sizes: string;
  priority?: boolean;
  /** Classes for the positioned wrapper (e.g. opacity for crossfades). */
  wrapperClassName?: string;
  /** Classes for the <img> itself (e.g. hover zoom). */
  imgClassName?: string;
  hidden?: boolean;
}

// Press image whose edges dissolve into the page instead of ending in a hard
// rectangle. Fills its (relative, sized) parent.
//
// imageFit "contain" keeps the whole picture visible (for magazine pages with
// text at the edges); the feather then follows the picture, not the frame.
export default function FeatheredImage({
  item,
  sizes,
  priority,
  wrapperClassName = '',
  imgClassName = '',
  hidden,
}: FeatheredImageProps) {
  const contain = item.imageFit === 'contain';
  const image = (
    <Image
      src={item.image}
      alt={hidden ? '' : `${item.publication}: ${item.title}`}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${contain ? '' : 'object-top'} ${imgClassName}`}
    />
  );

  if (!contain) {
    return (
      <div aria-hidden={hidden} className={`press-feather absolute inset-0 overflow-hidden ${wrapperClassName}`}>
        {image}
      </div>
    );
  }

  return (
    <div aria-hidden={hidden} className={`absolute inset-0 flex items-center justify-center ${wrapperClassName}`}>
      <div
        className="press-feather relative w-full overflow-hidden"
        style={{ aspectRatio: item.imageRatio ?? '1 / 1' }}
      >
        {image}
      </div>
    </div>
  );
}
