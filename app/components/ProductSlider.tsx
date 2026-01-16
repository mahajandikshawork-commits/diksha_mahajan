'use client';

import { useRef, useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ShopCollectionButton from './ShopCollectionButton';
import productsData from '@/data/products.json';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const INITIAL_LOAD_COUNT = 3;

export default function ProductSlider() {
  const desktopScrollRef = useRef<HTMLDivElement | null>(null);
  const mobileScrollRef = useRef<HTMLDivElement | null>(null);
  const [visibleIndexes, setVisibleIndexes] = useState<Set<number>>(
    new Set(Array.from({ length: INITIAL_LOAD_COUNT }, (_, i) => i))
  );
  const observersRef = useRef<Map<number, IntersectionObserver>>(new Map());

  const createObserver = (index: number) => {
    if (index < INITIAL_LOAD_COUNT) return null;
    
    return new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleIndexes(prev => {
            const newSet = new Set(prev);
            newSet.add(index);
            return newSet;
          });
          observersRef.current.get(index)?.disconnect();
          observersRef.current.delete(index);
        }
      },
      {
        rootMargin: '200px',
        threshold: 0.01
      }
    );
  };

  const setObserverRef = (index: number) => (element: HTMLDivElement | null) => {
    if (element && index >= INITIAL_LOAD_COUNT && !observersRef.current.has(index)) {
      const observer = createObserver(index);
      if (observer) {
        observer.observe(element);
        observersRef.current.set(index, observer);
      }
    }
  };

  useEffect(() => {
    return () => {
      observersRef.current.forEach(observer => observer.disconnect());
      observersRef.current.clear();
    };
  }, []);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    const el = ref.current;
    if (!el) return;
    const amount = Math.max(280, Math.floor(el.clientWidth * 0.8));
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <>
      {/* Desktop View */}
      <section className="hidden md:block pt-24 pb-16 px-8 bg-gray-50">
        <div className="w-full mx-auto">
          <div className="relative">
            <div ref={desktopScrollRef} className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-6" style={{ width: 'max-content' }}>
              {productsData.map((product, index) => {
                const shouldShowVideo = visibleIndexes.has(index);
                return (
                  <div 
                    key={index} 
                    className="w-80 flex-shrink-0"
                    ref={setObserverRef(index)}
                  >
                    <ProductCard
                      name={product.name}
                      price={product.price}
                      tagline={(product as any).tagline}
                      mediaType={product.mediaType as 'image' | 'video'}
                      mediaSrc={product.mediaSrc}
                      mainImage={product.mainImage}
                      slug={product.slug}
                      showVideo={shouldShowVideo}
                      autoplay={shouldShowVideo}
                    />
                  </div>
                );
              })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => scroll(desktopScrollRef, 'left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white border border-black/10 rounded-full w-10 h-10 flex items-center justify-center"
              aria-label="Scroll left"
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => scroll(desktopScrollRef, 'right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white border border-black/10 rounded-full w-10 h-10 flex items-center justify-center"
              aria-label="Scroll right"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>
        <ShopCollectionButton />
      </section>

      {/* Mobile View */}
      <section className="md:hidden pt-8 md:py-8 bg-white">
        <div className="relative">
          <div ref={mobileScrollRef} className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 px-4" style={{ width: 'max-content' }}>
            {productsData.map((product, index) => {
              const shouldShowVideo = visibleIndexes.has(index);
              return (
                <div 
                  key={index} 
                  className="w-[45vw] flex-shrink-0"
                  ref={setObserverRef(index)}
                >
                  <ProductCard
                    name={product.name}
                    price={product.price}
                    tagline={(product as any).tagline}
                    mediaType={product.mediaType as 'image' | 'video'}
                    mediaSrc={product.mediaSrc}
                    mainImage={product.mainImage}
                    slug={product.slug}
                    showVideo={shouldShowVideo}
                    autoplay={shouldShowVideo}
                  />
                </div>
              );
            })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => scroll(mobileScrollRef, 'left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white border border-black/10 rounded-full w-9 h-9 flex items-center justify-center"
            aria-label="Scroll left"
          >
            <FiChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scroll(mobileScrollRef, 'right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white border border-black/10 rounded-full w-9 h-9 flex items-center justify-center"
            aria-label="Scroll right"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
        <ShopCollectionButton />
      </section>
    </>
  );
}
