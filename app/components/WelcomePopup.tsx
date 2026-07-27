'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';

export default function WelcomePopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

    useEffect(() => {
        const handleLoadingComplete = () => {
            const timer = setTimeout(() => setIsVisible(true), 5000);
            return () => clearTimeout(timer);
        };

        window.addEventListener('loading-complete', handleLoadingComplete);

        return () => {
            window.removeEventListener('loading-complete', handleLoadingComplete);
        };
    }, []);

    const handleClose = () => {
        setIsVisible(false);
    };

    const validate = () => {
        const newErrors: { name?: string; email?: string } = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await fetch('/api/welcome-popup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
        } catch (err) {
            console.error('Failed to submit form:', err);
        } finally {
            setIsSubmitting(false);
            handleClose();
        }
    };

    const handleContinueBrowsing = () => {
        handleClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-fadeIn">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Popup Container */}
            <div className="relative bg-[#1a1a1a] w-full max-w-md rounded-lg shadow-2xl border border-[#DCC898]/30 overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 text-white/60 hover:text-white transition-colors focus:outline-none"
                    aria-label="Close"
                >
                    <IoClose size={24} />
                </button>

                {/* Logo */}
                <div className="flex justify-center pt-8 pb-2 px-8">
                    <Image
                        src="/logo.webp"
                        alt="Diksha Mahajan"
                        width={200}
                        height={50}
                        className="object-contain"
                    />
                </div>

                {/* Content */}
                <div className="px-8 pb-8 pt-4">
                    <h2 className="text-center text-white text-xl font-light tracking-wide mb-2">
                        Welcome to Diksha Mahajan
                    </h2>
                    <p className="text-center text-white/50 text-sm mb-6">
                        Share your details to stay updated on our latest collections and exclusive offers
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Name *"
                                className="w-full bg-white/5 border border-white/20 rounded-md px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#DCC898] transition-colors"
                            />
                            {errors.name && (
                                <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email *"
                                className="w-full bg-white/5 border border-white/20 rounded-md px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#DCC898] transition-colors"
                            />
                            {errors.email && (
                                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Phone (optional) */}
                        <div>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone Number (optional)"
                                className="w-full bg-white/5 border border-white/20 rounded-md px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#DCC898] transition-colors"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#DCC898] text-black py-3 rounded-md text-sm font-medium tracking-wide hover:bg-[#C9B57E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>

                    {/* Continue Browsing */}
                    <button
                        onClick={handleContinueBrowsing}
                        className="w-full text-center text-white/40 text-sm mt-4 hover:text-white/70 transition-colors underline underline-offset-4"
                    >
                        Continue Browsing
                    </button>
                </div>
            </div>
        </div>
    );
}
