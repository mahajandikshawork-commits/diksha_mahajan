'use client';

import ProductCard from './ProductCard';
import ShopCollectionButton from './ShopCollectionButton';
import productsData from '@/data/products.json';

export default function ProductSlider() {
  return (
    <>
      {/* Desktop View */}
      <section className="hidden md:block py-32 px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-6" style={{ width: 'max-content' }}>
              {productsData.map((product, index) => (
                <div key={index} className="w-80 flex-shrink-0">
                  <ProductCard
                    name={product.name}
                    price={product.price}
                    mediaType={product.mediaType as 'image' | 'video'}
                    mediaSrc={product.mediaSrc}
                    mainImage={product.mainImage}
                    productId={index}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <ShopCollectionButton />
      </section>

      {/* Mobile View */}
      <section className="md:hidden pt-8 md:py-16 bg-gray-50">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 px-4" style={{ width: 'max-content' }}>
            {productsData.map((product, index) => (
              <div key={index} className="w-[45vw] flex-shrink-0">
                <ProductCard
                  name={product.name}
                  price={product.price}
                  mediaType={product.mediaType as 'image' | 'video'}
                  mediaSrc={product.mediaSrc}
                  mainImage={product.mainImage}
                  productId={index}
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
