export default function AnnouncementBar() {
  return (
    <div className="w-full bg-[#1a1a1a] text-white text-xs tracking-widest text-center py-1 px-4">
      <span className="md:hidden">Free shipping on all orders &rarr;</span>
      <span className="hidden md:inline">Free shipping on all orders PAN India. International deliveries are subject to additional courier charges. &rarr;</span>
    </div>
  );
}
