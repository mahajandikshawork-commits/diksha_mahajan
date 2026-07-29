'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/admin');
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await supabaseBrowser.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.replace('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0e0e0e]">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-10">
          <Image
            src="/logo.webp"
            alt="Diksha Mahajan"
            width={220}
            height={55}
            className="object-contain"
            priority
          />
        </div>

        <div className="bg-[#1a1a1a] border border-[#DCC898]/20 rounded-lg p-8 md:p-10 shadow-2xl">
          <h1 className="text-center text-white text-lg font-light tracking-[0.15em] uppercase mb-2">
            Admin Login
          </h1>
          <p className="text-center text-white/40 text-sm mb-8">
            Sign in to manage your website content
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-white/5 border border-white/20 rounded-md px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#DCC898] transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-white/5 border border-white/20 rounded-md px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#DCC898] transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#DCC898] text-black py-3 rounded-md text-sm font-medium tracking-wide uppercase hover:bg-[#C9B57E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
