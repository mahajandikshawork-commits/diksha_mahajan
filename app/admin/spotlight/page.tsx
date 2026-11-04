'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { supabaseBrowser, CLIENT_DIARIES_BUCKET } from '@/lib/supabase-browser';
import { SpotlightEntry, fetchSpotlight } from '@/lib/spotlight';

export default function AdminSpotlightList() {
  const [entries, setEntries] = useState<SpotlightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSpotlight().then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (entry: SpotlightEntry) => {
    if (!confirm(`Delete "${entry.name}"? This cannot be undone.`)) return;

    setDeletingId(entry.id);

    // Remove uploaded images (best-effort); original /public images are left alone.
    const marker = `/${CLIENT_DIARIES_BUCKET}/`;
    const paths = entry.images
      .filter((url) => url.includes(marker))
      .map((url) => url.slice(url.indexOf(marker) + marker.length));

    if (paths.length > 0) {
      await supabaseBrowser.storage.from(CLIENT_DIARIES_BUCKET).remove(paths);
    }

    const { error: err } = await supabaseBrowser
      .from('spotlight')
      .delete()
      .eq('id', entry.id);

    if (err) {
      setError(err.message);
    } else {
      setEntries((prev) => prev.filter((e) => e.id !== entry.id));
    }
    setDeletingId(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-light tracking-[0.1em] uppercase text-[#1a1a1a]">
            Celebrity Closet
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </p>
        </div>
        <Link
          href="/admin/spotlight/new"
          className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-5 py-3 rounded-md text-sm font-medium tracking-wide uppercase hover:bg-black transition-colors whitespace-nowrap"
        >
          <Plus size={16} />
          New Spotlight
        </Link>
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-100 rounded-md p-3">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">No spotlight entries yet.</p>
          <Link
            href="/admin/spotlight/new"
            className="inline-flex items-center gap-2 text-[#1a1a1a] font-medium text-sm hover:underline"
          >
            <Plus size={16} />
            Create your first entry
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <div className="relative aspect-[3/4] bg-gray-100">
                {entry.images[0] && (
                  <Image
                    src={entry.images[0]}
                    alt={entry.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                )}
              </div>
              <div className="p-4">
                <h2 className="text-base font-medium tracking-wide text-[#1a1a1a] truncate">
                  {entry.name}
                </h2>
                <p className="text-sm text-gray-500 truncate mt-0.5">
                  {entry.product_link} · {entry.images.length}{' '}
                  {entry.images.length === 1 ? 'image' : 'images'}
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <Link
                    href={`/admin/spotlight/${entry.id}/edit`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 border border-gray-300 rounded-md py-2 text-sm text-[#1a1a1a] hover:border-[#DCC898] transition-colors"
                  >
                    <Pencil size={14} />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(entry)}
                    disabled={deletingId === entry.id}
                    aria-label={`Delete ${entry.name}`}
                    className="inline-flex items-center justify-center gap-1.5 border border-gray-300 rounded-md py-2 px-3 text-sm text-red-500 hover:border-red-300 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {deletingId === entry.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
