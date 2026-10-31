'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { BsWhatsapp } from 'react-icons/bs';
import Header from './Header';
import Footer from './Footer';
import CartSidebar from './CartSidebar';
import LoadingBar from './LoadingBar';
import WelcomePopup from './WelcomePopup';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // WelcomePopup counts its delay from this event, so fire it when the old 3.2 s
  // splash would have finished and the popup keeps appearing at the same moment.
  useEffect(() => {
    const timer = setTimeout(() => window.dispatchEvent(new Event('loading-complete')), 3200);
    return () => clearTimeout(timer);
  }, []);

  // Admin routes render without the public site chrome.
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <div>
        <LoadingBar />
        <Header />
        {children}
        <Footer />
        <CartSidebar />
        <WelcomePopup />

        {/* Fixed WhatsApp Button */}
        <Link
          href="https://wa.me/919871907315"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:bg-[#20BA5A] transition-all hover:scale-110 z-50"
          aria-label="Chat on WhatsApp"
        >
          <BsWhatsapp className="text-white" size={28} />
        </Link>
      </div>
    </>
  );
}
