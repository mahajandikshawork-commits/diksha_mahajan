import Image from 'next/image';
import Link from 'next/link';
import Button from './Button';

export default function AboutSection() {
  return (
    <section className="relative w-full min-h-screen bg-white py-16 md:py-0">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 md:py-16 w-full">
            <h2 className="text-2xl md:text-4xl font-light tracking-wider leading-tight">
              FROM THE<br />
              HOUSE OF<br />
              DIKSHA MAHAJAN
            </h2>
            
            <p className="text-gray-600 leading-relaxed max-w-2xl w-full">
              I'm a paragraph. Click here to add your own text and edit me. It's easy. Just click 
              "Edit Text" or double click me to add your own content and make changes to the font. 
              I'm a great place for you to tell a story and let your users know a little more about you.
            </p>

            <div className="flex w-full justify-center">
              <Button text="EXPLORE" href="/about" />
            </div>
          </div>

          {/* Image */}
          <div className="relative h-[600px] md:h-screen w-full">
            <Image
              src="/image.png"
              alt="Diksha Mahajan Collection"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
