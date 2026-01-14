'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const { name, email, phone, address, city, state, pincode } = formData;
    const newErrors = {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
    };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }
    if (!address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }
    if (!city.trim()) {
      newErrors.city = 'City is required';
      isValid = false;
    }
    if (!state.trim()) {
      newErrors.state = 'State is required';
      isValid = false;
    }
    if (!pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
      isValid = false;
    } else if (!/^\d{6}$/.test(pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    if (cartItems.length === 0) {
      return;
    }

    setLoading(true);

    try {
      // Create order (simulating successful payment)
      const orderResponse = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderDetails: {
            items: cartItems,
            total: `Rs.${cartTotal.toLocaleString('en-IN')}`,
          },
          customerDetails: formData,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      // Store order data in sessionStorage for the success page
      sessionStorage.setItem('orderData', JSON.stringify({
        orderId: orderData.orderId,
        orderDate: orderData.orderDate,
        customerDetails: formData,
        items: cartItems,
        total: `Rs.${cartTotal.toLocaleString('en-IN')}`,
      }));

      // Clear cart and redirect to success page
      clearCart();
      router.push(`/order-success?order_id=${orderData.orderId}`);
    } catch (error: any) {
      console.error('Order error:', error);
      alert(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-light mb-4">Your cart is empty</h1>
          <button
            onClick={() => router.push('/collection')}
            className="bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-light tracking-wider mb-8 text-center">CHECKOUT</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Details Form */}
          <div className="bg-gray-50 p-6 md:p-8">
            <h2 className="text-xl font-medium mb-6">Shipping Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${errors.name ? 'text-red-500' : ''}`}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full border px-4 py-2 focus:outline-none ${
                    errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-black'
                  }`}
                  required
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${errors.email ? 'text-red-500' : ''}`}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full border px-4 py-2 focus:outline-none ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-black'
                  }`}
                  required
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${errors.phone ? 'text-red-500' : ''}`}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="10-digit number"
                  className={`w-full border px-4 py-2 focus:outline-none ${
                    errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-black'
                  }`}
                  required
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${errors.address ? 'text-red-500' : ''}`}>
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full border px-4 py-2 focus:outline-none ${
                    errors.address ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-black'
                  }`}
                  required
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${errors.city ? 'text-red-500' : ''}`}>
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full border px-4 py-2 focus:outline-none ${
                      errors.city ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-black'
                    }`}
                    required
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${errors.state ? 'text-red-500' : ''}`}>
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full border px-4 py-2 focus:outline-none ${
                      errors.state ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-black'
                    }`}
                    required
                  />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${errors.pincode ? 'text-red-500' : ''}`}>
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="6-digit pincode"
                  className={`w-full border px-4 py-2 focus:outline-none ${
                    errors.pincode ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-black'
                  }`}
                  required
                />
                {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-gray-50 p-6 md:p-8 mb-6">
              <h2 className="text-xl font-medium mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <div key={`${item.id}-${item.size}-${index}`} className="flex gap-4">
                    <div className="relative w-20 h-24 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-xs text-gray-600">{item.tagline}</p>
                      <p className="text-xs text-gray-600 mt-1">Size: {item.size}</p>
                      <p className="text-sm mt-1">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-b py-4">
                <div className="flex justify-between text-lg font-medium">
                  <span>Total <span className="text-xs text-gray-600">(Inclusive of all taxes)</span></span>
                  <span>Rs.{cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="mt-6 text-xs md:text-sm text-gray-600 space-y-2">
                  <p>✓ Free shipping in India</p>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-black text-white py-4 hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing Order...' : 'Place Order'}
            </button>

            <div className="mt-4 text-center text-sm text-gray-600">
              <p>🔒 Secure checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
