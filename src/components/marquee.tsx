export function Marquee({
  items,
  className = "",
  textClass = "display text-[11vw] sm:text-[7vw] leading-none",
}: {
  items: string[];
  className?: string;
  textClass?: string;
}) {
  return (
    <div className={`overflow-hidden select-none ${className}`} aria-hidden>
      <div className="flex whitespace-nowrap animate-marquee will-change-transform">
        {[0, 1].map((rep) => (
          <div key={rep} className="flex shrink-0 items-center">
            {items.map((t, i) => (
              <span key={`${rep}-${i}`} className={`${textClass} px-6 sm:px-10 flex items-center gap-6 sm:gap-10`}>
                {t}
                <span className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-navy inline-block" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
