'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { ClientDiary } from '@/lib/clientDiaries';
import DiaryForm from '../../DiaryForm';

export default function EditClientDiaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [diary, setDiary] = useState<ClientDiary | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    supabaseBrowser
      .from('client_diaries')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setDiary(data as ClientDiary);
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

  if (notFound || !diary) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <p className="text-gray-500 mb-4">Client diary not found.</p>
        <Link
          href="/admin/client-diaries"
          className="text-[#1a1a1a] font-medium text-sm hover:underline"
        >
          Back to Client Diaries
        </Link>
      </div>
    );
  }

  return <DiaryForm initial={diary} />;
}
