import HeroSectionDesktop from './HeroSectionDesktop';
import HeroSectionMobile from './HeroSectionMobile';

export default function HeroSection() {
  return (
    <>
      <div className="hidden md:block">
        <HeroSectionDesktop />
      </div>
      <div className="md:hidden">
        <HeroSectionMobile />
      </div>
    </>
  );
}
