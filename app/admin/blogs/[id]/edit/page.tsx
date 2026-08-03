'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { Blog } from '@/lib/blogs';
import BlogForm from '../../BlogForm';

export default function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    supabaseBrowser
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setBlog(data as Blog);
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

  if (notFound || !blog) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <p className="text-gray-500 mb-4">Blog not found.</p>
        <Link
          href="/admin/blogs"
          className="text-[#1a1a1a] font-medium text-sm hover:underline"
        >
          Back to Blogs
        </Link>
      </div>
    );
  }

  return <BlogForm initial={blog} />;
}
