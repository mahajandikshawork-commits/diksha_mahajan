'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Loader2, FileText, Eye, EyeOff } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { Blog, DEFAULT_BLOG_COVER } from '@/lib/blogs';

export default function AdminBlogsList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await supabaseBrowser
      .from('blogs')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (err) {
      setError(err.message);
    } else {
      setBlogs((data as Blog[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (blog: Blog) => {
    if (!confirm(`Delete "${blog.title}"? This cannot be undone.`)) return;

    setDeletingId(blog.id);

    // Best-effort cleanup of images stored in the client-diaries bucket.
    const urls = [
      blog.cover_image,
      ...blog.blocks.map((b) => (b.type === 'image' ? b.url : null)),
    ].filter((u): u is string => !!u);

    const paths = urls
      .map((url) => {
        const marker = '/client-diaries/';
        const idx = url.indexOf(marker);
        return idx >= 0 ? url.slice(idx + marker.length) : null;
      })
      .filter((p): p is string => !!p);

    if (paths.length > 0) {
      await supabaseBrowser.storage.from('client-diaries').remove(paths);
    }

    const { error: err } = await supabaseBrowser.from('blogs').delete().eq('id', blog.id);

    if (err) {
      setError(err.message);
    } else {
      setBlogs((prev) => prev.filter((b) => b.id !== blog.id));
    }
    setDeletingId(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-light tracking-[0.1em] uppercase text-[#1a1a1a]">
            Blogs
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {blogs.length} {blogs.length === 1 ? 'blog' : 'blogs'}
          </p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-5 py-3 rounded-md text-sm font-medium tracking-wide uppercase hover:bg-black transition-colors whitespace-nowrap"
        >
          <Plus size={16} />
          New Blog
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
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
          <FileText size={28} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">No blogs yet.</p>
          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center gap-2 text-[#1a1a1a] font-medium text-sm hover:underline"
          >
            <Plus size={16} />
            Write your first blog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden group"
            >
              <div className="relative aspect-[16/9] bg-gray-100">
                <Image
                  src={blog.cover_image || DEFAULT_BLOG_COVER}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <span
                  className={`absolute top-2 left-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-1 rounded ${
                    blog.published
                      ? 'bg-[#DCC898] text-black'
                      : 'bg-gray-800 text-white'
                  }`}
                >
                  {blog.published ? <Eye size={11} /> : <EyeOff size={11} />}
                  {blog.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="p-4">
                <h2 className="text-base font-medium tracking-wide text-[#1a1a1a] line-clamp-2">
                  {blog.title}
                </h2>
                {blog.excerpt && (
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                    {blog.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-4">
                  <Link
                    href={`/admin/blogs/${blog.id}/edit`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 border border-gray-300 rounded-md py-2 text-sm text-[#1a1a1a] hover:border-[#DCC898] transition-colors"
                  >
                    <Pencil size={14} />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(blog)}
                    disabled={deletingId === blog.id}
                    className="inline-flex items-center justify-center gap-1.5 border border-gray-300 rounded-md py-2 px-3 text-sm text-red-500 hover:border-red-300 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {deletingId === blog.id ? (
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
