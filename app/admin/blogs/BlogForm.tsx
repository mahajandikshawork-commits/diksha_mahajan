'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Loader2,
  GripVertical,
  Trash2,
  ChevronUp,
  ChevronDown,
  Plus,
  Eye,
  EyeOff,
  Pencil,
  Heading1,
  Heading2,
  Type,
  Quote as QuoteIcon,
  List,
  ListOrdered,
  Image as ImageIcon,
  Images,
  X,
} from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import {
  Blog,
  BlogBlock,
  BlockType,
  BLOCK_LABELS,
  createBlock,
  isGalleryBlock,
  isImageBlock,
  isListBlock,
  isRichBlock,
  slugify,
} from '@/lib/blogs';
import RichText from './RichText';
import SingleImageUpload from './SingleImageUpload';
import BlogContent from '@/app/components/BlogContent';

interface BlogFormProps {
  initial?: Blog;
}

const PALETTE: { type: BlockType; icon: React.ElementType }[] = [
  { type: 'heading', icon: Heading1 },
  { type: 'subheading', icon: Heading2 },
  { type: 'paragraph', icon: Type },
  { type: 'bullet', icon: List },
  { type: 'numbered', icon: ListOrdered },
  { type: 'quote', icon: QuoteIcon },
  { type: 'image', icon: ImageIcon },
  { type: 'gallery', icon: Images },
];

