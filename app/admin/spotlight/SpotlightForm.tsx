'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { SpotlightEntry } from '@/lib/spotlight';
import productsData from '@/data/products.json';
import ImageUploader from '../components/ImageUploader';

interface SpotlightFormProps {
  initial?: SpotlightEntry;
}

export default function SpotlightForm({ initial }: SpotlightFormProps) {
  const router = useRouter();
  const isEdit = !!initial;

  const [form, setForm] = useState({
    name: initial?.name ?? '',
    images: initial?.images ?? ([] as string[]),
    product_link: initial?.product_link ?? '',
    sort_order: initial?.sort_order ?? 0,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return 'Name is required';
    if (form.images.length === 0) return 'At least one image is required';
    const link = form.product_link.trim();
    if (!link) return 'Product link is required';
    if (!/^(\/|https?:\/\/)/.test(link))
      return 'Product link must start with / (e.g. /product/aayat) or https://';
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
      name: form.name.trim(),
      images: form.images,
      product_link: form.product_link.trim(),
      sort_order: form.sort_order,
    };

    const { error: dbError } = isEdit
      ? await supabaseBrowser
          .from('spotlight')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', initial!.id)
      : await supabaseBrowser.from('spotlight').insert(payload);

    if (dbError) {
      setError(dbError.message);
      setSaving(false);
      return;
    }

    router.push('/admin/spotlight');
    router.refresh();
  };

  const inputClass =
    'w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-[#1a1a1a] bg-white focus:outline-none focus:border-[#DCC898] transition-colors';
  const labelClass =
    'block text-xs uppercase tracking-wider text-gray-500 mb-1.5';

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/admin/spotlight"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a1a1a] transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to Celebrity Closet
      </Link>

      <h1 className="text-2xl font-light tracking-[0.1em] uppercase text-[#1a1a1a] mb-8">
        {isEdit ? 'Edit Spotlight' : 'New Spotlight'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
          <div>
            <label className={labelClass}>Name *</label>
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="e.g. Arunita Kanjilal"
            />
          </div>
          <div>
            <label className={labelClass}>Product Link *</label>
            <input
              className={inputClass}
              list="spotlight-products"
              value={form.product_link}
              onChange={(e) => update('product_link', e.target.value)}
              placeholder="/product/aayat"
            />
            <datalist id="spotlight-products">
              {productsData.map((p) => (
                <option key={p.slug} value={`/product/${p.slug}`}>
                  {p.name}
                </option>
              ))}
            </datalist>
            <p className="text-xs text-gray-400 mt-1">
              Start typing to pick a product, or paste any link. Opens from the &ldquo;More Info&rdquo; button.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-sm font-medium tracking-wide text-[#1a1a1a] mb-4">
            Images *
          </h2>
          <ImageUploader
            images={form.images}
            onChange={(imgs) => update('images', imgs)}
            folder="spotlight"
          />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label className={labelClass}>Sort Order</label>
          <input
            type="number"
            className={`${inputClass} max-w-[140px]`}
            value={form.sort_order}
            onChange={(e) => update('sort_order', parseInt(e.target.value) || 0)}
          />
          <p className="text-xs text-gray-400 mt-1">Lower numbers appear first.</p>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-8 py-3 rounded-md text-sm font-medium tracking-wide uppercase hover:bg-black transition-colors disabled:opacity-50"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {isEdit ? 'Save Changes' : 'Create Spotlight'}
          </button>
          <Link
            href="/admin/spotlight"
            className="px-6 py-3 text-sm text-gray-500 hover:text-[#1a1a1a] transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
