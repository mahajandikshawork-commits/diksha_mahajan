'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BsInstagram, BsWhatsapp } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';

export default function Footer() {
  const [showSubscribePopup, setShowSubscribePopup] = useState(false);
  const [subscribeName, setSubscribeName] = useState('');
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeName.trim()) {
      setSubscribeMessage('Please enter your name');
      return;
    }
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
        body: JSON.stringify({ name: subscribeName, email: subscribeEmail }),
      });
      const data = await response.json();
      if (data.success) {
        setSubscribeMessage('Thank you for subscribing!');
        setSubscribeName('');
        setSubscribeEmail('');
        setTimeout(() => {
          setShowSubscribePopup(false);
          setSubscribeMessage('');
        }, 2000);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Logo + Newsletter */}
          <div className="flex flex-col items-center md:items-start gap-6">
            <Image
              src="/logo.webp"
              alt="Diksha Mahajan"
              width={280}
              height={50}
              className="object-contain"
            />

            {/* Newsletter Subscribe */}
            <div className="w-full max-w-xs">
              <p className="text-sm text-gray-300 mb-4 tracking-wide">
                Subscribe to receive updates on new collections, journal stories, and exclusive releases
              </p>
              <button
                onClick={() => setShowSubscribePopup(true)}
                className="relative w-full px-8 py-3 bg-[#DCC898] text-black font-medium tracking-wider text-xs uppercase overflow-hidden group border-1 border-[#DCC898]"
              >
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  Subscribe
                </span>
                <div className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              </button>
            </div>
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

      {/* Subscribe Popup */}
      {showSubscribePopup && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4"
          onClick={() => {
            setShowSubscribePopup(false);
            setSubscribeMessage('');
          }}
        >
          <div
            className="bg-[#FAF8F5] rounded-lg shadow-2xl p-8 md:p-10 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowSubscribePopup(false);
                setSubscribeMessage('');
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
              aria-label="Close"
            >
              <IoClose size={24} />
            </button>

            <h3 className="text-lg md:text-xl font-light tracking-[0.15em] uppercase mb-2 text-center text-black">
              Subscribe
            </h3>
            <p className="text-sm text-gray-500 mb-6 text-center tracking-wide">
              Receive updates on new collections, journal stories, and exclusive releases
            </p>

            <form onSubmit={handleSubscribe} className="space-y-4">
              <input
                type="text"
                value={subscribeName}
                onChange={(e) => setSubscribeName(e.target.value)}
                placeholder="Your name"
                className="w-full border border-gray-300 px-4 py-3 text-sm text-black bg-white focus:outline-none focus:border-black transition-colors"
              />
              <input
                type="email"
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border border-gray-300 px-4 py-3 text-sm text-black bg-white focus:outline-none focus:border-black transition-colors"
              />
              <button
                type="submit"
                disabled={subscribing}
                className="relative w-full px-8 py-3 bg-[#DCC898] text-black font-medium tracking-wider text-xs uppercase overflow-hidden group border-1 border-[#DCC898] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  {subscribing ? 'Subscribing...' : 'Subscribe'}
                </span>
                <div className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              </button>
            </form>

            {subscribeMessage && (
              <p className={`text-xs mt-4 text-center ${subscribeMessage.includes('Thank') ? 'text-green-600' : 'text-red-500'}`}>
                {subscribeMessage}
              </p>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
