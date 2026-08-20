export function Logo({ className = '' }: { className?: string }) {
  return (
    <a href="/" className={`group inline-flex items-center gap-3 ${className}`} aria-label="Be Ther home">
      <img
        src="/WhatsApp_Image_2026-06-28_at_22.46.20_(1).jpeg"
        alt="Be Ther"
        className="h-10 w-auto rounded-xl object-contain transition-transform duration-300 group-hover:scale-105"
        style={{ maxWidth: '72px' }}
      />
    </a>
  );
}
