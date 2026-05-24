export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="pt-40 pb-16 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl md:text-3xl font-medium tracking-[0.2em] text-center md:mb-16 mb-8 uppercase">
            Shipping Policy
          </h1>
          
          <div className="space-y-8 text-gray-700 leading-relaxed">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Shipping Timelines</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Domestic Orders (India):</strong> Typically delivered within 15–20 business days after the order is placed.</li>
                <li><strong>International Orders:</strong> Typically delivered within 25–30 business days after the order is placed, subject to customs and local courier regulations (if there is a priority shipment, do let us know in advance)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Shipping Charges</h2>
              <p>
                We offer free shipping across India on all our orders.
              </p>
              <p className="mt-2">
                International orders are subject to custom duties, taxes, or import charges, which are to be borne by the client.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Order Tracking</h2>
              <p>
                Once your order is dispatched, tracking details will be shared via email or WhatsApp to help you monitor your shipment.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Delivery & Responsibility</h2>
              <p>
                Please ensure that the shipping address and contact details provided are accurate.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Damaged Packages</h2>
              <p>
                If you receive a visibly damaged package, please notify us within <strong>48 hours</strong> of delivery along with clear photographs of the package and product so that we can assist you accordingly.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
