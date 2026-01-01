import ProductCard from '../components/ProductCard';
import productsData from '@/data/products.json';

export default function CollectionPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="pt-32 pb-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-light tracking-[0.2em] text-center mb-12 uppercase">
            Our Collection
          </h1>
          
          {/* Desktop: 4 columns, Tablet/iPad: 2 columns */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {productsData.map((product, index) => (
              <ProductCard
                key={index}
                name={product.name}
                price={product.price}
                mediaType={product.mediaType as 'image' | 'video'}
                mediaSrc={product.mediaSrc}
                mainImage={product.mainImage}
                productId={index}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
