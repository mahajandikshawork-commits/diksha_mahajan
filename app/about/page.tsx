import Header from '../components/Header';
import Footer from '../components/Footer';
import aboutData from '@/data/about.json';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-32 pb-16 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-light tracking-[0.2em] text-center mb-16 uppercase">
            {aboutData.title}
          </h1>
          
          <div className="space-y-8 text-gray-700 leading-relaxed">
            {aboutData.paragraphs.map((paragraph, index) => (
              <p key={index}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
