import aboutData from '@/data/about.json';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="pt-40 pb-16 px-8">
        <div className="md:max-w-5xl mx-auto">
          <h1 className="text-base md:text-2xl italic font-medium tracking-[0.2em] text-center md:mb-16 md:mt-8 mb-8 uppercase">
            '{aboutData.title}'
          </h1>
          
          <div className="space-y-8 text-gray-700 leading-relaxed text-sm md:text-base">
            {aboutData.paragraphs.map((paragraph, index) => (
              <p key={index}>
                {paragraph}
              </p>
            ))}
          </div>
          <h1 className="text-sm md:text-base italic font-medium tracking-[0.2em] text-center md:mb-16 mt-8 mb-8 uppercase">
            - Diksha Mahajan
          </h1>
        </div>
      </main>
    </div>
  );
}
