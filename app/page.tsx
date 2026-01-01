import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProductSlider from './components/ProductSlider';
import AboutSection from './components/AboutSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <ProductSlider />
      <AboutSection />
    </div>
  );
}
