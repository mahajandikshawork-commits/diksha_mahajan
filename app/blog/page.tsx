'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Blog, DEFAULT_BLOG_COVER, fetchPublishedBlogs } from '@/lib/blogs';

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPublishedBlogs().then((data) => {
      setBlogs(data);
      setLoading(false);
    });
  }, []);

  const markLoaded = (id: string) =>
    setLoaded((prev) => new Set(prev).add(id));

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-28">
      {/* Header */}
      <section className="px-8 py-12 md:py-20 text-center max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-light tracking-[0.15em] uppercase mb-6">
          The Heirloom Journal
        </h1>
        <p className="text-sm md:text-lg text-gray-600 font-light italic tracking-wide leading-relaxed">
          Stories, inspiration, and notes from the atelier
        </p>
      </section>

      {/* Grid */}
      <section className="px-4 md:px-8 pb-16">
        {loading ? (
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-full aspect-[16/9] animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <p className="text-center text-gray-400 py-16">
            No blogs published yet. Check back soon.
          </p>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {blogs.map((blog) => (
              <Link key={blog.id} href={`/blog/${blog.slug}`} className="group block">
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
                  {!loaded.has(blog.id) && (
                    <div className="absolute inset-0 animate-pulse bg-gray-200" />
                  )}
                  <Image
                    src={blog.cover_image || DEFAULT_BLOG_COVER}
                    alt={blog.title}
                    fill
                    className={`object-cover transition-all duration-700 group-hover:scale-105 ${
                      loaded.has(blog.id) ? 'opacity-100' : 'opacity-0'
                    }`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    onLoad={() => markLoaded(blog.id)}
                  />
                </div>
                <div className="pt-5">
                  <h2 className="text-lg md:text-xl font-light tracking-wide uppercase mb-2 group-hover:text-[#8a7a4e] transition-colors">
                    {blog.title}
                  </h2>
                  {blog.excerpt && (
                    <p className="text-sm text-gray-500 font-light leading-relaxed line-clamp-3">
                      {blog.excerpt}
                    </p>
                  )}
                  <span className="mt-4 inline-block text-xs tracking-wider uppercase text-black border-b border-[#DCC898] pb-1 group-hover:border-black transition-colors">
                    Read More
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
