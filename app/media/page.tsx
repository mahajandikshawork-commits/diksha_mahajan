import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { formatMediaDate, getAllMedia, getCoverStory, uniquePublications } from '@/lib/media';
import MediaArchive from './MediaArchive';

const SITE_URL = 'https://dikshamahajan.com';

export function generateMetadata(): Metadata {
  const cover = getCoverStory();
  const publications = uniquePublications(getAllMedia());
  const description = `Diksha Mahajan in the press: features in ${publications.join(', ')}.`;
  return {
    title: 'Press & Media',
    description,
    alternates: { canonical: '/media' },
    openGraph: {
      title: 'Diksha Mahajan in the press',
      description,
      url: `${SITE_URL}/media`,
      images: cover ? [{ url: cover.image, alt: `${cover.publication}: ${cover.title}` }] : undefined,
    },
  };
}

function summary(count: number, publications: number, since: string) {
  const features = `${count} ${count === 1 ? 'feature' : 'features'}`;
  if (publications <= 1) return `${features} since ${since}`;
  return `${features} across ${publications} publications since ${since}`;
}

export default function MediaPage() {
  const items = getAllMedia();
  const cover = getCoverStory(items);
  const publications = uniquePublications(items);
  const since = items.map((item) => item.date.slice(0, 4)).sort()[0] ?? '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Diksha Mahajan in the press',
    url: `${SITE_URL}/media`,
    about: { '@type': 'Brand', name: 'Diksha Mahajan' },
    hasPart: items.map((item) => ({
      '@type': 'CreativeWork',
      headline: item.title,
      datePublished: item.date,
      url: item.url,
      publisher: { '@type': 'Organization', name: item.publication },
    })),
  };

  return (
    <div className="min-h-screen bg-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative isolate flex min-h-[100svh] lg:min-h-[min(100svh,54rem)] overflow-hidden bg-black text-white">
        {cover && (
          <div className="absolute inset-y-0 right-0 -z-10 w-full lg:w-[58%]">
            <Image
              src={cover.image}
              alt={`${cover.publication}: ${cover.title}`}
              fill
              priority
              quality={90}
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover object-[50%_18%] motion-safe:animate-[press-settle_2400ms_cubic-bezier(0.22,1,0.36,1)_both]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/40 lg:hidden" />
            <div className="absolute inset-0 hidden lg:block bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,0.65)_28%,rgba(0,0,0,0.1)_60%,rgba(0,0,0,0.25)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black via-black/75 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black to-transparent" />
          </div>
        )}

        <div className="mx-auto flex w-full max-w-[1400px] flex-col px-6 md:px-12 pt-36 md:pt-44 pb-12 md:pb-16">
          <div className="flex items-center justify-between gap-6 text-[11px] uppercase tracking-[0.35em]">
            <span className="press-fade text-[#DCC898]">Press &amp; media</span>
          </div>

          <h1 className="mt-auto font-display text-[clamp(3.75rem,11vw,10rem)] leading-[0.86] tracking-[-0.035em]">
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="press-rise block" style={{ animationDelay: '100ms' }}>In the</span>
            </span>
            <span className="block overflow-hidden pb-[0.1em]">
              <span className="press-rise block italic pl-[0.6em]" style={{ animationDelay: '250ms' }}>press</span>
            </span>
          </h1>

          <div className="mt-10 md:mt-14 grid gap-10 border-t border-white/15 pt-8 md:grid-cols-12">
            <p
              className="press-fade md:col-span-5 max-w-[36ch] text-[15px] leading-7 text-white/65"
              style={{ animationDelay: '500ms' }}
            >
              A considered edit of features, conversations and milestones from Diksha Mahajan&rsquo;s
              Atelier. Discover our perspective on bridal couture, the modern trousseau and pieces made
              to become part of a personal history.
              {items.length > 0 && (
                <span className="mt-4 block text-[11px] uppercase tracking-[0.3em] text-white/45">
                  {summary(items.length, publications.length, since)}
                </span>
              )}
            </p>

            {cover && (
              <div className="press-fade md:col-span-5 md:col-start-8" style={{ animationDelay: '650ms' }}>
                <p className="flex items-center gap-5 text-[11px] uppercase tracking-[0.3em] text-[#DCC898]">
                  <span>Cover story</span>
                  <time dateTime={cover.date} className="text-white/55">{formatMediaDate(cover.date, 'short')}</time>
                </p>
                <p className="mt-3 font-display text-[1.9rem] leading-none">{cover.publication}</p>
                <p className="mt-3 font-display italic text-[1.15rem] leading-snug text-white/80">
                  {cover.title}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Publications marquee */}
      {publications.length > 0 && (
        <div aria-hidden className="overflow-hidden border-y border-white/10 bg-black py-6 md:py-8 text-white">
          <div className="press-marquee flex w-max">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center">
                {Array.from({ length: Math.max(2, Math.ceil(8 / publications.length)) })
                  .flatMap(() => publications)
                  .map((name, i) => (
                    <span key={`${copy}-${i}`} className="flex items-center">
                      <span className="px-8 md:px-12 font-display italic text-[2rem] md:text-[3rem] leading-none text-white/85 whitespace-nowrap">
                        {name}
                      </span>
                      <span className="h-1.5 w-1.5 rotate-45 bg-[#DCC898]" />
                    </span>
                  ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {items.length > 0 && <MediaArchive items={items} />}

      {/* Enquiries */}
      <section className="bg-black text-white">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-6 md:px-12 py-24 md:py-32 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#DCC898]">Press enquiries</p>
            <h2 className="mt-5 font-display text-[2.25rem] md:text-[clamp(2.5rem,4vw,3.75rem)] leading-[1] tracking-[-0.02em]">
              Writing about couture?
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
            <p className="text-[15px] leading-7 text-white/65">
              For interviews, features and image requests, write to the studio.
            </p>
            <a
              href="mailto:info@dikshamahajan.com"
              className="mt-4 inline-block font-display italic text-[1.75rem] md:text-[2.25rem] text-[#DCC898] underline decoration-[#DCC898]/40 underline-offset-8 hover:decoration-[#DCC898] transition-colors"
            >
              info@dikshamahajan.com
            </a>
            <p className="mt-10 text-[14px] leading-7 text-white/55">
              To see a piece in person,{' '}
              <Link
                href="/book-appointment"
                className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white"
              >
                book an appointment at the atelier
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
