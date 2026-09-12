"use client";

import { useEffect, useState } from "react";
import { subscribeScroll } from "@/lib/scrollStore";
import { roomAtProgress } from "@/lib/videoTimeline";
import { openCallModal } from "@/lib/callModalBus";

const LINKS = [
  { href: "#living", label: "Home" },
  { href: "#studio-section", label: "Studio" },
  { href: "#projects-section", label: "Projects" },
  { href: "#contact-section", label: "Contact" },
];

export default function Navigation() {
  const [room, setRoom] = useState("Entry");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    return subscribeScroll((s) => {
      setRoom(roomAtProgress(s.progress).label);
    });
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 mix-blend-difference">
      <div className="flex items-center justify-between px-6 py-6 sm:px-10">
        <a href="#top" className="font-body text-[13px] uppercase tracking-widest2 text-white">
          Interior Studio
        </a>

        <nav className="hidden gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-body text-[12px] uppercase tracking-widest2 text-white/80 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <span className="hidden font-body text-[11px] uppercase tracking-widest2 text-white/60 sm:inline">
            {room}
          </span>
          <button
            onClick={openCallModal}
            className="hidden rounded-full border border-white/40 px-4 py-1.5 font-body text-[11px] uppercase tracking-widest2 text-white transition-colors hover:bg-white hover:text-stone-900 md:inline-block"
          >
            Book a call
          </button>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <span
              className="h-px w-5 bg-white transition-transform"
              style={{ transform: open ? "translateY(3px) rotate(45deg)" : "none" }}
            />
            <span
              className="h-px w-5 bg-white transition-transform"
              style={{ transform: open ? "translateY(-3px) rotate(-45deg)" : "none" }}
            />
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 px-6 pb-6 md:hidden">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-2 font-body text-sm uppercase tracking-widest2 text-white/80"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
