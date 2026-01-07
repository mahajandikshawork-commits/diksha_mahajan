'use client';

import { useCart } from '../context/CartContext';
import Image from 'next/image';
import { BsX, BsTrash } from 'react-icons/bs';

export default function CartSidebar() {
  const { cartItems, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, cartTotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white z-50 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-medium uppercase tracking-wider">
            Cart ({cartItems.length})
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-2xl hover:opacity-70 transition-opacity"
            aria-label="Close cart"
          >
            <BsX size={32} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-4">Your cart is empty</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-sm underline hover:no-underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size}`} className="border border-gray-200 p-3">
                  <div className="flex gap-3">
                    {/* Product Image */}
                    <div className="relative w-20 h-24 flex-shrink-0">
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
                        <h3 className="text-sm font-medium uppercase tracking-wider mb-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-600 mb-1">{item.tagline}</p>
                        <p className="text-xs text-gray-700">Size: {item.size}</p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                            className="w-6 h-6 border border-gray-300 flex items-center justify-center text-xs hover:bg-gray-100 transition-colors"
                          >
                            −
                          </button>
                          <span className="text-sm w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                            className="w-6 h-6 border border-gray-300 flex items-center justify-center text-xs hover:bg-gray-100 transition-colors"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <p className="text-sm font-medium">{item.price}</p>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="text-gray-400 hover:text-red-500 transition-colors self-start"
                      aria-label="Remove item"
                    >
                      <BsTrash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between items-center text-lg font-medium">
              <span>Total</span>
              <span>Rs.{cartTotal.toLocaleString()}</span>
            </div>
            <Link
              href="/cart"
              className="block w-full bg-black text-white text-center py-3 uppercase tracking-wider hover:bg-gray-800 transition-colors"
              onClick={() => setIsCartOpen(false)}
            >
              View Cart & Checkout
            </Link>
            <button
              onClick={() => setIsCartOpen(false)}
              className="block w-full border border-black text-black text-center py-3 uppercase tracking-wider hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
