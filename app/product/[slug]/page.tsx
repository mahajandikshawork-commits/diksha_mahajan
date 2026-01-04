'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import CustomMeasurementForm from '../../components/CustomMeasurementForm';
import SizeChartModal from '../../components/SizeChartModal';
import ProductSlider from '../../components/ProductSlider';
import { BsWhatsapp, BsHeart } from 'react-icons/bs';
import productsData from '@/data/products.json';
import { useCart } from '../../context/CartContext';

export default function ProductPage() {
  const params = useParams();
  const productSlug = params.slug as string;
  const { addToCart } = useCart();

  const product = productsData.find((p) => p.slug === productSlug) || productsData[0];
  const productIndex = productsData.findIndex((p) => p.slug === productSlug);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // Build media array combining images and video if available
  const productMedia: Array<{ type: 'image' | 'video', src: string }> = [];

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

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    const priceNumber = parseInt(product.price.replace(/[^0-9]/g, ''));

    addToCart({
      id: productIndex >= 0 ? productIndex : 0,
      name: product.name,
      description: (product as any).description || '',
      price: product.price,
      priceNumber,
      image: product.mainImage,
      size: selectedSize,
    });
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
                    className={`flex-shrink-0 w-20 h-24 border-2 ${selectedImage === index ? 'border-black' : 'border-gray-200'
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
            <div className="space-y-4">
              {/* Brand & Product Name */}
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-gray-600 mb-2">
                  {product.collection}
                </p>
                <h1 className="text-xl md:text-4xl font-medium tracking-wider uppercase">
                  {product.name}
                </h1>
                {/* <p className="text-sm text-gray-600 mt-2">DMAW25W-955</p> */}
              </div>

              {/* Price */}
              <div>
                <p className="text-lg font-light">{product.price}</p>
                <p className="text-xs text-gray-600 mt-1">
                  Inclusive of all taxes. Shipping calculated at checkout.
                </p>
              </div>

              {/* Size Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
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
                      className={`md:px-6 px-4 md:py-2 py-1 text-xs md:text-sm border ${selectedSize === size
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
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-white border text-xs md:text-sm border-black text-black py-2 uppercase tracking-wider hover:bg-gray-50 transition-colors"
                >
                  ADD TO CART
                </button>

                <button className="w-full bg-black text-xs md:text-sm text-white py-2 uppercase tracking-wider hover:bg-gray-800 transition-colors">
                  BUY IT NOW
                </button>

                <a 
                  href={`https://wa.me/919871907315?text=${encodeURIComponent(`Hello Team, I would like to enquire more about this product - ${product.name} from ${product.collection.toUpperCase()} collection`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] text-xs md:text-sm text-white py-2 uppercase tracking-wider hover:bg-[#20BA5A] transition-colors flex items-center justify-center gap-2"
                >
                  <BsWhatsapp size={20} />
                  ORDER ON WHATSAPP
                </a>
              </div>

              {/* Product Description */}
              <div className="pt-6 border-t space-y-3 text-sm">
                <p className="font-light tracking-wide text-gray-700">
                  {product.description}
                </p>
                {(product as any).occasion && (
                  <div className="pt-2">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-800 mb-1">Occasions</p>
                    <p className="font-light text-gray-700">{(product as any).occasion}</p>
                  </div>
                )}
              </div>

              {/* Collapsible Sections */}
              <div className="pt-6 space-y-0">
                {/* Product Details */}
                <div className="border-t">
                  <button
                    onClick={() => toggleDropdown('details')}
                    className="w-full flex justify-between items-center py-4 text-sm uppercase tracking-wider hover:opacity-70 transition-opacity"
                  >
                    <span>PRODUCT DETAILS</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${openDropdown === 'details' ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openDropdown === 'details' && (
                    <div className="pb-4 space-y-2 text-sm text-gray-700">
                      {(product as any).materials && (
                        <p><span className="font-medium">Materials:</span> {(product as any).materials}</p>
                      )}
                      {(product as any).color && (
                        <p><span className="font-medium">Color:</span> {(product as any).color}</p>
                      )}
                      {(product as any).components && (
                        <p><span className="font-medium">No. of Components:</span> {(product as any).components}</p>
                      )}
                      {(product as any).modelSize && (product as any).modelHeight && (
                        <p><span className="font-medium">Model:</span> Wearing Size {(product as any).modelSize}, Height {(product as any).modelHeight}</p>
                      )}
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

                {/* Care & Guide */}
                <div className="border-t">
                  <button
                    onClick={() => toggleDropdown('care')}
                    className="w-full flex justify-between items-center py-4 text-sm uppercase tracking-wider hover:opacity-70 transition-opacity"
                  >
                    <span>CARE & GUIDE</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${openDropdown === 'care' ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openDropdown === 'care' && (
                    <div className="pb-4 text-sm text-gray-700">
                      <p>Dry-clean only</p>
                    </div>
                  )}
                </div>

                {/* Shipping */}
                <div className="border-t">
                  <button
                    onClick={() => toggleDropdown('shipping')}
                    className="w-full flex justify-between items-center py-4 text-sm uppercase tracking-wider hover:opacity-70 transition-opacity"
                  >
                    <span>SHIPPING</span>
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
                      <p>Free Shipping in India.</p>
                      <p>For international purchases, shipping and taxes would be applicable based on the import laws of your country.</p>
                    </div>
                  )}
                </div>

                {/* Delivery & Returns */}
                <div className="border-t">
                  <button
                    onClick={() => toggleDropdown('delivery')}
                    className="w-full flex justify-between items-center py-4 text-sm uppercase tracking-wider hover:opacity-70 transition-opacity"
                  >
                    <span>DELIVERY & RETURNS</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${openDropdown === 'delivery' ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openDropdown === 'delivery' && (
                    <div className="pb-4 text-sm text-gray-700 space-y-2">
                      <p>Once an order is placed, it will be shipped within <span className='font-bold'>15-20 business days.</span></p>
                      <p>This item is not eligible for <a href='/returns-exchange' className='border-b border-gray-400 text-blue-400 hover:text-blue-600'>return or exchange.</a><br/> For any queries you can reach out to us at <span className='font-bold'>info@dikshamahajan.com</span> or <span className='font-bold'>+91-9871907315</span></p>
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
