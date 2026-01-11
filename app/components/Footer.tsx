import Image from 'next/image';
import Link from 'next/link';
import { BsInstagram, BsWhatsapp } from 'react-icons/bs';

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white py-12 pb-20 md:pb-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Logo */}
          <div className="flex justify-center md:justify-start">
            <Image
              src="/logo.PNG"
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
