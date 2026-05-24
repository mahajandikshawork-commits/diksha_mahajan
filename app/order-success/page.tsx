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
      const data = JSON.parse(storedData);
      setOrderData(data);
      
      // Automatically trigger invoice download
      setTimeout(() => {
        downloadInvoice(data);
      }, 1000);
    }
  }, []);

  const downloadInvoice = (data: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice - ${data.orderId}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { background-color: #000; color: #fff; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 32px; letter-spacing: 5px; }
            .header p { margin: 5px 0 0 0; font-size: 14px; letter-spacing: 2px; }
            .content { padding: 40px 30px; }
            .title { text-align: center; margin-bottom: 30px; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .detail-box { background-color: #f5f5f5; padding: 20px; border-left: 4px solid #000; }
            .detail-box h3 { margin: 0 0 10px 0; font-size: 14px; color: #666; text-transform: uppercase; }
            .detail-box p { margin: 5px 0; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            thead { background-color: #000; color: #fff; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
            th { font-weight: 600; }
            .total-row { background-color: #f5f5f5; font-weight: 600; border-top: 2px solid #000; }
            .footer { background-color: #000; color: #fff; padding: 20px; text-align: center; font-size: 12px; margin-top: 40px; }
            .custom-measurements { margin-top: 8px; padding: 8px; background-color: #f9f9f9; font-size: 11px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>DIKSHA MAHAJAN</h1>
            <p>LUXURY BRIDAL & TROUSSEAU COUTURE</p>
          </div>
          <div class="content">
            <div class="title">
              <h2>ORDER INVOICE</h2>
              <p>Thank you for your order!</p>
            </div>
            <div class="details-grid">
              <div class="detail-box">
                <h3>Order Details</h3>
                <p><strong>Order ID:</strong> ${data.orderId}</p>
                <p><strong>Order Date:</strong> ${data.orderDate}</p>
                <p><strong>Status:</strong> <span style="color: #22c55e;">Confirmed</span></p>
              </div>
              <div class="detail-box">
                <h3>Shipping Address</h3>
                <p><strong>${data.customerDetails.name}</strong></p>
                <p>${data.customerDetails.address}</p>
                <p>${data.customerDetails.city}, ${data.customerDetails.state} - ${data.customerDetails.pincode}</p>
              </div>
            </div>
            <div class="detail-box">
              <h3>Contact Information</h3>
              <p>📧 ${data.customerDetails.email}</p>
              <p>📱 ${data.customerDetails.phone}</p>
            </div>
            <h3 style="margin-top: 30px;">Order Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${data.items.map((item: any) => `
                  <tr>
                    <td>
                      <strong>${item.name}</strong><br/>
                      <small style="color: #666;">${item.tagline}</small><br/>
                      <small style="color: #666;">Size: ${item.size}</small>
                      ${item.size === 'Custom' && item.customMeasurements ? `
                        <div class="custom-measurements">
                          <strong>Custom Measurements:</strong><br/>
                          ${Object.entries(item.customMeasurements).map(([key, value]) => `${key}: ${value}`).join('<br/>')}
                        </div>
                      ` : ''}
                    </td>
                    <td style="text-align: center;">${item.quantity}</td>
                    <td style="text-align: right;">${item.price}</td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr class="total-row">
                  <td colspan="2" style="text-align: right;">TOTAL:</td>
                  <td style="text-align: right; font-size: 18px;">${data.total}</td>
                </tr>
              </tfoot>
            </table>
            <div style="background-color: #f5f1e8; padding: 20px; margin-top: 30px; border-radius: 5px;">
              <h3>📦 What's Next?</h3>
              <ul style="line-height: 1.8;">
                <li>Your order will be processed within 2-3 business days</li>
                <li>We'll send you shipping updates via email and WhatsApp</li>
                <li>Estimated delivery: 15-20 business days (India) / 25-30 business days (International)</li>
              </ul>
            </div>
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #eee;">
              <p>For any queries, contact us at:</p>
              <p>📧 info@dikshamahajan.com | 📱 +91-9871907315</p>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Diksha Mahajan. All rights reserved.</p>
            <p>Luxury Bridal & Trousseau Couture</p>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-white pt-40 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-40 pb-16 px-4">
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
      <div className="min-h-screen bg-white pt-40 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
