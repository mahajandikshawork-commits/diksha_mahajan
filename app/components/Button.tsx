import Link from 'next/link';

interface ButtonProps {
  text: string;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'inverted';
}

export default function Button({ text, href, onClick, variant = 'outline' }: ButtonProps) {
  const buttonClasses = variant === 'outline'
    ? "relative md:px-12 px-8 py-3 border-1 border-[#DCC898] text-black font-medium tracking-wider text-xs md:text-base uppercase overflow-hidden group"
    : variant === 'inverted'
    ? "relative md:px-12 px-8 py-3 border-1 border-white text-white font-medium tracking-wider text-xs md:text-base uppercase overflow-hidden group"
    : "relative md:px-12 px-8 py-3 bg-[#DCC898] text-white md:text-base text-xs border-1 border-[#DCC898] font-medium tracking-wider uppercase overflow-hidden group";

  const textHoverColor = variant === 'inverted' ? 'group-hover:text-black' : 'group-hover:text-white';
  const bgColor = variant === 'inverted' ? 'bg-white' : 'bg-[#DCC898]';

  const content = (
    <>
      <span className={`relative z-10 ${textHoverColor} transition-colors duration-300`}>
        {text}
      </span>
      <div className={`absolute inset-0 ${bgColor} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out`} />
    </>
  );

  if (href) {
    return (
      <Link href={href}>
        <button className={buttonClasses}>
          {content}
        </button>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={buttonClasses}>
      {content}
    </button>
  );
}
