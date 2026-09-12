"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    if (!dot) return;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const render = () => {
      gsap.set(dot, { x: pos.x, y: pos.y });
    };
    const move = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
    };
    gsap.ticker.add(render);
    window.addEventListener("pointermove", move);

    const onEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      const label = target.closest<HTMLElement>("[data-cursor]");
      if (!label) return;
      gsap.to(dot, { scale: 2.8, duration: 0.35, ease: "power3.out" });
      if (labelRef.current) labelRef.current.textContent = label.dataset.cursor ?? "VIEW";
      gsap.to(labelRef.current, { opacity: 1, duration: 0.25 });
    };
    const onLeave = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-cursor]")) return;
      gsap.to(dot, { scale: 1, duration: 0.35, ease: "power3.out" });
      gsap.to(labelRef.current, { opacity: 0, duration: 0.2 });
    };

    document.addEventListener("pointerover", onEnter);
    document.addEventListener("pointerout", onLeave);

    return () => {
      gsap.ticker.remove(render);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", onEnter);
      document.removeEventListener("pointerout", onLeave);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-stone-900 mix-blend-difference md:flex"
    >
      <span
        ref={labelRef}
        className="absolute font-body text-[9px] uppercase tracking-widest2 text-white opacity-0"
        style={{ transform: "scale(0.36)" }}
      >
        VIEW
      </span>
    </div>
  );
}
