'use client';

import Image from 'next/image';
import {
  BlogBlock,
  isGalleryBlock,
  isImageBlock,
  isListBlock,
  isRichBlock,
  isSplitBlock,
  sanitizeInlineHtml,
} from '@/lib/blogs';

interface BlogContentProps {
  blocks: BlogBlock[];
}

// Renders the ordered block content of a blog exactly as it was laid out in
// the admin editor. Rich text is re-sanitized before injection so only
// bold / italic / underline formatting is honoured.
export default function BlogContent({ blocks }: BlogContentProps) {
  return (
    <div className="space-y-6">
      {blocks.map((block) => {
        if (isRichBlock(block)) {
          const html = sanitizeInlineHtml(block.html);
          if (!html) return null;

          if (block.type === 'heading') {
            return (
              <h2
                key={block.id}
                className="text-2xl md:text-3xl font-light tracking-[0.08em] uppercase text-[#1a1a1a] mt-4 [&_b]:font-semibold [&_i]:italic [&_u]:underline"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          }
          if (block.type === 'subheading') {
            return (
              <h3
                key={block.id}
                className="text-lg md:text-xl font-medium tracking-wide text-[#1a1a1a] mt-2 [&_b]:font-semibold [&_i]:italic [&_u]:underline"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          }
          if (block.type === 'quote') {
            return (
              <blockquote
                key={block.id}
                className="border-l-2 border-[#DCC898] bg-[#F5F1E8] px-6 py-5 text-base md:text-lg font-light italic leading-relaxed text-gray-700 [&_b]:font-semibold [&_i]:italic [&_u]:underline"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          }
          return (
            <p
              key={block.id}
              className="text-sm md:text-base leading-relaxed text-gray-700 font-light [&_b]:font-semibold [&_i]:italic [&_u]:underline"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }

        if (isListBlock(block)) {
          const items = block.items
            .map((i) => sanitizeInlineHtml(i))
            .filter(Boolean);
          if (items.length === 0) return null;

          const itemClass =
            'text-sm md:text-base leading-relaxed text-gray-700 font-light [&_b]:font-semibold [&_i]:italic [&_u]:underline';

          if (block.type === 'numbered') {
            return (
              <ol key={block.id} className="list-decimal pl-6 space-y-2 marker:text-[#DCC898]">
                {items.map((item, i) => (
                  <li key={i} className={itemClass} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ol>
            );
          }
          return (
            <ul key={block.id} className="list-disc pl-6 space-y-2 marker:text-[#DCC898]">
              {items.map((item, i) => (
                <li key={i} className={itemClass} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          );
        }

        if (isImageBlock(block) && block.url) {
          return (
            <figure key={block.id} className="my-2">
              <div className="relative w-full overflow-hidden rounded-sm bg-gray-100">
                <Image
                  src={block.url}
                  alt={block.caption || 'Blog image'}
                  width={block.width || 1600}
                  height={block.height || 1000}
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
              {block.caption && (
                <figcaption className="mt-2 text-center text-xs md:text-sm text-gray-500 italic">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          );
        }

        if (isGalleryBlock(block) && block.images.length > 0) {
          const colMap: Record<number, string> = {
            2: 'grid-cols-2',
            3: 'grid-cols-2 md:grid-cols-3',
            4: 'grid-cols-2 md:grid-cols-4',
            5: 'grid-cols-2 md:grid-cols-5',
            6: 'grid-cols-2 md:grid-cols-6',
          };
          const cols = colMap[block.columns] || 'grid-cols-2 md:grid-cols-3';
          return (
            <div key={block.id} className="my-2">
              <div className={`grid ${cols} gap-2 md:gap-4`}>
                {block.images.map((img, i) => {
                  const inner = (
                    <>
                      <div className="relative w-full aspect-square overflow-hidden rounded-sm bg-gray-100">
                        <Image
                          src={img.url}
                          alt={img.caption || `Gallery image ${i + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                          sizes="(max-width: 768px) 50vw, 20vw"
                        />
                      </div>
                      {img.caption && (
                        <figcaption className="mt-1.5 text-center text-xs text-gray-500 italic">
                          {img.caption}
                        </figcaption>
                      )}
                    </>
                  );
                  return (
                    <figure key={i}>
                      {img.linkUrl ? (
                        <a href={img.linkUrl} target="_blank" rel="noopener noreferrer" className="block">
                          {inner}
                        </a>
                      ) : (
                        inner
                      )}
                    </figure>
                  );
                })}
              </div>
            </div>
          );
        }

        if (isSplitBlock(block) && (block.image.url || block.textBlocks.length > 0)) {
          const imageSide = block.image.url && (
            <div className="relative w-full h-full min-h-[200px] overflow-hidden rounded-sm bg-gray-100">
              <Image
                src={block.image.url}
                alt={block.image.caption || 'Blog image'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {block.image.caption && (
                <p className="mt-2 text-center text-xs text-gray-500 italic absolute bottom-0 left-0 right-0 bg-black/40 text-white py-1 px-2">
                  {block.image.caption}
                </p>
              )}
            </div>
          );

          const textSide = (
            <div className="space-y-4">
              {block.textBlocks.map((tb) => {
                if (isRichBlock(tb)) {
                  const html = sanitizeInlineHtml(tb.html);
                  if (!html) return null;
                  if (tb.type === 'heading')
                    return (
                      <h2 key={tb.id} className="text-xl md:text-2xl font-light tracking-[0.08em] uppercase text-[#1a1a1a] [&_b]:font-semibold [&_i]:italic [&_u]:underline" dangerouslySetInnerHTML={{ __html: html }} />
                    );
                  if (tb.type === 'subheading')
                    return (
                      <h3 key={tb.id} className="text-base md:text-lg font-medium tracking-wide text-[#1a1a1a] [&_b]:font-semibold [&_i]:italic [&_u]:underline" dangerouslySetInnerHTML={{ __html: html }} />
                    );
                  if (tb.type === 'quote')
                    return (
                      <blockquote key={tb.id} className="border-l-2 border-[#DCC898] bg-[#F5F1E8] px-4 py-3 text-sm md:text-base font-light italic leading-relaxed text-gray-700 [&_b]:font-semibold [&_i]:italic [&_u]:underline" dangerouslySetInnerHTML={{ __html: html }} />
                    );
                  return (
                    <p key={tb.id} className="text-sm md:text-base leading-relaxed text-gray-700 font-light [&_b]:font-semibold [&_i]:italic [&_u]:underline" dangerouslySetInnerHTML={{ __html: html }} />
                  );
                }
                if (isListBlock(tb)) {
                  const items = tb.items.map((i) => sanitizeInlineHtml(i)).filter(Boolean);
                  if (items.length === 0) return null;
                  const itemClass = 'text-sm md:text-base leading-relaxed text-gray-700 font-light [&_b]:font-semibold [&_i]:italic [&_u]:underline';
                  if (tb.type === 'numbered')
                    return (
                      <ol key={tb.id} className="list-decimal pl-6 space-y-1.5 marker:text-[#DCC898]">
                        {items.map((item, i) => <li key={i} className={itemClass} dangerouslySetInnerHTML={{ __html: item }} />)}
                      </ol>
                    );
                  return (
                    <ul key={tb.id} className="list-disc pl-6 space-y-1.5 marker:text-[#DCC898]">
                      {items.map((item, i) => <li key={i} className={itemClass} dangerouslySetInnerHTML={{ __html: item }} />)}
                    </ul>
                  );
                }
                return null;
              })}
            </div>
          );

          return (
            <div key={block.id} className="my-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-center">
                {block.imagePosition === 'left' ? (
                  <>
                    <div className="relative min-h-[200px]">{imageSide}</div>
                    <div>{textSide}</div>
                  </>
                ) : (
                  <>
                    <div className="md:order-2 relative min-h-[200px]">{imageSide}</div>
                    <div className="md:order-1">{textSide}</div>
                  </>
                )}
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
