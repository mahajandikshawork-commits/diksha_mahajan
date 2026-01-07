export default function ReturnsExchangePage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="pt-32 pb-16 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl md:text-3xl font-medium tracking-[0.2em] text-center md:mb-16 mb-8 uppercase">
            Return & Exchange Policy
          </h1>
          
          <div className="space-y-8 text-gray-700 leading-relaxed">
            <p>
              At Diksha Mahajan, every piece is thoughtfully crafted and made to order, tailored specifically to the client's individual measurements and design preferences. Due to which we do not offer <span className="font-semibold">no returns, exchanges, or refunds</span> once an order has been confirmed.
            </p>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Order Confirmation</h2>
              <p className="mb-2">We strongly encourage clients to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Review measurements, colour choices, and design details carefully before placing an order</li>
                <li>Reach out to our team for any clarifications prior to order confirmation.</li>
              </ul>
              <p className="mt-2">Once an order is placed and confirmed, it cannot be cancelled, returned, or exchanged.</p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Quality Assurance</h2>
              <p>
                Every garment undergoes a thorough quality check before dispatch. In the rare event that you receive a product with a manufacturing defect or damage during transit, please contact us within 48 hours of delivery with clear images. Our team will assess the issue and assist you accordingly.
              </p>
              <p className="mt-2">
                <strong>Please note:</strong> Minor variations in colour, embroidery, or handwork are inherent to handcrafted couture and are not considered defects.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-3xl font-medium tracking-[0.2em] text-center md:my-16 mb-8 uppercase">Sizing & Alterations Policy</h2>
              <p className="mb-2">
                In case of any sizing concerns, we offer complimentary alterations within 30 days of delivery of the garment, subject to the following conditions:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Alterations are limited to minor size adjustments only</li>
                <li>Design, fabric, colour, or silhouette changes are not permitted</li>
                <li>The garment must be unused, unwashed, and in original condition</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Process</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Please inform us of the sizing issue within 7 days of receiving the order</li>
                <li>The garment must be shipped back to us by the client for alterations</li>
                <li>Shipping costs (to and from) will be borne by the client unless otherwise agreed.</li>
              </ul>
              <p className="mt-2">Once the alteration is completed, the garment will be dispatched back to you.</p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Important Notes</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Alteration support is applicable only once per order</li>
                <li>Requests made after 30 days from delivery will not be accepted</li>
                <li>Alterations are offered as a goodwill service and do not qualify as returns, exchanges, or refunds.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Measurement Accuracy</h2>
              <p>
                To ensure the best fit, we request clients to provide accurate measurements at the time of placing the order. Any major resizing required due to incorrect measurements shared by the client may be subject to additional charges.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-3">Need Assistance?</h2>
              <p className="mb-2">For sizing guidance, customisation queries, or any questions before placing your order, our team is always happy to help.</p>
              <p>📩 Email: <Link href="mailto:info@dikshamahajan.com" className="text-gray-900 font-semibold hover:underline">info@dikshamahajan.com</Link></p>
              <p>📞 WhatsApp: <Link href="https://wa.me/919871907315" className="text-gray-900 font-semibold hover:underline">+91-9871907315</Link></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
