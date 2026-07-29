'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Loader2, Star } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { ClientDiary } from '@/lib/clientDiaries';

export default function AdminClientDiariesList() {
  const [diaries, setDiaries] = useState<ClientDiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await supabaseBrowser
      .from('client_diaries')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (err) {
      setError(err.message);
    } else {
      setDiaries((data as ClientDiary[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (diary: ClientDiary) => {
    if (
      !confirm(
        `Delete "${diary.outfit_name}"? This cannot be undone.`
      )
    )
      return;

    setDeletingId(diary.id);

    // Remove associated storage images (best-effort).
    const paths = diary.images
      .map((url) => {
        const marker = '/client-diaries/';
        const idx = url.indexOf(marker);
        return idx >= 0 ? url.slice(idx + 1) : null;
      })
      .filter((p): p is string => !!p)
      .map((p) => p.replace(/^client-diaries\//, ''));

    if (paths.length > 0) {
      await supabaseBrowser.storage.from('client-diaries').remove(paths);
    }

    const { error: err } = await supabaseBrowser
      .from('client_diaries')
      .delete()
      .eq('id', diary.id);

    if (err) {
      setError(err.message);
    } else {
      setDiaries((prev) => prev.filter((d) => d.id !== diary.id));
    }
    setDeletingId(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-light tracking-[0.1em] uppercase text-[#1a1a1a]">
            Client Diaries
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {diaries.length} {diaries.length === 1 ? 'entry' : 'entries'}
          </p>
        </div>
        <Link
          href="/admin/client-diaries/new"
          className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-5 py-3 rounded-md text-sm font-medium tracking-wide uppercase hover:bg-black transition-colors whitespace-nowrap"
        >
          <Plus size={16} />
          New Diary
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
      ) : diaries.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">No client diaries yet.</p>
          <Link
            href="/admin/client-diaries/new"
            className="inline-flex items-center gap-2 text-[#1a1a1a] font-medium text-sm hover:underline"
          >
            <Plus size={16} />
            Create your first entry
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {diaries.map((diary) => (
            <div
              key={diary.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden group"
            >
              <div className="relative aspect-[3/4] bg-gray-100">
                {diary.images[0] && (
                  <Image
                    src={diary.images[0]}
                    alt={diary.outfit_name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                )}
                {diary.featured_on_homepage && (
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-[#DCC898] text-black text-[10px] uppercase tracking-wider px-2 py-1 rounded">
                    <Star size={11} /> Featured
                  </span>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-base font-medium tracking-wide text-[#1a1a1a] truncate">
                  {diary.outfit_name}
                </h2>
                <p className="text-sm text-gray-500 truncate mt-0.5">
                  {diary.client_name} · {diary.city} · {diary.occasion}
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <Link
                    href={`/admin/client-diaries/${diary.id}/edit`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 border border-gray-300 rounded-md py-2 text-sm text-[#1a1a1a] hover:border-[#DCC898] transition-colors"
                  >
                    <Pencil size={14} />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(diary)}
                    disabled={deletingId === diary.id}
                    className="inline-flex items-center justify-center gap-1.5 border border-gray-300 rounded-md py-2 px-3 text-sm text-red-500 hover:border-red-300 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {deletingId === diary.id ? (
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
