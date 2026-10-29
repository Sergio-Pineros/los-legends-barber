"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Review } from "@/lib/reviews";

const AUTO_MS = 5500;
const RESUME_AFTER_TOUCH_MS = 7000;
const AVATAR_COLORS = ["#5b6b4f", "#6b4f5b", "#4f5b6b", "#7a5c3a", "#3f6464", "#5e4f7a", "#7a3f3f", "#4a6a4a"];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

function Stars({ count }: { count: number }) {
  return (
    <span className="flex gap-0.5 text-star" aria-label={`${count} out of 5 stars`} role="img">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 20 20" aria-hidden fill={i < count ? "currentColor" : "none"} stroke="currentColor">
          <path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8L10 1.6z" />
        </svg>
      ))}
    </span>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <article
      aria-roledescription="slide"
      aria-label={`Review ${index + 1}: ${review.name}`}
      className="relative shrink-0 w-[84vw] max-w-[400px] sm:w-[380px] rounded-[24px] bg-card border border-white/[0.04] p-6 sm:p-7 overflow-hidden flex flex-col"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-1 -top-6 font-serif text-[200px] leading-none text-white/[0.06] select-none"
      >
        &ldquo;
      </span>
      <header className="relative flex items-center gap-3.5">
        <span
          aria-hidden
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[15px] font-semibold text-white"
          style={{ background: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
        >
          {initials(review.name)}
        </span>
        <div className="min-w-0">
          <p className="text-[17px] font-medium leading-tight text-ink truncate">{review.name}</p>
          <p className="mt-0.5 text-[13px] text-mute truncate">{review.meta}</p>
        </div>
      </header>
      <div className="relative mt-4 flex items-center gap-3">
        <Stars count={review.rating} />
        <span className="text-[13px] text-mute">{review.when}</span>
      </div>
      {review.price && <p className="relative mt-3 text-[13px] text-mute">{review.price}</p>}
      <p className="relative mt-3 text-[16px] leading-relaxed text-ink-soft">{review.text}</p>
    </article>
  );
}

export function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const pausedRef = useRef(false);
  const visibleRef = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const slides = useCallback(() => Array.from(trackRef.current?.children ?? []) as HTMLElement[], []);

  const scrollToIndex = useCallback(
    (i: number) => {
      const track = trackRef.current;
      const el = slides()[i];
      if (!track || !el) return;
      const centered = window.matchMedia("(max-width: 639px)").matches;
      const target = centered
        ? el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2
        : el.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft || "0");
      track.scrollTo({ left: Math.max(0, target), behavior: reduced ? "auto" : "smooth" });
    },
    [reduced, slides],
  );

  // Track which slide is active from the scroll position.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const items = slides();
        const max = track.scrollWidth - track.clientWidth;
        let idx = 0;
        if (track.scrollLeft >= max - 4) {
          idx = items.length - 1;
        } else {
          const mid = track.scrollLeft + track.clientWidth / 2;
          const centered = window.matchMedia("(max-width: 639px)").matches;
          let best = Infinity;
          items.forEach((el, i) => {
            const ref = centered
              ? el.offsetLeft + el.offsetWidth / 2 - mid
              : el.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft || "0") - track.scrollLeft;
            if (Math.abs(ref) < best) {
              best = Math.abs(ref);
              idx = i;
            }
          });
        }
        activeRef.current = idx;
        setActive(idx);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      track.removeEventListener("scroll", onScroll);
    };
  }, [slides]);

  // Only auto-advance while on screen.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const io = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
    }, { threshold: 0.4 });
    io.observe(track);
    return () => io.disconnect();
  }, []);

  // Auto-advance (disabled for reduced motion).
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      if (pausedRef.current || !visibleRef.current || document.hidden) return;
      const n = slides().length;
      if (n < 2) return;
      scrollToIndex((activeRef.current + 1) % n);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [reduced, scrollToIndex, slides]);

  const pause = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    pausedRef.current = true;
  };
  const resumeLater = (ms = 0) => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      pausedRef.current = false;
    }, ms);
  };
  useEffect(() => () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  const go = (delta: number) => {
    const n = slides().length;
    scrollToIndex((activeRef.current + delta + n) % n);
  };

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer reviews"
      onPointerEnter={(e) => e.pointerType === "mouse" && pause()}
      onPointerLeave={(e) => e.pointerType === "mouse" && resumeLater(0)}
      onTouchStart={pause}
      onTouchEnd={() => resumeLater(RESUME_AFTER_TOUCH_MS)}
      onFocus={pause}
      onBlur={() => resumeLater(RESUME_AFTER_TOUCH_MS)}
    >
      <div
        ref={trackRef}
        className="review-track no-scrollbar relative flex items-stretch gap-4 overflow-x-auto px-[8vw] sm:px-8 lg:px-[max(3rem,calc((100vw-1600px)/2+3rem))] [--track-pad:8vw] sm:[--track-pad:2rem] lg:[--track-pad:max(3rem,calc((100vw-1600px)/2+3rem))] py-2"
      >
        {reviews.map((r, i) => (
          <ReviewCard key={r.name} review={r} index={i} />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous review"
          className="pressable hidden sm:grid h-11 w-11 place-items-center rounded-full border border-line-strong text-ink-soft hover:text-ink hover:border-ink transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M10 3L5 8l5 5" />
          </svg>
        </button>
        <div className="flex items-center" role="group" aria-label="Choose review">
          {reviews.map((r, i) => (
            <button
              key={r.name}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Show review ${i + 1} of ${reviews.length}`}
              aria-current={i === active ? "true" : undefined}
              className="grid h-11 w-6 place-items-center"
            >
              <span
                className={`block h-2 w-2 rounded-full border transition-colors duration-300 ${
                  i === active ? "bg-ink border-ink" : "bg-transparent border-ink/50"
                }`}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next review"
          className="pressable hidden sm:grid h-11 w-11 place-items-center rounded-full border border-line-strong text-ink-soft hover:text-ink hover:border-ink transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M6 3l5 5-5 5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
