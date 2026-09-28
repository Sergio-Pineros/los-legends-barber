export function AnnouncementBar() {
  const items = ["Made To Inspire", "Lifestyle Clothing", "Cut Different", "Los Angeles · Est. 2022"];
  return (
    <div className="bg-ink text-canvas overflow-hidden h-9 flex items-center">
      <div className="flex whitespace-nowrap animate-marquee will-change-transform">
        {[0, 1].map((rep) => (
          <div key={rep} className="flex shrink-0" aria-hidden={rep === 1}>
            {[...items, ...items].map((t, i) => (
              <span key={`${rep}-${i}`} className="eyebrow px-8 text-[10px] tracking-[0.28em] flex items-center gap-8">
                {t}
                <span className="h-1 w-1 rounded-full bg-canvas/60" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
