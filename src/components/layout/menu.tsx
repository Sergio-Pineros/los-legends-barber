"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { MENU_LINKS, SITE_TAGLINE } from "@/lib/site";

type MenuCtx = {
  isOpen: boolean;
  openMenu: (trigger: HTMLElement | null) => void;
  closeMenu: () => void;
};

const Ctx = createContext<MenuCtx | null>(null);

export function useMenu() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMenu must be used inside <MenuProvider>");
  return ctx;
}

export function MenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  const openMenu = useCallback((trigger: HTMLElement | null) => {
    triggerRef.current = trigger;
    const box = boxRef.current;
    if (trigger && box) {
      // Anchor the panel's transform origin on the trigger so it grows out of it
      // and collapses back into it along the same path.
      const t = trigger.getBoundingClientRect();
      const b = box.getBoundingClientRect();
      setOrigin({ x: t.left + t.width / 2 - b.left, y: t.top + t.height / 2 - b.top });
    }
    setOpen(true);
  }, []);

  const closeMenu = useCallback(() => setOpen(false), []);

  // Close when the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Scroll lock, focus management, Esc + focus trap.
  useEffect(() => {
    if (!isOpen) return;
    const body = document.body;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    const panel = panelRef.current;
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    const raf = requestAnimationFrame(() => focusables()[0]?.focus({ preventScroll: true }));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panel?.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !panel?.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    const trigger = triggerRef.current;
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
      trigger?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  const value = useMemo(() => ({ isOpen, openMenu, closeMenu }), [isOpen, openMenu, closeMenu]);

  const panelStyle = (origin
    ? { "--menu-ox": `${origin.x}px`, "--menu-oy": `${origin.y}px`, "--menu-dy": "0px" }
    : {}) as CSSProperties;

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className={`fixed inset-0 z-[90] ${isOpen ? "" : "pointer-events-none"}`} aria-hidden={!isOpen}>
        <div
          data-open={isOpen}
          onClick={closeMenu}
          className="menu-backdrop absolute inset-0 bg-black/55 backdrop-blur-[3px]"
        />
        <div className="absolute inset-0 flex items-end sm:items-center justify-center p-3 sm:p-6 pointer-events-none">
          <div ref={boxRef} className="w-full sm:max-w-[440px]">
            <div
              ref={panelRef}
              id="site-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              data-open={isOpen}
              inert={!isOpen}
              style={panelStyle}
              className={`menu-panel rounded-[28px] bg-black border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] px-6 pt-9 pb-5 text-center ${
                isOpen ? "pointer-events-auto" : ""
              }`}
            >
              <nav aria-label="Primary">
                <ul className="flex flex-col items-center">
                  {MENU_LINKS.map((link, i) => {
                    const active = pathname === link.href;
                    return (
                      <li key={link.href} className="menu-item w-full" style={{ "--i": i } as CSSProperties}>
                        <Link
                          href={link.href}
                          onClick={closeMenu}
                          aria-current={active ? "page" : undefined}
                          className={`pressable inline-flex min-h-[52px] items-center justify-center px-6 font-serif text-[30px] leading-none tracking-[-0.01em] transition-colors ${
                            active ? "text-ink" : "text-ink/80 hover:text-ink"
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              <p
                className="menu-item mt-6 font-serif italic text-[17px] text-gold/90"
                style={{ "--i": MENU_LINKS.length } as CSSProperties}
              >
                {SITE_TAGLINE}
              </p>
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close menu"
                className="menu-item pressable mt-4 mx-auto grid h-12 w-12 place-items-center rounded-full text-ink/80 hover:text-ink hover:bg-white/5 transition-colors"
                style={{ "--i": MENU_LINKS.length + 1 } as CSSProperties}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M2 2l12 12M14 2L2 14" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Ctx.Provider>
  );
}

export function MenuTrigger({ className = "", large = false }: { className?: string; large?: boolean }) {
  const { isOpen, openMenu } = useMenu();
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls="site-menu"
      onClick={(e) => openMenu(e.currentTarget)}
      className={`pressable inline-flex items-center justify-center gap-3 min-h-11 min-w-11 uppercase text-ink ${
        large ? "gap-5 px-6 text-[15px] tracking-[0.42em]" : "px-2 text-[11px] tracking-[0.28em] font-semibold"
      } ${className}`}
    >
      <span aria-hidden className={`flex flex-col ${large ? "gap-[7px]" : "gap-[5px]"}`}>
        <span className={`block h-[1.5px] bg-current ${large ? "w-7" : "w-5"}`} />
        <span className={`block h-[1.5px] bg-current ${large ? "w-7" : "w-5"}`} />
      </span>
      <span className={large ? "mr-[-0.42em]" : "sr-only sm:not-sr-only"}>Menu</span>
    </button>
  );
}