export default function BlogForm({ initial }: BlogFormProps) {
  const router = useRouter();
  const isEdit = !!initial;

  const [title, setTitle] = useState(initial?.title ?? '');
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? '');
  const [cover, setCover] = useState(initial?.cover_image ?? '');
  const [published, setPublished] = useState(initial?.published ?? false);
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [blocks, setBlocks] = useState<BlogBlock[]>(initial?.blocks ?? []);

  const [preview, setPreview] = useState(false);
  // Tracks which action is in-flight so we can show a spinner on the right button.
  const [savingMode, setSavingMode] = useState<null | 'draft' | 'publish' | 'unpublish'>(null);
  const [error, setError] = useState('');

  // Native HTML5 drag & drop state.
  const [dragEnabledId, setDragEnabledId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const inputClass =
    'w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-[#1a1a1a] bg-white focus:outline-none focus:border-[#DCC898] transition-colors';
  const labelClass = 'block text-xs uppercase tracking-wider text-gray-500 mb-1.5';

  // ---- block helpers -------------------------------------------------------
  const addBlock = (type: BlockType) => {
    setBlocks((prev) => [...prev, createBlock(type)]);
  };

  const updateBlock = (id: string, patch: Partial<BlogBlock>) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? ({ ...b, ...patch } as BlogBlock) : b)),
    );
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const moveBlock = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    setBlocks(next);
  };

  const reorderByDrag = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    setBlocks((prev) => {
      const from = prev.findIndex((b) => b.id === sourceId);
      const to = prev.findIndex((b) => b.id === targetId);
      if (from === -1 || to === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  // ---- save ----------------------------------------------------------------
  // `nextPublished` decides the resulting status: false = save as draft,
  // true = publish (make live on the website).
  const handleSave = async (
    nextPublished: boolean,
    mode: 'draft' | 'publish' | 'unpublish',
  ) => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (blocks.length === 0) {
      setError('Add at least one content block');
      return;
    }

    setError('');
    setSavingMode(mode);

    const payload = {
      slug: initial?.slug ?? slugify(title),
      title: title.trim(),
      excerpt: excerpt.trim() || null,
      cover_image: cover || null,
      blocks,
      published: nextPublished,
      sort_order: sortOrder,
    };

    let dbError;
    if (isEdit) {
      const { error: err } = await supabaseBrowser
        .from('blogs')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', initial!.id);
      dbError = err;
    } else {
      const { error: err } = await supabaseBrowser.from('blogs').insert(payload);
      dbError = err;
    }

    if (dbError) {
      if (dbError.code === '23505') {
        setError('A blog with this title already exists. Use a different title.');
      } else {
        setError(dbError.message);
      }
      setSavingMode(null);
      return;
    }

    setPublished(nextPublished);
    router.push('/admin/blogs');
    router.refresh();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          href="/admin/blogs"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a1a1a] transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Blogs
        </Link>
        <button
          type="button"
          onClick={() => setPreview((p) => !p)}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm text-[#1a1a1a] hover:border-[#DCC898] transition-colors"
        >
          {preview ? <Pencil size={15} /> : <Eye size={15} />}
          {preview ? 'Edit' : 'Preview'}
        </button>
      </div>

      <h1 className="text-2xl font-light tracking-[0.1em] uppercase text-[#1a1a1a] mb-8">
        {isEdit ? 'Edit Blog' : 'New Blog'}
      </h1>

      {preview ? (
        <BlogPreview title={title} cover={cover} excerpt={excerpt} blocks={blocks} />
      ) : (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {/* Meta */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
            <div>
              <label className={labelClass}>Title *</label>
              <input
                className={inputClass}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Art of the Perfect Drape"
              />
              {title && (
                <p className="text-xs text-gray-400 mt-1">
                  URL: /blog/{initial?.slug ?? slugify(title)}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>Excerpt</label>
              <textarea
                className={`${inputClass} min-h-[70px] resize-y`}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Short summary shown on the blog listing…"
              />
            </div>
            <div>
              <label className={labelClass}>Cover Image</label>
              <SingleImageUpload
                value={cover}
                onChange={(img) => setCover(img?.url ?? '')}
                aspect="aspect-[16/9]"
                label="Click to upload cover image"
              />
            </div>
          </div>

          {/* Blocks */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-sm font-medium tracking-wide text-[#1a1a1a] mb-1">
              Content
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Add blocks, format text with bold / italic / underline, and drag the
              handle to reorder.
            </p>

            {blocks.length === 0 ? (
              <div className="rounded-md border border-dashed border-gray-300 py-10 text-center text-sm text-gray-400">
                No content yet. Add your first block below.
              </div>
            ) : (
              <div className="space-y-3">
                {blocks.map((block, index) => (
                  <BlockCard
                    key={block.id}
                    block={block}
                    index={index}
                    total={blocks.length}
                    isDragOver={overId === block.id && dragId !== block.id}
                    onEnableDrag={() => setDragEnabledId(block.id)}
                    draggable={dragEnabledId === block.id}
                    onDragStart={() => setDragId(block.id)}
                    onDragEnter={() => setOverId(block.id)}
                    onDragEnd={() => {
                      if (dragId && overId) reorderByDrag(dragId, overId);
                      setDragId(null);
                      setOverId(null);
                      setDragEnabledId(null);
                    }}
                    onMove={(dir) => moveBlock(index, dir)}
                    onRemove={() => removeBlock(block.id)}
                    onUpdate={(patch) => updateBlock(block.id, patch)}
                  />
                ))}
              </div>
            )}

            {/* Palette */}
            <div className="mt-5 border-t border-gray-100 pt-5">
              <p className={labelClass}>Add block</p>
              <div className="flex flex-wrap gap-2">
                {PALETTE.map(({ type, icon: Icon }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => addBlock(type)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-2 text-sm text-[#1a1a1a] hover:border-[#DCC898] hover:bg-[#DCC898]/10 transition-colors"
                  >
                    <Icon size={15} className="text-gray-500" />
                    {BLOCK_LABELS[type]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className={labelClass + ' mb-0'}>Status:</span>
              <span
                className={`inline-flex items-center gap-1 text-[11px] uppercase tracking-wider px-2 py-1 rounded ${
                  published ? 'bg-[#DCC898] text-black' : 'bg-gray-800 text-white'
                }`}
              >
                {published ? <Eye size={11} /> : <EyeOff size={11} />}
                {published ? 'Published' : 'Draft'}
              </span>
            </div>
            <div>
              <label className={labelClass}>Sort Order</label>
              <input
                type="number"
                className={`${inputClass} max-w-[140px]`}
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-gray-400 mt-1">Lower numbers appear first.</p>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex flex-wrap items-center gap-3">
            {/* Save (draft) — keeps the blog off the website until published. */}
            <button
              type="button"
              onClick={() => handleSave(false, 'draft')}
              disabled={savingMode !== null}
              className="inline-flex items-center gap-2 border border-gray-300 text-[#1a1a1a] px-6 py-3 rounded-md text-sm font-medium tracking-wide uppercase hover:border-[#DCC898] transition-colors disabled:opacity-50"
            >
              {savingMode === 'draft' && <Loader2 size={16} className="animate-spin" />}
              {published ? 'Unpublish & Save Draft' : 'Save Draft'}
            </button>

            {/* Publish — makes the blog live on the website. */}
            <button
              type="button"
              onClick={() => handleSave(true, 'publish')}
              disabled={savingMode !== null}
              className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-8 py-3 rounded-md text-sm font-medium tracking-wide uppercase hover:bg-black transition-colors disabled:opacity-50"
            >
              {savingMode === 'publish' && <Loader2 size={16} className="animate-spin" />}
              {published ? 'Update & Keep Published' : 'Publish'}
            </button>

            <Link
              href="/admin/blogs"
              className="px-6 py-3 text-sm text-gray-500 hover:text-[#1a1a1a] transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// A single editable block card with drag handle + controls.
// ---------------------------------------------------------------------------
interface BlockCardProps {
  block: BlogBlock;
  index: number;
  total: number;
  draggable: boolean;
  isDragOver: boolean;
  onEnableDrag: () => void;
  onDragStart: () => void;
  onDragEnter: () => void;
  onDragEnd: () => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
  onUpdate: (patch: Partial<BlogBlock>) => void;
}

function BlockCard({
  block,
  index,
  total,
  draggable,
  isDragOver,
  onEnableDrag,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onMove,
  onRemove,
  onUpdate,
}: BlockCardProps) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDragEnd={onDragEnd}
      className={`rounded-md border bg-gray-50/60 p-3 transition-colors ${
        isDragOver ? 'border-[#DCC898] bg-[#DCC898]/10' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onMouseDown={onEnableDrag}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-[#1a1a1a]"
            aria-label="Drag to reorder"
            title="Drag to reorder"
          >
            <GripVertical size={16} />
          </button>
          <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
            {BLOCK_LABELS[block.type]}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            className="p-1 text-gray-400 hover:text-[#1a1a1a] disabled:opacity-30"
            aria-label="Move up"
          >
            <ChevronUp size={16} />
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            className="p-1 text-gray-400 hover:text-[#1a1a1a] disabled:opacity-30"
            aria-label="Move down"
          >
            <ChevronDown size={16} />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-1 text-gray-400 hover:text-red-500"
            aria-label="Delete block"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <BlockEditor block={block} onUpdate={onUpdate} />
    </div>
  );
}

function BlockEditor({
  block,
  onUpdate,
}: {
  block: BlogBlock;
  onUpdate: (patch: Partial<BlogBlock>) => void;
}) {
  if (isImageBlock(block)) {
    return (
      <div className="space-y-2">
        <SingleImageUpload
          value={block.url || undefined}
          onChange={(img) =>
            onUpdate(
              img
                ? { url: img.url, width: img.width, height: img.height }
                : { url: '', width: undefined, height: undefined },
            )
          }
          aspect="aspect-[16/9]"
        />
        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-[#1a1a1a] bg-white focus:outline-none focus:border-[#DCC898]"
          value={block.caption}
          onChange={(e) => onUpdate({ caption: e.target.value })}
          placeholder="Image caption (optional)"
        />
      </div>
    );
  }

  if (isListBlock(block)) {
    const setItem = (i: number, html: string) => {
      const items = [...block.items];
      items[i] = html;
      onUpdate({ items });
    };
    const addItem = () => onUpdate({ items: [...block.items, ''] });
    const removeItem = (i: number) =>
      onUpdate({ items: block.items.filter((_, idx) => idx !== i) });

    return (
      <div className="space-y-2">
        {block.items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="mt-3 w-5 shrink-0 text-center text-xs text-gray-400">
              {block.type === 'numbered' ? `${i + 1}.` : '•'}
            </span>
            <div className="flex-1">
              <RichText
                value={item}
                onChange={(html) => setItem(i, html)}
                placeholder={`List item ${i + 1}`}
              />
            </div>
            <button
              type="button"
              onClick={() => removeItem(i)}
              disabled={block.items.length === 1}
              className="mt-2 p-1 text-gray-400 hover:text-red-500 disabled:opacity-30"
              aria-label="Remove item"
            >
              <X size={15} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1.5 text-sm text-[#1a1a1a] hover:text-[#DCC898] transition-colors"
        >
          <Plus size={14} /> Add item
        </button>
      </div>
    );
  }

  if (isGalleryBlock(block)) {
    const addImage = (img: { url: string; width: number; height: number } | null) => {
      if (!img) return;
      onUpdate({ images: [...block.images, { url: img.url, caption: '', width: img.width, height: img.height }] });
    };
    const removeImage = (i: number) =>
      onUpdate({ images: block.images.filter((_, idx) => idx !== i) });
    const setCaption = (i: number, caption: string) => {
      const images = [...block.images];
      images[i] = { ...images[i], caption };
      onUpdate({ images });
    };

    const colClass = 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-[#1a1a1a] bg-white focus:outline-none focus:border-[#DCC898] transition-colors';

    return (
      <div className="space-y-3">
        {/* Columns selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-gray-500">Columns:</span>
          {[2, 3, 4].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onUpdate({ columns: c as 2 | 3 | 4 })}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                block.columns === c
                  ? 'bg-[#1a1a1a] text-white'
                  : 'border border-gray-300 text-gray-600 hover:border-[#DCC898]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Existing images */}
        {block.images.length > 0 && (
          <div className={`grid gap-3 ${
            block.columns === 2 ? 'grid-cols-2' : block.columns === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'
          }`}>
            {block.images.map((img, i) => (
              <div key={i} className="group relative">
                <div className="relative aspect-square overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.caption || `Image ${i + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 rounded bg-red-500 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <X size={12} />
                  </button>
                </div>
                <input
                  className={`${colClass} mt-1.5 text-xs`}
                  value={img.caption}
                  onChange={(e) => setCaption(i, e.target.value)}
                  placeholder="Caption (optional)"
                />
              </div>
            ))}
          </div>
        )}

        {/* Add image */}
        <SingleImageUpload
          onChange={addImage}
          aspect="aspect-square"
          label="Add image to gallery"
        />
      </div>
    );
  }

  if (isRichBlock(block)) {
    const placeholders: Record<string, string> = {
      heading: 'Heading text…',
      subheading: 'Subheading text…',
      paragraph: 'Write your paragraph…',
      quote: 'Quote text…',
    };
    return (
      <RichText
        value={block.html}
        onChange={(html) => onUpdate({ html })}
        placeholder={placeholders[block.type]}
      />
    );
  }

  return null;
}

// ---------------------------------------------------------------------------
// Inline preview matching the public blog layout.
// ---------------------------------------------------------------------------
function BlogPreview({
  title,
  cover,
  excerpt,
  blocks,
}: {
  title: string;
  cover: string;
  excerpt: string;
  blocks: BlogBlock[];
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 md:p-10">
      <article className="mx-auto max-w-2xl">
        <h1 className="text-center text-3xl md:text-4xl font-light tracking-[0.12em] uppercase text-[#1a1a1a] mb-4">
          {title || 'Untitled Blog'}
        </h1>
        {excerpt && (
          <p className="text-center text-sm md:text-base text-gray-500 italic mb-8">
            {excerpt}
          </p>
        )}
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={title} className="mb-8 w-full rounded-sm object-cover" />
        )}
        <BlogContent blocks={blocks} />
      </article>
    </div>
  );
}
