import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProductSlider from './components/ProductSlider';
import AboutSection from './components/AboutSection';
import SpotlightSection from './components/SpotlightSection';
import AppointmentSection from './components/AppointmentSection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <ProductSlider />
      <AboutSection />
      <SpotlightSection />
      <AppointmentSection />
      <Footer />
    </div>
  );
}
