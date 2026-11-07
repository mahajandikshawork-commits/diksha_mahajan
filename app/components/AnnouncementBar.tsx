import LogoLoop, { LogoItem } from './LogoLoop';

export default function AnnouncementBar() {
  const messages: LogoItem[] = [
    { node: <span>Free shipping on all orders PAN India</span> },
    { node: <span className="text-[#DCC898]">&bull;</span> },
    { node: <span>International deliveries are subject to additional courier charges</span> },
    { node: <span className="text-[#DCC898]">&bull;</span> },
  ];

  return (
    <div className="w-full border-t border-white/10 bg-white/[0.04] text-white text-xs tracking-widest py-1.5">
      <LogoLoop
        logos={messages}
        speed={70}
        direction="left"
        logoHeight={12}
        gap={40}
        ariaLabel="Announcements"
      />
    </div>
  );
}
