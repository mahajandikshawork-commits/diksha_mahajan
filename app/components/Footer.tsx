'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BsInstagram, BsWhatsapp } from 'react-icons/bs';

export default function Footer() {
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail.trim() || !/^\S+@\S+\.\S+$/.test(subscribeEmail)) {
      setSubscribeMessage('Please enter a valid email');
      return;
    }
    setSubscribing(true);
    setSubscribeMessage('');
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subscribeEmail }),
      });
      const data = await response.json();
      if (data.success) {
        setSubscribeMessage('Thank you for subscribing!');
        setSubscribeEmail('');
      } else {
        setSubscribeMessage(data.message || 'Something went wrong.');
      }
    } catch {
      setSubscribeMessage('Failed to subscribe. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-[#1a1a1a] text-white py-12 pb-20 md:pb-12 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Subscribe Section */}
        <div className="text-center mb-12 pb-12 border-b border-white/10">
          <p className="text-sm md:text-base text-gray-300 mb-6 max-w-8xl mx-auto tracking-wide">
            Subscribe to receive updates on new collections, journal stories, and exclusive releases
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={subscribeEmail}
              onChange={(e) => setSubscribeEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder-white/50 focus:outline-none focus:border-[#DCC898] transition-colors"
            />
            <button
              type="submit"
              disabled={subscribing}
              className="relative px-8 py-3 bg-[#DCC898] text-black font-medium tracking-wider text-xs uppercase overflow-hidden group border-1 border-[#DCC898] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                {subscribing ? '...' : 'Subscribe'}
              </span>
              <div className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            </button>
          </form>
          {subscribeMessage && (
            <p className={`text-xs mt-3 ${subscribeMessage.includes('Thank') ? 'text-[#DCC898]' : 'text-red-400'}`}>
              {subscribeMessage}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Logo */}
          <div className="flex justify-center md:justify-start">
            <Image
              src="/logo.webp"
              alt="Diksha Mahajan"
              width={280}
              height={50}
              className="object-contain"
            />
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-medium mb-4 uppercase tracking-wider">Support</h3>
            <nav className="flex flex-col gap-3">
              <Link href="/returns-exchange" className="text-sm text-gray-300 hover:text-white transition-colors">
                Returns & Exchange Policy
              </Link>
              <Link href="/shipping" className="text-sm text-gray-300 hover:text-white transition-colors">
                Shipping Policy
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-medium mb-4 uppercase tracking-wider">Keep in touch</h3>
            <div className="space-y-3">
              <Link 
                href="mailto:info@dikshamahajan.com" 
                className="text-sm text-gray-300 hover:text-white transition-colors block"
              >
                info@dikshamahajan.com
              </Link>
              <Link 
                href="tel:+919871907315" 
                className="text-sm text-gray-300 hover:text-white transition-colors block"
              >
                +91-9871907315
              </Link>
              
              {/* Social Icons */}
              <div className="flex gap-3 pt-2">
                <Link
                  href="https://www.instagram.com/dikshamahajan_official/?igsh=MWVoM2x0NGc5ajdzcQ%3D%3D&utm_source=qr#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                  aria-label="Instagram"
                >
                  <BsInstagram className="text-pink-400" size={24} />
                </Link>
                <Link
                  href="https://wa.me/919871907315"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                  aria-label="WhatsApp"
                >
                  <BsWhatsapp className="text-green-400" size={24} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
