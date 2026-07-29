'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  BookHeart,
  FileText,
  ShoppingBag,
  Star,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase-browser';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Client Diaries', href: '/admin/client-diaries', icon: BookHeart },
  { label: 'Blogs', href: '/admin/blogs', icon: FileText, disabled: true },
  { label: 'Products', href: '/admin/products', icon: ShoppingBag, disabled: true },
  { label: 'Celebrity Images', href: '/admin/celebrities', icon: Star, disabled: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';

  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let active = true;

    const check = async () => {
      const { data } = await supabaseBrowser.auth.getSession();
      if (!active) return;
      const session = data.session;
      setAuthed(!!session);
      setEmail(session?.user?.email ?? null);
      setChecking(false);

      if (!session && !isLoginPage) {
        router.replace('/admin/login');
      }
    };

    check();

    const { data: sub } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session);
      setEmail(session?.user?.email ?? null);
      if (!session && !isLoginPage) {
        router.replace('/admin/login');
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [isLoginPage, router]);

  const handleLogout = async () => {
    await supabaseBrowser.auth.signOut();
    router.replace('/admin/login');
  };

  const handleReturnToWebsite = async () => {
    await supabaseBrowser.auth.signOut();
    router.push('/');
  };

  // Login page renders without the shell.
  if (isLoginPage) {
    return <div className="min-h-screen bg-[#0e0e0e]">{children}</div>;
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <div className="animate-pulse text-[#DCC898] tracking-[0.2em] uppercase text-sm">
          Loading…
        </div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <div className="text-white/50 tracking-wider text-sm">Redirecting…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-[#1a1a1a] text-white flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
          <Link href="/" className="block">
            <Image
              src="/logo.webp"
              alt="Diksha Mahajan"
              width={160}
              height={40}
              className="object-contain"
            />
          </Link>
          <button
            className="md:hidden text-white/60 hover:text-white"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            if (item.disabled) {
              return (
                <div
                  key={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-md text-white/30 cursor-not-allowed text-sm"
                >
                  <Icon size={18} />
                  <span className="flex-1">{item.label}</span>
                  <span className="text-[10px] uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded">
                    Soon
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-colors ${
                  active
                    ? 'bg-[#DCC898] text-black font-medium'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          {email && (
            <p className="px-4 pb-3 text-xs text-white/40 truncate">{email}</p>
          )}
          <button
            onClick={handleReturnToWebsite}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm text-[#DCC898] hover:bg-[#DCC898]/10 transition-colors mb-1"
          >
            <ExternalLink size={18} />
            <span>Return to Website</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-[#1a1a1a] text-white px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open menu" className="md:hidden">
            <Menu size={22} />
          </button>
          <span className="tracking-[0.15em] uppercase text-sm text-[#DCC898]">
            Admin
          </span>
          <div className="flex-1" />
          <button
            onClick={handleReturnToWebsite}
            className="flex items-center gap-2 text-xs tracking-wider uppercase text-[#DCC898] hover:text-white transition-colors"
          >
            <ExternalLink size={16} />
            <span className="hidden sm:inline">Return to Website</span>
          </button>
        </header>

        <main className="flex-1 p-5 md:p-10">{children}</main>
      </div>
    </div>
  );
}
