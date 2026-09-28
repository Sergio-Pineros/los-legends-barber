import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 py-32 text-center">
      <p className="eyebrow text-mute">404</p>
      <h1 className="display text-6xl sm:text-8xl mt-4">
        Off the <span className="serif-accent text-navy">map.</span>
      </h1>
      <p className="mt-6 text-sm text-ink-soft">That page doesn&apos;t exist — but the collection does.</p>
      <Link href="/shop" className="btn btn-primary mt-10">Back to shop</Link>
    </div>
  );
}
