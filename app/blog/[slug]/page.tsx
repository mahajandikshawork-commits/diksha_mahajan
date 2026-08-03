'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Blog, fetchBlogBySlug } from '@/lib/blogs';
import BlogContent from '@/app/components/BlogContent';

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogBySlug(slug).then((data) => {
      setBlog(data);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-28 flex items-center justify-center">
        <div className="animate-pulse text-gray-400 tracking-wider">Loading...</div>
      </div>
    );
  }

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-28">
      {/* Breadcrumb */}
      <div className="px-8 py-4 text-xs tracking-wider uppercase text-gray-500">
        <Link href="/blog" className="hover:text-black transition-colors">
          Journal
        </Link>
        <span className="mx-2">/</span>
        <span className="text-black line-clamp-1">{blog.title}</span>
      </div>

      <article className="mx-auto max-w-5xl px-6 md:px-8 pb-0">
        {/* Title */}
        <header className="text-center py-0 md:py-4">
          <h1 className="text-3xl md:text-5xl font-light tracking-[0.12em] uppercase mb-4 leading-tight">
            {blog.title}
          </h1>
          {blog.excerpt && (
            <p className="text-center text-sm md:text-base text-gray-500 italic mb-8">
              {blog.excerpt}
            </p>
          )}
        </header>

        {/* Body */}
        <BlogContent blocks={blog.blocks} />
      </article>

      {/* Back link */}
      <section className="px-8 pt-2 pb-12 text-center">
        <Link
          href="/blog"
          className="text-xs md:text-sm tracking-wider uppercase text-gray-500 hover:text-black transition-colors border-b border-gray-300 hover:border-black pb-1"
        >
          Back to Journal
        </Link>
      </section>
    </div>
  );
}
