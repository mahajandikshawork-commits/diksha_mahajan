'use client';

import ProductCard from './ProductCard';
import ShopCollectionButton from './ShopCollectionButton';
import productsData from '@/data/products.json';

export default function ProductSlider() {
  return (
    <>
      {/* Desktop View */}
      <section className="hidden md:block pt-24 pb-16 px-8 bg-gray-50">
        <div className="w-full mx-auto">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-6" style={{ width: 'max-content' }}>
              {productsData.map((product, index) => (
                <div key={index} className="w-80 flex-shrink-0">
                  <ProductCard
                    name={product.name}
                    price={product.price}
                    tagline={(product as any).tagline}
                    mediaType={product.mediaType as 'image' | 'video'}
                    mediaSrc={product.mediaSrc}
                    mainImage={product.mainImage}
                    slug={product.slug}
                    showVideo={true}
                    autoplay={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <ShopCollectionButton />
      </section>

      {/* Mobile View */}
      <section className="md:hidden pt-8 md:py-8 bg-gray-50">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 px-4" style={{ width: 'max-content' }}>
            {productsData.map((product, index) => (
              <div key={index} className="w-[45vw] flex-shrink-0">
                <ProductCard
                  name={product.name}
                  price={product.price}
                  tagline={(product as any).tagline}
                  mediaType={product.mediaType as 'image' | 'video'}
                  mediaSrc={product.mediaSrc}
                  mainImage={product.mainImage}
                  slug={product.slug}
                  showVideo={true}
                  autoplay={true}
                />
              </div>
            ))}
          </div>
        </div>
        <ShopCollectionButton />
      </section>
    </>
  );
}
