import HeroSection from './components/HeroSection';
import ProductSlider from './components/ProductSlider';
import AboutSection from './components/AboutSection';
import SpotlightSection from './components/SpotlightSection';
import AppointmentSection from './components/AppointmentSection';
import { BsWhatsapp } from 'react-icons/bs';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <div className="md:pt-24 pt-8"><ProductSlider /></div>
      <AboutSection />
      <SpotlightSection />
      <AppointmentSection />
      
      {/* Fixed WhatsApp Button */}
      <a
        href="https://wa.me/919871907315"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:bg-[#20BA5A] transition-all hover:scale-110 z-50"
        aria-label="Chat on WhatsApp"
      >
        <BsWhatsapp className="text-white" size={28} />
      </a>
    </div>
  );
}
