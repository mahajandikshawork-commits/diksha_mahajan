'use client';

import { useState } from 'react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}

export default function CheckoutModal({ isOpen, onClose, total }: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Checkout submitted:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-light tracking-wider uppercase">Checkout</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:opacity-70 transition-opacity"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-medium uppercase tracking-wider mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-wide block mb-2">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide block mb-2">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide block mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide block mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-lg font-medium uppercase tracking-wider mb-4">Shipping Address</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wide block mb-2">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wide block mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide block mb-2">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide block mb-2">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide block mb-2">Country *</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
                  >
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="UAE">UAE</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium uppercase tracking-wider mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs.{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-medium text-base pt-2 border-t">
                <span>Total</span>
                <span>Rs.{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}
