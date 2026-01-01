import Link from 'next/link';

interface ButtonProps {
  text: string;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'outline';
}

export default function Button({ text, href, onClick, variant = 'outline' }: ButtonProps) {
  const buttonClasses = variant === 'outline'
    ? "relative px-12 py-3 border-2 border-black text-black font-medium tracking-wider uppercase overflow-hidden group"
    : "relative px-12 py-3 bg-black text-white border-2 border-black font-medium tracking-wider uppercase overflow-hidden group";

  const content = (
    <>
      <span className="relative z-10 group-hover:text-white transition-colors duration-300">
        {text}
      </span>
      <div className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
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
