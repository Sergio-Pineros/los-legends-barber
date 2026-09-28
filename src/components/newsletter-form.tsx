"use client";

import { useState, type FormEvent } from "react";

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus("done");
      setMessage("You're on the list.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const border = dark ? "border-canvas/30 focus-within:border-canvas" : "border-ink/30 focus-within:border-ink";
  const text = dark ? "text-canvas placeholder:text-canvas/40" : "text-ink placeholder:text-mute";

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className={`flex items-center border-b ${border} transition-colors`}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          aria-label="Email address"
          className={`flex-1 bg-transparent py-4 text-sm outline-none ${text}`}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={`eyebrow text-[11px] pl-4 py-4 transition-opacity disabled:opacity-40 ${dark ? "text-canvas" : "text-ink"}`}
        >
          {status === "loading" ? "Sending…" : "Subscribe →"}
        </button>
      </div>
      <p
        aria-live="polite"
        className={`mt-3 text-xs h-4 ${status === "error" ? "text-red-500" : dark ? "text-canvas/60" : "text-mute"}`}
      >
        {message}
      </p>
    </form>
  );
}
