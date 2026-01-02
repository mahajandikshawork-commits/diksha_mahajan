'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { BsHandbag } from 'react-icons/bs';
import { HiMenuAlt3 } from 'react-icons/hi';
import { IoClose, IoSearch } from 'react-icons/io5';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 w-full bg-black/80 backdrop-blur-sm text-white">
                <div className="w-full px-8 py-6">
                    {/* Mobile Layout */}
                    <div className="flex md:hidden items-center justify-between">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="hover:opacity-70 transition-opacity focus:outline-none flex-shrink-0"
                            aria-label="Menu"
                        >
                            <HiMenuAlt3 size={28} />
                        </button>

                        <div className="flex-1 flex justify-center px-4">
                            <Link href="/">
                                <Image
                                    src="/logo.PNG"
                                    alt="Diksha Mahajan"
                                    width={180}
                                    height={45}
                                    priority
                                    className="object-contain max-w-full h-auto cursor-pointer"
                                />
                            </Link>
                        </div>

                        <button className="relative hover:opacity-70 transition-opacity focus:outline-none flex-shrink-0" aria-label="Cart">
                            <BsHandbag size={24} className="outline-none" />
                            <span className="absolute -top-2 -right-2 bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                0
                            </span>
                        </button>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:grid md:grid-cols-3 items-center">
                        <nav className="flex items-center gap-8 text-sm tracking-wider">
                            <a 
                                href="/about" 
                                className="hover:opacity-70 transition-opacity uppercase"
                            >
                                About Us
                            </a>
                            <Link 
                                href="/collection"
                                className={`hover:opacity-70 transition-opacity uppercase ${
                                    pathname === '/collection' ? 'text-[#DCC898]' : ''
                                }`}
                            >
                                Collection
                            </Link>
                            <a 
                                href="#appointment" 
                                className="hover:opacity-70 transition-opacity uppercase"
                            >
                                Book Your Appointment
                            </a>
                        </nav>

                        <div className="flex justify-center items-center">
                            <Link href="/">
                                <Image
                                    src="/logo.PNG"
                                    alt="Diksha Mahajan"
                                    width={250}
                                    height={50}
                                    priority
                                    className="object-contain cursor-pointer"
                                />
                            </Link>
                        </div>

                        <div className="flex items-center gap-4 justify-end">
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="hover:opacity-70 transition-opacity focus:outline-none"
                                aria-label="Search"
                            >
                                <IoSearch size={22} />
                            </button>

                            <button className="relative hover:opacity-70 transition-opacity focus:outline-none" aria-label="Cart">
                                <BsHandbag size={24} className="outline-none" />
                                <span className="absolute -top-2 -right-2 bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                    0
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Desktop Search Bar */}
                    {isSearchOpen && (
                        <div className="mt-4 animate-fadeIn hidden md:block">
                            <div className="relative max-w-md mx-auto">
                                <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full bg-white/10 border border-white/20 rounded-full pl-12 pr-6 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                                    autoFocus
                                />
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {isMenuOpen && (
                <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm animate-fadeIn">
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between px-8 py-6">
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="hover:opacity-70 transition-opacity focus:outline-none text-white"
                                aria-label="Close menu"
                            >
                                <IoClose size={32} />
                            </button>

                            <div className="absolute left-1/2 transform -translate-x-1/2">
                                <Image
                                    src="/logo.PNG"
                                    alt="Diksha Mahajan"
                                    width={250}
                                    height={50}
                                    priority
                                    className="object-contain"
                                />
                            </div>

                            <button className="relative hover:opacity-70 transition-opacity focus:outline-none text-white" aria-label="Cart">
                                <BsHandbag size={24} className="outline-none" />
                                <span className="absolute -top-2 -right-2 bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                    0
                                </span>
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col items-center px-8">
                            <div className="w-full max-w-md mb-12">
                                <div className="relative">
                                    <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full bg-white/10 border border-white/20 rounded-full pl-12 pr-6 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                                    />
                                </div>
                            </div>
                            <nav className="flex flex-col items-center gap-8 text-white mb-12">
                                <a
                                    href="#about"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-base md:text-3xl font-light tracking-wider hover:opacity-70 transition-opacity uppercase"
                                >
                                    About Us
                                </a>
                                <Link
                                    href="/collection"
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`text-base md:text-3xl font-light tracking-wider hover:opacity-70 transition-opacity uppercase ${
                                        pathname === '/collection' ? 'text-[#DCC898]' : ''
                                    }`}
                                >
                                    Collection
                                </Link>
                                <a
                                    href="#appointment"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-base md:text-3xl font-light tracking-wider hover:opacity-70 transition-opacity uppercase"
                                >
                                    Book Your Appointment
                                </a>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
