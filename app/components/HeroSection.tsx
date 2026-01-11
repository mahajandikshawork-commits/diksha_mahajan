import HeroSectionDesktop from './HeroSectionDesktop';
import HeroSectionMobile from './HeroSectionMobile';

export default function HeroSection() {
  return (
    <>
      <div className="hidden lg:block">
        <HeroSectionDesktop />
      </div>
      <div className="lg:hidden">
        <HeroSectionMobile />
      </div>
    </>
  );
}
