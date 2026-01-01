import SpotlightCard from './SpotlightCard';
import spotlightData from '@/data/spotlight.json';

export default function SpotlightSection() {
  return (
    <section className="py-16 md:py-48 px-8 bg-[#F5F1E8]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-light tracking-[0.2em] text-center mb-4 uppercase">
          In The Spotlight
        </h2>
        
        <p className="text-center text-gray-600 mb-12 text-lg">
          where timelessness meets the women rewriting tradition
        </p>

        {/* Desktop: 4 columns, Mobile: 2x2 grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {spotlightData.map((category, index) => (
            <SpotlightCard
              key={index}
              title={category.title}
              images={category.images}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
