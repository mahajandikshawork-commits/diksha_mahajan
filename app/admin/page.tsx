'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookHeart, FileText, ShoppingBag, Star, ArrowRight } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase-browser';

interface DashboardCard {
  label: string;
  href: string;
  icon: React.ElementType;
  description: string;
  disabled?: boolean;
}

const CARDS: DashboardCard[] = [
  {
    label: 'Client Diaries',
    href: '/admin/client-diaries',
    icon: BookHeart,
    description: 'Add, edit, and manage client stories and testimonials.',
  },
  {
    label: 'Blogs',
    href: '/admin/blogs',
    icon: FileText,
    description: 'Publish and manage journal articles.',
    disabled: true,
  },
  {
    label: 'Products',
    href: '/admin/products',
    icon: ShoppingBag,
    description: 'Manage the collection catalogue.',
    disabled: true,
  },
  {
    label: 'Celebrity Images',
    href: '/admin/celebrities',
    icon: Star,
    description: 'Curate celebrity and spotlight imagery.',
    disabled: true,
  },
];

export default function AdminDashboard() {
  const [diaryCount, setDiaryCount] = useState<number | null>(null);

  useEffect(() => {
    supabaseBrowser
      .from('client_diaries')
      .select('id', { count: 'exact', head: true })
      .then(({ count }) => setDiaryCount(count ?? 0));
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-light tracking-[0.1em] uppercase text-[#1a1a1a]">
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Manage your website content from one place.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CARDS.map((card) => {
          const Icon = card.icon;
          const content = (
            <div
              className={`h-full bg-white rounded-lg border border-gray-200 p-6 transition-all ${
                card.disabled
                  ? 'opacity-60'
                  : 'hover:border-[#DCC898] hover:shadow-md group'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-md bg-[#1a1a1a] flex items-center justify-center text-[#DCC898]">
                  <Icon size={20} />
                </div>
                {card.label === 'Client Diaries' && diaryCount !== null && (
                  <span className="text-2xl font-light text-[#1a1a1a]">
                    {diaryCount}
                  </span>
                )}
                {card.disabled && (
                  <span className="text-[10px] uppercase tracking-wider bg-gray-100 text-gray-400 px-2 py-1 rounded">
                    Coming Soon
                  </span>
                )}
              </div>
              <h2 className="text-base font-medium tracking-wide text-[#1a1a1a] mb-1 flex items-center gap-2">
                {card.label}
                {!card.disabled && (
                  <ArrowRight
                    size={15}
                    className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#DCC898]"
                  />
                )}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                {card.description}
              </p>
            </div>
          );

          if (card.disabled) {
            return <div key={card.href}>{content}</div>;
          }

          return (
            <Link key={card.href} href={card.href} className="block">
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
