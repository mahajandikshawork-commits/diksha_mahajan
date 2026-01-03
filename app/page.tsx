import HeroSection from './components/HeroSection';
import ProductSlider from './components/ProductSlider';
import AboutSection from './components/AboutSection';
import SpotlightSection from './components/SpotlightSection';
import AppointmentSection from './components/AppointmentSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <div className="md:pt-24 pt-8"><ProductSlider /></div>
      <AboutSection />
      <SpotlightSection />
      <AppointmentSection />
    </div>
  );
}
