import Link from "next/link";

export function Logo({ className = "", onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} aria-label="Legends Apparel home" className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className="display text-[22px] leading-none tracking-[-0.04em]">Legends</span>
      <span className="hidden sm:inline serif-accent text-[17px] leading-none text-mute">apparel</span>
    </Link>
  );
}
