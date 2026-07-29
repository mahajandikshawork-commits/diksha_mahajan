'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { ClientDiary, slugify } from '@/lib/clientDiaries';
import ImageUploader from '../components/ImageUploader';

interface DiaryFormProps {
  initial?: ClientDiary;
}

const EMPTY = {
  outfit_name: '',
  client_name: '',
  city: '',
  occasion: '',
  description: '',
  testimonial: '',
  testimonial_author: '',
  images: [] as string[],
  featured_on_homepage: false,
  sort_order: 0,
};

export default function DiaryForm({ initial }: DiaryFormProps) {
  const router = useRouter();
  const isEdit = !!initial;

  const [form, setForm] = useState({
    outfit_name: initial?.outfit_name ?? EMPTY.outfit_name,
    client_name: initial?.client_name ?? EMPTY.client_name,
    city: initial?.city ?? EMPTY.city,
    occasion: initial?.occasion ?? EMPTY.occasion,
    description: initial?.description ?? EMPTY.description,
    testimonial: initial?.testimonial ?? EMPTY.testimonial,
    testimonial_author: initial?.testimonial_author ?? EMPTY.testimonial_author,
    images: initial?.images ?? EMPTY.images,
    featured_on_homepage: initial?.featured_on_homepage ?? EMPTY.featured_on_homepage,
    sort_order: initial?.sort_order ?? EMPTY.sort_order,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    if (!form.outfit_name.trim()) return 'Outfit name is required';
    if (!form.client_name.trim()) return 'Client name is required';
    if (!form.city.trim()) return 'City is required';
    if (!form.occasion.trim()) return 'Occasion is required';
    if (!form.description.trim()) return 'Description is required';
    if (form.images.length === 0) return 'At least one image is required';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setSaving(true);

    const payload = {
      slug: initial?.slug ?? slugify(form.outfit_name),
      outfit_name: form.outfit_name.trim(),
      client_name: form.client_name.trim(),
      city: form.city.trim(),
      occasion: form.occasion.trim(),
      description: form.description.trim(),
      testimonial: form.testimonial?.trim() || null,
      testimonial_author: form.testimonial_author?.trim() || null,
      images: form.images,
      featured_on_homepage: form.featured_on_homepage,
      sort_order: form.sort_order,
    };

    let dbError;
    if (isEdit) {
      const { error: err } = await supabaseBrowser
        .from('client_diaries')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', initial!.id);
      dbError = err;
    } else {
      const { error: err } = await supabaseBrowser
        .from('client_diaries')
        .insert(payload);
      dbError = err;
    }

    if (dbError) {
      // Unique-slug clash gives a helpful hint.
      if (dbError.code === '23505') {
        setError('A client diary with this outfit name already exists. Use a different name.');
      } else {
        setError(dbError.message);
      }
      setSaving(false);
      return;
    }

    router.push('/admin/client-diaries');
    router.refresh();
  };

  const inputClass =
    'w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-[#1a1a1a] bg-white focus:outline-none focus:border-[#DCC898] transition-colors';
  const labelClass =
    'block text-xs uppercase tracking-wider text-gray-500 mb-1.5';

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/admin/client-diaries"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a1a1a] transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to Client Diaries
      </Link>

      <h1 className="text-2xl font-light tracking-[0.1em] uppercase text-[#1a1a1a] mb-8">
        {isEdit ? 'Edit Client Diary' : 'New Client Diary'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Outfit Name *</label>
              <input
                className={inputClass}
                value={form.outfit_name}
                onChange={(e) => update('outfit_name', e.target.value)}
                placeholder="e.g. Silver Lullaby"
              />
            </div>
            <div>
              <label className={labelClass}>Client Name *</label>
              <input
                className={inputClass}
                value={form.client_name}
                onChange={(e) => update('client_name', e.target.value)}
                placeholder="e.g. Sanjana"
              />
            </div>
            <div>
              <label className={labelClass}>City *</label>
              <input
                className={inputClass}
                value={form.city}
                onChange={(e) => update('city', e.target.value)}
                placeholder="e.g. Chennai"
              />
            </div>
            <div>
              <label className={labelClass}>Occasion *</label>
              <input
                className={inputClass}
                value={form.occasion}
                onChange={(e) => update('occasion', e.target.value)}
                placeholder="e.g. Reception"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description *</label>
            <textarea
              className={`${inputClass} min-h-[120px] resize-y`}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Describe the outfit and its details…"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
          <h2 className="text-sm font-medium tracking-wide text-[#1a1a1a]">
            Testimonial
          </h2>
          <div>
            <label className={labelClass}>Testimonial Text</label>
            <textarea
              className={`${inputClass} min-h-[90px] resize-y`}
              value={form.testimonial ?? ''}
              onChange={(e) => update('testimonial', e.target.value)}
              placeholder="What the client said…"
            />
          </div>
          <div>
            <label className={labelClass}>Testimonial Author</label>
            <input
              className={inputClass}
              value={form.testimonial_author ?? ''}
              onChange={(e) => update('testimonial_author', e.target.value)}
              placeholder="e.g. Sanjana, Chennai"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-sm font-medium tracking-wide text-[#1a1a1a] mb-4">
            Images *
          </h2>
          <ImageUploader
            images={form.images}
            onChange={(imgs) => update('images', imgs)}
            folder="client-diaries"
          />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured_on_homepage}
              onChange={(e) => update('featured_on_homepage', e.target.checked)}
              className="w-4 h-4 accent-[#DCC898]"
            />
            <span className="text-sm text-[#1a1a1a]">
              Feature on homepage
            </span>
          </label>
          <div>
            <label className={labelClass}>Sort Order</label>
            <input
              type="number"
              className={`${inputClass} max-w-[140px]`}
              value={form.sort_order}
              onChange={(e) => update('sort_order', parseInt(e.target.value) || 0)}
            />
            <p className="text-xs text-gray-400 mt-1">
              Lower numbers appear first.
            </p>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-8 py-3 rounded-md text-sm font-medium tracking-wide uppercase hover:bg-black transition-colors disabled:opacity-50"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {isEdit ? 'Save Changes' : 'Create Diary'}
          </button>
          <Link
            href="/admin/client-diaries"
            className="px-6 py-3 text-sm text-gray-500 hover:text-[#1a1a1a] transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
