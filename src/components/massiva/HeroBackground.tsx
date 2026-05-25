export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "var(--grad-hero)" }} />
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/30 blur-3xl animate-blob" />
      <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-info/25 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-success/20 blur-3xl animate-blob" style={{ animationDelay: "6s" }} />
      <svg className="absolute inset-0 h-full w-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}
