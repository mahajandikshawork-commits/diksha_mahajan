// Shared types and helpers for Blogs stored in Supabase.
// A blog's body is an ordered list of content blocks (see BlogBlock) that the
// admin builds, reorders (drag & drop), and publishes. Rich-text blocks store
// sanitized HTML that supports bold / italic / underline.
import { supabaseBrowser } from './supabase-browser';

export type BlockType =
  | 'heading'
  | 'subheading'
  | 'paragraph'
  | 'bullet'
  | 'numbered'
  | 'quote'
  | 'image'
  | 'gallery'
  | 'split';

// Sub-block types allowed inside a split block's text column.
export type SplitTextType = 'heading' | 'subheading' | 'paragraph' | 'quote' | 'bullet' | 'numbered';

// Rich-text blocks (single HTML string).
export interface RichBlock {
  id: string;
  type: 'heading' | 'subheading' | 'paragraph' | 'quote';
  html: string;
}

// List blocks (array of HTML strings, one per item).
export interface ListBlock {
  id: string;
  type: 'bullet' | 'numbered';
  items: string[];
}

// Image block.
export interface ImageBlock {
  id: string;
  type: 'image';
  url: string;
  caption: string;
  width?: number;
  height?: number;
}

// Gallery block (multiple images in a configurable grid).
export interface GalleryImage {
  url: string;
  caption: string;
  linkUrl?: string;
  width?: number;
  height?: number;
}

export interface GalleryBlock {
  id: string;
  type: 'gallery';
  images: GalleryImage[];
  columns: 2 | 3 | 4 | 5 | 6;
}

// Split block — image on one side, text content on the other.
export type SplitTextBlock = RichBlock | ListBlock;

export interface SplitBlock {
  id: string;
  type: 'split';
  image: {
    url: string;
    caption: string;
    width?: number;
    height?: number;
  };
  textBlocks: SplitTextBlock[];
  imagePosition: 'left' | 'right';
}

export type BlogBlock = RichBlock | ListBlock | ImageBlock | GalleryBlock | SplitBlock;

export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  blocks: BlogBlock[];
  published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export type BlogInput = Omit<Blog, 'id' | 'created_at' | 'updated_at'>;

// Fallback cover shown when a blog has no uploaded cover image.
export const DEFAULT_BLOG_COVER = '/blog-cover-default.png';

export const RICH_TYPES: BlockType[] = ['heading', 'subheading', 'paragraph', 'quote'];
export const LIST_TYPES: BlockType[] = ['bullet', 'numbered'];

export function isRichBlock(b: BlogBlock): b is RichBlock {
  return RICH_TYPES.includes(b.type);
}
export function isListBlock(b: BlogBlock): b is ListBlock {
  return LIST_TYPES.includes(b.type);
}
export function isImageBlock(b: BlogBlock): b is ImageBlock {
  return b.type === 'image';
}
export function isGalleryBlock(b: BlogBlock): b is GalleryBlock {
  return b.type === 'gallery';
}
export function isSplitBlock(b: BlogBlock): b is SplitBlock {
  return b.type === 'split';
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Create a fresh block with sensible defaults for a given type.
export function createBlock(type: BlockType): BlogBlock {
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  if (type === 'image') return { id, type, url: '', caption: '' };
  if (type === 'gallery') return { id, type, images: [], columns: 3 };
  if (type === 'split') return { id, type, image: { url: '', caption: '' }, textBlocks: [], imagePosition: 'left' };
  if (type === 'bullet' || type === 'numbered') return { id, type, items: [''] };
  return { id, type, html: '' };
}

// Human-readable labels for the block palette.
export const BLOCK_LABELS: Record<BlockType, string> = {
  heading: 'Heading',
  subheading: 'Subheading',
  paragraph: 'Paragraph',
  bullet: 'Bullet List',
  numbered: 'Numbered List',
  quote: 'Quote',
  image: 'Image',
  gallery: 'Gallery',
  split: 'Image + Text',
};

// Whitelist-based HTML sanitizer for the inline formatting we allow
// (bold / italic / underline + line breaks). Everything else is stripped so
// admin-authored content stays safe when rendered with dangerouslySetInnerHTML.
export function sanitizeInlineHtml(html: string): string {
  if (!html) return '';

  // Normalize the tags produced by the browser's execCommand into our subset.
  let out = html
    .replace(/<\/?span[^>]*>/gi, '')
    .replace(/<div[^>]*>/gi, '<br>')
    .replace(/<\/div>/gi, '')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/p>/gi, '<br>')
    .replace(/<strong[^>]*>/gi, '<b>')
    .replace(/<\/strong>/gi, '</b>')
    .replace(/<em[^>]*>/gi, '<i>')
    .replace(/<\/em>/gi, '</i>')
    .replace(/style="[^"]*font-weight:\s*bold[^"]*"/gi, '');

  // Strip any tag that is not in the allow-list.
  out = out.replace(/<(\/?)([a-z0-9]+)[^>]*>/gi, (match, close, tag) => {
    const t = String(tag).toLowerCase();
    if (['b', 'i', 'u', 'br'].includes(t)) {
      return t === 'br' ? '<br>' : `<${close}${t}>`;
    }
    return '';
  });

  return out.trim();
}

// Strip all HTML to plain text (used for previews / excerpts).
export function stripHtml(html: string): string {
  return (html || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

export async function fetchPublishedBlogs(): Promise<Blog[]> {
  const { data, error } = await supabaseBrowser
    .from('blogs')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch blogs:', error.message);
    return [];
  }
  return (data as Blog[]) ?? [];
}

export async function fetchBlogBySlug(slug: string): Promise<Blog | null> {
  const { data, error } = await supabaseBrowser
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) return null;
  return data as Blog;
}
