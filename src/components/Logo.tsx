export function Logo({ className = '' }: { className?: string }) {
  return (
    <a href="/" className={`group inline-flex items-center ${className}`} aria-label="Be Ther home">
      <span className="relative block h-10 w-24 overflow-hidden rounded-xl">
        <img
          src="/WhatsApp_Image_2026-06-28_at_22.46.20_(1).jpeg"
          alt="Be Ther"
          className="absolute left-[-5px] top-[-5px] w-[97px] max-w-none transition-transform duration-300 group-hover:scale-105"
        />
      </span>
    </a>
  );
}
