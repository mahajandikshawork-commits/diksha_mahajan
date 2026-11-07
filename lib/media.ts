// Press & media features shown on the homepage ("In the press") and on /media.
//
// To add a new feature, add an object to data/media.json; nothing else
// needs to change. Features show in the order they appear in the file. Fields:
//
//   slug         unique id, kebab-case (required)
//   publication  e.g. "Harper's Bazaar India" (required)
//   category     short type, e.g. "Editorial", "Instagram reel" (required)
//   date         YYYY-MM-DD; shown as month and year (required)
//   image        path in /public or a full URL allowed in next.config (required)
//   imageFit     "contain" shows the whole image (for covers with text at the
//                edges, e.g. a magazine page); default "cover" fills the frame (optional)
//   imageRatio   with imageFit "contain": the image's "width / height", e.g. "1169 / 1148"
//   title        the headline shown in large italics (required)
//   excerpt      one or two sentences about the feature (optional)
//   url          link to the original piece (optional)
//   linkLabel    overrides the auto label "Read on <publication>" (optional)
//   more         quiet secondary links, e.g. [{ "label": "Discover Adaa", "href": "/product/adaa" }] (optional)
//   featured     true = cover story on /media and first on the homepage (optional)
//   homepage     true = include in the homepage section; one row per publication,
//                max 4 publications (optional)
//   hidden       true = keep in the file but don't show anywhere (optional)

import rawMedia from '@/data/media.json';

export interface MediaLink {
  label: string;
  href: string;
}

export interface MediaFeature {
  slug: string;
  publication: string;
  title: string;
  category: string;
  date: string;
  image: string;
  imageFit?: 'cover' | 'contain';
  imageRatio?: string;
  excerpt?: string;
  url?: string;
  linkLabel?: string;
  more?: MediaLink[];
  featured?: boolean;
  homepage?: boolean;
  hidden?: boolean;
}

const HOMEPAGE_LIMIT = 4;

function byDateDesc(a: MediaFeature, b: MediaFeature) {
  return b.date.localeCompare(a.date);
}

/** Every visible feature, in the order the file lists them. */
export function getAllMedia(): MediaFeature[] {
  return (rawMedia as MediaFeature[]).filter(
    (item) => !item.hidden && item.slug && item.publication && item.image && item.date
  );
}

/** The cover story: the first item marked `featured`, else the first item. */
export function getCoverStory(items = getAllMedia()): MediaFeature | undefined {
  return items.find((item) => item.featured) ?? items[0];
}

export interface PublicationGroup {
  publication: string;
  /** Newest first; items[0] is the one shown. */
  items: MediaFeature[];
}

/**
 * Homepage selection, one row per publication so a title that featured the
 * label twice appears once. The cover story's publication comes first, then
 * publications in file order.
 */
export function getHomepageGroups(): PublicationGroup[] {
  const items = getAllMedia();
  const cover = getCoverStory(items);
  const picked = items.filter((item) => item.homepage || item.slug === cover?.slug);
  const ordered = cover ? [cover, ...picked.filter((item) => item.slug !== cover.slug)] : picked;

  const groups = new Map<string, MediaFeature[]>();
  for (const item of ordered) {
    groups.set(item.publication, [...(groups.get(item.publication) ?? []), item]);
  }
  return [...groups.entries()]
    .slice(0, HOMEPAGE_LIMIT)
    .map(([publication, list]) => ({
      publication,
      items: list[0].slug === cover?.slug ? list : [...list].sort(byDateDesc),
    }));
}

/** Groups items by year, newest year first. */
export function groupByYear(items: MediaFeature[]): { year: string; items: MediaFeature[] }[] {
  const groups = new Map<string, MediaFeature[]>();
  for (const item of items) {
    const year = item.date.slice(0, 4);
    groups.set(year, [...(groups.get(year) ?? []), item]);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, list]) => ({ year, items: list }));
}

export function uniquePublications(items: MediaFeature[]): string[] {
  return [...new Set(items.map((item) => item.publication))];
}

export function formatMediaDate(date: string, style: 'long' | 'short' = 'long'): string {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('en-GB', {
    month: style === 'long' ? 'long' : 'short',
    year: 'numeric',
  });
}

export function isExternal(url: string): boolean {
  return /^https?:\/\//.test(url);
}

/** Link text for the original piece, e.g. "Read on Vogue India" or "Watch on Instagram". */
export function mediaLinkLabel(item: MediaFeature): string {
  if (item.linkLabel) return item.linkLabel;
  if (item.url?.includes('instagram.com')) {
    return item.url.includes('/reel/') ? 'Watch on Instagram' : 'View on Instagram';
  }
  if (item.url?.includes('youtube.com') || item.url?.includes('youtu.be')) return 'Watch on YouTube';
  return `Read on ${item.publication}`;
}

