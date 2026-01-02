'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import CustomMeasurementForm from '../../components/CustomMeasurementForm';
import SizeChartModal from '../../components/SizeChartModal';
import ProductSlider from '../../components/ProductSlider';
import { BsWhatsapp, BsHeart } from 'react-icons/bs';
import productsData from '@/data/products.json';

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const product = productsData.find((p, index) => index.toString() === productId) || productsData[0];
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // Build media array combining images and video if available
  const productMedia: Array<{type: 'image' | 'video', src: string}> = [];
  
  // Add images
  if ((product as any).images && Array.isArray((product as any).images)) {
    (product as any).images.forEach((img: string) => {
      productMedia.push({ type: 'image', src: img });
    });
  }
  
  // Add video if available and mediaType is video
  if (product.mediaType === 'video' && product.mediaSrc) {
    productMedia.push({ type: 'video', src: product.mediaSrc });
  }
  
  // Fallback to mediaSrc if no media available
  if (productMedia.length === 0) {
    productMedia.push({ type: product.mediaType as 'image' | 'video', src: product.mediaSrc });
  }

  const sizes = ['S', 'M', 'L', 'XL', 'XXL', 'Custom'];

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setShowCustomForm(size === 'Custom');
  };

  const toggleDropdown = (section: string) => {
    setOpenDropdown(openDropdown === section ? null : section);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-white">      
      <main className="pt-24 md:pt-32 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Image Gallery */}
            <div className="flex flex-col-reverse md:flex-row gap-4 overflow-hidden md:sticky md:top-32 md:self-start">
              {/* Vertical Thumbnail Strip */}
              <div className="flex md:flex-col gap-2 overflow-y-auto max-h-[85vh] flex-shrink-0">
                {productMedia.map((media, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-24 border-2 ${
                      selectedImage === index ? 'border-black' : 'border-gray-200'
                    } overflow-hidden relative`}
                  >
                    {media.type === 'video' ? (
                      <>
                        <video
                          src={media.src}
                          className="w-full h-full object-cover"
                          muted
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                      </>
                    ) : (
                      <Image
                        src={media.src}
                        alt={`${product.name} ${index + 1}`}
                        width={60}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Main Image/Video Display */}
              <div className="flex-1 relative max-h-[85vh]">
                {productMedia[selectedImage]?.type === 'video' ? (
                  <video
                    src={productMedia[selectedImage].src}
                    controls
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-cover max-h-[85vh]"
                  />
                ) : (
                  <div className="relative w-full h-full max-h-[85vh] aspect-[3/4]">
                    <Image
                      src={productMedia[selectedImage]?.src || product.mediaSrc}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Product Info */}
            <div className="space-y-6">
              {/* Brand & Product Name */}
              <div>
                <p className="text-sm tracking-[0.3em] uppercase text-gray-600 mb-2">
                  DIKSHAMAHAJAN
                </p>
                <h1 className="text-3xl md:text-4xl font-light tracking-wider uppercase">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-600 mt-2">MMAW25W-955</p>
              </div>

              {/* Price */}
              <div>
                <p className="text-2xl font-light">{product.price}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Inclusive of all taxes. Shipping calculated at checkout.
                </p>
              </div>

              {/* Size Selection */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm uppercase tracking-wider">SIZE</label>
                  <button
                    onClick={() => setShowSizeChart(true)}
                    className="text-sm underline hover:no-underline flex items-center gap-1"
                  >
                    <span>✏️</span> Size Chart
                  </button>
                </div>

                <div className="flex flex-wrap gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(size)}
                      className={`px-6 py-2 border ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-black'
                      } transition-colors`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Measurement Form */}
              {showCustomForm && <CustomMeasurementForm />}

              {/* Action Buttons */}
              <div className="space-y-3 pt-6">
                <button className="w-full bg-white border border-black text-black py-3 uppercase tracking-wider hover:bg-gray-50 transition-colors">
                  ADD TO CART
                </button>
                
                <button className="w-full bg-black text-white py-3 uppercase tracking-wider hover:bg-gray-800 transition-colors">
                  BUY IT NOW
                </button>

                <button className="w-full bg-[#25D366] text-white py-3 uppercase tracking-wider hover:bg-[#20BA5A] transition-colors flex items-center justify-center gap-2">
                  <BsWhatsapp size={20} />
                  ORDER ON WHATSAPP
                </button>
              </div>

              {/* Product Details */}
              <div className="pt-6 border-t space-y-3 text-sm">
                <p className="font-medium uppercase tracking-wider">
                  {product.description}
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><span className="font-medium">Color:</span> AMBER YELLOW FANAH PRINT</p>
                  <p><span className="font-medium">Fabric:</span> SILK ORGANZA</p>
                  <p><span className="font-medium">NO OF COMPONENTS:</span> 3</p>
                  <p><span className="font-medium">DELIVERY TIME:</span> 4-5WEEKS</p>
                  <p><span className="font-medium">Wash Care:</span> Dry Clean</p>
                </div>
              </div>

              {/* Collapsible Sections */}
              <div className="pt-6 space-y-3">
                {/* Manufactured and Packed By */}
                <div className="border-t">
                  <button
                    onClick={() => toggleDropdown('manufactured')}
                    className="w-full flex justify-between items-center py-4 text-sm uppercase tracking-wider hover:opacity-70 transition-opacity"
                  >
                    <span>MANUFACTURED AND PACKED BY</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${openDropdown === 'manufactured' ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openDropdown === 'manufactured' && (
                    <div className="pb-4 text-sm text-gray-700 space-y-1">
                      <p>Address: RUKAAN INTERNATIONAL PRIVATE LIMITED, Basement, Plot No- K 257, Maidan Garhi</p>
                      <p>Road, New Delhi- 110074 South Delhi, Delhi, India</p>
                      <p className="pt-2">Country Of Origin: India</p>
                      <p className="pt-2">Email: Orders@mahimamahajan.in</p>
                      <p>Tel: +91- 9811004752</p>
                    </div>
                  )}
                </div>

                {/* Country of Origin */}
                <div className="border-t">
                  <button
                    onClick={() => toggleDropdown('country')}
                    className="w-full flex justify-between items-center py-4 text-sm uppercase tracking-wider hover:opacity-70 transition-opacity"
                  >
                    <span>COUNTRY OF ORIGIN</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${openDropdown === 'country' ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openDropdown === 'country' && (
                    <div className="pb-4 text-sm text-gray-700">
                      <p>India</p>
                    </div>
                  )}
                </div>

                {/* Customer Care */}
                <div className="border-t">
                  <button
                    onClick={() => toggleDropdown('customer')}
                    className="w-full flex justify-between items-center py-4 text-sm uppercase tracking-wider hover:opacity-70 transition-opacity"
                  >
                    <span>CUSTOMER CARE</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${openDropdown === 'customer' ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openDropdown === 'customer' && (
                    <div className="pb-4 text-sm text-gray-700">
                      <p>Email: Orders@mahimamahajan.in</p>
                      <p>Tel: +91- 9811004752</p>
                    </div>
                  )}
                </div>

                {/* Shipping Information */}
                <div className="border-t">
                  <button
                    onClick={() => toggleDropdown('shipping')}
                    className="w-full flex justify-between items-center py-4 text-sm uppercase tracking-wider hover:opacity-70 transition-opacity"
                  >
                    <span>SHIPPING INFORMATION</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${openDropdown === 'shipping' ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openDropdown === 'shipping' && (
                    <div className="pb-4 text-sm text-gray-700 space-y-2">
                      <p>Prices are inclusive of all taxes, Packaging and handling.</p>
                      <p className="font-medium">Shipping in India:</p>
                      <p>Free of charge</p>
                      <p className="font-medium pt-2">International Shipping:</p>
                      <p>For international purchases, duties and taxes may be applicable based on the import laws of your country.</p>
                    </div>
                  )}
                </div>

                {/* Ask a Question */}
                <div className="border-t">
                  <button
                    onClick={() => toggleDropdown('question')}
                    className="w-full flex justify-between items-center py-4 text-sm uppercase tracking-wider hover:opacity-70 transition-opacity"
                  >
                    <span>ASK A QUESTION</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${openDropdown === 'question' ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openDropdown === 'question' && (
                    <div className="pb-4">
                      <p className="text-sm text-gray-600 mb-4">Leave your message and we'll get back to you shortly.</p>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs uppercase tracking-wide block mb-2">NAME *</label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleFormChange}
                              placeholder="Ex: John"
                              required
                              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
                            />
                          </div>
                          <div>
                            <label className="text-xs uppercase tracking-wide block mb-2">EMAIL *</label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleFormChange}
                              placeholder="Ex: John@gmail.com"
                              required
                              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs uppercase tracking-wide block mb-2">MESSAGE *</label>
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleFormChange}
                            placeholder="Ex: I want to know more about the product"
                            required
                            rows={4}
                            className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black resize-none"
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-2 uppercase tracking-wider text-sm transition-colors"
                        >
                          Submit
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <ProductSlider />      
      {/* Size Chart Modal */}
      <SizeChartModal
        isOpen={showSizeChart}
        onClose={() => setShowSizeChart(false)}
        productName={product.name}
      />
    </div>
  );
}
