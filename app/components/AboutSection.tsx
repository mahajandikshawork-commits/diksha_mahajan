import Image from 'next/image';
import Link from 'next/link';
import Button from './Button';

export default function AboutSection() {
  return (
    <section className="relative w-full bg-white py-0">
      <div className="max-w-7xl mx-auto px-0 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <Link href='https://www.vogue.in/shopping/promotion/step-into-the-diwali-festivities-with-these-showstopping-ensembles'><div className="relative h-[400px] md:h-[600px] w-full">
            <Image
              src="/vogue.jpg"
              alt="Diksha Mahajan Collection"
              fill
              className="object-cover"
              priority
            />
          </div>
          </Link>
          {/* Text Content */}
          <div className="space-y-6 p-8 md:py-16 w-full">
            <h2 className="text-2xl md:text-4xl font-light tracking-wider leading-tight">
              VOGUE DIWALI <br/>EDIT 2025
            </h2>
            
            <p className="text-gray-600 leading-relaxed max-w-md w-full">
              Diksha Mahajan positions bridalwear as more than clothing, framing each piece as a keepsake. The label's collections, including Aaina, range from fluid sarees and skirts to statement lehengas, cocktail gowns, and modern silhouettes suited for trousseau, festive events, and destination weddings.
              Each creation is ... <Link href="https://www.vogue.in/shopping/promotion/step-into-the-diwali-festivities-with-these-showstopping-ensembles" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">Read More</Link>
            </p>
          </div>

          
        </div>
      </div>
    </section>
  );
}
