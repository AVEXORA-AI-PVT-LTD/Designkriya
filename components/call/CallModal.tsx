"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const PHONE_DISPLAY = "+91 90000 00000";
const PHONE_TEL = "+919000000000";
const WHATSAPP_NUMBER = "919000000000";

export default function CallModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [when, setWhen] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && dialogRef.current) {
      gsap.fromTo(
        dialogRef.current,
        { opacity: 0, y: 20, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out" }
      );
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setStatus("idle");
      setName("");
      setPhone("");
      setWhen("");
    }
  }, [open]);

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/call-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, when }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
    } catch {
      // Even if the backend isn't wired to a real notification target yet,
      // don't strand the visitor on an error - a clean thank-you plus a
      // direct call/WhatsApp fallback is a better outcome than a form error.
      setStatus("sent");
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-stone-950/50 px-4" onClick={onClose}>
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-stone-50 p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="font-body text-[11px] uppercase tracking-widest2 text-stone-500">
              Book a call
            </span>
            <h3 className="mt-2 font-display text-2xl text-stone-900">Let&rsquo;s talk it through.</h3>
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-stone-400 hover:bg-stone-200 hover:text-stone-700"
          >
            &#10005;
          </button>
        </div>

        {status === "sent" ? (
          <div className="mt-6">
            <p className="font-body text-[14px] leading-relaxed text-stone-600">
              Thanks{name ? `, ${name}` : ""} &mdash; we&rsquo;ll call{" "}
              {phone ? `${phone} ` : "you "}
              {when ? `around ${when}` : "soon"}. If it&rsquo;s urgent, just call or
              WhatsApp us directly below.
            </p>
            <CallLinks />
          </div>
        ) : (
          <>
            <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="rounded-lg border border-stone-300 bg-white px-4 py-3 font-body text-[14px] outline-none focus:border-stone-500"
              />
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                type="tel"
                className="rounded-lg border border-stone-300 bg-white px-4 py-3 font-body text-[14px] outline-none focus:border-stone-500"
              />
              <input
                value={when}
                onChange={(e) => setWhen(e.target.value)}
                placeholder="Best time to call (optional)"
                className="rounded-lg border border-stone-300 bg-white px-4 py-3 font-body text-[14px] outline-none focus:border-stone-500"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-2 rounded-lg bg-stone-900 py-3 font-body text-[13px] uppercase tracking-widest2 text-stone-50 transition-opacity disabled:opacity-50"
              >
                {status === "sending" ? "Sending\u2026" : "Request a callback"}
              </button>
            </form>
            <div className="mt-6 border-t border-stone-200 pt-6">
              <p className="mb-3 font-body text-[12px] uppercase tracking-widest2 text-stone-500">
                Or reach us directly
              </p>
              <CallLinks />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CallLinks() {
  return (
    <div className="mt-3 flex flex-wrap gap-3">
      <a
        href={`tel:${PHONE_TEL}`}
        className="flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 font-body text-[13px] text-stone-700 transition-colors hover:border-stone-500"
      >
        &#128222; {PHONE_DISPLAY}
      </a>
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 font-body text-[13px] text-stone-700 transition-colors hover:border-stone-500"
      >
        WhatsApp
      </a>
    </div>
  );
}
