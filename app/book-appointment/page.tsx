'use client';

import { useState } from 'react';
import Image from 'next/image';
import { trackAppointmentSubmit, generateEventId } from '@/lib/tracking';

const EVENT_OPTIONS = [
  'Wedding',
  'Engagement',
  'Mehendi',
  'Cocktails',
  'Reception',
  'Haldi',
  'Sangeet',
  'Festive',
  'Others',
];

export default function BookAppointmentPage() {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    countryCode: '+91',
    phone: '',
    email: '',
    event: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const COUNTRY_CODES = [
    { code: '+91', flag: '\u{1F1EE}\u{1F1F3}', label: 'India' },
    { code: '+1', flag: '\u{1F1FA}\u{1F1F8}', label: 'USA/Canada' },
    { code: '+44', flag: '\u{1F1EC}\u{1F1E7}', label: 'UK' },
    { code: '+971', flag: '\u{1F1E6}\u{1F1EA}', label: 'UAE' },
    { code: '+965', flag: '\u{1F1F0}\u{1F1FC}', label: 'Kuwait' },
    { code: '+966', flag: '\u{1F1F8}\u{1F1E6}', label: 'Saudi Arabia' },
    { code: '+974', flag: '\u{1F1F6}\u{1F1E6}', label: 'Qatar' },
    { code: '+968', flag: '\u{1F1F4}\u{1F1F2}', label: 'Oman' },
    { code: '+973', flag: '\u{1F1E7}\u{1F1ED}', label: 'Bahrain' },
    { code: '+65', flag: '\u{1F1F8}\u{1F1EC}', label: 'Singapore' },
    { code: '+61', flag: '\u{1F1E6}\u{1F1FA}', label: 'Australia' },
    { code: '+49', flag: '\u{1F1E9}\u{1F1EA}', label: 'Germany' },
    { code: '+33', flag: '\u{1F1EB}\u{1F1F7}', label: 'France' },
    { code: '+31', flag: '\u{1F1F3}\u{1F1F1}', label: 'Netherlands' },
    { code: '+27', flag: '\u{1F1FF}\u{1F1E6}', label: 'South Africa' },
    { code: '+92', flag: '\u{1F1F5}\u{1F1F0}', label: 'Pakistan' },
    { code: '+880', flag: '\u{1F1E7}\u{1F1E9}', label: 'Bangladesh' },
    { code: '+94', flag: '\u{1F1F8}\u{1F1F0}', label: 'Sri Lanka' },
    { code: '+977', flag: '\u{1F1F3}\u{1F1F5}', label: 'Nepal' },
    { code: '+60', flag: '\u{1F1F2}\u{1F1FE}', label: 'Malaysia' },
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.event) newErrors.event = 'Please select an event';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const eventId = generateEventId();
    try {
      const response = await fetch('/api/book-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, eventId }),
      });
      const data = await response.json();
      if (data.success) {
        await trackAppointmentSubmit(formData, eventId);
        setSubmitted(true);
      } else {
        alert(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      alert('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative w-full overflow-hidden">
      {/* Full-screen Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/bg-image.webp"
          alt="Book Your Appointment"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Floating Card with Form */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16 md:py-24">
        <div className="w-full max-w-2xl bg-[#FAF8F5] rounded-lg shadow-2xl p-8 md:p-12">
          {submitted ? (
            <div className="text-center py-8">
              <h2 className="text-xl md:text-3xl font-light tracking-wider uppercase mb-6">
                Thank You, {formData.name}!
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Your appointment request has been noted. Please click below to
                confirm your slot on our calendar.
              </p>
              <a
                href="https://calendly.com/dikshamahajan-info/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-block px-12 py-3 bg-[#DCC898] text-black font-medium tracking-wider text-xs md:text-base uppercase overflow-hidden group border-1 border-[#DCC898]"
              >
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  Book Now
                </span>
                <div className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              </a>
            </div>
          ) : (
            <>
              <h2 className="text-xl md:text-3xl font-light tracking-[0.2em] uppercase mb-2 text-center">
                Book Your Appointment
              </h2>
              <p className="text-sm text-gray-500 mb-8 text-center tracking-wider">
                Fill in your details and we&apos;ll schedule your consultation
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Row 1: Name + City */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2 tracking-wide">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full border px-4 py-3 focus:outline-none transition-colors bg-white ${
                        errors.name
                          ? 'border-red-500'
                          : 'border-gray-300 focus:border-black'
                      }`}
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 tracking-wide">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full border px-4 py-3 focus:outline-none transition-colors bg-white ${
                        errors.city
                          ? 'border-red-500'
                          : 'border-gray-300 focus:border-black'
                      }`}
                      placeholder="Your city"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>
                </div>

                {/* Row 2: Phone + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2 tracking-wide">
                      Phone No <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleChange}
                        className={`flex-shrink-0 items-center justify-center flex w-[80px] border border-r-0 px-1 py-3 focus:outline-none transition-colors bg-white text-sm whitespace-nowrap ${
                          errors.phone
                            ? 'border-red-500'
                            : 'border-gray-300 focus:border-black'
                        }`}
                      >
                        {COUNTRY_CODES.map((cc) => (
                          <option key={cc.code} value={cc.code}>
                            {cc.flag} {cc.code}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full min-w-0 border px-4 py-3 focus:outline-none transition-colors bg-white ${
                          errors.phone
                            ? 'border-red-500'
                            : 'border-gray-300 focus:border-black'
                        }`}
                        placeholder="10-digit number"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 tracking-wide">
                      Email ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full border px-4 py-3 focus:outline-none transition-colors bg-white ${
                        errors.email
                          ? 'border-red-500'
                          : 'border-gray-300 focus:border-black'
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Row 3: Event */}
                <div>
                  <label className="block text-sm font-medium mb-2 tracking-wide">
                    Event <span className="text-red-500">*</span>
                  </label>
                    <select
                      name="event"
                      value={formData.event}
                      onChange={handleChange}
                      className={`w-full border px-4 py-3 focus:outline-none transition-colors bg-white ${
                        errors.event
                          ? 'border-red-500'
                          : 'border-gray-300 focus:border-black'
                      }`}
                    >
                      <option value="">Select an event</option>
                      {EVENT_OPTIONS.map((event) => (
                        <option key={event} value={event}>
                          {event}
                        </option>
                      ))}
                    </select>
                    {errors.event && (
                      <p className="text-red-500 text-xs mt-1">{errors.event}</p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="relative w-full px-12 py-3 bg-[#DCC898] text-black font-medium tracking-wider text-xs md:text-base uppercase overflow-hidden group border-1 border-[#DCC898] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                      {submitting ? 'Submitting...' : 'Book Now'}
                    </span>
                    <div className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
