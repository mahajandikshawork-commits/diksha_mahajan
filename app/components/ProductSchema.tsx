'use client';

interface ProductSchemaProps {
  product: {
    name: string;
    slug: string;
    description: string;
    price: string;
    mainImage: string;
    status: string;
    tagline: string;
  };
}

export default function ProductSchema({ product }: ProductSchemaProps) {
  const priceValue = product.price.replace(/[^0-9]/g, '');
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.tagline,
    image: `https://dikshamahajan.com${product.mainImage}`,
    brand: {
      '@type': 'Brand',
      name: 'Diksha Mahajan',
    },
    offers: {
      '@type': 'Offer',
      url: `https://dikshamahajan.com/product/${product.slug}`,
      priceCurrency: 'INR',
      price: priceValue,
      availability: product.status === 'available' 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Diksha Mahajan',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '50',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
