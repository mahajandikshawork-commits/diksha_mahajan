'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { SpotlightEntry } from '@/lib/spotlight';
import SpotlightForm from '../../SpotlightForm';

export default function EditSpotlightPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [entry, setEntry] = useState<SpotlightEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    supabaseBrowser
      .from('spotlight')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setEntry(data as SpotlightEntry);
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  if (notFound || !entry) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <p className="text-gray-500 mb-4">Spotlight entry not found.</p>
        <Link
          href="/admin/spotlight"
          className="text-[#1a1a1a] font-medium text-sm hover:underline"
        >
          Back to Celebrity Closet
        </Link>
      </div>
    );
  }

  return <SpotlightForm initial={entry} />;
}
