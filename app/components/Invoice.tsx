'use client';

import Image from 'next/image';

interface InvoiceProps {
  orderId: string;
  orderDate: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: Array<{
    id: number;
    name: string;
    tagline: string;
    price: string;
    image: string;
    size: string;
    quantity: number;
    customMeasurements?: Record<string, string>;
  }>;
  total: string;
}

export default function Invoice({
  orderId,
  orderDate,
  customerDetails,
  items,
  total,
}: InvoiceProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a printable version and trigger download
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice - ${orderId}</title>
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
            <img src="/logo.png" alt="Diksha Mahajan" style="max-width: 500px; height: auto; margin: 0 auto; display: block;" />
          </div>
          <div class="content">
            <div class="title">
              <h2>ORDER INVOICE</h2>
              <p>Thank you for your order!</p>
            </div>
            <div class="details-grid">
              <div class="detail-box">
                <h3>Order Details</h3>
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Order Date:</strong> ${orderDate}</p>
                <p><strong>Status:</strong> <span style="color: #22c55e;">Confirmed</span></p>
              </div>
              <div class="detail-box">
                <h3>Shipping Address</h3>
                <p><strong>${customerDetails.name}</strong></p>
                <p>${customerDetails.address}</p>
                <p>${customerDetails.city}, ${customerDetails.state} - ${customerDetails.pincode}</p>
              </div>
            </div>
            <div class="detail-box">
              <h3>Contact Information</h3>
              <p>📧 ${customerDetails.email}</p>
              <p>📱 ${customerDetails.phone}</p>
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
                ${items.map(item => `
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
                  <td style="text-align: right; font-size: 18px;">${total}</td>
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

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* Action Buttons - Hidden when printing */}
      <div className="mb-6 print:hidden flex gap-4 justify-center">
        <button
          onClick={handlePrint}
          className="bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Invoice
        </button>
        <button
          onClick={handleDownload}
          className="border-2 border-black text-black px-8 py-3 hover:bg-gray-100 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Invoice
        </button>
      </div>

      {/* Invoice Content */}
      <div className="border-2 border-black p-8 md:p-12">
        {/* Header */}
        <div className="bg-black text-white p-8 flex justify-center items-center mb-8">
          <Image
            src="/logo.png"
            alt="Diksha Mahajan"
            width={600}
            height={150}
            className="max-w-full h-auto"
            priority
          />
        </div>

        {/* Invoice Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-light tracking-wider mb-2">ORDER INVOICE</h2>
          <p className="text-gray-600">Thank you for your order!</p>
        </div>

        {/* Order & Shipping Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-6 border-l-4 border-black">
            <h3 className="text-sm font-medium text-gray-600 uppercase mb-3">
              Order Details
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Order ID:</span> {orderId}
              </p>
              <p>
                <span className="font-medium">Order Date:</span> {orderDate}
              </p>
              <p>
                <span className="font-medium">Status:</span>{' '}
                <span className="text-green-600 font-medium">Confirmed</span>
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 border-l-4 border-black">
            <h3 className="text-sm font-medium text-gray-600 uppercase mb-3">
              Shipping Address
            </h3>
            <div className="space-y-1 text-sm">
              <p className="font-medium">{customerDetails.name}</p>
              <p>{customerDetails.address}</p>
              <p>
                {customerDetails.city}, {customerDetails.state} - {customerDetails.pincode}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 p-6 mb-8">
          <h3 className="text-sm font-medium text-gray-600 uppercase mb-3">
            Contact Information
          </h3>
          <div className="space-y-1 text-sm">
            <p>📧 {customerDetails.email}</p>
            <p>📱 {customerDetails.phone}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Order Items</h3>
          <div className="border border-gray-200">
            {/* Table Header */}
            <div className="bg-black text-white grid grid-cols-12 gap-4 p-4 font-medium text-sm">
              <div className="col-span-6">Item</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-4 text-right">Price</div>
            </div>

            {/* Table Body */}
            {items.map((item, index) => (
              <div
                key={`${item.id}-${item.size}-${index}`}
                className="border-b border-gray-200 last:border-b-0"
              >
                <div className="grid grid-cols-12 gap-4 p-4 items-start">
                  <div className="col-span-6">
                    <div className="flex gap-3">
                      <div className="relative w-16 h-20 flex-shrink-0 print:hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600 mt-1">{item.tagline}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          <span className="font-medium">Size:</span> {item.size}
                        </p>
                        {item.size === 'Custom' && item.customMeasurements && (
                          <div className="mt-2 p-2 bg-gray-50 text-xs">
                            <p className="font-medium mb-1">Custom Measurements:</p>
                            <div className="space-y-0.5">
                              {Object.entries(item.customMeasurements).map(([key, value]) => (
                                <p key={key}>
                                  {key}: {value}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 text-center text-sm">{item.quantity}</div>
                  <div className="col-span-4 text-right text-sm">{item.price}</div>
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="bg-gray-50 grid grid-cols-12 gap-4 p-4 font-medium">
              <div className="col-span-8 text-right">TOTAL:</div>
              <div className="col-span-4 text-right text-lg">{total}</div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-amber-50 p-6 mb-8 rounded">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <span>📦</span> What's Next?
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Your order will be processed within 2-3 business days</li>
            <li>• We'll send you shipping updates via email and WhatsApp</li>
            <li>
              • Estimated delivery: 15-20 business days (India) / 25-30 business days
              (International)
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="text-center border-t-2 pt-6">
          <p className="text-gray-600 mb-3">For any queries, contact us at:</p>
          <div className="space-y-1 text-sm">
            <p>
              📧{' '}
              <a href="mailto:info@dikshamahajan.com" className="font-medium">
                info@dikshamahajan.com
              </a>
            </p>
            <p>
              📱{' '}
              <a href="tel:+919871907315" className="font-medium">
                +91-9871907315
              </a>
            </p>
            <p>
              💬{' '}
              <a
                href="https://wa.me/919871907315"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium"
              >
                WhatsApp
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-black text-white p-6 text-center mt-8 text-xs">
          <p>© {new Date().getFullYear()} Diksha Mahajan. All rights reserved.</p>
          <p className="mt-1">Luxury Bridal & Trousseau Couture</p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
}
