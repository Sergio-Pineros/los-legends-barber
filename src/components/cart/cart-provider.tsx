"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartPayload } from "@/lib/cart";

type CartContextValue = {
  cart: CartPayload;
  loading: boolean;
  pending: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (variantId: number, quantity?: number) => Promise<boolean>;
  update: (lineId: number, quantity: number) => Promise<void>;
  remove: (lineId: number) => Promise<void>;
};

const EMPTY: CartPayload = { items: [], count: 0, subtotal: 0, checkoutUrl: null };
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartPayload>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/cart", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: CartPayload) => {
        if (!cancelled) setCart(data);
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const mutate = useCallback(async (input: RequestInfo, init?: RequestInit) => {
    setPending(true);
    try {
      const res = await fetch(input, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) } });
      if (!res.ok) return false;
      setCart((await res.json()) as CartPayload);
      return true;
    } catch {
      return false;
    } finally {
      setPending(false);
    }
  }, []);

  const add = useCallback(
    async (variantId: number, quantity = 1) => {
      const ok = await mutate("/api/cart", { method: "POST", body: JSON.stringify({ variantId, quantity }) });
      if (ok) setIsOpen(true);
      return ok;
    },
    [mutate],
  );

  const update = useCallback(
    async (lineId: number, quantity: number) => {
      await mutate("/api/cart", { method: "PATCH", body: JSON.stringify({ lineId, quantity }) });
    },
    [mutate],
  );

  const remove = useCallback(
    async (lineId: number) => {
      await mutate(`/api/cart?lineId=${lineId}`, { method: "DELETE" });
    },
    [mutate],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      loading,
      pending,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      update,
      remove,
    }),
    [cart, loading, pending, isOpen, add, update, remove],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
