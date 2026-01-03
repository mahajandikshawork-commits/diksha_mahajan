import Image from 'next/image';
import Link from 'next/link';
import { BsInstagram, BsWhatsapp } from 'react-icons/bs';

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white py-12 px-8">
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
              unoptimized
            />
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-medium mb-4 uppercase tracking-wider">Support</h3>
            <nav className="flex flex-col gap-3">
              <Link href="/terms" className="text-sm text-gray-300 hover:text-white transition-colors">
                Terms & Condition
              </Link>
              <Link href="/returns" className="text-sm text-gray-300 hover:text-white transition-colors">
                Returns & Exhanges
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-medium mb-4 uppercase tracking-wider">Keep in touch</h3>
            <div className="space-y-3">
              <a 
                href="mailto:dikshamahajan@gmail.com" 
                className="text-sm text-gray-300 hover:text-white transition-colors block"
              >
                dikshamahajan@gmail.com
              </a>
              <a 
                href="tel:+919876543221" 
                className="text-sm text-gray-300 hover:text-white transition-colors block"
              >
                +91 98765 43221
              </a>
              
              {/* Social Icons */}
              <div className="flex gap-3 pt-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors"
                  aria-label="Instagram"
                >
                  <BsInstagram className="text-black" size={20} />
                </a>
                <a
                  href="https://wa.me/919876543221"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors"
                  aria-label="WhatsApp"
                >
                  <BsWhatsapp className="text-black" size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
