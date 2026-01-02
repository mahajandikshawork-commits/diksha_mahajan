import SpotlightCard from './SpotlightCard';
import spotlightData from '@/data/spotlight.json';

export default function SpotlightSection() {
  return (
    <section className="py-16 md:py-32 md:pt-24 bg-[#F5F1E8]">
      <div className="w-full mx-auto px-8">
        <h2 className="text-2xl md:text-4xl font-light tracking-[0.2em] text-center mb-4 uppercase">
          In The Spotlight
        </h2>
        
        <p className="text-center text-gray-600 mb-12 text-lg">
          where timelessness meets the women rewriting tradition
        </p>

        {/* Mobile & Tablet: Horizontal Scroll */}
        <div className="lg:hidden overflow-x-auto scrollbar-hide -mx-8 px-8">
          <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
            {spotlightData.map((category, index) => (
              <div key={index} className="w-64 md:w-80 flex-shrink-0">
                <SpotlightCard
                  title={category.title}
                  images={category.images}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Grid Layout - 4 columns first row, 3 columns second row */}
        <div className="hidden lg:block">
          {/* First Row - 4 items */}
          <div className="grid grid-cols-3 gap-6 mb-6 max-w-6xl mx-auto">
            {spotlightData.map((category, index) => (
              <SpotlightCard
                key={index}
                title={category.title}
                images={category.images}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
