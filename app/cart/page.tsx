'use client';

import Image from 'next/image';
import ProductSlider from '../components/ProductSlider';
import { BsTrash } from 'react-icons/bs';
import { useCart } from '../context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, appliedCoupon, couponDiscount, finalTotal } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + (item.priceNumber * item.quantity), 0);
  const shipping = 0;
  const total = finalTotal;

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-32 md:pt-40 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl text-center md:text-4xl font-light tracking-[0.2em] mb-8 uppercase">
            Shopping Cart
          </h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600 mb-8">Your cart is empty</p>
              <Link
                href="/collection"
                className="inline-block bg-black text-white px-8 py-3 uppercase tracking-wider hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="border border-gray-200 p-4 md:p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="relative w-24 h-32 md:w-32 md:h-40 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-base md:text-xl font-medium uppercase tracking-wider mb-1">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-600 mb-2">{item.tagline}</p>
                          <p className="text-xs text-gray-700">Size: {item.size}</p>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Selector */}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                              className="md:w-8 md:h-8 w-4 h-4 border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              −
                            </button>
                            <span className="md:w-8 text-xs md:text-base text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                              className="md:w-8 md:h-8 w-4 h-4 border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              +
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-xs md:text-base font-medium">{item.price}</p>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <BsTrash size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="border border-gray-200 p-6 sticky top-32">
                  <h2 className="text-xl font-medium uppercase tracking-wider mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-xs md:text-base">
                      <span>Subtotal</span>
                      <span>Rs.{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs md:text-base">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-xs md:text-base text-green-600">
                        <span>Discount ({appliedCoupon})</span>
                        <span>- Rs.{couponDiscount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t pt-3 flex justify-between font-medium text-xs md:text-base">
                      <span>Total</span>
                      <span>Rs.{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push('/checkout')}
                    className="w-full bg-black text-white text-xs md:text-base md:py-3 py-2 uppercase tracking-wider hover:bg-gray-800 transition-colors mb-3"
                  >
                    Proceed to Checkout
                  </button>

                  <Link
                    href="/collection"
                    className="block w-full text-center border border-black text-black text-xs md:text-base md:py-3 py-2 uppercase tracking-wider hover:bg-gray-50 transition-colors"
                  >
                    Continue Shopping
                  </Link>

                  <div className="mt-6 pt-6 border-t text-xs md:text-sm text-gray-600 space-y-2">
                    <p>✓ Free shipping in India</p>
                    <p>✓ Secure checkout</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* Product Slider */}
      <ProductSlider />
    </div>
  );
}
