import Image from 'next/image';
import Button from './Button';

export default function AppointmentSection() {
  return (
    <section className="relative w-full py-32 md:py-48">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/contact.webp"
          alt="Design Space"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 text-white text-center">
        

        <h3 className="text-xl md:text-4xl font-bold tracking-[0.2em] mb-12 uppercase">
          Your Heirloom Begins Here
        </h3>


        <h2 className="text-sm md:text-2xl font-light tracking-[0.3em] mb-8 uppercase max-w-4xl leading-relaxed">
          Click Here To Schedule A Virtual Appointment
        </h2>
        <Button text="BOOK YOUR APPOINTMENT" href={`https://wa.me/919871907315?text=${encodeURIComponent('Hello Team, I would like to book a virtual appointment for a personalised consultation')}`} variant="inverted" />
      </div>
    </section>
  );
}
