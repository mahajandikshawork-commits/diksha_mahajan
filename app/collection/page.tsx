'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '../components/ProductCard';
import productsData from '@/data/products.json';
import { IoFilter, IoClose, IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';

export default function CollectionPage() {
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCollection, setSelectedCollection] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('default');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Dropdown states
  const [isGenderOpen, setIsGenderOpen] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isCollectionOpen, setIsCollectionOpen] = useState(true);
  const [isSortOpen, setIsSortOpen] = useState(true);

  // Subscribe popup state
  const [showSubscribePopup, setShowSubscribePopup] = useState(false);
  const [subscribeName, setSubscribeName] = useState('');
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeName.trim()) {
      setSubscribeMessage('Please enter your name');
      return;
    }
    if (!subscribeEmail.trim() || !/^\S+@\S+\.\S+$/.test(subscribeEmail)) {
      setSubscribeMessage('Please enter a valid email');
      return;
    }
    setSubscribing(true);
    setSubscribeMessage('');
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: subscribeName, email: subscribeEmail }),
      });
      const data = await response.json();
      if (data.success) {
        setSubscribeMessage('Thank you for subscribing!');
        setSubscribeName('');
        setSubscribeEmail('');
        setTimeout(() => {
          setShowSubscribePopup(false);
          setSubscribeMessage('');
        }, 2000);
      } else {
        setSubscribeMessage(data.message || 'Something went wrong.');
      }
    } catch {
      setSubscribeMessage('Failed to subscribe. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  const genderOptions = ['All', 'Menswear', 'Womenswear'];
  const categoryOptions = ['All', 'Concept Saree', 'Gown', 'Trouser set', 'Lehenga set', 'Suit set', 'Jacket set', 'Anarkali set', 'Sharara set', 'Drape Skirt', 'Cape set', 'Shirt', 'Scarf'];
  const collectionOptions = ['All', 'Nazm', 'Aaina', 'Noor-e-Fiza', 'The Heritage Edit'];

  const filteredProducts = productsData.filter((product: any) => {
    const genderMatch = selectedGender === 'All' || product.gender === selectedGender;
    
    // Handle both single category (string) and multiple categories (array)
    const categoryMatch = selectedCategory === 'All' || 
      (Array.isArray(product.productCategory) 
        ? product.productCategory.includes(selectedCategory)
        : product.productCategory === selectedCategory);
    
    const collectionMatch = selectedCollection === 'All' || 
      product.collection.toLowerCase().replace(/[-\s]/g, '') === selectedCollection.toLowerCase().replace(/[-\s]/g, '');
    
    return genderMatch && categoryMatch && collectionMatch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a: any, b: any) => {
    if (sortBy === 'price-low-high') {
      const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
      const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
      return priceA - priceB;
    } else if (sortBy === 'price-high-low') {
      const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
      const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
      return priceB - priceA;
    }
    return 0;
  });

  const clearAllFilters = () => {
    setSelectedGender('All');
    setSelectedCategory('All');
    setSelectedCollection('All');
    setSortBy('default');
  };

  const FilterSection = () => (
    <div className="space-y-4">
      {/* Gender Filter */}
      <div className="border-b pb-4">
        <button
          onClick={() => setIsGenderOpen(!isGenderOpen)}
          className="w-full flex items-center justify-between text-sm font-medium uppercase tracking-wider mb-3 hover:opacity-70 transition-opacity"
        >
          Gender
          {isGenderOpen ? <IoChevronUp size={18} /> : <IoChevronDown size={18} />}
        </button>
        {isGenderOpen && (
          <div className="space-y-2">
            {genderOptions.map((gender) => (
              <button
                key={gender}
                onClick={() => setSelectedGender(gender)}
                className={`block w-full text-left px-3 py-2 text-sm transition-colors ${
                  selectedGender === gender
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Category Filter */}
      <div className="border-b pb-4">
        <button
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          className="w-full flex items-center justify-between text-sm font-medium uppercase tracking-wider mb-3 hover:opacity-70 transition-opacity"
        >
          Product Category
          {isCategoryOpen ? <IoChevronUp size={18} /> : <IoChevronDown size={18} />}
        </button>
        {isCategoryOpen && (
          <div className="space-y-2">
            {categoryOptions.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`block w-full text-left px-3 py-2 text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Collection Filter */}
      <div className="border-b pb-4">
        <button
          onClick={() => setIsCollectionOpen(!isCollectionOpen)}
          className="w-full flex items-center justify-between text-sm font-medium uppercase tracking-wider mb-3 hover:opacity-70 transition-opacity"
        >
          Collection
          {isCollectionOpen ? <IoChevronUp size={18} /> : <IoChevronDown size={18} />}
        </button>
        {isCollectionOpen && (
          <div className="space-y-2">
            {collectionOptions.map((collection) => (
              <button
                key={collection}
                onClick={() => setSelectedCollection(collection)}
                className={`block w-full text-left px-3 py-2 text-sm transition-colors ${
                  selectedCollection === collection
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {collection}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sort By */}
      <div className="pb-4">
        <button
          onClick={() => setIsSortOpen(!isSortOpen)}
          className="w-full flex items-center justify-between text-sm font-medium uppercase tracking-wider mb-3 hover:opacity-70 transition-opacity"
        >
          Sort By
          {isSortOpen ? <IoChevronUp size={18} /> : <IoChevronDown size={18} />}
        </button>
        {isSortOpen && (
          <div className="space-y-2">
            <button
              onClick={() => setSortBy('default')}
              className={`block w-full text-left px-3 py-2 text-sm transition-colors ${
                sortBy === 'default'
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Default
            </button>
            <button
              onClick={() => setSortBy('price-low-high')}
              className={`block w-full text-left px-3 py-2 text-sm transition-colors ${
                sortBy === 'price-low-high'
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Price: Low to High
            </button>
            <button
              onClick={() => setSortBy('price-high-low')}
              className={`block w-full text-left px-3 py-2 text-sm transition-colors ${
                sortBy === 'price-high-low'
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Price: High to Low
            </button>
          </div>
        )}
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearAllFilters}
        className="w-full px-4 py-2 text-sm border border-black text-black hover:bg-black hover:text-white transition-colors uppercase tracking-wider"
      >
        Clear All
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white md:pb-0">
      <main className="pt-40 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <h1 className="text-2xl md:text-4xl font-light tracking-[0.2em] text-center mb-4 md:mb-6 uppercase">
            From the Atelier
          </h1>

          {/* Subheading */}
          <p className="text-base md:text-xl italic font-light text-center text-gray-700 mb-6 md:mb-8 tracking-wide">
            Your heirloom begins here.
          </p>

          {/* Description Paragraph */}
          <p className="text-sm md:text-sm text-gray-600 text-center max-w-8xl mx-auto mb-10 md:mb-16 leading-relaxed">
            Every ensemble from Diksha Mahajan is built on three promises: <strong>craft</strong>, <strong>comfort</strong>, and <strong>character</strong>. From the first consultation to the final drape, we design around your silhouette, your skin tone, and the way you move, so your outfit looks unmistakably yours & not just another catalogue piece.
          </p>
          
          <div className="flex gap-8">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-40">
                <FilterSection />
              </div>
            </aside>

            {/* Products Section */}
            <div className="flex-1">
              {/* Products Count & Sort (Mobile) */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-600">
                  {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
                </p>
              </div>
              
              {/* Products Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {sortedProducts.map((product: any, index: number) => (
                  <ProductCard
                    key={index}
                    name={product.name}
                    price={product.price}
                    tagline={product.tagline}
                    mediaType={product.mediaType as 'image' | 'video'}
                    mediaSrc={product.mediaSrc}
                    mainImage={product.mainImage}
                    slug={product.slug}
                    status={product.status}
                  />
                ))}
              </div>

              {/* No Results Message */}
              {sortedProducts.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 px-6 py-2 bg-black text-white text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filter Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium uppercase tracking-wider hover:bg-gray-50 transition-colors"
          >
            <IoFilter size={20} />
            Filter
          </button>
          <div className="w-px bg-gray-200" />
          <button
            onClick={() => {
              if (sortBy === 'default') setSortBy('price-low-high');
              else if (sortBy === 'price-low-high') setSortBy('price-high-low');
              else setSortBy('default');
            }}
            className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium uppercase tracking-wider hover:bg-gray-50 transition-colors"
          >
            <HiOutlineAdjustmentsHorizontal size={20} />
            Sort
          </button>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setShowMobileFilters(false)}>
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-medium uppercase tracking-wider">Filters</h2>
              <button onClick={() => setShowMobileFilters(false)}>
                <IoClose size={24} />
              </button>
            </div>
            <div className="p-6">
              <FilterSection />
            </div>
            <div className="sticky bottom-0 bg-white border-t p-4">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-black text-white py-3 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="w-full py-12 md:py-12">
        <h3 className="text-xl font-light flex items-center justify-center md:text-4xl font-bold tracking-[0.2em] mb-12 uppercase">
          Begin your couture journey with us
        </h3>
        <div className="flex flex-col items-center justify-center px-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 md:gap-12">
            <button
              onClick={() => setShowSubscribePopup(true)}
              className="relative inline-block px-10 py-3 border-1 border-[#DCC898] text-black font-medium tracking-wider text-xs md:text-base uppercase overflow-hidden group"
            >
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                Subscribe to Receive Updates
              </span>
              <div className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            </button>
          </div>
        </div>
      </section>

      {/* Subscribe Popup */}
      {showSubscribePopup && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4"
          onClick={() => {
            setShowSubscribePopup(false);
            setSubscribeMessage('');
          }}
        >
          <div
            className="bg-[#FAF8F5] rounded-lg shadow-2xl p-8 md:p-10 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowSubscribePopup(false);
                setSubscribeMessage('');
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
              aria-label="Close"
            >
              <IoClose size={24} />
            </button>

            <h3 className="text-lg md:text-xl font-light tracking-[0.15em] uppercase mb-2 text-center text-black">
              Subscribe
            </h3>
            <p className="text-sm text-gray-500 mb-6 text-center tracking-wide">
              Receive updates on new collections, journal stories, and exclusive releases
            </p>

            <form onSubmit={handleSubscribe} className="space-y-4">
              <input
                type="text"
                value={subscribeName}
                onChange={(e) => setSubscribeName(e.target.value)}
                placeholder="Your name"
                className="w-full border border-gray-300 px-4 py-3 text-sm text-black bg-white focus:outline-none focus:border-black transition-colors"
              />
              <input
                type="email"
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border border-gray-300 px-4 py-3 text-sm text-black bg-white focus:outline-none focus:border-black transition-colors"
              />
              <button
                type="submit"
                disabled={subscribing}
                className="relative w-full px-8 py-3 bg-[#DCC898] text-black font-medium tracking-wider text-xs uppercase overflow-hidden group border-1 border-[#DCC898] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  {subscribing ? 'Subscribing...' : 'Subscribe'}
                </span>
                <div className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              </button>
            </form>

            {subscribeMessage && (
              <p className={`text-xs mt-4 text-center ${subscribeMessage.includes('Thank') ? 'text-green-600' : 'text-red-500'}`}>
                {subscribeMessage}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
