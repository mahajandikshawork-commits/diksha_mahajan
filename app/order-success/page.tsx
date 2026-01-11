'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { BsCheckCircle } from 'react-icons/bs';
import Invoice from '../components/Invoice';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    // Retrieve order data from sessionStorage
    const storedData = sessionStorage.getItem('orderData');
    if (storedData) {
      setOrderData(JSON.parse(storedData));
    }
  }, []);

  if (!orderData) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Success Message */}
        <div className="text-center mb-8">
          <BsCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-light tracking-wider mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-2">Thank you for your purchase</p>
          <p className="text-sm text-gray-500">Order ID: {orderData.orderId}</p>
        </div>

        {/* What's Next Section */}
        <div className="bg-white p-8 mb-8 max-w-3xl mx-auto rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-6 text-center">What happens next?</h2>
          <div className="space-y-4 text-gray-700">
            <div className="flex gap-4 items-start">
              <span className="text-3xl">📧</span>
              <div>
                <p className="font-medium">Order confirmation email sent</p>
                <p className="text-sm text-gray-600">
                  Check your inbox at <strong>{orderData.customerDetails.email}</strong> for order details and invoice
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-3xl">👗</span>
              <div>
                <p className="font-medium">Order processing</p>
                <p className="text-sm text-gray-600">Your bespoke piece will be crafted with care within 2-3 business days</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-3xl">📦</span>
              <div>
                <p className="font-medium">Shipping updates</p>
                <p className="text-sm text-gray-600">We'll keep you informed via email and WhatsApp</p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice */}
        <div className="mb-8">
          <Invoice
            orderId={orderData.orderId}
            orderDate={orderData.orderDate}
            customerDetails={orderData.customerDetails}
            items={orderData.items}
            total={orderData.total}
          />
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4 print:hidden">
          <p className="text-gray-600">
            For any queries, contact us at{' '}
            <a href="mailto:info@dikshamahajan.com" className="text-black underline">
              info@dikshamahajan.com
            </a>{' '}
            or{' '}
            <a href="tel:+919871907315" className="text-black underline">
              +91-9871907315
            </a>
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/collection"
              className="bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="border border-black px-8 py-3 hover:bg-gray-100 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white pt-32 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
